import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useDrillTipsAI } from '../hooks/useAIFeatures';

interface DrillDetailProps {
  drillId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export function DrillDetail({ drillId, difficulty }: DrillDetailProps) {
  const { tips, loading, fetchTips } = useDrillTipsAI();

  useEffect(() => {
    fetchTips(drillId, difficulty);
  }, [drillId, difficulty, fetchTips]);

  return (
    <div className="drill-tips">
      <h3 className="text-xs font-mono uppercase text-[#8E9299] mb-4 tracking-widest">Tactical AI Guidance</h3>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-[#FF4444] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[10px] text-[#8E9299] font-mono uppercase">Analyzing Combat Flow...</p>
        </div>
      ) : tips.length > 0 ? (
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="text-xs text-[#E6E6E6] flex gap-2 bg-[#FF4444]/5 p-2 rounded border border-[#FF4444]/10"
            >
              <span className="text-[#FF4444] font-bold">PRO:</span> {tip}
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-[10px] text-[#8E9299] italic">Tactical tips currently unavailable offline.</p>
      )}
    </div>
  );
}
