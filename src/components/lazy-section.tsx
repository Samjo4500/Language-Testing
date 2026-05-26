'use client';
import { useEffect, useRef, useState } from 'react';

// Check IntersectionObserver support at module level (only runs on client)
const hasIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;

export function LazySection({ 
  children, 
  placeholderHeight = 400,
  className = '' 
}: { 
  children: React.ReactNode; 
  placeholderHeight?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // If IntersectionObserver is not supported, render immediately
  const [isVisible, setIsVisible] = useState(!hasIntersectionObserver);

  useEffect(() => {
    // Already visible (no IO support) or no ref
    if (isVisible || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.01 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (
        <div style={{ height: placeholderHeight }} className="bg-transparent" />
      )}
    </div>
  );
}
