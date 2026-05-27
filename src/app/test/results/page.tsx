'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import {
  CheckCircle2, XCircle, ChevronDown, ChevronUp, ArrowRight,
  RotateCcw, BookOpen, Award, Loader2, AlertCircle, Sparkles,
  Trophy, Target, BarChart3, LogIn, SpellCheck, BookMarked,
  Headphones, Mic, PenTool
} from 'lucide-react';

/* ======================================================
   TYPES
   ====================================================== */
interface QuestionResult {
  questionId: string;
  questionType: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  userAnswer: number | null;
  isCorrect: boolean;
  level: string;
  category: string;
  explanation: string | null;
  aiScore?: number | null;
  aiFeedback?: string | null;
}

interface LevelPerformance {
  level: string;
  correct: number;
  total: number;
  percentage: number;
}

interface SkillResult {
  skill: string;
  score: number;
  cefrLevel: string;
  color: string;
  questions: QuestionResult[];
  levelPerformance: LevelPerformance[];
}

interface CertificateSkill {
  skill: string;
  completed: boolean;
  color: string;
}

interface ResultsData {
  skill: SkillResult;
  overall: {
    assessmentId: string;
    cefrLevel: string | null;
    score: number | null;
    completedAt: string | null;
  };
  certificateProgress: {
    totalSkills: number;
    completedSkills: number;
    skills: CertificateSkill[];
  };
  cefrBadgeColors: Record<string, string>;
  nextSkill: string | null;
}

/* ======================================================
   CONSTANTS
   ====================================================== */
const SKILL_FLOW = ['grammar', 'vocabulary', 'reading', 'listening', 'speaking', 'writing'];

const SKILL_LABELS: Record<string, string> = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  reading: 'Reading',
  listening: 'Listening',
  speaking: 'Speaking',
  writing: 'Writing',
};

const SKILL_COLORS: Record<string, string> = {
  grammar: '#f43f5e',
  vocabulary: '#14b8a6',
  reading: '#3b82f6',
  listening: '#22c55e',
  speaking: '#f59e0b',
  writing: '#a855f7',
};

const SKILL_ICONS: Record<string, React.ReactNode> = {
  grammar: <SpellCheck className="h-4 w-4" />,
  vocabulary: <BookMarked className="h-4 w-4" />,
  reading: <BookOpen className="h-4 w-4" />,
  listening: <Headphones className="h-4 w-4" />,
  speaking: <Mic className="h-4 w-4" />,
  writing: <PenTool className="h-4 w-4" />,
};

const CEFR_BADGE_COLORS: Record<string, string> = {
  A1: '#94a3b8',
  A2: '#22c55e',
  B1: '#3b82f6',
  B2: '#8b5cf6',
  C1: '#f59e0b',
  C2: '#ef4444',
};

/* ======================================================
   ANIMATED SCORE CIRCLE
   ====================================================== */
