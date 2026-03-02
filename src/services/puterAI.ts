/**
 * puterAI.ts
 * Wrapper for Puter.js AI services
 */

declare global {
  interface Window {
    puter: any;
  }
}

export async function puterChat(prompt: string): Promise<string> {
  try {
    const response = await window.puter.ai.chat(prompt);
    return response.toString();
  } catch (error) {
    console.error('Puter AI Error:', error);
    throw error;
  }
}
