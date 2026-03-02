export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'progress' | 'exploration' | 'mastery' | 'social';
  requirement: {
    type: 'drills_completed' | 'xp_earned' | 'lessons_viewed' | 'streaks' | 'favorites' | 'shares';
    target: number;
  };
  reward: {
    xp: number;
  };
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  FIRST_STEP: {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first drill',
    icon: '👶',
    category: 'progress',
    requirement: { type: 'drills_completed', target: 1 },
    reward: { xp: 50 },
  },
  DEDICATED_TRAINER: {
    id: 'dedicated_trainer',
    name: 'Dedicated Trainer',
    description: 'Complete 10 drills',
    icon: '💪',
    category: 'progress',
    requirement: { type: 'drills_completed', target: 10 },
    reward: { xp: 200 },
  },
  DRILL_MASTER: {
    id: 'drill_master',
    name: 'Drill Master',
    description: 'Complete 50 drills',
    icon: '🥋',
    category: 'mastery',
    requirement: { type: 'drills_completed', target: 50 },
    reward: { xp: 500 },
  },
  ELITE_WARRIOR: {
    id: 'elite_warrior',
    name: 'Elite Warrior',
    description: 'Complete 100 drills',
    icon: '⚔️',
    category: 'mastery',
    requirement: { type: 'drills_completed', target: 100 },
    reward: { xp: 1000 },
  },
  KNOWLEDGE_SEEKER: {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'View 5 lessons',
    icon: '📚',
    category: 'exploration',
    requirement: { type: 'lessons_viewed', target: 5 },
    reward: { xp: 150 },
  },
  POWER_SURGE: {
    id: 'power_surge',
    name: 'Power Surge',
    description: 'Earn 100 XP',
    icon: '⚡',
    category: 'progress',
    requirement: { type: 'xp_earned', target: 100 },
    reward: { xp: 0 },
  },
  UNSTOPPABLE: {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Earn 500 XP',
    icon: '🔥',
    category: 'progress',
    requirement: { type: 'xp_earned', target: 500 },
    reward: { xp: 0 },
  },
  LEGENDARY: {
    id: 'legendary',
    name: 'Legendary',
    description: 'Earn 1000 XP',
    icon: '👑',
    category: 'mastery',
    requirement: { type: 'xp_earned', target: 1000 },
    reward: { xp: 0 },
  },
  COLLECTION_STARTER: {
    id: 'collection_starter',
    name: 'Collection Starter',
    description: 'Add 5 items to favorites',
    icon: '⭐',
    category: 'exploration',
    requirement: { type: 'favorites', target: 5 },
    reward: { xp: 100 },
  },
  SHARER: {
    id: 'sharer',
    name: 'Sharer',
    description: 'Share content 3 times',
    icon: '📤',
    category: 'social',
    requirement: { type: 'shares', target: 3 },
    reward: { xp: 150 },
  },
};

export function getAchievementProgress(
  achievement: Achievement,
  currentValue: number
): { current: number; target: number; percentage: number } {
  return {
    current: Math.min(currentValue, achievement.requirement.target),
    target: achievement.requirement.target,
    percentage: Math.round((Math.min(currentValue, achievement.requirement.target) / achievement.requirement.target) * 100),
  };
}

export function isAchievementUnlocked(currentValue: number, requirement: Achievement['requirement']): boolean {
  return currentValue >= requirement.target;
}
