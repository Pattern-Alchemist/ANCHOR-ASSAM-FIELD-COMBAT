import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { VideoFile } from '../services/videoService';

interface VideoPlayerProps {
  video: VideoFile;
  videoUrl: string;
  onClose?: () => void;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  videoUrl,
  onClose,
  autoPlay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(err =>
        console.warn('[VideoPlayer] Autoplay failed:', err)
      );
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen && videoRef.current?.parentElement) {
        await videoRef.current.parentElement.requestFullscreen?.();
        setIsFullscreen(true);
      } else if (isFullscreen && document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.warn('[VideoPlayer] Fullscreen failed:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-[#0A0B0D] rounded-lg overflow-hidden border border-[#2A2B2E]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#1A1B1E] border-b border-[#2A2B2E]">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#FAFBFC] truncate">{video.name}</h3>
            <p className="text-[10px] text-[#8E9299]">
              {video.difficulty && `${video.difficulty} • `}
              {(video.size / 1024 / 1024).toFixed(1)}MB
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2A2B2E] rounded transition-colors"
          >
            <X className="w-5 h-5 text-[#8E9299]" />
          </button>
        </div>

        {/* Video Container */}
        <div
          className="relative bg-black w-full aspect-video overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={e => setCurrentTime(e.currentTime)}
            onLoadedMetadata={e => setDuration(e.currentTime)}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Controls Overlay */}
          <motion.div
            animate={{ opacity: showControls ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 flex flex-col justify-end pointer-events-none"
          >
            <div className="pointer-events-auto p-4 space-y-3">
              {/* Progress Bar */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={e => {
                    const time = parseFloat(e.target.value);
                    setCurrentTime(time);
                    if (videoRef.current) {
                      videoRef.current.currentTime = time;
                    }
                  }}
                  className="w-full h-1 bg-[#2A2B2E] rounded appearance-none cursor-pointer accent-[#A78BFA]"
                />
                <div className="flex justify-between text-[10px] text-[#8E9299]">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>

                  <span className="text-xs text-white ml-2">{formatTime(currentTime)}</span>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5 text-white" />
                  ) : (
                    <Maximize className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Play Button Overlay */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center hover:bg-black/20 transition-colors"
            >
              <Play className="w-16 h-16 text-white drop-shadow-lg" />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
