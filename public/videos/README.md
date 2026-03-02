# Video Library - ANCHOR Combat Training

This folder is your centralized video storage for all ANCHOR combat training drills, skill tracks, and programs.

## Folder Structure

```
public/videos/
├── README.md (this file)
├── skill-tracks/
│   ├── muay-thai-engine/
│   │   ├── clinch-dominance.mp4
│   │   ├── explosive-combos.mp4
│   │   ├── movement-and-distance.mp4
│   │   └── pressure-application.mp4
│   ├── blade-mastery/
│   │   ├── fundamental-cuts.mp4
│   │   ├── advanced-combinations.mp4
│   │   ├── defensive-techniques.mp4
│   │   ├── speed-and-precision.mp4
│   │   └── maintenance-readiness.mp4
│   ├── lone-survivor/
│   │   ├── situational-awareness.mp4
│   │   ├── de-escalation.mp4
│   │   ├── pressure-testing.mp4
│   │   ├── multi-opponent.mp4
│   │   ├── weapon-transitions.mp4
│   │   └── combat-endurance.mp4
│   ├── land-warrior/
│   │   ├── terrain-utilization.mp4
│   │   ├── ground-movement.mp4
│   │   ├── climbing-under-load.mp4
│   │   ├── environment-weapons.mp4
│   │   └── survival-integration.mp4
│   └── conditioning-core/
│       ├── explosive-power.mp4
│       ├── combat-cardio.mp4
│       ├── grip-and-weapon-endurance.mp4
│       └── mental-fortitude.mp4
├── striking-drills/
│   ├── beginner/
│   │   ├── basic-stance.mp4
│   │   ├── fundamental-guards.mp4
│   │   ├── basic-combinations.mp4
│   │   └── distance-control-intro.mp4
│   ├── intermediate/
│   │   ├── explosive-combo-chain.mp4
│   │   ├── angle-variation.mp4
│   │   ├── footwork-transitions.mp4
│   │   └── entry-techniques.mp4
│   └── advanced/
│       ├── complex-combinations.mp4
│       ├── high-pressure-striking.mp4
│       ├── counter-striking.mp4
│       └── ring-generalization.mp4
├── grapple-drills/
│   ├── beginner/
│   ├── intermediate/
│   └── advanced/
├── integration-scenarios/
│   ├── scenario-1-multi-opponent.mp4
│   ├── scenario-2-weapon-transition.mp4
│   └── scenario-3-survival-combat.mp4
└── core-conditioning/
    ├── shadowboxing.mp4
    ├── combination-work.mp4
    ├── pressure-work.mp4
    └── conditioning-finisher.mp4
```

## How to Add Videos

### Method 1: Upload via App (Easiest)
1. Open the app and navigate to any drill or skill track
2. Click the **"Upload Video"** button
3. Select your video file (MP4, WebM, etc.)
4. The app stores it securely and associates it with that drill

### Method 2: Store Directly in This Folder
1. Record or download your video
2. Place it in the appropriate subfolder (skill-tracks/, striking-drills/, etc.)
3. Video will be automatically available throughout the app

### Method 3: Link Remote Videos
1. Host your video on any platform (YouTube, Vimeo, AWS S3, etc.)
2. In the app, use "Link Remote Video" and paste the URL
3. The app will play it directly from that URL

## Video Format Guidelines

**Recommended Formats:**
- MP4 (H.264 codec) - Most compatible
- WebM (VP9 codec) - Better compression
- MOV (QuickTime) - iOS devices

**Technical Specs:**
- **Resolution:** 1920x1080 (Full HD) or 1280x720 (HD)
- **Bitrate:** 2-5 Mbps (balance quality and file size)
- **Frame Rate:** 24fps, 30fps, or 60fps
- **Audio:** AAC or MP3, 128-192 kbps

**File Size Recommendations:**
- 5-10 min videos: 50-200 MB
- 10-20 min videos: 100-400 MB
- Max app storage: 50 MB (configurable)

## Video Organization Tips

1. **Use Clear Naming:**
   - Good: `explosive-combo-chain-intermediate.mp4`
   - Avoid: `video123.mp4`

2. **Organize by Difficulty:**
   - Beginner, Intermediate, Advanced videos in separate folders
   - App recognizes difficulty levels automatically

