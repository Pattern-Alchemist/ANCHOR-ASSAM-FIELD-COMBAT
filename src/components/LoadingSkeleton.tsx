import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  type?: 'card' | 'text' | 'video' | 'list';
  width?: string;
  height?: string;
}

export function LoadingSkeleton({
  count = 1,
  type = 'card',
  width = 'w-full',
  height = 'h-48',
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'video':
        return (
          <div className={`${width} ${height} bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg animate-pulse`} />
        );
      case 'card':
        return (
          <div className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="h-40 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-full animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-5/6 animate-pulse" />
          </div>
        );
      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
