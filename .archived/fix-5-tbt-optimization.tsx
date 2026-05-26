/**
 * FIX #5: Reduce Total Blocking Time (TBT) - Performance Optimization
 * 
 * Current: TBT = 648ms (POOR) - JavaScript blocks main thread for 648ms
 * Target: TBT < 200ms (GOOD)
 * 
 * This file provides:
 * 1. Next.js dynamic imports with lazy loading
 * 2. Script defer strategies for third-party scripts
 * 3. Intersection Observer for below-fold content
 * 4. Web Worker offload for heavy computations
 * 5. Bundle analysis and code splitting config
 */

import React, { lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';

// ============================================================
// 1. DYNAMIC IMPORTS - Lazy Load Route Components
// ============================================================

/**
 * Replace your static imports in your main App/Layout component
 * with these dynamic imports. Each route chunk loads only when 
 * the user navigates to that route.
 */

// BEFORE (bad - loads everything upfront):
// import TestPage from './pages/TestPage';
// import AiTutorPage from './pages/AiTutorPage';
// import CoursesPage from './pages/CoursesPage';
// import CommunityPage from './pages/CommunityPage';

// AFTER (good - code-split by route):

export const LazyTestPage = dynamic(
  () => import('./pages/TestPage'),
  {
    loading: () => <RouteLoadingFallback name="Test" />,
    ssr: false, // Test page is client-only (needs auth, mic access)
  }
);

export const LazyAiTutorPage = dynamic(
  () => import('./pages/AiTutorPage'),
  {
    loading: () => <RouteLoadingFallback name="AI Tutor" />,
    ssr: false, // Chat interface is client-only
  }
);

export const LazyCoursesPage = dynamic(
  () => import('./pages/CoursesPage'),
  {
    loading: () => <RouteLoadingFallback name="Courses" />,
    ssr: true, // Course listing can be server-rendered for SEO
  }
);

export const LazyCommunityPage = dynamic(
  () => import('./pages/CommunityPage'),
  {
    loading: () => <RouteLoadingFallback name="Community" />,
    ssr: false,
  }
);

export const LazyDashboardPage = dynamic(
  () => import('./pages/DashboardPage'),
  {
    loading: () => <RouteLoadingFallback name="Dashboard" />,
    ssr: false, // Dashboard is user-specific
  }
);

export const LazyPricingPage = dynamic(
  () => import('./pages/PricingPage'),
  {
    loading: () => <RouteLoadingFallback name="Pricing" />,
    ssr: true, // Pricing should be crawlable
  }
);

/** Loading fallback shown while lazy chunk loads */
const RouteLoadingFallback: React.FC<{ name: string }> = ({ name }) => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    background: '#0a0618',
  }}>
    <div style={{
      width: 40,
      height: 40,
      border: '3px solid rgba(167, 139, 250, 0.2)',
      borderTopColor: '#a78bfa',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <span style={{ fontSize: '0.875rem' }}>Loading {name}...</span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);


// ============================================================
// 2. COMPONENT-LEVEL LAZY LOADING
// ============================================================

/**
 * Heavy components that should only load when needed
 */

// CEFR Orbital Animation - heavy Canvas/WebGL, only needed on homepage
export const LazyOrbitalAnimation = dynamic(
  () => import('./components/OrbitalAnimation'),
  {
    loading: () => <div style={{ height: 300, background: 'transparent' }} />,
    ssr: false, // Canvas doesn't work on server
  }
);

// Speaking Waveform Visualization - only needed during speaking test
export const LazyWaveformVisualizer = dynamic(
  () => import('./components/WaveformVisualizer'),
  {
    loading: () => <div style={{ height: 80, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }} />,
    ssr: false,
  }
);

// Charts/Analytics - only needed on dashboard
export const LazyActivityChart = dynamic(
  () => import('./components/ActivityChart'),
  {
    loading: () => <div style={{ height: 200, background: 'rgba(255,255,255,0.02)', borderRadius: 12 }} />,
    ssr: false,
  }
);

// Test Results Component (Fix #3)
export const LazyTestResults = dynamic(
  () => import('./components/TestResultsPage'),
  {
    loading: () => <RouteLoadingFallback name="Results" />,
    ssr: false,
  }
);


// ============================================================
// 3. INTERSECTION OBSERVER - Load Below-Fold Content
// ============================================================

import { useEffect, useRef, useState } from 'react';

/**
 * useLazyLoad Hook
 * 
 * Usage: Wrap any below-fold component to only load when 
 * it scrolls into viewport.
 */
export function useLazyLoad<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if IntersectionObserver not supported
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only trigger once
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before visible
        threshold: 0.01,
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}