3. **Batch Organization:**
   - Group related drills together
   - Keep skill tracks in dedicated folders

4. **Versioning:**
   - Add dates for updated videos: `footwork-transitions-2025-03.mp4`
   - Archive old versions in an `archive/` folder

## Storage Management

### Storage Limits
- **Local Storage:** 50 MB per browser
- **Backup:** Export library metadata from app settings
- **Cleanup:** Remove unused videos to free space

### Monitor Storage Usage
The app shows real-time storage usage:
- Green: 0-50% utilized
- Yellow: 50-80% utilized
- Red: 80%+ utilized (consider deleting old videos)

## Video Library Features

### Automatic Features
- ✅ Video indexing and search
- ✅ Difficulty level tagging
- ✅ Prerequisite tracking
- ✅ Progress monitoring
- ✅ Offline access (for downloaded videos)
- ✅ Automatic compression

### Linked Features
- ✅ Each video shows in drill details
- ✅ Skill track progression includes videos
- ✅ Scenario training references relevant videos
- ✅ AI recommendations include video suggestions

## Troubleshooting

### Video Not Playing
1. Check file format is supported
2. Verify file isn't corrupted
3. Check browser console for errors
4. Try uploading again

### Upload Failed
1. Check file size (must be under 50MB)
2. Verify free space in app storage
3. Try a different video format
4. Clear browser cache and retry

### Storage Full
1. Delete older/unused videos
2. Lower video resolution in encoding
3. Use remote linking instead of uploading
4. Clear app cache from settings

### Performance Issues
1. Use lower resolution videos (720p instead of 1080p)
2. Reduce bitrate in encoding
3. Clear browser cache
4. Use fewer simultaneous uploads

## Best Practices

1. **Combine Methods:**
   - Host HD versions remotely
   - Store training clips locally
   - Link production content from CDN

2. **Backup Strategy:**
   - Export library metadata monthly
   - Keep master videos on external drive
   - Version control for important videos

3. **Optimize for Mobile:**
   - Create mobile-optimized versions
   - Compress heavily without quality loss
   - Use .webm for better compatibility

4. **Update Content:**
   - Review and update videos quarterly
   - Replace outdated techniques
   - Archive previous versions

## API Reference

### From Your App (TypeScript)

```typescript
import { videoService } from './services/videoService';

// Upload a video
const video = await videoService.uploadVideo(file, {
  drillId: 'drill-123',
  trackId: 'muay-thai-engine',
  difficulty: 'Intermediate'
});

// Get videos for a drill
const drillVideos = videoService.getVideosByDrill('drill-123');

// Get videos for a track
const trackVideos = videoService.getVideosByTrack('muay-thai-engine');

// Link a remote video
const remoteVideo = await videoService.linkRemoteVideo(
  'https://example.com/video.mp4',
  {
    name: 'Explosive Combos',
    trackId: 'muay-thai-engine',
    difficulty: 'Intermediate'
  }
);

// Get video URL (works for local and remote)
const url = await videoService.getVideoUrl(videoId);

// Delete a video
videoService.deleteVideo(videoId);

// Get storage info
const storage = videoService.getStorageInfo();
console.log(`Using ${storage.used}MB of ${storage.limit}MB`);

// Export/Import library
const json = videoService.exportLibrary();
videoService.importLibrary(json);
```

## Examples

### Uploading Training Videos
```
1. Record 5-10 minute drill demonstrations
2. Edit with simple transitions and text overlays
3. Export as MP4 (2-5 Mbps bitrate)
4. Upload via app and associate with drill
5. App automatically makes it available in drill details
```

### Organizing Skill Tracks
```
Muay Thai Engine/
├── Day 1: Clinch fundamentals
├── Day 2: Clinch pressure
├── Day 3: Clinch transitions
└── Day 4: Clinch under fatigue
```

### Linking External Content
```
- YouTube: Link to technique breakdowns
- Vimeo: Professional coaching videos
- AWS S3: High-definition versions
- GitHub: Auto-generated training clips
```

## Support & Questions

For issues with video management:
1. Check browser console (F12) for errors
2. Verify file compatibility
3. Check app logs in settings
4. Contact support with error messages

---

**Last Updated:** March 2025  
**Video Service Version:** 1.0.0  
**Compatible With:** ANCHOR v2.0+
