'use client';

import { useState, useEffect } from 'react';
import { Trophy, GraduationCap, Globe } from 'lucide-react';
import { useHydrated } from '@/hooks/use-hydrated';

interface Pillar {
  word: string;
  icon: React.ElementType;
  gradient: string;
  gradientCSS: string;
  ringColor: string;
  textColor: string;
  description: string;
  orbitDotColor: string;
  glowRGBA: string;
}

const PILLARS: Pillar[] = [
  {
    word: 'Test',
    icon: Trophy,
    gradient: 'from-blue-500 via-blue-400 to-cyan-400',
    gradientCSS: '#3b82f6, #60a5fa, #22d3ee',
    ringColor: 'border-blue-400/30',
    textColor: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-200 to-cyan-200',
    description: 'CEFR Assessment',
    orbitDotColor: '#3b82f6',
    glowRGBA: 'rgba(59,130,246,',
  },
  {
    word: 'Learn',
    icon: GraduationCap,
    gradient: 'from-violet-500 via-violet-400 to-purple-400',
    gradientCSS: '#8b5cf6, #a78bfa, #c084fc',
    ringColor: 'border-violet-400/30',
    textColor: 'text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-200 to-violet-200',
    description: 'Structured Courses',
    orbitDotColor: '#8b5cf6',
    glowRGBA: 'rgba(139,92,246,',
  },
  {
    word: 'Connect',
    icon: Globe,
    gradient: 'from-emerald-500 via-green-400 to-teal-400',
    gradientCSS: '#10b981, #4ade80, #2dd4bf',
    ringColor: 'border-emerald-400/30',
    textColor: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-teal-200',
    description: 'Global Community',
    orbitDotColor: '#10b981',
    glowRGBA: 'rgba(16,185,129,',
  },
];

