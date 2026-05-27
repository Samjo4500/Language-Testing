'use client';

import dynamic from 'next/dynamic';

// Dynamic imports with ssr:false — only allowed in Client Components
// These heavy animated components should not be server-rendered to improve FCP/LCP

export const AnimatedCEFRBadge = dynamic(
  () => import('@/components/home/animated-cefr-badge').then(mod => ({ default: mod.AnimatedCEFRBadge })),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex items-center justify-center w-64 h-64 md:w-[340px] md:h-[340px]">
        <div className="absolute inset-0 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #3b82f640 0%, transparent 70%)' }} />
        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.15) 100%)' }}>
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-black text-blue-500">A1</div>
            <div className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">CEFR Level</div>
          </div>
        </div>
      </div>
    ),
  }
);

export const AnimatedPillars = dynamic(
  () => import('@/components/home/animated-pillars').then(mod => ({ default: mod.AnimatedPillars })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 h-32 sm:h-40 md:h-52">
        {['Test', 'Learn', 'Connect'].map((word) => (
          <div key={word} className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-white/5" />
            <span className="mt-2 text-xl sm:text-2xl md:text-4xl font-bold text-white/20">{word}</span>
          </div>
        ))}
      </div>
    ),
  }
);

export const TypewriterBadge = dynamic(
  () => import('@/components/home/typewriter-badge').then(mod => ({ default: mod.TypewriterBadge })),
  {
    ssr: false,
    loading: () => (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 bg-white/[0.03] border border-white/[0.08]">
          <span className="text-sm font-medium text-blue-200">
            The World&apos;s Most Advanced AI Language Assessment Platform
          </span>
        </div>
      </div>
    ),
  }
);

export const BackgroundOrbsDynamic = dynamic(
  () => import('@/components/home/background-orbs').then(mod => ({ default: mod.BackgroundOrbs })),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 overflow-hidden pointer-events-none" />,
  }
);

export const LiveVoiceDemo = dynamic(
  () => import('@/components/home/live-voice-demo'),
  { ssr: false, loading: () => <div className="min-h-[600px]" /> }
);

export const InteractiveCEFRLevels = dynamic(
  () => import('@/components/home/interactive-cefr-levels'),
  { ssr: false, loading: () => <div className="min-h-[500px]" /> }
);
