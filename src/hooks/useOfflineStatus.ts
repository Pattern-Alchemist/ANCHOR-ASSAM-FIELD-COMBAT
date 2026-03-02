import { useEffect, useState, useCallback } from 'react';

export interface OfflineStatus {
  isOnline: boolean;
  pendingItems: number;
  lastSyncTime?: number;
}

export function useOfflineStatus() {
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    pendingItems: 0,
    lastSyncTime: undefined,
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, isOnline: true }));
      console.log('[v0] App is online');
    };

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, isOnline: false }));
      console.log('[v0] App is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updatePendingItems = useCallback((count: number) => {
    setStatus((prev) => ({ ...prev, pendingItems: count }));
  }, []);

  const recordSync = useCallback(() => {
    setStatus((prev) => ({
      ...prev,
      lastSyncTime: Date.now(),
      pendingItems: 0,
    }));
  }, []);

  return {
    ...status,
    updatePendingItems,
    recordSync,
  };
}
