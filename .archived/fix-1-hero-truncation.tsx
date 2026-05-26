/**
 * FIX #1: Hero Text Truncation Bug
 * 
 * The bug: "The World's Most Advanced AI Language Assessment Platf" 
 * gets cut off because the typewriter container has a fixed width.
 * 
 * This file provides TWO solutions:
 * Option A: CSS-only fix (drop into your global CSS or Tailwind config)
 * Option B: Component rewrite with proper responsive sizing
 */

// ============================================================
// OPTION A: CSS FIX (Recommended - 15 minutes)
// Add this to your global CSS file (e.g., globals.css, index.css)
// or as a Tailwind @layer component
// ============================================================

/*
// globals.css or your main stylesheet

// Fix the typewriter container to properly size to content
.hero-typewriter-container {
  // Remove fixed width constraints
  width: auto !important;
  max-width: 90vw;
  
  // Ensure text doesn't clip
  overflow: visible !important;
  white-space: nowrap;
  
  // If using a typewriter animation, ensure the parent expands
  display: inline-flex;
  align-items: center;
}

// Fix the scrolling/marquee variant (if applicable)
.hero-marquee-track {
  width: max-content;
  min-width: 100%;
}

// Responsive: allow wrapping on very small screens
@media (max-width: 640px) {
  .hero-typewriter-container {
    white-space: normal;
    text-align: center;
    font-size: 0.75rem;
    padding: 0 1rem;
  }
}

// If the issue is a CSS animation container:
@keyframes hero-typing {
  from { width: 0; }
  to { width: 100%; } // Was probably a fixed pixel value
}

.hero-typing-animation {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  animation: hero-typing 2s steps(60, end) forwards;
  // The key fix: max-width must accommodate the full text
  max-width: 600px; // Increase from whatever it was (likely ~400px)
}

*/


// ============================================================
// OPTION B: REACT COMPONENT FIX (if CSS alone doesn't work)
// Replace your existing hero badge/tagline component with this
// ============================================================

import React, { useEffect, useRef, useState } from 'react';

interface HeroBadgeProps {
  text?: string;
}

/**
 * Fixed Hero Badge Component
 * 
 * Features:
 * - Auto-sizing container that never truncates text
 * - Responsive font sizing
 * - Optional typewriter animation that calculates width correctly
 */
export const HeroBadge: React.FC<HeroBadgeProps> = ({
  text = "The World's Most Advanced AI Language Assessment Platform"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [isVisible, setIsVisible] = useState(false);

  // Measure the text width and set container accordingly
  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      // Add padding for the star icon + badges
      setContainerWidth(Math.min(textWidth + 80, window.innerWidth * 0.9));
    }
    
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [text]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (textRef.current) {
        const textWidth = textRef.current.scrollWidth;
        setContainerWidth(Math.min(textWidth + 80, window.innerWidth * 0.9));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-badge-container"
      style={{
        // Dynamic width based on actual text content
        width: containerWidth,
        maxWidth: '90vw',
        
        // Glassmorphism styling matching your existing design
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '9999px',
        padding: '0.5rem 1.25rem',
        
        // Layout
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        
        // Animation
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        
        // Never clip content
        overflow: 'visible',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Star icon */}
      <span className="hero-badge-icon" style={{ flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="url(#star-gradient)"
          />
          <defs>
            <linearGradient id="star-gradient" x1="2" y1="2" x2="22" y2="22">
              <stop stopColor="#a78bfa" />
              <stop offset="1" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
      </span>

      {/* Text - THIS IS THE FIX: no truncation, no overflow:hidden */}
      <span
        ref={textRef}
        className="hero-badge-text"
        style={{
          // Never truncate
          whiteSpace: 'nowrap',
          overflow: 'visible',
          textOverflow: 'clip',
          
          // Font styling
          fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.8)',
          letterSpacing: '0.02em',
          
          // Prevent layout shifts
          display: 'inline-block',
          minWidth: 'max-content',
        }}
      >
        {text}
      </span>

      {/* Animated dots (optional visual flair) */}
      <span 
        className="hero-badge-pulse" 
        style={{ 
          flexShrink: 0,
          width: 6, 
          height: 6, 
          borderRadius: '50%', 
          background: '#4ade80',
          display: 'inline-block',
          animation: 'pulse 2s infinite'
        }} 
      />

      {/* Keyframe animation for the pulse dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        
        /* Responsive: stack vertically on very small screens */
        @media (max-width: 480px) {
          .hero-badge-container {
            white-space: normal !important;
            flex-wrap: wrap;
            justify-content: center;
            text-align: center;
            padding: 0.5rem 1rem !important;
          }
          .hero-badge-text {
            white-space: normal !important;
            font-size: 0.7rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroBadge;
