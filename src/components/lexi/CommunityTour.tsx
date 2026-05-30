"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users, MessageCircle, Mic, Camera, GraduationCap,
  ChevronRight, ChevronLeft, SkipForward, Volume2, VolumeX,
  MapPin, ArrowRight, X, Sparkles
} from "lucide-react";

/* ═════════════════════════════════════════
   COMMUNITY TOUR COMPONENT
   Step-by-step guided tour with Lexi voice
   ═════════════════════════════════════════ */

interface TourStep {
  id: string;
  title: string;
  lexieText: string;
  lexieSpeak: string;
  description: string;
  icon: React.ReactNode;
  highlightSelector?: string;
  ctaLabel: string;
  ctaLink: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to the Community!",
    lexieText: "Welcome to the TestCEFR community! This is where you practice English with real people from around the world. Let me show you around — it'll take just a minute.",
    lexieSpeak: "Welcome to the TestCEFR community! This is where you practice English with real people from around the world. Let me show you around!",
    description: "Connect, practice, and grow with learners worldwide.",
    icon: <Sparkles size={20} />,
    ctaLabel: "Start Tour",
    ctaLink: "#",
  },
  {
    id: "partners",
    title: "Find a Language Partner",
    lexieText: "Browse profiles of other learners, filter by their level, native language, and interests. Find someone at your level and send them a friend request. Studying together makes learning faster and more fun!",
    lexieSpeak: "Browse profiles of other learners. Filter by level and interests. Find someone at your level and connect. Studying together makes learning faster and more fun!",
    description: "Filter by level, language, and interests. Send friend requests and study together.",
    icon: <Users size={20} />,
    highlightSelector: "[data-tour='partners']",
    ctaLabel: "Browse Partners",
    ctaLink: "/community?tab=partners",
  },
  {
    id: "chatroom",
    title: "Global Chatroom",
    lexieText: "This is our Global Chatroom — a live text chat where you can practice writing, ask questions, and meet learners from all levels. We have channels for beginners, intermediate, and advanced learners. Don't be shy — everyone is here to learn!",
    lexieSpeak: "This is our Global Chatroom — live text chat with channels for every level. Practice writing, ask questions, meet learners worldwide. Don't be shy!",
    description: "Live text chat with dedicated channels for every CEFR level.",
    icon: <MessageCircle size={20} />,
    highlightSelector: "[data-tour='chatroom']",
    ctaLabel: "Join Chatroom",
    ctaLink: "/community/chatroom",
  },
  {
    id: "speakspace",
    title: "SpeakSpace Voice Rooms",
    lexieText: "SpeakSpace is where the real magic happens. Join live voice rooms to practice speaking in real-time. You can join topic-based rooms, find 1-on-1 conversation partners, or join study groups. It's like having a global classroom!",
    lexieSpeak: "SpeakSpace is where the magic happens. Join live voice rooms to practice speaking in real time. Find conversation partners or study groups. It's like a global classroom!",
    description: "Live voice rooms, 1-on-1 matching, and group conversations.",
    icon: <Mic size={20} />,
    highlightSelector: "[data-tour='speakspace']",
    ctaLabel: "Explore SpeakSpace",
    ctaLink: "/speakspace",
  },
  {
    id: "moments",
    title: "Moments Feed",
    lexieText: "Moments is our social feed — share your learning journey, post vocabulary you learned, celebrate achievements, and see what other learners are up to. It's a great way to stay motivated!",
    lexieSpeak: "Moments is our social feed. Share your learning journey, celebrate achievements, and see what other learners are doing. Stay motivated!",
    description: "Share your learning journey and celebrate achievements.",
    icon: <Camera size={20} />,
    highlightSelector: "[data-tour='moments']",
    ctaLabel: "View Moments",
    ctaLink: "/community?tab=moments",
  },
  {
    id: "study-groups",
    title: "Study Groups",
    lexieText: "Study Groups let you form or join focused learning groups. Whether you want daily conversation practice, grammar study, or exam prep buddies — there's a group for you. Or create your own!",
    lexieSpeak: "Study Groups let you form or join focused learning groups. Daily conversation practice, grammar study, exam prep — there's a group for every goal. Or create your own!",
    description: "Form or join focused groups for daily practice and study.",
    icon: <GraduationCap size={20} />,
    highlightSelector: "[data-tour='study-groups']",
    ctaLabel: "Find a Study Group",
    ctaLink: "/community?tab=groups",
  },
  {
    id: "wrap-up",
    title: "You're All Set!",
    lexieText: "That's the community! You can access any of these features from the tabs at the top of the page. I'll be here if you need me. Now — want to find a conversation partner or jump into a chatroom?",
    lexieSpeak: "That's the community! Access any feature from the tabs above. I'll be here if you need me. Now, want to find a conversation partner or join a chatroom?",
    description: "Explore the community your way. Lexi is always here to help!",
    icon: <MapPin size={20} />,
    ctaLabel: "Explore on My Own",
    ctaLink: "#",
  },
];

