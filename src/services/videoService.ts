/**
 * Video Management Service
 * Handles video storage, retrieval, caching, and local upload management
 */

export interface VideoFile {
  id: string;
  name: string;
  size: number;
  duration?: number;
  uploadedAt: number;
  localPath?: string;
  remoteUrl?: string;
  drillId?: string;
  trackId?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface VideoLibrary {
  videos: VideoFile[];
  totalSize: number;
  lastUpdated: number;
}

const STORAGE_KEY = 'anchor_video_library';
const MAX_LOCAL_STORAGE = 50 * 1024 * 1024; // 50MB limit
const VIDEO_CACHE_PREFIX = 'video_';

class VideoService {
  /**
   * Get all videos in the library
   */
  getVideoLibrary(): VideoLibrary {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('[VideoService] Failed to load video library:', error);
    }
    return { videos: [], totalSize: 0, lastUpdated: Date.now() };
  }

  /**
   * Save video library to storage
   */
  private saveLibrary(library: VideoLibrary): void {
    try {
      library.lastUpdated = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    } catch (error) {
      console.error('[VideoService] Failed to save video library:', error);
      throw new Error('Failed to save video library: storage limit may be exceeded');
    }
  }

  /**
   * Get video by ID
   */
  getVideo(videoId: string): VideoFile | null {
    const library = this.getVideoLibrary();
    return library.videos.find(v => v.id === videoId) || null;
  }

  /**
   * Get videos for a specific drill
   */
  getVideosByDrill(drillId: string): VideoFile[] {
    const library = this.getVideoLibrary();
    return library.videos.filter(v => v.drillId === drillId);
  }

  /**
   * Get videos for a specific track
   */
  getVideosByTrack(trackId: string): VideoFile[] {
    const library = this.getVideoLibrary();
    return library.videos.filter(v => v.trackId === trackId);
  }

  /**
   * Get videos by difficulty level
   */
  getVideosByDifficulty(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): VideoFile[] {
    const library = this.getVideoLibrary();
    return library.videos.filter(v => v.difficulty === difficulty);
  }

  /**
   * Upload a video file (converts to Blob and stores metadata)
   */
  async uploadVideo(
    file: File,
    metadata: {
      drillId?: string;
      trackId?: string;
      difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    }
  ): Promise<VideoFile> {
    const library = this.getVideoLibrary();
    const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Check storage capacity
    if (library.totalSize + file.size > MAX_LOCAL_STORAGE) {
      throw new Error(
        `Storage limit exceeded. Current: ${(library.totalSize / 1024 / 1024).toFixed(2)}MB, ` +
        `Need: ${(file.size / 1024 / 1024).toFixed(2)}MB, ` +
        `Limit: 50MB`
      );
    }

    // Create video metadata
    const videoFile: VideoFile = {
      id: videoId,
      name: file.name,
      size: file.size,
      uploadedAt: Date.now(),
      drillId: metadata.drillId,
      trackId: metadata.trackId,
      difficulty: metadata.difficulty,
    };

    // Store file blob in IndexedDB or FileSystem API (if available)
    try {
      await this.storeVideoBlob(videoId, file);
      videoFile.localPath = `/videos/local/${videoId}`;

      // Update library
      library.videos.push(videoFile);
      library.totalSize += file.size;
      this.saveLibrary(library);

      console.log('[VideoService] Video uploaded successfully:', videoId);
      return videoFile;
    } catch (error) {
      console.error('[VideoService] Failed to upload video:', error);
      throw new Error('Failed to upload video file');
    }
  }

