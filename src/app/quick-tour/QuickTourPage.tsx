"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Sparkles, ArrowRight, ArrowDown, Mic, BookOpen, Users, Target,
  Award, Zap, MessageCircle, Headphones, Play, ChevronRight,
  Star, TrendingUp, Globe, Shield, Clock, Check, Volume2,
  GraduationCap, Heart, Flame, Brain, Compass, Rocket
} from "lucide-react";

/* ───────── Types ───────── */
interface TourStep {
  id: string;
  number: number;
  title: string;
  headline: string;
  description: string;
  icon: React.ReactNode;
  highlightIcon: React.ReactNode;
  features: string[];
  cta: string;
  link: string;
  color: string;
  colorHex: string;
  lexiScript: string;
  duration: string;
}

/* ───────── Tour Steps Data ───────── */
const TOUR_STEPS: TourStep[] = [
  {
    id: "register",
    number: 1,
    title: "Step 1: Join the Community",
    headline: "Create Your Free Account",
    description: "Start your English journey in under 30 seconds. No credit card required. Get instant access to your personalized learning dashboard.",
    icon: <Sparkles size={22} />,
    highlightIcon: <Rocket size={48} />,
    features: ["Free forever plan", "Personalized dashboard", "Progress tracking", "Email-activated security"],
    cta: "Create Free Account",
    link: "/register",
    color: "from-cyan-500 to-blue-600",
    colorHex: "#06b6d4",
    lexiScript: "Welcome! I'm Lexi, your AI English tutor. Creating an account takes just 30 seconds and it's completely free. Once you're in, I'll help you find the perfect learning path based on your goals and current level.",
    duration: "30 seconds",
  },
  {
    id: "assess",
    number: 2,
    title: "Step 2: Discover Your Level",
    headline: "Take the Free CEFR Assessment",
    description: "Our AI-powered test evaluates all 6 skills — Grammar, Vocabulary, Reading, Listening, Speaking, and Writing. Get your precise CEFR level from A1 to C2 with detailed insights.",
    icon: <Target size={22} />,
    highlightIcon: <Brain size={48} />,
    features: ["6-skill comprehensive test", "AI-scored instantly", "Adaptive difficulty", "Detailed skill breakdown"],
    cta: "Start Free Test",
    link: "/test",
    color: "from-purple-500 to-pink-600",
    colorHex: "#a855f7",
    lexiScript: "This is where the magic begins! Our CEFR test covers all six skills — grammar, vocabulary, reading, listening, speaking, and writing. The AI adapts to your level as you go, so don't worry if you're a beginner or advanced. You'll get instant results with a detailed breakdown of your strengths and areas to improve.",
    duration: "15-20 minutes",
  },
  {
    id: "courses",
    number: 3,
    title: "Step 3: Start Learning",
    headline: "Enroll in Structured Courses",
    description: "150+ lessons across 3 levels — Beginner, Intermediate, and Advanced. Each lesson combines AI-narrated content, vocabulary cards, example sentences, and interactive quizzes.",
    icon: <BookOpen size={22} />,
    highlightIcon: <GraduationCap size={48} />,
    features: ["150+ structured lessons", "AI-narrated by Lexi", "10 vocabulary cards per lesson", "Interactive quizzes"],
    cta: "Explore Courses",
    link: "/courses",
    color: "from-emerald-500 to-teal-600",
    colorHex: "#10b981",
    lexiScript: "Based on your test results, I'll recommend the perfect course for you. Each lesson has video content, 10 vocabulary cards with audio pronunciation, example sentences, and a quiz to test what you've learned. I'll even read the lessons aloud for you if you prefer learning by listening!",
    duration: "10 min per lesson",
  },
  {
    id: "speak",
    number: 4,
    title: "Step 4: Practice Speaking",
    headline: "Speak with Lexi, Your AI Partner",
    description: "Practice real conversations with Lexi through 3 modes — Free Chat, Real-Life Scenarios, and Pronunciation Drills. Get instant feedback on fluency, grammar, and pronunciation.",
    icon: <Mic size={22} />,
    highlightIcon: <Headphones size={48} />,
    features: ["Free conversation practice", "8 real-life scenarios", "10 pronunciation drills", "Instant feedback & scoring"],
    cta: "Practice Speaking",
    link: "/ai-tutor",
    color: "from-amber-500 to-orange-600",
    colorHex: "#f59e0b",
    lexiScript: "This is my favorite part! We can practice speaking together. Choose Free Chat for open conversation, pick a scenario like a job interview or ordering at a restaurant, or work on specific pronunciation drills. I'll give you gentle corrections and encouragement along the way.",
    duration: "5-15 minutes",
  },
  {
    id: "community",
    number: 5,
    title: "Step 5: Connect with Others",
    headline: "Join the Global Community",
    description: "Find language partners, join live voice rooms in SpeakSpace, chat in global chatrooms, share moments, and form study groups. Learn together with learners worldwide.",
    icon: <Users size={22} />,
    highlightIcon: <Globe size={48} />,
    features: ["Find language partners", "Live voice rooms", "Global chatrooms", "Study groups & moments"],
    cta: "Join Community",
    link: "/community",
    color: "from-rose-500 to-red-600",
    colorHex: "#f43f5e",
    lexiScript: "You're not alone in this journey! Our community has thousands of learners from around the world. Find a study partner at your level, join live voice rooms to practice speaking, or jump into the global chatroom. You can even share your learning moments and celebrate achievements together.",
    duration: "Anytime",
  },
  {
    id: "certify",
    number: 6,
    title: "Step 6: Get Certified",
    headline: "Earn Your CEFR Certificate",
    description: "Complete courses, pass assessments, and receive QR-verified PDF certificates recognized by employers and institutions worldwide. Share on LinkedIn, include in applications.",
    icon: <Award size={22} />,
    highlightIcon: <Shield size={48} />,
    features: ["QR-verified PDF certificates", "Shareable on LinkedIn", "Employer-recognized", "Course completion badges"],
    cta: "View Sample Certificate",
    link: "/sample-certificate",
    color: "from-indigo-500 to-violet-600",
    colorHex: "#6366f1",
    lexiScript: "All your hard work pays off here! Complete courses and pass assessments to earn QR-verified CEFR certificates. These are recognized by employers and universities worldwide. You can download them as PDFs, share them on LinkedIn, and include them in job applications. Your certificate proves your English level with confidence.",
    duration: "Upon completion",
  },
];