/** LazySection Component - wraps any section to lazy-load */
export const LazySection: React.FC<{
  children: React.ReactNode;
  placeholderHeight?: number;
  placeholder?: React.ReactNode;
}> = ({ children, placeholderHeight = 400, placeholder }) => {
  const { ref, isVisible } = useLazyLoad<HTMLDivElement>();

  return (
    <div ref={ref}>
      {isVisible ? (
        children
      ) : (
        placeholder || (
          <div style={{ 
            height: placeholderHeight, 
            background: 'rgba(255, 255, 255, 0.01)',
            borderRadius: '0.75rem',
          }} />
        )
      )}
    </div>
  );
};

/** Usage example in your homepage:
 * 
 * // Hero loads immediately (above fold)
 * <HeroSection />
 * 
 * // Speaking demo loads when scrolled to
 * <LazySection placeholderHeight={500}>
 *   <SpeakingDemoSection />
 * </LazySection>
 * 
 * // Pricing section loads when scrolled to  
 * <LazySection placeholderHeight={600}>
 *   <PricingSection />
 * </LazySection>
 * 
 * // FAQ section loads when scrolled to
 * <LazySection placeholderHeight={400}>
 *   <FaqSection />
 * </LazySection>
 */


// ============================================================
// 4. SCRIPT LOADING OPTIMIZATION
// ============================================================

/**
 * DeferredScript Component
 * 
 * Delays loading of non-critical third-party scripts until 
 * after the page is interactive.
 */
interface DeferredScriptProps {
  src: string;
  strategy?: 'defer' | 'lazy' | 'idle';
  onLoad?: () => void;
}

export const DeferredScript: React.FC<DeferredScriptProps> = ({ 
  src, 
  strategy = 'defer',
  onLoad 
}) => {
  const [shouldLoad, setShouldLoad] = useState(strategy === 'defer');

  useEffect(() => {
    if (strategy === 'lazy') {
      // Load after 3 seconds or first user interaction
      const timer = setTimeout(() => setShouldLoad(true), 3000);
      const onInteraction = () => {
        setShouldLoad(true);
        clearTimeout(timer);
      };
      window.addEventListener('mousemove', onInteraction, { once: true });
      window.addEventListener('scroll', onInteraction, { once: true });
      window.addEventListener('touchstart', onInteraction, { once: true });
      window.addEventListener('keydown', onInteraction, { once: true });
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('mousemove', onInteraction);
        window.removeEventListener('scroll', onInteraction);
        window.removeEventListener('touchstart', onInteraction);
        window.removeEventListener('keydown', onInteraction);
      };
    }

    if (strategy === 'idle') {
      // Load when browser is idle (requestIdleCallback)
      const load = () => setShouldLoad(true);
      if ('requestIdleCallback' in window) {
        const id = (window as any).requestIdleCallback(load, { timeout: 5000 });
        return () => (window as any).cancelIdleCallback(id);
      } else {
        const timer = setTimeout(load, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [strategy]);

  if (!shouldLoad) return null;

  return (
    <script
      src={src}
      async
      onLoad={onLoad}
      // Using dangerouslySetInnerHTML approach for inline scripts
    />
  );
};

/**
 * ChatWidgetLoader - loads the chat widget on first hover
 * 
 * Place this in your layout. The chat widget script only loads
 * when the user hovers over the chat button area.
 */
export const ChatWidgetLoader: React.FC = () => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    // Also load after 10 seconds as fallback
    const fallbackTimer = setTimeout(() => setShouldLoad(true), 10000);

    const handleHover = () => {
      setShouldLoad(true);
      clearTimeout(fallbackTimer);
    };

    trigger.addEventListener('mouseenter', handleHover, { once: true });
    trigger.addEventListener('touchstart', handleHover, { once: true });

    return () => {
      clearTimeout(fallbackTimer);
      trigger.removeEventListener('mouseenter', handleHover);
      trigger.removeEventListener('touchstart', handleHover);
    };
  }, []);

  return (
    <>
      {/* Invisible trigger area around the chat button location */}
      <div
        ref={triggerRef}
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: 100,
          height: 100,
          zIndex: 40,
        }}
      />
      {shouldLoad && (
        <script
          src="/chat-widget.js" // Your chat widget script
          async
          defer
        />
      )}
    </>
  );
};


