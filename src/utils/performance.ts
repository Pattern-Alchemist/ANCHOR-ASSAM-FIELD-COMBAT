// Performance optimization utilities

export const debounce = <T extends (...args: never[]) => void>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: never[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

export const throttle = <T extends (...args: never[]) => void>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  return ((...args: never[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  }) as T;
};

export const memoize = <T extends (...args: never[]) => unknown>(
  func: T
): T => {
  const cache = new Map();
  return ((...args: never[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

export const lazyLoad = (callback: () => void, delay: number = 500) => {
  let timeout: NodeJS.Timeout;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        timeout = setTimeout(() => {
          callback();
          observer.unobserve(entry.target);
        }, delay);
      }
    });
  });
  return observer;
};

export const measurePerformance = (label: string) => {
  const start = performance.now();
  return {
    end: () => {
      const end = performance.now();
      const duration = end - start;
      console.log(`[v0] ${label}: ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
};

export const batchUpdates = (updates: (() => void)[]) => {
  if ('flushSync' in React) {
    updates.forEach(update => update());
  } else {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  }
};
