import { useState, useEffect, useCallback } from 'react';
import { videoService, VideoFile, VideoLibrary } from '../services/videoService';

/**
 * Hook to manage video library and operations
 */
export const useVideo = () => {
  const [library, setLibrary] = useState<VideoLibrary>(videoService.getVideoLibrary());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshLibrary = useCallback(() => {
    const updated = videoService.getVideoLibrary();
    setLibrary(updated);
  }, []);

  const uploadVideo = useCallback(
    async (
      file: File,
      metadata: {
        drillId?: string;
        trackId?: string;
        difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const video = await videoService.uploadVideo(file, metadata);
        refreshLibrary();
        return video;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to upload video';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshLibrary]
  );

  const linkRemoteVideo = useCallback(
    async (
      url: string,
      metadata: {
        name: string;
        drillId?: string;
        trackId?: string;
        difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const video = await videoService.linkRemoteVideo(url, metadata);
        refreshLibrary();
        return video;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to link video';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshLibrary]
  );

  const deleteVideo = useCallback(
    (videoId: string) => {
      try {
        videoService.deleteVideo(videoId);
        refreshLibrary();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete video';
        setError(message);
        throw err;
      }
    },
    [refreshLibrary]
  );

  const getVideoUrl = useCallback(async (videoId: string): Promise<string | null> => {
    try {
      return await videoService.getVideoUrl(videoId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get video URL';
      setError(message);
      return null;
    }
  }, []);

  const getVideosByDrill = useCallback((drillId: string): VideoFile[] => {
    return videoService.getVideosByDrill(drillId);
  }, []);

  const getVideosByTrack = useCallback((trackId: string): VideoFile[] => {
    return videoService.getVideosByTrack(trackId);
  }, []);

  const getVideosByDifficulty = useCallback(
    (difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): VideoFile[] => {
      return videoService.getVideosByDifficulty(difficulty);
    },
    []
  );

  const getStorageInfo = useCallback(() => {
    return videoService.getStorageInfo();
  }, []);

  const clearAllVideos = useCallback(() => {
    if (window.confirm('Are you sure you want to delete ALL videos? This cannot be undone.')) {
      try {
        videoService.clearAllVideos();
        refreshLibrary();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to clear videos';
        setError(message);
      }
    }
  }, [refreshLibrary]);

  const exportLibrary = useCallback(() => {
    try {
      const json = videoService.exportLibrary();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `anchor-video-library-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to export library';
      setError(message);
    }
  }, []);

  const importLibrary = useCallback(
    (jsonData: string) => {
      setLoading(true);
      setError(null);

      try {
        videoService.importLibrary(jsonData);
        refreshLibrary();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to import library';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshLibrary]
  );

  return {
    // State
    library,
    loading,
    error,

    // Methods
    refreshLibrary,
    uploadVideo,
    linkRemoteVideo,
    deleteVideo,
    getVideoUrl,
    getVideosByDrill,
    getVideosByTrack,
    getVideosByDifficulty,
    getStorageInfo,
    clearAllVideos,
    exportLibrary,
    importLibrary,

    // Derived state
    videoCount: library.videos.length,
    totalSize: library.totalSize,
    storagePercentage: (library.totalSize / (50 * 1024 * 1024)) * 100,
  };
};

/**
 * Hook to get videos for a specific drill
 */
export const useDrillVideos = (drillId: string) => {
  const { library } = useVideo();
  const videos = library.videos.filter(v => v.drillId === drillId);

  return {
    videos,
    count: videos.length,
    isEmpty: videos.length === 0,
    byDifficulty: {
      beginner: videos.filter(v => v.difficulty === 'Beginner'),
      intermediate: videos.filter(v => v.difficulty === 'Intermediate'),
      advanced: videos.filter(v => v.difficulty === 'Advanced'),
    },
  };
};

/**
 * Hook to get videos for a specific track
 */
export const useTrackVideos = (trackId: string) => {
  const { library } = useVideo();
  const videos = library.videos.filter(v => v.trackId === trackId);

  return {
    videos,
    count: videos.length,
    isEmpty: videos.length === 0,
    byDifficulty: {
      beginner: videos.filter(v => v.difficulty === 'Beginner'),
      intermediate: videos.filter(v => v.difficulty === 'Intermediate'),
      advanced: videos.filter(v => v.difficulty === 'Advanced'),
    },
  };
};
