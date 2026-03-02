/**
 * useAIFeatures.ts - Complete Implementation
 * React hooks for AI feature integration
 */

import { useState, useCallback, useEffect } from 'react';
import {
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
} from '../services/combatAI';

// ============= COMBAT FOCUS HOOK =============
export function useCombatFocusAI(options: { autoFetch?: boolean } = {}) {
  const [focus, setFocus] = useState<CombatFocusRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCombatFocus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateCombatFocusToday();
      setFocus(result);
      return result;
    } catch (err: any) {
      const message = err?.message || 'Failed to generate focus';
      setError(message);
      console.error('❌ Combat focus error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoFetch) {
      fetchCombatFocus();
    }
  }, [options.autoFetch, fetchCombatFocus]);

  return { focus, loading, error, refetch: fetchCombatFocus };
}

// ============= SCENARIO OUTCOME HOOK =============
export function useScenarioOutcomeAI() {
  const [outcome, setOutcome] = useState<ScenarioOutcome | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateOutcome = useCallback(
    async (scenarioId: string, choice: string, stats: any): Promise<ScenarioOutcome | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await generateScenarioOutcome(scenarioId, choice, stats);
        setOutcome(result);
        return result;
      } catch (err: any) {
        const message = err?.message || 'Failed to generate outcome';
        setError(message);
        console.error('❌ Scenario error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { outcome, loading, error, generateOutcome };
}

// ============= DRILL TIPS HOOK =============
export function useDrillTipsAI() {
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTips = useCallback(
    async (drillId: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): Promise<string[]> => {
      setLoading(true);
      setError(null);
      try {
        const result = await generateDrillTips(drillId, difficulty);
        setTips(result);
        return result;
      } catch (err: any) {
        const message = err?.message || 'Failed to generate tips';
        setError(message);
        console.error('❌ Drill tips error:', err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { tips, loading, error, fetchTips };
}

// ============= INJURY ALERTS HOOK =============
export function useInjuryAlertsAI() {
  const [alert, setAlert] = useState<InjuryAlert | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkInjuryRisk = useCallback(
    async (injuries: string[], drillId: string): Promise<InjuryAlert | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await generateInjuryAlerts(injuries, drillId);
        setAlert(result);
        return result;
      } catch (err: any) {
        const message = err?.message || 'Failed to generate alert';
        setError(message);
        console.error('❌ Injury alert error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { alert, loading, error, checkInjuryRisk };
}

// ============= LESSON SUMMARY HOOK =============
export function useLessonSummaryAI() {
  const [summary, setSummary] = useState<LessonSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(
    async (lessonTitle: string, level: 'Beginner' | 'Intermediate' | 'Advanced'): Promise<LessonSummary | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await generateLessonSummary(lessonTitle, level);
        setSummary(result);
        return result;
      } catch (err: any) {
        const message = err?.message || 'Failed to generate summary';
        setError(message);
        console.error('❌ Lesson summary error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { summary, loading, error, fetchSummary };
}

// ============= MOTIVATIONAL MESSAGE HOOK =============
export function useMotivationalMessageAI() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessage = useCallback(async (stats: any): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateMotivationalMessage(stats);
      setMessage(result);
      return result;
    } catch (err: any) {
      const message = err?.message || 'Failed to generate message';
      setError(message);
      console.error('❌ Motivational message error:', err);
      return '';
    } finally {
      setLoading(false);
    }
  }, []);

  return { message, loading, error, fetchMessage };
}
