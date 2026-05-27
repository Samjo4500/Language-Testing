'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import {
  BookOpen, Brain, Volume2, ChevronRight, ChevronLeft,
  Check, X, Flame, Search, BarChart3, Clock,
  Sparkles, RotateCcw, Trophy, Star, Zap,
  Filter, AlertCircle, Loader2, VolumeX,
  BookMarked, GraduationCap, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

// ── Types ──
interface VocabWord {
  id: string;
  word: string;
  definition: string;
  example: string;
  pronunciation: string | null;
  level: string;
  category: string;
  progress?: UserProgress | null;
}

interface UserProgress {
  id: string;
  box: number;
  nextReview: string;
  correctStreak: number;
  totalReviews: number;
  lastReviewed: string | null;
}

interface VocabStats {
  totalLearned: number;
  totalReviewed: number;
  wordsByBox: Record<number, number>;
  todayReviewed: number;
  streakDays: number;
  dueForReview: number;
  levelProgress: Record<string, { learned: number; total: number }>;
  totalAvailable: number;
}

// ── CEFR Colors ──
const LEVEL_COLORS: Record<string, string> = {
  A1: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  A2: 'text-green-400 border-green-400/30 bg-green-400/10',
  B1: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  B2: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  C1: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
  C2: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
};

const LEVEL_BG: Record<string, string> = {
  A1: 'bg-emerald-500',
  A2: 'bg-green-500',
  B1: 'bg-amber-500',
  B2: 'bg-yellow-500',
  C1: 'bg-violet-500',
  C2: 'bg-violet-500',
};

const BOX_COLORS: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-green-500',
  5: 'bg-blue-500',
};

const BOX_LABELS: Record<number, string> = {
  1: 'New',
  2: 'Learning',
  3: 'Familiar',
  4: 'Known',
  5: 'Mastered',
};

const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const CATEGORIES = ['All', 'general', 'business', 'travel', 'academic', 'idioms', 'phrasal_verbs'];
const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  business: 'Business',
  travel: 'Travel',
  academic: 'Academic',
  idioms: 'Idioms',
  phrasal_verbs: 'Phrasal Verbs',
};