/* ───────── Feature Highlights ───────── */
const FEATURE_HIGHLIGHTS = [
  { icon: <Brain size={20} />, title: "AI-Powered Assessment", desc: "Adaptive testing across 6 CEFR skills with instant results", color: "text-purple-400", glow: "rgba(168,85,247,0.15)" },
  { icon: <Mic size={20} />, title: "Voice-First Practice", desc: "Speak with Lexi — get real-time pronunciation & grammar feedback", color: "text-cyan-400", glow: "rgba(6,182,212,0.15)" },
  { icon: <BookOpen size={20} />, title: "150+ Structured Lessons", desc: "Video lessons, vocabulary, quizzes — Beginner to Advanced", color: "text-emerald-400", glow: "rgba(16,185,129,0.15)" },
  { icon: <Users size={20} />, title: "Global Community", desc: "Language partners, live voice rooms, study groups, chatrooms", color: "text-rose-400", glow: "rgba(244,63,94,0.15)" },
  { icon: <Award size={20} />, title: "Verified Certificates", desc: "QR-verified PDF certificates recognized by employers worldwide", color: "text-amber-400", glow: "rgba(245,158,11,0.15)" },
  { icon: <Shield size={20} />, title: "CEFR Aligned", desc: "All content follows the Common European Framework A1-C2", color: "text-indigo-400", glow: "rgba(99,102,241,0.15)" },
];

