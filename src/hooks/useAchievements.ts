import { useState, useEffect, useCallback } from 'react';
import { ACHIEVEMENTS, isAchievementUnlocked } from '../utils/achievementDefinitions';

const ACHIEVEMENTS_KEY = 'anchor_achievements';

export interface UserAchievements {
  drills_completed: number;
  xp_earned: number;
  lessons_viewed: number;
  streaks: number;
  favorites: number;
  shares: number;
  unlockedAchievements: string[];
  newAchievements: string[];
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<UserAchievements>({
    drills_completed: 0,
    xp_earned: 0,
    lessons_viewed: 0,
    streaks: 0,
    favorites: 0,
    shares: 0,
    unlockedAchievements: [],
    newAchievements: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (saved) {
      try {
        setAchievements(JSON.parse(saved));
      } catch (error) {
        console.error('[v0] Failed to load achievements:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const saveAchievements = useCallback((data: UserAchievements) => {
    setAchievements(data);
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(data));
  }, []);

  const updateMetric = useCallback(
    (metric: keyof Omit<UserAchievements, 'unlockedAchievements' | 'newAchievements'>, value: number) => {
      setAchievements((prev) => {
        const updated = { ...prev, [metric]: value };
        
        const newUnlocked: string[] = [];
        Object.entries(ACHIEVEMENTS).forEach(([_, achievement]) => {
          if (!prev.unlockedAchievements.includes(achievement.id)) {
            const metricValue = updated[achievement.requirement.type as keyof typeof updated];
            if (typeof metricValue === 'number' && isAchievementUnlocked(metricValue, achievement.requirement)) {
              newUnlocked.push(achievement.id);
            }
          }
        });

        const unlocked = [...new Set([...prev.unlockedAchievements, ...newUnlocked])];
        const finalData = {
          ...updated,
          unlockedAchievements: unlocked,
          newAchievements: newUnlocked,
        };

        saveAchievements(finalData);
        return finalData;
      });
    },
    [saveAchievements]
  );

  const incrementMetric = useCallback(
    (metric: keyof Omit<UserAchievements, 'unlockedAchievements' | 'newAchievements'>, amount = 1) => {
      setAchievements((prev) => {
        const current = (prev[metric] as number) || 0;
        updateMetric(metric, current + amount);
        return prev;
      });
    },
    [updateMetric]
  );

  const getUnlockedAchievements = useCallback(() => {
    return achievements.unlockedAchievements
      .map((id) => ACHIEVEMENTS[id])
      .filter(Boolean);
  }, [achievements.unlockedAchievements]);

  const getTotalXPReward = useCallback(() => {
    return getUnlockedAchievements().reduce((sum, ach) => sum + ach.reward.xp, 0);
  }, [getUnlockedAchievements]);

  const clearNewAchievements = useCallback(() => {
    setAchievements((prev) => ({
      ...prev,
      newAchievements: [],
    }));
  }, []);

  return {
    achievements,
    isLoading,
    updateMetric,
    incrementMetric,
    getUnlockedAchievements,
    getTotalXPReward,
    clearNewAchievements,
  };
}
