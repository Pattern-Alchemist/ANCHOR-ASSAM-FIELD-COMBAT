import { useEffect } from 'react';

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: (e: KeyboardEvent) => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const isKeyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const isCtrlMatch = (shortcut.ctrlKey ?? false) === (e.ctrlKey || e.metaKey);
        const isShiftMatch = (shortcut.shiftKey ?? false) === e.shiftKey;
        const isAltMatch = (shortcut.altKey ?? false) === e.altKey;

        if (isKeyMatch && isCtrlMatch && isShiftMatch && isAltMatch) {
          e.preventDefault();
          shortcut.callback(e);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export const COMMON_SHORTCUTS = {
  SEARCH: { key: 'k', ctrlKey: true } as const,
  ESCAPE: { key: 'Escape' } as const,
  UNDO: { key: 'z', ctrlKey: true } as const,
  REDO: { key: 'z', ctrlKey: true, shiftKey: true } as const,
  ENTER: { key: 'Enter' } as const,
  TAB: { key: 'Tab' } as const,
  SAVE: { key: 's', ctrlKey: true } as const,
};

export const SHORTCUT_DESCRIPTIONS: Record<string, string> = {
  'Ctrl+K': 'Open Search',
  'Escape': 'Close Modals',
  'Ctrl+Z': 'Undo',
  'Ctrl+Shift+Z': 'Redo',
  'Ctrl+S': 'Save',
};
