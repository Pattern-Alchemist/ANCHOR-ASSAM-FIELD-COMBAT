# Video System - Troubleshooting Guide

## Issue: "Failed to Load File Content"

This error occurs when the video player or file system can't access the video file.

### Root Causes & Solutions

#### 1. Corrupted Video File
**Symptom:** Error appears immediately after upload
**Solution:**
```bash
# Check file integrity
ffmpeg -v error -i video.mp4 -f null -

# Re-encode if corrupted
ffmpeg -i broken.mp4 -vcodec libx264 -acodec aac fixed.mp4

# Then re-upload
```

#### 2. Network/Connection Issue
**Symptom:** Video loads sometimes, fails other times
**Solutions:**
- Refresh the page and try again
- Check internet connection
- Try uploading again
- Check browser console (F12) for specific error

#### 3. Browser Cache Problem
**Symptom:** Error persists across refreshes
**Solutions:**
```javascript
// Clear IndexedDB manually
const request = indexedDB.deleteDatabase('AnchorVideoDB');
request.onsuccess = () => console.log('Cache cleared');

// Clear localStorage
localStorage.removeItem('anchor_video_library');

// Then refresh page and re-upload
```

#### 4. Storage Quota Exceeded
**Symptom:** Upload succeeds but video won't play
**Solution:**
```javascript
// Check storage
const storage = videoService.getStorageInfo();
if (storage.percentage > 90) {
  // Delete old videos to free space
  videoService.deleteVideo(oldVideoId);
}
```

#### 5. IndexedDB Not Available
**Symptom:** Error on first upload in new browser/incognito
**Solution:**
- Exit private/incognito mode
- Check browser IndexedDB is enabled
- Try different browser
- Check for browser extensions blocking storage

#### 6. Video File Format Not Supported
**Symptom:** Upload succeeds but browser can't play
**Solution:**
```bash
# Convert to MP4 H.264 (most compatible)
ffmpeg -i video.mkv -vcodec libx264 -acodec aac video.mp4
ffmpeg -i video.mov -vcodec libx264 -acodec aac video.mp4
ffmpeg -i video.webm -vcodec libx264 -acodec aac video.mp4
```

### Step-by-Step Diagnostic

1. **Check Browser Console**
   ```
   Open: F12 → Console
   Look for: Specific error messages
   Report: Screenshot of errors
   ```

2. **Verify Video File**
   ```bash
   # Check file is valid
   ffprobe -v error -show_entries format video.mp4
   
   # Expected output: codec_type=video, duration=xyz
   ```

3. **Test with Different Video**
   ```
   - Try uploading a different video
   - If new video works, original may be corrupted
   - If new video fails, issue is system-wide
   ```

4. **Check Storage Quota**
   ```javascript
   // In browser console
   videoService.getStorageInfo()
   // Should show used < 50000000 (50MB)
   ```

5. **Verify IndexedDB**
   ```
   DevTools → Application → IndexedDB → AnchorVideoDB
   Should show "videos" object store with entries
   ```

### Recovery Steps

**If videos are completely inaccessible:**

1. **Export Current Library**
   ```javascript
   const backup = videoService.exportLibrary();
   console.save(backup, 'backup.json');
   ```

2. **Clear Everything**
   ```javascript
   videoService.clearAllVideos();
   ```

3. **Refresh Page**
   ```
   Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   ```

4. **Re-upload Videos**
   - Use the VideoManager component
   - Test with one video first
   - Check it plays before uploading more

5. **Restore from Backup** (if needed)
   ```javascript
   const backupJson = // load from file
   videoService.importLibrary(backupJson);
   ```

## Issue: No Videos Available for Drills

### Cause 1: Videos Not Uploaded Yet

**Solution:**
```typescript
// Check if videos exist
const videos = videoService.getVideosByDrill('drill-id');
console.log('Videos:', videos); // Should not be empty array

// If empty, upload:
<VideoManager drillId="drill-id" />
```

### Cause 2: Video Not Associated with Drill

**Solution:**
```typescript
// When uploading, make sure to set drillId:
await videoService.uploadVideo(file, {
  drillId: 'your-drill-id',  // Required!
  difficulty: 'Intermediate'
});
```

### Cause 3: Wrong Drill ID

**Solution:**
```typescript
// Verify drill ID is correct
import { combatData } from './data/combatData';

// List all valid drill IDs
combatData.drills.forEach(drill => {
  console.log(drill.id);
});

// Use correct ID when uploading
```

