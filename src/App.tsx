import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Sword, 
  Sprout, 
  Activity, 
  BookOpen, 
  ChevronRight, 
  Timer, 
  CheckCircle2, 
  Flame, 
  Zap,
  Menu,
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Download,
  Upload,
  QrCode,
  RefreshCw,
  Camera,
  Share2,
  Library,
  Info,
  Target,
  Leaf,
  Stethoscope,
  Search,
  BarChart3,
  PlayCircle,
  HeartPulse,
  Thermometer,
  Settings2,
  Lock,
  Unlock,
  FileText,
  Mail,
  Wifi,
  WifiOff,
  History,
  GripVertical
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import LZString from 'lz-string';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area
} from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { PHILOSOPHY, WEEKS, SKILL_TRACKS, WeekProgression, RED_FLAGS, TOOL_ANATOMY } from './data/manualContent';
import { SCENARIOS, PLANTS, EMERGENCY_PROTOCOLS, COMBAT_COURSES, RECOVERY_PROTOCOLS, CombatCourse, RecoveryProtocol } from './data/manualData';
import { 
  CombatSkillPillar, 
  CombatDrill, 
  MicroLesson, 
  CombatScenario, 
  CombatProgressState, 
  COMBAT_DRILLS, 
  MICRO_LESSONS, 
  COMBAT_SCENARIOS,
  PillarId
} from './data/combatData';
import { useStorage } from './hooks/useStorage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationCenter } from './components/NotificationCenter';
import { NotificationContext } from './contexts/NotificationContext';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { useOfflineStatus } from './hooks/useOfflineStatus';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFavorites } from './hooks/useFavorites';
import { useHistory } from './hooks/useHistory';
import { useAchievements } from './hooks/useAchievements';
import { useUndoRedo } from './hooks/useUndoRedo';

// --- Types ---
interface LogEntry {
  id: string;
  date: string;
  week: number;
  content: string;
  type?: 'note' | 'injury';
  severity?: number;
  bodyPart?: string;
}

interface Benchmarks {
  pushups: number;
  squats: number;
  plank: number;
  walk5km: boolean;
  history?: { date: string, pushups: number, squats: number, plank: number }[];
}

interface CustomBlockSegment {
  id: string;
  label: string;
  duration: number; // minutes
  enabled: boolean;
  type: string;
}

interface AppState {
  currentWeek: number;
  logs: LogEntry[];
  benchmarks: Benchmarks;
  courseProgress: Record<string, string[]>; // courseId -> array of videoIds
  customBlocks: Record<string, CustomBlockSegment[]>; // templateName -> segments
  activeBlockTemplate: string;
  searchHistory: string[];
  injuries: { id: string, bodyPart: string, type: string, severity: number, date: string, recovered: boolean }[];
  combatProgress: CombatProgressState;
}

// --- Components ---

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

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-5 h-5 text-[#FF4444]" />
    <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8E9299]">{title}</h2>
  </div>
);

// --- Haptic Feedback Helper ---
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      switch (type) {
        case 'light': navigator.vibrate(10); break;
        case 'medium': navigator.vibrate(30); break;
        case 'heavy': navigator.vibrate(60); break;
        case 'success': navigator.vibrate([20, 50, 20]); break;
        case 'error': navigator.vibrate([50, 100, 50, 100]); break;
      }
    } catch (e) {
      // Ignore vibration errors
    }
  }
};

// --- Animated Combat Components ---

