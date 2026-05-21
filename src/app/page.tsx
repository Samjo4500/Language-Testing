'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Sparkles, Award, Clock, BarChart3, Shield, Globe,
  CheckCircle2, QrCode, Headphones, Mic, PenTool,
  ArrowRight, Zap, Star, BookOpen, Users, TrendingUp,
  FileCheck, AudioWaveform, Activity, Brain,
  MessageSquareText, Cpu, ClipboardCheck,
  Play, Volume2, ChevronDown, ChevronRight,
  Building2, CreditCard, Mail, Phone, MapPin,
  Twitter, Linkedin, Github, HelpCircle,
  Circle, CircleDot, Settings
} from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useHydrated } from '@/hooks/use-hydrated';

/* ======================================================
   SCROLL ANIMATION HOOK
   ====================================================== */
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    // Immediately mark as visible if already in viewport on mount
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('visible');
      observer.unobserve(el);
    }
    return () => observer.disconnect();
  }, []);
  return ref;
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} className={`scroll-animate ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ======================================================
   FLOATING BACKGROUND ORBS
   ====================================================== */
function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb orb-purple w-[700px] h-[700px] -top-48 -left-48 animate-float-slow" />
      <div className="orb orb-pink w-[500px] h-[500px] top-1/4 -right-24 animate-float-reverse" />
      <div className="orb orb-blue w-[350px] h-[350px] bottom-10 left-1/4 animate-float" />
      <div className="orb orb-cyan w-[200px] h-[200px] top-2/3 right-1/3 animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[15%] left-[55%] w-1 h-1 rounded-full bg-purple-300/60 animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-[30%] right-[25%] w-1.5 h-1.5 rounded-full bg-pink-300/40 animate-float-reverse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[35%] left-[20%] w-1 h-1 rounded-full bg-blue-300/50 animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[50%] left-[40%] w-0.5 h-0.5 rounded-full bg-white/40 animate-float-slow" style={{ animationDelay: '2s' }} />
    </div>
  );
}

/* ======================================================
   ANIMATED CEFR BADGE — borderless, floating, rotating levels
   ====================================================== */
const CEFR_LEVEL_COLORS: Record<string, string> = {
  A1: '#3b82f6', A2: '#22c55e', B1: '#eab308', B2: '#f97316', C1: '#ef4444', C2: '#a855f7',
};

function AnimatedCEFRBadge() {
  const [activeLevel, setActiveLevel] = useState(0);
  const mounted = useHydrated();
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLevel((prev) => (prev + 1) % levels.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentLevel = levels[activeLevel];
  const currentColor = CEFR_LEVEL_COLORS[currentLevel];

  if (!mounted) {
    return (
      <div className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64">
        <div className="absolute inset-0 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${CEFR_LEVEL_COLORS.A1}40 0%, transparent 70%)` }} />
        <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.15) 100%)', boxShadow: '0 0 80px rgba(139,92,246,0.2), inset 0 0 40px rgba(139,92,246,0.1)' }}>
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-black" style={{ color: CEFR_LEVEL_COLORS.A1 }}>A1</div>
            <div className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">CEFR Level</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64">
      <div className="absolute inset-0 rounded-full animate-pulse-slow" style={{ background: `radial-gradient(circle, ${currentColor}25 0%, transparent 70%)` }} />
      <div className="absolute inset-2 rounded-full animate-spin-slow" style={{ border: `1px solid ${currentColor}20` }}>
        {levels.map((lvl, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180);
          const radius = 46;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          return (
            <div
              key={lvl}
              className="absolute w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-500"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                background: i === activeLevel ? `${CEFR_LEVEL_COLORS[lvl]}30` : 'rgba(255,255,255,0.05)',
                color: i === activeLevel ? CEFR_LEVEL_COLORS[lvl] : 'rgba(255,255,255,0.3)',
                boxShadow: i === activeLevel ? `0 0 16px ${CEFR_LEVEL_COLORS[lvl]}40` : 'none',
              }}
            >
              {lvl}
            </div>
          );
        })}
      </div>
      <div className="absolute inset-6 rounded-full animate-spin-reverse" style={{ border: `1px dashed ${currentColor}10` }} />
      <div
        className="relative w-40 h-40 md:w-52 md:h-52 rounded-full flex items-center justify-center transition-all duration-700"
        style={{
          background: `linear-gradient(135deg, ${currentColor}15 0%, rgba(236,72,153,0.1) 100%)`,
          boxShadow: `0 0 80px ${currentColor}20, inset 0 0 40px ${currentColor}10`,
        }}
      >
        <div className="absolute inset-1 rounded-full animate-ping-slow" style={{ border: `1px solid ${currentColor}15` }} />
        <div className="text-center transition-all duration-500">
          <div className="text-5xl md:text-6xl font-black transition-all duration-500" style={{ color: currentColor }}>
            {currentLevel}
          </div>
          <div className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">CEFR Level</div>
        </div>
      </div>
      {[0, 1, 2, 3, 4].map((p) => (
        <div
          key={p}
          className="absolute w-1 h-1 rounded-full animate-float"
          style={{
            background: currentColor,
            opacity: 0.4,
            top: `${20 + p * 15}%`,
            left: `${10 + p * 18}%`,
            animationDelay: `${p * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ======================================================
   WAVEFORM PRE-COMPUTED VALUES (hydration-safe)
   ====================================================== */
const WAVEFORM_HEIGHTS = Array.from({ length: 30 }, (_, i) =>
  `${(6 + Math.sin(i * 0.4) * 5 + 5).toFixed(2)}px`
);
const WAVEFORM_DELAYS = Array.from({ length: 30 }, (_, i) =>
  `${(i * 0.06).toFixed(2)}s`
);

/* ======================================================
   LIVE VOICE DEMO SECTION
   ====================================================== */
function LiveVoiceDemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [inputLevel, setInputLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const mounted = useHydrated();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const dimensions = [
    { letter: 'G', label: 'Grammar', color: 'from-purple-500 to-violet-500', score: isRecording ? 82 : 0 },
    { letter: 'V', label: 'Vocabulary', color: 'from-pink-500 to-rose-500', score: isRecording ? 78 : 0 },
    { letter: 'F', label: 'Fluency', color: 'from-blue-500 to-cyan-500', score: isRecording ? 87 : 0 },
    { letter: 'P', label: 'Pronunciation', color: 'from-green-500 to-emerald-500', score: isRecording ? 91 : 0 },
    { letter: 'C', label: 'Coherence', color: 'from-orange-500 to-amber-500', score: isRecording ? 75 : 0 },
    { letter: 'I', label: 'Interaction', color: 'from-red-500 to-pink-500', score: isRecording ? 80 : 0 },
  ];

  return (
    <section className="relative py-20 md:py-28 speaking-section overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-pink-600/10 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-violet-500/8 rounded-full blur-[80px] animate-float-reverse" />
        <div className="orb orb-purple w-[500px] h-[500px] top-1/4 -left-24 animate-float-slow opacity-30" />
        <div className="orb orb-pink w-[400px] h-[400px] bottom-1/4 -right-16 animate-float-reverse opacity-25" />
        <div className="orb orb-purple w-[250px] h-[250px] top-2/3 left-1/3 animate-float-slow opacity-15" />
      </div>

      <div className="container relative mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
              <Mic className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Live Voice Demo</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Interactive Speaking <span className="gradient-text-static">Assessment</span>
            </h2>
            <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
              Experience our AI-powered speaking assessment with real-time feedback and analysis
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-purple-500/40 via-pink-500/20 to-blue-500/40 animate-border-glow" />
              <div className="relative glass-card-neon p-6 md:p-10 light-streak">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: Mic & Controls */}
                  <div className="flex flex-col items-center">
                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mb-6">
                      {isRecording ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
                          <span className="text-sm text-red-300 font-medium">RECORDING</span>
                          <span className="text-sm text-white/50 ml-2">{formatTime(recordingTime)}</span>
                        </>
                      ) : (
                        <>
                          <CircleDot className="h-3 w-3 text-green-400" />
                          <span className="text-sm text-green-300 font-medium">READY</span>
                          <span className="text-sm text-white/50 ml-2">00:00</span>
                        </>
                      )}
                    </div>

                    {/* Waveform */}
                    <div className="flex items-center justify-center gap-[3px] h-16 mb-6">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div
                          key={i}
                          className={`waveform-bar ${isRecording ? (i % 2 === 0 ? 'active' : 'waveform-bar-alt active') : ''}`}
                          style={{
                            height: isRecording ? undefined : WAVEFORM_HEIGHTS[i],
                            animationDelay: WAVEFORM_DELAYS[i],
                            opacity: isRecording ? 1 : 0.25,
                          }}
                        />
                      ))}
                    </div>

                    {/* Mic button */}
                    <div className="relative mb-6">
                      {isRecording && (
                        <>
                          <div className="absolute inset-[-8px] rounded-full border-2 border-red-400/30 animate-ripple" />
                          <div className="absolute inset-[-8px] rounded-full border-2 border-red-400/20 animate-ripple" style={{ animationDelay: '0.5s' }} />
                        </>
                      )}
                      <div className={`absolute -inset-6 rounded-full transition-all duration-500 ${isRecording ? 'bg-red-500/15 blur-2xl' : 'bg-purple-500/15 blur-2xl'}`} />
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                          isRecording
                            ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/40 animate-recording-pulse'
                            : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-110 animate-mic-glow'
                        }`}
                      >
                        <Mic className={`h-8 w-8 text-white ${isRecording ? 'animate-pulse' : ''}`} />
                      </button>
                    </div>

                    {/* Speaking prompt */}
                    <div className="w-full mb-4">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Speaking Prompt</p>
                      <div className="glass-card p-4">
                        <p className="text-sm text-white/70 italic leading-relaxed">
                          &ldquo;Describe a memorable experience from your life and why it shaped who you are.&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Input Level */}
                    <div className="w-full">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Input Level</p>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setInputLevel(level)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                              inputLevel === level
                                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                : 'glass text-white/50 hover:text-white/80'
                            }`}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-white/30 mt-4 text-center">
                      Click to start — mic permission required
                    </p>
                  </div>

                  {/* Right: 6 Dimensions */}
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-4">6 Dimensions</p>
                    <div className="space-y-4">
                      {dimensions.map((dim) => (
                        <div key={dim.label} className="glass-card p-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${dim.color} text-white font-bold text-sm shadow-lg`}>
                              {dim.letter}
                            </div>
                            <span className="text-sm font-medium text-white">{dim.label}</span>
                            {isRecording && (
                              <span className={`ml-auto text-sm font-bold bg-gradient-to-r ${dim.color} bg-clip-text text-transparent`}>
                                {dim.score}%
                              </span>
                            )}
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${dim.color} transition-all duration-1000`}
                              style={{ width: isRecording ? `${dim.score}%` : '0%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-white/30">
                    This is an interactive demo. Full speaking assessment with AI scoring available on Premium plans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ======================================================
   6 DIMENSIONS OF ENGLISH PROFICIENCY SECTION
   ====================================================== */
const DIMENSIONS_DATA = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Reading',
    level: 'A1–C2',
    gradient: 'from-blue-500 to-cyan-500',
    items: ['Main ideas and detailed comprehension', 'Understanding implicit meaning', 'Analyzing text structure', 'Vocabulary inference', 'Reading speed and accuracy'],
  },
  {
    icon: <PenTool className="h-6 w-6" />,
    title: 'Writing',
    level: 'A1–C2',
    gradient: 'from-violet-500 to-purple-500',
    items: ['Cohesion and coherence', 'Grammatical accuracy', 'Lexical resource', 'Task achievement', 'Writing mechanics'],
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: 'Listening',
    level: 'A1–C2',
    gradient: 'from-green-500 to-emerald-500',
    items: ['Main ideas and details', 'Understanding speakers\' attitude', 'Following complex arguments', 'Multiple speaker comprehension', 'Accent familiarity'],
  },
  {
    icon: <Mic className="h-6 w-6" />,
    title: 'Speaking',
    level: 'A1–C2',
    gradient: 'from-orange-500 to-amber-500',
    items: ['Fluency and coherence', 'Lexical resource', 'Grammatical range', 'Pronunciation clarity', 'Interactive communication'],
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Grammar',
    level: 'A1–C2',
    gradient: 'from-purple-500 to-indigo-500',
    items: ['Sentence formation', 'Tense accuracy', 'Complex structures', 'Error patterns', 'Grammar application'],
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Vocabulary',
    level: 'A1–C2',
    gradient: 'from-pink-500 to-rose-500',
    items: ['Word range', 'Precision', 'Collocations', 'Register awareness', 'Topic-specific vocabulary'],
  },
];

/* ======================================================
   INTERACTIVE CEFR LEVELS SECTION
   ====================================================== */
const CEFR_LEVELS = [
  { level: 'A1', title: 'Beginner', percentage: 17, desc: 'Can understand and use familiar everyday expressions and very basic phrases. Can introduce themselves and others.', items: ['Basic greetings', 'Numbers & dates', 'Simple questions', 'Common words'], color: '#3b82f6' },
  { level: 'A2', title: 'Elementary', percentage: 33, desc: 'Can communicate in simple and routine tasks requiring a direct exchange of information on familiar and routine matters.', items: ['Shopping & directions', 'Simple conversations', 'Basic descriptions', 'Routine situations'], color: '#22c55e' },
  { level: 'B1', title: 'Intermediate', percentage: 50, desc: 'Can deal with most situations likely to arise while travelling in an area where the language is spoken. Can produce simple connected text on familiar topics.', items: ['Travel situations', 'Opinions & preferences', 'Past events', 'Future plans'], color: '#eab308' },
  { level: 'B2', title: 'Upper Intermediate', percentage: 67, desc: 'Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible without strain for either party.', items: ['Complex discussions', 'Abstract topics', 'News & media', 'Professional contexts'], color: '#f97316' },
  { level: 'C1', title: 'Advanced', percentage: 83, desc: 'Can express ideas fluently and spontaneously without much obvious searching for expressions. Can use language flexibly and effectively for social, academic, and professional purposes.', items: ['Academic writing', 'Implicit meaning', 'Cultural nuance', 'Extended discourse'], color: '#ef4444' },
  { level: 'C2', title: 'Proficient', percentage: 100, desc: 'Can understand virtually everything heard or read with ease. Can express themselves spontaneously, very fluently, and precisely, differentiating finer shades of meaning.', items: ['Near-native fluency', 'Complex argumentation', 'Literary analysis', 'Complete mastery'], color: '#a855f7' },
];

function InteractiveCEFRLevels() {
  const [activeTab, setActiveTab] = useState(0);
  const mounted = useHydrated();

  const active = CEFR_LEVELS[activeTab];

  return (
    <section className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
      <div className="container relative mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
              <Globe className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">CEFR Framework</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Interactive <span className="gradient-text-static">CEFR Levels</span>
            </h2>
            <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
              Click on each level to see detailed progression from beginner to mastery.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-purple-500/30 via-pink-500/10 to-blue-500/30" />
              <div className="relative glass-card-neon p-6 md:p-10">
                {/* Level Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  {CEFR_LEVELS.map((lvl, i) => (
                    <button
                      key={lvl.level}
                      onClick={() => setActiveTab(i)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${
                        activeTab === i
                          ? 'text-white shadow-lg scale-105'
                          : 'glass text-white/50 hover:text-white/80'
                      }`}
                      style={activeTab === i ? { background: `linear-gradient(135deg, ${lvl.color}40, ${lvl.color}20)`, boxShadow: `0 4px 20px ${lvl.color}30` } : {}}
                    >
                      {lvl.level}
                    </button>
                  ))}
                </div>

                {/* Active Level Content */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl text-white font-bold text-xl shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${active.color}60, ${active.color}30)` }}
                      >
                        {active.level}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-xl font-bold text-white">{active.level} — {active.title}</h3>
                        <p className="text-xs text-white/40">{active.percentage}% Complete</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-3 rounded-full bg-white/5 overflow-hidden mb-6">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: mounted ? `${active.percentage}%` : '0%',
                          background: `linear-gradient(90deg, ${active.color}80, ${active.color})`,
                        }}
                      />
                    </div>

                    <p className="text-sm text-white/60 leading-relaxed">{active.desc}</p>
                  </div>

                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Key Capabilities</p>
                    <div className="space-y-2">
                      {active.items.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: active.color }} />
                          <span className="text-sm text-white/70">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ======================================================
   HOW IT WORKS SECTION
   ====================================================== */
const STEPS = [
  { number: '1', title: 'Create Account', desc: 'Sign up in seconds with just your email. No lengthy registration required.', icon: <Users className="h-6 w-6" /> },
  { number: '2', title: 'Take Assessment', desc: 'Complete the 6-skill test at your own pace. Each section takes about 10 minutes.', icon: <ClipboardCheck className="h-6 w-6" /> },
  { number: '3', title: 'Get AI Results', desc: 'Receive instant CEFR scores with detailed AI feedback on all 6 core skills.', icon: <Brain className="h-6 w-6" /> },
  { number: '4', title: 'Download Certificate', desc: 'Get your official CEFR certificate and detailed improvement report instantly.', icon: <FileCheck className="h-6 w-6" /> },
];

/* ======================================================
   PRICING SECTION — Individual Plans
   ====================================================== */
const INDIVIDUAL_PLANS = [
  {
    name: 'Free',
    desc: 'Perfect for getting started',
    price: '$0',
    priceNum: 0,
    features: ['1 comprehensive assessment', 'Basic CEFR level result', 'Skill breakdown scores', 'Watermarked certificate'],
    cta: 'Start Free',
    ctaLink: '/register',
    popular: false,
  },
  {
    name: 'Single Test',
    desc: 'Full assessment with detailed report',
    price: '$12.99',
    priceNum: 12.99,
    features: ['Complete 6-skill assessment', 'Detailed CEFR score', 'AI-powered feedback', 'Downloadable PDF certificate'],
    cta: 'Buy Test',
    ctaLink: '/pricing',
    popular: false,
  },
  {
    name: 'Premium Pack',
    desc: '3 tests — best value for learners',
    price: '$29.99',
    priceNum: 29.99,
    features: ['3 full assessments', 'Progress tracking dashboard', 'Priority AI analysis', 'Unlimited certificate downloads', 'Email support'],
    cta: 'Get Premium',
    ctaLink: '/pricing',
    popular: true,
  },
  {
    name: 'Pro Pack',
    desc: '6 tests — complete learning solution',
    price: '$49.99',
    priceNum: 49.99,
    features: ['6 assessments', 'Full analytics suite', 'Detailed skill improvement tips', 'Comparison with peers', 'Priority support'],
    cta: 'Go Pro',
    ctaLink: '/pricing',
    popular: false,
  },
];

/* ======================================================
   ORGANIZATION PLANS
   ====================================================== */
const ORG_PLANS = [
  {
    tier: 'Team',
    desc: 'Up to 5 users',
    subdesc: 'Perfect for small schools & tutors',
    price: '$49',
    period: '/month',
    features: ['Up to 5 team members', 'Group dashboard & analytics', 'Export results as CSV', 'Shared question bank access', 'Email support'],
    bestFor: 'Small schools, tutors, study groups',
    cta: 'Start Team Trial',
    ctaLink: '/contact',
  },
  {
    tier: 'Business',
    desc: 'Up to 25 users',
    subdesc: 'For language schools & test centers',
    price: '$199',
    period: '/month',
    features: ['Up to 25 team members', 'White-label certificates', 'API access for results', 'Bulk user import via CSV', 'Priority support'],
    bestFor: 'Language schools, test prep centers',
    cta: 'Start Business Trial',
    ctaLink: '/contact',
    popular: true,
  },
  {
    tier: 'Enterprise',
    desc: 'Unlimited users',
    subdesc: 'For universities, corporations & government',
    price: 'Custom',
    period: '',
    features: ['Unlimited users & assessments', 'SSO (Google, Microsoft, Okta)', 'Dedicated account manager', 'SLA guarantee', 'On-premise or dedicated cloud'],
    bestFor: 'Universities, corporations, government',
    cta: 'Contact Sales',
    ctaLink: '/contact',
  },
];

/* ======================================================
   TESTIMONIALS
   ====================================================== */
const TESTIMONIALS = [
  {
    quote: 'CEFR Test helped me prepare for my university applications. The detailed feedback showed me exactly where to improve, and I jumped from A1 to B2 in just 3 months!',
    name: 'Sarah Chen',
    role: 'University Student',
    location: 'Hanoi',
    progress: 'A1 → B2',
    initials: 'S',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    quote: 'As a business professional, I needed to improve my English for presentations. The AI analysis identified my speaking patterns and gave me actionable tips that actually worked.',
    name: 'Marcus Rodriguez',
    role: 'Business Professional',
    location: 'Mexico City',
    progress: 'B1 → C1',
    initials: 'M',
    color: 'from-orange-500 to-amber-500',
  },
  {
    quote: 'I use CEFR Test with my students to track their progress. The CEFR alignment is accurate, and the comprehensive reports help me tailor my lessons effectively.',
    name: 'Yuki Tanaka',
    role: 'English Teacher',
    location: 'Tokyo',
    progress: 'B2 → C2',
    initials: 'Y',
    color: 'from-pink-500 to-rose-500',
  },
  {
    quote: 'We assessed over 800 students in a single semester. The bulk import and CSV export saved our department dozens of hours.',
    name: 'Dr. Laura Pham',
    role: 'Head of Language Dept, Hanoi University',
    location: 'Hanoi',
    progress: 'B2 → C1',
    initials: 'L',
    color: 'from-green-500 to-emerald-500',
  },
];

/* ======================================================
   ENTERPRISE SECTION
   ====================================================== */
const ENTERPRISE_STATS = [
  { label: 'Most Common Level', value: 'B2+', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Avg. Test Time', value: '30m', icon: <Clock className="h-5 w-5" /> },
  { label: 'Skills Assessed', value: '6', icon: <Brain className="h-5 w-5" /> },
  { label: 'Certificate Format', value: 'PDF', icon: <FileCheck className="h-5 w-5" /> },
  { label: 'Verification Code', value: 'QR', icon: <QrCode className="h-5 w-5" /> },
  { label: 'Scoring Engine', value: 'AI', icon: <Cpu className="h-5 w-5" /> },
];

const ENTERPRISE_TESTIMONIALS = [
  {
    quote: 'We assessed over 800 students in a single semester. The bulk import and CSV export saved our department dozens of hours.',
    name: 'Dr. Laura Pham',
    role: 'Head of Language Dept, Hanoi University',
    initials: 'DL',
    color: 'from-green-500 to-emerald-500',
  },
  {
    quote: 'White-label certificates with our academy logo made a huge difference. Our students trust the result because it feels professional.',
    name: 'Ahmed Malik',
    role: 'CEO, ProEnglish Academy',
    initials: 'AM',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    quote: 'The API integration let us automatically sync scores into our HR system. The Enterprise tier paid for itself in the first month.',
    name: 'Sofia Tanner',
    role: 'L&D Manager, Nexura Corp',
    initials: 'ST',
    color: 'from-purple-500 to-violet-500',
  },
];

/* ======================================================
   FAQ SECTION
   ====================================================== */
const FAQ_DATA = [
  {
    question: 'How does the AI scoring work?',
    answer: 'Our AI scoring engine uses advanced natural language processing and machine learning models trained on thousands of CEFR-graded responses. For speaking assessments, it analyzes pronunciation, fluency, vocabulary range, and grammatical accuracy in real-time. For writing, it evaluates coherence, lexical resource, and task achievement. The system provides consistent, objective scoring aligned with CEFR descriptors.',
  },
  {
    question: 'Is the certificate officially recognized?',
    answer: 'Our certificates are aligned with the Common European Framework of Reference (CEFR), which is the international standard for language proficiency. While not issued by a government body, our certificates include QR verification codes that allow employers and institutions to validate results online. Many universities, employers, and immigration authorities accept CEFR-aligned assessments as evidence of language proficiency.',
  },
  {
    question: 'How long does the assessment take?',
    answer: 'The full assessment typically takes 30–45 minutes to complete. Each of the 6 skill sections takes approximately 5–10 minutes. You can pause and resume the test at any time — your progress is saved automatically. The speaking and listening sections require a microphone and speakers or headphones.',
  },
  {
    question: 'Can I retake the test?',
    answer: 'Yes! Free users get 1 assessment, Single Test purchasers get 1, Premium Pack users get 3, and Pro Pack users get 6 assessments. You can retake the test at any time if you have remaining credits. Additional credits can be purchased from your dashboard at any time.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept payments through PayPal, which supports credit cards, debit cards, and bank transfers from around the world. All transactions are encrypted and secure. PayPal\'s buyer protection covers every purchase, giving you peace of mind.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use industry-standard encryption (TLS 1.3) for all data in transit and AES-256 encryption for data at rest. Your audio recordings are processed in real-time and deleted after scoring — we never store your voice data. Personal information is handled in compliance with GDPR and other privacy regulations. You can request data deletion at any time.',
  },
];

/* ======================================================
   FAQ ITEM COMPONENT
   ====================================================== */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
      >
        <span className="text-base font-medium text-white group-hover:text-purple-300 transition-colors pr-4">{question}</span>
        <ChevronDown className={`h-5 w-5 text-purple-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 animate-slide-down">
          <p className="text-sm text-white/60 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