function OrbitalRing({ size, color, duration, delay, dotCount, dotSize }: {
  size: number; color: string; duration: number; delay: number; dotCount: number; dotSize: number;
}) {
  return (
    <div
      className="absolute rounded-full border transition-opacity duration-700"
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        borderColor: `${color}`,
        animation: `orbit-spin ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {Array.from({ length: dotCount }).map((_, i) => {
        const angle = (360 / dotCount) * i;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: dotSize,
              height: dotSize,
              background: color.replace('/0.2', '/0.8'),
              boxShadow: `0 0 ${dotSize * 2}px ${color}`,
              left: '50%',
              top: 0,
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(${-size / 2}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

export function AnimatedPillars() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activePulse, setActivePulse] = useState(0);
  const mounted = useHydrated();

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePulse((prev) => (prev + 1) % PILLARS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // SSR-friendly static fallback: show the three pillars without orbital animations
  if (!mounted) return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10">
      {PILLARS.map((pillar) => {
        const Icon = pillar.icon;
        return (
          <div key={pillar.word} className="flex flex-col items-center">
            <div
              className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br ${pillar.gradient}`}
              style={{ width: 44, height: 44 }}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className={`mt-2 text-xl sm:text-2xl md:text-4xl font-bold tracking-tight ${pillar.textColor}`}>
              {pillar.word}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative flex flex-col items-center w-full select-none">
      {/* Three orbital pillars */}
      <div className="flex items-start justify-center gap-4 sm:gap-6 md:gap-10">
        {PILLARS.map((pillar, i) => {
          const Icon = pillar.icon;
          const isHovered = hoveredIndex === i;
          const isPulsing = activePulse === i;
          const isActive = isHovered || isPulsing;

          return (
            <div
              key={pillar.word}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                animation: `pillar-stagger-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.2}s both`,
              }}
            >
              {/* Orbital icon container */}
              <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
                {/* Ambient glow */}
                <div
                  className="absolute inset-0 rounded-full transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle, ${pillar.glowRGBA}${isActive ? '0.25)' : '0.08)'})`,
                    transform: isActive ? 'scale(1.3)' : 'scale(1)',
                  }}
                />

                {/* Outer orbital ring */}
                <OrbitalRing
                  size={90}
                  color={`${pillar.orbitDotColor}33`}
                  duration={8 + i * 2}
                  delay={i * 0.5}
                  dotCount={2}
                  dotSize={4}
                />

                {/* Inner orbital ring */}
                <OrbitalRing
                  size={68}
                  color={`${pillar.orbitDotColor}22`}
                  duration={5 + i}
                  delay={i * 0.3}
                  dotCount={1}
                  dotSize={3}
                />

                {/* Holographic ring */}
                <div
                  className={`absolute rounded-full border-2 ${pillar.ringColor} transition-all duration-500`}
                  style={{
                    width: 56,
                    height: 56,
                    boxShadow: isActive
                      ? `0 0 20px ${pillar.glowRGBA}0.3), inset 0 0 20px ${pillar.glowRGBA}0.1)`
                      : `0 0 8px ${pillar.glowRGBA}0.1)`,
                    animation: isActive ? `orbit-ring-pulse 2s ease-in-out infinite` : undefined,
                  }}
                />

                {/* Central icon */}
                <div
                  className={`relative z-10 inline-flex items-center justify-center rounded-full bg-gradient-to-br ${pillar.gradient} transition-all duration-500`}
                  style={{
                    width: 44,
                    height: 44,
                    boxShadow: isActive
                      ? `0 0 30px ${pillar.glowRGBA}0.5), 0 0 60px ${pillar.glowRGBA}0.2), 0 4px 20px rgba(0,0,0,0.3)`
                      : `0 0 12px ${pillar.glowRGBA}0.2), 0 4px 12px rgba(0,0,0,0.2)`,
                    transform: isActive ? 'scale(1.12)' : 'scale(1)',
                  }}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>

              {/* Word */}
              <div className="mt-2 sm:mt-3 flex flex-col items-center gap-0.5">
                <span
                  className={`text-xl sm:text-2xl md:text-4xl font-bold tracking-tight ${pillar.textColor} transition-all duration-500`}
                  style={{
                    filter: isActive ? 'brightness(1.2)' : 'brightness(1)',
                  }}
                >
                  {pillar.word}
                </span>

                {/* Description */}
                <span
                  className={`text-[9px] sm:text-[10px] md:text-xs text-white/30 font-medium uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                  }`}
                >
                  {pillar.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Light connection lines between pillars */}
      <div
        className="relative mt-4 flex items-center justify-center w-full max-w-md mx-auto"
        style={{ animation: 'pillar-stagger-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s both' }}
      >
        <svg className="w-full h-6" viewBox="0 0 400 24" fill="none" preserveAspectRatio="xMidYMid meet">
          {/* Connection line 1: Test → Learn */}
          <line x1="67" y1="12" x2="200" y2="12" stroke="url(#line1)" strokeWidth="1" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
          </line>
          {/* Connection line 2: Learn → Connect */}
          <line x1="200" y1="12" x2="333" y2="12" stroke="url(#line2)" strokeWidth="1" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" begin="1.5s" repeatCount="indefinite" />
          </line>
          {/* Traveling dot 1 */}
          <circle r="3" fill="#3b82f6" opacity="0.8">
            <animateMotion dur="3s" repeatCount="indefinite" path="M67,12 L333,12" />
            <animate attributeName="opacity" values="0;0.8;0.8;0" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* Traveling dot 2 (reverse) */}
          <circle r="2" fill="#10b981" opacity="0.6">
            <animateMotion dur="4s" begin="1s" repeatCount="indefinite" path="M333,12 L67,12" />
            <animate attributeName="opacity" values="0;0.6;0.6;0" dur="4s" begin="1s" repeatCount="indefinite" />
          </circle>
          {/* Center node */}
          <circle cx="200" cy="12" r="3" fill="#8b5cf6" opacity="0.5">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <defs>
            <linearGradient id="line1" x1="67" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="line2" x1="200" y1="0" x2="333" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Indicator dots */}
      <div
        className="mt-2 flex items-center gap-2"
        style={{ animation: 'pillar-stagger-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both' }}
      >
        {PILLARS.map((pillar, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <div className="w-4 h-px bg-white/10" />}
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ${
                activePulse === i
                  ? `w-6 bg-gradient-to-r ${pillar.gradient}`
                  : 'w-1.5 bg-white/15'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