const DrillCard = React.memo(({ drill, onOpen }: { drill: CombatDrill, onOpen: () => void }) => (
  <motion.div
    onClick={() => { triggerHaptic('light'); onOpen(); }}
    className="rounded-lg bg-[#1A1B1E] border border-[#2A2B2E] p-4 cursor-pointer hover:border-[#FF4444]/50 transition-colors"
    whileHover={{ scale: 1.02, borderColor: "#FF4444" }}
    whileTap={{ scale: 0.98, opacity: 0.9 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
  >
    <div className="flex justify-between items-start">
      <h3 className="text-[#FF4444] font-bold uppercase text-sm">{drill.name}</h3>
      <span className="text-[8px] font-mono bg-[#2A2B2E] px-1.5 py-0.5 rounded text-[#8E9299] uppercase">{drill.difficulty}</span>
    </div>
    <p className="text-[#8E9299] text-[10px] font-mono uppercase mt-1">{drill.pillar}</p>
  </motion.div>
));

const StartDrillButton = React.memo(({ onStart, label = "START DRILL", variant = "primary" }: { onStart: () => void, label?: string, variant?: "primary" | "secondary" }) => (
  <motion.button
    onClick={() => { triggerHaptic('medium'); onStart(); }}
    className={`w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest ${
      variant === "primary" ? "bg-[#FF4444] shadow-[0_0_20px_rgba(255,68,68,0.3)]" : "bg-[#2A2B2E] border border-[#3A3B3E]"
    }`}
    whileHover={{ scale: 1.02, boxShadow: variant === "primary" ? "0 0 25px rgba(255,68,68,0.5)" : "none" }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.15 }}
  >
    {variant === "primary" ? "⚡ " : ""}{label}
  </motion.button>
));

const ChecklistItem = React.memo(({ text, checked, onToggle }: { text: string, checked: boolean, onToggle: () => void }) => (
  <motion.div
    onClick={() => { triggerHaptic('light'); onToggle(); }}
    className="flex items-center gap-3 p-3 bg-[#0A0B0D] rounded-lg border border-[#2A2B2E] cursor-pointer select-none"
    whileTap={{ scale: 0.98 }}
  >
    <motion.div
      className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
        checked ? "bg-green-500 border-green-400" : "border-[#2A2B2E]"
      }`}
      animate={{
        scale: checked ? 1.1 : 1,
        backgroundColor: checked ? "#22c55e" : "transparent",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="text-white text-xs">✓</motion.div>
      )}
    </motion.div>
    <span className={`text-xs transition-colors ${checked ? 'text-[#8E9299] line-through' : 'text-white'}`}>{text}</span>
  </motion.div>
));

const DifficultyFilter = React.memo(({ selected, onSelect }: { selected: string, onSelect: (level: string) => void }) => (
  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
      <motion.button
        key={level}
        onClick={() => { triggerHaptic('light'); onSelect(level); }}
        className={`px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors shrink-0 ${
          selected === level ? "bg-[#FF4444] text-white" : "bg-[#1A1B1E] text-[#8E9299] border border-[#2A2B2E]"
        }`}
        animate={{
          scale: selected === level ? 1.05 : 1,
          backgroundColor: selected === level ? "#FF4444" : "#1A1B1E",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {level}
      </motion.button>
    ))}
  </div>
));

const ScenarioOutcomeCard = React.memo(({ outcome, score, onContinue }: { outcome: 'success' | 'failure', score: number, onContinue: () => void }) => {
  useEffect(() => {
    triggerHaptic(outcome === 'success' ? 'heavy' : 'error');
  }, [outcome]);

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
        <span className={`text-5xl font-black ${outcome === 'success' ? 'text-white' : 'text-[#FF4444]'}`}>{score}%</span>
      </motion.div>
      <motion.button
        onClick={() => { triggerHaptic('medium'); onContinue(); }}
        className="w-full py-4 bg-[#FF4444] rounded-xl font-bold text-white uppercase tracking-widest"
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        CONTINUE →
      </motion.button>
    </motion.div>
  );
});

// --- Scanner Component ---

const QrScanner = ({ onScan, onClose }: { onScan: (data: string) => void, onClose: () => void }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
      
      scannerRef.current.render((decodedText) => {
        onScan(decodedText);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
        }
      }, (error) => {
        // Ignore scan errors
      });
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner on unmount", err));
        scannerRef.current = null;
      }
    };
  }, []); // Empty dependency array to prevent re-initialization

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-mono font-bold">SCAN SYNC CODE</h2>
        <button onClick={onClose} className="p-2 bg-[#2A2B2E] rounded-full hover:bg-[#3A3B3E] transition-colors"><X /></button>
      </div>
      <div id="reader" className="w-full aspect-square bg-[#151619] rounded-xl overflow-hidden border-2 border-[#FF4444]"></div>
      <p className="text-center text-[#8E9299] text-xs mt-6 font-mono uppercase">Point camera at the QR code on your other device</p>
    </div>
  );
};

// --- Sortable Item for Custom Blocks ---
const SortableItem = ({ id, segment, onToggle, onTimeChange }: { id: string, segment: CustomBlockSegment, onToggle: () => void, onTimeChange: (val: number) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-3 p-3 rounded-lg border ${segment.enabled ? 'bg-[#1A1B1E] border-[#2A2B2E]' : 'bg-[#0A0B0D] border-[#2A2B2E] opacity-50'}`}>
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-[#8E9299]" />
      </div>
      <button onClick={onToggle} className={`w-4 h-4 rounded border ${segment.enabled ? 'bg-[#FF4444] border-[#FF4444]' : 'border-[#2A2B2E]'}`}>
        {segment.enabled && <CheckCircle2 className="w-3 h-3 text-white" />}
      </button>
      <div className="flex-1">
        <p className="text-xs font-bold">{segment.label}</p>
        <div className="flex items-center gap-2 mt-1">
          <input 
            type="number" 
            value={segment.duration} 
            onChange={(e) => onTimeChange(parseInt(e.target.value) || 10)}
            className="w-12 bg-[#0A0B0D] border border-[#2A2B2E] rounded px-1 text-[10px] font-mono"
            min="10"
            max="60"
          />
          <span className="text-[10px] text-[#8E9299] uppercase font-mono">min</span>
        </div>
      </div>
    </div>
  );
};

  // --- Search Logic ---
  const searchItems = () => {
    if (!searchQuery) return [];
    const results: { type: string, title: string, content: string, tab: string }[] = [];
    
    // Drills
    SKILL_TRACKS.forEach(t => {
      t.drills.forEach(d => {
        if (d.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ type: 'Drill', title: t.title, content: d, tab: 'skills' });
        }
      });
    });

    // Missions
    SCENARIOS.forEach(s => {
      if (s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.objective.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: 'Mission', title: s.title, content: s.objective, tab: 'scenarios' });
      }
    });

    // Reference
    RED_FLAGS.forEach(f => {
      if (f.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: 'Red Flag', title: f.title, content: f.symptoms.join(', '), tab: 'reference' });
      }
    });
    PLANTS.forEach(p => {
      if (p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: 'Plant', title: p.name, content: p.identification, tab: 'reference' });
      }
    });
    TOOL_ANATOMY.forEach(t => {
      if (t.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: 'Tool', title: t.name, content: t.design.join(', '), tab: 'reference' });
      }
    });

    // Logs
    logs.forEach(l => {
      if (l.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: 'Field Note', title: l.date, content: l.content, tab: 'assessment' });
      }
    });

    return results.slice(0, 10);
  };

  // --- Combat Logic ---
  const getAiFocusPillar = () => {
    const pillars = Object.values(combatProgress.pillars);
    const weights = pillars.map(p => {
      let weight = 1.0;
      if (p.rustyFlag) weight += 1.5;
      
      // Check for injuries affecting this pillar
      const activeInjuries = injuries.filter(i => !i.recovered);
      const pillarDrills = COMBAT_DRILLS.filter(d => d.pillar === p.id);
      const isAffectedByInjury = pillarDrills.some(d => 
        d.injuryTags.some(tag => activeInjuries.some(i => i.bodyPart.toLowerCase() === tag.toLowerCase()))
      );
      
      if (isAffectedByInjury) weight -= 0.5;
      
      // Phase priority (simplified)
      if (currentWeek <= 8 && p.id === 'striking') weight += 0.5;
      if (currentWeek > 8 && currentWeek <= 16 && p.id === 'weaponTransitions') weight += 0.5;
      if (currentWeek > 16 && p.id === 'grappling') weight += 0.5;
      
      return { id: p.id, weight };
    });
    
    return weights.sort((a, b) => b.weight - a.weight)[0].id;
  };

  const updateCombatXp = (pillarId: PillarId, amount: number) => {
    const pillar = combatProgress.pillars[pillarId];
    const newXp = pillar.xp + amount;
    const newProgress = Math.min(100, (newXp % 1000) / 10);
    const newLevel = newXp >= 2000 ? 'Advanced' : newXp >= 1000 ? 'Intermediate' : 'Beginner';
    
    if (newLevel !== pillar.level) {
      triggerHaptic('success');
    }

    setCombatProgress({
      ...combatProgress,
      pillars: {
        ...combatProgress.pillars,
        [pillarId]: {
          ...pillar,
          xp: newXp,
          progressPercent: newProgress,
          level: newLevel,
          lastPracticedDate: new Date().toISOString(),
          daysWithoutPractice: 0,
          rustyFlag: false
        }
      }
    });
  };

  const currentBlock = customBlocks[activeBlockTemplate] || customBlocks["Standard"];
  
  // --- Injury Filtering ---
  const isDrillDisabled = (drill: string) => {
    const activeInjuries = injuries.filter(i => !i.recovered);
    for (const injury of activeInjuries) {
      const part = injury.bodyPart.toLowerCase();
      const d = drill.toLowerCase();
      if (part === 'shoulder' && (d.includes('weapon') || d.includes('punch') || d.includes('strike'))) return true;
      if (part === 'knee' && (d.includes('squat') || d.includes('run') || d.includes('kick') || d.includes('walk'))) return true;
      if (part === 'wrist' && (d.includes('blade') || d.includes('climb') || d.includes('machete'))) return true;
    }
    return false;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = currentBlock.findIndex(item => item.id === active.id);
      const newIndex = currentBlock.findIndex(item => item.id === over.id);
      const newSegments = arrayMove(currentBlock, oldIndex, newIndex);
      setCustomBlocks({ ...customBlocks, [activeBlockTemplate]: newSegments });
    }
  };

  const toggleSegment = (id: string) => {
    const newSegments = currentBlock.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
    setCustomBlocks({ ...customBlocks, [activeBlockTemplate]: newSegments });
  };

  const updateSegmentTime = (id: string, duration: number) => {
    const newSegments = currentBlock.map(s => s.id === id ? { ...s, duration } : s);
    setCustomBlocks({ ...customBlocks, [activeBlockTemplate]: newSegments });
  };

  // --- Sync Logic ---
  
  const exportPdf = async () => {
    try {
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString();
      
      doc.setFontSize(22);
      doc.setTextColor(255, 68, 68);
      doc.text('ANCHOR TRAINING REPORT', 20, 30);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${date}`, 20, 40);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text('SUMMARY', 20, 60);
      doc.setFontSize(10);
      doc.text(`Current Week: ${currentWeek}`, 20, 70);
      doc.text(`Phase: ${weekData.phase}`, 20, 80);
      doc.text(`Total Logs: ${logs.length}`, 20, 90);
      
      doc.setFontSize(14);
      doc.text('BENCHMARKS', 20, 110);
      doc.setFontSize(10);
      doc.text(`Max Pushups: ${benchmarks.pushups}`, 20, 120);
      doc.text(`Max Squats: ${benchmarks.squats}`, 20, 130);
      doc.text(`Plank: ${benchmarks.plank}s`, 20, 140);
      doc.text(`5km Walk: ${benchmarks.walk5km ? 'Completed' : 'Not Completed'}`, 20, 150);
      
      doc.setFontSize(14);
      doc.text('RECENT FIELD NOTES', 20, 170);
      let y = 180;
      logs.slice(0, 5).forEach(log => {
        doc.setFontSize(8);
        doc.text(`${log.date} - ${log.content.substring(0, 80)}...`, 20, y);
        y += 10;
      });
      
      doc.save(`ANCHOR_Training_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      alert("PDF Report generated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF.");
    }
  };

  const exportData = () => {
    try {
      const state: AppState = { 
        currentWeek, 
        logs, 
        benchmarks,
        courseProgress,
        customBlocks,
        activeBlockTemplate,
        searchHistory,
        injuries,
        combatProgress
      };
      const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anchor_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed.");
    }
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const state: AppState = JSON.parse(event.target?.result as string);
        if (state && typeof state.currentWeek === 'number') {
          setCurrentWeek(state.currentWeek);
          setLogs(state.logs || []);
          setBenchmarks(state.benchmarks || { pushups: 0, squats: 0, plank: 0, walk5km: false, history: [] });
          setCourseProgress(state.courseProgress || {});
          setCustomBlocks(state.customBlocks || {});
          setActiveBlockTemplate(state.activeBlockTemplate || 'Standard');
          setSearchHistory(state.searchHistory || []);
          setInjuries(state.injuries || []);
          if (state.combatProgress) setCombatProgress(state.combatProgress);
          alert("Data imported successfully.");
        }
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const generateQrSync = () => {
    try {
      const state: AppState = { 
        currentWeek, 
        logs, 
        benchmarks,
        courseProgress,
        customBlocks,
        activeBlockTemplate,
        searchHistory,
        injuries,
        combatProgress
      };
      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
      setQrData(compressed);
    } catch (err) {
      alert("Failed to generate QR code.");
    }
  };

  const handleQrScan = React.useCallback((decodedText: string) => {
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(decodedText);
      if (!decompressed) throw new Error("Decompression failed");
      const state: AppState = JSON.parse(decompressed);
      
      // Basic validation
      if (state && typeof state.currentWeek === 'number' && Array.isArray(state.logs)) {
        setCurrentWeek(state.currentWeek);
        setLogs(state.logs);
        setBenchmarks(state.benchmarks || { pushups: 0, squats: 0, plank: 0, walk5km: false, history: [] });
        setCourseProgress(state.courseProgress || {});
        setCustomBlocks(state.customBlocks || {});
        setActiveBlockTemplate(state.activeBlockTemplate || 'Standard');
        setSearchHistory(state.searchHistory || []);
        setInjuries(state.injuries || []);
        if (state.combatProgress) setCombatProgress(state.combatProgress);
        setShowScanner(false);
        alert("Sync successful.");
      } else {
        throw new Error("Invalid state structure");
      }
    } catch (err) {
      alert("Invalid sync code.");
    }
  }, [setCurrentWeek, setLogs, setBenchmarks]);

  const resetData = () => {
    if (window.confirm("Are you sure? This will delete all your local progress and logs.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <ErrorBoundary>
      <NotificationContext.Provider value={{ notifications: [], addNotification: () => {} }}>
        <div className="min-h-screen bg-[#0A0B0D] text-white font-sans selection:bg-[#FF4444]/30">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#151619]/80 backdrop-blur-md border-b border-[#2A2B2E] z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF4444] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,68,68,0.4)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono font-bold tracking-tighter text-xl hidden sm:block">ANCHOR</span>
          </div>
          
          <div className="relative group">
            <div className={`flex items-center gap-2 bg-[#0A0B0D] border ${showSearch ? 'border-[#FF4444] w-48 sm:w-64' : 'border-[#2A2B2E] w-10 sm:w-48'} rounded-lg px-3 py-1.5 transition-all duration-300`}>
              <Search className="w-4 h-4 text-[#8E9299]" onClick={() => setShowSearch(!showSearch)} />
              <input 
                type="text" 
                placeholder="Search drills, missions..." 
                className={`bg-transparent border-none outline-none text-xs w-full ${showSearch ? 'block' : 'hidden sm:block'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
              />
            </div>
            
            {showSearch && searchQuery && (
              <div className="absolute top-12 left-0 right-0 bg-[#151619] border border-[#2A2B2E] rounded-xl shadow-2xl p-2 z-50 max-h-96 overflow-y-auto">
                {searchItems().length === 0 ? (
                  <p className="text-[10px] text-[#8E9299] p-4 text-center uppercase font-mono">No results found</p>
                ) : (
                  searchItems().map((res, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setActiveTab(res.tab);
                        setShowSearch(false);
                        setSearchQuery('');
                        if (!searchHistory.includes(searchQuery)) {
                          setSearchHistory([searchQuery, ...searchHistory].slice(0, 5));
                        }
                      }}
                      className="w-full text-left p-3 hover:bg-[#2A2B2E] rounded-lg transition-colors border-b border-[#2A2B2E] last:border-none"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-mono text-[#FF4444] uppercase">{res.type}</span>
                        <span className="text-[10px] font-mono text-[#8E9299] uppercase">{res.tab}</span>
                      </div>
                      <p className="text-xs font-bold text-[#E6E6E6]">{res.title}</p>
                      <p className="text-[10px] text-[#8E9299] truncate">{res.content}</p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0A0B0D] rounded-full border border-[#2A2B2E]">
            {isOnline ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
            <span className="text-[10px] font-mono uppercase text-[#8E9299]">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-[#2A2B2E] rounded-lg transition-colors">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 top-16 bg-[#0A0B0D] z-40 p-6 flex flex-col gap-4 overflow-y-auto"
          >
            {['dashboard', 'progression', 'combat', 'skills', 'scenarios', 'courses', 'stats', 'reference', 'assessment', 'sync', 'philosophy'].map((tab) => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab); setIsMenuOpen(false); }}
                className={`text-left py-4 border-b border-[#2A2B2E] uppercase font-mono tracking-widest text-sm ${activeTab === tab ? 'text-[#FF4444]' : 'text-[#8E9299]'}`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        {/* --- Dashboard --- */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">COMMAND CENTER</h1>
                <p className="text-[#8E9299] font-mono text-xs mt-1 uppercase tracking-wider">PHASE {weekData.phase} • WEEK {currentWeek}</p>
              </div>
              <div className="text-right">
                <span className="text-[#FF4444] font-mono text-2xl font-bold">03:00:00</span>
                <p className="text-[10px] text-[#8E9299] uppercase font-mono">Training Block</p>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-[#151619] to-[#1A1B1E] border-l-4 border-l-[#FF4444]">
              <SectionHeader title="Current Theme" icon={Flame} />
              <h3 className="text-xl font-bold mb-2">{weekData.theme}</h3>
              <p className="text-sm text-[#8E9299] leading-relaxed mb-4">{weekData.goals[0]}</p>
              <Button className="w-full flex items-center justify-center gap-2">
                <Timer className="w-4 h-4" /> START TRAINING BLOCK
              </Button>
            </Card>

            {/* Combat Focus Today Card */}
            <Card className="bg-[#1A1B1E] border border-[#FF4444]/20">
              <div className="flex justify-between items-center mb-4">
                <SectionHeader title="Combat Focus Today" icon={Target} />
                <span className="text-[10px] font-mono text-[#FF4444] uppercase bg-[#FF4444]/10 px-2 py-1 rounded">AI Selected</span>
              </div>
              {(() => {
                const focusPillarId = getAiFocusPillar();
                const pillar = combatProgress.pillars[focusPillarId];
                const drill = COMBAT_DRILLS.find(d => d.pillar === focusPillarId);
                const lesson = MICRO_LESSONS.find(l => l.pillar === focusPillarId);
                const scenario = COMBAT_SCENARIOS.find(s => s.pillar === focusPillarId);
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#2A2B2E] rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-[#FF4444]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase">{pillar.name}</h4>
                        <p className="text-[10px] text-[#8E9299] uppercase font-mono">Level: {pillar.level}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {drill && (
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { triggerHaptic('light'); handleDrillClick(drill); setActiveTab('combat'); }} 
                          className="flex items-center justify-between p-3 bg-[#0A0B0D] rounded-lg border border-[#2A2B2E] hover:border-[#FF4444]/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <PlayCircle className="w-4 h-4 text-[#FF4444]" />
                            <span className="text-xs font-bold">{drill.name}</span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-[#8E9299]" />
                        </motion.button>
                      )}
                      {lesson && (
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { triggerHaptic('light'); handleLessonClick(lesson); setActiveTab('combat'); }} 
                          className="flex items-center justify-between p-3 bg-[#0A0B0D] rounded-lg border border-[#2A2B2E] hover:border-[#FF4444]/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#FF4444]" />
                            <span className="text-xs font-bold">{lesson.title}</span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-[#8E9299]" />
                        </motion.button>
                      )}
                      {scenario && (
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { triggerHaptic('light'); handleScenarioClick(scenario); setActiveTab('combat'); }} 
                          className="flex items-center justify-between p-3 bg-[#0A0B0D] rounded-lg border border-[#2A2B2E] hover:border-[#FF4444]/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-[#FF4444]" />
                            <span className="text-xs font-bold">{scenario.title}</span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-[#8E9299]" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="flex flex-col items-center text-center py-6">
                <Activity className="w-6 h-6 text-[#FF4444] mb-2" />
                <span className="text-2xl font-bold">{logs.length}</span>
                <span className="text-[10px] text-[#8E9299] uppercase font-mono">Sessions Logged</span>
              </Card>
              <Card className="flex flex-col items-center text-center py-6">
                <Zap className="w-6 h-6 text-[#FF4444] mb-2" />
                <span className="text-2xl font-bold">{Math.round((currentWeek / 24) * 100)}%</span>
                <span className="text-[10px] text-[#8E9299] uppercase font-mono">Progression</span>
              </Card>
            </div>

            <div className="flex justify-between items-center">
              <SectionHeader title="Today's Training Block" icon={Activity} />
              <button 
                onClick={() => setShowCustomize(true)}
                className="text-[10px] font-mono text-[#FF4444] uppercase flex items-center gap-1 border border-[#FF4444]/30 px-2 py-1 rounded"
              >
                <Settings2 className="w-3 h-3" /> Customize
              </button>
            </div>

            <div className="space-y-4">
              {currentBlock.filter(s => s.enabled).map((block, idx) => (
                <div key={block.id} className="relative pl-8">
                  {idx !== currentBlock.filter(s => s.enabled).length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-[#2A2B2E]" />
                  )}
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#151619] border-2 border-[#2A2B2E] flex items-center justify-center z-10">
                    <span className="text-[10px] font-mono text-[#8E9299]">{idx + 1}</span>
                  </div>
                  <Card className={`${isDrillDisabled(block.label) ? 'opacity-50 border-red-900/50' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold uppercase tracking-tight">{block.label}</h3>
                      <span className="text-[10px] font-mono text-[#FF4444]">{block.duration} MIN</span>
                    </div>
                    <div className="text-xs text-[#8E9299] leading-relaxed">
                      {isDrillDisabled(block.label) ? (
                        <span className="text-red-500 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> DRILL DISABLED DUE TO INJURY
                        </span>
                      ) : (
                        <ul className="space-y-1">
                          {(weekData.block[block.type as keyof typeof weekData.block] as string[] || []).map((drill, i) => (
                            <li key={i} className="flex gap-2"><span className="text-[#FF4444]">•</span> {drill}</li>
                          ))}
                          {block.type === 'prep' && <li>• Lay out tools</li>}
                          {block.type === 'prep' && <li>• Mental prep (Box breathing)</li>}
                          {block.type === 'break' && <li>• Hydration & Reset</li>}
                          {block.type === 'cooldown' && <li>• Full-body stretching</li>}
                          {block.type === 'cooldown' && <li>• Write field notes</li>}
                        </ul>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {showCustomize && (
              <div className="fixed inset-0 bg-[#0A0B0D]/95 z-[60] p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <SectionHeader title="Customize Block" icon={Settings2} />
                  <button onClick={() => setShowCustomize(false)} className="p-2 hover:bg-[#2A2B2E] rounded-lg">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-[#FF4444] text-white text-[10px] font-mono rounded uppercase">Standard</button>
                    <button className="flex-1 py-2 bg-[#151619] border border-[#2A2B2E] text-[#8E9299] text-[10px] font-mono rounded uppercase">Light</button>
                    <button className="flex-1 py-2 bg-[#151619] border border-[#2A2B2E] text-[#8E9299] text-[10px] font-mono rounded uppercase">Heavy</button>
                  </div>

                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={currentBlock.map(s => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {currentBlock.map((segment) => (
                          <div key={segment.id}>
                            <SortableItem 
                              id={segment.id} 
                              segment={segment} 
                              onToggle={() => toggleSegment(segment.id)}
                              onTimeChange={(val) => updateSegmentTime(segment.id, val)}
                            />
                          </div>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <Button onClick={() => setShowCustomize(false)} className="w-full py-4 mt-4">SAVE CONFIGURATION</Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* --- Philosophy --- */}
        {activeTab === 'philosophy' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#FF4444] shadow-[0_0_15px_rgba(255,68,68,0.5)]" />
              <h1 className="text-4xl font-black uppercase leading-none tracking-tighter mb-4">
                {PHILOSOPHY.title}
              </h1>
              <p className="text-[#FF4444] font-mono italic text-lg mb-6">"{PHILOSOPHY.hook}"</p>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-[#E6E6E6] leading-relaxed whitespace-pre-line">
                {PHILOSOPHY.content}
              </p>
            </div>

            <div className="space-y-4">
              <SectionHeader title="Core Principles" icon={Zap} />
              {PHILOSOPHY.principles.map((p, i) => (
                <div key={i}>
                  <Card>
                    <h3 className="font-bold text-[#FF4444] mb-1">{p.title}</h3>
                    <p className="text-sm text-[#8E9299] leading-relaxed">{p.desc}</p>
                  </Card>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- Progression --- */}
        {activeTab === 'progression' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <SectionHeader title="24-Week Roadmap" icon={ChevronRight} />
            
            {/* Progress Visualization */}
            <Card className="p-6 bg-gradient-to-br from-[#151619] to-[#0A0B0D]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#8E9299]">Overall Progress</h3>
                <span className="text-xl font-bold text-[#FF4444]">{Math.round((currentWeek / 24) * 100)}%</span>
              </div>
              <div className="w-full bg-[#2A2B2E] h-3 rounded-full overflow-hidden mb-6">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentWeek / 24) * 100}%` }}
                  className="bg-[#FF4444] h-full shadow-[0_0_15px_rgba(255,68,68,0.5)]"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(phase => (
                  <div key={phase} className="text-center">
                    <div className={`h-1 rounded-full mb-2 ${currentWeek > (phase - 1) * 8 ? 'bg-[#FF4444]' : 'bg-[#2A2B2E]'}`} />
                    <span className={`text-[8px] font-mono uppercase ${currentWeek > (phase - 1) * 8 ? 'text-[#FF4444]' : 'text-[#8E9299]'}`}>Phase {phase}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Combat Skills Subsection */}
            <SectionHeader title="Combat Skill Pillars" icon={Shield} />
            <div className="grid grid-cols-1 gap-4">
              {Object.values(combatProgress.pillars).map(pillar => (
                <motion.div 
                  key={pillar.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { triggerHaptic('light'); setDrillPillarFilter(pillar.id); setActiveTab('combat'); }}
                >
                  <Card className="p-4 cursor-pointer hover:border-[#FF4444]/50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider">{pillar.name}</h4>
                      <div className="flex items-center gap-2">
                        {pillar.rustyFlag && (
                          <span className="text-[8px] font-mono bg-orange-900/20 text-orange-500 px-1.5 py-0.5 rounded border border-orange-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-2 h-2" /> RUSTY
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-[#FF4444] uppercase">{pillar.level}</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#2A2B2E] h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pillar.progressPercent}%` }}
                        className="bg-[#FF4444] h-full" 
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[8px] font-mono text-[#8E9299] uppercase">XP: {pillar.xp}</span>
                      <span className="text-[8px] font-mono text-[#8E9299] uppercase">{pillar.progressPercent}% to next level</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              {WEEKS.map((w) => (
                <div key={w.week}>
                  <button 
                    onClick={() => setCurrentWeek(w.week)}
                    className={`w-full text-left transition-all ${currentWeek === w.week ? 'scale-[1.02]' : 'opacity-60 grayscale'}`}
                  >
                    <Card className={`${currentWeek === w.week ? 'border-[#FF4444]' : 'border-[#2A2B2E]'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8E9299]">Week {w.week}</span>
                          <h3 className="font-bold text-lg">{w.theme}</h3>
                        </div>
                        {currentWeek === w.week && <CheckCircle2 className="text-[#FF4444]" />}
                      </div>
                    </Card>
                  </button>
                  
                  {[8, 16, 24].includes(w.week) && (
                    <div className="my-6 p-5 bg-red-900/10 border-2 border-dashed border-red-900/30 rounded-2xl text-center">
                      <AlertTriangle className="w-6 h-6 text-[#FF4444] mx-auto mb-2" />
                      <h3 className="font-bold text-[#FF4444] uppercase tracking-widest text-xs">Phase {w.phase} Checkpoint</h3>
                      <p className="text-[10px] text-[#8E9299] mt-1 mb-3">Assess your readiness before moving to the next phase.</p>
                      <Button variant="secondary" className="text-[10px] py-1" onClick={() => setActiveTab('assessment')}>OPEN ASSESSMENT</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- Combat Tab --- */}
        {activeTab === 'combat' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {!activeDrill && !activeLesson && !activeScenario && !drillPillarFilter ? (
              <>
                <SectionHeader title="Combat Skill Pillars" icon={Shield} />
                <div className="grid grid-cols-1 gap-4">
                  {Object.values(combatProgress.pillars).map(pillar => (
                    <Card key={pillar.id} className="relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold uppercase tracking-tighter">{pillar.name}</h3>
                          <p className="text-xs text-[#8E9299] mt-1">{pillar.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-[#FF4444]">{pillar.progressPercent}%</span>
                          <p className="text-[10px] font-mono text-[#8E9299] uppercase">{pillar.level}</p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-[#2A2B2E] h-1.5 rounded-full overflow-hidden mb-6">
                        <div className="bg-[#FF4444] h-full" style={{ width: `${pillar.progressPercent}%` }} />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="secondary" className="text-[10px] py-2" onClick={() => setDrillPillarFilter(pillar.id)}>DRILLS</Button>
                        <Button variant="secondary" className="text-[10px] py-2" onClick={() => {
                          const lesson = MICRO_LESSONS.find(l => l.pillar === pillar.id);
                          if (lesson) handleLessonClick(lesson);
                        }}>LESSONS</Button>
                        <Button variant="secondary" className="text-[10px] py-2" onClick={() => {
                          const scenario = COMBAT_SCENARIOS.find(s => s.pillar === pillar.id);
                          if (scenario) handleScenarioClick(scenario);
                        }}>SCENARIOS</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : drillPillarFilter ? (
              <div className="space-y-6">
                <button onClick={() => setDrillPillarFilter(null)} className="flex items-center gap-2 text-[#8E9299] hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span className="text-xs font-mono uppercase">Back to Pillars</span>
                </button>
                <SectionHeader title={`${combatProgress.pillars[drillPillarFilter].name} Drills`} icon={Zap} />
                <DifficultyFilter selected={drillDifficulty} onSelect={setDrillDifficulty} />
                <div className="grid grid-cols-1 gap-3">
                  {COMBAT_DRILLS.filter(d => d.pillar === drillPillarFilter && d.difficulty === drillDifficulty).map(drill => (
                    <DrillCard key={drill.id} drill={drill} onOpen={() => handleDrillClick(drill)} />
                  ))}
                </div>
              </div>
            ) : activeDrill ? (
              <div className="space-y-6">
                <button onClick={() => setActiveDrill(null)} className="flex items-center gap-2 text-[#8E9299] hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span className="text-xs font-mono uppercase">Back to Drills</span>
                </button>
                
                <Card className="border-l-4 border-l-[#FF4444]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold uppercase tracking-tight">{activeDrill.name}</h2>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] font-mono bg-[#2A2B2E] px-2 py-1 rounded text-[#8E9299] uppercase">{activeDrill.difficulty}</span>
                        <span className="text-[10px] font-mono bg-[#FF4444]/10 px-2 py-1 rounded text-[#FF4444] uppercase">{activeDrill.pillar}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#E6E6E6] leading-relaxed mb-6">{activeDrill.description}</p>
                  
                  {activeDrill.injuryTags.some(tag => injuries.filter(i => !i.recovered).some(i => i.bodyPart.toLowerCase() === tag.toLowerCase())) && (
                    <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg mb-6 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#FF4444] shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#FF4444] uppercase">Injury Warning</p>
                        <p className="text-[10px] text-red-200/70">This drill affects body parts where you have active injuries. Proceed with extreme caution or pick an alternative.</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-mono uppercase text-[#8E9299] mb-4 tracking-widest">Step-by-Step Instructions</h3>
                      <div className="space-y-4">
                        {activeDrill.steps.map((step) => (
                          <div key={step.order} className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-[#2A2B2E] flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-mono text-white">{step.order}</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold">{step.instruction}</p>
                              <p className="text-xs text-[#8E9299] italic mt-1">Tip: {step.tip}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#2A2B2E]">
                      <h3 className="text-xs font-mono uppercase text-[#8E9299] mb-4 tracking-widest">Form Checklist</h3>
                      <div className="space-y-2">
                        {activeDrill.formChecklist.map((item, i) => (
                          <ChecklistItem 
                            key={i} 
                            text={item.item} 
                            checked={!!item.checked} 
                            onToggle={() => {
                              const newChecklist = [...activeDrill.formChecklist];
                              newChecklist[i] = { ...item, checked: !item.checked };
                              setActiveDrill({ ...activeDrill, formChecklist: newChecklist });
                            }} 
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#2A2B2E]">
                      <h3 className="text-xs font-mono uppercase text-[#8E9299] mb-2 tracking-widest">Common Mistakes</h3>
                      <ul className="space-y-1">
                        {activeDrill.commonMistakes.map((mistake, i) => (
                          <li key={i} className="text-xs text-red-400/70 flex gap-2">
                            <span className="text-[#FF4444]">•</span> {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 grid grid-cols-2 gap-4">
                      <div className="bg-[#0A0B0D] p-4 rounded-xl border border-[#2A2B2E] text-center">
                        <p className="text-[10px] font-mono text-[#8E9299] uppercase mb-1">Target Sets</p>
                        <p className="text-2xl font-bold">{activeDrill.sets || '-'}</p>
                      </div>
                      <div className="bg-[#0A0B0D] p-4 rounded-xl border border-[#2A2B2E] text-center">
                        <p className="text-[10px] font-mono text-[#8E9299] uppercase mb-1">{activeDrill.duration ? 'Duration (s)' : 'Reps'}</p>
                        <p className="text-2xl font-bold">{activeDrill.duration || activeDrill.reps || '-'}</p>
                      </div>
                    </div>

                    <StartDrillButton onStart={() => {
                      updateCombatXp(activeDrill.pillar, 50);
                      setLogs([{ id: Date.now().toString(), date: new Date().toLocaleDateString(), week: currentWeek, content: `COMPLETED DRILL: ${activeDrill.name}. XP Gained: 50.` }, ...logs]);
                      setActiveDrill(null);
                      alert("Drill logged. XP gained!");
                    }} label="LOG COMPLETION (+50 XP)" />
                  </div>
                </Card>
              </div>
            ) : activeLesson ? (
              <div className="space-y-6">
                <button onClick={() => { setActiveLesson(null); setShowQuizResult(false); setQuizAnswers({}); }} className="flex items-center gap-2 text-[#8E9299] hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span className="text-xs font-mono uppercase">Back to Pillars</span>
                </button>

                <Card className="border-l-4 border-l-blue-500">
                  <SectionHeader title="Micro-Lesson" icon={BookOpen} />
                  <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">{activeLesson.title}</h2>
                  
                  <div className="bg-[#0A0B0D] p-6 rounded-xl border border-[#2A2B2E] mb-8">
                    <p className="text-sm leading-relaxed text-[#E6E6E6] whitespace-pre-line">
                      {activeLesson.concept}
                    </p>
                  </div>

                  {!showQuizResult ? (
                    <div className="space-y-8">
                      <h3 className="text-xs font-mono uppercase text-[#8E9299] tracking-widest">Knowledge Check</h3>
                      {activeLesson.quiz.map((q) => (
                        <div key={q.id} className="space-y-4">
                          <p className="text-sm font-bold">{q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((opt) => (
                              <button 
                                key={opt.id}
                                onClick={() => { triggerHaptic('light'); setQuizAnswers({ ...quizAnswers, [q.id]: opt.id }); }}
                                className={`w-full text-left p-4 rounded-lg border transition-all ${quizAnswers[q.id] === opt.id ? 'border-[#FF4444] bg-[#FF4444]/10' : 'border-[#2A2B2E] hover:border-[#8E9299]'}`}
                              >
                                <span className="text-xs">{opt.text}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <StartDrillButton 
                        onStart={() => setShowQuizResult(true)}
                        label="SUBMIT ANSWERS"
                        variant={Object.keys(quizAnswers).length < activeLesson.quiz.length ? "secondary" : "primary"}
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center py-8">
                        {(() => {
                          const correctCount = activeLesson.quiz.filter(q => q.options.find(o => o.id === quizAnswers[q.id])?.correct).length;
                          const score = Math.round((correctCount / activeLesson.quiz.length) * 100);
                          return (
                            <>
                              <div className={`text-4xl font-black mb-2 ${score >= 80 ? 'text-green-500' : 'text-[#FF4444]'}`}>{score}%</div>
                              <p className="text-sm text-[#8E9299] uppercase font-mono tracking-widest">
                                {score >= 80 ? 'LESSON MASTERED' : 'RETRY RECOMMENDED'}
                              </p>
                              {score >= 80 && (
                                <div className="mt-4 p-4 bg-green-900/10 border border-green-500/30 rounded-lg">
                                  <p className="text-xs text-green-500">XP Gained: 100. New drills unlocked.</p>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>

                      <div className="space-y-6">
                        {activeLesson.quiz.map((q) => {
                          const selected = q.options.find(o => o.id === quizAnswers[q.id]);
                          return (
                            <div key={q.id} className="p-4 bg-[#0A0B0D] rounded-lg border border-[#2A2B2E]">
                              <p className="text-xs font-bold mb-2">{q.question}</p>
                              <p className={`text-[10px] mb-2 ${selected?.correct ? 'text-green-500' : 'text-[#FF4444]'}`}>
                                Your Answer: {selected?.text} {selected?.correct ? '(Correct)' : '(Incorrect)'}
                              </p>
                              <p className="text-[10px] text-[#8E9299] italic">
                                <span className="text-white not-italic font-bold">Explanation:</span> {q.explanation}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <StartDrillButton onStart={() => {
                        const correctCount = activeLesson.quiz.filter(q => q.options.find(o => o.id === quizAnswers[q.id])?.correct).length;
                        const score = Math.round((correctCount / activeLesson.quiz.length) * 100);
                        if (score >= 80) {
                          updateCombatXp(activeLesson.pillar, 100);
                        }
                        setActiveLesson(null);
                        setShowQuizResult(false);
                        setQuizAnswers({});
                      }} label="FINISH LESSON" />
                    </div>
                  )}
                </Card>
              </div>
            ) : activeScenario ? (
              <div className="space-y-6">
                <button onClick={() => setActiveScenario(null)} className="flex items-center gap-2 text-[#8E9299] hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span className="text-xs font-mono uppercase">Exit Simulator</span>
                </button>

                <Card className="border-l-4 border-l-purple-500">
                  <SectionHeader title="Scenario Simulator" icon={Target} />
                  <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">{activeScenario.title}</h2>
                  <p className="text-[10px] text-[#8E9299] uppercase font-mono mb-6">Pillar: {activeScenario.pillar} • Difficulty: {activeScenario.difficulty}</p>
                  
                  {(() => {
                    const node = activeScenario.nodes[scenarioNodeId];
                    const isEnd = !node.choices || node.choices.length === 0;
                    
                    if (isEnd) {
                      const outcome = scenarioDamage < 50 ? 'success' : 'failure';
                      return (
                        <ScenarioOutcomeCard 
                          outcome={outcome} 
                          score={100 - scenarioDamage} 
                          onContinue={() => {
                            if (outcome === 'success') updateCombatXp(activeScenario.pillar, 150);
                            setActiveScenario(null);
                          }} 
                        />
                      );
                    }

                    return (
                      <div className="space-y-6">
                        <div className="bg-[#0A0B0D] p-6 rounded-xl border border-[#2A2B2E] relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-2">
                            <div className="text-[8px] font-mono text-[#8E9299] uppercase">Damage Taken</div>
                            <div className="text-lg font-bold text-[#FF4444]">{scenarioDamage}%</div>
                          </div>
                          <p className="text-sm leading-relaxed text-[#E6E6E6]">
                            {node.scenarioText}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-[10px] font-mono uppercase text-[#8E9299] tracking-widest">Choose Your Action</h3>
                          {node.choices.map((choice, i) => (
                            <button 
                              key={i}
                              onClick={() => {
                                triggerHaptic('medium');
                                setScenarioNodeId(choice.nextNodeId);
                                setScenarioDamage(prev => Math.min(100, prev + node.damageAccumulation + (choice.riskModifier * 20)));
                              }}
                              className="w-full text-left p-4 bg-[#1A1B1E] border border-[#2A2B2E] rounded-lg hover:border-[#FF4444] transition-all group"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold group-hover:text-[#FF4444]">{choice.action}</span>
                                <ChevronRight className="w-4 h-4 text-[#8E9299]" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </Card>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* --- Skills --- */}
        {activeTab === 'skills' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <SectionHeader title="Skill Tracks" icon={Sword} />
            {SKILL_TRACKS.map((track) => (
              <div key={track.id}>
                <Card className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2A2B2E] rounded-lg flex items-center justify-center">
                      {track.id === 'muay-thai' ? <Activity className="text-[#FF4444]" /> : <Sword className="text-[#FF4444]" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{track.title}</h3>
                      <p className="text-xs text-[#8E9299]">{track.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase text-[#8E9299] tracking-widest">Core Drills</p>
                    <ul className="grid grid-cols-1 gap-2">
                      {track.drills.map((drill, i) => {
                        const disabled = isDrillDisabled(drill);
                        return (
                          <li key={i} className={`flex items-center justify-between text-sm bg-[#0A0B0D] p-3 rounded-lg border ${disabled ? 'border-red-900/30 opacity-50' : 'border-[#2A2B2E]'}`}>
                            <div className="flex items-center gap-2">
                              <ChevronRight className={`w-3 h-3 ${disabled ? 'text-[#8E9299]' : 'text-[#FF4444]'}`} />
                              <span className={disabled ? 'line-through text-[#8E9299]' : ''}>{drill}</span>
                            </div>
                            {disabled && <AlertTriangle className="w-3 h-3 text-[#FF4444]" />}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Card>
              </div>
            ))}
          </motion.div>
        )}

        {/* --- Assessment --- */}
        {activeTab === 'assessment' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <SectionHeader title="Physical Benchmarks" icon={Activity} />
            <Card className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#8E9299] block mb-2">Max Pushups</label>
                  <input 
                    type="number" 
                    value={benchmarks.pushups}
                    onChange={(e) => setBenchmarks({...benchmarks, pushups: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#0A0B0D] border border-[#2A2B2E] rounded-lg p-3 text-xl font-bold focus:border-[#FF4444] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-[#8E9299] block mb-2">Max Squats</label>
                  <input 
                    type="number" 
                    value={benchmarks.squats}
                    onChange={(e) => setBenchmarks({...benchmarks, squats: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#0A0B0D] border border-[#2A2B2E] rounded-lg p-3 text-xl font-bold focus:border-[#FF4444] outline-none transition-colors"
                  />
                </div>
                <button 
                  onClick={() => setBenchmarks({...benchmarks, walk5km: !benchmarks.walk5km})}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${benchmarks.walk5km ? 'bg-[#FF4444]/10 border-[#FF4444] text-white' : 'bg-[#0A0B0D] border-[#2A2B2E] text-[#8E9299]'}`}
                >
                  <span className="font-bold uppercase text-sm">5km Walk</span>
                  {benchmarks.walk5km ? <CheckCircle2 className="text-[#FF4444]" /> : <div className="w-5 h-5 rounded-full border-2 border-[#2A2B2E]" />}
                </button>
                
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => {
                    const newHistory = [...(benchmarks.history || []), { 
                      date: new Date().toLocaleDateString(), 
                      pushups: benchmarks.pushups, 
                      squats: benchmarks.squats, 
                      plank: benchmarks.plank 
                    }].slice(-12);
                    setBenchmarks({ ...benchmarks, history: newHistory });
                    alert("Benchmarks saved to history.");
                  }}
                >
                  SAVE BENCHMARKS
                </Button>
              </div>
            </Card>

            <SectionHeader title="Daily Field Notes" icon={BookOpen} />
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button 
                  variant="secondary" 
                  className="flex-1 text-[10px] py-2 flex items-center justify-center gap-2"
                  onClick={() => {
                    const bodyPart = window.prompt("Affected body part (Shoulder, Knee, Wrist, etc.)");
                    if (!bodyPart) return;
                    const severity = parseInt(window.prompt("Severity (1-10)") || "1");
                    const type = window.prompt("Injury type (Acute, Overuse, Structural)");
                    const desc = window.prompt("Description");
                    const newInjury = {
                      id: Date.now().toString(),
                      bodyPart,
                      severity,
                      type: type || 'Acute',
                      date: new Date().toLocaleDateString(),
                      recovered: false
                    };
                    setInjuries([...injuries, newInjury]);
                    setLogs([{ id: Date.now().toString(), date: new Date().toLocaleDateString(), week: currentWeek, content: `INJURY LOGGED: ${bodyPart} (${type}). Severity: ${severity}/10. ${desc}`, type: 'injury', bodyPart, severity }, ...logs]);
                  }}
                >
                  <HeartPulse className="w-3 h-3 text-[#FF4444]" /> LOG INJURY
                </Button>
              </div>

              {injuries.filter(i => !i.recovered).length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase text-[#FF4444] tracking-widest">Active Injuries</p>
                  {injuries.filter(i => !i.recovered).map(injury => (
                    <div key={injury.id}>
                      <Card className="border-red-900/30 bg-red-900/5">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold uppercase">{injury.bodyPart} - {injury.type}</p>
                            <p className="text-[10px] text-[#8E9299]">Severity: {injury.severity}/10 • {injury.date}</p>
                          </div>
                          <button 
                            onClick={() => setInjuries(injuries.map(i => i.id === injury.id ? { ...i, recovered: true } : i))}
                            className="text-[10px] font-mono text-green-500 uppercase border border-green-500/30 px-2 py-1 rounded"
                          >
                            Recovered
                          </button>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )}

              <Card>
                <textarea 
                  placeholder="Log your training..."
                  className="w-full bg-transparent border-none outline-none text-sm min-h-[100px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      const content = (e.target as HTMLTextAreaElement).value;
                      if (!content) return;
                      setLogs([{ id: Date.now().toString(), date: new Date().toLocaleDateString(), week: currentWeek, content }, ...logs]);
                      (e.target as HTMLTextAreaElement).value = '';
                    }
                  }}
                />
                <Button variant="secondary" className="w-full mt-2 text-xs">SAVE NOTE (CTRL+ENTER)</Button>
              </Card>

              <div className="space-y-3">
                {logs.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-[#2A2B2E] rounded-xl">
                    <BookOpen className="w-8 h-8 text-[#2A2B2E] mx-auto mb-2" />
                    <p className="text-[#8E9299] text-sm font-mono uppercase">No field notes recorded yet</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id}>
                      <Card className="relative group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono text-[#FF4444]">{log.date} • WEEK {log.week}</span>
                          <button 
                            onClick={() => {
                              if (window.confirm("Delete this note?")) {
                                setLogs(logs.filter(l => l.id !== log.id));
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-[#8E9299] hover:text-red-500" />
                          </button>
                        </div>
                        <p className="text-sm text-[#E6E6E6] whitespace-pre-wrap">{log.content}</p>
                      </Card>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- Stats Tab --- */}
        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <SectionHeader title="Training Analytics" icon={BarChart3} />
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <p className="text-[10px] font-mono text-[#8E9299] uppercase mb-1">Roadmap Progress</p>
                <p className="text-2xl font-bold text-[#FF4444]">{Math.round((currentWeek / 24) * 100)}%</p>
              </Card>
              <Card className="text-center">
                <p className="text-[10px] font-mono text-[#8E9299] uppercase mb-1">Consistency</p>
                <p className="text-2xl font-bold text-green-500">92%</p>
              </Card>
            </div>

            <div className="h-64 min-h-[256px]">
              <SectionHeader title="Pushups Progression" icon={Activity} />
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={benchmarks.history || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2B2E" />
                    <XAxis dataKey="date" stroke="#8E9299" fontSize={10} />
                    <YAxis stroke="#8E9299" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#151619', border: '1px solid #2A2B2E' }} />
                    <Line type="monotone" dataKey="pushups" stroke="#FF4444" strokeWidth={2} dot={{ fill: '#FF4444' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="h-64 min-h-[256px]">
              <SectionHeader title="Weekly Training Hours" icon={Timer} />
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { week: 'W1', hours: 18 }, { week: 'W2', hours: 21 }, { week: 'W3', hours: 19 }, { week: 'W4', hours: 22 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2B2E" />
                    <XAxis dataKey="week" stroke="#8E9299" fontSize={10} />
                    <YAxis stroke="#8E9299" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#151619', border: '1px solid #2A2B2E' }} />
                    <Bar dataKey="hours" fill="#FF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Card className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold">This Week vs Last Week</p>
                  <p className="text-[10px] text-[#8E9299]">Volume increased by 12%</p>
                </div>
                <div className="text-green-500 flex items-center gap-1">
                  <ChevronRight className="w-4 h-4 -rotate-90" />
                  <span className="font-bold">+2.5h</span>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* --- Courses Tab --- */}
        {activeTab === 'courses' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <SectionHeader title="Combat Mastery Courses" icon={PlayCircle} />
            
            <div className="space-y-6">
              {COMBAT_COURSES.map((course) => {
                const completedCount = (courseProgress[course.id] || []).length;
                const totalCount = course.videos.length;
                const percent = Math.round((completedCount / totalCount) * 100);

                return (
                  <div key={course.id}>
                    <Card className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold">{course.title}</h3>
                          <p className="text-xs text-[#8E9299]">{course.description}</p>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-1 rounded ${course.difficulty === 'Advanced' ? 'bg-red-900/20 text-[#FF4444]' : 'bg-blue-900/20 text-blue-400'}`}>
                          {course.difficulty}
                        </span>
                      </div>

                      <div className="w-full bg-[#2A2B2E] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#FF4444] h-full transition-all duration-500" style={{ width: `${percent}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[#8E9299] uppercase">
                        <span>{percent}% Complete</span>
                        <span>{completedCount}/{totalCount} Lessons</span>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-[#2A2B2E]">
                        {course.videos.map((video) => {
                          const isCompleted = (courseProgress[course.id] || []).includes(video.id);
                          const isLocked = video.prerequisite && !(courseProgress[course.id] || []).includes(video.prerequisite);

                          return (
                            <div key={video.id} className={`flex items-center justify-between p-3 rounded-lg border ${isLocked ? 'bg-[#0A0B0D] border-[#2A2B2E] opacity-50' : 'bg-[#1A1B1E] border-[#2A2B2E]'}`}>
                              <div className="flex items-center gap-3">
                                {isLocked ? <Lock className="w-4 h-4 text-[#8E9299]" /> : <PlayCircle className="w-4 h-4 text-[#FF4444]" />}
                                <div>
                                  <p className="text-xs font-bold">{video.title}</p>
                                  <p className="text-[10px] text-[#8E9299]">{video.duration}</p>
                                </div>
                              </div>
                              {isLocked ? (
                                <span className="text-[8px] font-mono text-[#8E9299] uppercase">Locked</span>
                              ) : (
                                <button 
                                  onClick={() => {
                                    const current = courseProgress[course.id] || [];
                                    if (!current.includes(video.id)) {
                                      setCourseProgress({ ...courseProgress, [course.id]: [...current, video.id] });
                                    }
                                    window.open(video.url, '_blank');
                                  }}
                                  className={`text-[10px] font-mono px-3 py-1 rounded-full border ${isCompleted ? 'bg-green-900/20 border-green-500 text-green-500' : 'border-[#FF4444] text-[#FF4444]'}`}
                                >
                                  {isCompleted ? 'WATCHED' : 'WATCH'}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
        {activeTab === 'scenarios' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <SectionHeader title="Mini-Mission Library" icon={Target} />
            <div className="grid grid-cols-1 gap-6">
              {SCENARIOS.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[#2A2B2E] rounded-xl">
                  <Target className="w-8 h-8 text-[#2A2B2E] mx-auto mb-2" />
                  <p className="text-[#8E9299] text-sm font-mono uppercase">No missions available in this phase</p>
                </div>
              ) : (
                SCENARIOS.map((scenario) => (
                  <motion.div 
                    key={scenario.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Card className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-[#FF4444]">{scenario.title}</h3>
                        <span className="text-[10px] font-mono bg-[#2A2B2E] px-2 py-1 rounded text-[#8E9299]">PHASE {scenario.phase}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-[#E6E6E6] leading-relaxed"><span className="text-[#8E9299] font-mono uppercase text-[10px]">Objective:</span> {scenario.objective}</p>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <p><span className="text-[#8E9299] font-mono uppercase text-[10px]">Duration:</span> {scenario.duration}</p>
                          <p><span className="text-[#8E9299] font-mono uppercase text-[10px]">Tools:</span> {scenario.tools.join(', ')}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#2A2B2E] space-y-2">
                        <p className="text-[10px] font-mono uppercase text-[#8E9299]">Success Criteria</p>
                        <p className="text-sm text-[#E6E6E6]">{scenario.successCriteria}</p>
                      </div>

                      <div className="pt-4 border-t border-[#2A2B2E] space-y-2">
                        <p className="text-[10px] font-mono uppercase text-[#8E9299]">Progression Variants</p>
                        <ul className="text-xs space-y-1">
                          {scenario.variants.map((v, i) => <li key={i} className="text-[#8E9299]">• {v}</li>)}
                        </ul>
                      </div>

                      <div className="bg-red-900/10 p-3 rounded-lg border border-red-900/20">
                        <p className="text-[10px] font-mono uppercase text-[#FF4444] mb-1">Teaching Tip</p>
                        <p className="text-xs italic text-red-200/70">{scenario.tips}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* --- Reference Tab --- */}
        {activeTab === 'reference' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <SectionHeader title="Recovery Protocols" icon={HeartPulse} />
            <div className="space-y-6">
              {RECOVERY_PROTOCOLS.map((recovery) => (
                <div key={recovery.id}>
                  <Card>
                    <h3 className="text-lg font-bold text-[#FF4444] mb-3">{recovery.title}</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-mono uppercase text-[#8E9299] mb-1">Routine</p>
                        <ul className="text-sm space-y-1">
                          {recovery.routine.map((r, i) => <li key={i} className="text-[#E6E6E6] flex gap-2"><span className="text-[#FF4444]">•</span> {r}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono uppercase text-[#8E9299] mb-1">Tips</p>
                        <ul className="text-xs italic text-[#8E9299] space-y-1">
                          {recovery.tips.map((t, i) => <li key={i}>"{t}"</li>)}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
              
              <Card className="bg-green-900/10 border-green-900/30">
                <div className="flex items-center gap-3 text-green-500 mb-2">
                  <Thermometer className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-sm">Recovery Score</span>
                </div>
                <p className="text-sm text-green-200/70 italic leading-relaxed mb-4">
                  Based on your recent logs and sleep data, your recovery effectiveness is currently 84%.
                </p>
                <div className="w-full bg-[#2A2B2E] h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: '84%' }} />
                </div>
              </Card>
            </div>

            <SectionHeader title="Safety: Red Flags" icon={AlertTriangle} />
            <div className="space-y-6">
              {RED_FLAGS.map((flag) => (
                <div key={flag.id}>
                  <Card className="border-red-900/30">
                    <h3 className="text-lg font-bold text-[#FF4444] mb-3">{flag.title}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-mono uppercase text-[#8E9299] mb-1">Symptoms</p>
                        <ul className="text-sm space-y-1">
                          {flag.symptoms.map((s, i) => <li key={i} className="text-[#E6E6E6] flex gap-2"><span className="text-[#FF4444]">•</span> {s}</li>)}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-[10px] font-mono uppercase text-[#8E9299] mb-1">Adjustment Protocol</p>
                        <ul className="text-sm space-y-1">
                          {flag.protocol.map((p, i) => <li key={i} className="text-[#E6E6E6] flex gap-2"><span className="text-[#FF4444]">{i+1}.</span> {p}</li>)}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <SectionHeader title="Emergency Protocols" icon={Stethoscope} />
            <div className="space-y-4">
              {EMERGENCY_PROTOCOLS.map((protocol, idx) => (
                <div key={idx}>
                  <Card>
                    <h3 className="font-bold text-[#FF4444] mb-3 uppercase tracking-wider">{protocol.title}</h3>
                    <ul className="text-sm space-y-2">
                      {protocol.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-[#E6E6E6]">
                          <span className="text-[#8E9299] font-mono">{i+1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              ))}
            </div>

            <SectionHeader title="Plant Guide" icon={Leaf} />
            <div className="space-y-6">
              {PLANTS.map((plant, idx) => (
                <div key={idx}>
                  <Card>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">{plant.name}</h3>
                      <span className="text-[10px] font-mono text-[#8E9299] uppercase">{plant.season}</span>
                    </div>
                    <div className="space-y-4 text-sm">
                      <p><span className="text-[#8E9299] font-mono uppercase text-[10px] block mb-1">Identification</span> {plant.identification}</p>
                      <p><span className="text-[#8E9299] font-mono uppercase text-[10px] block mb-1">Edible Parts</span> {plant.edibleParts}</p>
                      <p><span className="text-[#8E9299] font-mono uppercase text-[10px] block mb-1">Harvest</span> {plant.harvest}</p>
                      <p><span className="text-[#8E9299] font-mono uppercase text-[10px] block mb-1">Uses</span> {plant.uses}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <SectionHeader title="Tool Anatomy" icon={Library} />
            <div className="space-y-6">
              {TOOL_ANATOMY.map((tool) => (
                <div key={tool.name}>
                  <Card>
                    <h3 className="text-lg font-bold mb-4">{tool.name}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-mono uppercase text-[#8E9299] mb-2">Design & Dimensions</p>
                        <ul className="text-sm space-y-1">
                          {tool.design.map((d, i) => <li key={i} className="text-[#E6E6E6]">{d}</li>)}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-[10px] font-mono uppercase text-[#8E9299] mb-2">Safe Zones</p>
                        <ul className="text-sm space-y-1">
                          {tool.safeZones.map((s, i) => <li key={i} className="text-[#E6E6E6]">{s}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#2A2B2E]">
                      <p className="text-[10px] font-mono uppercase text-[#8E9299] mb-2">Maintenance</p>
                      <ul className="text-sm space-y-1">
                        {tool.maintenance.map((m, i) => <li key={i} className="text-[#E6E6E6]">{m}</li>)}
                      </ul>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- Sync Tab --- */}
        {activeTab === 'sync' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <SectionHeader title="Device Synchronization" icon={RefreshCw} />
            
            <Card className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Offline Backup</h3>
                <p className="text-sm text-[#8E9299]">Export your data to a file or import a previous backup. No cloud, no servers.</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={exportData} variant="secondary" className="flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> EXPORT JSON
                  </Button>
                  <Button onClick={exportPdf} variant="primary" className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" /> EXPORT PDF
                  </Button>
                  <label className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2A2B2E] text-white rounded-lg font-medium cursor-pointer hover:bg-[#3A3B3E] transition-all col-span-2">
                    <Upload className="w-4 h-4" /> IMPORT BACKUP
                    <input type="file" className="hidden" onChange={importData} accept=".json" />
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-[#2A2B2E] space-y-4">
                <h3 className="font-bold text-lg">QR Sync</h3>
                <p className="text-sm text-[#8E9299]">Sync directly between devices by scanning a code. Best for quick transfers.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={generateQrSync} variant="primary" className="flex items-center justify-center gap-2">
                    <QrCode className="w-4 h-4" /> SHOW CODE
                  </Button>
                  <Button onClick={() => setShowScanner(true)} variant="secondary" className="flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4" /> SCAN CODE
                  </Button>
                </div>

                {qrData && (
                  <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl mt-4">
                    <QRCodeSVG value={qrData} size={200} level="L" />
                    <p className="text-black text-[10px] font-mono text-center uppercase tracking-tighter">Scan this on your other device</p>
                    <Button onClick={() => setQrData(null)} variant="secondary" className="text-xs">CLOSE CODE</Button>
                  </div>
                )}

                {showScanner && (
                  <QrScanner onScan={handleQrScan} onClose={() => setShowScanner(false)} />
                )}
              </div>
            </Card>

            <Card className="bg-blue-900/10 border-blue-900/30 p-6">
              <div className="flex items-center gap-3 text-blue-500 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-bold uppercase tracking-widest text-sm">Privacy First</span>
              </div>
              <p className="text-sm text-blue-200/70 italic leading-relaxed">
                Your data never leaves your devices. Synchronization happens locally via direct file transfer or optical scanning. We do not use any external servers.
              </p>
            </Card>
          </motion.div>
        )}
      </main>

      {/* --- Tab Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#151619] border-t border-[#2A2B2E] z-50 flex items-center justify-around px-2 overflow-x-auto no-scrollbar">
        <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={Activity} label="Home" />
        <TabButton active={activeTab === 'progression'} onClick={() => setActiveTab('progression')} icon={ChevronRight} label="Path" />
        <TabButton active={activeTab === 'combat'} onClick={() => setActiveTab('combat')} icon={Shield} label="Combat" />
        <TabButton active={activeTab === 'scenarios'} onClick={() => setActiveTab('scenarios')} icon={Target} label="Missions" />
        <TabButton active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} icon={PlayCircle} label="Courses" />
        <TabButton active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} icon={Sword} label="Skills" />
        <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={BarChart3} label="Stats" />
        <TabButton active={activeTab === 'reference'} onClick={() => setActiveTab('reference')} icon={Library} label="Ref" />
        <TabButton active={activeTab === 'assessment'} onClick={() => setActiveTab('assessment')} icon={BookOpen} label="Log" />
        <TabButton active={activeTab === 'sync'} onClick={() => setActiveTab('sync')} icon={RefreshCw} label="Sync" />
      </div>
      </div>
      <NotificationCenter />
    </NotificationContext.Provider>
    </ErrorBoundary>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${active ? 'text-[#FF4444]' : 'text-[#8E9299]'}`}
    >
      <Icon className={`w-6 h-6 ${active ? 'drop-shadow-[0_0_8px_rgba(255,68,68,0.5)]' : ''}`} />
      <span className="text-[10px] font-mono uppercase tracking-tighter">{label}</span>
    </button>
  );
}
