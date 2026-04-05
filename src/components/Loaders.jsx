import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 加载状态组件
 * 提供多种加载动画
 */

// 基础加载器
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={className}
    >
      <Loader2 className={`${sizeClasses[size]} text-indigo-400`} />
    </motion.div>
  );
};

// 页面级加载
export const PageLoader = ({ message = '加载中...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <LoadingSpinner size="xl" />
        <p className="text-gray-400 text-sm animate-pulse">{message}</p>
      </div>
    </div>
  );
};

// 卡片加载
export const CardLoader = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="md" />
    </div>
  );
};

// 按钮加载
export const ButtonLoader = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <Loader2 className={`${sizeClasses[size]} text-white`} />
    </motion.div>
  );
};

// 列表加载
export const ListLoader = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700/50 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700/50 rounded w-3/4" />
            <div className="h-3 bg-gray-700/50 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

// 网格加载
export const GridLoader = ({ count = 6, columns = 3 }) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square bg-gray-700/50 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
};

// 进度条加载
export const ProgressLoader = ({ progress = 0, message = '加载中...' }) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{message}</p>
        <span className="text-indigo-400 text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

// 骨架屏加载
export const SkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-700/50 rounded ${className}`} />
  );
};
