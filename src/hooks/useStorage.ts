import { useState, useEffect } from 'react';

interface AppState {
  currentWeek: number;
  logs: any[];
  benchmarks: any;
  courseProgress: Record<string, string[]>;
  customBlocks: Record<string, any[]>;
  activeBlockTemplate: string;
  searchHistory: string[];
  injuries: any[];
  combatProgress: any;
}

const STORAGE_KEY = 'anchorAppState';

const defaultState: AppState = {
  currentWeek: 1,
  logs: [],
  benchmarks: { pushups: 0, squats: 0, plank: 0, walk5km: false, history: [] },
  courseProgress: {},
  customBlocks: {},
  activeBlockTemplate: 'Standard',
  searchHistory: [],
  injuries: [],
  combatProgress: {}
};

export function useStorage() {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (error) {
      console.error('[v0] Error loading from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('[v0] Error saving to localStorage:', error);
      }
    }
  }, [state, isLoaded]);

  return {
    currentWeek: state.currentWeek,
    setCurrentWeek: (week: number) => setState(s => ({ ...s, currentWeek: week })),
    
    logs: state.logs,
    setLogs: (logs: any[]) => setState(s => ({ ...s, logs })),
    
    benchmarks: state.benchmarks,
    setBenchmarks: (benchmarks: any) => setState(s => ({ ...s, benchmarks })),
    
    courseProgress: state.courseProgress,
    setCourseProgress: (progress: Record<string, string[]>) => setState(s => ({ ...s, courseProgress: progress })),
    
    customBlocks: state.customBlocks,
    setCustomBlocks: (blocks: Record<string, any[]>) => setState(s => ({ ...s, customBlocks: blocks })),
    
    activeBlockTemplate: state.activeBlockTemplate,
    setActiveBlockTemplate: (template: string) => setState(s => ({ ...s, activeBlockTemplate: template })),
    
    searchHistory: state.searchHistory,
    setSearchHistory: (history: string[]) => setState(s => ({ ...s, searchHistory: history })),
    
    injuries: state.injuries,
    setInjuries: (injuries: any[]) => setState(s => ({ ...s, injuries })),
    
    combatProgress: state.combatProgress,
    setCombatProgress: (progress: any) => setState(s => ({ ...s, combatProgress: progress }))
  };
}
