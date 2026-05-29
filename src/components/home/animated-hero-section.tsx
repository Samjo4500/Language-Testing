'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Award, BookOpen, Radio, Shield, CheckCircle2, Globe, Users, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';

/* ======================================================
   ANIMATED COUNTER — counts up from 0 on mount
   ====================================================== */
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Start after a small delay for visual impact
    const timer = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  const format = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
    return n.toString();
  };

  return <span ref={ref}>{format(count)}{suffix}</span>;
}

/* ======================================================
   PARTICLE NETWORK — Canvas animation
   ====================================================== */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#6366f1', '#a855f7'];
    const count = 80;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initParticles(rect.width, rect.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', () => {
      mouseRef.current = { x: -1000, y: -1000 };
    });

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const connectionDist = 120;
      const mouseDist = 150;

      // Update & draw particles
      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseDist && dist > 0) {
          const force = (mouseDist - dist) / mouseDist * 0.8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = (1 - dist / connectionDist) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('mouseleave', () => {});
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 1 }}
    />
  );
}

/* ======================================================
   3D HOLOGRAPHIC GLOBE — Canvas animation
   ====================================================== */
function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 280;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = 100;

    // Generate dots on sphere surface
    const dots: { theta: number; phi: number }[] = [];
    for (let i = 0; i < 30; i++) {
      dots.push({
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos(2 * Math.random() - 1),
      });
    }

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      time += 0.008;

      // Soft glow behind globe
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.3);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.03)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Globe outline
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Horizontal rings (latitude lines)
      for (let i = 1; i < 5; i++) {
        const ringRadius = radius * Math.sin((i / 5) * Math.PI);
        const ringY = cy - radius * Math.cos((i / 5) * Math.PI);
        ctx.beginPath();
        ctx.ellipse(cx, ringY, ringRadius, ringRadius * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Vertical rotating rings
      for (let r = 0; r < 3; r++) {
        const angle = time * (0.5 + r * 0.3) + (r * Math.PI) / 3;
        const rx = Math.abs(Math.cos(angle)) * radius;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, radius, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 - r * 0.03})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Dots on sphere
      for (const dot of dots) {
        const x = cx + radius * Math.sin(dot.phi) * Math.cos(dot.theta + time * 0.3);
        const y = cy - radius * Math.cos(dot.phi);
        const z = radius * Math.sin(dot.phi) * Math.sin(dot.theta + time * 0.3);
        const alpha = (z + radius) / (2 * radius); // depth-based alpha

        if (alpha > 0.1) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.8})`;
          ctx.fill();

          // Glow around dot
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.15})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="relative"
      style={{ width: 280, height: 280 }}
    />
  );
}

/* ======================================================
   PILLAR CARD DATA
   ====================================================== */
const PILLARS = [
  {
    icon: Award,
    title: 'CEFR Assessment',
    description: 'AI-powered testing across all 6 core skills with internationally aligned results',
    gradient: 'from-blue-500/10 to-blue-600/5',
    iconGradient: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-400',
    borderColor: 'hover:border-blue-500/30',
    href: '/test',
    cta: 'Take Free Test',
    delay: 0,
  },
  {
    icon: BookOpen,
    title: 'English Courses',
    description: 'Structured lessons from A1 to C2 with grammar, vocabulary, and practice exercises',
    gradient: 'from-violet-500/10 to-violet-600/5',
    iconGradient: 'from-violet-500/20 to-violet-600/20',
    iconColor: 'text-violet-400',
    borderColor: 'hover:border-violet-500/30',
    href: '/courses',
    cta: 'Browse Courses',
    delay: 150,
  },
  {
    icon: Radio,
    title: 'SpeakSpace Community',
    description: 'Live voice rooms to practice speaking with learners worldwide in real-time',
    gradient: 'from-emerald-500/10 to-cyan-500/5',
    iconGradient: 'from-emerald-500/20 to-cyan-500/20',
    iconColor: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/30',
    href: '/speakspace',
    cta: 'Join SpeakSpace',
    delay: 300,
  },
];

/* ======================================================
   COUNTRY FLAGS DATA
   ====================================================== */
const COUNTRIES = [
  { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇦🇪', name: 'UAE' },
  { flag: '🇪🇬', name: 'Egypt' },
  { flag: '🇯🇴', name: 'Jordan' },
  { flag: '🇹🇷', name: 'Turkey' },
  { flag: '🇯🇵', name: 'Japan' },
  { flag: '🇧🇷', name: 'Brazil' },
  { flag: '🇻🇳', name: 'Vietnam' },
  { flag: '🇲🇽', name: 'Mexico' },
  { flag: '🇩🇪', name: 'Germany' },
];

/* ======================================================
   ANIMATED HERO SECTION — Main Component
   ====================================================== */
export function AnimatedHeroSection() {
  const { isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const isAuth = mounted && isAuthenticated;
  const [visible, setVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);

    // Trigger entrance animation
    const t = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(t);
      mq.removeEventListener('change', handler);
    };
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center" style={{ background: '#06051A' }}>
      {/* ── Gradient Orbs (floating background) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: '-10%',
          left: '-5%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          bottom: '-10%',
          right: '-5%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float-reverse 10s ease-in-out infinite',
          zIndex: 0,
        }}
      />

      {/* ── Particle Network (Canvas) ── */}
      {!prefersReducedMotion && <ParticleCanvas />}

      {/* ── Content ── */}
      <div className="container relative mx-auto px-4 py-20 md:py-28" style={{ zIndex: 2 }}>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Left: Text + CTAs ── */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            {/* ── AI-Powered Badge ── */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-5 py-2 mb-6 transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              <span className="text-sm text-blue-300 font-medium tracking-wide">
                AI-Powered English Certification
              </span>
            </div>

            {/* ── Headline: "Test. Learn. Connect." ── */}
            <h1
              className={`font-extrabold tracking-tight text-white leading-[1.05] transition-all duration-700 delay-100 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              }}
            >
              Test.{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Learn.
              </span>{' '}
              Connect.
            </h1>

            {/* ── Subheadline ── */}
            <p
              className={`mt-5 text-lg md:text-xl text-white/50 leading-relaxed max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-200 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              The all-in-one platform for English proficiency. Take your CEFR assessment, learn with AI-powered courses, and practice speaking in live voice rooms.
            </p>

            {/* ── CTAs: Two buttons ── */}
            <div
              className={`mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start transition-all duration-700 delay-300 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Link href={isAuth ? '/dashboard' : '/register'}>
                <button className="group cta-shimmer-btn inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                  <span className="relative z-10 flex items-center gap-2">
                    Take Free CEFR Test
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
              <Link href="/speakspace">
                <button className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white font-medium text-base transition-all duration-300 cursor-pointer">
                  <Radio className="h-4 w-4 text-emerald-400" />
                  Join SpeakSpace
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </button>
              </Link>
            </div>

            {/* ── Animated Counters ── */}
            <div
              className={`mt-10 flex items-center gap-8 justify-center lg:justify-start transition-all duration-700 delay-[400ms] ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  <AnimatedCounter target={50000} suffix="+" />
                </div>
                <div className="text-xs text-white/30 mt-0.5">Tests Taken</div>
              </div>
              <div className="w-px h-8 bg-white/[0.06]" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  <AnimatedCounter target={150} suffix="+" />
                </div>
                <div className="text-xs text-white/30 mt-0.5">Lessons</div>
              </div>
              <div className="w-px h-8 bg-white/[0.06]" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  <AnimatedCounter target={12000} suffix="+" />
                </div>
                <div className="text-xs text-white/30 mt-0.5">Members</div>
              </div>
            </div>

            {/* ── Country flags row ── */}
            <div
              className={`mt-6 flex items-center gap-3 justify-center lg:justify-start transition-all duration-700 delay-[500ms] ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Globe className="h-4 w-4 text-white/20 shrink-0" />
              <div className="flex items-center gap-1.5 overflow-hidden">
                {COUNTRIES.map((country, i) => (
                  <span
                    key={country.name}
                    className="text-lg hover:scale-125 transition-transform cursor-default"
                    title={country.name}
                    style={{
                      transitionDelay: visible ? `${600 + i * 50}ms` : '0ms',
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'scale(1)' : 'scale(0.5)',
                    }}
                  >
                    {country.flag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-white/20">80+ countries</span>
            </div>
          </div>

          {/* ── Right: Globe + 3D Pillar Cards ── */}
          <div className="flex-1 max-w-xl w-full relative">
            {/* Globe Canvas (behind cards) */}
            <div
              className={`absolute -top-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-200 ${
                visible ? 'opacity-60 scale-100' : 'opacity-0 scale-75'
              }`}
              style={{ zIndex: 0 }}
            >
              {!prefersReducedMotion && <GlobeCanvas />}
            </div>

            {/* 3 Staggered Pillar Cards */}
            <div className="relative space-y-4 pt-20 lg:pt-16" style={{ zIndex: 1 }}>
              {PILLARS.map((pillar, index) => (
                <Link key={pillar.title} href={pillar.href}>
                  <div
                    className={`group relative rounded-2xl border border-white/[0.06] ${pillar.borderColor} bg-gradient-to-r ${pillar.gradient} backdrop-blur-xl p-5 transition-all duration-500 hover:bg-white/[0.04] cursor-pointer`}
                    style={{
                      transform: visible
                        ? 'perspective(800px) rotateY(0deg) translateX(0)'
                        : `perspective(800px) rotateY(-8deg) translateX(40px)`,
                      opacity: visible ? 1 : 0,
                      transitionDelay: visible ? `${400 + pillar.delay}ms` : '0ms',
                      transitionProperty: 'transform, opacity, border-color, background',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.iconGradient} transition-transform duration-300 group-hover:scale-110`}>
                        <pillar.icon className={`h-5 w-5 ${pillar.iconColor}`} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white group-hover:text-white transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors mt-0.5">
                          {pillar.description}
                        </p>
                      </div>

                      {/* CTA Arrow */}
                      <div className="flex items-center gap-2 text-white/30 group-hover:text-white/60 transition-colors shrink-0">
                        <span className="text-sm font-medium hidden sm:inline">{pillar.cta}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Hover glow bar */}
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/30 transition-all duration-500" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" style={{ zIndex: 3 }} />
    </section>
  );
}

export default AnimatedHeroSection;