  /**
   * Store video blob using IndexedDB
   */
  private async storeVideoBlob(videoId: string, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open('AnchorVideoDB', 1);

        request.onerror = () => reject(new Error('Failed to open IndexedDB'));

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('videos')) {
            db.createObjectStore('videos', { keyPath: 'id' });
          }
        };

        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['videos'], 'readwrite');
          const store = transaction.objectStore('videos');

          store.put({ id: videoId, blob: file });

          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(new Error('Failed to store video blob'));
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get video blob from storage
   */
  async getVideoBlob(videoId: string): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open('AnchorVideoDB', 1);

        request.onerror = () => reject(new Error('Failed to open IndexedDB'));

        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['videos'], 'readonly');
          const store = transaction.objectStore('videos');
          const getRequest = store.get(videoId);

          getRequest.onsuccess = () => {
            const result = getRequest.result;
            resolve(result ? result.blob : null);
          };

          getRequest.onerror = () => resolve(null);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Link remote video URL (from public/videos folder or external URL)
   */
  async linkRemoteVideo(
    url: string,
    metadata: {
      name: string;
      drillId?: string;
      trackId?: string;
      difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    }
  ): Promise<VideoFile> {
    const library = this.getVideoLibrary();
    const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Validate URL is accessible
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok && response.status !== 405) {
        throw new Error(`URL not accessible: ${response.status}`);
      }
    } catch (error) {
      console.warn('[VideoService] Could not verify URL, proceeding anyway:', error);
    }

    const videoFile: VideoFile = {
      id: videoId,
      name: metadata.name,
      size: 0,
      uploadedAt: Date.now(),
      remoteUrl: url,
      drillId: metadata.drillId,
      trackId: metadata.trackId,
      difficulty: metadata.difficulty,
    };

    library.videos.push(videoFile);
    this.saveLibrary(library);

    return videoFile;
  }

  /**
   * Delete a video
   */
  deleteVideo(videoId: string): void {
    const library = this.getVideoLibrary();
    const video = library.videos.find(v => v.id === videoId);

    if (video) {
      library.videos = library.videos.filter(v => v.id !== videoId);
      library.totalSize -= video.size;
      this.saveLibrary(library);

      // Delete from IndexedDB
      if (video.localPath) {
        this.deleteVideoBlob(videoId).catch(err =>
          console.warn('[VideoService] Failed to delete video blob:', err)
        );
      }
    }
  }

  /**
   * Delete video blob from IndexedDB
   */
  private async deleteVideoBlob(videoId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open('AnchorVideoDB', 1);

        request.onerror = () => reject(new Error('Failed to open IndexedDB'));

        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['videos'], 'readwrite');
          const store = transaction.objectStore('videos');
          store.delete(videoId);

          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(new Error('Failed to delete video blob'));
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get video URL (local or remote)
   */
  async getVideoUrl(videoId: string): Promise<string | null> {
    const video = this.getVideo(videoId);
    if (!video) return null;

    // If remote URL, return directly
    if (video.remoteUrl) {
      return video.remoteUrl;
    }

    // If local, create blob URL
    if (video.localPath) {
      try {
        const blob = await this.getVideoBlob(videoId);
        if (blob) {
          return URL.createObjectURL(blob);
        }
      } catch (error) {
        console.error('[VideoService] Failed to get video blob:', error);
      }
    }

    return null;
  }

  /**
   * Get storage usage info
   */
  getStorageInfo(): { used: number; limit: number; percentage: number } {
    const library = this.getVideoLibrary();
    return {
      used: library.totalSize,
      limit: MAX_LOCAL_STORAGE,
      percentage: (library.totalSize / MAX_LOCAL_STORAGE) * 100,
    };
  }

  /**
   * Clear all videos
   */
  clearAllVideos(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      const request = indexedDB.deleteDatabase('AnchorVideoDB');
      request.onerror = () => console.warn('[VideoService] Failed to clear IndexedDB');
      console.log('[VideoService] All videos cleared');
    } catch (error) {
      console.error('[VideoService] Failed to clear videos:', error);
    }
  }

  /**
   * Export videos metadata
   */
  exportLibrary(): string {
    const library = this.getVideoLibrary();
    return JSON.stringify(library, null, 2);
  }

  /**
   * Import videos metadata
   */
  importLibrary(jsonData: string): void {
    try {
      const library = JSON.parse(jsonData) as VideoLibrary;
      this.saveLibrary(library);
      console.log('[VideoService] Library imported successfully');
    } catch (error) {
      console.error('[VideoService] Failed to import library:', error);
      throw new Error('Invalid library format');
    }
  }
}

export const videoService = new VideoService();
