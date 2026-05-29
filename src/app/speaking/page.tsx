'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import {
  Mic, ArrowRight, Brain, Sparkles, RotateCcw, Download, Share2,
  ChevronRight, Clock, Lightbulb, Volume2, CheckCircle2, Lock,
  MessageSquare, BookOpen, Award, Radio, MicOff, AlertCircle,
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
   LIVE RECORDING INDICATOR — Fixed top bar
   ====================================================== */
function LiveRecordingIndicator({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const elapsed = totalTime - timeLeft;
  const elapsedMin = Math.floor(elapsed / 60);
  const elapsedSec = elapsed % 60;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-950/80 backdrop-blur-xl border-b border-red-500/20">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Pulsing red dot */}
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </span>
          <span className="text-sm font-bold text-red-300 uppercase tracking-wider">REC</span>
          <span className="text-xs text-red-400/60">Recording in progress</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-red-400/50">
            {elapsedMin}:{elapsedSec.toString().padStart(2, '0')} elapsed
          </span>
          <span className="text-sm font-mono font-bold text-red-300">
            {minutes}:{seconds.toString().padStart(2, '0')} left
          </span>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   MICROPHONE RING — Large visible mic with audio level ring
   ====================================================== */
function MicrophoneRing({ audioLevel, isActive }: { audioLevel: number; isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const smoothLevel = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 220;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const baseRadius = 80;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Smooth the audio level
      const target = isActive ? audioLevel : 0;
      smoothLevel.current += (target - smoothLevel.current) * 0.15;
      const level = smoothLevel.current;

      // Outer glow ring (reacts to audio)
      const glowRadius = baseRadius + 12 + level * 18;
      const gradient = ctx.createRadialGradient(cx, cy, baseRadius - 5, cx, cy, glowRadius + 10);
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.0)');
      gradient.addColorStop(0.5, `rgba(239, 68, 68, ${0.05 + level * 0.15})`);
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, glowRadius + 10, 0, Math.PI * 2);
      ctx.fill();

      // Audio level ring segments
      const segments = 64;
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2 - Math.PI / 2;
        const segLen = 4 + level * 14 * Math.sin(i * 0.5 + Date.now() * 0.003);
        const innerR = baseRadius + 4;
        const outerR = innerR + Math.max(2, segLen);

        const x1 = cx + innerR * Math.cos(angle);
        const y1 = cy + innerR * Math.sin(angle);
        const x2 = cx + outerR * Math.cos(angle);
        const y2 = cy + outerR * Math.sin(angle);

        const segGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        segGrad.addColorStop(0, `rgba(239, 68, 68, ${0.3 + level * 0.4})`);
        segGrad.addColorStop(1, `rgba(239, 68, 68, ${0.1 + level * 0.2})`);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = segGrad;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Base circle ring
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isActive ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner subtle fill
      const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius);
      innerGrad.addColorStop(0, isActive ? 'rgba(239, 68, 68, 0.06)' : 'rgba(96, 165, 250, 0.04)');
      innerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [audioLevel, isActive]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      <canvas ref={canvasRef} style={{ width: 220, height: 220 }} className="absolute inset-0" />
      {/* Mic icon center */}
      <div className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-red-500/15 shadow-lg shadow-red-500/20' : 'bg-white/[0.03]'}`}>
        {isActive ? (
          <Mic className="h-10 w-10 text-red-400 drop-shadow-lg" />
        ) : (
          <MicOff className="h-10 w-10 text-white/20" />
        )}
      </div>
    </div>
  );
}

/* ======================================================
   VOICE WAVEFORM — Canvas Component with real audio data
   ====================================================== */
function VoiceWaveform({ active, audioLevel = 0 }: { active: boolean; audioLevel?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 360;
    const height = 80;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const barCount = 70;
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
          // Real audio level influences the waveform height
          const envelope = Math.sin((i / barCount) * Math.PI) * 0.8 + 0.2;
          const wave1 = Math.sin(t * 2 + i * 0.3) * 0.4;
          const wave2 = Math.sin(t * 3.7 + i * 0.15) * 0.3;
          const noise = Math.random() * 0.2;
          const audioBoost = audioLevel * 0.6; // Real mic input boost
          h = (envelope + wave1 + wave2 + noise + audioBoost) * (height * 0.4);
          h = Math.max(4, Math.min(height * 0.9, h));
        } else {
          // Gentle idle wave
          h = (Math.sin(t + i * 0.15) * 0.3 + 0.5) * (height * 0.15);
          h = Math.max(2, h);
        }

        const y = (height - h) / 2;
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        if (active) {
          gradient.addColorStop(0, `rgba(239, 68, 68, ${0.6 + audioLevel * 0.3})`);
          gradient.addColorStop(0.5, '#f97316');
          gradient.addColorStop(1, `rgba(249, 115, 22, ${0.4 + audioLevel * 0.2})`);
        } else {
          gradient.addColorStop(0, 'rgba(96,165,250,0.4)');
          gradient.addColorStop(1, 'rgba(139,92,246,0.2)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, h, 1.5);
        ctx.fill();

        // Glow on tall bars
        if (active && h > height * 0.45) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.06)';
          ctx.beginPath();
          ctx.roundRect(x - 1, y - 2, barWidth + 2, h + 4, 2);
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active, audioLevel]);

  return <canvas ref={canvasRef} style={{ width: 360, height: 80 }} />;
}

