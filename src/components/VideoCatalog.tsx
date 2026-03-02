import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Volume2, Clock, BookOpen } from 'lucide-react';
import { COMBAT_COURSES } from '../data/manualData';

interface VideoCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelect?: (videoUrl: string, videoTitle: string) => void;
}

export const VideoCatalog: React.FC<VideoCatalogProps> = ({ isOpen, onClose, onVideoSelect }) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  if (!isOpen) return null;

  const course = selectedCourse 
    ? COMBAT_COURSES.find(c => c.id === selectedCourse)
    : null;

  const video = selectedVideo && course
    ? course.videos.find(v => v.id === selectedVideo)
    : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0A0B0D] border border-[#2A2B2E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#2A2B2E]">
            <div>
              <h2 className="text-2xl font-bold text-white">Combat Training Videos</h2>
              <p className="text-sm text-[#8E9299] mt-1">
                {video ? `${course?.title} - ${video.title}` : `${course?.title || 'Video Catalog'}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2A2B2E] rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-[#8E9299]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!selectedCourse ? (
              /* Course List */
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMBAT_COURSES.map((course) => (
                  <motion.button
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCourse(course.id)}
                    className="text-left p-4 bg-[#1A1B1E] border border-[#2A2B2E] rounded-lg hover:border-[#FF4444] transition-colors group"
                  >
                    <h3 className="font-bold text-lg text-white group-hover:text-[#FF4444] transition-colors mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-[#8E9299] mb-3">{course.description}</p>
                    <div className="flex items-center gap-2 text-xs text-[#8E9299]">
                      <span className="px-2 py-1 bg-[#0A0B0D] rounded">
                        {course.videos.length} videos
                      </span>
                      <span className="px-2 py-1 bg-[#0A0B0D] rounded">
                        {course.difficulty}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : !selectedVideo ? (
              /* Video List for Course */
              <div className="p-6 space-y-3">
                {course?.videos.map((video) => (
                  <motion.button
                    key={video.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedVideo(video.id)}
                    className="w-full text-left p-4 bg-[#1A1B1E] border border-[#2A2B2E] rounded-lg hover:border-[#FF4444] transition-colors group flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-[#2A2B2E] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF4444]/20 transition-colors">
                      <Play className="w-6 h-6 text-[#FF4444]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white group-hover:text-[#FF4444] transition-colors mb-1">
                        {video.title}
                      </h4>
                      <p className="text-sm text-[#8E9299] mb-2">{video.description}</p>
                      <div className="flex items-center gap-3 text-xs text-[#8E9299]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </div>
                        {video.prerequisite && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <BookOpen className="w-3 h-3" />
                            Requires: {video.prerequisite}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              /* Video Player */
              <div className="p-6 space-y-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-[#2A2B2E]">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`${video?.url}?autoplay=0`}
                    title={video?.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{video?.title}</h3>
                  <p className="text-sm text-[#8E9299] mb-4">{video?.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-[#1A1B1E] rounded-lg border border-[#2A2B2E]">
                      <p className="text-xs text-[#8E9299] mb-1">Duration</p>
                      <p className="font-bold text-white">{video?.duration}</p>
                    </div>
                    <div className="p-3 bg-[#1A1B1E] rounded-lg border border-[#2A2B2E]">
                      <p className="text-xs text-[#8E9299] mb-1">Course</p>
                      <p className="font-bold text-white">{course?.title}</p>
                    </div>
                  </div>

                  {video?.prerequisite && (
                    <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg mb-4">
                      <p className="text-xs text-yellow-600 font-mono uppercase">
                        Prerequisite: {video.prerequisite}
                      </p>
                    </div>
                  )}

                  {onVideoSelect && (
                    <button
                      onClick={() => {
                        onVideoSelect(video?.url || '', video?.title || '');
                        onClose();
                      }}
                      className="w-full px-4 py-2 bg-[#FF4444] text-white font-bold rounded-lg hover:bg-[#FF4444]/90 transition-colors uppercase text-sm"
                    >
                      Load in Player
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="p-4 border-t border-[#2A2B2E] flex gap-2">
            {selectedVideo && (
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 bg-[#1A1B1E] border border-[#2A2B2E] rounded-lg hover:border-[#FF4444] transition-colors text-sm font-semibold text-[#8E9299]"
              >
                ← Back to Videos
              </button>
            )}
            {selectedCourse && !selectedVideo && (
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 bg-[#1A1B1E] border border-[#2A2B2E] rounded-lg hover:border-[#FF4444] transition-colors text-sm font-semibold text-[#8E9299]"
              >
                ← Back to Courses
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
