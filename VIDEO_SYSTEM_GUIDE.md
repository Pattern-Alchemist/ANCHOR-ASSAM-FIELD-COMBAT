# ANCHOR Video Management System Guide

Complete guide to the new integrated video management system for ANCHOR combat training.

## Overview

The ANCHOR Video Management System provides a centralized, scalable solution for storing, organizing, and accessing training videos across all drills, skill tracks, and programs. Videos can be uploaded locally or linked from remote sources.

### Key Features

- **Local & Remote Storage** - Upload files or link external URLs
- **Automatic Organization** - Videos linked to specific drills and tracks
- **Smart Caching** - IndexedDB storage for offline access
- **Storage Management** - Real-time usage monitoring with 50MB limit
- **Type Safety** - Full TypeScript support
- **Easy Integration** - Drop-in components and hooks

## Quick Start

### 1. Basic Video Upload (In Your App)

```typescript
import { VideoManager } from './components';

// In your component
<VideoManager 
  drillId="standing-8-counts"
  trackId="muay-thai-engine"
/>
```

### 2. Get Videos for a Drill

```typescript
import { useDrillVideos } from './hooks/useVideo';

function DrillComponent({ drillId }) {
  const { videos, isEmpty } = useDrillVideos(drillId);
  
  return (
    <div>
      {isEmpty ? (
        <p>No videos uploaded yet</p>
      ) : (
        videos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))
      )}
    </div>
  );
}
```

### 3. Play a Video

```typescript
import { VideoPlayer } from './components';
import { useVideo } from './hooks/useVideo';

function VideoView({ videoId }) {
  const { getVideoUrl } = useVideo();
  const [url, setUrl] = useState<string | null>(null);
  
  useEffect(() => {
    getVideoUrl(videoId).then(setUrl);
  }, [videoId]);
  
  if (!url) return <div>Loading...</div>;
  
  return <VideoPlayer videoUrl={url} />;
}
```

## Architecture

### Service Layer (`videoService.ts`)

Core service managing all video operations.

```typescript
// Upload a video file
await videoService.uploadVideo(file, {
  drillId: 'drill-id',
  trackId: 'track-id',
  difficulty: 'Intermediate'
});

// Link a remote video
await videoService.linkRemoteVideo('https://...', {
  name: 'Video Name',
  drillId: 'drill-id'
});

// Get videos for drill
const videos = videoService.getVideosByDrill('drill-id');

// Get videos for track
const videos = videoService.getVideosByTrack('track-id');

// Get video by difficulty
const videos = videoService.getVideosByDifficulty('Intermediate');

// Get video URL (works for local & remote)
const url = await videoService.getVideoUrl(videoId);

// Delete video
videoService.deleteVideo(videoId);

// Storage info
const { used, limit, percentage } = videoService.getStorageInfo();

// Export/Import
const json = videoService.exportLibrary();
videoService.importLibrary(json);
```

### Hooks (`useVideo.ts`)

React hooks for easy integration.

#### `useVideo()`

Main hook for video management.

```typescript
const {
  // State
  library,        // Full video library
  loading,        // Upload/link in progress
  error,          // Error message if any
  
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
  
  // Derived
  videoCount,           // Total videos
  totalSize,            // Total storage used (bytes)
  storagePercentage     // % of 50MB limit
} = useVideo();
```

#### `useDrillVideos(drillId)`

Get videos for a specific drill.

```typescript
const { videos, count, isEmpty, byDifficulty } = useDrillVideos('drill-123');

// byDifficulty: { beginner: [...], intermediate: [...], advanced: [...] }
```

#### `useTrackVideos(trackId)`

Get videos for a specific skill track.

```typescript
const { videos, count, isEmpty, byDifficulty } = useTrackVideos('muay-thai-engine');
```

### Components

#### `VideoManager`

Complete UI for uploading and managing videos.

```typescript
<VideoManager
  drillId="optional-drill-id"      // Filter videos for this drill
  trackId="optional-track-id"      // Filter videos for this track
  onVideoSelect={(video) => {}}    // Callback when video selected
  compact={false}                  // Hide if no videos
/>
```

Features:
- File upload drag & drop
- Remote URL linking
- Storage usage visualization
- Video list with delete
- Error handling and progress

#### `VideoPlayer`

Embedded video player with full controls.

```typescript
<VideoPlayer
  video={videoFile}           // VideoFile object
  videoUrl={videoUrl}         // URL to play
  onClose={() => {}}          // Close callback
  autoPlay={true}             // Auto-play on mount
/>
```

Features:
- Play/pause controls
- Volume and mute
- Fullscreen support
- Progress bar with timestamps
- Auto-hide controls on video play

## Storage System

### How It Works