// ── Helper: speak a word using TTS ──
function useTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(true);
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(text)}`);
    audioRef.current = audio;
    audio.onended = () => setSpeaking(false);
    audio.onerror = () => setSpeaking(false);
    audio.play().catch(() => setSpeaking(false));
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}

// ══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════

export default function VocabularyPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();

  // ── State ──
  const [mode, setMode] = useState<'learn' | 'review' | 'mywords'>('learn');
  const [levelFilter, setLevelFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [words, setWords] = useState<VocabWord[]>([]);
  const [stats, setStats] = useState<VocabStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Flashcard state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);

  const { speak, speaking } = useTTS();

  const currentWord = words[currentIndex] || null;

  // ── Fetch words ──
  const fetchWords = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        mode,
        limit: '50',
        page: '1',
      });
      if (levelFilter !== 'All') params.set('level', levelFilter);
      if (categoryFilter !== 'All') params.set('category', categoryFilter);
      if (searchQuery && mode === 'mywords') params.set('search', searchQuery);

      const res = await fetch(`/api/vocab?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setWords(data.words || []);
        setCurrentIndex(0);
        setFlipped(false);
      }
    } catch (err) {
      console.error('Failed to fetch words:', err);
    }
    setLoading(false);
  }, [isAuthenticated, mode, levelFilter, categoryFilter, searchQuery]);

  // ── Fetch stats ──
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch('/api/vocab/stats', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [isAuthenticated]);

  // ── Seed vocabulary ──
  const seedVocab = useCallback(async () => {
    if (!isAuthenticated) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/vocab/seed', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (res.ok) {
        fetchWords();
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to seed vocab:', err);
    }
    setSeeding(false);
  }, [isAuthenticated, fetchWords, fetchStats]);

  // ── Advance card ──
  const advanceCard = useCallback(() => {
    setAnimating(true);
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= words.length) return prev; // Stay on last
        return prev + 1;
      });
      setAnimating(false);
    }, 300);
  }, [words.length]);

  // ── Go to previous card ──
  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // ── Submit answer ──
  const submitAnswer = useCallback(async (wordId: string, correct: boolean) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ wordId, correct }),
      });
      if (res.ok) {
        // Move to next card
        advanceCard();
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
    setSubmitting(false);
  }, [fetchStats, advanceCard]);

  // ── Effects ──
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWords();
  }, [fetchWords]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  // Auto-seed if no words available
  useEffect(() => {
    if (isAuthenticated && !loading && words.length === 0 && !seeding) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      seedVocab();
    }
  }, [isAuthenticated, loading, words.length, seeding, seedVocab]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'ArrowRight' && flipped && currentWord) {
        submitAnswer(currentWord.id, true);
      } else if (e.key === 'ArrowLeft' && flipped && currentWord) {
        submitAnswer(currentWord.id, false);
      } else if (e.key === 'ArrowLeft' && !flipped) {
        goBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord, flipped, submitAnswer, goBack]);

  // ══════════════════════════════════════════════════════════
  // RENDER: Auth required
  // ══════════════════════════════════════════════════════════
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F0A1E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F0A1E] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Vocabulary Trainer</h1>
          <p className="text-gray-400 mb-6">Sign in to start building your English vocabulary with spaced repetition.</p>
          <Button
            onClick={() => (window.location.href = '/login')}
            className="bg-violet-600 hover:bg-violet-700 text-white px-8"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // RENDER: Main page
  // ══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-[#0F0A1E]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  Vocabulary Trainer
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-violet-400/30 text-violet-400">
                    BETA
                  </Badge>
                </h1>
                <p className="text-xs text-gray-500">Spaced repetition learning</p>
              </div>
            </div>
            {stats && (
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Stats bar */}
          {stats && (
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-medium">{stats.totalLearned}</span> learned
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white font-medium">{stats.dueForReview}</span> due
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-white font-medium">{stats.streakDays}</span> day streak
              </span>
            </div>
          )}

          {/* Level filter tabs */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-hide">
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  levelFilter === level
                    ? level === 'All'
                      ? 'bg-white/15 text-white border border-white/20'
                      : `${LEVEL_COLORS[level?.replace('All', '') || 'A1'] || 'bg-white/15 text-white'} border`
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-400/30'
                    : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                }`}
              >
                {cat === 'All' ? 'All' : CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Collapsible Stats Dashboard ── */}
      {showStats && stats && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-4 space-y-4">
            {/* Quick stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={<BookMarked className="w-4 h-4" />} label="Learned" value={stats.totalLearned} color="text-emerald-400" />
              <StatCard icon={<RefreshCw className="w-4 h-4" />} label="Reviewed" value={stats.totalReviewed} color="text-blue-400" />
              <StatCard icon={<Flame className="w-4 h-4" />} label="Streak" value={`${stats.streakDays}d`} color="text-orange-400" />
              <StatCard icon={<Zap className="w-4 h-4" />} label="Today" value={stats.todayReviewed} color="text-yellow-400" />
            </div>

            {/* Box distribution */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">BOX DISTRIBUTION</p>
              <div className="flex items-end gap-1 h-16">
                {[1, 2, 3, 4, 5].map((box) => {
                  const maxVal = Math.max(...Object.values(stats.wordsByBox), 1);
                  const count = stats.wordsByBox[box] || 0;
                  const height = Math.max((count / maxVal) * 100, 4);
                  return (
                    <div key={box} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-500">{count}</span>
                      <div
                        className={`w-full rounded-t-sm ${BOX_COLORS[box]} transition-all duration-500`}
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                      <span className="text-[9px] text-gray-600">B{box}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level progress */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">LEVEL PROGRESS</p>
              <div className="space-y-2">
                {Object.entries(stats.levelProgress).map(([level, { learned, total }]) => (
                  <div key={level} className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold w-6 ${LEVEL_COLORS[level]?.split(' ')[0] || 'text-gray-400'}`}>{level}</span>
                    <div className="flex-1">
                      <Progress
                        value={total > 0 ? (learned / total) * 100 : 0}
                        className="h-1.5 bg-white/5"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 w-14 text-right">{learned}/{total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mode tabs ── */}
      <div className="max-w-4xl mx-auto px-4 py-2">
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'learn' | 'review' | 'mywords')}>
          <TabsList className="bg-white/5 border border-white/10 w-full">
            <TabsTrigger
              value="learn"
              className="flex-1 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 text-gray-400 text-xs"
            >
              <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
              Learn
              {stats && stats.totalAvailable - stats.totalLearned > 0 && (
                <Badge variant="outline" className="ml-1.5 text-[9px] px-1 py-0 border-emerald-400/30 text-emerald-400">
                  {stats.totalAvailable - stats.totalLearned}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="flex-1 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 text-gray-400 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Review
              {stats && stats.dueForReview > 0 && (
                <Badge variant="outline" className="ml-1.5 text-[9px] px-1 py-0 border-amber-400/30 text-amber-400">
                  {stats.dueForReview}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="mywords"
              className="flex-1 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-gray-400 text-xs"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              My Words
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        )}

        {/* Seeding state */}
        {seeding && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            <p className="text-gray-400 text-sm">Loading vocabulary data...</p>
          </div>
        )}

        {/* Empty states */}
        {!loading && !seeding && words.length === 0 && mode === 'learn' && (
          <EmptyState
            icon={<Trophy className="w-12 h-12 text-emerald-400" />}
            title="You've learned all available words!"
            subtitle="Try a different level or category, or check back later for new words."
            action={levelFilter !== 'All' || categoryFilter !== 'All' ? () => { setLevelFilter('All'); setCategoryFilter('All'); } : undefined}
            actionLabel="Reset Filters"
          />
        )}

        {!loading && !seeding && words.length === 0 && mode === 'review' && (
          <EmptyState
            icon={<Sparkles className="w-12 h-12 text-amber-400" />}
            title="No reviews due right now!"
            subtitle="Come back later or learn new words to add to your review queue."
            action={() => setMode('learn')}
            actionLabel="Learn New Words"
          />
        )}

        {!loading && !seeding && words.length === 0 && mode === 'mywords' && (
          <EmptyState
            icon={<BookOpen className="w-12 h-12 text-blue-400" />}
            title="No words yet!"
            subtitle="Start learning to build your vocabulary collection."
            action={() => setMode('learn')}
            actionLabel="Start Learning"
          />
        )}

        {/* ── Flashcard Mode (Learn & Review) ── */}
        {!loading && !seeding && words.length > 0 && (mode === 'learn' || mode === 'review') && currentWord && (
          <div className="space-y-4">
            {/* Progress indicator */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {currentIndex + 1} of {words.length}
              </span>
              {mode === 'review' && currentWord.progress && (
                <div className="flex items-center gap-1">
                  {currentWord.progress.box > 0 && (
                    <Badge
                      className={`text-[10px] ${BOX_COLORS[currentWord.progress.box]} text-white border-0`}
                    >
                      Box {currentWord.progress.box} · {BOX_LABELS[currentWord.progress.box]}
                    </Badge>
                  )}
                </div>
              )}
              {mode === 'learn' && (
                <Badge variant="outline" className={`text-[10px] ${LEVEL_COLORS[currentWord.level] || 'text-gray-400'}`}>
                  {currentWord.level}
                </Badge>
              )}
            </div>
            <Progress value={((currentIndex + 1) / words.length) * 100} className="h-1 bg-white/5" />

            {/* Flashcard */}
            <div
              className="perspective-1000 cursor-pointer select-none"
              onClick={() => setFlipped(!flipped)}
              style={{ perspective: '1000px' }}
            >
              <div
                className={`relative w-full transition-transform duration-500 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front of card */}
                <div
                  className="w-full min-h-[280px] sm:min-h-[320px] rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 p-5 sm:p-8 flex flex-col items-center justify-center gap-3 sm:gap-4"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Badge variant="outline" className={`text-[10px] ${LEVEL_COLORS[currentWord.level] || ''}`}>
                    {currentWord.level} · {CATEGORY_LABELS[currentWord.category] || currentWord.category}
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {currentWord.word}
                  </h2>
                  {currentWord.pronunciation && (
                    <p className="text-gray-500 text-sm font-mono">{currentWord.pronunciation}</p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentWord.word);
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    {speaking ? (
                      <VolumeX className="w-4 h-4 text-gray-300" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                  <p className="text-gray-600 text-xs mt-2">Tap to reveal definition</p>
                </div>

                {/* Back of card */}
                <div
                  className="absolute inset-0 w-full min-h-[280px] sm:min-h-[320px] rounded-2xl bg-gradient-to-br from-violet-500/[0.12] to-violet-500/[0.06] border border-violet-400/20 p-5 sm:p-8 flex flex-col items-center justify-center gap-2 sm:gap-3"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <h3 className="text-xl font-semibold text-white mb-1">{currentWord.word}</h3>
                  <p className="text-violet-200 text-center leading-relaxed text-sm sm:text-base">
                    {currentWord.definition}
                  </p>
                  <div className="bg-white/5 rounded-xl px-4 py-3 mt-2 w-full">
                    <p className="text-gray-300 text-sm italic text-center">
                      &ldquo;{currentWord.example}&rdquo;
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentWord.word);
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors mt-2"
                  >
                    {speaking ? (
                      <VolumeX className="w-3.5 h-3.5 text-gray-300" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-center mt-4">
              {flipped ? (
                <>
                  <Button
                    onClick={() => submitAnswer(currentWord.id, false)}
                    disabled={submitting}
                    className="flex-1 max-w-[180px] min-h-[44px] bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 transition-all"
                    size="lg"
                  >
                    {mode === 'review' ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        I Forgot
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Still Learning
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => submitAnswer(currentWord.id, true)}
                    disabled={submitting}
                    className="flex-1 max-w-[180px] min-h-[44px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 transition-all"
                    size="lg"
                  >
                    {mode === 'review' ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        I Remembered
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        I Know This
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {currentIndex > 0 && (
                    <Button
                      onClick={goBack}
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={() => setFlipped(true)}
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    Show Answer
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </>
              )}
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="text-center text-[10px] text-gray-600 mt-2 hidden sm:block">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-gray-500">Space</kbd> flip ·
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-gray-500 ml-1">→</kbd> know ·
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-gray-500 ml-1">←</kbd> learning
            </div>
          </div>
        )}

        {/* ── My Words Mode ── */}
        {!loading && !seeding && mode === 'mywords' && (
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search your words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-violet-400/50"
              />
            </div>

            {words.length === 0 && !loading ? (
              <div className="py-10 text-center text-gray-500 text-sm">
                {searchQuery ? 'No words match your search.' : 'No learned words yet.'}
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {words.map((word) => (
                  <div
                    key={word.id}
                    className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 rounded-xl p-3 sm:p-4 flex items-center gap-3 transition-colors cursor-pointer"
                    onClick={() => {
                      speak(word.word);
                    }}
                  >
                    {/* Box indicator dot */}
                    <div
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        word.progress ? BOX_COLORS[word.progress.box] : 'bg-gray-600'
                      }`}
                    />

                    {/* Word info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate">{word.word}</span>
                        {word.pronunciation && (
                          <span className="text-[10px] text-gray-600 font-mono hidden sm:inline">{word.pronunciation}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{word.definition}</p>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${LEVEL_COLORS[word.level] || ''}`}>
                        {word.level}
                      </Badge>
                      {word.progress && (
                        <Badge
                          className={`text-[9px] px-1.5 py-0 ${BOX_COLORS[word.progress.box]} text-white border-0`}
                        >
                          B{word.progress.box}
                        </Badge>
                      )}
                      <Volume2 className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {words.length > 0 && (
              <p className="text-xs text-gray-600 text-center">{words.length} word{words.length !== 1 ? 's' : ''}</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom spacing for mobile */}
      <div className="h-20" />
    </div>
  );
}

// ── Stat Card Component ──
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
      <div className={`flex items-center gap-1.5 mb-1 ${color}`}>
        {icon}
        <span className="text-[10px] text-gray-500 uppercase font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

// ── Empty State Component ──
function EmptyState({
  icon,
  title,
  subtitle,
  action,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="opacity-60">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-gray-500 text-sm text-center max-w-sm">{subtitle}</p>
      {action && actionLabel && (
        <Button
          onClick={action}
          variant="outline"
          className="border-violet-400/30 text-violet-300 hover:bg-violet-500/10 mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
