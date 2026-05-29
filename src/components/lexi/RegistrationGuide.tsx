"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Mail, MailCheck, RefreshCw, AlertTriangle, ChevronRight,
  Sparkles, Inbox, Send, ArrowRight, HelpCircle, Volume2, VolumeX
} from "lucide-react";

/* ═════════════════════════════════════════
   REGISTRATION GUIDE COMPONENT
   Guides users through registration and
   email activation with Lexi voice
   ═════════════════════════════════════════ */

interface RegistrationGuideProps {
  stage: "pre-register" | "post-register" | "verify-pending" | "verify-success" | "verify-expired";
  userEmail?: string;
  onResendEmail?: () => void;
  onNavigate?: (path: string) => void;
}

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

export default function RegistrationGuide({
  stage,
  userEmail = "your email",
  onResendEmail,
  onNavigate,
}: RegistrationGuideProps) {
  const { speak, isMuted, toggleMute } = useVoice();
  const [resendCount, setResendCount] = useState(0);
  const [showSpamTip, setShowSpamTip] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  /* Generate confetti */
  useEffect(() => {
    if (stage === "post-register" || stage === "verify-success") {
      const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        color: ["#06b6d4", "#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ec4899"][Math.floor(Math.random() * 6)],
      }));
      setConfetti(pieces);
    }
  }, [stage]);

  /* Auto-speak on mount */
  useEffect(() => {
    const timer = setTimeout(() => {
      switch (stage) {
        case "pre-register":
          speak("Hi! Before you start — after you fill out this form, you'll need to check your email for an activation link. Make sure to check your spam folder too!");
          break;
        case "post-register":
          speak("Welcome to TestCEFR! Your account has been created. Now — check your email inbox for an activation link. Click that link to activate your account. Can't find it? Check your spam folder.");
          break;
        case "verify-success":
          speak("Your email is confirmed! You're all set. Let's get started!");
          break;
        case "verify-expired":
          speak("This link has expired — but no worries! Click below to get a fresh activation link.");
          break;
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [stage, speak]);

  /* ─── PRE-REGISTER ─── */
  if (stage === "pre-register") {
    return (
      <div className="w-full mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="relative bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-5 overflow-hidden">
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="absolute w-1 h-1 rounded-full bg-cyan-400/30 animate-float"
                style={{ left: `${20 + i * 25}%`, top: `${30 + (i % 2) * 40}%`, animationDelay: `${i * 0.5}s` }} />
            ))}
          </div>

          <div className="relative flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-semibold text-cyan-300">Lexi says:</p>
                <button onClick={toggleMute} className="text-white/20 hover:text-white/40 transition-colors">
                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                Before you start — after you fill out this form, you'll need to <strong className="text-cyan-300">check your email for an activation link</strong>. Make sure to check your spam folder too! Without activating, you won't be able to log in.
              </p>
              <div className="flex items-center gap-2 text-xs text-white/40 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold text-cyan-400">1</div>
                  <span>Fill form</span>
                </div>
                <ChevronRight size={12} className="text-white/20" />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold text-cyan-400">2</div>
                  <span>Check email</span>
                </div>
                <ChevronRight size={12} className="text-white/20" />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold text-cyan-400">3</div>
                  <span>Click link</span>
                </div>
                <ChevronRight size={12} className="text-white/20" />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-[10px] font-bold text-green-400">
                    <MailCheck size={10} />
                  </div>
                  <span>Done!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`@keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} } .animate-float{animation:float 3s ease-in-out infinite}`}</style>
      </div>
    );
  }

  /* ─── POST-REGISTER ─── */
  if (stage === "post-register") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map((c) => (
            <div key={c.id} className="absolute w-2 h-2 rounded-sm animate-confetti-fall"
              style={{
                left: `${c.x}%`, top: "-10px",
                backgroundColor: c.color,
                animationDelay: `${c.delay}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }} />
          ))}
        </div>

        <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in duration-300">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl" />
          <div className="relative bg-gradient-to-b from-[#14143a] to-[#0c0c24] border border-white/10 rounded-3xl p-8 text-center overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
            <button onClick={toggleMute} className="absolute top-4 right-4 text-white/20 hover:text-white/40 transition-colors">
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            {/* Success icon */}
            <div className="relative inline-flex items-center justify-center mb-5">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <Sparkles size={36} className="text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Welcome to TestCEFR!</h2>
            <p className="text-sm text-white/50 mb-6">Your account has been created successfully.</p>

            {/* Important message */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-300 mb-1">Check Your Email!</p>
                  <p className="text-xs text-white/60 leading-relaxed">
                    We've sent an activation link to <strong className="text-white/80">{userEmail}</strong>. Click that link to activate your account. Without activation, you won't be able to log in.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 steps */}
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Inbox size={14} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Step 1: Check your inbox</p>
                  <p className="text-xs text-white/30">Look for an email from TestCEFR</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <MailCheck size={14} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Step 2: Click the activation link</p>
                  <p className="text-xs text-white/30">One click and you're activated</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Step 3: Start learning!</p>
                  <p className="text-xs text-white/30">You're all set</p>
                </div>
              </div>
            </div>

            {/* Spam tip toggle */}
            {!showSpamTip ? (
              <button onClick={() => setShowSpamTip(true)} className="text-xs text-white/30 hover:text-white/50 transition-colors mb-4 flex items-center gap-1 mx-auto">
                <HelpCircle size={10} />
                Can't find the email?
              </button>
            ) : (
              <div className="bg-white/[0.03] rounded-xl p-3 mb-4 border border-white/5 animate-in fade-in">
                <p className="text-xs text-white/50 leading-relaxed mb-3">
                  Check your <strong className="text-white/70">spam</strong> or <strong className="text-white/70">junk</strong> folder. Sometimes activation emails end up there. Still nothing? Click below to resend.
                </p>
                <button
                  onClick={() => { setResendCount((c) => c + 1); onResendEmail?.(); }}
                  disabled={resendCount > 0}
                  className="flex items-center gap-2 mx-auto px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-sm text-cyan-400 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={14} className={resendCount > 0 ? "animate-spin" : ""} />
                  {resendCount > 0 ? "Email resent!" : "Resend Activation Email"}
                </button>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={() => onNavigate?.("/login")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
            >
              I've Activated — Go to Login
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <style>{`
          @keyframes confetti-fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .animate-confetti-fall { animation: confetti-fall linear forwards; }
        `}</style>
      </div>
    );
  }

  /* ─── VERIFY SUCCESS ─── */
  if (stage === "verify-success") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="relative w-full max-w-sm animate-in zoom-in-95 fade-in duration-300">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
          <div className="relative bg-gradient-to-b from-[#14143a] to-[#0c0c24] border border-green-500/20 rounded-3xl p-8 text-center">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-cyan-500" />
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <MailCheck size={32} className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-sm text-white/50 mb-6">Your account is now active. Let's start your English journey!</p>
            <div className="space-y-2">
              <button onClick={() => onNavigate?.("/test")}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20">
                <Sparkles size={16} />
                Take Free CEFR Test
              </button>
              <button onClick={() => onNavigate?.("/courses")}
                className="w-full py-2.5 text-sm text-white/40 hover:text-white/60 transition-colors">
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── VERIFY EXPIRED ─── */
  if (stage === "verify-expired") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="relative w-full max-w-sm animate-in zoom-in-95 fade-in duration-300">
          <div className="relative bg-gradient-to-b from-[#14143a] to-[#0c0c24] border border-amber-500/20 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
              <RefreshCw size={28} className="text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Link Expired</h2>
            <p className="text-sm text-white/50 mb-6">This activation link has expired. No worries — get a fresh one below.</p>
            <button onClick={onResendEmail}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all">
              <Send size={16} />
              Send New Activation Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── VERIFY PENDING ─── */
  if (stage === "verify-pending") {
    return (
      <div className="w-full mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/30 shrink-0">
              <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-amber-300">Lexi says:</p>
                <button onClick={toggleMute} className="text-white/20 hover:text-white/40 transition-colors">
                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-3">
                It looks like your email hasn't been activated yet. Check your inbox for the activation link — don't forget your spam folder!
              </p>
              <div className="flex items-center gap-2">
                <button onClick={onResendEmail}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                  <RefreshCw size={12} />
                  Resend Email
                </button>
                <button onClick={() => speak("Check your inbox for the activation link from TestCEFR. Can't find it? Check your spam folder. Still nothing? Click resend email.")}
                  className="p-1.5 text-white/20 hover:text-white/40 transition-colors">
                  <Volume2 size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
