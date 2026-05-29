'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useHydrated } from '@/hooks/use-hydrated';
import { trackSpeakingDemoStart, trackSpeakingDemoComplete } from '@/lib/analytics';
import { Mic } from 'lucide-react';
import { CEFR_DIMENSIONS } from '@/components/home/constants';

/* ======================================================
   NEURAL VOICE LAB — Immersive Speaking Assessment Demo
   ====================================================== */

// Dimension hex colors for canvas & SVG rendering
const DIM_HEX = ['#6366f1', '#3b82f6', '#06b6d4', '#0ea5e9', '#06b6d4', '#6366f1'];
const DIM_GLOW = [
  'rgba(99,102,241,0.35)', 'rgba(59,130,246,0.35)', 'rgba(6,182,212,0.35)',
  'rgba(14,165,233,0.35)', 'rgba(6,182,212,0.35)', 'rgba(99,102,241,0.35)',
];

// Simulated target scores
const TARGET_SCORES = [82, 78, 87, 91, 75, 80];

// Prompt
const PROMPT_TEXT = 'Describe a memorable experience from your life and why it shaped who you are.';

// Particle interface
interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  baseOpacity: number;
}

// Sonar pulse interface
interface SonarPulse {
  radius: number;
  opacity: number;
}

export default function LiveVoiceDemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [displayScores, setDisplayScores] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [typedChars, setTypedChars] = useState(PROMPT_TEXT.length);
  const mounted = useHydrated();

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const isRecordingRef = useRef(false);
  const audioDataRef = useRef<Float32Array | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sonarRef = useRef<SonarPulse[]>([]);
  const scoreTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sonarIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize audio data and particles
  useEffect(() => {
    audioDataRef.current = new Float32Array(64);
    particlesRef.current = Array.from({ length: 16 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 110 + Math.random() * 25,
      speed: 0.002 + Math.random() * 0.005,
      size: 0.6 + Math.random() * 1.8,
      baseOpacity: 0.12 + Math.random() * 0.3,
    }));
  }, []);

  // Sync recording state to ref (avoids stale closure in animation loop)
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Format timer display
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = useCallback(async () => {
    let micPermission: 'granted' | 'denied' | 'not_requested' = 'not_requested';
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      micPermission = result.state === 'granted' ? 'granted' : result.state === 'denied' ? 'denied' : 'not_requested';
    } catch {
      micPermission = 'not_requested';
    }
    trackSpeakingDemoStart({ mic_permission: micPermission });

    setIsRecording(true);
    setRecordingTime(0);
    setTypedChars(0);
    setDisplayScores([0, 0, 0, 0, 0, 0]);
    sonarRef.current = [];

    // Timer
    timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);

    // Typewriter effect
    typeTimerRef.current = setInterval(() => {
      setTypedChars(prev => {
        if (prev >= PROMPT_TEXT.length) {
          if (typeTimerRef.current) clearInterval(typeTimerRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 28);

    // Score counting animation
    scoreTimerRef.current = setInterval(() => {
      setDisplayScores(prev => {
        const next = [...prev];
        let allDone = true;
        for (let i = 0; i < 6; i++) {
          if (next[i] < TARGET_SCORES[i]) {
            next[i] = Math.min(next[i] + 1 + Math.floor(Math.random() * 4), TARGET_SCORES[i]);
            allDone = false;
          }
        }
        if (allDone && scoreTimerRef.current) clearInterval(scoreTimerRef.current);
        return next;
      });
    }, 130);

    // Sonar pulse generator
    sonarIntervalRef.current = setInterval(() => {
      if (!isRecordingRef.current) {
        if (sonarIntervalRef.current) clearInterval(sonarIntervalRef.current);
        return;
      }
      sonarRef.current.push({ radius: 28, opacity: 0.45 });
      if (sonarRef.current.length > 5) sonarRef.current.shift();
    }, 750);
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setTypedChars(PROMPT_TEXT.length);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (typeTimerRef.current) { clearInterval(typeTimerRef.current); typeTimerRef.current = null; }
    if (scoreTimerRef.current) { clearInterval(scoreTimerRef.current); scoreTimerRef.current = null; }
    if (sonarIntervalRef.current) { clearInterval(sonarIntervalRef.current); sonarIntervalRef.current = null; }
    trackSpeakingDemoComplete();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
      if (scoreTimerRef.current) clearInterval(scoreTimerRef.current);
      if (sonarIntervalRef.current) clearInterval(sonarIntervalRef.current);
    };
  }, []);

  // ===================== CANVAS ANIMATION =====================
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 300;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const particles = particlesRef.current;
    const audioData = audioDataRef.current!;
    const TWO_PI = Math.PI * 2;

    const draw = (timestamp: number) => {
      const t = timestamp * 0.001;
      const rec = isRecordingRef.current;

      ctx.clearRect(0, 0, size, size);

      // --- Update audio data ---
      for (let i = 0; i < 64; i++) {
        if (rec) {
          const target = 0.12 + Math.random() * 0.88;
          audioData[i] += (target - audioData[i]) * 0.13;
        } else {
          const idle = 0.035 + Math.sin(t * 1.5 + i * 0.35) * 0.025;
          audioData[i] += (idle - audioData[i]) * 0.04;
        }
      }
      const avgAmp = audioData.reduce((a, b) => a + b, 0) / 64;

      // --- Sonar pulses (recording only) ---
      for (let i = sonarRef.current.length - 1; i >= 0; i--) {
        const p = sonarRef.current[i];
        p.radius += 1.3;
        p.opacity -= 0.005;
        if (p.opacity <= 0) { sonarRef.current.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(cx, cy, p.radius, 0, TWO_PI);
        ctx.strokeStyle = `rgba(239, 68, 68, ${p.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // --- Orbiting particles ---
      for (const p of particles) {
        p.angle += p.speed * (rec ? 2.8 : 1);
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius;

        // Particle glow (recording)
        if (rec) {
          const grd = ctx.createRadialGradient(px, py, 0, px, py, p.size * 5);
          grd.addColorStop(0, `rgba(239, 68, 68, ${p.baseOpacity * 0.25})`);
          grd.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(px, py, p.size * 5, 0, TWO_PI);
          ctx.fillStyle = grd;
          ctx.fill();
        } else {
          const grd = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
          grd.addColorStop(0, `rgba(59, 130, 246, ${p.baseOpacity * 0.15})`);
          grd.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(px, py, p.size * 3, 0, TWO_PI);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Particle dot
        ctx.beginPath();
        ctx.arc(px, py, p.size * (rec ? 1.5 : 1), 0, TWO_PI);
        ctx.fillStyle = rec
          ? `rgba(239, 68, 68, ${Math.min(p.baseOpacity * 1.6, 1)})`
          : `rgba(59, 130, 246, ${p.baseOpacity})`;
        ctx.fill();
      }

      // --- Decorative concentric rings ---
      // Ring 1 — outer, slow clockwise
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.22);
      ctx.beginPath();
      ctx.arc(0, 0, 108, 0, TWO_PI);
      ctx.strokeStyle = rec ? 'rgba(239, 68, 68, 0.09)' : 'rgba(59, 130, 246, 0.07)';
      ctx.setLineDash([3, 11]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Ring 2 — middle, counter-clockwise
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.16);
      ctx.beginPath();
      ctx.arc(0, 0, 96, 0, TWO_PI);
      ctx.strokeStyle = rec ? 'rgba(245, 158, 11, 0.07)' : 'rgba(139, 92, 246, 0.05)';
      ctx.setLineDash([5, 14]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Ring 3 — inner, clockwise faster
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.35);
      ctx.beginPath();
      ctx.arc(0, 0, 83, 0, TWO_PI);
      ctx.strokeStyle = rec ? 'rgba(249, 115, 22, 0.05)' : 'rgba(6, 182, 212, 0.04)';
      ctx.setLineDash([2, 9]);
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // --- Circular waveform (48 bars) ---
      const numBars = 48;
      const waveR = 65;
      for (let i = 0; i < numBars; i++) {
        const angle = (i / numBars) * TWO_PI - Math.PI / 2;
        const amp = audioData[i % 64];
        const barH = 3 + amp * 27;

        const x1 = cx + Math.cos(angle) * waveR;
        const y1 = cy + Math.sin(angle) * waveR;
        const x2 = cx + Math.cos(angle) * (waveR + barH);
        const y2 = cy + Math.sin(angle) * (waveR + barH);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';

        if (rec) {
          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, `rgba(239, 68, 68, ${0.45 + amp * 0.55})`);
          grad.addColorStop(1, `rgba(245, 158, 11, ${0.12 + amp * 0.3})`);
          ctx.strokeStyle = grad;
        } else {
          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
          grad.addColorStop(1, 'rgba(139, 92, 246, 0.08)');
          ctx.strokeStyle = grad;
        }
        ctx.stroke();
      }

      // --- Central glow ---
      const glowR = 48 + (rec ? avgAmp * 16 : Math.sin(t * 1.5) * 3);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      if (rec) {
        glow.addColorStop(0, `rgba(239, 68, 68, ${0.16 + avgAmp * 0.14})`);
        glow.addColorStop(0.45, 'rgba(245, 158, 11, 0.05)');
        glow.addColorStop(1, 'transparent');
      } else {
        glow.addColorStop(0, `rgba(59, 130, 246, ${0.1 + Math.sin(t * 1.5) * 0.03})`);
        glow.addColorStop(0.45, 'rgba(139, 92, 246, 0.03)');
        glow.addColorStop(1, 'transparent');
      }
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, TWO_PI);
      ctx.fillStyle = glow;
      ctx.fill();

      // --- Inner bright core ---
      const coreR = 20 + (rec ? avgAmp * 5 : Math.sin(t * 2) * 2);
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      if (rec) {
        core.addColorStop(0, `rgba(239, 68, 68, ${0.22 + avgAmp * 0.18})`);
        core.addColorStop(0.55, 'rgba(239, 68, 68, 0.06)');
        core.addColorStop(1, 'transparent');
      } else {
        core.addColorStop(0, `rgba(59, 130, 246, ${0.14 + Math.sin(t * 2) * 0.04})`);
        core.addColorStop(0.55, 'rgba(59, 130, 246, 0.04)');
        core.addColorStop(1, 'transparent');
      }
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, TWO_PI);
      ctx.fillStyle = core;
      ctx.fill();

      // --- Mic icon ---
      const micAlpha = rec ? (0.75 + avgAmp * 0.25) : 0.55;
      const micColor = rec
        ? `rgba(239, 68, 68, ${micAlpha})`
        : `rgba(59, 130, 246, ${micAlpha})`;
      ctx.fillStyle = micColor;
      ctx.strokeStyle = micColor;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      // Mic capsule
      ctx.beginPath();
      ctx.ellipse(cx, cy - 5, 7.5, 11, 0, 0, TWO_PI);
      ctx.fill();

      // Mic holder arc
      ctx.beginPath();
      ctx.arc(cx, cy - 3, 13.5, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Stand
      ctx.beginPath();
      ctx.moveTo(cx, cy + 10.5);
      ctx.lineTo(cx, cy + 18);
      ctx.stroke();

      // Base
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy + 18);
      ctx.lineTo(cx + 6, cy + 18);
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [mounted]);

  if (!mounted) return <div className="min-h-[600px]" />;

  const avgScore = isRecording
    ? Math.round(displayScores.reduce((a, b) => a + b, 0) / 6)
    : 0;

  return (
    <>
      {/* ======== Ambient Glow Background ======== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-600/10 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-cyan-600/[0.06] rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-violet-500/[0.05] rounded-full blur-[80px] animate-float-reverse" />
        <div className="orb orb-blue w-[500px] h-[500px] top-1/4 -left-24 animate-float-slow opacity-20" />
        <div className="orb orb-cyan w-[400px] h-[400px] bottom-1/4 -right-16 animate-float-reverse opacity-15" />
      </div>

      {/* ======== Tech Grid Overlay ======== */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* ======== Content ======== */}
      <div className="container relative mx-auto px-4">
        {/* --- Section Title --- */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <Mic className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">
              Neural Voice Lab
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Interactive Speaking Assessment
          </h2>
          <p className="mt-3 text-white/40 max-w-2xl mx-auto text-sm md:text-base">
            Experience our AI-powered speaking assessment with real-time neural analysis and feedback
          </p>
        </div>

        {/* --- HUD Status Bar --- */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-2.5">
            {/* Recording state indicator */}
            <div className="flex items-center gap-2">
              {isRecording ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  <span className="text-xs text-red-400 font-bold tracking-widest">REC</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-500/50" />
                  <span className="text-xs text-blue-400/50 font-medium tracking-widest">STANDBY</span>
                </>
              )}
            </div>

            {/* Timer */}
            <div className="font-mono text-sm text-white/60 tracking-[0.2em] tabular-nums">
              {formatTime(recordingTime)}
            </div>

            {/* Audio level bars */}
            <div className="flex items-end gap-[2px] h-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-[3px] rounded-full transition-all duration-100 ${
                    isRecording
                      ? i < 3
                        ? 'bg-green-400/60'
                        : i < 6
                          ? 'bg-amber-400/60'
                          : 'bg-red-400/60'
                      : 'bg-white/15'
                  }`}
                  style={{
                    height: isRecording ? `${4 + Math.sin(Date.now() * 0.01 + i * 1.2) * 6 + 6}px` : '3px',
                    animation: isRecording ? `audio-bar ${0.3 + i * 0.08}s ease-in-out infinite alternate` : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* --- Main 3-Column Layout --- */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-8 max-w-6xl mx-auto">

          {/* ======== LEFT: Prompt Card ======== */}
          <div className="w-full max-w-sm lg:w-64 xl:w-72 order-2 lg:order-1 flex-shrink-0">
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/30 via-violet-500/20 to-cyan-500/30">
              <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-5">
                {/* Level badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wider shadow-[0_0_12px_rgba(59,130,246,0.15)]">
                    B2
                  </div>
                  <span className="text-[11px] text-white/30">Upper Intermediate</span>
                </div>

                {/* Prompt label */}
                <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] mb-2 font-medium">
                  Speaking Prompt
                </p>

                {/* Prompt text with typewriter */}
                <div className="min-h-[72px]">
                  <p className="text-sm text-white/60 italic leading-relaxed">
                    &ldquo;{PROMPT_TEXT.slice(0, typedChars)}
                    {isRecording && typedChars < PROMPT_TEXT.length && (
                      <span className="inline-block w-[2px] h-3.5 bg-blue-400/80 animate-pulse ml-0.5 align-middle" />
                    )}
                    {typedChars >= PROMPT_TEXT.length && '"'}
                  </p>
                  {!isRecording && typedChars >= PROMPT_TEXT.length && (
                    <p className="text-sm text-white/60 italic leading-relaxed">&ldquo;{PROMPT_TEXT}&rdquo;</p>
                  )}
                </div>

                {/* Difficulty selector */}
                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] mb-2 font-medium">
                    Target Level
                  </p>
                  <div className="flex gap-1.5">
                    {['A2', 'B1', 'B2', 'C1'].map((lvl) => (
                      <div
                        key={lvl}
                        className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all duration-300 ${
                          lvl === 'B2'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.1)]'
                            : 'bg-white/[0.03] text-white/25 border border-white/[0.04]'
                        }`}
                      >
                        {lvl}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======== CENTER: Canvas + Mic Button ======== */}
          <div className="order-1 lg:order-2 flex flex-col items-center flex-shrink-0">
            {/* Canvas visualization */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                role="img"
                aria-label="Voice analysis visualization showing microphone orb and audio waveform"
              />
            </div>

            {/* Mic CTA Button */}
            <div className="relative -mt-4">
              {/* Ripple rings when recording */}
              {isRecording && (
                <>
                  <div className="absolute inset-[-14px] rounded-full border-2 border-red-400/20 animate-ripple" />
                  <div
                    className="absolute inset-[-14px] rounded-full border-2 border-red-400/10 animate-ripple"
                    style={{ animationDelay: '0.6s' }}
                  />
                </>
              )}
              {/* Glow backdrop */}
              <div
                className={`absolute -inset-8 rounded-full transition-all duration-500 ${
                  isRecording ? 'bg-red-500/10 blur-2xl' : 'bg-blue-500/10 blur-2xl'
                }`}
              />
              {/* Button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer z-10 ${
                  isRecording
                    ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/40 animate-recording-pulse'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-110 animate-mic-glow'
                }`}
              >
                <Mic className={`h-6 w-6 text-white ${isRecording ? 'animate-pulse' : ''}`} />
              </button>
            </div>

            <p className="text-[11px] text-white/35 mt-3 text-center">
              {isRecording ? 'Tap to stop recording' : 'Tap to start — mic permission required'}
            </p>
          </div>

          {/* ======== RIGHT: Dimension Nodes ======== */}
          <div className="w-full max-w-sm lg:w-64 xl:w-72 order-3 flex-shrink-0">
            <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] mb-3 font-medium text-center lg:text-left">
              Neural Analysis
            </p>
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-2.5">
              {CEFR_DIMENSIONS.map((dim, idx) => {
                const color = DIM_HEX[idx];
                const glow = DIM_GLOW[idx];
                const score = isRecording ? displayScores[idx] : 0;
                const r = 22;
                const circumference = 2 * Math.PI * r;
                const offset = circumference * (1 - score / 100);

                return (
                  <div
                    key={dim.label}
                    className="flex flex-col items-center rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 lg:p-3 transition-all duration-300"
                    style={{
                      animation: `node-float 3s ease-in-out infinite`,
                      animationDelay: `${idx * 0.35}s`,
                      boxShadow: score > 0 ? `0 0 20px ${glow.replace('0.35', '0.08')}` : 'none',
                    }}
                  >
                    {/* Orb with progress ring */}
                    <div className="relative w-11 h-11 lg:w-12 lg:h-12 mb-1.5">
                      {/* SVG progress ring */}
                      <svg
                        className="absolute inset-0 w-full h-full -rotate-90"
                        viewBox="0 0 48 48"
                      >
                        <circle
                          cx="24" cy="24" r={r}
                          fill="none"
                          stroke="rgba(255,255,255,0.04)"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="24" cy="24" r={r}
                          fill="none"
                          stroke={color}
                          strokeWidth="1.5"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          className="transition-all duration-700 ease-out"
                          style={{ opacity: score > 0 ? 0.9 : 0.25 }}
                        />
                      </svg>
                      {/* Inner orb */}
                      <div
                        className="absolute inset-[5px] rounded-full flex items-center justify-center transition-all duration-500"
                        style={{
                          background: `radial-gradient(circle, ${color}35, ${color}12)`,
                          boxShadow: score > 0 ? `0 0 14px ${color}25, inset 0 0 6px ${color}15` : 'none',
                        }}
                      >
                        <span
                          className="text-[11px] lg:text-xs font-bold transition-colors duration-300"
                          style={{ color: score > 0 ? color : `${color}80` }}
                        >
                          {dim.letter}
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] lg:text-[10px] text-white/45 font-medium">
                      {dim.label}
                    </span>
                    {isRecording && score > 0 && (
                      <span
                        className="text-[11px] lg:text-xs font-bold mt-0.5 transition-all duration-300"
                        style={{ color }}
                      >
                        {score}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Average score display */}
            {isRecording && avgScore > 0 && (
              <div className="mt-3 text-center rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 transition-all duration-500">
                <span className="text-[10px] text-white/35 uppercase tracking-[0.15em]">
                  Overall Score
                </span>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent mt-0.5">
                  {avgScore}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Footer Disclaimer --- */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-white/20">
            This is an interactive demo. Full speaking assessment with AI scoring available on Premium plans.
          </p>
        </div>
      </div>
    </>
  );
}
