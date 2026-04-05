import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  Clock, 
  Wifi, 
  Smartphone, 
  Monitor, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  X,
  Settings
} from 'lucide-react';
import performanceMonitor from '../utils/performanceMonitor';
import { useVisibility } from '../hooks/useUtils';

/**
 * 性能监控面板
 * 实时显示网站性能指标
 */

const PerformancePanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const isVisible = useVisibility();

  // 定期收集性能数据
  useEffect(() => {
    if (!isVisible || !isOpen) return;

    const collectMetrics = () => {
      const currentMetrics = performanceMonitor.getMetrics();
      setMetrics(currentMetrics);
      setHistory(prev => {
        const newHistory = [...prev, {
          timestamp: Date.now(),
          ...currentMetrics
        }];
        // 保留最近 60 条记录
        return newHistory.slice(-60);
      });
    };

    collectMetrics();
    const interval = setInterval(collectMetrics, 5000);

    return () => clearInterval(interval);
  }, [isVisible, isOpen]);

  // 键盘快捷键切换面板 (Shift + P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-700 hover:border-indigo-500 transition-colors"
        title="性能监控面板 (Shift+P)"
      >
        <Activity className="w-5 h-5 text-indigo-400" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-4 right-4 z-50 w-80 max-h-[600px] overflow-auto bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700"
    >
      {/* Header */}
      <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900/95">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white font-semibold">性能监控</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">Shift+P 切换</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* 核心指标 */}
        {metrics && (
          <>
            <MetricSection title="核心性能指标">
              <MetricGrid>
                <MetricCard
                  icon={Zap}
                  label="FCP"
                  value={`${metrics.fcp.toFixed(2)}s`}
                  status={getFCPStatus(metrics.fcp)}
                />
                <MetricCard
                  icon={Clock}
                  label="LCP"
                  value={`${metrics.lcp.toFixed(2)}s`}
                  status={getLCPStatus(metrics.lcp)}
                />
                <MetricCard
                  icon={Activity}
                  label="FID"
                  value={`${metrics.fid.toFixed(0)}ms`}
                  status={getFIDStatus(metrics.fid)}
                />
                <MetricCard
                  icon={Monitor}
                  label="CLS"
                  value={metrics.cls.toFixed(3)}
                  status={getCLSStatus(metrics.cls)}
                />
              </MetricGrid>
            </MetricSection>

            <MetricSection title="内存使用">
              <div className="space-y-2">
                <MemoryBar
                  label="JS Heap"
                  used={metrics.jsHeapUsed}
                  total={metrics.jsHeapTotal}
                />
                <MemoryBar
                  label="DOM 节点"
                  used={metrics.domNodes}
                  total={null}
                  isCount
                />
              </div>
            </MetricSection>

            <MetricSection title="网络状态">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Wifi className={`w-4 h-4 ${metrics.isOnline ? 'text-green-400' : 'text-red-400'}`} />
                  <span className="text-sm text-gray-300">
                    {metrics.isOnline ? '在线' : '离线'}
                  </span>
                </div>
                {metrics.connection && (
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm text-gray-300">
                      {metrics.connection.effectiveType?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </MetricSection>

            {/* 性能历史图表 */}
            {history.length > 1 && (
              <MetricSection title="性能趋势">
                <MiniChart data={history} metric="fcp" />
              </MetricSection>
            )}
          </>
        )}

        {/* 快速操作 */}
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={() => {
              performanceMonitor.runPerformanceTest();
            }}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            运行性能测试
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// 指标卡片
const MetricCard = ({ icon: Icon, label, value, status }) => {
  const statusColors = {
    good: 'text-green-400 bg-green-400/10 border-green-400/20',
    moderate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    poor: 'text-red-400 bg-red-400/10 border-red-400/20'
  };

  return (
    <div className={`p-3 rounded-xl border ${statusColors[status]} transition-all`}>
      <div className="flex items-center justify-between mb-1">
        <Icon className="w-4 h-4" />
        {status === 'good' ? (
          <TrendingUp className="w-3 h-3" />
        ) : status === 'moderate' ? (
          <Activity className="w-3 h-3" />
        ) : (
          <AlertTriangle className="w-3 h-3" />
        )}
      </div>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
};

// 指标网格
const MetricGrid = ({ children }) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);

// 指标区域
const MetricSection = ({ title, children }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium text-gray-400">{title}</h4>
    {children}
  </div>
);

// 内存条
const MemoryBar = ({ label, used, total, isCount = false }) => {
  const percentage = total ? Math.min((used / total) * 100, 100) : 0;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300">
          {isCount ? used : `${(used / 1024 / 1024).toFixed(1)} MB`}
          {total && ` / ${(total / 1024 / 1024).toFixed(1)} MB`}
        </span>
      </div>
      {total && (
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};

// 迷你图表
const MiniChart = ({ data, metric }) => {
  const values = data.map(d => d[metric]).filter(v => v > 0);
  if (values.length < 2) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="h-20 w-full">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={points}
          className="text-indigo-400"
        />
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min.toFixed(2)}s</span>
        <span>{max.toFixed(2)}s</span>
      </div>
    </div>
  );
};

// 状态判断
const getFCPStatus = (fcp) => (fcp < 1.8 ? 'good' : fcp < 3.0 ? 'moderate' : 'poor');
const getLCPStatus = (lcp) => (lcp < 2.5 ? 'good' : lcp < 4.0 ? 'moderate' : 'poor');
const getFIDStatus = (fid) => (fid < 100 ? 'good' : fid < 300 ? 'moderate' : 'poor');
const getCLSStatus = (cls) => (cls < 0.1 ? 'good' : cls < 0.25 ? 'moderate' : 'poor');

export default PerformancePanel;
