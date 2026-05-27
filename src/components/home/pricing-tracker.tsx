'use client';

import { useEffect, useRef } from 'react';
import { trackPricingView } from '@/lib/analytics';

export function PricingTracker({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackPricingView();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <section ref={sectionRef}>{children}</section>;
}
