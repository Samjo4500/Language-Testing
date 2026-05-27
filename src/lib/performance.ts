/**
 * Performance Monitoring & Lazy Loading Utilities
 *
 * Helps reduce Total Blocking Time (TBT) by:
 * 1. Monitoring Core Web Vitals in production
 * 2. Providing Intersection Observer-based lazy loading
 * 3. Deferring non-critical scripts
 */

// ============================================================
// 1. CORE WEB VITALS MONITORING
// ============================================================

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  url: string;
  timestamp: number;
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    INP: [200, 500],
    CLS: [0.1, 0.25],
    TTFB: [800, 1800],
  };
  const [good, poor] = thresholds[name] || [Infinity, Infinity];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

function sendToAnalytics(metric: WebVitalMetric) {
  // Send to your analytics endpoint
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      navigator.sendBeacon(
        '/api/analytics/web-vitals',
        JSON.stringify(metric)
      );
    } catch {
      // Silently fail — analytics should never block UX
    }
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`);
  }
}

/**
 * Initialize Core Web Vitals monitoring.
 * Call once in your root layout or app component.
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'development') return;
  if (!('PerformanceObserver' in window)) return;

  const url = window.location.pathname;

  // Observe LCP
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      const value = lastEntry.startTime;
      sendToAnalytics({
        name: 'LCP',
        value,
        rating: getRating('LCP', value),
        url,
        timestamp: Date.now(),
      });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch { /* Not supported */ }

  // Observe INP (Interaction to Next Paint)
  try {
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceEventTiming[];
      entries.forEach((entry) => {
        if ((entry as any).interactionId > 0) {
          const value = entry.duration;
          sendToAnalytics({
            name: 'INP',
            value,
            rating: getRating('INP', value),
            url,
            timestamp: Date.now(),
          });
        }
      });
    });
    inpObserver.observe({ type: 'event', buffered: true });
  } catch { /* Not supported */ }

  // Observe CLS
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as LayoutShift[];
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      sendToAnalytics({
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
        url,
        timestamp: Date.now(),
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch { /* Not supported */ }

  // TTFB from navigation timing
  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const value = navigation.responseStart - navigation.startTime;
      sendToAnalytics({
        name: 'TTFB',
        value,
        rating: getRating('TTFB', value),
        url,
        timestamp: Date.now(),
      });
    }
  } catch { /* Not supported */ }
}

// Type augmentation for PerformanceObserver entry types
interface PerformanceEventTiming extends PerformanceEntry {
  duration: number;
  interactionId: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// ============================================================
// 2. LAZY LOAD UTILITY (Intersection Observer)
// ============================================================

/**
 * Creates an Intersection Observer that triggers a callback
 * when an element enters the viewport.
 *
 * Usage:
 * ```ts
 * const observer = createLazyLoadObserver((element) => {
 *   // Element is visible — load content
 * });
 * observer.observe(element);
 * ```
 */
export function createLazyLoadObserver(
  onVisible: (element: Element) => void,
  rootMargin = '100px'
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisible(entry.target);
        }
      });
    },
    { rootMargin, threshold: 0.01 }
  );
}

// ============================================================
// 3. DEFERRED SCRIPT LOADING
// ============================================================

/**
 * Loads a script after the page becomes idle or after a delay.
 * Useful for analytics, chat widgets, and other non-critical scripts.
 */
export function deferScript(src: string, delay = 3000): Promise<void> {
  return new Promise((resolve) => {
    const load = () => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => resolve(); // Don't block on error
      document.head.appendChild(script);
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => setTimeout(load, delay), { timeout: delay + 2000 });
    } else {
      setTimeout(load, delay);
    }
  });
}
