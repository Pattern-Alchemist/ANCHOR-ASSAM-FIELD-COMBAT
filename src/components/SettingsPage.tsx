import React, { useState, useEffect } from 'react';
import { X, Sun, Moon, Volume2, VolumeX, Vibrate, Download, Upload, Trash2 } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';

interface Settings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPage({ isOpen, onClose }: SettingsPageProps) {
  const [settings, setSettings] = useState<Settings>({
    theme: 'dark',
    soundEnabled: true,
    hapticEnabled: true,
  });
  const notification = useNotification();

  useEffect(() => {
    const saved = localStorage.getItem('anchor_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error('[v0] Failed to load settings:', error);
      }
    }
  }, []);

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('anchor_settings', JSON.stringify(newSettings));
  };

  const handleThemeToggle = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    saveSettings({ ...settings, theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    notification.success(`Switched to ${newTheme} mode`);
  };

  const handleSoundToggle = () => {
    saveSettings({ ...settings, soundEnabled: !settings.soundEnabled });
    notification.success(settings.soundEnabled ? 'Sound disabled' : 'Sound enabled');
  };

  const handleHapticToggle = () => {
    saveSettings({ ...settings, hapticEnabled: !settings.hapticEnabled });
    notification.success(settings.hapticEnabled ? 'Haptics disabled' : 'Haptics enabled');
  };

  const handleExportData = () => {
    try {
      const data = {
        favorites: localStorage.getItem('anchor_favorites'),
        history: localStorage.getItem('anchor_history'),
        achievements: localStorage.getItem('anchor_achievements'),
        settings: localStorage.getItem('anchor_settings'),
        exportDate: new Date().toISOString(),
      };
      
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `anchor-backup-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      notification.success('Data exported successfully');
    } catch (error) {
      notification.error('Failed to export data');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          if (data.favorites) localStorage.setItem('anchor_favorites', data.favorites);
          if (data.history) localStorage.setItem('anchor_history', data.history);
          if (data.achievements) localStorage.setItem('anchor_achievements', data.achievements);
          if (data.settings) localStorage.setItem('anchor_settings', data.settings);
          
          notification.success('Data imported successfully. Please refresh the page.');
        } catch (error) {
          notification.error('Failed to import data. Invalid file format.');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  const handleClearAllData = () => {
    if (!window.confirm('Are you sure? This will delete all your favorites, history, and progress. This cannot be undone.')) {
      return;
    }

    localStorage.removeItem('anchor_favorites');
    localStorage.removeItem('anchor_history');
    localStorage.removeItem('anchor_achievements');
    localStorage.removeItem('anchor_settings');
    
    notification.success('All data cleared');
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Theme Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Appearance
            </h3>
            <button
              onClick={handleThemeToggle}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                {settings.theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            </button>
          </div>

          {/* Sound Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Audio
            </h3>
            <button
              onClick={handleSoundToggle}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Sound Effects
                </span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            </button>
          </div>

          {/* Haptic Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Feedback
            </h3>
            <button
              onClick={handleHapticToggle}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Haptic Feedback
                </span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                settings.hapticEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            </button>
          </div>

          {/* Data Management */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Data Management
            </h3>
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors border border-blue-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 font-medium"
            >
              <Download className="w-5 h-5" />
              Export Data
            </button>
            <button
              onClick={handleImportData}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 transition-colors border border-green-200 dark:border-gray-700 text-green-600 dark:text-green-400 font-medium"
            >
              <Upload className="w-5 h-5" />
              Import Data
            </button>
            <button
              onClick={handleClearAllData}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 transition-colors border border-red-200 dark:border-gray-700 text-red-600 dark:text-red-400 font-medium"
            >
              <Trash2 className="w-5 h-5" />
              Clear All Data
            </button>
          </div>

          {/* Version Info */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              ANCHOR Combat Training v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
