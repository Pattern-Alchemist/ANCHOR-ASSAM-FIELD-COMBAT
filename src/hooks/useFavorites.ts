import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'anchor_favorites';

export interface Favorite {
  id: string;
  type: 'drill' | 'lesson' | 'scenario' | 'track';
  name: string;
  addedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('[v0] Failed to load favorites:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const saveFavorites = useCallback((items: Favorite[]) => {
    setFavorites(items);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  }, []);

  const addFavorite = useCallback(
    (id: string, type: Favorite['type'], name: string) => {
      setFavorites((prev) => {
        if (prev.some((f) => f.id === id)) return prev;
        const updated = [...prev, { id, type, name, addedAt: Date.now() }];
        saveFavorites(updated);
        return updated;
      });
    },
    [saveFavorites]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const updated = prev.filter((f) => f.id !== id);
        saveFavorites(updated);
        return updated;
      });
    },
    [saveFavorites]
  );

  const toggleFavorite = useCallback(
    (id: string, type: Favorite['type'], name: string) => {
      if (favorites.some((f) => f.id === id)) {
        removeFavorite(id);
      } else {
        addFavorite(id, type, name);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  const isFavorite = useCallback((id: string) => {
    return favorites.some((f) => f.id === id);
  }, [favorites]);

  const getFavoritesByType = useCallback(
    (type: Favorite['type']) => {
      return favorites.filter((f) => f.type === type);
    },
    [favorites]
  );

  const clearAllFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    clearAllFavorites,
  };
}
