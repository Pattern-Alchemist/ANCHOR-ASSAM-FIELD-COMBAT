import { useState, useEffect, useCallback } from 'react';

const HISTORY_KEY = 'anchor_history';
const MAX_HISTORY_ITEMS = 20;

export interface HistoryItem {
  id: string;
  type: 'drill' | 'lesson' | 'scenario' | 'track';
  name: string;
  viewedAt: number;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('[v0] Failed to load history:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const saveHistory = useCallback((items: HistoryItem[]) => {
    setHistory(items);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  }, []);

  const addToHistory = useCallback(
    (id: string, type: HistoryItem['type'], name: string) => {
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.id !== id);
        const updated = [
          { id, type, name, viewedAt: Date.now() },
          ...filtered,
        ].slice(0, MAX_HISTORY_ITEMS);
        saveHistory(updated);
        return updated;
      });
    },
    [saveHistory]
  );

  const removeFromHistory = useCallback(
    (id: string) => {
      setHistory((prev) => {
        const updated = prev.filter((h) => h.id !== id);
        saveHistory(updated);
        return updated;
      });
    },
    [saveHistory]
  );

  const getRecentlyViewed = useCallback(() => {
    return history.slice(0, 10);
  }, [history]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  const getHistoryByType = useCallback(
    (type: HistoryItem['type']) => {
      return history.filter((h) => h.type === type);
    },
    [history]
  );

  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    getRecentlyViewed,
    clearHistory,
    getHistoryByType,
  };
}