### Cause 4: Storage Cleared Accidentally

**Solution:**
- Check browser storage wasn't cleared
- Look in browser settings → Privacy → Clear browsing data
- If cleared, videos are lost (unless you have backup)
- Re-upload videos from source files

## Issue: Video Player Controls Not Working

### Solution 1: Event Handlers
```typescript
// Make sure VideoPlayer has proper event binding
<VideoPlayer 
  video={video}
  videoUrl={url}
  onClose={handleClose}  // Ensure this is provided
/>
```

### Solution 2: CSS Issues
```css
/* Ensure controls are not hidden by other CSS */
.video-player-controls {
  pointer-events: auto !important;  /* Allow clicks */
  z-index: 10;                      /* Layer above video */
}
```

### Solution 3: Browser Autoplay Policy
```javascript
// Some browsers require user interaction first
videoRef.current.play().catch(error => {
  console.log('Autoplay blocked:', error);
  // User must click play button instead
});
```

## Issue: Videos Load Slowly

### Solution 1: Compression
```bash
# Reduce bitrate for faster loading
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset fast \
  -vf scale=1280:720 -acodec aac -b:a 96k output.mp4
```

### Solution 2: Use Remote Hosting
```typescript
// Instead of uploading large files:
await videoService.linkRemoteVideo(
  'https://cdn.example.com/video.mp4',
  { name: 'My Video' }
);
```

### Solution 3: Clear Browser Cache
```
Settings → Privacy & Security → Clear browsing data
Select: Cached images and files
Click: Clear data
```

## Issue: Storage Shows as Full

### Solution 1: Check What's Using Space
```javascript
const library = videoService.getVideoLibrary();
const largest = library.videos
  .sort((a, b) => b.size - a.size)
  .slice(0, 5);

console.table(largest.map(v => ({
  name: v.name,
  size: (v.size / 1024 / 1024).toFixed(1) + 'MB'
})));
```

### Solution 2: Delete Unused Videos
```javascript
// Delete specific video
videoService.deleteVideo(videoId);

// Or delete all
videoService.clearAllVideos();
```

### Solution 3: Use Remote Hosting
```typescript
// Don't upload all videos locally
// Instead, link remote URLs for HD versions
// Only upload frequently-used training clips locally
```

## Issue: Import/Export Not Working

### Solution 1: Invalid JSON Format
```javascript
// Make sure exported data is valid JSON
const json = videoService.exportLibrary();
try {
  JSON.parse(json);  // Should not throw
} catch (e) {
  console.error('Invalid JSON:', e);
}
```

### Solution 2: Import Fails
```javascript
// Ensure format is correct before importing
const json = localStorage.getItem('backup');
try {
  videoService.importLibrary(json);
} catch (error) {
  console.error('Import failed:', error);
  // Try fixing JSON format manually
}
```

## Debugging Checklist

- [ ] Video file is not corrupted
- [ ] Browser supports video format (MP4 H.264)
- [ ] IndexedDB is enabled in browser
- [ ] Storage quota not exceeded (< 50MB)
- [ ] Video associated with correct drill/track
- [ ] Network connection is stable
- [ ] Browser cache is cleared
- [ ] No CORS issues on remote videos
- [ ] VideoManager component rendered
- [ ] VideoPlayer component has URL

## Emergency Recovery

If nothing works:

1. **Export Library (if possible)**
   ```javascript
   const backup = videoService.exportLibrary();
   // Save to file
   ```

2. **Backup Your Videos**
   - Download all source files
   - Store on external drive
   - Keep master versions

3. **Clear and Start Fresh**
   ```javascript
   videoService.clearAllVideos();
   localStorage.clear();
   indexedDB.deleteDatabase('AnchorVideoDB');
   ```

4. **Re-upload Videos**
   - Use VideoManager
   - Test one video first
   - Gradually add more

5. **Restore from Backup** (if you have one)
   ```javascript
   videoService.importLibrary(backupJson);
   ```

## Getting Help

If issues persist:

1. **Collect Information**
   - Browser type and version
   - Video file format and size
   - Exact error message (screenshot)
   - Steps to reproduce
   - Browser console errors (F12)

2. **Check Storage**
   ```javascript
   // Share this output
   console.log({
     library: videoService.getVideoLibrary(),
     storage: videoService.getStorageInfo()
   });
   ```

3. **Test File**
   - Create small test video (< 5MB)
   - Try uploading test video
   - Check if issue is file-specific

---

**Version:** 1.0.0  
**Last Updated:** March 2025
