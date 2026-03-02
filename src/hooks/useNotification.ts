import { useContext } from 'react';
import { NotificationContext, NotificationType } from '../contexts/NotificationContext';

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }

  return {
    success: (message: string, duration?: number) =>
      context.addNotification(message, 'success', duration),
    error: (message: string, duration?: number) =>
      context.addNotification(message, 'error', duration),
    info: (message: string, duration?: number) =>
      context.addNotification(message, 'info', duration),
    warning: (message: string, duration?: number) =>
      context.addNotification(message, 'warning', duration),
  };
}
