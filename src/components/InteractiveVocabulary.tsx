'use client';

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  BookOpen,
  Brain,
  Check,
  X,
  Flame,
  Clock,
  Sparkles,
  Trophy,
  Star,
  Zap,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  RotateCcw,
  ArrowRight,
  Shuffle,
  Target,
  Hash,
  Timer,
  Play,
  SkipForward,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  shuffleArray,
  generateDistractors,
  calculateMasteryStatus,
  formatTime,
  formatTimer,
  calculateFillGapScore,
  calculateSentenceBuilderScore,
  calculateMultipleChoiceScore,
  scrambleSentence,
  LEVEL_COLORS,
  LEVEL_GRADIENT_COLORS,
  MASTERY_COLORS,
} from '@/lib/vocabulary-utils';

// ── Types ────────────────────────────────────────────────────────────────────

interface VocabWord {
  id: string;
  word: string;
  gapSentence?: string;
  definition: string;
  example: string;
  options?: string[];
  correctAnswer: string;
  partOfSpeech?: string;
  level: string;
}

interface SessionResults {
  totalQuestions: number;
  correct: number;
  score: number;
  maxScore: number;
  wordsMastered: string[];
  wordsToReview: string[];
  timeSpentMs: number;
}

interface InteractiveVocabularyProps {
  /** Pre-fetched words (if provided, skip level selection) */
  initialWords?: VocabWord[];
  /** Lock to a specific level (skip level selection) */
  lockLevel?: string;
  /** Lock to a specific exercise type */
  lockType?: 'fill_gap' | 'sentence_builder' | 'multiple_choice';
  /** Number of questions (default 10) */
  questionCount?: number;
  /** Show compact mode (no level/config screens, jump straight to exercise) */
  compact?: boolean;
  /** Callback when session completes */
  onComplete?: (results: SessionResults) => void;
}

type Screen = 'level_select' | 'config' | 'exercise' | 'results';
type ExerciseType = 'fill_gap' | 'sentence_builder' | 'multiple_choice';
type AnswerState = 'unanswered' | 'correct' | 'wrong' | 'hinted';

interface QuestionResult {
  wordId: string;
  word: string;
  exerciseType: ExerciseType;
  isCorrect: boolean;
  score: number;
  timeSpentMs: number;
  usedHint: boolean;
  answerState: AnswerState;
}

// ── Constants ────────────────────────────────────────────────────────────────

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
const LEVEL_DESCRIPTIONS: Record<string, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced',
  C2: 'Mastery',
};
const LEVEL_WORD_COUNTS: Record<string, string> = {
  A1: '~500',
  A2: '~800',
  B1: '~1200',
  B2: '~1800',
  C1: '~2400',
  C2: '~3000',
};

