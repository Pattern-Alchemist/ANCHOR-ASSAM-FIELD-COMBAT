import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Trash2,
  BarChart3,
  X,
  Play,
  AlertCircle,
  CheckCircle2,
  Clock,
  HardDrive,
  Download,
  RefreshCw,
  Link2,
} from 'lucide-react';
import { videoService, VideoFile, VideoLibrary } from '../services/videoService';

interface VideoManagerProps {
  onVideoSelect?: (video: VideoFile) => void;
  drillId?: string;
  trackId?: string;
  compact?: boolean;
}

export const VideoManager: React.FC<VideoManagerProps> = ({
  onVideoSelect,
  drillId,
  trackId,
  compact = false,
}) => {
  const [library, setLibrary] = useState<VideoLibrary>(videoService.getVideoLibrary());
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [videoName, setVideoName] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storageInfo = videoService.getStorageInfo();
  const filteredVideos = drillId
    ? library.videos.filter(v => v.drillId === drillId)
    : trackId
    ? library.videos.filter(v => v.trackId === trackId)
    : library.videos;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // Simulate progress
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 15, 90));
      }, 200);

      const video = await videoService.uploadVideo(file, {
        drillId,
        trackId,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Refresh library
      const updated = videoService.getVideoLibrary();
      setLibrary(updated);

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleLinkVideo = async () => {
    if (!linkUrl || !videoName) {
      setError('Please enter both URL and video name');
      return;
    }

    setError(null);
    setLinkLoading(true);

    try {
      const video = await videoService.linkRemoteVideo(linkUrl, {
        name: videoName,
        drillId,
        trackId,
      });

      const updated = videoService.getVideoLibrary();
      setLibrary(updated);

      setLinkUrl('');
      setVideoName('');
      setShowUploadForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link video');
    } finally {
      setLinkLoading(false);
    }
  };

  const handleDeleteVideo = (videoId: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      videoService.deleteVideo(videoId);
      const updated = videoService.getVideoLibrary();
      setLibrary(updated);
    }
  };

  const handlePlayVideo = async (video: VideoFile) => {
    const url = await videoService.getVideoUrl(video.id);
    if (url) {
      onVideoSelect?.({ ...video });
      // Open in new window or modal as needed
    }
  };

  if (compact && filteredVideos.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Storage Info */}
      <div className="mb-6 rounded-lg bg-[#1A1B1E] border border-[#2A2B2E] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#A78BFA]" />
            <span className="text-sm font-mono text-[#8E9299]">Storage</span>
          </div>
          <span className="text-sm font-mono text-[#A78BFA]">
            {(storageInfo.used / 1024 / 1024).toFixed(1)}MB / 50MB
          </span>
        </div>
        <div className="w-full bg-[#0A0B0D] rounded h-2">
          <div
            className="bg-gradient-to-r from-[#A78BFA] to-[#C084FC] h-2 rounded transition-all"
            style={{ width: `${storageInfo.percentage}%` }}
          />
        </div>
        {storageInfo.percentage > 80 && (
          <p className="text-xs text-[#FCA5A5] mt-2">Storage is running low</p>
        )}
      </div>

      {/* Videos List */}
      {filteredVideos.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#FAFBFC] mb-3">Videos ({filteredVideos.length})</h3>
          <div className="space-y-2">
            {filteredVideos.map(video => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 rounded-lg bg-[#1A1B1E] border border-[#2A2B2E] hover:border-[#3A3B3E] transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Play className="w-4 h-4 text-[#A78BFA]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-[#FAFBFC] truncate">
                      {video.name}
                    </p>
                    <p className="text-[10px] text-[#8E9299]">
                      {(video.size / 1024 / 1024).toFixed(1)}MB •{' '}
                      {new Date(video.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayVideo(video)}
                    className="p-2 hover:bg-[#2A2B2E] rounded transition-colors"
                    title="Play video"
                  >
                    <Play className="w-4 h-4 text-[#A78BFA]" />
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="p-2 hover:bg-[#2A2B2E] rounded transition-colors text-[#FCA5A5]"
                    title="Delete video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="space-y-3">
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="w-full px-4 py-3 rounded-lg bg-[#A78BFA] text-black font-mono text-sm font-bold hover:bg-[#C084FC] transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {showUploadForm ? 'Close' : 'Upload Video'}
        </button>

        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg bg-[#1A1B1E] border border-[#2A2B2E] p-4 space-y-4"
            >
              {/* File Upload */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#8E9299] mb-2 uppercase">
                  Upload Video File
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-[#2A2B2E] rounded-lg p-8 text-center cursor-pointer hover:border-[#3A3B3E] transition-colors"
                >
                  <Upload className="w-8 h-8 text-[#A78BFA] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-mono text-[#FAFBFC] mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-[10px] text-[#8E9299]">
                    MP4, WebM, or other video formats (max 50MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>

                {uploading && (
                  <div className="mt-3">
                    <div className="w-full bg-[#0A0B0D] rounded h-2">
                      <div
                        className="bg-gradient-to-r from-[#A78BFA] to-[#C084FC] h-2 rounded transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#8E9299] mt-1">{uploadProgress}% uploading...</p>
                  </div>
                )}
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2A2B2E]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#1A1B1E] text-[#8E9299]">OR</span>
                </div>
              </div>

              {/* Link Remote Video */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#8E9299] mb-2 uppercase">
                  Link Remote Video
                </label>
                <input
                  type="text"
                  placeholder="Video name"
                  value={videoName}
                  onChange={e => setVideoName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0A0B0D] border border-[#2A2B2E] text-[#FAFBFC] font-mono text-sm mb-2 placeholder-[#8E9299] focus:outline-none focus:border-[#A78BFA]"
                  disabled={linkLoading}
                />
                <input
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0A0B0D] border border-[#2A2B2E] text-[#FAFBFC] font-mono text-sm mb-2 placeholder-[#8E9299] focus:outline-none focus:border-[#A78BFA]"
                  disabled={linkLoading}
                />
                <button
                  onClick={handleLinkVideo}
                  disabled={linkLoading || !linkUrl || !videoName}
                  className="w-full px-3 py-2 rounded bg-[#2A2B2E] text-[#FAFBFC] font-mono text-sm hover:bg-[#3A3B3E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {linkLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Linking...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      Link Video
                    </>
                  )}
                </button>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded bg-[#7F1D1D] border border-[#FCA5A5]"
                >
                  <AlertCircle className="w-4 h-4 text-[#FCA5A5] flex-shrink-0" />
                  <p className="text-xs text-[#FCA5A5]">{error}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
