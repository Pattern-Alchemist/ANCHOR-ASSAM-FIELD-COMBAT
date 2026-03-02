/**
 * Service Exports
 */

export {
  callPuterAI,
  getFromCache,
  setCache,
  checkRateLimit,
  getOfflineFallback,
  getCacheStats,
  clearCache,
  loadCacheFromStorage,
  initPuterAI
} from './puterAI';

export {
  generateCombatFocusToday,
  generateScenarioOutcome,
  generateDrillTips,
  generateInjuryAlerts,
  generateLessonSummary,
  generateMotivationalMessage,
  type CombatFocusRecommendation,
  type ScenarioOutcome,
  type InjuryAlert,
  type LessonSummary
} from './combatAI';

export {
  videoService,
  type VideoFile,
  type VideoLibrary
} from './videoService';