/* ======================================================
   MAIN PAGE
   ====================================================== */
export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const mounted = useHydrated();

  const isAuth = mounted && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden dark-section hero-pattern noise-overlay mesh-gradient">
        <BackgroundOrbs />

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            {/* Top badge */}
            <div className="text-center mb-8">
              <div className="animate-float inline-flex items-center gap-2 rounded-full glass-light px-5 py-2.5 animate-border-glow">
                <Sparkles className="h-4 w-4 text-purple-300" />
                <span className="text-sm text-purple-200 font-medium">AI-Powered Assessment Platform</span>
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up text-center">
              Assess Your English
              <br />
              <span className="gradient-text">With AI Precision</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300 text-center">
              Get your CEFR-scored English proficiency results in minutes. Our AI evaluates 6 core skills — reading, writing, listening, speaking, grammar, and vocabulary — with detailed feedback and actionable insights.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-scale-in delay-500">
              <Link href={isAuth ? '/dashboard' : '/register'}>
                <button className="group flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer w-full sm:w-auto">
                  Start Free Assessment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/pricing">
                <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer w-full sm:w-auto">
                  View Pricing
                </button>
              </Link>
            </div>

            {/* Animated CEFR Badge */}
            <div className="mt-10 flex justify-center animate-scale-in delay-400">
              <AnimatedCEFRBadge />
            </div>

            {/* Stats bar — 4 glass cards */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: 'A1–C2', label: 'All CEFR Levels', icon: <Globe className="h-5 w-5" /> },
                { value: '6', label: 'Core Skills', icon: <Brain className="h-5 w-5" /> },
                { value: 'AI', label: 'Powered Scoring', icon: <Cpu className="h-5 w-5" /> },
                { value: 'Free', label: 'To Get Started', icon: <Zap className="h-5 w-5" /> },
              ].map((stat, i) => (
                <AnimatedSection key={stat.label} delay={i * 100}>
                  <div className="glass-card p-3 sm:p-5 text-center group">
                    <div className="flex justify-center mb-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                      {stat.icon}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-white/50">{stat.label}</div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== LIVE VOICE DEMO ===== */}
      <LiveVoiceDemo />

      {/* ===== 6 DIMENSIONS OF ENGLISH PROFICIENCY ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[400px] h-[400px] top-1/4 right-0 animate-float-slow" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Comprehensive Coverage</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                6 Dimensions of <span className="gradient-text-static">English Proficiency</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Our AI evaluates every aspect of your English proficiency with granular precision.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {DIMENSIONS_DATA.map((skill, index) => (
              <AnimatedSection key={skill.title} delay={index * 100}>
                <div className="glass-card p-6 h-full group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${skill.gradient} text-white shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-110`}>
                      {skill.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{skill.title}</h3>
                      <span className="text-xs text-white/40">{skill.level}</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {skill.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                        <span className="text-sm text-white/60">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE CEFR LEVELS ===== */}
      <InteractiveCEFRLevels />

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-pink w-[400px] h-[400px] bottom-0 left-0 animate-float-slow" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <ClipboardCheck className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Simple Process</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                How It <span className="gradient-text-static">Works</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Get your CEFR score in just 4 simple steps.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {STEPS.map((step, index) => (
              <AnimatedSection key={step.number} delay={index * 150}>
                <div className="glass-card p-6 text-center h-full group">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 text-purple-400 group-hover:border-purple-500/40 transition-all duration-300">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs font-bold shadow-lg">
                        {step.number}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING — Individual ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay" id="pricing">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <CreditCard className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Pricing</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Flexible <span className="gradient-text-static">Pricing</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Start free and upgrade as you grow. All plans include our AI-powered scoring engine.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {INDIVIDUAL_PLANS.map((plan, index) => (
              <AnimatedSection key={plan.name} delay={index * 100}>
                <div className={`relative glass-card p-6 h-full flex flex-col ${plan.popular ? 'ring-2 ring-purple-500/50' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <p className="text-xs text-white/40 mt-1">{plan.desc}</p>
                  <div className="mt-4 mb-6">
                    <span className="text-2xl sm:text-3xl font-bold text-white">{plan.price}</span>
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.ctaLink} className="mt-6 block">
                    <button className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25 hover:-translate-y-0.5'
                        : plan.price === '$0'
                          ? 'glass-button text-white'
                          : 'glass-button text-white hover:bg-purple-500/20'
                    }`}>
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing" className="group inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors">
              View all plans including Team & Enterprise
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOR ORGANIZATIONS ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[500px] h-[500px] top-0 right-0 animate-float-slow" />
          <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Building2 className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">For Organizations</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Scale English Testing
                <br />
                <span className="gradient-text-static">Across Your Team</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Purpose-built plans for schools, businesses, and institutions — with the tools your team actually needs.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {ORG_PLANS.map((plan, index) => (
              <AnimatedSection key={plan.tier} delay={index * 150}>
                <div className={`relative glass-card p-6 h-full flex flex-col ${plan.popular ? 'ring-2 ring-purple-500/50' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white">{plan.tier}</h3>
                  <p className="text-xs text-white/40 mt-1">{plan.desc}</p>
                  <p className="text-xs text-white/30 mt-0.5">{plan.subdesc}</p>
                  <div className="mt-4 mb-6">
                    <span className="text-2xl sm:text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-sm text-white/40">{plan.period}</span>}
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-white/30 mt-4">Best for: {plan.bestFor}</p>
                  <Link href={plan.ctaLink} className="mt-4 block">
                    <button className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25 hover:-translate-y-0.5'
                        : 'glass-button text-white'
                    }`}>
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt overflow-hidden">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Star className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Success Stories</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Trusted by <span className="gradient-text-static">Thousands of Learners</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {TESTIMONIALS.map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 100}>
                <div className="glass-card p-6 h-full">
                  <p className="text-sm text-white/70 leading-relaxed mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-white font-bold text-sm shadow-lg`}>
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs text-white/40">{testimonial.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/30">{testimonial.location}</p>
                      <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{testimonial.progress}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ENTERPRISE SECTION ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[500px] h-[500px] top-0 -left-24 animate-float-slow" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Building2 className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Enterprise</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Built for Teams and <span className="gradient-text-static">Organisations</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                From universities to corporate training — CEFR Test scales to meet your team&apos;s English assessment needs.
              </p>
            </div>
          </AnimatedSection>

          {/* Stats grid */}
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-14">
              {ENTERPRISE_STATS.map((stat, i) => (
                <div key={stat.label} className="glass-card p-4 text-center">
                  <div className="flex justify-center mb-2 text-purple-400">{stat.icon}</div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Enterprise testimonials */}
          <div className="max-w-4xl mx-auto space-y-6">
            {ENTERPRISE_TESTIMONIALS.map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 100}>
                <div className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-white font-bold text-sm shadow-lg`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-sm text-white/70 leading-relaxed italic mb-3">&ldquo;{testimonial.quote}&rdquo;</p>
                      <div>
                        <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                        <p className="text-xs text-white/40">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt overflow-hidden">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">FAQ</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Frequently Asked <span className="gradient-text-static">Questions</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQ_DATA.map((faq, index) => (
              <AnimatedSection key={faq.question} delay={index * 50}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[600px] h-[600px] top-1/4 left-1/4 animate-float-slow" />
          <div className="orb orb-pink w-[400px] h-[400px] bottom-1/4 right-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                Ready to Transform
                <br />
                <span className="gradient-text">Your English?</span>
              </h2>
              <p className="mt-6 text-lg text-white/50 leading-relaxed">
                Get your official CEFR level in minutes — free to start, with detailed AI feedback on all 6 core skills.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={isAuth ? '/dashboard' : '/register'}>
                  <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                    Get Started Free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer">
                    View Pricing
                  </button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}