function ScoreCircle({ score, color }: { score: number; color: string }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedOffset, setAnimatedOffset] = useState(283);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
      const offset = circumference - (score / 100) * circumference;
      setAnimatedOffset(offset);
    }, 300);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
        />
        {/* Animated progress ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">
          {animatedScore}
        </span>
        <span className="text-xs font-medium text-white/50">out of 100</span>
      </div>
    </div>
  );
}

/* ======================================================
   CONFETTI ANIMATION
   ====================================================== */
function ConfettiOverlay() {
  const colors = ['#f43f5e', '#14b8a6', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ffffff'];
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm opacity-80"
          style={{
            left: `${p.x}%`,
            top: '-5%',
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

/* ======================================================
   EXPANDABLE QUESTION CARD
   ====================================================== */
function QuestionCard({ question, index }: { question: QuestionResult; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-colors hover:bg-white/[0.07]">
      <button
        className="flex w-full items-center gap-3 p-4 text-left cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={`Question ${index + 1}: ${question.isCorrect ? 'Correct' : 'Incorrect'}`}
      >
        {/* Status indicator */}
        {question.isCorrect ? (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
        ) : (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/20">
            <XCircle className="h-4 w-4 text-red-400" />
          </div>
        )}

        {/* Question text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/90 truncate">
            {question.questionText || `Question ${index + 1}`}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${CEFR_BADGE_COLORS[question.level] || '#8b5cf6'}20`,
                color: CEFR_BADGE_COLORS[question.level] || '#8b5cf6',
              }}
            >
              {question.level}
            </span>
            {question.aiScore != null && (
              <span className="text-[10px] text-white/40">
                AI Score: {question.aiScore}/100
              </span>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        {!question.isCorrect && (
          <div className="shrink-0 text-white/40">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        )}
      </button>

      {/* Expanded content for wrong answers */}
      {expanded && !question.isCorrect && (
        <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-3">
          {question.options.length > 0 && (
            <div className="space-y-1.5">
              {question.options.map((opt, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    i === question.correctIndex
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : i === question.userAnswer
                        ? 'bg-red-500/15 text-red-300'
                        : 'bg-white/5 text-white/60'
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold bg-white/10">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {i === question.correctIndex && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                  {i === question.userAnswer && i !== question.correctIndex && <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />}
                </div>
              ))}
            </div>
          )}

          {question.aiFeedback && (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
              <p className="text-xs font-semibold text-amber-400 mb-1">AI Feedback</p>
              <p className="text-xs text-white/70">{question.aiFeedback}</p>
            </div>
          )}

          {question.explanation && (
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-xs font-semibold text-white/50 mb-1">Explanation</p>
              <p className="text-xs text-white/70">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ======================================================
   LEVEL PERFORMANCE BARS
   ====================================================== */
function LevelPerformanceBars({ levels, color }: { levels: LevelPerformance[]; color: string }) {
  const activeLevels = levels.filter((l) => l.total > 0);

  if (activeLevels.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-white/40">No level data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeLevels.map((level) => (
        <div key={level.level} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold"
                style={{
                  backgroundColor: `${CEFR_BADGE_COLORS[level.level] || '#8b5cf6'}25`,
                  color: CEFR_BADGE_COLORS[level.level] || '#8b5cf6',
                }}
              >
                {level.level}
              </span>
              <span className="text-xs text-white/50">
                {level.correct}/{level.total} correct
              </span>
            </div>
            <span className="text-sm font-semibold text-white/80">{level.percentage}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${level.percentage}%`,
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}40`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ======================================================
   CERTIFICATE PROGRESS TRACKER
   ====================================================== */
function CertificateProgress({ progress }: { progress: ResultsData['certificateProgress'] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-400" />
          <span className="text-sm font-semibold text-white">Certificate Progress</span>
        </div>
        <span className="text-sm font-medium text-white/60">
          {progress.completedSkills}/{progress.totalSkills} skills
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000 ease-out"
          style={{
            width: `${(progress.completedSkills / progress.totalSkills) * 100}%`,
          }}
        />
      </div>

      {/* Skill dots */}
      <div className="flex items-center justify-between gap-2">
        {progress.skills.map((s) => (
          <div key={s.skill} className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                s.completed
                  ? 'border-transparent'
                  : 'border-white/10 bg-white/5'
              }`}
              style={s.completed ? { backgroundColor: `${s.color}25`, borderColor: s.color } : {}}
            >
              <div style={{ color: s.completed ? s.color : 'rgba(255,255,255,0.3)' }}>
                {SKILL_ICONS[s.skill]}
              </div>
            </div>
            <span className={`text-[10px] font-medium ${s.completed ? 'text-white/70' : 'text-white/30'}`}>
              {SKILL_LABELS[s.skill]?.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================================================
   MAIN RESULTS PAGE
   ====================================================== */
export default function TestResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authIsLoading, accessToken } = useAuthStore();

  const skill = searchParams.get('skill') || 'grammar';

  const [data, setData] = useState<ResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch results
  const fetchResults = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      if (accessToken && accessToken !== 'null' && accessToken !== 'undefined') {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      const res = await fetch(`/api/test/results?skill=${encodeURIComponent(skill)}`, {
        headers,
        credentials: 'same-origin',
      });
      const json = await res.json();
      if (res.ok) {
        setData(json);
        // Show confetti for scores >= 60
        if (json.skill?.score >= 60) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } else {
        setError(json.message || json.error || 'Failed to load results.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [skill, isAuthenticated, accessToken]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  /* ── AUTH GUARD ── */
  if (authIsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0618]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0618]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4 shadow-lg shadow-purple-500/25">
                <LogIn className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Sign in to view results</h1>
              <p className="text-sm text-white/50 mb-6">
                You need to be signed in to view your test results.
              </p>
              <Link href="/login">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  Sign in
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── LOADING STATE ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0618]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="h-16 w-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mx-auto" />
              <BarChart3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Calculating Your Results</h2>
            <p className="text-sm text-white/50">Analyzing your performance...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── ERROR STATE ── */
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0618]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold text-white mb-2">Unable to Load Results</h1>
              <p className="text-sm text-white/50 mb-6">
                {error || 'Something went wrong. Please try again.'}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={fetchResults}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </button>
                <Link href="/test">
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-colors cursor-pointer">
                    Back to Test
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { skill: skillData, overall, certificateProgress, nextSkill } = data;
  const skillColor = SKILL_COLORS[skill] || '#8b5cf6';
  const cefrBadgeColor = CEFR_BADGE_COLORS[skillData.cefrLevel] || '#8b5cf6';
  const correctCount = skillData.questions.filter((q) => q.isCorrect).length;
  const totalQuestions = skillData.questions.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0618]">
      {showConfetti && <ConfettiOverlay />}
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-8">

          {/* ── HEADER ── */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium" style={{ backgroundColor: `${skillColor}20`, color: skillColor }}>
              {SKILL_ICONS[skill]}
              {SKILL_LABELS[skill]} Results
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Your {SKILL_LABELS[skill]} Score
            </h1>
            {overall.completedAt && (
              <p className="text-sm text-white/40">
                Completed {new Date(overall.completedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>

          {/* ── SCORE + CEFR BADGE ── */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Animated Score Circle */}
              <div className="shrink-0">
                <ScoreCircle score={skillData.score} color={skillColor} />
              </div>

              <div className="flex-1 space-y-5 text-center sm:text-left">
                {/* CEFR Level Badge */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-2">Your CEFR Level</p>
                  <div
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-lg font-bold"
                    style={{
                      backgroundColor: `${cefrBadgeColor}20`,
                      color: cefrBadgeColor,
                      boxShadow: `0 0 20px ${cefrBadgeColor}15`,
                    }}
                  >
                    <Trophy className="h-5 w-5" />
                    {skillData.cefrLevel}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-center sm:justify-start gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">{correctCount}</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/40">Correct</p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">{totalQuestions - correctCount}</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/40">Incorrect</p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white/80">{totalQuestions}</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/40">Total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── LEVEL PERFORMANCE BARS ── */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Target className="h-5 w-5 text-white/60" />
              <h2 className="text-lg font-semibold text-white">Performance by Level</h2>
            </div>
            <LevelPerformanceBars levels={skillData.levelPerformance} color={skillColor} />
          </div>

          {/* ── PER-QUESTION BREAKDOWN ── */}
          {skillData.questions.length > 0 && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-white/60" />
                  <h2 className="text-lg font-semibold text-white">Question Breakdown</h2>
                </div>
                <span className="text-xs text-white/40">
                  {correctCount}/{totalQuestions} correct
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {skillData.questions.map((q, i) => (
                  <QuestionCard key={q.questionId} question={q} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* ── CERTIFICATE PROGRESS ── */}
          <div className="glass-card p-6">
            <CertificateProgress progress={certificateProgress} />
          </div>

          {/* ── CTAS ── */}
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {nextSkill && (
                <Link href="/test" className="flex-1">
                  <button
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-white font-semibold transition-all duration-300 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${SKILL_COLORS[nextSkill] || '#8b5cf6'}, ${SKILL_COLORS[nextSkill] || '#8b5cf6'}cc)`,
                      boxShadow: `0 4px 20px ${SKILL_COLORS[nextSkill] || '#8b5cf6'}30`,
                    }}
                  >
                    Continue to {SKILL_LABELS[nextSkill]}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              )}
              <Link href="/test" className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  Continue Testing
                </button>
              </Link>
              <Link href="/courses" className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-colors font-semibold cursor-pointer">
                  <BookOpen className="h-4 w-4" />
                  Study Lessons
                </button>
              </Link>
            </div>

            {/* View full certificate link */}
            {certificateProgress.completedSkills === certificateProgress.totalSkills && overall.cefrLevel && (
              <div className="mt-4 text-center">
                <Link
                  href="/certificate"
                  className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Award className="h-4 w-4" />
                  View Your Certificate
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
