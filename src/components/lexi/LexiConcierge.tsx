"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Volume2, VolumeX, X, Minimize2, ArrowRight, Target, BookOpen,
  Users, HelpCircle, ChevronRight, RotateCcw, Play, Square,
  Sparkles, Check, Star, TrendingUp, Award, Clock, Zap,
  GraduationCap, Mic, MessageCircle
} from "lucide-react";

/* ═════════════════════════════════════════
   TYPES
   ═════════════════════════════════════════ */
type Phase = "discovery" | "routing" | "pricing" | "coach" | "idle" | "minimized";
type Interest = "test" | "courses" | "community" | "unsure" | null;
type Level = "beginner" | "intermediate" | "advanced" | "unknown" | null;

/* ═════════════════════════════════════════
   VOICE ENGINE (free — uses browser TTS)
   ═════════════════════════════════════════ */
function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const selectedVoice = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      selectedVoice.current =
        voices.find((v) => v.lang === "en-GB" && v.name.includes("Female")) ||
        voices.find((v) => v.name.includes("Google UK English Female")) ||
        voices.find((v) => v.name.includes("Zira")) ||
        voices.find((v) => v.name.includes("Samantha")) ||
        voices.find((v) => v.lang.startsWith("en") && v.name.includes("Female")) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0] || null;
      setVoiceReady(true);
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    const retry = setTimeout(loadVoices, 500);
    return () => clearTimeout(retry);
  }, []);

  const speak = useCallback((text: string) => {
    if (isMuted || !voiceReady) return;
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = selectedVoice.current;
    utter.rate = 0.9;
    utter.pitch = 1.05;
    utter.volume = 0.8;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    speechSynthesis.speak(utter);
  }, [isMuted, voiceReady]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((m) => {
      if (!m) speechSynthesis.cancel();
      return !m;
    });
  }, []);

  return { speak, stop, isSpeaking, isMuted, toggleMute, voiceReady };
}

/* ═════════════════════════════════════════
   DISCOVERY CONTENT
   ═════════════════════════════════════════ */
const DISCOVERY_FLOW = [
  {
    question: "Hi there! I'm Lexi, your personal English learning advisor. I can help you find the perfect path on TestCEFR. Ready?",
    speak: "Hi there! I'm Lexi, your personal English learning advisor. I can help you find the perfect path on TestCEFR. Ready?",
    options: [
      { label: "Yes, help me!", icon: <Sparkles size={16} />, value: "start" },
      { label: "Maybe later", icon: <Clock size={16} />, value: "skip" },
    ],
  },
  {
    question: "What's your main goal? What brings you here today?",
    speak: "What's your main goal? What brings you here today?",
    options: [
      { label: "Test my English", speak: "Test my English level", icon: <Target size={16} />, value: "test", desc: "Find your CEFR level with our AI assessment" },
      { label: "Learn English", speak: "Learn English with courses", icon: <BookOpen size={16} />, value: "courses", desc: "Structured lessons from beginner to advanced" },
      { label: "Practice speaking", speak: "Practice speaking with people", icon: <Users size={16} />, value: "community", desc: "Chat and practice with other learners" },
      { label: "Not sure yet", speak: "I'm not sure yet", icon: <HelpCircle size={16} />, value: "unsure", desc: "No worries, I'll help you figure it out" },
    ],
  },
  {
    question: "And what's your current English level?",
    speak: "And what's your current English level?",
    options: [
      { label: "Beginner (A1-A2)", speak: "Beginner", icon: <Star size={16} />, value: "beginner", desc: "Just starting or know some basics" },
      { label: "Intermediate (B1-B2)", speak: "Intermediate", icon: <TrendingUp size={16} />, value: "intermediate", desc: "Can hold conversations, want to improve" },
      { label: "Advanced (C1-C2)", speak: "Advanced", icon: <Award size={16} />, value: "advanced", desc: "Fluent, seeking mastery" },
      { label: "I don't know", speak: "I don't know my level", icon: <HelpCircle size={16} />, value: "unknown", desc: "Take our free test to find out" },
    ],
  },
];

/* ═════════════════════════════════════════
   PRICING FLOW
   ═════════════════════════════════════════ */
