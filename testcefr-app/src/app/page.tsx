'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import {
  Sparkles, Award, Clock, BarChart3, Shield, Globe,
  CheckCircle2, QrCode, Headphones, Mic, PenTool,
  ArrowRight, Zap, Star, BookOpen, Users, TrendingUp,
  FileCheck, Heart, AudioWaveform, Activity, Brain,
  MessageSquareText, CirclePlay, Cpu, ClipboardCheck,
  Play, Volume2
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
   FLOATING BACKGROUND ORBS — richer with more layers
   ====================================================== */
function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb orb-purple w-[700px] h-[700px] -top-48 -left-48 animate-float-slow" />
      <div className="orb orb-pink w-[500px] h-[500px] top-1/4 -right-24 animate-float-reverse" />
      <div className="orb orb-blue w-[350px] h-[350px] bottom-10 left-1/4 animate-float" />
      <div className="orb orb-cyan w-[200px] h-[200px] top-2/3 right-1/3 animate-float-slow" style={{ animationDelay: '2s' }} />
      {/* Star particles */}
      <div className="absolute top-[15%] left-[55%] w-1 h-1 rounded-full bg-purple-300/60 animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-[30%] right-[25%] w-1.5 h-1.5 rounded-full bg-pink-300/40 animate-float-reverse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[35%] left-[20%] w-1 h-1 rounded-full bg-blue-300/50 animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[50%] left-[40%] w-0.5 h-0.5 rounded-full bg-white/40 animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[70%] right-[15%] w-1 h-1 rounded-full bg-violet-300/40 animate-float" style={{ animationDelay: '4s' }} />
    </div>
  );
}

/* ======================================================
   ROTATING TEXT
   ====================================================== */
const ROTATING_SKILLS = ['Listening', 'Speaking', 'Writing', 'Grammar', 'Vocabulary', 'Reading'];

function RotatingSkillText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ROTATING_SKILLS.length);
        setVisible(true);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  /* Render static text on server, animated on client — avoids hydration mismatch */
  if (!mounted) {
    return (
      <span className="inline-block" style={{ minWidth: '180px' }}>
        <span className="gradient-text">{ROTATING_SKILLS[0]}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-block transition-all duration-400 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-3 scale-95'}`}
      style={{ minWidth: '180px' }}
    >
      <span className="gradient-text">{ROTATING_SKILLS[currentIndex]}</span>
    </span>
  );
}

/* ======================================================
   HERO RECORDING ELEMENT — large, dramatic mic with waveform
   Prominently featured right in the hero section
   ====================================================== */
/* Pre-computed waveform values to avoid hydration mismatches */
const WAVEFORM_HEIGHTS = Array.from({ length: 30 }, (_, i) =>
  `${(6 + Math.sin(i * 0.4) * 5 + 5).toFixed(2)}px`
);
const WAVEFORM_DELAYS = Array.from({ length: 30 }, (_, i) =>
  `${(i * 0.06).toFixed(2)}s`
);
const WAVEFORM_BG_HEIGHTS = Array.from({ length: 60 }, (_, i) =>
  `${(3 + Math.sin(i * 0.35) * 10 + 10).toFixed(2)}px`
);

