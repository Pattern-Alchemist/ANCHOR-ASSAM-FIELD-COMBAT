/**
 * puterAI.ts - Puter.js AI Service Integration
 * Handles all AI calls with caching, rate limiting, and offline support
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const CACHE_TTL = 3600000; // 1 hour
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMITS = {
  combatFocus: 10,
  scenario: 20,
  drillTips: 15,
  injuryAlert: 10,
  lessonSummary: 10,
  motivational: 5
};

const cache = new Map<string, CacheEntry>();
const rateLimits = new Map<string, RateLimitEntry>();

/**
 * Initialize Puter.js AI
 */
export async function initPuterAI(): Promise<boolean> {
  try {
    if (typeof window !== 'undefined' && (window as any).puter) {
      console.log('[puterAI] Puter.js initialized successfully');
      return true;
    }
    console.log('[puterAI] Puter.js not available, using fallback mode');
    return false;
  } catch (error) {
    console.error('[puterAI] Initialization error:', error);
    return false;
  }
}

/**
 * Make an AI call with caching and rate limiting
 */
export async function callPuterAI(
  action: string,
  prompt: string,
  options: { useCache?: boolean; timeout?: number } = {}
): Promise<any> {
  const { useCache = true, timeout = 8000 } = options;

  // Check cache
  if (useCache) {
    const cached = getFromCache(action);
    if (cached) return cached;
  }

  // Check rate limit
  if (!checkRateLimit(action)) {
    console.warn(`[puterAI] Rate limit exceeded for action: ${action}`);
    return getOfflineFallback(action);
  }

  try {
    // Check online status
    if (!navigator.onLine) {
      console.log('[puterAI] Offline - using fallback');
      return getOfflineFallback(action);
    }

    const puter = (window as any).puter;
    if (!puter || !puter.ai) {
      console.log('[puterAI] Puter.ai not available');
      return getOfflineFallback(action);
    }

    // Make the call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await Promise.race([
        puter.ai.chat(prompt),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI call timeout')), timeout)
        )
      ]);

      clearTimeout(timeoutId);

      // Cache the result
      if (useCache && response) {
        setCache(action, response);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error(`[puterAI] Error calling AI for ${action}:`, error);
    return getOfflineFallback(action);
  }
}

/**
 * Retrieve cached value
 */
export function getFromCache(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Store value in cache
 */
export function setCache(key: string, data: any, ttl: number = CACHE_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });

  // Persist to localStorage
  try {
    const cacheData = JSON.stringify({
      data,
      timestamp: Date.now(),
      ttl
    });
    localStorage.setItem(`cache_${key}`, cacheData);
  } catch (error) {
    console.warn('[puterAI] Failed to persist cache:', error);
  }
}

/**
 * Check rate limit for action
 */
export function checkRateLimit(action: keyof typeof RATE_LIMITS): boolean {
  const limit = RATE_LIMITS[action];
  const entry = rateLimits.get(action);
  const now = Date.now();

  if (!entry) {
    rateLimits.set(action, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (now > entry.resetTime) {
    rateLimits.set(action, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get offline fallback response
 */
export function getOfflineFallback(action: string): any {
  const fallbacks: Record<string, any> = {
    combatFocus: {
      pillar: 'Striking',
      reason: 'Maintain consistent striking fundamentals',
      drill: 'Focus on jab combinations and footwork',
      confidence: 0.7
    },
    scenario: {
      successRate: 65,
      outcome: 'Defender successfully neutralized threat using positioning',
      riskLevel: 'Moderate',
      injuries: [],
      xpGain: 50
    },
    drillTips: [
      'Start slow and focus on form before speed',
      'Maintain proper breathing throughout the drill',
      'Keep your core engaged for stability'
    ],
    injuryAlert: {
      riskLevel: 'Low',
      warning: 'No serious injuries detected',
      recommendations: ['Continue with caution'],
      modifiedDrills: []
    },
    lessonSummary: {
      title: 'Fundamentals Review',
      keyPoints: ['Master the basics', 'Practice consistently'],
      nextSteps: ['Review techniques', 'Increase intensity gradually'],
      difficulty: 'Beginner'
    },
    motivational: 'You are building strength and resilience with every session. Keep pushing!'
  };

  return fallbacks[action] || null;
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  cacheSize: number;
  cacheEntries: number;
  rateLimitStatus: Record<string, any>;
} {
  return {
    cacheSize: cache.size,
    cacheEntries: cache.size,
    rateLimitStatus: Object.fromEntries(rateLimits)
  };
}

/**
 * Clear cache
 */
export function clearCache(): void {
  cache.clear();
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('[puterAI] Failed to clear localStorage:', error);
  }
}

/**
 * Load cache from localStorage
 */
export function loadCacheFromStorage(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        const cacheKey = key.replace('cache_', '');
        const data = localStorage.getItem(key);
        if (data) {
          const entry = JSON.parse(data);
          const now = Date.now();
          if (now - entry.timestamp <= entry.ttl) {
            cache.set(cacheKey, entry);
          } else {
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    console.warn('[puterAI] Failed to load cache from storage:', error);
  }
}
