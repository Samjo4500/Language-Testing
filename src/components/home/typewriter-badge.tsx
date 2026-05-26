'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

const FULL_TEXT = "The World's Most Advanced AI Language Assessment Platform";
const TYPING_SPEED = 55; // ms per character
const PAUSE_AFTER_COMPLETE = 4000; // ms pause before restarting
const DELETE_SPEED = 25; // ms per character when deleting
const PAUSE_BEFORE_DELETE = 2000; // ms pause before deleting

export function TypewriterBadge() {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const animate = () => {
      if (isPaused) return;

      if (!isDeleting) {
        // Typing
        if (displayText.length < FULL_TEXT.length) {
          timeoutRef.current = setTimeout(() => {
            setDisplayText(FULL_TEXT.slice(0, displayText.length + 1));
          }, TYPING_SPEED + Math.random() * 30); // slight randomness for realism
        } else {
          // Finished typing
          setIsComplete(true);
          setIsPaused(true);
          timeoutRef.current = setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
            setIsComplete(false);
          }, PAUSE_AFTER_COMPLETE);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          timeoutRef.current = setTimeout(() => {
            setDisplayText(FULL_TEXT.slice(0, displayText.length - 1));
          }, DELETE_SPEED);
        } else {
          // Finished deleting
          setIsDeleting(false);
          setIsPaused(true);
          timeoutRef.current = setTimeout(() => {
            setIsPaused(false);
          }, 500);
        }
      }
    };

    animate();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayText, isDeleting, isPaused]);

  return (
    <div className="text-center mb-8">
      <div
        className={`inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 transition-all duration-700 max-w-[90vw] sm:max-w-none flex-wrap justify-center ${
          isComplete
            ? 'bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-fuchsia-500/10 border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.15),0_0_60px_rgba(139,92,246,0.1)]'
            : 'bg-white/[0.03] border border-white/[0.08] shadow-none'
        }`}
        style={{
          animation: isComplete ? 'badge-complete-glow 2s ease-in-out infinite' : undefined,
          overflow: 'visible',
        }}
      >
        {/* Animated sparkles icon */}
        <Sparkles
          className={`h-4 w-4 flex-shrink-0 transition-colors duration-500 ${
            isComplete
              ? 'text-amber-300'
              : isDeleting
              ? 'text-fuchsia-400'
              : 'text-blue-300'
          }`}
          style={{
            animation: 'badge-sparkle-spin 3s ease-in-out infinite',
          }}
        />

        {/* Typewriter text — no truncation, auto-width */}
        <span
          className={`text-sm font-medium transition-colors duration-700 whitespace-nowrap sm:whitespace-nowrap whitespace-normal ${
            isComplete
              ? 'bg-gradient-to-r from-blue-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent'
              : isDeleting
              ? 'text-fuchsia-300/70'
              : 'text-blue-200'
          }`}
          style={{
            overflow: 'visible',
            minWidth: 'max-content',
          }}
        >
          {displayText}
        </span>

        {/* Blinking cursor */}
        <span
          className={`inline-block w-[2px] h-4 flex-shrink-0 rounded-full transition-colors duration-500 ${
            isComplete
              ? 'bg-gradient-to-b from-blue-400 to-violet-400'
              : isDeleting
              ? 'bg-fuchsia-400/60'
              : 'bg-blue-400/60'
          }`}
          style={{ animation: 'badge-cursor-blink 0.8s steps(1) infinite' }}
        />
      </div>
    </div>
  );
}
