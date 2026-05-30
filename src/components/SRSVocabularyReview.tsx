'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  RotateCcw, ThumbsDown, ThumbsUp, Zap, ChevronRight,
  Volume2, CheckCircle2, Clock, BarChart3, Target,
  ArrowRight, Trophy, Sparkles, X
} from 'lucide-react';

/* ============================================================
   TYPES
   ============================================================ */
export interface SRSCard {
  id: string;
  word: string;
  definition: string;
  example: string;
  cefrLevel: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: string;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

export interface ReviewResult {
  cardId: string;
  rating: 1 | 2 | 3 | 4;
  newInterval: number;
  nextReviewDate: string;
}

interface SRSVocabularyReviewProps {
  cards: SRSCard[];
  onComplete: (results: ReviewResult[]) => void;
}

/* ============================================================
   SM-2 ALGORITHM
   ============================================================ */
function calculateSM2(card: SRSCard, rating: 1 | 2 | 3 | 4): { newInterval: number; newRepetitions: number; newEaseFactor: number; nextReview: string; newStatus: SRSCard['status'] } {
  let { interval, repetitions, easeFactor } = card;

  // Rating: 1=Again, 2=Hard, 3=Good, 4=Easy
  if (rating === 1) {
    // Reset - start over
    repetitions = 0;
    interval = 1; // 1 day
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else if (rating === 2) {
    // Hard - increase interval slightly
    interval = Math.max(1, Math.ceil(interval * 1.2));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
    repetitions = Math.max(0, repetitions);
  } else if (rating === 3) {
    // Good - standard interval progression
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.ceil(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Easy - accelerated interval
    if (repetitions === 0) {
      interval = 4;
    } else if (repetitions === 1) {
      interval = 10;
    } else {
      interval = Math.ceil(interval * easeFactor * 1.3);
    }
    easeFactor = Math.min(3.0, easeFactor + 0.15);
    repetitions += 1;
  }

  // Calculate next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  // Determine status
  let newStatus: SRSCard['status'] = 'learning';
  if (rating === 1) newStatus = 'learning';
  else if (repetitions >= 5 && interval >= 21) newStatus = 'mastered';
  else if (repetitions >= 2) newStatus = 'review';
  else newStatus = 'learning';

  return {
    newInterval: interval,
    newRepetitions: repetitions,
    newEaseFactor: easeFactor,
    nextReview: nextDate.toISOString(),
    newStatus,
  };
}

/* ============================================================
   CEFR LEVEL COLORS
   ============================================================ */
const CEFR_COLORS: Record<string, string> = {
  A1: 'from-cyan-500 to-cyan-600',
  A2: 'from-cyan-600 to-blue-500',
  B1: 'from-blue-500 to-indigo-500',
  B2: 'from-indigo-500 to-purple-500',
  C1: 'from-purple-500 to-violet-500',
  C2: 'from-violet-500 to-violet-600',
};

/* ============================================================
   RATING BUTTON CONFIG
   ============================================================ */
const RATING_CONFIG = [
  { rating: 1 as const, label: 'Again', shortcut: '1', color: 'red', bgClass: 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30', icon: <RotateCcw className="h-4 w-4" /> },
  { rating: 2 as const, label: 'Hard', shortcut: '2', color: 'amber', bgClass: 'bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30', icon: <ThumbsDown className="h-4 w-4" /> },
  { rating: 3 as const, label: 'Good', shortcut: '3', color: 'emerald', bgClass: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30', icon: <ThumbsUp className="h-4 w-4" /> },
  { rating: 4 as const, label: 'Easy', shortcut: '4', color: 'cyan', bgClass: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30', icon: <Zap className="h-4 w-4" /> },
];

/* ============================================================
   DEMO CARDS
   ============================================================ */
export const DEMO_SRS_CARDS: SRSCard[] = [
  { id: '1', word: 'Ephemeral', definition: 'Lasting for a very short time', example: 'The ephemeral beauty of cherry blossoms reminds us to appreciate the present.', cefrLevel: 'C1', interval: 1, repetitions: 0, easeFactor: 2.5, nextReview: new Date().toISOString(), status: 'new' },
  { id: '2', word: 'Ubiquitous', definition: 'Present, appearing, or found everywhere', example: 'Smartphones have become ubiquitous in modern society.', cefrLevel: 'C1', interval: 1, repetitions: 0, easeFactor: 2.5, nextReview: new Date().toISOString(), status: 'new' },
  { id: '3', word: 'Pragmatic', definition: 'Dealing with things sensibly and realistically', example: 'She took a pragmatic approach to solving the budget crisis.', cefrLevel: 'B2', interval: 3, repetitions: 2, easeFactor: 2.5, nextReview: new Date().toISOString(), status: 'review' },
  { id: '4', word: 'Resilient', definition: 'Able to recover quickly from difficult conditions', example: 'Children are often more resilient than adults give them credit for.', cefrLevel: 'B2', interval: 6, repetitions: 3, easeFactor: 2.6, nextReview: new Date().toISOString(), status: 'review' },
  { id: '5', word: 'Ambiguous', definition: 'Open to more than one interpretation; not having one obvious meaning', example: 'The ending of the film was deliberately ambiguous.', cefrLevel: 'B2', interval: 1, repetitions: 0, easeFactor: 2.5, nextReview: new Date().toISOString(), status: 'learning' },
  { id: '6', word: 'Meticulous', definition: 'Showing great attention to detail; very careful and precise', example: 'The meticulous craftsman spent hours ensuring every joint was perfect.', cefrLevel: 'C1', interval: 1, repetitions: 0, easeFactor: 2.5, nextReview: new Date().toISOString(), status: 'new' },
  { id: '7', word: 'Eloquent', definition: 'Fluent or persuasive in speaking or writing', example: 'She gave an eloquent speech that moved the entire audience.', cefrLevel: 'B2', interval: 10, repetitions: 4, easeFactor: 2.7, nextReview: new Date().toISOString(), status: 'review' },
  { id: '8', word: 'Benevolent', definition: 'Well-meaning and kindly; generous', example: 'The benevolent donor funded scholarships for underprivileged students.', cefrLevel: 'B2', interval: 1, repetitions: 1, easeFactor: 2.5, nextReview: new Date().toISOString(), status: 'learning' },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function SRSVocabularyReview({ cards, onComplete }: SRSVocabularyReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [startTime] = useState(Date.now());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const dueCards = useMemo(
    () => cards.filter((c) => new Date(c.nextReview) <= new Date()),
    [cards]
  );

  const totalCards = dueCards.length;
  const currentCard = dueCards[currentIndex] || null;
  const progressPct = totalCards > 0 ? ((currentIndex) / totalCards) * 100 : 0;

  /* ---- Speak word ---- */
  const speakWord = useCallback((word: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  /* ---- Handle rating ---- */
  const handleRating = useCallback(
    (rating: 1 | 2 | 3 | 4) => {
      if (!currentCard || isAnimating || isComplete) return;

      const sm2Result = calculateSM2(currentCard, rating);
      const result: ReviewResult = {
        cardId: currentCard.id,
        rating,
        newInterval: sm2Result.newInterval,
        nextReviewDate: sm2Result.nextReview,
      };

      setResults((prev) => [...prev, result]);
      setSessionStreak((prev) => (rating >= 3 ? prev + 1 : 0));

      // Animate out
      setIsAnimating(true);

      setTimeout(() => {
        if (currentIndex + 1 >= totalCards) {
          setIsComplete(true);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
        setIsFlipped(false);
        setIsAnimating(false);
      }, 300);
    },
    [currentCard, currentIndex, totalCards, isAnimating, isComplete]
  );

  /* ---- Keyboard shortcuts ---- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
        return;
      }

      if (!isFlipped) return;

      const keyMap: Record<string, 1 | 2 | 3 | 4> = {
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
      };

      if (keyMap[e.key]) {
        handleRating(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isComplete, handleRating]);

  /* ---- Auto-speak on card change ---- */
  useEffect(() => {
    if (currentCard && !isComplete) {
      const timer = setTimeout(() => speakWord(currentCard.word), 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentCard, isComplete, speakWord]);

  /* ---- Session summary ---- */
  const sessionSummary = useMemo(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    results.forEach((r) => {
      ratingCounts[r.rating]++;
    });

    const accuracy = results.length > 0
      ? Math.round(((ratingCounts[3] + ratingCounts[4]) / results.length) * 100)
      : 0;

    return {
      totalReviewed: results.length,
      again: ratingCounts[1],
      hard: ratingCounts[2],
      good: ratingCounts[3],
      easy: ratingCounts[4],
      accuracy,
      time: `${minutes}m ${seconds.toString().padStart(2, '0')}s`,
    };
  }, [results, startTime]);

  /* ---- Empty state ---- */
  if (totalCards === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/20">
            <CheckCircle2 className="h-8 w-8 text-cyan-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">All Caught Up!</h3>
        <p className="text-sm text-white/40">No cards are due for review right now. Come back later!</p>
      </div>
    );
  }

  /* ---- Session Complete ---- */
  if (isComplete) {
    return (
      <div className="glass-card p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-500 shadow-lg shadow-cyan-500/20">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">Session Complete!</h3>
          <p className="text-sm text-white/40 mt-1">Great job reviewing your vocabulary</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 text-center">
            <Target className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{sessionSummary.totalReviewed}</p>
            <p className="text-[10px] text-white/30">Cards Reviewed</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 text-center">
            <BarChart3 className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{sessionSummary.accuracy}%</p>
            <p className="text-[10px] text-white/30">Accuracy</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 text-center">
            <Clock className="h-5 w-5 text-indigo-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{sessionSummary.time}</p>
            <p className="text-[10px] text-white/30">Time Spent</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 text-center">
            <Sparkles className="h-5 w-5 text-violet-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{sessionStreak}</p>
            <p className="text-[10px] text-white/30">Best Streak</p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-white/50 mb-2">Rating Breakdown</p>
          {[
            { label: 'Again', count: sessionSummary.again, color: 'bg-red-500' },
            { label: 'Hard', count: sessionSummary.hard, color: 'bg-amber-500' },
            { label: 'Good', count: sessionSummary.good, color: 'bg-emerald-500' },
            { label: 'Easy', count: sessionSummary.easy, color: 'bg-cyan-500' },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-[11px] text-white/40 w-10">{label}</span>
              <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-500`}
                  style={{
                    width: `${sessionSummary.totalReviewed > 0 ? (count / sessionSummary.totalReviewed) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-[11px] text-white/40 w-6 text-right">{count}</span>
            </div>
          ))}
        </div>

        {/* Done Button */}
        <button
          onClick={() => onComplete(results)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-medium text-sm hover:from-cyan-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* ===== PROGRESS BAR ===== */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/40 font-medium whitespace-nowrap">
          {currentIndex + 1} / {totalCards}
        </span>
        <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {sessionStreak >= 3 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Zap className="h-3 w-3 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400">{sessionStreak}</span>
          </div>
        )}
      </div>

      {/* ===== FLASHCARD ===== */}
      <div className="perspective-[1000px] w-full" style={{ minHeight: '280px' }}>
        <div
          ref={cardRef}
          className={`relative w-full transition-all duration-500 transform-gpu ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          } ${isAnimating ? 'opacity-0 scale-95 translate-x-8' : 'opacity-100 scale-100'}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div
            className="glass-card p-8 w-full"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              {/* CEFR Badge */}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r ${
                  CEFR_COLORS[currentCard?.cefrLevel || 'B2'] || 'from-blue-500 to-indigo-500'
                } text-white shadow-md`}
              >
                {currentCard?.cefrLevel}
              </span>

              {/* Word */}
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {currentCard?.word}
              </h2>

              {/* Status badge */}
              <span className="text-[10px] text-white/30 uppercase tracking-wider">
                {currentCard?.status === 'new' ? '✦ New word' : currentCard?.status === 'learning' ? '📖 Learning' : currentCard?.status === 'review' ? '🔄 Review' : '⭐ Mastered'}
              </span>

              {/* Speak button */}
              <button
                onClick={() => currentCard && speakWord(currentCard.word)}
                className={`mt-2 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                  isSpeaking
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/[0.04] border-white/[0.06] text-white/50 hover:text-white/70 hover:bg-white/[0.06]'
                }`}
              >
                <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-medium">Listen</span>
              </button>

              {/* Flip hint */}
              <p className="text-[10px] text-white/20 mt-2">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white/30 text-[9px] font-mono">Space</kbd> or tap to reveal
              </p>
            </div>
          </div>

          {/* Back */}
          <div
            className="glass-card p-8 w-full absolute inset-0"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <h3 className="text-2xl font-bold text-white">{currentCard?.word}</h3>

              <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <p className="text-base text-white/70 leading-relaxed max-w-md">
                {currentCard?.definition}
              </p>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 max-w-md w-full">
                <p className="text-sm text-white/50 italic leading-relaxed">
                  &ldquo;{currentCard?.example}&rdquo;
                </p>
              </div>

              <button
                onClick={() => currentCard && speakWord(currentCard.word)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white/70 transition-all cursor-pointer"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span className="text-[11px]">Pronounce</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FLIP BUTTON (when not flipped) ===== */}
      {!isFlipped && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsFlipped(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 border border-cyan-500/20 text-cyan-300 text-sm font-medium hover:from-cyan-600/40 hover:to-indigo-600/40 transition-all duration-300 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Show Answer
          </button>
        </div>
      )}

      {/* ===== RATING BUTTONS (when flipped) ===== */}
      {isFlipped && (
        <div className="grid grid-cols-4 gap-2">
          {RATING_CONFIG.map(({ rating, label, shortcut, bgClass, icon }) => (
            <button
              key={rating}
              onClick={() => handleRating(rating)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${bgClass}`}
            >
              {icon}
              <span className="text-xs">{label}</span>
              <kbd className="text-[9px] opacity-50 font-mono">{shortcut}</kbd>
            </button>
          ))}
        </div>
      )}

      {/* ===== SESSION INFO ===== */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-white/20" />
            <span className="text-[10px] text-white/20">
              {Math.floor((Date.now() - startTime) / 60000)}m
            </span>
          </div>
          {sessionStreak > 0 && (
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-400/60" />
              <span className="text-[10px] text-amber-400/60">Streak: {sessionStreak}</span>
            </div>
          )}
        </div>
        <span className="text-[10px] text-white/20">
          {totalCards - currentIndex - 1} remaining
        </span>
      </div>
    </div>
  );
}
