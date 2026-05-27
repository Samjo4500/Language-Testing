'use client';

import { useState, useEffect } from 'react';
import { useHydrated } from '@/hooks/use-hydrated';
import { CEFR_LEVEL_COLORS, CEFR_LEVEL_DESCS } from '@/components/home/constants';

export function AnimatedCEFRBadge() {
  const [activeLevel, setActiveLevel] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const mounted = useHydrated();
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLevel((prev) => (prev + 1) % levels.length);
      setPulseKey((k) => k + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentLevel = levels[activeLevel];
  const activeColor = CEFR_LEVEL_COLORS[currentLevel];

  // Calculate node positions in a hexagonal layout (60° apart, starting from top)
  const getNodePos = (index: number, radius: number) => {
    const angle = (index * 60 - 90) * (Math.PI / 180);
    return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
  };

  // SVG arc path helper for ring segments
  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = ((startAngle - 90) * Math.PI) / 180;
    const end = ((endAngle - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  if (!mounted) {
    return (
      <div className="relative flex items-center justify-center w-64 h-64 md:w-[340px] md:h-[340px]">
        <div className="absolute inset-0 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #3b82f640 0%, transparent 70%)' }} />
        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.15) 100%)' }}>
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-black text-blue-500">A1</div>
            <div className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">CEFR Level</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-[340px] md:h-[340px]">
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full animate-pulse-slow" style={{ background: `radial-gradient(circle, ${activeColor}18 0%, transparent 70%)`, transition: 'background 0.7s' }} />

      {/* Pulse waves on level change */}
      <div key={`p1-${pulseKey}`} className="absolute inset-0 rounded-full animate-cefr-pulse-expand" style={{ border: `2px solid ${activeColor}35` }} />
      <div key={`p2-${pulseKey}`} className="absolute inset-0 rounded-full animate-cefr-pulse-expand" style={{ border: `1px solid ${activeColor}18`, animationDelay: '0.3s' }} />

      {/* Rotating ring tracks (decorative) */}
      <div className="absolute inset-[2%] rounded-full animate-cefr-ring-1" style={{ border: `1px dashed ${activeColor}12`, transition: 'border-color 0.7s' }} />
      <div className="absolute inset-[17%] rounded-full animate-cefr-ring-2" style={{ border: `1px dotted ${activeColor}15`, transition: 'border-color 0.7s' }} />
      <div className="absolute inset-[32%] rounded-full animate-cefr-ring-3" style={{ border: `1px dashed ${activeColor}10`, transition: 'border-color 0.7s' }} />

      {/* Scanner sweep (radar effect) */}
      <div className="absolute inset-[2%] rounded-full animate-cefr-scanner overflow-hidden">
        <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(from 0deg, transparent 0deg, transparent 340deg, ${activeColor}12 360deg)`, transition: 'background 0.7s' }} />
      </div>

      {/* SVG layer: arc segments + connection beams + tick marks */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
        {/* 60 tick marks around the outer edge (like a clock) */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const isMajor = i % 10 === 0;
          const innerR = isMajor ? 44 : 46;
          const outerR = 48;
          return (
            <line
              key={`tick-${i}`}
              x1={50 + innerR * Math.cos(angle)}
              y1={50 + innerR * Math.sin(angle)}
              x2={50 + outerR * Math.cos(angle)}
              y2={50 + outerR * Math.sin(angle)}
              stroke={activeColor}
              strokeOpacity={isMajor ? 0.3 : 0.08}
              strokeWidth={isMajor ? 0.8 : 0.3}
              style={{ transition: 'stroke 0.7s' }}
            />
          );
        })}

        {/* CEFR arc segments (colored arcs on outer ring) */}
        {levels.map((lvl, i) => {
          const color = CEFR_LEVEL_COLORS[lvl];
          const isActive = i === activeLevel;
          return (
            <path
              key={`arc-${lvl}`}
              d={describeArc(50, 50, 46, i * 60 + 2, (i + 1) * 60 - 2)}
              fill="none"
              stroke={color}
              strokeWidth={isActive ? 2.5 : 0.8}
              strokeOpacity={isActive ? 0.7 : 0.15}
              strokeLinecap="round"
              style={{ transition: 'stroke-width 0.5s, stroke-opacity 0.5s' }}
            />
          );
        })}

        {/* Connection beams from each node to center */}
        {levels.map((lvl, i) => {
          const pos = getNodePos(i, 38);
          const isActive = i === activeLevel;
          return (
            <g key={`beam-${lvl}`}>
              {/* Main beam line */}
              <line
                x1="50" y1="50"
                x2={pos.x} y2={pos.y}
                stroke={CEFR_LEVEL_COLORS[lvl]}
                strokeWidth={isActive ? 1 : 0.2}
                strokeOpacity={isActive ? 0.5 : 0.06}
                style={{ transition: 'stroke-width 0.5s, stroke-opacity 0.5s' }}
              />
              {/* Glow beam (active only) */}
              {isActive && (
                <line
                  x1="50" y1="50"
                  x2={pos.x} y2={pos.y}
                  stroke={CEFR_LEVEL_COLORS[lvl]}
                  strokeWidth={3}
                  strokeOpacity={0.08}
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Level nodes (positioned in hexagonal layout) */}
      {levels.map((lvl, i) => {
        const pos = getNodePos(i, 38);
        const color = CEFR_LEVEL_COLORS[lvl];
        const isActive = i === activeLevel;
        return (
          <div
            key={lvl}
            className="absolute cursor-pointer"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', zIndex: isActive ? 10 : 1 }}
            onClick={() => { setActiveLevel(i); setPulseKey((k) => k + 1); }}
          >
            {/* Active node pulse halo */}
            {isActive && (
              <>
                <div className="absolute inset-[-8px] md:inset-[-10px] rounded-full animate-cefr-node-pulse" style={{ border: `2px solid ${color}35` }} />
                <div className="absolute inset-[-4px] md:inset-[-6px] rounded-full animate-cefr-node-pulse" style={{ border: `1px solid ${color}50`, animationDelay: '0.5s' }} />
              </>
            )}
            {/* Node circle */}
            <div
              className={`flex items-center justify-center rounded-full font-bold transition-all duration-500 ${
                isActive ? 'w-11 h-11 md:w-[52px] md:h-[52px] text-sm md:text-base' : 'w-8 h-8 md:w-10 md:h-10 text-[10px] md:text-xs'
              }`}
              style={{
                background: isActive ? `${color}35` : `${color}12`,
                color,
                boxShadow: isActive
                  ? `0 0 25px ${color}50, 0 0 50px ${color}20, inset 0 0 15px ${color}15`
                  : `0 0 8px ${color}10`,
                border: isActive ? `2px solid ${color}60` : `1px solid ${color}20`,
              }}
            >
              {lvl}
            </div>
          </div>
        );
      })}

      {/* Center orb */}
      <div
        className="relative w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-700 z-20"
        style={{
          background: `linear-gradient(135deg, ${activeColor}18 0%, rgba(236,72,153,0.12) 100%)`,
          boxShadow: `0 0 80px ${activeColor}20, 0 0 40px ${activeColor}12, inset 0 0 40px ${activeColor}08`,
          border: `2px solid ${activeColor}22`,
        }}
      >
        {/* Inner spinning ring */}
        <div className="absolute inset-2 rounded-full animate-ping-slow" style={{ border: `1px solid ${activeColor}10` }} />
        {/* Inner hex grid pattern */}
        <div className="absolute inset-3 rounded-full opacity-20" style={{
          backgroundImage: `linear-gradient(${activeColor}08 1px, transparent 1px), linear-gradient(90deg, ${activeColor}08 1px, transparent 1px)`,
          backgroundSize: '8px 8px',
          transition: 'background-image 0.7s',
        }} />

        <div className="text-center relative z-10">
          <div className="text-4xl md:text-5xl font-black" style={{ color: activeColor, transition: 'color 0.5s' }}>
            {currentLevel}
          </div>
          <div className="text-[8px] md:text-[10px] text-white/50 uppercase tracking-wider mt-0.5 font-medium" style={{ transition: 'color 0.5s' }}>
            {CEFR_LEVEL_DESCS[currentLevel]}
          </div>
        </div>
      </div>

      {/* Floating particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`ptcl-${i}`}
          className="absolute rounded-full animate-float"
          style={{
            width: `${1.5 + (i % 3)}px`,
            height: `${1.5 + (i % 3)}px`,
            background: i % 2 === 0 ? activeColor : '#7c5cff',
            opacity: 0.2 + (i % 3) * 0.1,
            top: `${12 + ((i * 13) % 76)}%`,
            left: `${8 + ((i * 17) % 84)}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${5 + (i % 3) * 2}s`,
            transition: 'background 0.7s',
          }}
        />
      ))}
    </div>
  );
}
