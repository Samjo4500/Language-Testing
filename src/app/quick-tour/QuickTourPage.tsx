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
    lexiScript: "All your hard work pays off here! Complete courses and pass assessments to earn QR-verified CEFR certificates. These are recognized by employers and universities worldwide. You can download them as PDFs, share them on LinkedIn, and include them in job applications. Your certificate proves your English level with confidence.",
    duration: "Upon completion",
  },
];

/* ───────── Feature Highlights ───────── */
const FEATURE_HIGHLIGHTS = [
  { icon: <Brain size={20} />, title: "AI-Powered Assessment", desc: "Adaptive testing across 6 CEFR skills with instant results", color: "text-purple-400" },
  { icon: <Mic size={20} />, title: "Voice-First Practice", desc: "Speak with Lexi — get real-time pronunciation & grammar feedback", color: "text-cyan-400" },
  { icon: <BookOpen size={20} />, title: "150+ Structured Lessons", desc: "Video lessons, vocabulary, quizzes — Beginner to Advanced", color: "text-emerald-400" },
  { icon: <Users size={20} />, title: "Global Community", desc: "Language partners, live voice rooms, study groups, chatrooms", color: "text-rose-400" },
  { icon: <Award size={20} />, title: "Verified Certificates", desc: "QR-verified PDF certificates recognized by employers worldwide", color: "text-amber-400" },
  { icon: <Shield size={20} />, title: "CEFR Aligned", desc: "All content follows the Common European Framework A1-C2", color: "text-indigo-400" },
];