function HeroRecordingElement() {
  const [isRecording, setIsRecording] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* Render static placeholder on server, full content on client — avoids hydration mismatch */
  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-5">
        {/* Waveform visualization — static placeholder */}
        <div className="flex items-center justify-center gap-[3px] h-16">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{
                height: WAVEFORM_HEIGHTS[i],
                animationDelay: WAVEFORM_DELAYS[i],
                opacity: 0.25,
              }}
            />
          ))}
        </div>

        {/* Microphone button — static */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-purple-500/15 blur-2xl" />
          <button
            onClick={() => setIsRecording(!isRecording)}
            className="relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-110 animate-mic-glow"
          >
            <Mic className="h-10 w-10 text-white" />
          </button>
        </div>

        {/* Status text */}
        <div className="text-center">
          <span className="text-sm text-white/50">Tap the mic to try speaking</span>
        </div>

        {/* Simulated waveform background decoration */}
        <div className="flex items-center justify-center gap-[2px] opacity-15 mt-2">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="w-[2px] rounded-full bg-gradient-to-t from-purple-500 to-pink-500"
              style={{ height: WAVEFORM_BG_HEIGHTS[i] }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Waveform visualization */}
      <div className="flex items-center justify-center gap-[3px] h-16">
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

      {/* Microphone button — larger and more dramatic */}
      <div className="relative">
        {/* Outer ripple rings */}
        {isRecording && (
          <>
            <div className="absolute inset-[-8px] rounded-full border-2 border-red-400/30 animate-ripple" />
            <div className="absolute inset-[-8px] rounded-full border-2 border-red-400/20 animate-ripple" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-[-8px] rounded-full border border-red-400/10 animate-ripple" style={{ animationDelay: '1s' }} />
          </>
        )}

        {/* Glow background */}
        <div className={`absolute -inset-6 rounded-full transition-all duration-500 ${isRecording ? 'bg-red-500/15 blur-2xl' : 'bg-purple-500/15 blur-2xl'}`} />

        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isRecording
              ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/40 animate-recording-pulse'
              : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-110 animate-mic-glow'
          }`}
        >
          <Mic className={`h-10 w-10 text-white ${isRecording ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Status text */}
      <div className="text-center">
        {isRecording ? (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-sm text-red-300 font-medium">Recording... Tap to stop</span>
          </div>
        ) : (
          <span className="text-sm text-white/50">Tap the mic to try speaking</span>
        )}
      </div>

      {/* Score preview cards */}
      {isRecording && (
        <div className="flex gap-3 animate-fade-in">
          {[
            { label: 'Fluency', score: '87', color: 'from-purple-500 to-violet-500' },
            { label: 'Pronunciation', score: '92', color: 'from-pink-500 to-rose-500' },
            { label: 'Accuracy', score: '84', color: 'from-blue-500 to-cyan-500' },
          ].map((item) => (
            <div key={item.label} className="glass-card px-4 py-2.5 text-center min-w-[85px]">
              <div className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.score}%</div>
              <div className="text-[10px] text-white/40">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Simulated waveform background decoration */}
      <div className="flex items-center justify-center gap-[2px] opacity-15 mt-2">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="w-[2px] rounded-full bg-gradient-to-t from-purple-500 to-pink-500"
            style={{ height: WAVEFORM_BG_HEIGHTS[i] }}
          />
        ))}
      </div>
    </div>
  );
}

/* ======================================================
   STAT ITEM
   ====================================================== */
function StatItem({ icon, value, label, delay }: { icon: React.ReactNode; value: string; label: string; delay: number }) {
  return (
    <AnimatedSection delay={delay}>
      <div className="glass-card p-5 text-center group">
        <div className="flex justify-center mb-2 text-purple-400 group-hover:text-purple-300 transition-colors">
          {icon}
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-white/50">{label}</div>
      </div>
    </AnimatedSection>
  );
}

/* ======================================================
   DATA
   ====================================================== */
const SKILLS_DATA = [
  { icon: <BarChart3 className="h-6 w-6" />, title: 'Grammar', desc: 'Our AI evaluates your understanding of sentence structure, verb tenses, and correct word usage across all CEFR levels from A1 to C2. The grammar module tests your ability to identify errors, construct complex sentences, and apply grammatical rules in context. Detailed feedback highlights your strengths and areas needing improvement.', gradient: 'from-purple-500 to-indigo-500' },
  { icon: <Award className="h-6 w-6" />, title: 'Vocabulary', desc: 'Assess your word knowledge including synonyms, antonyms, collocations, and contextual word choice with AI precision. The vocabulary section measures both the breadth and depth of your word knowledge, from everyday expressions to academic and professional terminology.', gradient: 'from-pink-500 to-rose-500' },
  { icon: <Globe className="h-6 w-6" />, title: 'Reading', desc: 'Test your comprehension of passages, understanding of main ideas, details, and inferences across academic and general texts. The reading module presents a variety of text types adapted to different proficiency levels.', gradient: 'from-blue-500 to-cyan-500' },
  { icon: <Headphones className="h-6 w-6" />, title: 'Listening', desc: 'Evaluate your ability to understand spoken English in various contexts, conversations, and scenarios at natural speed. The listening section features authentic audio recordings including dialogues, interviews, lectures, and everyday conversations.', gradient: 'from-green-500 to-emerald-500' },
  { icon: <Mic className="h-6 w-6" />, title: 'Speaking', desc: 'Get your pronunciation, fluency, and coherence assessed by our advanced AI speech recognition engine. The speaking module records your responses to prompts and analyzes them for accuracy, rhythm, intonation, and natural flow.', gradient: 'from-orange-500 to-amber-500' },
  { icon: <PenTool className="h-6 w-6" />, title: 'Writing', desc: 'Have your written expression, coherence, and accuracy evaluated with AI-powered linguistic analysis tools. The writing section asks you to produce text in response to prompts, testing your ability to organize ideas and use appropriate vocabulary.', gradient: 'from-violet-500 to-purple-500' },
];

