'use client';

import Link from 'next/link';
import React, { Suspense } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import dynamic from 'next/dynamic';
// Lazy-load footer — below the fold, saves ~4KB of initial JS
const Footer = dynamic(() => import('@/components/footer').then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-40" />,
});
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
import { useEffect, useRef, useState } from 'react';
import { useHydrated } from '@/hooks/use-hydrated';
import { trackPricingView } from '@/lib/analytics';
import { AnimatedSection } from '@/components/home/animated-section';
import { BackgroundOrbs } from '@/components/home/background-orbs';
import { CEFR_LEVEL_COLORS, CEFR_LEVEL_DESCS } from '@/components/home/constants';
import { AnimatedPillars } from '@/components/home/animated-pillars';
import { TypewriterBadge } from '@/components/home/typewriter-badge';
import { LazySection } from '@/components/lazy-section';

// Lazy-load below-fold heavy components to reduce Total Blocking Time
const LiveVoiceDemo = React.lazy(() => import('@/components/home/live-voice-demo'));
const InteractiveCEFRLevels = React.lazy(() => import('@/components/home/interactive-cefr-levels'));

/* ======================================================
   ANIMATED CEFR BADGE — Holographic Orbital Display
   ====================================================== */
function AnimatedCEFRBadge() {
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
            background: i % 2 === 0 ? activeColor : '#8B5CF6',
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
    gradient: 'from-blue-500 to-indigo-500',
    items: ['Cohesion and coherence', 'Grammatical accuracy', 'Lexical resource', 'Task achievement', 'Writing mechanics'],
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: 'Listening',
    level: 'A1–C2',
    gradient: 'from-sky-500 to-blue-500',
    items: ['Main ideas and details', 'Understanding speakers\' attitude', 'Following complex arguments', 'Multiple speaker comprehension', 'Accent familiarity'],
  },
  {
    icon: <Mic className="h-6 w-6" />,
    title: 'Speaking',
    level: 'A1–C2',
    gradient: 'from-blue-500 to-cyan-500',
    items: ['Fluency and coherence', 'Lexical resource', 'Grammatical range', 'Pronunciation clarity', 'Interactive communication'],
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Grammar',
    level: 'A1–C2',
    gradient: 'from-indigo-500 to-blue-600',
    items: ['Sentence formation', 'Tense accuracy', 'Complex structures', 'Error patterns', 'Grammar application'],
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Vocabulary',
    level: 'A1–C2',
    gradient: 'from-indigo-400 to-blue-500',
    items: ['Word range', 'Precision', 'Collocations', 'Register awareness', 'Topic-specific vocabulary'],
  },
];

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
    ctaLink: '/courses',
    popular: false,
  },
  {
    name: 'Premium Pack',
    desc: '3 tests — best value for learners',
    price: '$29.99',
    priceNum: 29.99,
    features: ['3 full assessments', 'Progress tracking dashboard', 'Priority AI analysis', 'Unlimited certificate downloads', 'Email support'],
    cta: 'Get Premium',
    ctaLink: '/courses',
    popular: true,
  },
  {
    name: 'Pro Pack',
    desc: '6 tests — complete learning solution',
    price: '$49.99',
    priceNum: 49.99,
    features: ['6 assessments', 'Full analytics suite', 'Detailed skill improvement tips', 'Comparison with peers', 'Priority support'],
    cta: 'Go Pro',
    ctaLink: '/courses',
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
    color: 'from-blue-500 to-cyan-500',
  },
  {
    quote: 'I use CEFR Test with my students to track their progress. The CEFR alignment is accurate, and the comprehensive reports help me tailor my lessons effectively.',
    name: 'Yuki Tanaka',
    role: 'English Teacher',
    location: 'Tokyo',
    progress: 'B2 → C2',
    initials: 'Y',
    color: 'from-sky-500 to-blue-500',
  },
  {
    quote: 'We assessed over 800 students in a single semester. The bulk import and CSV export saved our department dozens of hours.',
    name: 'Dr. Laura Pham',
    role: 'Head of Language Dept, Hanoi University',
    location: 'Hanoi',
    progress: 'B2 → C1',
    initials: 'L',
    color: 'from-blue-500 to-indigo-500',
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
    color: 'from-sky-500 to-blue-500',
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
    color: 'from-indigo-500 to-blue-600',
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
    answer: 'During our preview period, all features and assessments are completely free. No payment information is required — just sign up and start learning!',
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
        <span className="text-base font-medium text-white group-hover:text-blue-300 transition-colors pr-4">{question}</span>
        <ChevronDown className={`h-5 w-5 text-blue-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
  const pricingSectionRef = useRef<HTMLElement>(null);
  const pricingViewTracked = useRef(false);

  // Track pricing_view when the pricing section scrolls into view
  useEffect(() => {
    const el = pricingSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pricingViewTracked.current) {
          pricingViewTracked.current = true;
          trackPricingView();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isAuth = mounted && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <main>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden dark-section hero-pattern noise-overlay mesh-gradient">
        <BackgroundOrbs />

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            {/* Typewriter badge */}
            <TypewriterBadge />

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up text-center">
              Master English with AI
            </h1>

            {/* Animated Three Pillars */}
            <div className="mt-4 flex justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <AnimatedPillars />
            </div>

            {/* Subheadline */}
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300 text-center">
              The all-in-one platform to assess your CEFR level, follow structured courses from A1 to C2, and practice with language partners worldwide — powered by AI at every step.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-scale-in delay-500">
              <Link href={isAuth ? '/dashboard' : '/register'}>
                <button className="group flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer w-full sm:w-auto">
                  Start Free Assessment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/courses">
                <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer w-full sm:w-auto">
                  Browse Courses
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
                    <div className="flex justify-center mb-2 text-blue-400 group-hover:text-blue-300 transition-colors">
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
      <section className="relative py-20 md:py-28 speaking-bg-5 overflow-hidden">
        <Suspense fallback={<div className="min-h-[600px]" />}>
          <LiveVoiceDemo />
        </Suspense>
      </section>

      {/* ===== 6 DIMENSIONS OF ENGLISH PROFICIENCY ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[400px] h-[400px] top-1/4 right-0 animate-float-slow" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Comprehensive Coverage</span>
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
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
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
      <section id="cefr-levels" className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
        <Suspense fallback={<div className="min-h-[500px]" />}>
          <InteractiveCEFRLevels />
        </Suspense>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-cyan w-[400px] h-[400px] bottom-0 left-0 animate-float-slow" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <ClipboardCheck className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Simple Process</span>
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
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 text-blue-400 group-hover:border-blue-500/40 transition-all duration-300">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-lg">
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
      <LazySection placeholderHeight={600} className="contents">
      <section ref={pricingSectionRef} className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay" id="pricing">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <CreditCard className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Get Started</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Start Learning <span className="gradient-text-static">Today</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Start free and upgrade as you grow. All plans include our AI-powered scoring engine.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {INDIVIDUAL_PLANS.map((plan, index) => (
              <AnimatedSection key={plan.name} delay={index * 100}>
                <div className={`relative glass-card p-6 h-full flex flex-col ${plan.popular ? 'ring-2 ring-blue-500/50' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
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
                        <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.ctaLink} className="mt-6 block">
                    <button className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5'
                        : plan.price === '$0'
                          ? 'glass-button text-white'
                          : 'glass-button text-white hover:bg-blue-500/20'
                    }`}>
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/courses" className="group inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Browse Courses
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
      </LazySection>

      {/* ===== FOR ORGANIZATIONS ===== */}
      <LazySection placeholderHeight={500} className="contents">
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[500px] h-[500px] top-0 right-0 animate-float-slow" />
          <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Building2 className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">For Organizations</span>
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
                <div className={`relative glass-card p-6 h-full flex flex-col ${plan.popular ? 'ring-2 ring-blue-500/50' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
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
                        <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-white/30 mt-4">Best for: {plan.bestFor}</p>
                  <Link href={plan.ctaLink} className="mt-4 block">
                    <button className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5'
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
                <Star className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Success Stories</span>
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
                      <span className="text-xs font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{testimonial.progress}</span>
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
                <Building2 className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Enterprise</span>
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
                  <div className="flex justify-center mb-2 text-blue-400">{stat.icon}</div>
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
      </LazySection>

      {/* ===== FAQ SECTION ===== */}
      <LazySection placeholderHeight={500} className="contents">
      <section className="relative py-20 md:py-28 dark-section-alt overflow-hidden">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">FAQ</span>
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
          <div className="orb orb-blue w-[600px] h-[600px] top-1/4 left-1/4 animate-float-slow" />
          <div className="orb orb-cyan w-[400px] h-[400px] bottom-1/4 right-1/4 animate-float-reverse" />
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
                  <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                    Get Started Free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link href="/courses">
                  <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer">
                    Browse Courses
                  </button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      </LazySection>

      {/* ===== FOOTER ===== */}
      </main>
      <Footer />
    </div>
  );
}