/* ───────── Stats ───────── */
const STATS = [
  { value: "50K+", label: "Tests Taken" },
  { value: "150+", label: "Lessons" },
  { value: "6", label: "Skills Assessed" },
  { value: "A1-C2", label: "CEFR Levels" },
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

/* ═══════════════════════════════════════════
   QUICK TOUR PAGE — REDESIGNED
   ═══════════════════════════════════════════ */
export default function QuickTourPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [lexiOpen, setLexiOpen] = useState(true);
  const [lexiMessage, setLexiMessage] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const { speak, isSpeaking } = useVoice();
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasGreeted = useRef(false);

  /* Scroll progress */
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(window.scrollY / total);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Lexi opening message — only once */
  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    const msg = "Hi there! I'm Lexi, your personal guide. I'll walk you through everything TestCEFR has to offer. Click any step to have me explain it, or just scroll through the journey. Let's get started!";
    setLexiMessage(msg);
    const t = setTimeout(() => speak(msg), 1200);
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
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-100"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 pt-28 pb-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />
          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-cyan-400/30 animate-float"
              style={{ left: `${8 + i * 8}%`, top: `${10 + (i % 5) * 18}%`, animationDelay: `${i * 0.4}s`, animationDuration: `${3 + i * 0.3}s` }} />
          ))}
        </div>

        {/* Badge */}
        <div className="relative mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <Compass size={16} className="text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Your Learning Journey</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="relative text-5xl md:text-7xl font-bold text-center mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
            From First Word
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            to Fluent Speaker
          </span>
        </h1>

        <p className="relative text-lg md:text-xl text-white/50 text-center max-w-2xl mb-10 leading-relaxed">
          Your complete path to English mastery — AI assessment, structured courses, 
          voice practice with Lexi, and a global community. All in one platform.
        </p>

        {/* Stats */}
        <div className="relative flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="relative flex flex-wrap justify-center gap-4 mb-16">
          <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105">
            <Rocket size={20} />
            Start Your Journey — Free
            <ArrowRight size={18} />
          </Link>
          <button onClick={() => scrollToStep(0)} className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white/80 font-medium rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">
            <Play size={18} />
            Explore the Path
          </button>
        </div>

        {/* Journey preview dots */}
        <div className="relative flex items-center gap-2">
          {TOUR_STEPS.map((_, i) => (
            <button key={i} onClick={() => scrollToStep(i)} className="group flex flex-col items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${activeStep === i ? "bg-cyan-400 scale-125" : "bg-white/20 hover:bg-white/40"}`} />
            </button>
          ))}
        </div>
      </section>

      {/* ═══ FEATURE HIGHLIGHTS GRID ═══ */}
      <section className="relative px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Everything You Need to Master English</h2>
          <p className="text-white/40">One platform. Every skill. From assessment to certification.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURE_HIGHLIGHTS.map((f, i) => (
            <div key={i}
              onMouseEnter={() => { setHoveredFeature(i); speak(`${f.title}. ${f.desc}`); }}
              onMouseLeave={() => setHoveredFeature(null)}
              className={`relative p-6 bg-white/[0.02] border border-white/5 rounded-2xl transition-all duration-300 cursor-pointer group ${hoveredFeature === i ? "bg-white/[0.05] border-cyan-500/20 scale-[1.02]" : "hover:bg-white/[0.04] hover:border-white/10"}`}>
              <div className={`mb-3 ${f.color}`}>{f.icon}</div>
              <h3 className="text-sm font-semibold text-white/90 mb-1">{f.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={14} className="text-white/20" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ MAIN JOURNEY STEPS ═══ */}
      <section className="relative px-4 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
            <Flame size={14} className="text-cyan-400" />
            <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Your 6-Step Journey</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How TestCEFR Works</h2>
          <p className="text-white/40 max-w-xl mx-auto">Follow this proven path from registration to certification. Click any step to have Lexi explain it.</p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {TOUR_STEPS.map((step, index) => (
            <div key={step.id} ref={el => { stepRefs.current[index] = el; }}>
              {/* Connector line */}
              {index > 0 && (
                <div className="flex justify-center mb-8">
                  <ArrowDown size={24} className="text-white/10" />
                </div>
              )}

              <div
                onClick={() => handleStepClick(index)}
                className={`relative group cursor-pointer transition-all duration-300 ${activeStep === index ? "scale-[1.02]" : "hover:scale-[1.01]"}`}
              >
                {/* Active glow */}
                {activeStep === index && (
                  <div className={`absolute -inset-1 bg-gradient-to-r ${step.color} rounded-3xl blur-lg opacity-20`} />
                )}

                <div className={`relative bg-gradient-to-br from-[#1a1a3a] to-[#0c0c24] border rounded-3xl overflow-hidden transition-all duration-300 ${activeStep === index ? "border-cyan-500/30" : "border-white/5 hover:border-white/10"}`}>
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`} />

                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left: Number + Icon */}
                      <div className="flex md:flex-col items-center md:items-start gap-4 shrink-0">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
                          {isSpeaking && activeStep === index ? (
                            <div className="flex gap-1">
                              <span className="w-1.5 h-4 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1.5 h-6 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1.5 h-4 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          ) : (
                            <span className="text-2xl font-bold">{step.number}</span>
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
                        <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">{step.headline}</h3>
                        <p className="text-sm text-white/50 leading-relaxed mb-4">{step.description}</p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {step.features.map((f, fi) => (
                            <span key={fi} className="flex items-center gap-1.5 text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-full">
                              <Check size={10} className="text-cyan-400/60" />
                              {f}
                            </span>
                          ))}
                        </div>

                        {/* Lexi quote (when active) */}
                        {activeStep === index && lexiMessage && (
                          <div className="mt-4 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/30 shrink-0">
                                <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-xs text-cyan-400 font-medium mb-1">Lexi says:</p>
                                <p className="text-sm text-white/70 leading-relaxed italic">&ldquo;{lexiMessage}&rdquo;</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CTA */}
                        <Link href={step.link} className={`inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r ${step.color} text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-lg`}>
                          {step.cta}
                          <ArrowRight size={16} />
                        </Link>
                      </div>

                      {/* Right: Big icon */}
                      <div className="hidden lg:flex items-center justify-center w-32 shrink-0">
                        <div className={`text-white/10 group-hover:text-white/20 transition-all ${activeStep === index ? "scale-110" : ""}`}>
                          {step.highlightIcon}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ LEXI TOUR GUIDE (Floating) ═══ */}
      {lexiOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)]">
          <div className="relative bg-gradient-to-b from-[#14143a] to-[#0c0c24] border border-cyan-500/20 rounded-3xl shadow-2xl overflow-hidden" style={{ boxShadow: "0 0 60px rgba(6, 182, 212, 0.12)" }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-cyan-500/30">
                  <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
                  {isSpeaking && <div className="absolute bottom-0 right-0 w-3 h-3 bg-purple-500 rounded-full border-2 border-[#14143a] animate-pulse" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Lexi</p>
                  <p className="text-[10px] text-cyan-400/60">Your Tour Guide</p>
                </div>
              </div>
              <button onClick={() => setLexiOpen(false)} className="p-2 rounded-lg text-white/20 hover:text-white/40 hover:bg-white/5 transition-colors">
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
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all ${activeStep === i ? "bg-cyan-500/15 border border-cyan-500/30" : "bg-white/5 border border-transparent hover:bg-white/10"}`}>
                      <span className="text-xs font-bold text-cyan-400">{step.number}</span>
                      <span className="text-[10px] text-white/50 truncate w-full">{step.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Replay button */}
              <button onClick={() => speak(lexiMessage)} className="mt-3 flex items-center gap-2 text-xs text-cyan-400/50 hover:text-cyan-400 transition-colors">
                <Volume2 size={12} />
                {isSpeaking ? "Speaking..." : "Listen again"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lexi minimized pill (when closed) */}
      {!lexiOpen && (
        <button onClick={() => setLexiOpen(true)} className="fixed bottom-6 right-6 z-50 group">
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
          <div className="relative flex items-center gap-2 pl-2 pr-4 py-2 bg-gradient-to-r from-[#14143a] to-[#1a1a4a] border border-cyan-500/30 rounded-full shadow-lg hover:scale-105 transition-all">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-500/30">
              <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-medium text-white/80">Tour Guide</span>
          </div>
        </button>
      )}

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative px-4 py-20 max-w-4xl mx-auto text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl" />
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
            <Rocket size={36} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/40 mb-8 max-w-lg mx-auto">
            Join 50,000+ learners who&apos;ve discovered their English level and improved with TestCEFR. 
            It&apos;s free to start.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105">
              <Sparkles size={20} />
              Create Free Account
              <ArrowRight size={18} />
            </Link>
            <Link href="/test" className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white/80 font-medium rounded-2xl hover:bg-white/10 transition-all">
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
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-15px); opacity: 0.6; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