1. **Local Storage** - Metadata stored in localStorage (video library index)
2. **IndexedDB** - Large file blobs stored in IndexedDB (up to 50MB)
3. **Remote URLs** - Links stored in metadata, streamed on demand

### Storage Limits

```
Local Storage:   1-5 MB  (metadata, JSON)
IndexedDB:       50 MB   (video files)
Total:           ~50 MB  per browser instance
```

### Storage Info

```typescript
const { used, limit, percentage } = videoService.getStorageInfo();

// Example output:
// { 
//   used: 25165824,        // 24 MB
//   limit: 52428800,       // 50 MB
//   percentage: 48         // 48% full
// }
```

### Cleanup

```typescript
// Delete single video
videoService.deleteVideo(videoId);

// Clear all videos
videoService.clearAllVideos();
```

## Video Organization

### Folder Structure (public/videos/)

```
skill-tracks/
├── muay-thai-engine/
├── blade-mastery/
├── lone-survivor/
├── land-warrior/
└── conditioning-core/

striking-drills/
├── beginner/
├── intermediate/
└── advanced/

grapple-drills/
├── beginner/
├── intermediate/
└── advanced/

integration-scenarios/
core-conditioning/
```

### Metadata Structure

```typescript
interface VideoFile {
  id: string;                                              // Unique ID
  name: string;                                            // Display name
  size: number;                                            // File size in bytes
  duration?: number;                                       // Duration in seconds
  uploadedAt: number;                                      // Timestamp
  localPath?: string;                                      // Local storage path
  remoteUrl?: string;                                      // Remote URL
  drillId?: string;                                        // Associated drill
  trackId?: string;                                        // Associated track
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';   // Difficulty level
}
```

## Implementation Examples

### Example 1: Skill Track with Videos

```typescript
import { useTrackVideos } from './hooks/useVideo';
import { VideoManager, VideoPlayer } from './components';
import { useState } from 'react';

function SkillTrackPage({ trackId }) {
  const { videos, count } = useTrackVideos(trackId);
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div>
      <h2>Skill Track Videos ({count})</h2>
      
      <VideoManager trackId={trackId} />
      
      <div className="video-list">
        {videos.map(video => (
          <div key={video.id} onClick={() => setSelectedVideo(video)}>
            <h3>{video.name}</h3>
            <p>{video.difficulty}</p>
          </div>
        ))}
      </div>
      
      {selectedVideo && (
        <VideoPlayer 
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
```

### Example 2: Drill with Video Instructions

```typescript
import { useDrillVideos } from './hooks/useVideo';
import { VideoManager } from './components';

function DrillDetail({ drillId }) {
  const { byDifficulty, isEmpty } = useDrillVideos(drillId);

  return (
    <div>
      <h3>Drill Instructions</h3>
      
      {isEmpty ? (
        <VideoManager drillId={drillId} />
      ) : (
        <div>
          <h4>Beginner ({byDifficulty.beginner.length})</h4>
          {byDifficulty.beginner.map(v => (
            <VideoThumbnail key={v.id} video={v} />
          ))}
          
          <h4>Intermediate ({byDifficulty.intermediate.length})</h4>
          {byDifficulty.intermediate.map(v => (
            <VideoThumbnail key={v.id} video={v} />
          ))}
          
          <h4>Advanced ({byDifficulty.advanced.length})</h4>
          {byDifficulty.advanced.map(v => (
            <VideoThumbnail key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Example 3: Video Admin Panel

```typescript
import { useVideo } from './hooks/useVideo';