function useVoice() {
  const [isMuted, setIsMuted] = useState(false);
  const speak = useCallback((text: string) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    utter.voice = voices.find((v) => v.name.includes("Female") && v.lang.startsWith("en")) || voices[0];
    utter.rate = 0.9;
    utter.pitch = 1.05;
    utter.volume = 0.8;
    window.speechSynthesis.speak(utter);
  }, [isMuted]);
  const toggleMute = useCallback(() => {
    setIsMuted((m) => {
      if (!m) window.speechSynthesis.cancel();
      return !m;
    });
  }, []);
  return { speak, isMuted, toggleMute };
}

export default function CommunityTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(true);
  const { speak, isMuted, toggleMute } = useVoice();

  /* Check if user has seen tour */
  useEffect(() => {
    try {
      const seen = localStorage.getItem("community-tour-seen");
      if (!seen) {
        setHasSeenTour(false);
        const timer = setTimeout(() => setIsActive(true), 2000);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  /* Speak on step change */
  useEffect(() => {
    if (isActive) {
      const step = TOUR_STEPS[currentStep];
      const timer = setTimeout(() => speak(step.lexieSpeak), 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isActive, speak]);

  /* Stop speech on unmount */
  useEffect(() => {
    return () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, []);

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const isFirst = currentStep === 0;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
  };

  const handleSkip = () => {
    setIsActive(false);
    try { localStorage.setItem("community-tour-seen", "true"); } catch {}
    window.speechSynthesis?.cancel();
  };

  const handleComplete = () => {
    setIsActive(false);
    try { localStorage.setItem("community-tour-seen", "true"); } catch {}
    window.speechSynthesis?.cancel();
  };

  /* Minimized prompt (before tour starts) */
  if (!isActive && !hasSeenTour) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={() => setIsActive(true)}
          className="flex items-center gap-3 pl-3 pr-5 py-3 bg-gradient-to-r from-[#14143a] to-[#1a1a4a] border border-cyan-500/30 rounded-2xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-105 transition-all group"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/30 shrink-0">
            <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">New here?</p>
            <p className="text-xs text-cyan-400/60">Let me show you around! →</p>
          </div>
        </button>
      </div>
    );
  }

  /* Tour is complete / skipped */
  if (!isActive) return null;

  /* Active Tour */
  return (
    <>
      {/* Spotlight overlay */}
      <div className="fixed inset-0 z-[85] bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-300" onClick={handleSkip} />

      {/* Tour panel */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-full max-w-lg px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative bg-gradient-to-b from-[#14143a] to-[#0c0c24] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          style={{ boxShadow: "0 0 60px rgba(6, 182, 212, 0.12)" }}>

          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

          {/* Header with step progress */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {TOUR_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentStep ? "bg-cyan-400 w-4" :
                      i < currentStep ? "bg-cyan-400/40" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-white/30 ml-2">
                {currentStep + 1} / {TOUR_STEPS.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={toggleMute} className="p-1.5 rounded-lg text-white/20 hover:text-white/40 transition-colors">
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              {!isFirst && (
                <button onClick={handlePrev} className="p-1.5 rounded-lg text-white/20 hover:text-white/40 hover:bg-white/5 transition-colors">
                  <ChevronLeft size={14} />
                </button>
              )}
              <button onClick={handleSkip} className="p-1.5 rounded-lg text-white/20 hover:text-white/40 hover:bg-white/5 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                {step.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-white/30">{step.description}</p>
              </div>
            </div>

            {/* Lexi message */}
            <div className="flex items-start gap-3 mb-4 bg-white/[0.02] rounded-xl p-3 border border-white/5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/20 shrink-0">
                <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/70 leading-relaxed">{step.lexieText}</p>
                <button
                  onClick={() => speak(step.lexieSpeak)}
                  className="mt-1.5 flex items-center gap-1 text-[10px] text-cyan-400/50 hover:text-cyan-400 transition-colors"
                >
                  <Volume2 size={8} />
                  Listen again
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              {step.id === "wrap-up" ? (
                <>
                  <a
                    href="/community?tab=partners"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium rounded-xl hover:bg-cyan-500/20 transition-all text-sm"
                  >
                    <Users size={14} />
                    Find Partner
                  </a>
                  <a
                    href="/community/chatroom"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium rounded-xl hover:bg-cyan-500/20 transition-all text-sm"
                  >
                    <MessageCircle size={14} />
                    Join Chat
                  </a>
                  <button
                    onClick={handleComplete}
                    className="flex-1 py-2.5 text-sm text-white/30 hover:text-white/50 transition-colors"
                  >
                    Explore
                  </button>
                </>
              ) : (
                <>
                  {step.ctaLink !== "#" && (
                    <a
                      href={step.ctaLink}
                      onClick={handleComplete}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all text-sm shadow-lg shadow-cyan-500/20"
                    >
                      {step.ctaLabel}
                      <ArrowRight size={14} />
                    </a>
                  )}
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/40 hover:text-white/60 transition-colors"
                  >
                    {isLast ? "Finish" : "Next"}
                    <ChevronRight size={14} />
                  </button>
                  <button
                    onClick={handleSkip}
                    className="ml-auto flex items-center gap-1 text-xs text-white/20 hover:text-white/30 transition-colors"
                  >
                    <SkipForward size={12} />
                    Skip tour
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
