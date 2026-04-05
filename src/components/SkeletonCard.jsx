import React from 'react';

/**
 * 卡片骨架屏 - 用于内容加载时的占位符
 */
const SkeletonCard = ({ type = 'default', className = '' }) => {
  const baseClasses = `animate-pulse rounded-2xl overflow-hidden ${className}`;
  
  if (type === 'image') {
    return (
      <div className={baseClasses}>
        <div className="aspect-video bg-gray-700/50" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-700/50 rounded w-3/4" />
          <div className="h-3 bg-gray-700/50 rounded w-1/2" />
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-700/50" />
              <div className="h-3 bg-gray-700/50 rounded w-24" />
            </div>
            <div className="h-3 bg-gray-700/50 rounded w-16" />
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'article') {
    return (
      <div className={baseClasses}>
        <div className="aspect-[16/9] bg-gray-700/50" />
        <div className="p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-3 bg-gray-700/50 rounded w-20" />
            <div className="h-3 bg-gray-700/50 rounded w-16" />
          </div>
          <div className="h-5 bg-gray-700/50 rounded w-full" />
          <div className="h-3 bg-gray-700/50 rounded w-2/3" />
        </div>
      </div>
    );
  }
  
  if (type === 'event') {
    return (
      <div className={baseClasses}>
        <div className="aspect-[4/3] bg-gray-700/50" />
        <div className="p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-gray-700/50" />
            <div className="h-4 bg-gray-700/50 rounded w-32" />
          </div>
          <div className="h-5 bg-gray-700/50 rounded w-full" />
          <div className="h-4 bg-gray-700/50 rounded w-3/4" />
          <div className="flex items-center justify-between pt-2">
            <div className="h-8 bg-gray-700/50 rounded w-24" />
            <div className="h-8 bg-gray-700/50 rounded w-8" />
          </div>
        </div>
      </div>
    );
  }
  
  // Default
  return (
    <div className={baseClasses}>
      <div className="aspect-square bg-gray-700/50" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700/50 rounded w-3/4" />
        <div className="h-3 bg-gray-700/50 rounded w-1/2" />
      </div>
    </div>
  );
};

export default SkeletonCard;