// ============================================================
// 5. NEXT.JS CONFIG - webpack optimization
// ============================================================

/**
 * next.config.js / next.config.ts
 * 
 * Add these optimizations to your existing config:
 */

/*

// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for better development
  reactStrictMode: true,

  // Code splitting optimization
  experimental: {
    // Optimize package imports - only load what you use
    optimizePackageImports: [
      'recharts',        // If you use charts
      'lucide-react',    // Icons - tree shake unused
      'framer-motion',   // Animations
    ],
  },

  // Webpack optimization
  webpack: (config, { isServer, nextRuntime }) => {
    // Split large vendor chunks
    config.optimization.splitChunks = {
      ...config.optimization.splitChunks,
      chunks: 'all',
      cacheGroups: {
        // Vendor chunk - React, ReactDOM, etc.
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 10,
          // Split large libraries into separate chunks
          reuseExistingChunk: true,
        },
        // UI library chunk
        ui: {
          test: /[\\/]node_modules[\\/](@radix-ui|framer-motion)[\\/]/,
          name: 'ui-libs',
          chunks: 'all',
          priority: 20,
        },
        // Analytics chunk (separate from main)
        analytics: {
          test: /[\\/]node_modules[\\/](@vercel\/analytics|gtag)[\\/]/,
          name: 'analytics',
          chunks: 'all',
          priority: 5,
        },
      },
    };

    // Don't bundle server-only modules on client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },

  // Compression
  compress: true,

  // Output standalone for Docker deployment
  output: 'standalone',
};

export default nextConfig;

*/


// ============================================================
// 6. WEB WORKER FOR AI SCORING (Offload from main thread)
// ============================================================

/**
 * useAiScoringWorker Hook
 * 
 * Runs AI scoring computation in a Web Worker to avoid
 * blocking the main UI thread during speaking/writing evaluation.
 */
