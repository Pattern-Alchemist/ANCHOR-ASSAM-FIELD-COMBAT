import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Target } from 'lucide-react';
import { useScenarioOutcomeAI } from '../hooks/useAIFeatures';

interface ScenarioSimulatorProps {
  scenarioId: string;
  userChoice: string;
  stats: any;
  onContinue: (score: number, success: boolean) => void;
}

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#151619] border border-[#2A2B2E] rounded-xl p-4 shadow-xl ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, icon: Icon }: { title: string; icon: React.ElementType }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-5 h-5 text-[#FF4444]" />
    <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8E9299]">{title}</h2>
  </div>
);

const ScenarioOutcomeCard = ({ outcome, score, onContinue }: { outcome: 'success' | 'failure'; score: number; onContinue: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`bg-[#1A1B1E] border-2 rounded-2xl p-8 text-center ${outcome === 'success' ? 'border-green-500' : 'border-[#FF4444]'}`}
    >
      <motion.h2
        className={`text-3xl font-black mb-4 uppercase tracking-tighter ${outcome === 'success' ? 'text-green-500' : 'text-[#FF4444]'}`}
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: -20, opacity: 0 }}
      >
        {outcome === 'success' ? '⚔ VICTORY' : '❌ COMPROMISED'}
      </motion.h2>
      <div className="mb-8">
        <p className="text-[#8E9299] text-xs font-mono uppercase mb-1">Mission Success Rate</p>
        <span className={`text-5xl font-black ${outcome === 'success' ? 'text-white' : 'text-[#FF4444]'}`}>{score}%</span>
      </div>
      <button
        onClick={onContinue}
        className="w-full py-4 bg-[#FF4444] rounded-xl font-bold text-white uppercase tracking-widest active:scale-95 transition-all"
      >
        CONTINUE →
      </button>
    </motion.div>
  );
};

export function ScenarioSimulator({ scenarioId, userChoice, stats, onContinue }: ScenarioSimulatorProps) {
  const { outcome, loading, generateOutcome } = useScenarioOutcomeAI();

  useEffect(() => {
    generateOutcome(scenarioId, userChoice, stats);
  }, [scenarioId, userChoice]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-mono uppercase text-[#8E9299]">AI Evaluating Performance...</p>
      </div>
    );
  }

  if (!outcome) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ScenarioOutcomeCard 
        outcome={outcome.successRate > 50 ? 'success' : 'failure'} 
        score={outcome.successRate} 
        onContinue={() => onContinue(outcome.successRate, outcome.successRate > 50)} 
      />
      <Card className="bg-[#0A0B0D] border-purple-500/30">
        <SectionHeader title="AI Tactical Analysis" icon={Target} />
        <p className="text-sm text-[#E6E6E6] leading-relaxed mb-4">{outcome.outcome}</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#8E9299] uppercase">Risk Level:</span>
          <span className={`text-[10px] font-mono font-bold uppercase ${
            outcome.riskLevel === 'Critical' ? 'text-red-500' : 
            outcome.riskLevel === 'High' ? 'text-orange-500' : 
            'text-green-500'
          }`}>{outcome.riskLevel}</span>
        </div>
      </Card>
    </div>
  );
}
