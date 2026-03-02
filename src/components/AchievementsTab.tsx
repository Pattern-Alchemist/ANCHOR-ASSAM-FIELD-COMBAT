import React from 'react';
import { ACHIEVEMENTS, getAchievementProgress } from '../utils/achievementDefinitions';
import { useAchievements } from '../hooks/useAchievements';
import { Award, Zap } from 'lucide-react';

export function AchievementsTab() {
  const { achievements } = useAchievements();

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      progress: 'Progress',
      exploration: 'Exploration',
      mastery: 'Mastery',
      social: 'Social',
    };
    return labels[category] || category;
  };

  const groupedAchievements = Object.values(ACHIEVEMENTS).reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, typeof ACHIEVEMENTS[keyof typeof ACHIEVEMENTS][]>);

  const categories = ['progress', 'exploration', 'mastery', 'social'] as const;

  const getTotalProgress = () => {
    const unlockedCount = achievements.unlockedAchievements.length;
    const totalCount = Object.keys(ACHIEVEMENTS).length;
    return { unlockedCount, totalCount };
  };

  const { unlockedCount, totalCount } = getTotalProgress();
  const totalXP = Object.values(ACHIEVEMENTS)
    .filter((a) => achievements.unlockedAchievements.includes(a.id))
    .reduce((sum, a) => sum + a.reward.xp, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">Achievements</h3>
          </div>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {unlockedCount}/{totalCount}
          </p>
          <div className="mt-4 bg-blue-200 dark:bg-blue-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-400 h-full transition-all duration-300"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">Total XP Reward</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
            +{totalXP}
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
            From unlocked achievements
          </p>
        </div>
      </div>

      {/* Achievements by Category */}
      {categories.map((category) => (
        <div key={category}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            {getCategoryLabel(category)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedAchievements[category]?.map((achievement) => {
              const isUnlocked = achievements.unlockedAchievements.includes(achievement.id);
              const metricValue = achievements[achievement.requirement.type as keyof typeof achievements] as number;
              const progress = getAchievementProgress(achievement, metricValue);

              return (
                <div
                  key={achievement.id}
                  className={`rounded-lg p-4 border transition-all duration-300 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-300 dark:border-green-600 shadow-lg'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{achievement.icon}</div>
                    {isUnlocked && (
                      <div className="flex items-center gap-1 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-bold">
                        <span>✓ Unlocked</span>
                      </div>
                    )}
                  </div>

                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {achievement.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Progress</span>
                      <span>{progress.current}/{progress.target}</span>
                    </div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {achievement.reward.xp > 0 && (
                    <div className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      +{achievement.reward.xp} XP
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