function VideoAdmin() {
  const {
    library,
    storagePercentage,
    exportLibrary,
    clearAllVideos
  } = useVideo();

  return (
    <div>
      <h2>Video Management</h2>
      
      <div>
        <p>Total Videos: {library.videos.length}</p>
        <p>Storage: {storagePercentage.toFixed(1)}% of 50MB</p>
      </div>
      
      <table>
        <tbody>
          {library.videos.map(video => (
            <tr key={video.id}>
              <td>{video.name}</td>
              <td>{(video.size / 1024 / 1024).toFixed(1)} MB</td>
              <td>{video.drillId || video.trackId || 'Unassigned'}</td>
              <td>{video.difficulty || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button onClick={exportLibrary}>Export Library</button>
      <button onClick={clearAllVideos}>Clear All Videos</button>
    </div>
  );
}
```

## Video Upload Guide

### Recommended Settings

**For Training Drills (5-15 minutes)**
- Resolution: 1280x720 (HD)
- Bitrate: 2-3 Mbps
- Codec: H.264
- Format: MP4
- Result: 50-150 MB per video

**For Technique Demonstrations (1-5 minutes)**
- Resolution: 1920x1080 (Full HD)
- Bitrate: 4-6 Mbps
- Codec: H.264
- Format: MP4
- Result: 30-150 MB per video

**For Mobile Optimization**
- Resolution: 854x480 (480p)
- Bitrate: 1-2 Mbps
- Codec: H.264
- Format: MP4
- Result: 15-50 MB per video

### Using FFmpeg to Encode

```bash
# Basic training video
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset medium \
  -vf scale=1280:720 -acodec aac -b:a 128k output.mp4

# Mobile optimized
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset fast \
  -vf scale=854:480 -acodec aac -b:a 96k output.mp4

# High quality
ffmpeg -i input.mp4 -vcodec libx264 -crf 18 -preset slow \
  -vf scale=1920:1080 -acodec aac -b:a 192k output.mp4
```

## Troubleshooting

### Video Upload Fails

**Issue:** "Storage limit exceeded"
- Solution: Delete unused videos to free space
- Check: `videoService.getStorageInfo()`

**Issue:** "Failed to store video blob"
- Solution: Clear browser cache and try again
- Check: IndexedDB quota in browser DevTools

**Issue:** File size shown as 0
- Solution: File may be corrupted, re-export video
- Try: Different video format

### Video Won't Play

**Issue:** Blank screen after upload
- Solution: Check video codec compatibility
- Try: Test with MP4 H.264 format

**Issue:** Network error on remote video
- Solution: Check URL is accessible
- Verify: CORS headers on remote server

**Issue:** "File content failed to load"
- Solution: This is usually a network issue
- Try: Refresh page and re-upload
- Check: Browser console for specific errors

### Storage Issues

**Issue:** "50MB limit" warnings
- Solution: Use remote hosting for large videos
- Method: Link URLs instead of uploading
- Alternative: Create lower resolution versions

**Issue:** Videos lost after clearing cache
- Solution: Use local uploads with export
- Backup: Export library regularly

## Performance Tips

1. **Compress Before Upload**
   - Use FFmpeg or HandBrake
   - Target 2-4 Mbps bitrate
   - Reduces storage by 50%+

2. **Use Remote Hosting for Large Files**
   - Upload HD versions to CDN
   - Link via URL instead
   - Saves local storage

3. **Organize Hierarchically**
   - Group by skill track
   - Organize by difficulty
   - Makes navigation faster

4. **Regular Maintenance**
   - Export library monthly
   - Delete old versions
   - Keep cache clean

5. **Mobile Optimization**
   - Create 480p versions for mobile
   - Use adaptive bitrate if possible
   - Test on actual devices

## API Reference

### Service Methods

```typescript
// Upload
uploadVideo(file, metadata): Promise<VideoFile>
linkRemoteVideo(url, metadata): Promise<VideoFile>

// Retrieval
getVideo(id): VideoFile | null
getVideosByDrill(drillId): VideoFile[]
getVideosByTrack(trackId): VideoFile[]
getVideosByDifficulty(difficulty): VideoFile[]
getVideoLibrary(): VideoLibrary

// Playback
getVideoUrl(videoId): Promise<string | null>
getVideoBlob(videoId): Promise<Blob | null>

// Management
deleteVideo(videoId): void
deleteVideoBlob(videoId): Promise<void>
clearAllVideos(): void

// Storage
getStorageInfo(): { used, limit, percentage }

// Export/Import
exportLibrary(): string
importLibrary(json): void
```

## Migration from Old System

If you had videos stored elsewhere:

1. **Export Old Library** (if available)
   ```typescript
   const oldJson = localStorage.getItem('old_video_library');
   ```

2. **Convert to New Format**
   - Map old video IDs to new structure
   - Ensure all metadata is present

3. **Import to New System**
   ```typescript
   videoService.importLibrary(convertedJson);
   ```

4. **Verify Videos**
   - Check all videos appear in library
   - Test playback on each video

## Support & Debugging

### Enable Debug Logging

```typescript
// Add to your component
useEffect(() => {
  const library = videoService.getVideoLibrary();
  console.log('[DEBUG] Video Library:', library);
}, []);
```

### Check Browser Storage

1. Open DevTools (F12)
2. Go to Application tab
3. Check IndexedDB → AnchorVideoDB
4. View localStorage → anchor_video_library

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Storage limit exceeded" | 50MB full | Delete videos or use remote hosting |
| "Failed to store video blob" | IndexedDB quota | Clear cache, check quota |
| "Failed to load cache" | Corrupted data | Clear all and re-upload |
| "File content failed to load" | Network issue | Refresh and retry |
| "CORS error" | Remote video CORS | Host video on same domain or CORS-enabled server |

---

**Version:** 1.0.0  
**Last Updated:** March 2025  
**Compatibility:** ANCHOR v2.0+
