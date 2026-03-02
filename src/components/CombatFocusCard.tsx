import React from 'react';
import { motion } from 'motion/react';
import { Target, Zap, Timer } from 'lucide-react';
import { useCombatFocusAI } from '../hooks/useAIFeatures';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
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

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary"; className?: string; disabled?: boolean }) => {
  const variants = {
    primary: "bg-[#FF4444] text-white hover:bg-[#FF6666] shadow-[0_0_15px_rgba(255,68,68,0.3)]",
    secondary: "bg-[#2A2B2E] text-white hover:bg-[#3A3B3E]",
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
    <Card className="bg-[#1A1B1E] border border-[#FF4444]/20">
      <div className="flex justify-between items-center mb-4">
        <SectionHeader title="Combat Focus Today" icon={Target} />
        <span className="text-[10px] font-mono text-[#FF4444] uppercase bg-[#FF4444]/10 px-2 py-1 rounded">
          {loading ? 'Generating...' : 'AI Selected'}
        </span>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-[#FF4444] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-[#8E9299] font-mono uppercase">Analyzing Combat Data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-xs text-[#8E9299]">Using default recommendation</p>
          <Button variant="secondary" onClick={refetch} className="mt-2 text-[10px]">Retry</Button>
        </div>
      ) : focus ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2A2B2E] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#FF4444]" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase">{focus.pillar}</h4>
              <p className="text-[10px] text-[#8E9299] leading-tight mt-1">{focus.reason}</p>
            </div>
          </div>
          
          <div className="bg-[#0A0B0D] p-3 rounded-lg border border-[#2A2B2E]">
            <p className="text-[10px] text-[#8E9299] uppercase font-mono mb-1">Recommended Drill</p>
            <p className="text-xs font-bold text-white mb-3">{focus.drill}</p>
            <Button 
              variant="primary" 
              className="w-full text-[10px] py-2"
              onClick={refetch}
            >
              REFRESH FOCUS
            </Button>
          </div>
        </motion.div>
      ) : null}
    </Card>
  );
}