const PRICING_FLOW = [
  {
    question: "Let me find the perfect plan for you. How many hours can you study per week?",
    speak: "Let me find the perfect plan for you. How many hours can you study per week?",
    options: [
      { label: "1-2 hours", speak: "1 to 2 hours", value: "low" },
      { label: "3-5 hours", speak: "3 to 5 hours", value: "medium" },
      { label: "5+ hours", speak: "More than 5 hours", value: "high" },
    ],
  },
  {
    question: "What's your main goal?",
    speak: "What's your main goal?",
    options: [
      { label: "University admission", speak: "University admission", value: "university" },
      { label: "Job / Career", speak: "Job or career", value: "career" },
      { label: "General improvement", speak: "General improvement", value: "general" },
      { label: "Test prep (IELTS/TOEFL)", speak: "Test preparation", value: "exam" },
    ],
  },
  {
    question: "How soon do you need results?",
    speak: "How soon do you need results?",
    options: [
      { label: "ASAP (1-3 months)", speak: "As soon as possible", value: "asap" },
      { label: "3-6 months", speak: "3 to 6 months", value: "moderate" },
      { label: "No rush", speak: "No rush", value: "relaxed" },
    ],
  },
];

/* ═════════════════════════════════════════
   ROUTING MESSAGES
   ═════════════════════════════════════════ */
function getRoutingMessage(interest: Interest, level: Level) {
  const messages: Record<string, { text: string; speak: string; cta: string; link: string }> = {
    "test-beginner": {
      text: "Perfect! Let's start with our free CEFR test. It covers grammar, vocabulary, reading, listening, speaking, and writing. Since you're a beginner, don't worry — the test adapts to your level. You'll get instant results!",
      speak: "Perfect! Let's start with our free CEFR test. It covers grammar, vocabulary, reading, listening, speaking, and writing. Since you're a beginner, don't worry — the test adapts to your level. You'll get instant results!",
      cta: "Start Free Test →",
      link: "/test",
    },
    "test-intermediate": {
      text: "Excellent choice! Our AI assessment will pinpoint exactly where you stand between B1 and B2. The speaking section uses voice analysis — just speak naturally. You'll get a detailed report with personalized recommendations.",
      speak: "Excellent choice! Our AI assessment will pinpoint exactly where you stand between B1 and B2. The speaking section uses voice analysis — just speak naturally. You'll get a detailed report with personalized recommendations.",
      cta: "Take the Assessment →",
      link: "/test",
    },
    "test-advanced": {
      text: "At your level, our test focuses on nuanced grammar, advanced vocabulary, and precise pronunciation. You'll get a certificate you can share on LinkedIn. Challenge accepted?",
      speak: "At your level, our test focuses on nuanced grammar, advanced vocabulary, and precise pronunciation. You'll get a certificate you can share on LinkedIn. Challenge accepted?",
      cta: "Challenge Accepted →",
      link: "/test",
    },
    "courses-beginner": {
      text: "Great choice! Our Beginner course has 50 lessons starting from A1. Each lesson includes a video, 10 vocabulary cards with audio, example sentences, and a quiz. And the best part — you can try Lesson 1 for free right now!",
      speak: "Great choice! Our Beginner course has 50 lessons starting from A1. Each lesson includes a video, 10 vocabulary cards with audio, example sentences, and a quiz. And the best part — you can try Lesson 1 for free right now!",
      cta: "Try Lesson 1 Free →",
      link: "/courses/beginner",
    },
    "courses-intermediate": {
      text: "Perfect! Our Intermediate course covers B1-B2 with real-world conversations, complex grammar, and 500+ new vocabulary words. You'll practice with dialogues, writing exercises, and comprehension quizzes.",
      speak: "Perfect! Our Intermediate course covers B1 to B2 with real-world conversations, complex grammar, and over 500 new vocabulary words. You'll practice with dialogues, writing exercises, and comprehension quizzes.",
      cta: "Explore Course →",
      link: "/courses/intermediate",
    },
    "courses-advanced": {
      text: "Excellent! The Advanced course takes you from C1 to C2 with academic writing, nuanced grammar, and professional communication. This is where you master English. Ready?",
      speak: "Excellent! The Advanced course takes you from C1 to C2 with academic writing, nuanced grammar, and professional communication. This is where you master English. Ready?",
      cta: "Master English →",
      link: "/courses/advanced",
    },
    "community-beginner": {
      text: "Practice makes perfect! Join SpeakSpace where you can find study partners at your level. The Beginner Corner is a safe, friendly space. Don't worry about making mistakes — that's how we learn!",
      speak: "Practice makes perfect! Join SpeakSpace where you can find study partners at your level. The Beginner Corner is a safe, friendly space. Don't worry about making mistakes — that's how we learn!",
      cta: "Join Beginner Corner →",
      link: "/community",
    },
    "community-intermediate": {
      text: "Great! In SpeakSpace, you can join live voice rooms, find study partners, or jump into group conversations. There are people online right now who would love to practice with you!",
      speak: "Great! In SpeakSpace, you can join live voice rooms, find study partners, or jump into group conversations. There are people online right now who would love to practice with you!",
      cta: "Find a Partner →",
      link: "/community",
    },
    "community-advanced": {
      text: "At C1-C2, you'll find advanced discussion groups debating complex topics. Join the Advanced Speakers channel for intellectual conversations. You can also help intermediate learners — teaching is the best way to master a language!",
      speak: "At C1 and C2, you'll find advanced discussion groups debating complex topics. Join the Advanced Speakers channel. You can also help intermediate learners — teaching is the best way to master a language!",
      cta: "Join Advanced Channel →",
      link: "/community",
    },
    "unsure": {
      text: "No problem at all! I recommend starting with our free CEFR test. It takes about 15 minutes and will show you exactly where you stand. From there, I can recommend the perfect learning path for you. Easy!",
      speak: "No problem at all! I recommend starting with our free CEFR test. It takes about 15 minutes and will show you exactly where you stand. From there, I can recommend the perfect learning path for you. Easy!",
      cta: "Find My Level →",
      link: "/test",
    },
  };
  const key = `${interest}-${level || "unknown"}`;
  return messages[key] || messages["unsure"];
}

