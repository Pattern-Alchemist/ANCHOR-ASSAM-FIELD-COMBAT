import React, { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export function NotificationCenter() {
  const context = useContext(NotificationContext);

  if (!context) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {context.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg border ${getBgColor(
            notification.type
          )} shadow-lg animate-in slide-in-from-right-4 duration-300`}
          role="status"
          aria-live="assertive"
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
          <p className={`flex-1 text-sm font-medium ${getTextColor(notification.type)}`}>
            {notification.message}
          </p>
          <button
            onClick={() => context.removeNotification(notification.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