/* ───────── Stats (for counter animation) ───────── */
const STATS = [
  { value: 50000, suffix: "+", display: "50K+", label: "Tests Taken" },
  { value: 150, suffix: "+", display: "150+", label: "Lessons" },
  { value: 6, suffix: "", display: "6", label: "Skills Assessed" },
  { value: 0, suffix: "", display: "A1-C2", label: "CEFR Levels", isText: true },
];

/* ───────── Voice Engine ───────── */
function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    utter.voice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Female")) || voices[0];
    utter.rate = 0.9;
    utter.pitch = 1.05;
    utter.volume = 0.8;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, []);
  return { speak, isSpeaking };
}

/* ───────── Scroll Reveal Hook ───────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

/* ───────── Animated Counter Component ───────── */
function AnimatedCounter({ target, suffix, isText, display, label }: { target: number; suffix: string; isText?: boolean; display: string; label: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    if (!isVisible || isText) return;
    const duration = 2000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, target, isText]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        {isText ? display : `${count.toLocaleString()}${suffix}`}
      </div>
      <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

/* ───────── Particle Canvas ───────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    const colors = ["#06b6d4", "#8b5cf6", "#3b82f6", "#10b981"];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      // Draw connection lines
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = 0.04 * (1 - dist / 100);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ───────── Typewriter Effect ───────── */
function TypewriterText({ text, delay = 0, speed = 40 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="animate-pulse text-cyan-400">|</span>
      )}
    </span>
  );
}

/* ───────── 3D Tilt Card Wrapper ───────── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -4;
    const rotateY = (x - centerX) / centerX * 4;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-200 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ───────── SVG Connector Between Steps ───────── */
function StepConnector({ color, isVisible }: { color: string; isVisible: boolean }) {
  return (
    <div className="flex flex-col items-center py-2">
      <svg width="40" height="60" viewBox="0 0 40 60" className="overflow-visible">
        <line
          x1="20" y1="0" x2="20" y2="60"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset={isVisible ? "0" : "60"}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
          opacity={0.3}
        />
        <circle cx="20" cy="30" r="3" fill={color} opacity={isVisible ? 0.5 : 0} style={{ transition: "opacity 0.8s ease-out 0.5s" }} />
      </svg>
    </div>
  );
}