const QUESTION_COUNTS = [5, 10, 15, 20] as const;
const TIME_LIMITS = [
  { value: 0, label: 'Off' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
  { value: 90, label: '90s' },
] as const;

const EXERCISE_TYPES: { value: ExerciseType | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Types', icon: <Shuffle className="w-4 h-4" /> },
  { value: 'fill_gap', label: 'Fill the Gap', icon: <Target className="w-4 h-4" /> },
  { value: 'sentence_builder', label: 'Sentence Builder', icon: <Hash className="w-4 h-4" /> },
  { value: 'multiple_choice', label: 'Multiple Choice', icon: <Lightbulb className="w-4 h-4" /> },
];

// ── Main Component ───────────────────────────────────────────────────────────

export default function InteractiveVocabulary({
  initialWords,
  lockLevel,
  lockType,
  questionCount: propQuestionCount,
  compact,
  onComplete,
}: InteractiveVocabularyProps) {
  // ── Screen State ──
  const [screen, setScreen] = useState<Screen>(
    compact || (initialWords && initialWords.length > 0)
      ? 'exercise'
      : lockLevel
        ? 'config'
        : 'level_select'
  );

  // ── Configuration State ──
  const [selectedLevel, setSelectedLevel] = useState<string>(lockLevel || '');
  const [selectedCount, setSelectedCount] = useState<number>(propQuestionCount || 10);
  const [selectedType, setSelectedType] = useState<ExerciseType | 'all'>(lockType || 'all');
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<number>(0);

  // ── Exercise State ──
  const [words, setWords] = useState<VocabWord[]>(initialWords || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Timer State ──
  const [timeSpentMs, setTimeSpentMs] = useState(0);
  const [timeRemainingMs, setTimeRemainingMs] = useState(0);
  const questionStartTime = useRef<number>(Date.now());
  const sessionStartTime = useRef<number>(Date.now());
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Answer State ──
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [hintRevealed, setHintRevealed] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // ── Fill Gap State ──
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);

  // ── Sentence Builder State ──
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // ── Streak ──
  const [streak, setStreak] = useState(0);

  // ── Current word ──
  const currentWord = useMemo(() => words[currentIndex] || null, [words, currentIndex]);

  // ── Determine exercise type for current question ──
  const currentExerciseType = useMemo<ExerciseType>(() => {
    if (!currentWord) return 'multiple_choice';
    if (lockType) return lockType;
    if (selectedType !== 'all') return selectedType;

    // Rotate exercise types for variety
    const types: ExerciseType[] = ['fill_gap', 'sentence_builder', 'multiple_choice'];
    return types[currentIndex % types.length];
  }, [currentWord, lockType, selectedType, currentIndex]);

  // ── Progress ──
  const progressPercent = useMemo(
    () => (words.length > 0 ? ((currentIndex) / words.length) * 100 : 0),
    [currentIndex, words.length]
  );

  const totalScore = useMemo(
    () => results.reduce((sum, r) => sum + r.score, 0),
    [results]
  );

  const maxPossibleScore = useMemo(
    () => words.length * 10,
    [words.length]
  );

  // ── Ref for submitAnswer to avoid circular deps in timer ──
  const submitAnswerRef = useRef<(isCorrect: boolean, score: number, usedHint: boolean) => void>(() => {});

  // ── Hint timer: show hint button after 10s ──
  useEffect(() => {
    if (screen !== 'exercise' || answerState !== 'unanswered') return;

    const hintTimeout = setTimeout(() => {
      setHintVisible(true);
    }, 10000);

    return () => clearTimeout(hintTimeout);
  }, [screen, currentIndex, answerState]);

  // ── Main timer ──
  useEffect(() => {
    if (screen !== 'exercise' || answerState !== 'unanswered') {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      return;
    }

    timerInterval.current = setInterval(() => {
      const elapsed = Date.now() - questionStartTime.current;
      setTimeSpentMs(elapsed);

      if (selectedTimeLimit > 0) {
        const remaining = selectedTimeLimit * 1000 - elapsed;
        setTimeRemainingMs(Math.max(0, remaining));
        if (remaining <= 0) {
          // Time's up — treat as wrong
          submitAnswerRef.current(false, 0, false);
        }
      }
    }, 200);

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    };
  }, [screen, currentIndex, answerState, selectedTimeLimit]);

  // ── Whether the current fill-gap answer is a multi-word phrase ──
  const isMultiWordFillGap = useMemo(() => {
    if (!currentWord || currentExerciseType !== 'fill_gap') return false;
    return currentWord.correctAnswer.includes(' ');
  }, [currentWord, currentExerciseType]);

  // ── For multi-word fill-gap: the list of correct words ──
  const multiWordCorrectWords = useMemo(() => {
    if (!currentWord || !isMultiWordFillGap) return [];
    return currentWord.correctAnswer.split(' ');
  }, [currentWord, isMultiWordFillGap]);

  // ── Initialize question ──
  const initQuestion = useCallback(() => {
    setAnswerState('unanswered');
    setHintRevealed(false);
    setHintVisible(false);
    setTypedLetters([]);
    setSelectedWords([]);
    setTimeSpentMs(0);
    questionStartTime.current = Date.now();

    if (currentWord) {
      if (currentExerciseType === 'fill_gap') {
        // Detect multi-word answers (phrasal verbs, idioms) vs single-word
        const isMultiWord = currentWord.correctAnswer.includes(' ');
        if (isMultiWord) {
          // Split into word tiles for multi-word phrases
          const words = currentWord.correctAnswer.split(' ');
          setAvailableLetters(shuffleArray(words));
        } else {
          // Split into individual letter tiles (existing behavior)
          const letters = currentWord.correctAnswer.split('');
          setAvailableLetters(shuffleArray(letters));
        }
      } else if (currentExerciseType === 'sentence_builder') {
        const distractorPool = words
          .filter((w) => w.id !== currentWord.id)
          .map((w) => w.word);
        setScrambledWords(scrambleSentence(currentWord.example, distractorPool));
      }
    }

    if (selectedTimeLimit > 0) {
      setTimeRemainingMs(selectedTimeLimit * 1000);
    }
  }, [currentWord, currentExerciseType, words, selectedTimeLimit]);

  // Re-initialize when question changes
  useEffect(() => {
    if (screen === 'exercise' && currentWord) {
      initQuestion();
    }
  }, [screen, currentIndex, currentWord, initQuestion]);

  // ── Fetch words from API ──
  const fetchWords = useCallback(
    async (level: string) => {
      setLoading(true);
      setError(null);
      try {
        if (level === 'mix') {
          // Quick Mix: fetch from multiple levels and combine
          const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
          const perLevel = Math.ceil(selectedCount / levels.length);
          const allWords: VocabWord[] = [];

          const fetchPromises = levels.map(async (lvl) => {
            const params = new URLSearchParams({
              level: lvl,
              count: String(perLevel),
            });
            if (selectedType !== 'all') params.set('type', selectedType);

            try {
              const res = await fetch(`/api/vocabulary/words?${params}`, {
                credentials: 'same-origin',
              });
              if (res.ok) {
                const data = await res.json();
                return (data.words || []) as VocabWord[];
              }
            } catch {
              // Skip failed level
            }
            return [];
          });

          const fetchResults = await Promise.all(fetchPromises);
          for (const levelWords of fetchResults) {
            allWords.push(...levelWords);
          }

          const shuffled = shuffleArray(allWords).slice(0, selectedCount);

          if (shuffled.length === 0) {
            setError('No words available. Try a specific level instead.');
            setLoading(false);
            return;
          }

          setWords(shuffled);
          setCurrentIndex(0);
          setResults([]);
          setStreak(0);
          sessionStartTime.current = Date.now();
          setScreen('exercise');
        } else {
          // Specific level
          const params = new URLSearchParams({
            level,
            count: String(selectedCount),
          });
          if (selectedType !== 'all') params.set('type', selectedType);

          const res = await fetch(`/api/vocabulary/words?${params}`, {
            credentials: 'same-origin',
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Failed to fetch words');
          }
          const data = await res.json();
          const fetchedWords: VocabWord[] = data.words || [];

          if (fetchedWords.length === 0) {
            setError('No words available for this level. Try a different level.');
            setLoading(false);
            return;
          }

          setWords(fetchedWords);
          setCurrentIndex(0);
          setResults([]);
          setStreak(0);
          sessionStartTime.current = Date.now();
          setScreen('exercise');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load words');
      }
      setLoading(false);
    },
    [selectedCount, selectedType]
  );

  // ── Submit answer ──
  const submitAnswer = useCallback(
    (isCorrect: boolean, score: number, usedHint: boolean) => {
      if (answerState !== 'unanswered') return;

      const timeSpent = Date.now() - questionStartTime.current;
      setAnswerState(isCorrect ? 'correct' : 'wrong');

      if (isCorrect) {
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0);
      }

      const result: QuestionResult = {
        wordId: currentWord?.id || '',
        word: currentWord?.word || '',
        exerciseType: currentExerciseType,
        isCorrect,
        score,
        timeSpentMs: timeSpent,
        usedHint,
        answerState: isCorrect ? 'correct' : 'wrong',
      };

      setResults((prev) => [...prev, result]);

      // POST to API (fire-and-forget)
      fetch('/api/vocabulary/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          wordId: currentWord?.id,
          exerciseType: currentExerciseType,
          isCorrect,
          score,
          timeSpentMs: timeSpent,
          usedHint,
        }),
      }).catch(() => {
        // Silently fail — results are still tracked locally
      });

      // Auto-advance
      const delay = isCorrect ? 2000 : 3000;
      const timer = setTimeout(() => {
        advanceToNext();
      }, delay);
      setAutoAdvanceTimer(timer);
    },
    [answerState, currentWord, currentExerciseType]
  );

  // Keep ref in sync
  submitAnswerRef.current = submitAnswer;

  // ── Advance to next question ──
  const advanceToNext = useCallback(() => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }

    if (currentIndex + 1 >= words.length) {
      // Session complete
      setScreen('results');
      const sessionResults = buildSessionResults();
      onComplete?.(sessionResults);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [autoAdvanceTimer, currentIndex, words.length, onComplete]);

  // ── Build session results ──
  const buildSessionResults = useCallback((): SessionResults => {
    const totalTime = Date.now() - sessionStartTime.current;
    const correctCount = results.filter((r) => r.isCorrect).length;
    const scoreSum = results.reduce((sum, r) => sum + r.score, 0);

    const wordsMastered: string[] = [];
    const wordsToReview: string[] = [];

    for (const r of results) {
      const status = calculateMasteryStatus(
        r.isCorrect ? 1 : 0,
        r.score * 10, // rough mastery score
        1
      );
      if (status === 'mastered' || (r.isCorrect && r.score >= 10)) {
        wordsMastered.push(r.word);
      } else if (!r.isCorrect) {
        wordsToReview.push(r.word);
      }
    }

    return {
      totalQuestions: words.length,
      correct: correctCount,
      score: scoreSum,
      maxScore: words.length * 10,
      wordsMastered,
      wordsToReview,
      timeSpentMs: totalTime,
    };
  }, [results, words.length]);

  // ── Fill Gap: Handle letter/word tap ──
  const handleLetterTap = useCallback(
    (letter: string, index: number) => {
      if (answerState !== 'unanswered') return;

      const newTyped = [...typedLetters, letter];
      setTypedLetters(newTyped);

      // Remove the used letter/word from available
      const newAvailable = [...availableLetters];
      newAvailable.splice(index, 1);
      setAvailableLetters(newAvailable);

      // Determine if this is a multi-word fill-gap
      const isMultiWord = currentWord?.correctAnswer.includes(' ') ?? false;

      if (isMultiWord) {
        // Multi-word: check if all words have been placed
        const correctWords = currentWord!.correctAnswer.split(' ');
        if (newTyped.length === correctWords.length) {
          const userAnswer = newTyped.join(' ');
          const isCorrect =
            userAnswer.toLowerCase() === currentWord!.correctAnswer.toLowerCase();
          const score = calculateFillGapScore(isCorrect, hintRevealed);
          submitAnswer(isCorrect, score, hintRevealed);
        }
      } else {
        // Single-word: check if all letters have been placed
        if (newTyped.length === currentWord?.correctAnswer.length) {
          const userAnswer = newTyped.join('');
          const isCorrect =
            userAnswer.toLowerCase() === currentWord.correctAnswer.toLowerCase();
          const score = calculateFillGapScore(isCorrect, hintRevealed);
          submitAnswer(isCorrect, score, hintRevealed);
        }
      }
    },
    [answerState, typedLetters, availableLetters, currentWord, hintRevealed, submitAnswer]
  );

  // ── Fill Gap: Remove last letter ──
  const handleRemoveLetter = useCallback(() => {
    if (typedLetters.length === 0 || answerState !== 'unanswered') return;

    const lastLetter = typedLetters[typedLetters.length - 1];
    const newTyped = typedLetters.slice(0, -1);
    setTypedLetters(newTyped);
    setAvailableLetters((prev) => [...prev, lastLetter]);
  }, [typedLetters, answerState]);

  // ── Fill Gap: Select from options (multiple choice mode) ──
  const handleOptionSelect = useCallback(
    (option: string) => {
      if (answerState !== 'unanswered') return;
      const isCorrect =
        option.toLowerCase() === currentWord?.correctAnswer.toLowerCase();
      const score = calculateFillGapScore(isCorrect, hintRevealed);
      submitAnswer(isCorrect, score, hintRevealed);
    },
    [answerState, currentWord, hintRevealed, submitAnswer]
  );

  // ── Sentence Builder: Handle word tap ──
  const handleWordTap = useCallback(
    (word: string, index: number) => {
      if (answerState !== 'unanswered') return;

      const newSelected = [...selectedWords, word];
      setSelectedWords(newSelected);

      // Remove from scrambled
      const newScrambled = [...scrambledWords];
      newScrambled.splice(index, 1);
      setScrambledWords(newScrambled);

      // Check if all words selected
      const correctWords = currentWord?.example
        .replace(/[.,!?;:'"]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 0) || [];

      if (newSelected.length >= correctWords.length) {
        const score = calculateSentenceBuilderScore(correctWords, newSelected);
        const isCorrect = score > 0;
        submitAnswer(isCorrect, score, false);
      }
    },
    [answerState, selectedWords, scrambledWords, currentWord, submitAnswer]
  );

  // ── Sentence Builder: Remove last word ──
  const handleRemoveWord = useCallback(() => {
    if (selectedWords.length === 0 || answerState !== 'unanswered') return;

    const lastWord = selectedWords[selectedWords.length - 1];
    const newSelected = selectedWords.slice(0, -1);
    setSelectedWords(newSelected);
    setScrambledWords((prev) => [...prev, lastWord]);
  }, [selectedWords, answerState]);

  // ── Multiple Choice: Handle answer ──
  const handleMCAnswer = useCallback(
    (option: string) => {
      if (answerState !== 'unanswered') return;
      const isCorrect =
        option.toLowerCase() === currentWord?.correctAnswer.toLowerCase();
      const score = calculateMultipleChoiceScore(isCorrect);
      submitAnswer(isCorrect, score, false);
    },
    [answerState, currentWord, submitAnswer]
  );

  // ── Hint ──
  const handleHint = useCallback(() => {
    if (currentExerciseType === 'fill_gap' && currentWord) {
      setHintRevealed(true);
      if (typedLetters.length === 0) {
        const isMultiWord = currentWord.correctAnswer.includes(' ');
        if (isMultiWord) {
          // For multi-word phrases, reveal the first word
          const firstWord = currentWord.correctAnswer.split(' ')[0];
          setTypedLetters([firstWord]);
          const idx = availableLetters.findIndex(
            (l) => l.toLowerCase() === firstWord.toLowerCase()
          );
          if (idx !== -1) {
            const newAvailable = [...availableLetters];
            newAvailable.splice(idx, 1);
            setAvailableLetters(newAvailable);
          }
        } else {
          // For single words, reveal the first letter
          const firstLetter = currentWord.correctAnswer[0];
          setTypedLetters([firstLetter]);
          const idx = availableLetters.findIndex(
            (l) => l.toLowerCase() === firstLetter.toLowerCase()
          );
          if (idx !== -1) {
            const newAvailable = [...availableLetters];
            newAvailable.splice(idx, 1);
            setAvailableLetters(newAvailable);
          }
        }
      }
    } else {
      setHintRevealed(true);
    }
  }, [currentExerciseType, currentWord, typedLetters, availableLetters]);

  // ── Skip question ──
  const handleSkip = useCallback(() => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    submitAnswer(false, 0, false);
  }, [autoAdvanceTimer, submitAnswer]);

  // ── Restart session ──
  const handleRestart = useCallback(() => {
    setScreen(lockLevel ? 'config' : 'level_select');
    setWords([]);
    setCurrentIndex(0);
    setResults([]);
    setStreak(0);
    setError(null);
  }, [lockLevel]);

  // ── Retry with same settings ──
  const handleRetry = useCallback(() => {
    if (selectedLevel || lockLevel) {
      fetchWords(selectedLevel || lockLevel || 'A1');
    } else {
      setScreen('level_select');
    }
  }, [selectedLevel, lockLevel, fetchWords]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Level Selection Screen
  // ═══════════════════════════════════════════════════════════════════════════

  if (screen === 'level_select') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white">
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Vocabulary Practice
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Choose your CEFR level to start practicing
            </p>
          </div>

          {/* Level Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {CEFR_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => {
                  setSelectedLevel(level);
                  setScreen('config');
                }}
                className="group relative bg-[#131328] hover:bg-[#1a1a3a] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                {/* Level badge */}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${LEVEL_GRADIENT_COLORS[level]} text-white font-bold text-lg mb-3 shadow-lg`}
                >
                  {level}
                </div>
                <p className="font-semibold text-white text-sm mb-1">
                  {LEVEL_DESCRIPTIONS[level]}
                </p>
                <p className="text-gray-500 text-xs">
                  {LEVEL_WORD_COUNTS[level]} words
                </p>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            ))}
          </div>

          {/* Quick Mix */}
          <button
            onClick={() => {
              setSelectedLevel('mix');
              setScreen('config');
            }}
            className="w-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 hover:from-blue-500/30 hover:to-violet-500/30 border border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg">
              <Shuffle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                Quick Mix
              </p>
              <p className="text-gray-400 text-sm">
                Random words across all levels
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Configuration Screen
  // ═══════════════════════════════════════════════════════════════════════════

  if (screen === 'config') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white">
        <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
          {/* Back button */}
          {!lockLevel && (
            <button
              onClick={() => setScreen('level_select')}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors mb-6 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to levels
            </button>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {selectedLevel !== 'mix' && selectedLevel && (
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${LEVEL_GRADIENT_COLORS[selectedLevel] || 'from-blue-500 to-violet-500'} text-white font-bold text-sm shadow-lg`}
                >
                  {selectedLevel}
                </div>
              )}
              {selectedLevel === 'mix' && (
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg">
                  <Shuffle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">
                  {selectedLevel === 'mix'
                    ? 'Quick Mix'
                    : `${selectedLevel} — ${LEVEL_DESCRIPTIONS[selectedLevel] || ''}`}
                </h2>
                <p className="text-gray-400 text-sm">Configure your practice session</p>
              </div>
            </div>
          </div>

          {/* Question Count */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue-400" />
              Questions
            </label>
            <div className="grid grid-cols-4 gap-2">
              {QUESTION_COUNTS.map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedCount(count)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedCount === count
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-500/10'
                      : 'bg-[#131328] text-gray-400 border border-white/[0.06] hover:bg-[#1a1a3a] hover:text-white'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Type */}
          {!lockType && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-violet-400" />
                Exercise Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EXERCISE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      selectedType === type.value
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-lg shadow-violet-500/10'
                        : 'bg-[#131328] text-gray-400 border border-white/[0.06] hover:bg-[#1a1a3a] hover:text-white'
                    }`}
                  >
                    {type.icon}
                    <span className="truncate">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Limit */}
          <div className="mb-8">
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Timer className="w-4 h-4 text-amber-400" />
              Time Limit
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_LIMITS.map((tl) => (
                <button
                  key={tl.value}
                  onClick={() => setSelectedTimeLimit(tl.value)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedTimeLimit === tl.value
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                      : 'bg-[#131328] text-gray-400 border border-white/[0.06] hover:bg-[#1a1a3a] hover:text-white'
                  }`}
                >
                  {tl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={() => {
              if (initialWords && initialWords.length > 0) {
                setWords(initialWords);
                setCurrentIndex(0);
                setResults([]);
                setStreak(0);
                sessionStartTime.current = Date.now();
                setScreen('exercise');
              } else {
                fetchWords(selectedLevel);
              }
            }}
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold text-base rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Play className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Loading...' : 'Start Practice'}
          </Button>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 text-sm font-medium">{error}</p>
                <button
                  onClick={handleRetry}
                  className="text-red-400 text-xs hover:text-red-300 mt-1 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Results Screen
  // ═══════════════════════════════════════════════════════════════════════════

  if (screen === 'results') {
    const sessionResults = buildSessionResults();
    const percentage =
      sessionResults.maxScore > 0
        ? Math.round((sessionResults.score / sessionResults.maxScore) * 100)
        : 0;
    const isGoodScore = percentage >= 70;

    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white">
        <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
          {/* Trophy header */}
          <div className="text-center mb-8">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isGoodScore
                  ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border-2 border-emerald-500/30'
                  : 'bg-gradient-to-br from-amber-500/20 to-amber-500/10 border-2 border-amber-500/30'
              }`}
            >
              <Trophy
                className={`w-10 h-10 ${isGoodScore ? 'text-emerald-400' : 'text-amber-400'}`}
              />
            </div>
            <h2 className="text-2xl font-bold mb-1">
              {isGoodScore ? 'Great Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isGoodScore
                ? 'You\'re making excellent progress'
                : 'Practice makes perfect — try again!'}
            </p>
          </div>

          {/* Score card */}
          <div className="bg-[#131328] border border-white/[0.06] rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Score</p>
                <p className="text-3xl font-bold">
                  <span
                    className={
                      isGoodScore ? 'text-emerald-400' : 'text-amber-400'
                    }
                  >
                    {sessionResults.score}
                  </span>
                  <span className="text-gray-500 text-lg">
                    /{sessionResults.maxScore}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Accuracy</p>
                <p
                  className={`text-3xl font-bold ${isGoodScore ? 'text-emerald-400' : 'text-amber-400'}`}
                >
                  {percentage}%
                </p>
              </div>
            </div>
            <Progress
              value={percentage}
              className="h-2 bg-white/5"
            />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#131328] border border-white/[0.06] rounded-xl p-4 text-center">
              <Check className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">
                {sessionResults.correct}
              </p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="bg-[#131328] border border-white/[0.06] rounded-xl p-4 text-center">
              <X className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">
                {sessionResults.totalQuestions - sessionResults.correct}
              </p>
              <p className="text-xs text-gray-500">Incorrect</p>
            </div>
            <div className="bg-[#131328] border border-white/[0.06] rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">
                {formatTime(sessionResults.timeSpentMs)}
              </p>
              <p className="text-xs text-gray-500">Time</p>
            </div>
          </div>

          {/* Mastered words */}
          {sessionResults.wordsMastered.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Mastered ({sessionResults.wordsMastered.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {sessionResults.wordsMastered.map((word) => (
                  <span
                    key={word}
                    className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-sm"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Words to review */}
          {sessionResults.wordsToReview.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Needs Review ({sessionResults.wordsToReview.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {sessionResults.wordsToReview.map((word) => (
                  <span
                    key={word}
                    className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Question breakdown */}
          <div className="bg-[#131328] border border-white/[0.06] rounded-2xl p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Question Breakdown
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {results.map((r, idx) => (
                <div
                  key={`${r.wordId}-${idx}`}
                  className="flex items-center gap-3 py-1.5"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      r.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {r.isCorrect ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-sm text-white font-medium flex-1">
                    {r.word}
                  </span>
                  <span className="text-xs text-gray-500">
                    +{r.score}pts
                  </span>
                  <span className="text-xs text-gray-600">
                    {formatTime(r.timeSpentMs)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="flex-1 h-12 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={handleRestart}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/20"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Loading State
  // ═══════════════════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Error State
  // ═══════════════════════════════════════════════════════════════════════════

  if (error && screen === 'exercise') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <Button
            onClick={handleRetry}
            className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Empty State (no words)
  // ═══════════════════════════════════════════════════════════════════════════

  if (!currentWord && screen === 'exercise') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No words available</h2>
          <p className="text-gray-400 text-sm mb-6">
            Try a different level or check back later for new words.
          </p>
          <Button
            onClick={handleRestart}
            className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl"
          >
            Choose Different Level
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Exercise Screen
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex flex-col">
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-30 bg-[#0a0a1a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {currentIndex + 1}/{words.length}
            </span>
            <Progress
              value={progressPercent}
              className="flex-1 h-1.5 bg-white/5"
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Timer */}
              {selectedTimeLimit > 0 && (
                <div
                  className={`flex items-center gap-1 text-xs ${
                    timeRemainingMs < 10000
                      ? 'text-red-400 animate-pulse'
                      : 'text-gray-400'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {formatTimer(timeRemainingMs)}
                </div>
              )}

              {/* Time spent */}
              {selectedTimeLimit === 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTimer(timeSpentMs)}
                </div>
              )}

              {/* Level badge */}
              {currentWord && (
                <Badge
                  variant="outline"
                  className={`text-[10px] ${LEVEL_COLORS[currentWord.level] || ''}`}
                >
                  {currentWord.level}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Streak */}
              {streak > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-orange-300 font-medium">{streak}</span>
                </div>
              )}

              {/* Score */}
              <div className="flex items-center gap-1 text-xs">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-300 font-medium">{totalScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {currentWord && (
          <div className="animate-[fade-in_0.3s_ease_forwards]">
            {/* ── Exercise Type Badge ── */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  currentExerciseType === 'fill_gap'
                    ? 'text-blue-400 border-blue-400/30 bg-blue-400/10'
                    : currentExerciseType === 'sentence_builder'
                      ? 'text-violet-400 border-violet-400/30 bg-violet-400/10'
                      : 'text-amber-400 border-amber-400/30 bg-amber-400/10'
                }`}
              >
                {currentExerciseType === 'fill_gap' && (
                  <Target className="w-3 h-3 mr-1" />
                )}
                {currentExerciseType === 'sentence_builder' && (
                  <Hash className="w-3 h-3 mr-1" />
                )}
                {currentExerciseType === 'multiple_choice' && (
                  <Lightbulb className="w-3 h-3 mr-1" />
                )}
                {currentExerciseType === 'fill_gap'
                  ? 'Fill the Gap'
                  : currentExerciseType === 'sentence_builder'
                    ? 'Sentence Builder'
                    : 'Multiple Choice'}
              </Badge>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                FILL IN THE GAP
            ═══════════════════════════════════════════════════════════════════ */}
            {currentExerciseType === 'fill_gap' && (
              <div className="space-y-6">
                {/* Sentence with gap */}
                <div className="bg-[#131328] border border-white/[0.06] rounded-2xl p-6 sm:p-8 text-center">
                  <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">
                    Complete the sentence
                  </p>
                  <p className="text-lg sm:text-xl text-white leading-relaxed">
                    {currentWord.gapSentence || currentWord.example.replace(
                      new RegExp(
                        `\\b${currentWord.correctAnswer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
                        'i'
                      ),
                      '_____'
                    )}
                  </p>
                  {currentWord.partOfSpeech && (
                    <p className="text-gray-600 text-xs mt-3 italic">
                      ({currentWord.partOfSpeech})
                    </p>
                  )}
                </div>

                {/* Answer display area — different UI for single-word vs multi-word */}
                {isMultiWordFillGap ? (
                  /* Multi-word: word tile slots */
                  <div className="flex flex-wrap items-center justify-center gap-2 min-h-[52px]">
                    {multiWordCorrectWords.map((_, i) => (
                      <div
                        key={i}
                        className={`px-4 py-2.5 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-all duration-200 min-w-[60px] ${
                          i < typedLetters.length
                            ? answerState === 'correct'
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                              : answerState === 'wrong'
                                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                                : 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                            : 'bg-white/[0.03] border-white/10 text-gray-600'
                        }`}
                      >
                        {i < typedLetters.length ? typedLetters[i] : ''}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Single-word: individual letter slots */
                  <div className="flex items-center justify-center gap-1.5 min-h-[52px]">
                    {Array.from({ length: currentWord.correctAnswer.length }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className={`w-9 h-11 sm:w-10 sm:h-12 rounded-lg border-2 flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                            i < typedLetters.length
                              ? answerState === 'correct'
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                              : answerState === 'wrong'
                                  ? 'bg-red-500/20 border-red-500/50 text-red-300'
                                  : 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                              : 'bg-white/[0.03] border-white/10 text-gray-600'
                          }`}
                        >
                          {i < typedLetters.length ? typedLetters[i] : ''}
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Show correct answer if wrong */}
                {answerState === 'wrong' && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Correct answer:{' '}
                      <span className="text-emerald-400 font-semibold">
                        {currentWord.correctAnswer}
                      </span>
                    </p>
                  </div>
                )}

                {/* Available tiles (if no options provided) */}
                {(!currentWord.options || currentWord.options.length === 0) &&
                  answerState === 'unanswered' && (
                    isMultiWordFillGap ? (
                      /* Multi-word: word tiles */
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {availableLetters.map((word, i) => (
                          <button
                            key={`${word}-${i}`}
                            onClick={() => handleLetterTap(word, i)}
                            className="px-4 py-2.5 rounded-xl bg-[#131328] border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 text-white font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    ) : (
                      /* Single-word: letter tiles */
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {availableLetters.map((letter, i) => (
                          <button
                            key={`${letter}-${i}`}
                            onClick={() => handleLetterTap(letter, i)}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#131328] border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 text-white font-bold text-base transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            {letter}
                          </button>
                        ))}
                      </div>
                    )
                  )}

                {/* Multiple choice options (if options provided) */}
                {currentWord.options &&
                  currentWord.options.length > 0 &&
                  answerState === 'unanswered' && (
                    <div className="grid grid-cols-2 gap-3">
                      {currentWord.options.map((option, i) => (
                        <button
                          key={`${option}-${i}`}
                          onClick={() => handleOptionSelect(option)}
                          className="py-3.5 px-4 rounded-xl bg-[#131328] border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 text-white font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                {/* Backspace + Hint row */}
                {answerState === 'unanswered' && (
                  <div className="flex items-center justify-center gap-3">
                    {typedLetters.length > 0 && (
                      <Button
                        onClick={handleRemoveLetter}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white hover:bg-white/5"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        {isMultiWordFillGap ? 'Undo' : 'Backspace'}
                      </Button>
                    )}
                    {hintVisible && !hintRevealed && (
                      <Button
                        onClick={handleHint}
                        variant="ghost"
                        size="sm"
                        className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                      >
                        <Lightbulb className="w-4 h-4 mr-1" />
                        Hint (-5pts)
                      </Button>
                    )}
                  </div>
                )}

                {/* Skip button */}
                {answerState === 'unanswered' && (
                  <div className="text-center">
                    <Button
                      onClick={handleSkip}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-400 hover:bg-white/5"
                    >
                      <SkipForward className="w-4 h-4 mr-1" />
                      Skip
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                SENTENCE BUILDER
            ═══════════════════════════════════════════════════════════════════ */}
            {currentExerciseType === 'sentence_builder' && (
              <div className="space-y-6">
                {/* Instructions */}
                <div className="bg-[#131328] border border-white/[0.06] rounded-2xl p-6 sm:p-8 text-center">
                  <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">
                    Build the sentence
                  </p>
                  <p className="text-gray-300 text-sm">
                    Tap the words in the correct order to form the sentence
                  </p>
                  {currentWord.definition && (
                    <p className="text-gray-500 text-xs mt-2 italic">
                      Hint: &ldquo;{currentWord.definition}&rdquo;
                    </p>
                  )}
                </div>

                {/* Selected words (building area) */}
                <div className="min-h-[60px] bg-[#131328] border border-white/[0.06] rounded-2xl p-4 flex flex-wrap gap-2 items-center">
                  {selectedWords.length === 0 && (
                    <p className="text-gray-600 text-sm">
                      Tap words below to build the sentence...
                    </p>
                  )}
                  {selectedWords.map((word, i) => {
                    const correctWords = currentWord.example
                      .replace(/[.,!?;:'"]/g, '')
                      .split(/\s+/)
                      .filter((w) => w.length > 0);
                    const isCorrectPosition =
                      answerState !== 'unanswered' &&
                      i < correctWords.length &&
                      word === correctWords[i];

                    return (
                      <button
                        key={`selected-${word}-${i}`}
                        onClick={() => {
                          if (answerState !== 'unanswered') return;
                          // Remove this word from selected and put back
                          const newSelected = [...selectedWords];
                          newSelected.splice(i, 1);
                          setSelectedWords(newSelected);
                          setScrambledWords((prev) => [...prev, word]);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          answerState === 'correct'
                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                            : answerState === 'wrong'
                              ? isCorrectPosition
                                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                                : 'bg-red-500/20 border border-red-500/30 text-red-300'
                              : 'bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25'
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>

                {/* Show correct answer if wrong */}
                {answerState === 'wrong' && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Correct order:{' '}
                      <span className="text-emerald-400 font-semibold">
                        {currentWord.example.replace(/[.,!?;:'"]/g, '')}
                      </span>
                    </p>
                  </div>
                )}

                {/* Scrambled words to pick from */}
                {answerState === 'unanswered' && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {scrambledWords.map((word, i) => (
                      <button
                        key={`scrambled-${word}-${i}`}
                        onClick={() => handleWordTap(word, i)}
                        className="px-3.5 py-2.5 rounded-xl bg-[#131328] border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/10 text-white text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                )}

                {/* Undo + Hint row */}
                {answerState === 'unanswered' && (
                  <div className="flex items-center justify-center gap-3">
                    {selectedWords.length > 0 && (
                      <Button
                        onClick={handleRemoveWord}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white hover:bg-white/5"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Undo
                      </Button>
                    )}
                    {hintVisible && !hintRevealed && (
                      <Button
                        onClick={handleHint}
                        variant="ghost"
                        size="sm"
                        className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                      >
                        <Lightbulb className="w-4 h-4 mr-1" />
                        Hint (-5pts)
                      </Button>
                    )}
                  </div>
                )}

                {/* Skip button */}
                {answerState === 'unanswered' && (
                  <div className="text-center">
                    <Button
                      onClick={handleSkip}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-400 hover:bg-white/5"
                    >
                      <SkipForward className="w-4 h-4 mr-1" />
                      Skip
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                MULTIPLE CHOICE
            ═══════════════════════════════════════════════════════════════════ */}
            {currentExerciseType === 'multiple_choice' && (
              <div className="space-y-6">
                {/* Definition */}
                <div className="bg-[#131328] border border-white/[0.06] rounded-2xl p-6 sm:p-8 text-center">
                  <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">
                    What word matches this definition?
                  </p>
                  <p className="text-lg sm:text-xl text-white leading-relaxed">
                    {currentWord.definition}
                  </p>
                  {currentWord.partOfSpeech && (
                    <p className="text-gray-600 text-xs mt-3 italic">
                      ({currentWord.partOfSpeech})
                    </p>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {(currentWord.options || []).map((option, i) => {
                    const isCorrectOption =
                      option.toLowerCase() ===
                      currentWord.correctAnswer.toLowerCase();
                    const isSelected =
                      answerState !== 'unanswered' && isCorrectOption;

                    return (
                      <button
                        key={`${option}-${i}`}
                        onClick={() => handleMCAnswer(option)}
                        disabled={answerState !== 'unanswered'}
                        className={`w-full py-4 px-5 rounded-xl text-left text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                          answerState === 'unanswered'
                            ? 'bg-[#131328] border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 text-white hover:scale-[1.01] active:scale-[0.99]'
                            : isCorrectOption
                              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                              : 'bg-[#131328] border border-white/5 text-gray-500 opacity-60'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            answerState === 'unanswered'
                              ? 'bg-white/5 text-gray-400'
                              : isCorrectOption
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-white/5 text-gray-600'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {isSelected && (
                          <Check className="w-5 h-5 text-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Show explanation if wrong */}
                {answerState === 'wrong' && (
                  <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                    <p className="text-sm text-gray-300">
                      The correct answer is{' '}
                      <span className="text-emerald-400 font-semibold">
                        {currentWord.correctAnswer}
                      </span>
                    </p>
                    {currentWord.example && (
                      <p className="text-xs text-gray-500 mt-1 italic">
                        &ldquo;{currentWord.example}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {/* Skip button */}
                {answerState === 'unanswered' && (
                  <div className="text-center">
                    <Button
                      onClick={handleSkip}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-400 hover:bg-white/5"
                    >
                      <SkipForward className="w-4 h-4 mr-1" />
                      Skip
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ── Correct/Wrong feedback overlay ── */}
            {answerState === 'correct' && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slide-up_0.3s_ease_forwards]">
                <div className="bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300 font-medium text-sm">
                    Correct! +{results[results.length - 1]?.score || 0}pts
                  </span>
                  {streak >= 3 && (
                    <span className="flex items-center gap-1 text-orange-300 text-xs ml-2">
                      <Flame className="w-3.5 h-3.5" />
                      {streak} streak!
                    </span>
                  )}
                </div>
              </div>
            )}

            {answerState === 'wrong' && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slide-up_0.3s_ease_forwards]">
                <div className="bg-red-500/20 border border-red-500/30 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-2 shadow-lg shadow-red-500/10">
                  <X className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 font-medium text-sm">
                    Incorrect
                  </span>
                </div>
              </div>
            )}

            {/* Skip auto-advance button */}
            {answerState !== 'unanswered' && (
              <div className="text-center mt-6">
                <Button
                  onClick={advanceToNext}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-white/5"
                >
                  {currentIndex + 1 >= words.length
                    ? 'View Results'
                    : 'Next Question'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
