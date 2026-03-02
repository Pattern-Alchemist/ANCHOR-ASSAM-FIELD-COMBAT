/**
 * combatAI.ts - Combat-Specific AI Functions
 * Generates AI-powered combat training recommendations and responses
 */

import { callPuterAI, getOfflineFallback } from './puterAI';

// Types
export interface CombatFocusRecommendation {
  pillar: 'Striking' | 'Grappling' | 'Weapon Transitions';
  reason: string;
  drill: string;
  confidence: number;
}

export interface ScenarioOutcome {
  successRate: number;
  outcome: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  injuries: string[];
  xpGain: number;
}

export interface InjuryAlert {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  warning: string;
  recommendations: string[];
  modifiedDrills: string[];
}

export interface LessonSummary {
  title: string;
  keyPoints: string[];
  nextSteps: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

/**
 * Generate daily combat focus recommendation
 */
export async function generateCombatFocusToday(): Promise<CombatFocusRecommendation> {
  const prompt = `As a combat training AI, recommend ONE primary combat pillar to focus on today for a warrior's training session. 
  
  Respond ONLY with valid JSON:
  {
    "pillar": "Striking" | "Grappling" | "Weapon Transitions",
    "reason": "brief reason for recommendation",
    "drill": "specific drill to practice today",
    "confidence": 0.0-1.0
  }`;

  try {
    const response = await callPuterAI('combatFocus', prompt);
    return parseJSON(response, getOfflineFallback('combatFocus') as CombatFocusRecommendation);
  } catch (error) {
    console.error('[combatAI] Error generating focus:', error);
    return getOfflineFallback('combatFocus') as CombatFocusRecommendation;
  }
}

/**
 * Generate scenario outcome based on user choice
 */
export async function generateScenarioOutcome(
  scenarioId: string,
  choice: string,
  stats: any
): Promise<ScenarioOutcome> {
  const prompt = `A warrior faces a combat scenario. They chose: "${choice}"
  Their stats: Striking=${stats.strikeLevel || 'Beginner'}, Grappling=${stats.grappleLevel || 'Beginner'}, Weapons=${stats.weaponLevel || 'Beginner'}
  
  Evaluate the outcome. Respond ONLY with valid JSON:
  {
    "successRate": 0-100,
    "outcome": "what happened in this scenario",
    "riskLevel": "Low" | "Moderate" | "High",
    "injuries": ["injury names if any"],
    "xpGain": 0-150
  }`;

  try {
    const response = await callPuterAI('scenario', prompt);
    return parseJSON(response, getOfflineFallback('scenario') as ScenarioOutcome);
  } catch (error) {
    console.error('[combatAI] Error generating outcome:', error);
    return getOfflineFallback('scenario') as ScenarioOutcome;
  }
}

/**
 * Generate personalized drill tips
 */
export async function generateDrillTips(
  drillId: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
): Promise<string[]> {
  const prompt = `Generate 5 expert tips for a ${difficulty} level combat drill (ID: ${drillId}). 
  Focus on form, breathing, safety, and progression.
  
  Respond ONLY with valid JSON:
  {
    "tips": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"]
  }`;

  try {
    const response = await callPuterAI('drillTips', prompt);
    const parsed = parseJSON(response, { tips: [] });
    return Array.isArray(parsed.tips) ? parsed.tips : (getOfflineFallback('drillTips') as string[]);
  } catch (error) {
    console.error('[combatAI] Error generating tips:', error);
    return getOfflineFallback('drillTips') as string[];
  }
}

/**
 * Generate injury alerts and safety warnings
 */
export async function generateInjuryAlerts(
  injuries: string[],
  drillId: string
): Promise<InjuryAlert> {
  const prompt = `A warrior with these injuries ${injuries.length > 0 ? injuries.join(', ') : 'none'} wants to do drill ${drillId}.
  
  Provide safety assessment. Respond ONLY with valid JSON:
  {
    "riskLevel": "Low" | "Moderate" | "High" | "Critical",
    "warning": "safety warning or clearance message",
    "recommendations": ["recommendation 1", "recommendation 2"],
    "modifiedDrills": ["alternative drills if needed"]
  }`;

  try {
    const response = await callPuterAI('injuryAlert', prompt);
    return parseJSON(response, getOfflineFallback('injuryAlert') as InjuryAlert);
  } catch (error) {
    console.error('[combatAI] Error generating injury alert:', error);
    return getOfflineFallback('injuryAlert') as InjuryAlert;
  }
}

/**
 * Generate lesson summary
 */
export async function generateLessonSummary(
  lessonTitle: string,
  level: 'Beginner' | 'Intermediate' | 'Advanced'
): Promise<LessonSummary> {
  const prompt = `Summarize a ${level} level combat lesson titled "${lessonTitle}".
  
  Respond ONLY with valid JSON:
  {
    "title": "lesson title",
    "keyPoints": ["point 1", "point 2", "point 3"],
    "nextSteps": ["step 1", "step 2"],
    "difficulty": "Beginner" | "Intermediate" | "Advanced"
  }`;

  try {
    const response = await callPuterAI('lessonSummary', prompt);
    return parseJSON(response, getOfflineFallback('lessonSummary') as LessonSummary);
  } catch (error) {
    console.error('[combatAI] Error generating lesson summary:', error);
    return getOfflineFallback('lessonSummary') as LessonSummary;
  }
}

/**
 * Generate motivational message based on stats
 */
export async function generateMotivationalMessage(stats: any): Promise<string> {
  const prompt = `A warrior with striking=${stats.strikingLevel || 'Beginner'}, grappling=${stats.grapplingLevel || 'Beginner'}, 
  weapons=${stats.weaponLevel || 'Beginner'} needs motivation. 
  
  Create a powerful, brief motivational message (1-2 sentences). Respond ONLY with the message text.`;

  try {
    const response = await callPuterAI('motivational', prompt);
    
    if (typeof response === 'string' && response.length > 0) {
      return response;
    }
    
    return getOfflineFallback('motivational') as string;
  } catch (error) {
    console.error('[combatAI] Error generating motivational message:', error);
    return getOfflineFallback('motivational') as string;
  }
}

/**
 * Parse JSON response from AI
 */
function parseJSON(response: any, fallback: any): any {
  try {
    // If already an object, return it
    if (typeof response === 'object' && response !== null) {
      return response;
    }

    // If string, try to parse
    if (typeof response === 'string') {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Try direct parse
      return JSON.parse(response);
    }

    return fallback;
  } catch (error) {
    console.warn('[combatAI] JSON parse error:', error);
    return fallback;
  }
}
