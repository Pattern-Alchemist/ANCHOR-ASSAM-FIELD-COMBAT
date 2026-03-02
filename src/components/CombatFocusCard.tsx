/**
 * CombatFocusCard.tsx - AI-Powered Combat Focus Recommendation
 */

import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { useCombatFocusAI } from '../hooks/useAIFeatures';

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={`bg-[#151619] border border-[#2A2B2E] rounded-xl p-4 shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }: { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "secondary" | "danger", className?: string, disabled?: boolean }) => {
  const variants = {
    primary: "bg-[#FF4444] text-white hover:bg-[#FF6666] shadow-[0_0_15px_rgba(255,68,68,0.3)]",
    secondary: "bg-[#2A2B2E] text-white hover:bg-[#3A3B3E]",
    danger: "bg-red-900/50 text-red-200 border border-red-800 hover:bg-red-800/50"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    >
      {children}
    </button>
  );
};

export function CombatFocusCard() {
  const { focus, loading, error, refetch } = useCombatFocusAI({ autoFetch: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className="border-l-4 border-l-[#FF4444]">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-[#FF4444]" />
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8E9299]">Today's Focus</h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <p className="text-[#8E9299] text-sm">Generating AI focus recommendation...</p>
            </div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <p className="text-[#FF4444] text-xs">Using default recommendation</p>
            <div>
              <h3 className="text-[#FF4444] font-bold uppercase text-lg mb-2">Grappling</h3>
              <p className="text-[#8E9299] text-xs font-mono uppercase mb-3">Enhance ground control and defensive positioning</p>
              <p className="text-sm text-[#E6E6E6] mb-4">Try: Focus on escapes and reversal techniques</p>
            </div>
            <Button onClick={refetch} className="w-full">Retry</Button>
          </div>
        ) : focus ? (
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-[#FF4444] font-bold uppercase text-2xl mb-2">{focus.pillar}</h3>
              <p className="text-[#8E9299] text-xs font-mono uppercase mb-3">{focus.reason}</p>
              <p className="text-sm text-[#E6E6E6] mb-4">
                <span className="font-bold">Drill: </span>{focus.drill}
              </p>
            </motion.div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-[#2A2B2E] h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[#FF4444] h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${focus.confidence * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-mono text-[#8E9299]">{Math.round(focus.confidence * 100)}%</span>
            </div>

            <Button onClick={refetch} variant="secondary" className="w-full">
              Get New Recommendation
            </Button>
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}
