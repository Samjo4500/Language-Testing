import { useEffect } from 'react';

export function usePerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Observe LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics/web-vitals', JSON.stringify({
            metric: 'LCP',
            value: Math.round(lastEntry.startTime),
            url: window.location.pathname,
            timestamp: Date.now(),
          }));
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      return () => { lcpObserver.disconnect(); };
    } catch {}
  }, []);
}
