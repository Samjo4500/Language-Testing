'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import {
  Mic, ArrowRight, Brain, Sparkles, RotateCcw, Download, Share2,
  ChevronRight, Clock, Lightbulb, Volume2, CheckCircle2, Lock,
  MessageSquare, BookOpen, Award, Radio,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';
import dynamic from 'next/dynamic';

const Footer = dynamic(
  () => import('@/components/footer').then(mod => ({ default: mod.Footer })),
  { loading: () => <div className="h-40" /> }
);

/* ======================================================
   TYPES
   ====================================================== */
type Phase = 'intro' | 'prepare' | 'recording' | 'processing' | 'results';

interface SpeakingPrompt {
  id: string;
  level: string;
  text: string;
  timeLimit: number; // seconds
}

interface DimensionScore {
  key: string;
  label: string;
  score: number;
  color: string;
  description: string;
}

/* ======================================================
   DATA
   ====================================================== */
const PROMPTS: SpeakingPrompt[] = [
  { id: 'p1', level: 'A2', text: 'Introduce yourself. Talk about your name, where you live, what you do, and one hobby you enjoy. Speak for 30-60 seconds.', timeLimit: 90 },
  { id: 'p2', level: 'B1', text: 'Describe a memorable trip you have taken. Where did you go? What did you do? Why was it memorable? Speak for 1-2 minutes.', timeLimit: 120 },
  { id: 'p3', level: 'B2', text: 'Some cities have banned cars from their city centers to reduce pollution. Do you think this is a good idea? Give reasons and address counterarguments. Speak for 1-2 minutes.', timeLimit: 150 },
  { id: 'p4', level: 'C1', text: 'Discuss the statement: "The measure of a civilization is how it treats its most vulnerable members." Explore different interpretations, provide examples, and explain your position. Speak for 2-3 minutes.', timeLimit: 180 },
  { id: 'p5', level: 'B2', text: 'Talk about a skill you would like to learn in the future. Why is it important to you? How would you go about learning it? What challenges might you face? Speak for 1-2 minutes.', timeLimit: 120 },
];

const DIMENSION_CONFIG = [
  { key: 'grammar', label: 'Grammar', color: '#3b82f6', description: 'Sentence structure & accuracy' },
  { key: 'vocabulary', label: 'Vocabulary', color: '#8b5cf6', description: 'Word range & precision' },
  { key: 'fluency', label: 'Fluency', color: '#06b6d4', description: 'Speaking pace & rhythm' },
  { key: 'pronunciation', label: 'Pronunciation', color: '#10b981', description: 'Sound clarity & intonation' },
  { key: 'coherence', label: 'Coherence', color: '#f59e0b', description: 'Logical flow & organization' },
  { key: 'interaction', label: 'Interaction', color: '#ef4444', description: 'Natural response ability' },
];

const LEVEL_THRESHOLDS = [
  { level: 'C2', min: 90 }, { level: 'C1', min: 75 },
  { level: 'B2', min: 60 }, { level: 'B1', min: 45 },
  { level: 'A2', min: 30 }, { level: 'A1', min: 0 },
];

function getCEFRLevel(score: number): string {
  for (const t of LEVEL_THRESHOLDS) {
    if (score >= t.min) return t.level;
  }
  return 'A1';
}

function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    A1: 'text-red-400', A2: 'text-orange-400', B1: 'text-yellow-400',
    B2: 'text-green-400', C1: 'text-blue-400', C2: 'text-purple-400',
  };
  return colors[level] || 'text-white';
}

function getLevelBadgeClasses(level: string): string {
  const classes: Record<string, string> = {
    A1: 'bg-red-500/15 text-red-400 border-red-500/25',
    A2: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
    B1: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
    B2: 'bg-green-500/15 text-green-400 border-green-500/25',
    C1: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    C2: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  };
  return classes[level] || 'bg-white/10 text-white border-white/20';
}

