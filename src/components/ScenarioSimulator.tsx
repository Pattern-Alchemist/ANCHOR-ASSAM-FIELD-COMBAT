/**
 * ScenarioSimulator.tsx - Combat Scenario with AI-Generated Outcomes
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, ChevronRight } from 'lucide-react';
import { useScenarioOutcomeAI } from '../hooks/useAIFeatures';
import { CombatScenario } from '../data/combatData';

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={`bg-[#151619] border border-[#2A2B2E] rounded-xl p-4 shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-5 h-5 text-[#FF4444]" />
    <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8E9299]">{title}</h2>
  </div>
);

interface ScenarioSimulatorProps {
  scenario: CombatScenario;
  onExit: () => void;
  userStats?: { strikeLevel?: string; grappleLevel?: string; weaponLevel?: string };
}

interface ScenarioNodeProps {
  scenarioId: string;
  nodeId: string;
  scenarioText: string;
  choices: Array<{ action: string; nextNodeId: string; riskModifier: number }>;
  onChoiceMade: (choice: string, nextNodeId: string, riskModifier: number) => void;
  damage: number;
}

const ScenarioNode: React.FC<ScenarioNodeProps> = ({
  scenarioId,
  nodeId,
  scenarioText,
  choices,
  onChoiceMade,
  damage
}) => {
  const { outcome, loading, generateOutcome } = useScenarioOutcomeAI();

  const handleChoice = (choice: string, nextNodeId: string, riskModifier: number) => {
    generateOutcome(scenarioId, choice, { strikeLevel: 'Intermediate', grappleLevel: 'Intermediate' });
    onChoiceMade(choice, nextNodeId, riskModifier);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0A0B0D] p-6 rounded-xl border border-[#2A2B2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2">
          <div className="text-[8px] font-mono text-[#8E9299] uppercase">Damage Taken</div>
          <motion.div
            className="text-lg font-bold text-[#FF4444]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}
          >
            {damage}%
          </motion.div>
        </div>
        <p className="text-sm leading-relaxed text-[#E6E6E6]">{scenarioText}</p>
      </div>

      {outcome && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg"
        >
          <p className="text-[10px] font-mono uppercase text-blue-400 mb-2">AI Evaluation</p>
          <p className="text-xs text-[#E6E6E6]">{outcome.outcome}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-[#8E9299]">Success Rate: {outcome.successRate}%</span>
            <span className={`text-[10px] font-bold ${outcome.riskLevel === 'High' ? 'text-[#FF4444]' : 'text-yellow-500'}`}>
              Risk: {outcome.riskLevel}
            </span>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        <h3 className="text-[10px] font-mono uppercase text-[#8E9299] tracking-widest">Choose Your Action</h3>
        {choices.map((choice, i) => (
          <motion.button
            key={i}
            onClick={() => handleChoice(choice.action, choice.nextNodeId, choice.riskModifier)}
            disabled={loading}
            className="w-full text-left p-4 bg-[#1A1B1E] border border-[#2A2B2E] rounded-lg hover:border-[#FF4444] transition-all group disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold group-hover:text-[#FF4444]">{choice.action}</span>
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                  <ChevronRight className="w-4 h-4 text-[#8E9299]" />
                </motion.div>
              ) : (
                <ChevronRight className="w-4 h-4 text-[#8E9299]" />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export function ScenarioSimulator({ scenario, onExit, userStats }: ScenarioSimulatorProps) {
  const [nodeId, setNodeId] = React.useState('start');
  const [damage, setDamage] = React.useState(0);

  const currentNode = scenario.nodes[nodeId];
  const isEnd = !currentNode.choices || currentNode.choices.length === 0;

  const handleChoice = (choice: string, nextNodeId: string, riskModifier: number) => {
    const node = scenario.nodes[nodeId];
    const newDamage = Math.min(100, damage + node.damageAccumulation + riskModifier * 20);
    setDamage(newDamage);
    setNodeId(nextNodeId);
  };

  if (isEnd) {
    const outcome = damage < 50 ? 'success' : 'failure';
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
          transition={{ delay: 0.1 }}
        >
          {outcome === 'success' ? '⚔ VICTORY' : '❌ COMPROMISED'}
        </motion.h2>
        <motion.div
          className="mb-8"
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: 20, opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[#8E9299] text-xs font-mono uppercase mb-1">Mission Success Rate</p>
          <span className={`text-5xl font-black ${outcome === 'success' ? 'text-white' : 'text-[#FF4444]'}`}>
            {100 - damage}%
          </span>
        </motion.div>
        <motion.button
          onClick={onExit}
          className="w-full py-4 bg-[#FF4444] rounded-xl font-bold text-white uppercase tracking-widest"
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          CONTINUE →
        </motion.button>
      </motion.div>
    );
  }

  return (
    <Card className="border-l-4 border-l-purple-500">
      <SectionHeader title="Scenario Simulator" icon={Target} />
      <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">{scenario.title}</h2>
      <p className="text-[10px] text-[#8E9299] uppercase font-mono mb-6">
        Pillar: {scenario.pillar} • Difficulty: {scenario.difficulty}
      </p>

      <ScenarioNode
        scenarioId={scenario.id}
        nodeId={nodeId}
        scenarioText={currentNode.scenarioText}
        choices={currentNode.choices || []}
        onChoiceMade={handleChoice}
        damage={damage}
      />
    </Card>
  );
}
