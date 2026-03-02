/**
 * DrillDetail.tsx - Drill Detail with AI-Generated Tips
 */

import React from 'react';
import { motion } from 'motion/react';
import { Zap, Loader } from 'lucide-react';
import { useDrillTipsAI } from '../hooks/useAIFeatures';
import { CombatDrill } from '../data/combatData';

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={`bg-[#151619] border border-[#2A2B2E] rounded-xl p-4 shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

interface DrillDetailProps {
  drill: CombatDrill;
  onClose?: () => void;
}

export function DrillDetail({ drill, onClose }: DrillDetailProps) {
  const { tips, loading, error, fetchTips } = useDrillTipsAI();

  React.useEffect(() => {
    fetchTips(drill.id, drill.difficulty);
  }, [drill.id, drill.difficulty]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className="border-l-4 border-l-[#FF4444]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold uppercase tracking-tight">{drill.name}</h2>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] font-mono bg-[#2A2B2E] px-2 py-1 rounded text-[#8E9299] uppercase">
              {drill.difficulty}
            </span>
            <span className="text-[10px] font-mono bg-[#FF4444]/10 px-2 py-1 rounded text-[#FF4444] uppercase">
              {drill.pillar}
            </span>
          </div>
        </div>

        <p className="text-sm text-[#E6E6E6] leading-relaxed mb-6">{drill.description}</p>

        {/* AI-Generated Tips Section */}
        <div className="pt-6 border-t border-[#2A2B2E]">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#FF4444]" />
            <h3 className="text-xs font-mono uppercase text-[#8E9299] tracking-widest">AI-Generated Tips</h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader className="w-5 h-5 text-[#FF4444]" />
              </motion.div>
              <span className="ml-2 text-xs text-[#8E9299]">Generating tips...</span>
            </div>
          ) : error ? (
            <div className="bg-yellow-900/20 border border-yellow-900/50 p-3 rounded-lg mb-4">
              <p className="text-xs text-yellow-600">Tips unavailable - check your connection</p>
            </div>
          ) : tips.length > 0 ? (
            <motion.div className="space-y-3">
              {tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 p-3 bg-[#0A0B0D] rounded-lg border border-[#2A2B2E]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#FF4444]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[8px] text-[#FF4444] font-bold">{i + 1}</span>
                  </div>
                  <p className="text-xs text-[#E6E6E6] leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-xs text-[#8E9299]">No tips generated yet</p>
          )}
        </div>

        {/* Stats */}
        <div className="pt-6 grid grid-cols-2 gap-4">
          <div className="bg-[#0A0B0D] p-4 rounded-xl border border-[#2A2B2E] text-center">
            <p className="text-[10px] font-mono text-[#8E9299] uppercase mb-1">Target Sets</p>
            <p className="text-2xl font-bold">{drill.sets || '-'}</p>
          </div>
          <div className="bg-[#0A0B0D] p-4 rounded-xl border border-[#2A2B2E] text-center">
            <p className="text-[10px] font-mono text-[#8E9299] uppercase mb-1">
              {drill.duration ? 'Duration (s)' : 'Reps'}
            </p>
            <p className="text-2xl font-bold">{drill.duration || drill.reps || '-'}</p>
          </div>
        </div>

        {onClose && (
          <motion.button
            onClick={onClose}
            className="w-full mt-6 py-3 bg-[#FF4444] text-white rounded-xl font-bold uppercase tracking-widest"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        )}
      </Card>
    </motion.div>
  );
}