/* ───────── Shimmer Border Effect ───────── */
function ShimmerBorder({ children, isActive, color, className = "" }: { children: React.ReactNode; isActive: boolean; color: string; className?: string }) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    let animId: number;
    const animate = () => {
      setAngle(prev => (prev + 1) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isActive]);

  return (
    <div className={`relative ${className}`}>
      {isActive && (
        <div
          className="absolute -inset-[1px] rounded-3xl overflow-hidden"
          style={{
            background: `conic-gradient(from ${angle}deg, transparent 0%, ${color}33 10%, transparent 20%)`,
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   QUICK TOUR PAGE — CINEMATIC EDITION
   ═══════════════════════════════════════════ */
export default function QuickTourPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [lexiOpen, setLexiOpen] = useState(true);
  const [lexiMessage, setLexiMessage] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const [heroVisible, setHeroVisible] = useState(false);
  const { speak, isSpeaking } = useVoice();
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasGreeted = useRef(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  /* Hero entrance */
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  /* Scroll progress */
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(window.scrollY / total);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Intersection Observer for step reveals */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-step"));
            setVisibleSteps(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    stepRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  /* Features visibility */
  useEffect(() => {
    const el = featuresRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFeaturesVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Lexi opening message — only once */
  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    const msg = "Hi there! I'm Lexi, your personal guide. I'll walk you through everything TestCEFR has to offer. Click any step to have me explain it, or just scroll through the journey. Let's get started!";
    setLexiMessage(msg);
    const t = setTimeout(() => speak(msg), 1500);
    return () => clearTimeout(t);
  }, [speak]);

  /* Handle step click with Lexi */
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    const step = TOUR_STEPS[index];
    setLexiMessage(step.lexiScript);
    speak(step.lexiScript);
    stepRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  /* Scroll to step */
  const scrollToStep = (index: number) => {
    stepRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white overflow-x-hidden flex flex-col">
      <Navbar />

      {/* ═══ Scroll Progress Bar ═══ */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${scrollProgress * 100}%`,
            background: "linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)",
            backgroundSize: "200% 100%",
            animation: "shimmerBar 3s linear infinite",
          }}
        />
      </div>

      {/* ═══ Side Step Navigator ═══ */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
        {TOUR_STEPS.map((step, i) => (
          <button
            key={i}
            onClick={() => handleStepClick(i)}
            className="group relative flex items-center"
            title={step.headline}
          >
            {/* Tooltip */}
            <span className="absolute left-8 px-3 py-1.5 bg-[#1a1a3a] border border-white/10 rounded-lg text-xs text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              {step.headline}
            </span>
            {/* Dot */}
            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
              activeStep === i
                ? "border-cyan-400 bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/50"
                : visibleSteps.has(i)
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-transparent"
            }`} />
            {/* Connector */}
            {i < TOUR_STEPS.length - 1 && (
              <div className="absolute top-3 left-[5px] w-[2px] h-6 bg-white/5">
                <div
                  className="w-full bg-cyan-400/30 transition-all duration-1000"
                  style={{ height: visibleSteps.has(i) ? "100%" : "0%" }}
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-28 pb-20 overflow-hidden">
        {/* Particle canvas background */}
        <ParticleField />

        {/* Background orbs with parallax */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[150px]"
            style={{ transform: `translateY(${scrollProgress * -50}px)`, transition: "transform 0.3s ease-out" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[150px]"
            style={{ transform: `translateY(${scrollProgress * -30}px)`, transition: "transform 0.3s ease-out" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[180px]"
            style={{ transform: `translate(-50%, calc(-50% + ${scrollProgress * -40}px))`, transition: "transform 0.3s ease-out" }}
          />
        </div>

        {/* Badge — entrance animation */}
        <div className={`relative mb-8 transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-500 group cursor-default">
            <Compass size={16} className="text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
            <span className="text-sm text-cyan-400 font-medium">Your Learning Journey</span>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Headline — typewriter + gradient animation */}
        <h1 className={`relative text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-6 leading-tight transition-all duration-1000 delay-200 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="block bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
            <TypewriterText text="From First Word" delay={600} speed={50} />
          </span>
          <span className="block mt-2 bg-clip-text text-transparent animated-gradient-text">
            to Fluent Speaker
          </span>
        </h1>

        <p className={`relative text-lg md:text-xl text-white/50 text-center max-w-2xl mb-12 leading-relaxed transition-all duration-1000 delay-500 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          Your complete path to English mastery — AI assessment, structured courses,
          voice practice with Lexi, and a global community. All in one platform.
        </p>

        {/* Stats — with animated counters */}
        <div className={`relative flex flex-wrap justify-center gap-8 md:gap-16 mb-14 transition-all duration-1000 delay-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {STATS.map((stat, i) => (
            <div key={i} className="text-center group">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} display={stat.display} isText={stat.isText} label={stat.label} />
            </div>
          ))}
        </div>

        {/* CTA Buttons — with magnetic hover */}
        <div className={`relative flex flex-wrap justify-center gap-4 mb-16 transition-all duration-1000 delay-[900ms] ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Link href="/register" className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/50 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Rocket size={20} className="relative group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            <span className="relative">Start Your Journey — Free</span>
            <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
          </Link>
          <button onClick={() => scrollToStep(0)} className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white/80 font-medium rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
            <Play size={18} className="hover:scale-110 transition-transform" />
            Explore the Path
          </button>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-[1200ms] ${heroVisible ? "opacity-100" : "opacity-0"}`}>
          <button onClick={() => scrollToStep(0)} className="flex flex-col items-center gap-2 text-white/20 hover:text-white/40 transition-colors group">
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <ArrowDown size={20} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* ═══ FEATURE HIGHLIGHTS GRID ═══ */}
      <section ref={featuresRef} className="relative px-4 py-20 max-w-6xl mx-auto">
        <div className={`text-center mb-14 transition-all duration-1000 ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything You Need to Master English</h2>
          <p className="text-white/40">One platform. Every skill. From assessment to certification.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURE_HIGHLIGHTS.map((f, i) => (
            <TiltCard key={i}>
              <div
                onMouseEnter={() => { setHoveredFeature(i); speak(`${f.title}. ${f.desc}`); }}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`relative p-6 bg-white/[0.02] border rounded-2xl transition-all duration-500 cursor-pointer group overflow-hidden ${
                  featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${hoveredFeature === i ? "border-cyan-500/30 scale-[1.02]" : "border-white/5 hover:border-white/10"}`}
                style={{ transitionDelay: featuresVisible ? `${i * 100}ms` : "0ms" }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${f.glow}, transparent 70%)` }}
                />
                <div className={`relative mb-3 ${f.color} group-hover:scale-110 transition-transform duration-300`}>{f.icon}</div>
                <h3 className="relative text-sm font-semibold text-white/90 mb-1">{f.title}</h3>
                <p className="relative text-xs text-white/40 leading-relaxed">{f.desc}</p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} className="text-white/20 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ═══ MAIN JOURNEY STEPS ═══ */}
      <section className="relative px-4 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
            <Flame size={14} className="text-cyan-400" />
            <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Your 6-Step Journey</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How TestCEFR Works</h2>
          <p className="text-white/40 max-w-xl mx-auto">Follow this proven path from registration to certification. Click any step to have Lexi explain it.</p>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {TOUR_STEPS.map((step, index) => {
            const isRevealed = visibleSteps.has(index);
            const isActive = activeStep === index;

            return (
              <div key={step.id} ref={el => { stepRefs.current[index] = el; }} data-step={index}>
                {/* Animated SVG connector */}
                {index > 0 && (
                  <StepConnector color={step.colorHex} isVisible={isRevealed} />
                )}

                <div
                  onClick={() => handleStepClick(index)}
                  className={`relative group cursor-pointer transition-all duration-700 ease-out ${
                    isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  } ${isActive ? "scale-[1.01]" : "hover:scale-[1.005]"}`}
                >
                  <ShimmerBorder isActive={isActive} color={step.colorHex}>
                    <div className={`relative bg-gradient-to-br from-[#1a1a3a] to-[#0c0c24] border rounded-3xl overflow-hidden transition-all duration-500 ${
                      isActive ? "border-cyan-500/30" : "border-white/5 hover:border-white/15"
                    }`}>
                      {/* Top gradient bar — animated width */}
                      <div className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${step.color} transition-all duration-1000 ease-out ${
                        isRevealed ? "w-full" : "w-0"
                      }`} />

                      <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Left: Number + Icon */}
                          <div className="flex md:flex-col items-center md:items-start gap-4 shrink-0">
                            <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg transition-all duration-500 ${
                              isRevealed ? "scale-100 opacity-100" : "scale-0 opacity-0"
                            }`} style={{ transitionDelay: "200ms" }}>
                              {isSpeaking && isActive ? (
                                <div className="flex items-end gap-[3px]">
                                  {[0, 1, 2, 3, 4].map(bar => (
                                    <span
                                      key={bar}
                                      className="w-[3px] bg-white/80 rounded-full"
                                      style={{
                                        height: `${8 + Math.sin(Date.now() / 150 + bar) * 8}px`,
                                        animation: "soundWave 0.5s ease-in-out infinite alternate",
                                        animationDelay: `${bar * 80}ms`,
                                      }}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <span className="text-2xl font-bold">{step.number}</span>
                              )}
                              {/* Pulse ring on reveal */}
                              {isRevealed && !isActive && (
                                <div className="absolute inset-0 rounded-2xl bg-white/10 animate-ping" style={{ animationDuration: "2s" }} />
                              )}
                            </div>
                            <div className="hidden md:flex flex-col items-center gap-1">
                              <Clock size={12} className="text-white/20" />
                              <span className="text-[10px] text-white/30">{step.duration}</span>
                            </div>
                          </div>

                          {/* Center: Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs text-white/30 uppercase tracking-wider">{step.title}</span>
                              <span className="md:hidden text-[10px] text-white/20 flex items-center gap-1"><Clock size={10} />{step.duration}</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-cyan-300 transition-colors duration-300">{step.headline}</h3>
                            <p className="text-sm text-white/50 leading-relaxed mb-4">{step.description}</p>

                            {/* Features — stagger reveal */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {step.features.map((f, fi) => (
                                <span
                                  key={fi}
                                  className={`flex items-center gap-1.5 text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-full border border-transparent hover:border-white/10 transition-all duration-500 ${
                                    isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                                  }`}
                                  style={{ transitionDelay: isRevealed ? `${300 + fi * 100}ms` : "0ms" }}
                                >
                                  <Check size={10} className="text-cyan-400/60" />
                                  {f}
                                </span>
                              ))}
                            </div>

                            {/* Lexi quote (when active) — with animation */}
                            {isActive && lexiMessage && (
                              <div className="mt-4 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl animate-slideUpFadeIn">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/30 shrink-0 relative">
                                    <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
                                    {isSpeaking && (
                                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-purple-500 rounded-full border-2 border-[#1a1a3a] animate-pulse" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs text-cyan-400 font-medium mb-1">Lexi says:</p>
                                    <p className="text-sm text-white/70 leading-relaxed italic">&ldquo;{lexiMessage}&rdquo;</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* CTA — with hover animation */}
                            <Link href={step.link} className={`group/btn inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r ${step.color} text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                              {step.cta}
                              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>

                          {/* Right: Big icon — with float animation */}
                          <div className="hidden lg:flex items-center justify-center w-32 shrink-0">
                            <div className={`text-white/10 group-hover:text-white/20 transition-all duration-500 ${
                              isActive ? "scale-110 text-white/25" : ""
                            } ${isRevealed ? "animate-floatIcon" : ""}`}>
                              {step.highlightIcon}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ShimmerBorder>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ LEXI TOUR GUIDE (Floating) ═══ */}
      {lexiOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] animate-slideInRight">
          <div className="relative bg-gradient-to-b from-[#14143a] to-[#0c0c24] border border-cyan-500/20 rounded-3xl shadow-2xl overflow-hidden" style={{ boxShadow: "0 0 60px rgba(6, 182, 212, 0.12)" }}>
            {/* Animated top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-cyan-500/30">
                  <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
                  {isSpeaking && (
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" style={{ animationDuration: "1.5s" }} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Lexi</p>
                  <p className="text-[10px] text-cyan-400/60 flex items-center gap-1">
                    {isSpeaking ? (
                      <>
                        <span className="flex gap-[2px]">
                          {[1,2,3].map(b => (
                            <span key={b} className="w-[2px] h-2 bg-cyan-400 rounded-full animate-soundBar" style={{ animationDelay: `${b * 0.1}s` }} />
                          ))}
                        </span>
                        Speaking...
                      </>
                    ) : (
                      "Your Tour Guide"
                    )}
                  </p>
                </div>
              </div>
              <button onClick={() => setLexiOpen(false)} className="p-2 rounded-lg text-white/20 hover:text-white/40 hover:bg-white/5 transition-all hover:rotate-90 duration-300">
                <span className="text-xs">&#x2715;</span>
              </button>
            </div>

            {/* Message */}
            <div className="px-5 py-4">
              <p className="text-sm text-white/70 leading-relaxed mb-4">{lexiMessage}</p>

              {/* Quick step buttons */}
              <div className="space-y-2">
                <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-2">Jump to Step</p>
                <div className="grid grid-cols-3 gap-2">
                  {TOUR_STEPS.map((step, i) => (
                    <button key={i} onClick={() => handleStepClick(i)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all duration-300 ${
                        activeStep === i
                          ? "bg-cyan-500/15 border border-cyan-500/30 scale-105 shadow-md shadow-cyan-500/10"
                          : "bg-white/5 border border-transparent hover:bg-white/10 hover:scale-105"
                      }`}>
                      <span className="text-xs font-bold text-cyan-400">{step.number}</span>
                      <span className="text-[10px] text-white/50 truncate w-full">{step.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Replay button */}
              <button onClick={() => speak(lexiMessage)} className="mt-3 flex items-center gap-2 text-xs text-cyan-400/50 hover:text-cyan-400 transition-colors group">
                <Volume2 size={12} className="group-hover:scale-110 transition-transform" />
                {isSpeaking ? "Speaking..." : "Listen again"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lexi minimized pill (when closed) */}
      {!lexiOpen && (
        <button onClick={() => setLexiOpen(true)} className="fixed bottom-6 right-6 z-50 group animate-bounceIn">
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
          <div className="relative flex items-center gap-2 pl-2 pr-4 py-2 bg-gradient-to-r from-[#14143a] to-[#1a1a4a] border border-cyan-500/30 rounded-full shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-cyan-500/20">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-500/30">
              <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-medium text-white/80">Tour Guide</span>
          </div>
        </button>
      )}

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative px-4 py-24 max-w-4xl mx-auto text-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          {/* Rotating glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full animate-rotateGlow opacity-30"
            style={{ background: "conic-gradient(from 0deg, transparent, rgba(6,182,212,0.1), transparent, rgba(139,92,246,0.1), transparent)" }}
          />
        </div>
        <div className="relative">
          {/* Rocket icon with floating animation */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20 animate-floatIcon">
            <Rocket size={36} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/40 mb-8 max-w-lg mx-auto">
            Join 50,000+ learners who&apos;ve discovered their English level and improved with TestCEFR.
            It&apos;s free to start.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/50 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles size={20} className="relative" />
              <span className="relative">Create Free Account</span>
              <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/test" className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white/80 font-medium rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <Target size={18} />
              Take the Test First
            </Link>
          </div>
          <p className="text-xs text-white/20 mt-4">No credit card required · Free CEFR assessment · Instant results</p>
        </div>
      </section>

      <Footer />

      {/* ═══ CSS ANIMATIONS ═══ */}
      <style>{`
        /* Gradient text animation */
        .animated-gradient-text {
          background: linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 4s ease infinite;
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* Float animation for icons */
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-floatIcon { animation: floatIcon 3s ease-in-out infinite; }

        /* Shimmer for progress bar */
        @keyframes shimmerBar {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }

        /* Slide up + fade in for Lexi quote */
        @keyframes slideUpFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUpFadeIn { animation: slideUpFadeIn 0.4s ease-out; }

        /* Slide in from right for Lexi panel */
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.5s ease-out; }

        /* Bounce in for Lexi pill */
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.5); }
          50% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounceIn { animation: bounceIn 0.4s ease-out; }

        /* Sound wave for Lexi speaking */
        @keyframes soundWave {
          0%, 100% { height: 6px; }
          50% { height: 16px; }
        }

        /* Sound bar for Lexi indicator */
        @keyframes soundBar {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.5); }
        }
        .animate-soundBar { animation: soundBar 0.6s ease-in-out infinite; }

        /* Rotating glow for CTA */
        @keyframes rotateGlow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-rotateGlow { animation: rotateGlow 8s linear infinite; }

        /* Float for particles */
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-15px); opacity: 0.6; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }

        /* Shimmer for Lexi border */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% 100%; }
      `}</style>
    </div>
  );
}