/* ======================================================
   AI ORB — Visual indicator (kept for processing phase)
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

  // Color changes as time runs low
  const isLow = timeLeft <= 15 && timeLeft > 0;
  const isCritical = timeLeft <= 5;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width={128} height={128}>
        {/* Background ring */}
        <circle cx={64} cy={64} r={54} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />
        {/* Progress ring */}
        <circle
          cx={64} cy={64} r={54} fill="none"
          stroke={isCritical ? '#ef4444' : isLow ? '#f59e0b' : 'url(#timerGradient)'}
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
        <div className={`text-2xl font-bold tabular-nums ${isCritical ? 'text-red-400 animate-pulse' : isLow ? 'text-amber-400' : 'text-white'}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
        <div className="text-[10px] text-white/30 uppercase tracking-wider">remaining</div>
      </div>
    </div>
  );
}

/* ======================================================
   AUDIO LEVEL METER — Simple bar showing mic input
   ====================================================== */
function AudioLevelMeter({ level, isActive }: { level: number; isActive: boolean }) {
  const bars = 20;
  const activeBars = Math.round(level * bars);

  return (
    <div className="flex items-center gap-1 justify-center">
      {Array.from({ length: bars }).map((_, i) => {
        const filled = i < activeBars;
        const isHigh = i >= bars * 0.75;
        const isMid = i >= bars * 0.5;
        return (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-75 ${
              !isActive
                ? 'h-2 bg-white/[0.06]'
                : filled
                ? isHigh
                  ? 'h-4 bg-red-400/80'
                  : isMid
                  ? 'h-3.5 bg-amber-400/70'
                  : 'h-3 bg-emerald-400/60'
                : 'h-2 bg-white/[0.06]'
            }`}
          />
        );
      })}
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
  const [audioLevel, setAudioLevel] = useState(0);
  const [micPermission, setMicPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [isRecording, setIsRecording] = useState(false);

  // Refs for Web Audio API
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Real microphone audio level tracking
  const startMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicPermission('granted');

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const trackLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        // Calculate RMS-like level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalizedLevel = Math.min(1, avg / 128); // 0-1 range
        setAudioLevel(normalizedLevel);
        animFrameRef.current = requestAnimationFrame(trackLevel);
      };

      trackLevel();
    } catch (err) {
      console.error('Microphone access denied:', err);
      setMicPermission('denied');
    }
  }, []);

  const stopMicrophone = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
    setIsRecording(false);
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
            score: Math.floor(Math.random() * 35) + 45,
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  const handleStartRecording = async () => {
    setIsRecording(true);
    await startMicrophone();
    setTimeLeft(selectedPrompt.timeLimit);
    setPhase('recording');
  };

  const handleStopRecording = () => {
    stopMicrophone();
    setPhase('processing');
    setProcessingStep(0);
  };

  const handleReset = () => {
    setPhase('intro');
    setDimensions(DIMENSION_CONFIG.map(d => ({ ...d, score: 0 })));
    setOverallScore(0);
    setProcessingStep(0);
    setAudioLevel(0);
    setIsRecording(false);
  };

  const cefrLevel = getCEFRLevel(overallScore);
  const sortedDims = [...dimensions].sort((a, b) => a.score - b.score);
  const weakest = sortedDims[0]?.label || 'Grammar';
  const strongest = sortedDims[sortedDims.length - 1]?.label || 'Fluency';
  const feedbackText = `Your speaking demonstrates ${overallScore >= 70 ? 'strong' : overallScore >= 50 ? 'developing' : 'foundational'} proficiency at the ${cefrLevel} level. ${weakest} is an area for improvement, while ${strongest} is your strongest dimension. Practice with longer, more complex prompts to push into the next CEFR band. Keep speaking daily \u2014 consistency is the key to fluency!`;

  return (
    <div className="min-h-screen flex flex-col bg-[#06051A]">
      <Navbar />

      {/* Fixed recording indicator */}
      {phase === 'recording' && (
        <LiveRecordingIndicator timeLeft={timeLeft} totalTime={selectedPrompt.timeLimit} />
      )}

      <main className={`flex-1 ${phase === 'recording' ? 'pt-10' : ''}`}>
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

                {/* Headline with Mic icon */}
                <div className={`text-center transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center border border-blue-500/20">
                        <Mic className="h-8 w-8 text-blue-400" />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#06051A] flex items-center justify-center">
                        <span className="text-[6px] font-bold text-white">ON</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className={`text-center font-extrabold tracking-tight text-white leading-[1.1] transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
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
                  &larr; Back to prompts
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

                {/* Mic permission check */}
                {micPermission === 'denied' && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-300">Microphone access required</p>
                      <p className="text-xs text-red-400/60 mt-1">Please allow microphone access in your browser settings to record your speaking. Look for the microphone icon in your address bar.</p>
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
                  {[
                    { icon: Volume2, text: 'Speak clearly and at a natural pace' },
                    { icon: MessageSquare, text: 'Use full sentences, not single words' },
                    { icon: Sparkles, text: 'Be natural \u2014 don\'t memorize scripts' },
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
                  className="group inline-flex items-center gap-3 rounded-full px-10 py-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white font-semibold text-lg transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="relative">
                    <Mic className="h-6 w-6" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white/20" />
                  </div>
                  I&apos;m Ready &mdash; Start Recording
                </button>
                <p className="text-xs text-white/25 mt-3">Your browser will ask for microphone permission</p>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            PHASE 3: RECORDING — VISIBLE MICROPHONE
            ═══════════════════════════════════════════ */}
        {phase === 'recording' && (
          <section className="relative overflow-hidden min-h-[90vh] flex items-center speaking-bg-2">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/[0.04] rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/[0.06] rounded-full blur-3xl" />
            </div>

            <div className="container relative mx-auto px-4 py-20">
              <div className="max-w-2xl mx-auto text-center">
                {/* ★ LARGE VISIBLE MICROPHONE ★ */}
                <div className="flex justify-center mb-6">
                  <MicrophoneRing audioLevel={audioLevel} isActive={isRecording} />
                </div>

                {/* Mic status text */}
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {isRecording ? 'Recording Your Speech...' : 'Connecting Microphone...'}
                  </h2>
                  <p className="text-white/40 text-sm">
                    {isRecording ? 'Speak clearly \u2014 the mic is listening' : 'Please allow microphone access'}
                  </p>
                </div>

                {/* Audio Level Meter */}
                <div className="mb-6">
                  <AudioLevelMeter level={audioLevel} isActive={isRecording} />
                  <p className="text-[10px] text-white/20 mt-1.5 uppercase tracking-wider">
                    {audioLevel > 0.3 ? 'Good volume' : audioLevel > 0.1 ? 'Speak louder' : 'No input detected'}
                  </p>
                </div>

                {/* Voice Waveform */}
                <div className="flex justify-center mb-6">
                  <VoiceWaveform active={isRecording} audioLevel={audioLevel} />
                </div>

                {/* Timer */}
                <div className="flex justify-center mb-6">
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

                {/* Stop button — prominent red */}
                <button
                  onClick={handleStopRecording}
                  className="inline-flex items-center gap-3 rounded-full px-10 py-4 border-2 border-red-500/50 bg-red-500/15 hover:bg-red-500/25 hover:border-red-500/70 text-red-300 font-semibold text-lg transition-all duration-300 cursor-pointer shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
                >
                  <div className="w-4 h-4 rounded-sm bg-red-500" />
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
                    { label: 'Transcribing speech', icon: '\uD83D\uDCDD' },
                    { label: 'Analyzing grammar patterns', icon: '\uD83D\uDD0D' },
                    { label: 'Evaluating vocabulary range', icon: '\uD83D\uDCDA' },
                    { label: 'Measuring fluency metrics', icon: '\uD83C\uDFAF' },
                    { label: 'Calculating final scores', icon: '\u2728' },
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
                {/* Header with mic re-record */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 mb-6">
                    <Award className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-blue-300 font-medium">Assessment Complete</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Your Speaking Results</h2>
                </div>

                {/* Score + Level + Mic */}
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

                  {/* Re-record with Mic */}
                  <div className="text-center">
                    <button
                      onClick={handleReset}
                      className="group relative flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/15 to-violet-500/15 border border-blue-500/20 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500/40 group-hover:shadow-lg group-hover:shadow-blue-500/15">
                        <Mic className="h-8 w-8 text-blue-400 transition-transform group-hover:scale-110" />
                      </div>
                      <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors font-medium">Record Again</span>
                    </button>
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
