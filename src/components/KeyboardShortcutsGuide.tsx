import React from 'react';
import { X, Command, CtrlKey } from 'lucide-react';

interface KeyboardShortcutsGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsGuide({ isOpen, onClose }: KeyboardShortcutsGuideProps) {
  const shortcuts = [
    { keys: ['⌘', 'K'], label: 'Open Search', category: 'Navigation' },
    { keys: ['Esc'], label: 'Close Modals', category: 'Navigation' },
    { keys: ['⌘', 'Z'], label: 'Undo', category: 'Editing' },
    { keys: ['⌘', 'Shift', 'Z'], label: 'Redo', category: 'Editing' },
    { keys: ['Tab'], label: 'Navigate Forward', category: 'Navigation' },
    { keys: ['Shift', 'Tab'], label: 'Navigate Backward', category: 'Navigation' },
    { keys: ['Enter'], label: 'Activate Button', category: 'Interaction' },
    { keys: ['Space'], label: 'Toggle Checkbox/Play Video', category: 'Interaction' },
  ];

  const categories = [...new Set(shortcuts.map((s) => s.category))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="Close shortcuts guide"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {shortcut.label}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <React.Fragment key={i}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                              {key}
                            </kbd>
                            {i < shortcut.keys.length - 1 && (
                              <span className="text-gray-400 text-xs mx-1">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Tip: Press <kbd className="px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">?</kbd> anytime to show this guide
          </p>
        </div>
      </div>
    </div>
  );
}
