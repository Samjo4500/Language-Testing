'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring } from '@/lib/performance';

/**
 * PerformanceMonitor — initializes Core Web Vitals tracking.
 *
 * Place this component once in the root layout.
 * It runs only on the client side after mount.
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Initialize performance monitoring after page load
    // Delay slightly to avoid blocking initial render
    const timer = setTimeout(() => {
      initPerformanceMonitoring();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null; // No UI rendered
}
