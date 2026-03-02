/**
 * combatAI.ts
 * AI service for combat training analysis and recommendations
 */

import { puterChat } from './puterAI';

export interface CombatFocusRecommendation {
  pillar: string;
  reason: string;
  drill: string;
}

export interface ScenarioOutcome {
  successRate: number;
  outcome: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface InjuryAlert {
  risk: 'Low' | 'Moderate' | 'High';
  prevention: string[];
}

export interface LessonSummary {
  keyPoints: string[];
  practicalApplication: string;
}

export async function generateCombatFocusToday(): Promise<CombatFocusRecommendation> {
  const prompt = `Act as an elite combat instructor. Generate a "Combat Focus of the Day" for a field operator. 
  Provide it in JSON format: { "pillar": "string", "reason": "string", "drill": "string" }.
  Pillars should be one of: Striking, Grappling, Weapon Transitions, Situational Awareness, or Field Medicine.`;
  
  const response = await puterChat(prompt);
  try {
    return JSON.parse(response.replace(/```json|```/g, '').trim());
  } catch {
    return {
      pillar: "STRIKING",
      reason: "High-intensity output needed for current conditions.",
      drill: "Heavy Bag Interval Training"
    };
  }
}

export async function generateScenarioOutcome(scenarioId: string, choice: string, stats: any): Promise<ScenarioOutcome> {
  const prompt = `Evaluate this combat scenario outcome. 
  Scenario: ${scenarioId}
  Operator Choice: ${choice}
  Stats: ${JSON.stringify(stats)}
  Provide evaluation in JSON: { "successRate": number, "outcome": "string", "riskLevel": "Low|Medium|High|Critical" }`;
  
  const response = await puterChat(prompt);
  try {
    return JSON.parse(response.replace(/```json|```/g, '').trim());
  } catch {
    return {
      successRate: 50,
      outcome: "Outcome indeterminate. Exercise caution.",
      riskLevel: "Medium"
    };
  }
}

export async function generateDrillTips(drillId: string, difficulty: string): Promise<string[]> {
  const prompt = `Provide 3 elite-level tactical tips for the drill: "${drillId}" at ${difficulty} level. 
  Format as a simple JSON array of strings: ["tip1", "tip2", "tip3"]`;
  
  const response = await puterChat(prompt);
  try {
    return JSON.parse(response.replace(/```json|```/g, '').trim());
  } catch {
    return ["Maintain focus", "Control breathing", "Check surroundings"];
  }
}

export async function generateInjuryAlerts(injuries: string[], drillId: string): Promise<InjuryAlert> {
  const prompt = `Analyze injury risk for drill "${drillId}" given existing injuries: ${injuries.join(', ')}.
  JSON format: { "risk": "Low|Moderate|High", "prevention": ["tip1", "tip2"] }`;
  
  const response = await puterChat(prompt);
  try {
    return JSON.parse(response.replace(/```json|```/g, '').trim());
  } catch {
    return { risk: "Low", prevention: ["Standard warm-up"] };
  }
}

export async function generateLessonSummary(lessonTitle: string, level: string): Promise<LessonSummary> {
  const prompt = `Summarize this combat lesson: "${lessonTitle}" for level ${level}.
  JSON format: { "keyPoints": ["point1", "point2"], "practicalApplication": "string" }`;
  
  const response = await puterChat(prompt);
  try {
    return JSON.parse(response.replace(/```json|```/g, '').trim());
  } catch {
    return { keyPoints: ["Understand basics", "Apply in field"], practicalApplication: "Use during drills" };
  }
}

export async function generateMotivationalMessage(stats: any): Promise<string> {
  const prompt = `Generate a short, gritty, motivational message for a combat operator based on their stats: ${JSON.stringify(stats)}.`;
  return await puterChat(prompt);
}