const CEFR_LEVELS = [
  { level: 'A1', title: 'Beginner', desc: 'Can understand and use familiar everyday expressions and very basic phrases aimed at the satisfaction of needs of a concrete type.', color: 'from-blue-400 to-blue-600', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { level: 'A2', title: 'Elementary', desc: 'Can communicate in simple and routine tasks requiring a direct exchange of information on familiar and routine matters.', color: 'from-green-400 to-green-600', badge: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { level: 'B1', title: 'Intermediate', desc: 'Can deal with most situations likely to arise while travelling in an area where the language is spoken. Can produce simple connected text on familiar topics.', color: 'from-yellow-400 to-yellow-600', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { level: 'B2', title: 'Upper Intermediate', desc: 'Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible without strain for either party.', color: 'from-orange-400 to-orange-600', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { level: 'C1', title: 'Advanced', desc: 'Can express ideas fluently and spontaneously without much obvious searching for expressions. Can use language flexibly and effectively for social, academic, and professional purposes.', color: 'from-red-400 to-red-600', badge: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { level: 'C2', title: 'Proficient', desc: 'Can understand virtually everything heard or read with ease. Can express themselves spontaneously, very fluently, and precisely, differentiating finer shades of meaning.', color: 'from-purple-400 to-purple-600', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
];

const WHY_CHOOSE_DATA = [
  { icon: <Award className="h-6 w-6" />, title: 'Certified Results', desc: 'Get a proficiency rating aligned with the internationally recognized CEFR framework. Each certificate is individually generated and includes a unique verification code that can be validated online by employers, universities, and immigration authorities.', gradient: 'from-amber-400 to-orange-500' },
  { icon: <QrCode className="h-6 w-6" />, title: 'QR Verified Certificate', desc: 'Every certificate features a unique QR code that links directly to a public verification page. Employers and institutions can scan the code to instantly confirm your CEFR level, test date, and certificate authenticity.', gradient: 'from-purple-400 to-indigo-500' },
  { icon: <Clock className="h-6 w-6" />, title: 'Quick Assessment', desc: 'Complete the full test in approximately 30-45 minutes from start to finish. Take the assessment from anywhere in the world at any time — all you need is a device with internet access and a microphone.', gradient: 'from-cyan-400 to-blue-500' },
  { icon: <BarChart3 className="h-6 w-6" />, title: 'Detailed Analytics', desc: 'Receive a comprehensive breakdown of your performance across all six core skills. The analytics dashboard shows your strengths and weaknesses with percentile rankings and actionable improvement insights.', gradient: 'from-green-400 to-emerald-500' },
  { icon: <Shield className="h-6 w-6" />, title: 'Secure Payment', desc: 'Pay securely via PayPal with full buyer protection on every transaction. Your payment information is never stored on our servers — all transactions are encrypted end-to-end using industry-standard TLS protocols.', gradient: 'from-pink-400 to-rose-500' },
  { icon: <CheckCircle2 className="h-6 w-6" />, title: 'Instant Results', desc: 'Get your CEFR level immediately upon completing the test — no waiting days or weeks for results. Download your certificate as a professional PDF and share it with employers or institutions right away.', gradient: 'from-violet-400 to-purple-500' },
];

/* ======================================================
   MAIN PAGE
   ====================================================== */
export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* Use false for isAuthenticated until client mounts to avoid hydration mismatch */
  const isAuth = mounted && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* ===== HERO SECTION WITH RECORDING ELEMENT ===== */}
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

            {/* Rotating skill text */}
            <div className="mt-5 text-2xl sm:text-3xl md:text-4xl font-semibold text-white/90 flex items-center justify-center gap-3 animate-fade-in">
              <span>Master</span>
              <RotatingSkillText />
            </div>

            {/* Subheadline */}
            <p className="mt-5 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto animate-fade-in delay-300 text-center">
              Get your CEFR-scored English proficiency results in minutes. Our AI evaluates 6 core skills — reading, writing, listening, speaking, grammar, and vocabulary — to give you an internationally recognized proficiency rating.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-scale-in delay-500">
              {isAuth ? (
                user?.plan === 'premium' ? (
                  <Link href="/test">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Your Test
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                ) : (
                  <Link href="/pricing">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Get Premium Access
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                )
              ) : (
                <>
                  <Link href="/register">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Start Free Account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/quick-tour">
                    <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer">
                      Quick Tour
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* ===== RECORDING ELEMENT — prominently in hero ===== */}
            <div className="mt-14 max-w-lg mx-auto animate-scale-in delay-700">
              <div className="relative">
                {/* Animated gradient border wrapper */}
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-purple-500/50 via-pink-500/30 to-purple-500/50 animate-border-glow" />
                <div className="relative glass-card-neon p-8 md:p-10 light-streak">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 mb-3">
                      <Mic className="h-3 w-3 text-purple-400" />
                      <span className="text-[10px] text-purple-300 font-medium uppercase tracking-wider">AI Speaking Assessment</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">Try Speaking Now</h3>
                    <p className="text-xs text-white/40">Tap the microphone to see AI analysis in action</p>
                  </div>

                  <HeroRecordingElement />

                  {/* CTA link to full speaking test */}
                  <div className="mt-6 text-center">
                    <Link href="/speaking">
                      <button className="group inline-flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 hover:-translate-y-0.5 cursor-pointer">
                        Start Full Speaking Test
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <StatItem icon={<Users className="h-5 w-5" />} value="10K+" label="Tests Taken" delay={100} />
              <StatItem icon={<Globe className="h-5 w-5" />} value="120+" label="Countries" delay={200} />
              <StatItem icon={<Zap className="h-5 w-5" />} value="30 min" label="Avg. Time" delay={300} />
              <StatItem icon={<Star className="h-5 w-5" />} value="98%" label="Accuracy" delay={400} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== SPEAKING ASSESSMENT DETAILS ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[500px] h-[500px] top-0 left-1/3 animate-float-slow" />
          <div className="orb orb-pink w-[300px] h-[300px] bottom-0 right-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
            {/* Left: Description */}
            <AnimatedSection>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                  <Volume2 className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">AI Speech Recognition</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  Speak Naturally.<br />
                  <span className="gradient-text-static">Get Assessed Instantly.</span>
                </h2>
                <p className="mt-5 text-white/50 leading-relaxed text-base max-w-lg">
                  Our advanced AI speech recognition engine evaluates your pronunciation, fluency, and coherence in real-time. Simply speak into your microphone and receive detailed feedback on every aspect of your spoken English — from individual phoneme accuracy to overall conversational flow.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    { icon: <AudioWaveform className="h-5 w-5" />, title: 'Real-Time Speech Analysis', desc: 'Neural networks transcribe and analyze your speech as you speak' },
                    { icon: <Activity className="h-5 w-5" />, title: 'Pronunciation Scoring', desc: 'Precise scores for phonemes, word stress, and intonation' },
                    { icon: <MessageSquareText className="h-5 w-5" />, title: 'Fluency & Coherence', desc: 'Measures speaking rate, pauses, hesitations, and natural rhythm' },
                  ].map((feature) => (
                    <div key={feature.title} className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 text-purple-400">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
                        <p className="text-xs text-white/40 mt-0.5">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-3">
                  <Link href="/speaking">
                    <button className="group flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 hover:-translate-y-0.5 cursor-pointer">
                      Try Speaking Test
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/quick-tour">
                    <button className="glass-button rounded-xl px-6 py-3 text-white font-medium text-sm cursor-pointer">
                      See How It Works
                    </button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Visual demo card with AI analysis preview */}
            <AnimatedSection delay={200}>
              <div className="relative">
                {/* Animated gradient border */}
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-purple-500/40 via-pink-500/20 to-blue-500/40 animate-border-glow" />
                <div className="relative glass-card-neon p-8 light-streak">
                  <div className="text-center mb-6">
                    <h3 className="text-base font-semibold text-white mb-1">AI Analysis Preview</h3>
                    <p className="text-xs text-white/35">Sample results from a speaking assessment</p>
                  </div>

                  {/* Simulated score display */}
                  <div className="space-y-4">
                    {/* Overall score */}
                    <div className="flex items-center justify-between glass-card p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg">B2</div>
                        <div>
                          <p className="text-sm font-semibold text-white">Overall Level</p>
                          <p className="text-xs text-white/40">Upper Intermediate</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold gradient-text-static">78%</p>
                        <p className="text-[10px] text-white/30">Overall Score</p>
                      </div>
                    </div>

                    {/* Skill bars */}
                    {[
                      { label: 'Fluency', score: 87, color: 'from-purple-500 to-violet-500' },
                      { label: 'Pronunciation', score: 92, color: 'from-pink-500 to-rose-500' },
                      { label: 'Vocabulary Range', score: 75, color: 'from-blue-500 to-cyan-500' },
                      { label: 'Grammar Accuracy', score: 68, color: 'from-orange-500 to-amber-500' },
                      { label: 'Coherence', score: 81, color: 'from-green-500 to-emerald-500' },
                    ].map((skill) => (
                      <div key={skill.label} className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-xs text-white/60">{skill.label}</span>
                          <span className="text-xs font-medium text-white/80">{skill.score}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                            style={{ width: `${skill.score}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    {/* AI feedback snippet */}
                    <div className="glass-card p-3 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="h-3.5 w-3.5 text-purple-400" />
                        <span className="text-[10px] text-purple-300 font-medium uppercase tracking-wider">AI Feedback</span>
                      </div>
                      <p className="text-xs text-white/45 leading-relaxed">
                        Strong pronunciation and natural rhythm. Focus on expanding vocabulary range and using more complex grammatical structures in spontaneous speech.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== 6 CORE SKILLS SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Comprehensive Evaluation</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                6 Core Skills <span className="gradient-text-static">Assessed</span>
              </h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
                Our comprehensive AI-powered evaluation measures your English proficiency across all key language competencies aligned with the CEFR framework.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {SKILLS_DATA.map((skill, index) => (
              <AnimatedSection key={skill.title} delay={index * 100}>
                <div className="relative">
                  {/* Animated gradient border on hover */}
                  <div className="absolute -inset-[1px] rounded-[21px] bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/30 group-hover:via-pink-500/20 group-hover:to-blue-500/30 transition-all duration-500" />
                  <div className="relative glass-card p-6 h-full group">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${skill.gradient} text-white shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        {skill.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{skill.title}</h3>
                        <p className="text-sm text-white/50 leading-relaxed">{skill.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Zap className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Simple Process</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                How It <span className="gradient-text-static">Works</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Create Your Account', desc: 'Sign up for a free account in under 30 seconds. No credit card required — explore the platform and take a sample test before committing.', icon: <Users className="h-6 w-6" />, gradient: 'from-purple-500 to-indigo-500' },
              { step: '02', title: 'Take the Assessment', desc: 'Complete the AI-powered test covering all six core skills. The adaptive engine adjusts question difficulty in real-time based on your responses.', icon: <FileCheck className="h-6 w-6" />, gradient: 'from-pink-500 to-rose-500' },
              { step: '03', title: 'Get Certified', desc: 'Receive your CEFR level instantly along with a downloadable certificate featuring a QR verification code. Share your results with confidence.', icon: <Award className="h-6 w-6" />, gradient: 'from-cyan-500 to-blue-500' },
            ].map((item, index) => (
              <AnimatedSection key={item.step} delay={index * 150}>
                <div className="relative">
                  <div className="absolute -inset-[1px] rounded-[21px] bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-blue-500/20" />
                  <div className="relative glass-card-neon p-6 h-full text-center group">
                    <div className="text-5xl font-black gradient-text-static opacity-20 mb-2">{item.step}</div>
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg shadow-black/20 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CEFR LEVELS SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Internationally Recognized</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                CEFR Levels <span className="gradient-text-static">Explained</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {CEFR_LEVELS.map((item, index) => (
              <AnimatedSection key={item.level} delay={index * 80}>
                <div className="glass-card p-5 h-full group">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br ${item.color} text-white text-sm font-bold shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-110`}>
                      {item.level}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${item.badge}`}>Level {item.level}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE TESTCEFR ===== */}
      <section className="relative py-20 md:py-28 bg-[#0F0A1E]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Shield className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Trusted Platform</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Why Choose <span className="gradient-text-static">TestCEFR</span>?
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {WHY_CHOOSE_DATA.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 100}>
                <div className="glass-card p-6 h-full group">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg shadow-black/20 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-20 md:py-28 dark-section-alt hero-pattern noise-overlay">
        <div className="container relative mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
                <Heart className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">What Learners Say</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Trusted by <span className="gradient-text-static">Thousands</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              { quote: 'I needed a CEFR certificate for my university application and TestCEFR delivered exactly what I needed. The test took less than 40 minutes, and I had my verified certificate the moment I finished!', name: 'Maria S.', role: 'University Applicant, Spain', level: 'B2' },
              { quote: 'As an HR manager, I appreciate the QR verification feature. When candidates present their TestCEFR certificates, I can scan the code and verify their level instantly. Highly recommended for recruitment.', name: 'David K.', role: 'HR Manager, Germany', level: 'C1' },
              { quote: 'The detailed analytics helped me understand exactly where I needed to improve. After three months of targeted study, I retook the test and moved from B1 to B2. The progress tracking is incredibly motivating!', name: 'Yuki T.', role: 'Software Engineer, Japan', level: 'B2' },
            ].map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="glass-card p-6 h-full group flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />))}
                  </div>
                  <p className="text-sm text-white/55 leading-relaxed flex-1 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">{testimonial.name[0]}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{testimonial.name}</p>
                      <p className="text-xs text-white/40">{testimonial.role}</p>
                    </div>
                    <span className="text-xs font-bold gradient-text-static">{testimonial.level}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-20 md:py-28 dark-section overflow-hidden mesh-gradient">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple w-[500px] h-[500px] -top-32 right-1/4 animate-float-slow" />
          <div className="orb orb-pink w-[350px] h-[350px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card-neon p-10 md:p-14 light-streak">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6 animate-pulse-glow">
                  <Sparkles className="h-4 w-4 text-purple-300" />
                  <span className="text-sm text-purple-200 font-medium">Start Your Journey</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Discover Your <span className="gradient-text-static">English Level</span>?
                </h2>
                <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
                  Join thousands of learners who have already discovered their CEFR level. Create your free account today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <button className="group flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 cursor-pointer">
                      Create Free Account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href="/pricing">
                    <button className="glass-button rounded-xl px-8 py-3.5 text-white font-medium text-base cursor-pointer">
                      View Pricing
                    </button>
                  </Link>
                </div>
                <p className="mt-6 text-xs text-white/30">No credit card required. Free account includes a sample test.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative bg-[#0A0618] border-t border-white/5 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20">CE</div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base">testcefr.com</span>
                  <span className="text-white/30 text-[9px] uppercase tracking-[0.2em]">English Assessment</span>
                </div>
              </div>
              <p className="text-sm text-white/40 leading-relaxed mb-4">AI-powered English proficiency assessment aligned with the CEFR framework. Trusted by learners across 120+ countries.</p>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/40">All systems operational</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Assessments</h4>
              <div className="space-y-2.5">
                <Link href="/speaking" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Speaking Test</Link>
                <Link href="/listening" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Listening Test</Link>
                <Link href="/writing" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Writing Test</Link>
                <Link href="/quick-tour" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Quick Tour</Link>
                <Link href="/sample-certificate" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Sample Certificate</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <div className="space-y-2.5">
                <Link href="/about" className="block text-sm text-white/40 hover:text-white/70 transition-colors">About</Link>
                <Link href="/contact" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Contact</Link>
                <Link href="/privacy" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Terms of Service</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Account</h4>
              <div className="space-y-2.5">
                <Link href="/dashboard" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Dashboard</Link>
                <Link href="/login" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Sign In</Link>
                <Link href="/register" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Sign Up</Link>
                <Link href="/pricing" className="block text-sm text-white/40 hover:text-white/70 transition-colors">Pricing</Link>
              </div>
            </div>
          </div>
          <div className="section-divider mt-10 mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} TestCEFR. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-white/30 hover:text-white/50 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-white/30 hover:text-white/50 transition-colors">Terms</Link>
              <Link href="/contact" className="text-xs text-white/30 hover:text-white/50 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
