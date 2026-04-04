import { motion } from 'framer-motion';

/**
 * 骨架屏组件
 * 用于加载时的占位符，提升用户体验
 */
const Skeleton = ({ className = '', width, height, variant = 'text', ...props }) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const variants = {
    text: 'h-4 w-full',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    image: 'rounded-xl',
  };

  return (
    <motion.div
      className={`${baseClasses} ${variants[variant] || ''} ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 0.8,
      }}
      {...props}
    />
  );
};

/**
 * 卡片骨架屏
 */
export const SkeletonCard = ({ imageHeight = 'h-48' }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
      <Skeleton className={`${imageHeight} w-full`} variant="image" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" variant="circle" />
        </div>
      </div>
    </div>
  );
};

/**
 * 列表骨架屏
 */
export const SkeletonList = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4 items-start">
          <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" variant="image" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 表格骨架屏
 */
export const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-3">
      {/* 表头 */}
      <div className="flex gap-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* 表格内容 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * 仪表盘骨架屏
 */
export const SkeletonDashboard = () => {
  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
      
      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