/* ======================================================
   VOICE WAVEFORM — Canvas Component
   ====================================================== */
function VoiceWaveform({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 320;
    const height = 80;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const barCount = 60;
    const barWidth = 3;
    const gap = (width - barCount * barWidth) / (barCount - 1);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      timeRef.current += active ? 0.08 : 0.02;
      const t = timeRef.current;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        let h: number;

        if (active) {
          // Complex waveform with envelope + noise
          const envelope = Math.sin((i / barCount) * Math.PI) * 0.8 + 0.2;
          const wave1 = Math.sin(t * 2 + i * 0.3) * 0.4;
          const wave2 = Math.sin(t * 3.7 + i * 0.15) * 0.3;
          const noise = Math.random() * 0.2;
          h = (envelope + wave1 + wave2 + noise) * (height * 0.4);
          h = Math.max(4, Math.min(height * 0.85, h));
        } else {
          // Gentle idle wave
          h = (Math.sin(t + i * 0.15) * 0.3 + 0.5) * (height * 0.15);
          h = Math.max(2, h);
        }

        const y = (height - h) / 2;
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, active ? '#60a5fa' : 'rgba(96,165,250,0.4)');
        gradient.addColorStop(1, active ? '#8b5cf6' : 'rgba(139,92,246,0.2)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, h, 1.5);
        ctx.fill();

        // Glow on tall bars
        if (active && h > height * 0.5) {
          ctx.fillStyle = 'rgba(96, 165, 250, 0.08)';
          ctx.beginPath();
          ctx.roundRect(x - 1, y - 2, barWidth + 2, h + 4, 2);
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return <canvas ref={canvasRef} style={{ width: 320, height: 80 }} />;
}

/* ======================================================
   AI ORB — Visual indicator
   ====================================================== */
function AIOrb({ state }: { state: 'idle' | 'listening' | 'thinking' }) {
  const orbColors = {
    idle: 'from-blue-500/30 to-violet-500/30',
    listening: 'from-blue-400/50 to-cyan-400/50',
    thinking: 'from-amber-400/40 to-orange-400/40',
  };

  const iconColors = {
    idle: 'text-blue-300',
    listening: 'text-blue-200',
    thinking: 'text-amber-300',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings — listening state */}
      {state === 'listening' && (
        <>
          <div className="absolute w-24 h-24 rounded-full border border-blue-400/20 animate-ping" style={{ animationDuration: '1.5s' }} />
          <div className="absolute w-32 h-32 rounded-full border border-blue-400/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
        </>
      )}

      {/* Spin ring — thinking state */}
      {state === 'thinking' && (
        <div className="absolute w-28 h-28 rounded-full border-2 border-dashed border-amber-400/30 animate-spin" style={{ animationDuration: '3s' }} />
      )}

      {/* Main orb */}
      <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${orbColors[state]} backdrop-blur-xl flex items-center justify-center shadow-lg transition-all duration-500 ${state === 'listening' ? 'scale-110' : state === 'thinking' ? 'scale-105' : ''}`}>
        {/* Inner glow */}
        <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${orbColors[state]} blur-sm`} />

        {/* Icon */}
        {state === 'thinking' ? (
          <Clock className={`h-7 w-7 ${iconColors[state]} relative animate-spin`} style={{ animationDuration: '2s' }} />
        ) : (
          <Mic className={`h-7 w-7 ${iconColors[state]} relative`} />
        )}

        {/* Listening bars */}
        {state === 'listening' && (
          <div className="absolute bottom-2 flex items-end gap-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 bg-blue-300/60 rounded-full"
                style={{
                  height: `${6 + Math.random() * 8}px`,
                  animation: `waveform ${0.5 + i * 0.2}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======================================================
   RADAR CHART — Canvas Component
   ====================================================== */
function RadarChart({ dimensions }: { dimensions: DimensionScore[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 260;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = 100;
    const count = dimensions.length;
    const angleStep = (Math.PI * 2) / count;

    // Draw grid rings
    for (let ring = 1; ring <= 5; ring++) {
      const r = (ring / 5) * maxR;
      ctx.beginPath();
      for (let i = 0; i <= count; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${ring === 5 ? 0.08 : 0.04})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Draw axis lines
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Draw data polygon
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const idx = i % count;
      const angle = idx * angleStep - Math.PI / 2;
      const r = (dimensions[idx].score / 100) * maxR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Gradient fill
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.08)');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw data points
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const r = (dimensions[i].score / 100) * maxR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);

      // Glow
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = dimensions[i].color + '30';
      ctx.fill();

      // Point
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = dimensions[i].color;
      ctx.fill();
    }

    // Draw labels
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const labelR = maxR + 20;
      const x = cx + labelR * Math.cos(angle);
      const y = cy + labelR * Math.sin(angle);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText(dimensions[i].label, x, y + 4);
    }
  }, [dimensions]);

  return <canvas ref={canvasRef} style={{ width: 260, height: 260 }} />;
}

/* ======================================================
   AI TYPING FEEDBACK
   ====================================================== */
function AITypingFeedback({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 shrink-0 mt-0.5">
        <Sparkles className="h-4 w-4 text-blue-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-white/70 leading-relaxed">
          {displayed}
          {!done && <span className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 animate-pulse" />}
        </p>
      </div>
    </div>
  );
}

/* ======================================================
   CIRCULAR TIMER — for recording phase
   ====================================================== */
function CircularTimer({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const progress = timeLeft / totalTime;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width={128} height={128}>
        {/* Background ring */}
        <circle cx={64} cy={64} r={54} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />
        {/* Progress ring */}
        <circle
          cx={64} cy={64} r={54} fill="none"
          stroke="url(#timerGradient)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <div className="text-2xl font-bold text-white tabular-nums">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
        <div className="text-[10px] text-white/30 uppercase tracking-wider">remaining</div>
      </div>
    </div>
  );
}

/* ======================================================
   MAIN PAGE — 5-Phase Speaking Assessment
   ====================================================== */
export default function SpeakingAssessmentPage() {
  const { isAuthenticated, user } = useAuthStore();
  const mounted = useHydrated();
  const isAuth = mounted && isAuthenticated;

  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt>(PROMPTS[0]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [dimensions, setDimensions] = useState<DimensionScore[]>(
    DIMENSION_CONFIG.map(d => ({ ...d, score: 0 }))
  );
  const [overallScore, setOverallScore] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Timer for recording phase
  useEffect(() => {
    if (phase !== 'recording') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleStopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Processing steps animation
  useEffect(() => {
    if (phase !== 'processing') return;
    const steps = [0, 1, 2, 3, 4];
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setProcessingStep(current);
      if (current >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          // Generate simulated scores
          const newDimensions = DIMENSION_CONFIG.map(d => ({
            ...d,
            score: Math.floor(Math.random() * 35) + 45, // 45-80 range
          }));
          setDimensions(newDimensions);
          const avg = Math.round(newDimensions.reduce((sum, d) => sum + d.score, 0) / newDimensions.length);
          setOverallScore(avg);
          setPhase('results');
        }, 800);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [phase]);

  const handleStartRecording = () => {
    setTimeLeft(selectedPrompt.timeLimit);
    setPhase('recording');
  };

  const handleStopRecording = () => {
    setPhase('processing');
    setProcessingStep(0);
  };

  const handleReset = () => {
    setPhase('intro');
    setDimensions(DIMENSION_CONFIG.map(d => ({ ...d, score: 0 })));
    setOverallScore(0);
    setProcessingStep(0);
  };

  const cefrLevel = getCEFRLevel(overallScore);
  const feedbackText = `Your speaking demonstrates ${overallScore >= 70 ? 'strong' : overallScore >= 50 ? 'developing' : 'foundational'} proficiency at the ${cefrLevel} level. ${dimensions.sort((a, b) => a.score - b.score)[0]?.label || 'Grammar'} is an area for improvement, while ${dimensions.sort((a, b) => b.score - a.score)[0]?.label || 'Fluency'} is your strongest dimension. Practice with longer, more complex prompts to push into the next CEFR band. Keep speaking daily — consistency is the key to fluency!`;

  return (
    <div className="min-h-screen flex flex-col bg-[#06051A]">
      <Navbar />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════
            PHASE 1: INTRO
            ═══════════════════════════════════════════ */}
        {phase === 'intro' && (
          <section className="relative overflow-hidden min-h-[85vh] flex items-center">
            {/* Background orbs */}
            <div className="absolute pointer-events-none" style={{ width: 500, height: 500, top: '-10%', right: '-5%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', animation: 'float 8s ease-in-out infinite' }} />
            <div className="absolute pointer-events-none" style={{ width: 400, height: 400, bottom: '-10%', left: '-5%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', animation: 'float-reverse 10s ease-in-out infinite' }} />

            <div className="container relative mx-auto px-4 py-20">
              <div className="max-w-4xl mx-auto">
                {/* Badge */}
                <div className={`flex justify-center mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                    </span>
                    <span className="text-sm text-blue-300 font-medium">AI-Powered Speaking Assessment</span>
                  </div>
                </div>

                {/* Headline */}
                <h1 className={`text-center font-extrabold tracking-tight text-white leading-[1.1] transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
                  Speak. Get Scored.{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">Improve.</span>
                </h1>

                <p className={`text-center mt-5 text-lg text-white/50 max-w-2xl mx-auto transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  Record your voice responding to real-world prompts. Our AI evaluates 6 dimensions of your speaking and gives you an instant CEFR score.
                </p>

                {/* Voice Waveform Preview */}
                <div className={`flex justify-center mt-8 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  <VoiceWaveform active={false} />
                </div>

                {/* 6 Dimension Cards */}
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 mt-10 max-w-2xl mx-auto transition-all duration-700 delay-[400ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  {DIMENSION_CONFIG.map((dim, i) => (
                    <div
                      key={dim.key}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
                      style={{ transitionDelay: visible ? `${500 + i * 60}ms` : '0ms' }}
                    >
                      <div className="w-3 h-3 rounded-full mx-auto mb-1.5" style={{ backgroundColor: dim.color + '40', boxShadow: `0 0 8px ${dim.color}20` }} />
                      <div className="text-sm font-medium text-white/80">{dim.label}</div>
                      <div className="text-[10px] text-white/30">{dim.description}</div>
                    </div>
                  ))}
                </div>

                {/* Prompt Selector */}
                <div className={`mt-12 max-w-2xl mx-auto transition-all duration-700 delay-[500ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4 text-center">Choose Your Prompt</h3>
                  <div className="space-y-2.5">
                    {PROMPTS.map((prompt) => (
                      <button
                        key={prompt.id}
                        onClick={() => setSelectedPrompt(prompt)}
                        className={`w-full text-left rounded-xl border p-4 transition-all duration-300 cursor-pointer group ${
                          selectedPrompt.id === prompt.id
                            ? 'border-blue-500/30 bg-blue-500/[0.07]'
                            : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border shrink-0 mt-0.5 ${getLevelBadgeClasses(prompt.level)}`}>
                            {prompt.level}
                          </span>
                          <p className={`text-sm leading-relaxed ${selectedPrompt.id === prompt.id ? 'text-white/80' : 'text-white/40 group-hover:text-white/60'}`}>
                            {prompt.text}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start CTA */}
                <div className={`flex justify-center mt-10 transition-all duration-700 delay-[600ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  <button
                    onClick={() => setPhase('prepare')}
                    className="group cta-shimmer-btn inline-flex items-center gap-2.5 rounded-full px-10 py-4 text-white font-semibold text-lg transition-all duration-300 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      Start Assessment
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            PHASE 2: PREPARE
            ═══════════════════════════════════════════ */}
        {phase === 'prepare' && (
          <section className="relative overflow-hidden min-h-[70vh] flex items-center">
            <div className="container relative mx-auto px-4 py-20">
              <div className="max-w-2xl mx-auto text-center">
                {/* Back button */}
                <button onClick={() => setPhase('intro')} className="text-white/40 hover:text-white/70 text-sm mb-8 flex items-center gap-1 mx-auto transition-colors cursor-pointer">
                  ← Back to prompts
                </button>

                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 mb-6">
                  <Lightbulb className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-emerald-300 font-medium">Prepare Yourself</span>
                </div>

                {/* Prompt Display */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8 mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getLevelBadgeClasses(selectedPrompt.level)}`}>
                      Level {selectedPrompt.level}
                    </span>
                    <span className="inline-flex items-center gap-1 text-white/40 text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {Math.floor(selectedPrompt.timeLimit / 60)}:{(selectedPrompt.timeLimit % 60).toString().padStart(2, '0')} max
                    </span>
                  </div>
                  <p className="text-lg text-white/80 leading-relaxed">{selectedPrompt.text}</p>
                </div>

                {/* Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
                  {[
                    { icon: Volume2, text: 'Speak clearly and at a natural pace' },
                    { icon: MessageSquare, text: 'Use full sentences, not single words' },
                    { icon: Sparkles, text: 'Be natural — don\'t memorize scripts' },
                  ].map((tip, i) => (
                    <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                      <tip.icon className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                      <p className="text-xs text-white/50">{tip.text}</p>
                    </div>
                  ))}
                </div>

                {/* Start Recording CTA */}
                <button
                  onClick={handleStartRecording}
                  className="group inline-flex items-center gap-2.5 rounded-full px-10 py-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white font-semibold text-lg transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Mic className="h-5 w-5" />
                  I&apos;m Ready — Start Recording
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            PHASE 3: RECORDING
            ═══════════════════════════════════════════ */}
        {phase === 'recording' && (
          <section className="relative overflow-hidden min-h-[80vh] flex items-center speaking-bg-2">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container relative mx-auto px-4 py-20">
              <div className="max-w-2xl mx-auto text-center">
                {/* AI Orb */}
                <div className="flex justify-center mb-8">
                  <AIOrb state="listening" />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Listening...</h2>
                <p className="text-white/40 text-sm mb-8">Speak naturally into your microphone</p>

                {/* Voice Waveform */}
                <div className="flex justify-center mb-8">
                  <VoiceWaveform active={true} />
                </div>

                {/* Timer */}
                <div className="flex justify-center mb-8">
                  <CircularTimer timeLeft={timeLeft} totalTime={selectedPrompt.timeLimit} />
                </div>

                {/* Prompt reference */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-8 max-w-lg mx-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${getLevelBadgeClasses(selectedPrompt.level)}`}>
                      {selectedPrompt.level}
                    </span>
                    <span className="text-xs text-white/30">Your prompt</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">{selectedPrompt.text}</p>
                </div>

                {/* Stop button */}
                <button
                  onClick={handleStopRecording}
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3 border-2 border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-semibold text-base transition-all duration-300 cursor-pointer"
                >
                  <div className="w-3 h-3 rounded-sm bg-red-400" />
                  Stop Recording
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            PHASE 4: PROCESSING
            ═══════════════════════════════════════════ */}
        {phase === 'processing' && (
          <section className="relative overflow-hidden min-h-[60vh] flex items-center speaking-bg-3">
            <div className="container relative mx-auto px-4 py-20">
              <div className="max-w-lg mx-auto text-center">
                {/* AI Orb — Thinking */}
                <div className="flex justify-center mb-10">
                  <AIOrb state="thinking" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Speech</h2>
                <p className="text-white/40 text-sm mb-10">Our AI is evaluating your speaking across 6 dimensions</p>

                {/* Processing Steps */}
                <div className="space-y-3 text-left max-w-sm mx-auto">
                  {[
                    { label: 'Transcribing speech', icon: '📝' },
                    { label: 'Analyzing grammar patterns', icon: '🔍' },
                    { label: 'Evaluating vocabulary range', icon: '📚' },
                    { label: 'Measuring fluency metrics', icon: '🎯' },
                    { label: 'Calculating final scores', icon: '✨' },
                  ].map((step, i) => (
                    <div
                      key={step.label}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${
                        i < processingStep
                          ? 'border-emerald-500/20 bg-emerald-500/[0.05]'
                          : i === processingStep
                          ? 'border-blue-500/20 bg-blue-500/[0.05]'
                          : 'border-white/[0.04] bg-white/[0.01]'
                      }`}
                    >
                      <span className="text-lg">{step.icon}</span>
                      <span className={`text-sm flex-1 ${i <= processingStep ? 'text-white/80' : 'text-white/30'}`}>
                        {step.label}
                      </span>
                      {i < processingStep ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : i === processingStep ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/10" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            PHASE 5: RESULTS
            ═══════════════════════════════════════════ */}
        {phase === 'results' && (
          <section className="relative overflow-hidden py-16 md:py-24 speaking-bg-5">
            <div className="container relative mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 mb-6">
                    <Award className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-blue-300 font-medium">Assessment Complete</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Your Speaking Results</h2>
                </div>

                {/* Score + Level */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-12">
                  {/* Overall Score Ring */}
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="absolute inset-0 -rotate-90" width={176} height={176}>
                      <circle cx={88} cy={88} r={74} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
                      <circle
                        cx={88} cy={88} r={74} fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth={6}
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 74}
                        strokeDashoffset={2 * Math.PI * 74 * (1 - overallScore / 100)}
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white">{overallScore}</div>
                      <div className="text-xs text-white/30">out of 100</div>
                    </div>
                  </div>

                  {/* CEFR Level Badge */}
                  <div className="text-center">
                    <div className="text-sm text-white/30 uppercase tracking-wider mb-2">Your CEFR Level</div>
                    <div className={`text-6xl font-extrabold ${getLevelColor(cefrLevel)}`} style={{ textShadow: `0 0 30px ${DIMENSION_CONFIG[0].color}30` }}>
                      {cefrLevel}
                    </div>
                    <div className="text-sm text-white/40 mt-2">Speaking Proficiency</div>
                  </div>
                </div>

                {/* Radar Chart + Progress Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {/* Radar Chart */}
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 flex items-center justify-center">
                    <RadarChart dimensions={dimensions} />
                  </div>

                  {/* Progress Bars */}
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Dimension Breakdown</h3>
                    {dimensions.map((dim) => (
                      <div key={dim.key}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dim.color }} />
                            <span className="text-sm text-white/70">{dim.label}</span>
                          </div>
                          <span className="text-sm font-semibold text-white">{dim.score}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${dim.score}%`,
                              background: `linear-gradient(90deg, ${dim.color}80, ${dim.color})`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Feedback */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 mb-10">
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">AI Feedback</h3>
                  <AITypingFeedback text={feedbackText} />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white font-semibold transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white font-medium transition-all duration-300 cursor-pointer">
                    <Download className="h-4 w-4" />
                    Download Report
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white font-medium transition-all duration-300 cursor-pointer">
                    <Share2 className="h-4 w-4" />
                    Share on LinkedIn
                  </button>
                </div>

                {/* Premium CTA */}
                {!isAuth && (
                  <div className="text-center rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] p-6 max-w-lg mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-300">Detailed Breakdown</span>
                    </div>
                    <p className="text-sm text-white/40 mb-4">Upgrade to Premium for per-question analysis, pronunciation phoneme scores, and improvement recommendations.</p>
                    <Link href="/pricing">
                      <button className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-sm transition-all cursor-pointer border border-amber-500/20">
                        Upgrade for Full Report
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