export function useAiScoringWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker from inline script
    const workerCode = `
      self.onmessage = function(e) {
        const { transcript, prompt, evaluationCriteria } = e.data;
        
        // This runs in a separate thread - won't block UI
        const result = evaluateResponse(transcript, prompt, evaluationCriteria);
        self.postMessage(result);
      };
      
      function evaluateResponse(transcript, prompt, criteria) {
        // Simulated scoring logic
        // In production, this calls your AI API
        const scores = {
          grammar: Math.floor(Math.random() * 30) + 70,
          vocabulary: Math.floor(Math.random() * 30) + 70,
          fluency: Math.floor(Math.random() * 30) + 70,
          pronunciation: Math.floor(Math.random() * 30) + 70,
          coherence: Math.floor(Math.random() * 30) + 70,
          interaction: Math.floor(Math.random() * 30) + 70,
        };
        
        const overall = Math.round(
          Object.values(scores).reduce((a, b) => a + b, 0) / 6
        );
        
        return { scores, overall, feedback: generateFeedback(scores) };
      }
      
      function generateFeedback(scores) {
        const weakest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0];
        return \`Strong performance! Your weakest area is \${weakest[0]} (\${weakest[1]}%). Focus on this for improvement.\`;
      }
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const scoreResponse = (data: {
    transcript: string;
    prompt: string;
    evaluationCriteria: string[];
  }): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      const handleMessage = (e: MessageEvent) => {
        workerRef.current?.removeEventListener('message', handleMessage);
        resolve(e.data);
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage(data);
    });
  };

  return { scoreResponse };
}


// ============================================================
// 7. PRELOAD CRITICAL RESOURCES
// ============================================================

/**
 * Add to your _document.tsx or layout.tsx <head>:
 * 
 * <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
 * <link rel="preload" href="/logo.svg" as="image" />
 * <link rel="preconnect" href="https://fonts.googleapis.com" />
 * <link rel="dns-prefetch" href="https://api.your-backend.com" />
 * 
 * // Prefetch likely next pages
 * <link rel="prefetch" href="/test" />
 * <link rel="prefetch" href="/pricing" />
 */


// ============================================================
// 8. PERFORMANCE MONITORING HOOK
// ============================================================

/**
 * usePerformanceMonitor Hook
 * 
 * Tracks Core Web Vitals and logs them for analysis.
 * Integrate with Vercel Analytics, Sentry, or your own endpoint.
 */
export function usePerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Check if PerformanceObserver is supported
    if (!('PerformanceObserver' in window)) return;

    // Observe LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      // Send to analytics
      sendToAnalytics('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Observe FID (First Input Delay) - now INP
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.interactionId > 0) {
          sendToAnalytics('INP', entry.duration);
        }
      });
    });
    inpObserver.observe({ entryTypes: ['event'] });

    // Observe CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[];
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      sendToAnalytics('CLS', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Observe TTFB (Time to First Byte)
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      sendToAnalytics('TTFB', navigation.responseStart - navigation.startTime);
    }

    return () => {
      lcpObserver.disconnect();
      inpObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);
}

function sendToAnalytics(metric: string, value: number) {
  // Send to your analytics endpoint
  // Replace with your actual analytics integration
  
  // Option 1: Vercel Analytics
  // import { track } from '@vercel/analytics';
  // track(`web_vitals_${metric}`, { value: Math.round(value) });

  // Option 2: Custom endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/web-vitals', JSON.stringify({
      metric,
      value: Math.round(value),
      url: window.location.pathname,
      timestamp: Date.now(),
    }));
  }

  // Option 3: Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric}: ${Math.round(value)}`);
  }
}


// ============================================================
// 9. BUNDLE ANALYZER SETUP
// ============================================================

/**
 * Add to your package.json scripts:
 * 
 * "scripts": {
 *   "dev": "next dev",
 *   "build": "next build",
 *   "start": "next start",
 *   "analyze": "cross-env ANALYZE=true next build",
 * }
 * 
 * Install: npm install --save-dev @next/bundle-analyzer cross-env
 * 
 * Add to next.config.ts:
 * 
 * import withBundleAnalyzer from '@next/bundle-analyzer';
 * 
 * const withAnalyzer = withBundleAnalyzer({
 *   enabled: process.env.ANALYZE === 'true',
 * });
 * 
 * export default withAnalyzer(nextConfig);
 * 
 * Run: npm run analyze
 * This opens a visualization of your bundle to identify large dependencies.
 */


// ============================================================
// 10. CHECKLIST: Apply These Changes
// ============================================================

/**
 * STEP-BY-STEP IMPLEMENTATION:
 * 
 * [ ] 1. Add dynamic imports for all route components (Section 1)
 * [ ] 2. Wrap below-fold homepage sections in LazySection (Section 3)
 * [ ] 3. Replace static OrbitalAnimation import with LazyOrbitalAnimation (Section 2)
 * [ ] 4. Add ChatWidgetLoader to your layout (Section 4)
 * [ ] 5. Update next.config.ts with webpack optimizations (Section 5)
 * [ ] 6. Add preload links to your document head (Section 7)
 * [ ] 7. Install bundle analyzer: npm i -D @next/bundle-analyzer cross-env (Section 9)
 * [ ] 8. Add usePerformanceMonitor to your app root (Section 8)
 * [ ] 9. Run npm run analyze to verify chunk sizes
 * [ ] 10. Deploy and re-test with GTmetrix (target TBT < 200ms)
 * 
 * EXPECTED IMPROVEMENTS:
 * - Initial JS bundle: ~40% smaller (routes split)
 * - TBT: 648ms → 150-200ms
 * - LCP: 808ms → 600-700ms (with preloading)
 * - Time to Interactive: ~30% faster on 4G
 */


export { useLazyLoad, useAiScoringWorker, usePerformanceMonitor };
export default RouteLoadingFallback;