/* ═════════════════════════════════════════
   COMPONENT
   ═════════════════════════════════════════ */
export default function LexiConcierge() {
  const [phase, setPhase] = useState<Phase>("minimized");
  const [interest, setInterest] = useState<Interest>(null);
  const [level, setLevel] = useState<Level>(null);
  const [discoveryStep, setDiscoveryStep] = useState(0);
  const [pricingStep, setPricingStep] = useState(0);
  const [pricingAnswers, setPricingAnswers] = useState<string[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const [firstVisit, setFirstVisit] = useState(false);
  const { speak, stop, isSpeaking, isMuted, toggleMute, voiceReady } = useVoice();
  const panelRef = useRef<HTMLDivElement>(null);

  /* Breathing animation */
  useEffect(() => {
    const interval = setInterval(() => setBreathPhase((p) => (p + 1) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  /* Check first visit */
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("lexi-dismissed-permanently");
      if (dismissed) return;
      const visited = localStorage.getItem("lexi-visited");
      if (!visited) {
        setFirstVisit(true);
        localStorage.setItem("lexi-visited", "true");
      }
    } catch {}
  }, []);

  /* Auto-appear for first visit */
  useEffect(() => {
    if (firstVisit && voiceReady) {
      const timer = setTimeout(() => {
        setShowPanel(true);
        setPhase("discovery");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [firstVisit, voiceReady]);

  /* Speak on step changes */
  useEffect(() => {
    if (phase === "discovery" && showPanel) {
      const step = DISCOVERY_FLOW[discoveryStep];
      if (step && !isMuted) {
        const timer = setTimeout(() => speak(step.speak), 400);
        return () => clearTimeout(timer);
      }
    }
    if (phase === "pricing" && showPanel) {
      const step = PRICING_FLOW[pricingStep];
      if (step && !isMuted) {
        const timer = setTimeout(() => speak(step.speak), 400);
        return () => clearTimeout(timer);
      }
    }
  }, [discoveryStep, pricingStep, phase, showPanel, isMuted, speak]);

  /* Stop speech on page navigation */
  useEffect(() => {
    return () => { speechSynthesis?.cancel(); };
  }, []);

  /* Handle discovery option */
  const handleDiscoveryOption = useCallback((value: string) => {
    stop();
    if (discoveryStep === 0) {
      if (value === "skip") {
        setShowPanel(false);
        setPhase("minimized");
        return;
      }
      setDiscoveryStep(1);
      return;
    }
    if (discoveryStep === 1) {
      setInterest(value as Interest);
      setDiscoveryStep(2);
      return;
    }
    if (discoveryStep === 2) {
      const lvl = value === "unknown" ? "beginner" : (value as Level);
      setLevel(lvl);
      setPhase("routing");
    }
  }, [discoveryStep, stop]);

  /* Handle pricing option */
  const handlePricingOption = useCallback((value: string) => {
    stop();
    const newAnswers = [...pricingAnswers, value];
    setPricingAnswers(newAnswers);
    if (pricingStep < PRICING_FLOW.length - 1) {
      setPricingStep(pricingStep + 1);
    } else {
      setPhase("idle");
    }
  }, [pricingStep, pricingAnswers, stop]);

  /* Start pricing advisor */
  const startPricing = useCallback(() => {
    stop();
    setPricingStep(0);
    setPricingAnswers([]);
    setPhase("pricing");
    setShowPanel(true);
  }, [stop]);

  /* Get pricing recommendation */
  const getPricingRecommendation = useCallback(() => {
    const [hours, goal, timeline] = pricingAnswers;
    if (hours === "low" && timeline === "relaxed") {
      return { plan: "Free", price: "$0", reason: "Your schedule is light, so start with our free test and sandbox courses. Upgrade when you're ready!", cta: "Start Free", link: "/test" };
    }
    if (hours === "high" || goal === "university" || timeline === "asap") {
      return { plan: "Pro Annual", price: "$199/year", reason: "With your intensive schedule and goals, the annual plan saves you $149 and gives you unlimited everything. That's only 54 cents per day!", cta: "Get Pro Annual", link: "/pricing" };
    }
    return { plan: "Pro Monthly", price: "$29/month", reason: "This gives you unlimited tests, all courses, and full community access. Perfect for steady progress. You can cancel anytime.", cta: "Get Pro Monthly", link: "/pricing" };
  }, [pricingAnswers]);

  /* Speak hovered option */
  const handleOptionHover = useCallback((option: { speak?: string; desc?: string }) => {
    if (!isMuted && (option.speak || option.desc)) {
      speak(option.speak || option.desc || "");
    }
  }, [isMuted, speak]);

  /* Current step data */
  const currentDiscovery = DISCOVERY_FLOW[discoveryStep];
  const currentPricing = PRICING_FLOW[pricingStep];
  const routingMsg = phase === "routing" ? getRoutingMessage(interest, level) : null;
  const pricingRec = phase === "idle" && pricingAnswers.length === 3 ? getPricingRecommendation() : null;

  /* Breath scale */
  const breathScale = 1 + Math.sin((breathPhase * Math.PI) / 180) * 0.02;

  /* ═══════ RENDER ═══════ */
  return (
    <>
      {/* ── Minimized Avatar Pill ── */}
      {!showPanel && (
        <button
          onClick={() => { setShowPanel(true); setPhase(firstVisit ? "discovery" : "idle"); }}
          className="fixed bottom-6 right-6 z-[80] group"
          aria-label="Open Lexi AI Concierge"
        >
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
          <div
            className="relative flex items-center gap-2.5 pl-2 pr-4 py-2 bg-gradient-to-r from-[#14143a] to-[#1a1a4a] border border-cyan-500/30 rounded-full shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all hover:scale-105"
            style={{ transform: `scale(${breathScale})` }}
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-cyan-500/30 shrink-0">
              <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
              {isSpeaking && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="flex gap-[2px] h-3 items-end">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-[2px] bg-cyan-400 rounded-full animate-bounce" style={{ height: "60%", animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-white/80">Ask Lexi</span>
            {isMuted && <VolumeX size={12} className="text-white/30" />}
          </div>
        </button>
      )}

      {/* ── Main Panel ── */}
      {showPanel && (
        <div
          ref={panelRef}
          className="fixed bottom-6 right-6 z-[90] w-[420px] max-w-[calc(100vw-2rem)]"
        >
          <div className="relative bg-gradient-to-b from-[#14143a] to-[#0c0c24] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            style={{ boxShadow: "0 0 60px rgba(6, 182, 212, 0.12)" }}>

            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

            {/* Header */}
            <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-cyan-500/30">
                    <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
                  </div>
                  {isSpeaking && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#14143a] animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Lexi</p>
                  <p className="text-[10px] text-cyan-400/60">
                    {phase === "discovery" && "Getting to know you..."}
                    {phase === "routing" && "Your personal guide"}
                    {phase === "pricing" && "Finding your plan"}
                    {phase === "idle" && "Your AI Concierge"}
                    {phase === "coach" && "Your progress coach"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-lg transition-colors ${isMuted ? "text-red-400 hover:bg-red-500/10" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}
                  title={isMuted ? "Unmute Lexi" : "Mute Lexi"}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <button
                  onClick={() => { setShowPanel(false); stop(); }}
                  className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
                  title="Minimize"
                >
                  <Minimize2 size={15} />
                </button>
                <button
                  onClick={() => { setShowPanel(false); setPhase("minimized"); stop(); }}
                  className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
                  title="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </header>

            {/* ═══ Content Area ═══ */}
            <div className="px-5 py-4 max-h-[420px] overflow-y-auto">

              {/* ── DISCOVERY PHASE ── */}
              {phase === "discovery" && currentDiscovery && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-500/20 shrink-0 mt-0.5">
                      <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80 leading-relaxed">{currentDiscovery.question}</p>
                      <button
                        onClick={() => speak(currentDiscovery.speak)}
                        className="mt-1.5 flex items-center gap-1.5 text-[10px] text-cyan-400/50 hover:text-cyan-400 transition-colors"
                      >
                        {isSpeaking ? <Square size={8} /> : <Play size={8} />}
                        {isSpeaking ? "Speaking..." : "Listen"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 ml-10">
                    {currentDiscovery.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDiscoveryOption(opt.value)}
                        onMouseEnter={() => { setHoveredOption(idx); handleOptionHover(opt); }}
                        onMouseLeave={() => setHoveredOption(null)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                          hoveredOption === idx
                            ? "bg-cyan-500/10 border-cyan-500/30 text-white"
                            : "bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/5 hover:border-white/10"
                        }`}
                      >
                        <span className={`p-1.5 rounded-lg ${hoveredOption === idx ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-white/30"}`}>
                          {opt.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{opt.label}</p>
                          {opt.desc && <p className="text-[11px] text-white/30">{opt.desc}</p>}
                        </div>
                        <ChevronRight size={14} className="text-white/20" />
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center gap-1.5 mt-4">
                    {DISCOVERY_FLOW.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === discoveryStep ? "bg-cyan-400" : i < discoveryStep ? "bg-cyan-400/30" : "bg-white/10"
                      }`} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── ROUTING PHASE ── */}
              {phase === "routing" && routingMsg && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-500/20 shrink-0 mt-0.5">
                      <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{routingMsg.text}</p>
                      <button
                        onClick={() => speak(routingMsg.speak)}
                        className="mt-1.5 flex items-center gap-1.5 text-[10px] text-cyan-400/50 hover:text-cyan-400 transition-colors"
                      >
                        {isSpeaking ? <Square size={8} /> : <Play size={8} />}
                        {isSpeaking ? "Speaking..." : "Listen again"}
                      </button>
                    </div>
                  </div>

                  <div className="ml-10 space-y-2">
                    <a
                      href={routingMsg.link}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
                    >
                      {routingMsg.cta}
                      <ArrowRight size={16} />
                    </a>
                    <button
                      onClick={() => { setPhase("idle"); stop(); }}
                      className="w-full py-2.5 text-sm text-white/40 hover:text-white/60 transition-colors"
                    >
                      Explore on my own
                    </button>
                  </div>
                </div>
              )}

              {/* ── PRICING PHASE ── */}
              {phase === "pricing" && currentPricing && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-500/20 shrink-0 mt-0.5">
                      <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">{currentPricing.question}</p>
                      <button
                        onClick={() => speak(currentPricing.speak)}
                        className="mt-1.5 flex items-center gap-1.5 text-[10px] text-cyan-400/50 hover:text-cyan-400 transition-colors"
                      >
                        {isSpeaking ? <Square size={8} /> : <Play size={8} />}
                        {isSpeaking ? "Speaking..." : "Listen"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 ml-10">
                    {currentPricing.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePricingOption(opt.value)}
                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-white/70 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-white transition-all text-left flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        <ChevronRight size={14} className="text-white/20" />
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center gap-1.5 mt-4">
                    {PRICING_FLOW.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === pricingStep ? "bg-cyan-400" : i < pricingStep ? "bg-cyan-400/30" : "bg-white/10"
                      }`} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── PRICING RECOMMENDATION ── */}
              {pricingRec && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-500/20 shrink-0 mt-0.5">
                      <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">{pricingRec.reason}</p>
                    </div>
                  </div>

                  <div className="ml-10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-white">{pricingRec.plan}</span>
                      <span className="text-xl font-bold text-cyan-400">{pricingRec.price}</span>
                    </div>
                    <a
                      href={pricingRec.link}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
                    >
                      {pricingRec.cta}
                      <ArrowRight size={16} />
                    </a>
                  </div>

                  <button
                    onClick={() => setPhase("idle")}
                    className="w-full py-2 text-sm text-white/30 hover:text-white/50 transition-colors"
                  >
                    See all plans
                  </button>
                </div>
              )}

              {/* ── IDLE / MAIN MENU ── */}
              {phase === "idle" && !pricingRec && (
                <div className="animate-in fade-in duration-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-500/20 shrink-0 mt-0.5">
                      <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm text-white/70">How can I help you today?</p>
                  </div>

                  <div className="ml-10 grid grid-cols-2 gap-2">
                    {[
                      { icon: <Target size={14} />, label: "Find my level", speak: "Help me find my English level", action: () => { setInterest("test"); setLevel("unknown"); setPhase("routing"); } },
                      { icon: <BookOpen size={14} />, label: "Explore courses", speak: "Show me the courses", action: () => { setInterest("courses"); setLevel("beginner"); setPhase("routing"); } },
                      { icon: <Users size={14} />, label: "Community", speak: "Tell me about the community", action: () => { setInterest("community"); setLevel("intermediate"); setPhase("routing"); } },
                      { icon: <Zap size={14} />, label: "Find my plan", speak: "Help me choose a plan", action: startPricing },
                      { icon: <RotateCcw size={14} />, label: "Start over", speak: "Start over", action: () => { setDiscoveryStep(0); setInterest(null); setLevel(null); setPhase("discovery"); } },
                      { icon: <Mic size={14} />, label: "How to use", speak: "How do I use this platform", action: () => speak("TestCEFR has three main features. First, take a free CEFR test to find your English level. Second, explore structured courses with videos, vocabulary, and quizzes. Third, join SpeakSpace to practice speaking with other learners. You can also ask me anything anytime!") },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={item.action}
                        onMouseEnter={() => { if (!isMuted) speak(item.speak); }}
                        className="flex flex-col items-center gap-1.5 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/20 transition-all text-center"
                      >
                        <span className="text-cyan-400/60">{item.icon}</span>
                        <span className="text-xs text-white/60">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── COACH PHASE (placeholder) ── */}
              {phase === "coach" && (
                <div className="text-center py-8">
                  <GraduationCap size={32} className="text-cyan-400/30 mx-auto mb-3" />
                  <p className="text-sm text-white/50">Your progress coach will appear here after you complete your first activity.</p>
                </div>
              )}
            </div>

            {/* ── Quick Actions Footer ── */}
            {phase !== "discovery" && phase !== "pricing" && (
              <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle size={12} className="text-white/20" />
                  <span className="text-[10px] text-white/20">Ask me anything</span>
                </div>
                <button
                  onClick={() => { setDiscoveryStep(0); setInterest(null); setLevel(null); setPhase("discovery"); }}
                  className="text-[10px] text-cyan-400/50 hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <RotateCcw size={10} />
                  Retake guide
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
