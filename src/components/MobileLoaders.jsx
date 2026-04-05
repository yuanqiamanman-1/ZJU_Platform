import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useUtils';

/**
 * 优化的移动端加载状态
 * 针对移动网络和低性能设备优化
 */

// 移动端友好的加载器 - 使用 CSS 动画代替复杂动画
export const MobileLoader = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className="relative">
      {/* 外圈旋转 */}
      <div
        className={`${sizeClasses[size]} border-4 border-indigo-200/30 border-t-indigo-500 rounded-full animate-spin`}
      />
      {/* 内圈脉冲 */}
      <div
        className={`absolute inset-0 ${sizeClasses[size]} m-auto border-4 border-indigo-400/20 rounded-full animate-pulse`}
      />
    </div>
  );
};

// 带网络状态提示的加载器
export const NetworkAwareLoader = ({ loadingMessage = '加载中...', slowMessage = '网络较慢，请稍候...' }) => {
  const { isOnline, isSlow } = useNetworkStatus();
  const [showSlowMessage, setShowSlowMessage] = React.useState(false);

  React.useEffect(() => {
    if (isSlow) {
      const timer = setTimeout(() => setShowSlowMessage(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowSlowMessage(false);
    }
  }, [isSlow]);

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <WifiOff className="w-12 h-12 text-gray-400" />
        <p className="text-gray-400 text-sm">网络连接已断开</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {isSlow ? (
        <>
          <MobileLoader size="lg" />
          {showSlowMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-yellow-400 text-xs text-center"
            >
              {slowMessage}
            </motion.p>
          )}
        </>
      ) : (
        <>
          <MobileLoader size="lg" />
          <p className="text-gray-400 text-sm">{loadingMessage}</p>
        </>
      )}
    </div>
  );
};

// 骨架屏 - 移动端优化版
export const MobileSkeleton = ({ type = 'card', count = 3 }) => {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="space-y-4 px-4">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-2xl overflow-hidden animate-pulse">
            {/* 图片区域 */}
            <div className="aspect-video bg-gray-700/50" />
            {/* 内容区域 */}
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-700/50 rounded w-3/4" />
              <div className="h-3 bg-gray-700/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3 px-4">
        {skeletons.map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-700/50 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-700/50 rounded w-2/3" />
              <div className="h-2 bg-gray-700/50 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

// 渐进式图片加载
export const ProgressiveImage = ({ src, alt, className = '', placeholderColor = 'bg-gray-800' }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div className={`relative overflow-hidden ${placeholderColor} ${className}`}>
      {/* 占位符 */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <MobileLoader size="sm" />
        </div>
      )}
      
      {/* 实际图片 */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 错误状态 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <span className="text-gray-400 text-xs">加载失败</span>
        </div>
      )}
    </div>
  );
};

// 下拉刷新指示器
export const PullToRefreshIndicator = ({ refreshing }) => {
  if (!refreshing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-center py-4"
    >
      <MobileLoader size="sm" />
      <span className="ml-2 text-gray-400 text-xs">刷新中...</span>
    </motion.div>
  );
};

// 无限滚动加载
export const InfiniteScrollLoader = ({ loading, hasMore }) => {
  if (!hasMore) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 text-xs">没有更多内容了</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <MobileLoader size="sm" />
      </div>
    );
  }

  return null;
};

export default {
  MobileLoader,
  NetworkAwareLoader,
  MobileSkeleton,
  ProgressiveImage,
  PullToRefreshIndicator,
  InfiniteScrollLoader
};
