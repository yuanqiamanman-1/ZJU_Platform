import { useEffect } from 'react';

/**
 * Service Worker 注册 Hook
 * 用于注册 PWA Service Worker
 */
export const useServiceWorker = () => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        if (process.env.NODE_ENV === 'development') {
          console.log('[SW] Service Worker 注册成功:', registration.scope);
        }

        // 检查更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (process.env.NODE_ENV === 'development') {
                console.log('[SW] 新版本可用，刷新后生效');
              }
              
              // 可以在这里显示更新提示
              if (window.confirm('有新版本可用，是否刷新？')) {
                window.location.reload();
              }
            }
          });
        });
      } catch (error) {
        console.error('[SW] Service Worker 注册失败:', error);
      }
    };

    registerSW();
  }, []);
};

/**
 * 检查网络状态 Hook
 */
export const useNetworkStatus = () => {
  useEffect(() => {
    const handleOnline = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Network] 网络已连接');
      }
      // 可以在这里触发后台同步
      if ('serviceWorker' in navigator && 'sync' in window.registration) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync.register('sync-data');
        });
      }
    };

    const handleOffline = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Network] 网络已断开');
      }
      // 可以在这里显示离线提示
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
};

export default useServiceWorker;
