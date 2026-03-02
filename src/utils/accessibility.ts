// Accessibility utilities for WCAG AA compliance

export const ARIA_LABELS = {
  CLOSE: 'Close dialog',
  MENU: 'Open menu',
  SEARCH: 'Search content',
  FILTER: 'Filter results',
  SORT: 'Sort by',
  PLAY: 'Play video',
  PAUSE: 'Pause video',
  VOLUME: 'Volume control',
  FULLSCREEN: 'Fullscreen mode',
  SHARE: 'Share content',
  FAVORITE: 'Add to favorites',
  REMOVE: 'Remove from favorites',
  LOADING: 'Loading content',
  ERROR: 'Error message',
  SUCCESS: 'Success message',
  WARNING: 'Warning message',
  INFO: 'Information',
  BACK: 'Go back',
  NEXT: 'Go to next page',
  PREVIOUS: 'Go to previous page',
};

export const focusRing = 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

export const skipToMainContent = (e: React.KeyboardEvent) => {
  if (e.key === 'Tab' && e.shiftKey === false) {
    const main = document.querySelector('main');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

export const announceToScreenReaders = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    announcement.remove();
  }, 3000);
};

export const createAriaAlert = (message: string) => {
  announceToScreenReaders(message, 'assertive');
};

export const getContrastRatio = (rgb1: string, rgb2: string): number => {
  const getLuminance = (rgb: string) => {
    const [r, g, b] = rgb.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const [rs, gs, bs] = [r, g, b].map(v => {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};
