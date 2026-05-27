'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  FileText,
  Headphones,
  Loader2,
  Menu,
  Mic,
  Play,
  Volume2,
  X,
  Award,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Zap,
  HelpCircle,
  Trophy,
} from 'lucide-react';

/* ============================================================
   TYPES
   ============================================================ */
interface LessonData {
  id: string;
  lessonNumber: number;
  title: string;
  contentType: string;
  content: string;
  vocabulary: string | null;
  quizData: string | null;
  audioScript: string | null;
  estimatedMinutes: number;
  videoUrl: string | null;
}

interface LessonProgressData {
  completed: boolean;
  quizScore: number | null;
  quizPassed: boolean;
  timeSpentSeconds: number;
}

interface LessonItem {
  id: string;
  lessonNumber: number;
  title: string;
  contentType: string;
  estimatedMinutes: number;
}

interface ModuleItem {
  id: string;
  moduleNumber: number;
  title: string;
  icon: string | null;
  lessons: LessonItem[];
}

interface VocabWord {
  word: string;
  definition: string;
  example: string;
  pronunciation: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonApiResponse {
  lesson: LessonData;
  module: { id: string; moduleNumber: number; title: string };
  course: { id: string; slug: string; title: string };
  progress: LessonProgressData | null;
  siblingLessons: LessonItem[];
  courseModules: ModuleItem[];
  enrollmentId: string;
}

interface EnrollmentInfo {
  id: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lessonProgress: Array<{
    lessonId: string;
    completed: boolean;
    quizScore: number | null;
    quizPassed: boolean;
    timeSpentSeconds: number;
  }>;
  course: {
    id: string;
    slug: string;
    title: string;
    modules: ModuleItem[];
  };
}

/* ============================================================
   HELPERS
   ============================================================ */
function contentTypeIcon(type: string) {
  switch (type) {
    case 'video':
      return <Play className="h-4 w-4" />;
    case 'interactive':
      return <Zap className="h-4 w-4" />;
    case 'listening':
      return <Headphones className="h-4 w-4" />;
    case 'practice':
      return <FileText className="h-4 w-4" />;
    case 'quiz':
      return <Award className="h-4 w-4" />;
    case 'speaking':
      return <Mic className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
}

function contentTypeLabel(type: string) {
  switch (type) {
    case 'video': return 'Video';
    case 'interactive': return 'Interactive';
    case 'listening': return 'Listening';
    case 'practice': return 'Practice';
    case 'quiz': return 'Quiz';
    case 'speaking': return 'Speaking';
    default: return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

function contentTypeBadgeColor(type: string) {
  switch (type) {
    case 'video': return 'bg-blue-500/15 text-blue-300 border-blue-500/25';
    case 'interactive': return 'bg-sky-500/15 text-sky-300 border-sky-500/25';
    case 'listening': return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25';
    case 'practice': return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25';
    case 'quiz': return 'bg-blue-400/15 text-blue-200 border-blue-400/25';
    case 'speaking': return 'bg-blue-600/15 text-blue-300 border-blue-600/25';
    default: return 'bg-white/10 text-white/60 border-white/10';
  }
}

/* ============================================================
   VIDEO PLAYER COMPONENT
   ============================================================ */
function VideoPlayer({ url, title }: { url: string; title: string }) {
  // Extract YouTube video ID from various URL formats
  const getYouTubeId = (videoUrl: string): string | null => {
    try {
      const parsed = new URL(videoUrl);
      // Standard youtube.com/watch?v=...
      if (parsed.hostname.includes('youtube.com') && parsed.searchParams.get('v')) {
        return parsed.searchParams.get('v');
      }
      // youtu.be/...
      if (parsed.hostname === 'youtu.be') {
        return parsed.pathname.slice(1);
      }
      // youtube.com/embed/...
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/embed/')[1]?.split('?')[0] || null;
      }
    } catch {}
    return null;
  };

  // Check if it's a Vimeo URL
  const isVimeo = (videoUrl: string): boolean => {
    try {
      return new URL(videoUrl).hostname.includes('vimeo.com');
    } catch {}
    return false;
  };

  const getVimeoId = (videoUrl: string): string | null => {
    try {
      const parsed = new URL(videoUrl);
      if (parsed.hostname.includes('vimeo.com')) {
        return parsed.pathname.split('/').pop() || null;
      }
    } catch {}
    return null;
  };

  const youtubeId = getYouTubeId(url);
  const vimeoId = isVimeo(url) ? getVimeoId(url) : null;

  return (
    <div className="glass-card overflow-hidden mt-6">
      {/* Video header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
          <Play className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white">Video Lesson</h3>
          <p className="text-xs text-white/40 truncate">{title}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300">
          <Play className="h-3 w-3" />
          Video
        </span>
      </div>

      {/* Video embed */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 */ }}>
        {youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&cc_load_policy=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
          />
        ) : vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white/5">
            <div className="text-center">
              <Play className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">Video unavailable</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
              >
                Open in new tab
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Video footer with tips */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-t border-white/5">
        <Sparkles className="h-3.5 w-3.5 text-blue-400 shrink-0" />
        <p className="text-xs text-white/40">
          Watch the video, then scroll down for the written lesson, vocabulary, and quiz.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   QUIZ SECTION COMPONENT
   ============================================================ */
function QuizSection({
  quizData,
  onQuizComplete,
  existingScore,
  existingPassed,
}: {
  quizData: string;
  onQuizComplete: (score: number, passed: boolean) => void;
  existingScore: number | null;
  existingPassed: boolean;
}) {
  const questions = useMemo<QuizQuestion[]>(() => {
    try {
      const parsed = JSON.parse(quizData);
      return Array.isArray(parsed) ? parsed : parsed.questions || [];
    } catch {
      console.error('Failed to parse quiz data');
      return [];
    }
  }, [quizData]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(() =>
    new Array(questions.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Show completed state if already passed
  if (existingPassed && existingScore !== null && !quizFinished) {
    return (
      <div className="glass-card p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Quiz Completed!</h3>
            <p className="text-sm text-white/50">You scored {existingScore}% — Great job!</p>
          </div>
        </div>
        <button
          className="glass-button px-4 py-2 text-sm text-white cursor-pointer"
          onClick={() => {
            setQuizFinished(false);
            setCurrentQuestion(0);
            setSelectedAnswers(new Array(questions.length).fill(null));
            setShowExplanation(false);
            setScore(0);
          }}
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  const q = questions[currentQuestion];
  const totalQuestions = questions.length;
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === q.correctIndex;
  const progressPercent = Math.round(((currentQuestion + (isAnswered ? 1 : 0)) / totalQuestions) * 100);

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      let correct = 0;
      selectedAnswers.forEach((answer, i) => {
        if (answer === questions[i].correctIndex) correct++;
      });
      const finalScore = Math.round((correct / totalQuestions) * 100);
      const passed = finalScore >= 70;
      setScore(finalScore);
      setQuizFinished(true);
      onQuizComplete(finalScore, passed);
    }
  };

  // Quiz finished screen
  if (quizFinished) {
    const passed = score >= 70;
    return (
      <div className="glass-card p-6 mt-6 text-center">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl mb-4 ${passed ? 'bg-blue-500/15 text-blue-400' : 'bg-red-500/15 text-red-400'}`}>
          {passed ? <CheckCircle2 className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {passed ? 'Quiz Passed!' : 'Quiz Not Passed'}
        </h3>
        <p className="text-white/50 mb-1">
          Your score: <span className="gradient-text-static font-bold text-lg">{score}%</span>
        </p>
        <p className="text-white/40 text-sm mb-6">
          {passed
            ? 'You met the 70% passing threshold. Great work!'
            : 'You need 70% to pass. Review the lesson and try again!'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            className="glass-button px-5 py-2.5 text-sm text-white cursor-pointer"
            onClick={() => {
              setQuizFinished(false);
              setCurrentQuestion(0);
              setSelectedAnswers(new Array(questions.length).fill(null));
              setShowExplanation(false);
              setScore(0);
            }}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 mt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">Lesson Quiz</h3>
          <p className="text-sm text-white/50">Question {currentQuestion + 1} of {totalQuestions}</p>
        </div>
        <span className="text-sm font-medium gradient-text-static">{progressPercent}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/5 mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question */}
      <p className="text-white font-medium mb-4 leading-relaxed">{q.question}</p>

      {/* Options */}
      <div className="space-y-3 mb-5">
        {q.options.map((option, idx) => {
          let optionStyle = 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/30 cursor-pointer';
          if (isAnswered) {
            if (idx === q.correctIndex) {
              optionStyle = 'bg-blue-500/10 border-blue-500/40 cursor-default';
            } else if (idx === selectedAnswer && !isCorrect) {
              optionStyle = 'bg-red-500/10 border-red-500/40 cursor-default';
            } else {
              optionStyle = 'bg-white/3 border-white/5 cursor-default opacity-50';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(idx)}
              disabled={isAnswered}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${optionStyle}`}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                isAnswered && idx === q.correctIndex
                  ? 'bg-blue-500/20 text-blue-300'
                  : isAnswered && idx === selectedAnswer && !isCorrect
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-white/10 text-white/60'
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className={`text-sm ${
                isAnswered && idx === q.correctIndex
                  ? 'text-blue-300'
                  : isAnswered && idx === selectedAnswer && !isCorrect
                    ? 'text-red-300'
                    : 'text-white/70'
              }`}>
                {option}
              </span>
              {isAnswered && idx === q.correctIndex && (
                <CheckCircle2 className="h-4 w-4 text-blue-400 ml-auto shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && isAnswered && (
        <div className={`rounded-xl p-4 mb-5 border ${
          isCorrect
            ? 'bg-blue-500/5 border-blue-500/20'
            : 'bg-indigo-500/5 border-indigo-500/20'
        }`}>
          <p className={`text-sm font-medium mb-1 ${isCorrect ? 'text-blue-300' : 'text-indigo-300'}`}>
            {isCorrect ? 'Correct!' : 'Not quite right'}
          </p>
          <p className="text-sm text-white/60 leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer"
        >
          {currentQuestion < totalQuestions - 1 ? (
            <>
              Next Question
              <ChevronRight className="h-4 w-4" />
            </>
          ) : (
            <>
              See Results
              <Sparkles className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

/* ============================================================
   VOCABULARY SECTION
   ============================================================ */
function VocabularySection({ vocabularyData }: { vocabularyData: string }) {
  const words = useMemo<VocabWord[]>(() => {
    try {
      const parsed = JSON.parse(vocabularyData);
      return Array.isArray(parsed) ? parsed : parsed.words || [];
    } catch {
      console.error('Failed to parse vocabulary data');
      return [];
    }
  }, [vocabularyData]);

  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const playWordAudio = useCallback((word: string) => {
    // Prevent double-clicks while already playing
    if (playingWord === word) return;
    setPlayingWord(word);

    // ── Primary: Server-side TTS API (Gemini Kore voice — professional female American) ──
    // This produces the highest quality, most natural-sounding pronunciation
    const tryServerTTS = (w: string) => {
      const audio = new Audio(`/api/tts/?text=${encodeURIComponent(w)}`);
      audio.onended = () => setPlayingWord(null);
      audio.onerror = () => {
        // Server TTS failed, try Web Speech as fallback
        tryWebSpeech(w);
      };
      audio.play().catch(() => {
        // Playback blocked, try Web Speech
        tryWebSpeech(w);
      });
    };

    // ── Fallback: Web Speech API (browser built-in) ──
    const tryWebSpeech = (w: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        setPlayingWord(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(w);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      // Try to find a professional female American voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
        || voices.find(v => v.lang.startsWith('en-US'))
        || voices.find(v => v.lang.startsWith('en'));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.onend = () => setPlayingWord(null);
      utterance.onerror = () => setPlayingWord(null);
      window.speechSynthesis.speak(utterance);
    };

    // Try server TTS first (professional voice), then Web Speech as fallback
    tryServerTTS(word);
  }, [playingWord]);

  if (words.length === 0) return null;

  return (
    <div className="glass-card p-6 mt-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
          <BookOpen className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-white">Vocabulary</h3>
        <span className="text-xs text-white/40 ml-auto">{words.length} words · tap 🔊 to listen</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {words.map((w, i) => (
          <div
            key={i}
            className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/8 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-white text-base">{w.word}</span>
                <button
                  onClick={() => playWordAudio(w.word)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 cursor-pointer shrink-0 shadow-md ${
                    playingWord === w.word
                      ? 'bg-emerald-500 border-emerald-300 text-white scale-115 shadow-emerald-500/40'
                      : 'bg-emerald-600/90 border border-emerald-400/60 text-white hover:bg-emerald-500 hover:scale-110 hover:shadow-emerald-500/50'
                  }`}
                  title={`Listen to "${w.word}"`}
                  aria-label={`Play pronunciation of ${w.word}`}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
              {w.pronunciation && (
                <span className="text-xs text-blue-300/80 font-mono shrink-0 mt-0.5">{w.pronunciation}</span>
              )}
            </div>
            <p className="text-sm text-white/60 mb-2">{w.definition}</p>
            {w.example && (
              <p className="text-xs text-white/40 italic border-t border-white/5 pt-2">
                &ldquo;{w.example}&rdquo;
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN LESSON VIEWER PAGE
   ============================================================ */
export default function LessonViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authIsLoading } = useAuthStore();

  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;
  const lessonIdParam = searchParams.get('lesson');

  const sandboxMode = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true';

  // State
  const [lessonData, setLessonData] = useState<LessonApiResponse | null>(null);
  const [enrollmentInfo, setEnrollmentInfo] = useState<EnrollmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<'unauthorized' | 'forbidden' | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [markingComplete, setMarkingComplete] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationCertId, setCelebrationCertId] = useState<string | null>(null);

  // Refs
  const startTimeRef = useRef<number>(Date.now());
  const initialLoadDone = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressUpdatedRef = useRef(false);

  // Fetch lesson data
  const fetchLesson = useCallback(async (lessonId: string) => {
    setLoading(true);
    setError(null);
    setAuthError(null);
    startTimeRef.current = Date.now();
    progressUpdatedRef.current = false;

    try {
      const res = await fetch(`/api/courses/lesson/${lessonId}/`, { credentials: 'same-origin' });

      if (res.status === 401) {
        setAuthError('unauthorized');
        setLoading(false);
        return;
      }

      if (res.status === 403) {
        setAuthError('forbidden');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch lesson');
      }

      const data: LessonApiResponse = await res.json();
      setLessonData(data);

      // Initialize quiz state from existing progress
      if (data.progress) {
        setQuizScore(data.progress.quizScore);
        setQuizPassed(data.progress.quizPassed);
      }

      // Auto-expand current module in sidebar
      setExpandedModules(prev => {
        const next = new Set(prev);
        next.add(data.module.id);
        return next;
      });
    } catch {
      setError('Failed to load lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch enrollment/course data for progress + completed lessons
  const fetchEnrollmentInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/courses/my-courses/', { credentials: 'same-origin' });
      if (!res.ok) return null;
      const data = await res.json();
      const enrollment = data.enrollments?.find(
        (e: { course: { id: string } }) => e.course.id === courseId
      );
      if (enrollment) {
        setEnrollmentInfo(enrollment);
      }
      return enrollment;
    } catch {
      return null;
    }
  }, [courseId]);

  // Initial load
  useEffect(() => {
    if (authIsLoading) return;
    // In sandbox mode, allow access without auth
    if (!isAuthenticated && !sandboxMode) return;
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    const init = async () => {
      if (lessonIdParam) {
        // Direct lesson ID provided
        await fetchLesson(lessonIdParam);
        await fetchEnrollmentInfo();
      } else {
        // No lesson specified — find the first lesson in the module from my-courses data
        const enrollment = await fetchEnrollmentInfo();
        if (enrollment) {
          const mod = enrollment.course.modules.find((m: ModuleItem) => m.id === moduleId);
          if (mod && mod.lessons.length > 0) {
            const firstLesson = mod.lessons[0];
            router.replace(`/learn/${courseId}/${moduleId}?lesson=${firstLesson.id}`);
            await fetchLesson(firstLesson.id);
          } else {
            setError('No lessons found in this module.');
            setLoading(false);
          }
        } else {
          // No enrollment data — try fetching the course directly to find the first lesson
          try {
            const courseRes = await fetch(`/api/courses/${courseId}`, { credentials: 'same-origin' });
            if (courseRes.ok) {
              const courseData = await courseRes.json();
              const course = courseData.course;
              if (course?.modules) {
                const mod = course.modules.find((m: ModuleItem) => m.id === moduleId);
                if (mod && mod.lessons && mod.lessons.length > 0) {
                  const firstLesson = mod.lessons[0];
                  router.replace(`/learn/${courseId}/${moduleId}?lesson=${firstLesson.id}`);
                  await fetchLesson(firstLesson.id);
                  return;
                }
              }
            }
          } catch {}
          setError('Could not load course data.');
          setLoading(false);
        }
      }
    };

    init();
  }, [authIsLoading, isAuthenticated, sandboxMode, lessonIdParam, courseId, moduleId, fetchLesson, fetchEnrollmentInfo, router]);

  // Handle URL changes when user navigates via sidebar
  useEffect(() => {
    if (!lessonIdParam || !initialLoadDone.current) return;
    // Don't re-fetch if we already have this lesson loaded
    if (lessonData?.lesson.id === lessonIdParam) return;
    fetchLesson(lessonIdParam);
  }, [lessonIdParam, lessonData?.lesson.id, fetchLesson]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Mark lesson as complete
  const handleMarkComplete = async () => {
    if (!lessonData || markingComplete) return;
    setMarkingComplete(true);

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      const res = await fetch('/api/courses/progress/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          enrollmentId: lessonData.enrollmentId,
          lessonId: lessonData.lesson.id,
          completed: true,
          timeSpentSeconds: timeSpent,
          ...(quizScore !== null ? { quizScore, quizPassed } : {}),
        }),
      });

      if (res.ok) {
        progressUpdatedRef.current = true;
        const progressData = await res.json();
        // Refresh enrollment info to get updated progress
        await fetchEnrollmentInfo();
        // Update local lesson data progress
        setLessonData(prev => prev ? {
          ...prev,
          progress: {
            completed: true,
            quizScore: quizScore ?? prev.progress?.quizScore ?? null,
            quizPassed: quizPassed || prev.progress?.quizPassed || false,
            timeSpentSeconds: timeSpent,
          },
        } : prev);

        // Check if course was just completed — show celebration
        if (progressData?.courseProgress?.status === 'completed') {
          const certId = progressData.courseProgress.certificateId;
          setCelebrationCertId(certId);
          setShowCelebration(true);
        }
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setMarkingComplete(false);
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizScore(score);
    setQuizPassed(passed);
  };

  // Handle TTS playback
  const handleTTS = async () => {
    if (!lessonData?.lesson.audioScript || ttsLoading) return;
    setTtsLoading(true);

    try {
      const audio = new Audio(`/api/tts/?text=${encodeURIComponent(lessonData.lesson.audioScript.slice(0, 2000))}`);
      audioRef.current = audio;

      audio.oncanplaythrough = () => {
        setTtsLoading(false);
        setTtsPlaying(true);
        audio.play();
      };

      audio.onended = () => {
        setTtsPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setTtsLoading(false);
        setTtsPlaying(false);
        audioRef.current = null;
      };

      audio.load();
    } catch {
      setTtsLoading(false);
    }
  };

  // Stop TTS
  const handleStopTTS = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setTtsPlaying(false);
    }
  };

  // Navigate to lesson
  const navigateToLesson = (lessonId: string) => {
    setSidebarOpen(false);
    router.push(`/learn/${courseId}/${moduleId}?lesson=${lessonId}`);
  };

  // Toggle module expansion
  const toggleModule = (modId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(modId)) {
        next.delete(modId);
      } else {
        next.add(modId);
      }
      return next;
    });
  };

  // Compute previous/next lesson
  const getAdjacentLessons = () => {
    if (!lessonData) return { prev: null, next: null };
    const siblings = lessonData.siblingLessons;
    const currentIndex = siblings.findIndex(l => l.id === lessonData.lesson.id);

    return {
      prev: currentIndex > 0 ? siblings[currentIndex - 1] : null,
      next: currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null,
    };
  };

  // Build completed lessons set from enrollment info
  const completedLessonIds = new Set(
    enrollmentInfo?.lessonProgress?.filter(lp => lp.completed).map(lp => lp.lessonId) || []
  );

  const { prev: prevLesson, next: nextLesson } = getAdjacentLessons();
  const courseProgress = enrollmentInfo?.progress ?? 0;
  const isCompleted = lessonData?.progress?.completed ?? false;

  /* ============================================================
     AUTH LOADING
     ============================================================ */
  if (authIsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      </div>
    );
  }

  /* ============================================================
     NOT AUTHENTICATED → redirect (skip in sandbox mode)
     ============================================================ */
  if (!isAuthenticated && !sandboxMode && !authIsLoading) {
    if (authError === 'unauthorized' || !isAuthenticated) {
      router.push(`/login?redirect=/learn/${courseId}/${moduleId}${lessonIdParam ? `?lesson=${lessonIdParam}` : ''}`);
      return (
        <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        </div>
      );
    }
  }

  /* ============================================================
     NOT ENROLLED (403) — skip in sandbox mode
     ============================================================ */
  if (authError === 'forbidden' && !sandboxMode) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="orb orb-blue w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
            <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          </div>
          <div className="w-full max-w-md relative">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400 mb-5">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Not Enrolled</h1>
              <p className="text-sm text-white/50 mb-6">
                You must be enrolled in this course to view lesson content. Please enroll first to access all lessons.
              </p>
              <Link href="/courses">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  Browse Courses
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     LOADING STATE
     ============================================================ */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        {/* Sticky progress bar skeleton */}
        <div className="sticky top-0 z-40 bg-[#0F0A1E]/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-40 bg-white/5" />
            <div className="flex-1" />
            <Skeleton className="h-2 w-32 rounded-full bg-white/5" />
          </div>
        </div>
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64 bg-white/5" />
            <Skeleton className="h-4 w-48 bg-white/5" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-3/4 bg-white/5" />
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-5/6 bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     ERROR STATE
     ============================================================ */
  if (error || !lessonData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="glass-card p-8 text-center max-w-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400 mb-5">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Something Went Wrong</h2>
            <p className="text-sm text-white/50 mb-6">{error || 'Failed to load lesson content.'}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                className="glass-button px-5 py-2.5 text-sm text-white cursor-pointer"
                onClick={() => {
                  setError(null);
                  initialLoadDone.current = false;
                  if (lessonIdParam) fetchLesson(lessonIdParam);
                }}
              >
                Try Again
              </button>
              <Link href="/learn">
                <button className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm cursor-pointer">
                  <ChevronLeft className="h-4 w-4" />
                  My Courses
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     MAIN CONTENT
     ============================================================ */
  const { lesson, module, course, progress, courseModules } = lessonData;

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      {/* ===== STICKY TOP BAR ===== */}
      <div className="sticky top-0 z-40 bg-[#0F0A1E]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl glass-button text-white cursor-pointer"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Course title */}
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/learn" className="text-white/40 hover:text-white/70 transition-colors shrink-0">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <span className="text-sm font-medium text-white truncate hidden sm:block">
              {course.title}
            </span>
          </div>

          <div className="flex-1" />

          {/* Progress */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50 hidden sm:block">
              {enrollmentInfo?.completedLessons ?? 0}/{enrollmentInfo?.totalLessons ?? 0} lessons
            </span>
            <div className="w-32 sm:w-48 h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700"
                style={{ width: `${courseProgress}%` }}
              />
            </div>
            <span className="text-sm font-bold gradient-text-static">{courseProgress}%</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* ===== SIDEBAR (Desktop) ===== */}
        <aside className="hidden lg:block w-72 xl:w-80 shrink-0 border-r border-white/5 overflow-y-auto max-h-[calc(100vh-57px)] sticky top-[57px]">
          <div className="p-4">
            <SidebarContent
              courseModules={courseModules}
              currentLessonId={lesson.id}
              currentModuleId={module.id}
              completedLessonIds={completedLessonIds}
              expandedModules={expandedModules}
              toggleModule={toggleModule}
              navigateToLesson={navigateToLesson}
            />
          </div>
        </aside>

        {/* ===== SIDEBAR (Mobile overlay) ===== */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Panel */}
            <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#0F0A1E] border-r border-white/10 z-50 lg:hidden overflow-y-auto animate-slide-right">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">Course Content</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <SidebarContent
                  courseModules={courseModules}
                  currentLessonId={lesson.id}
                  currentModuleId={module.id}
                  completedLessonIds={completedLessonIds}
                  expandedModules={expandedModules}
                  toggleModule={toggleModule}
                  navigateToLesson={navigateToLesson}
                />
              </div>
            </div>
          </>
        )}

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="max-w-3xl mx-auto">
            {/* Lesson header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* Content type badge */}
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${contentTypeBadgeColor(lesson.contentType)}`}>
                  {contentTypeIcon(lesson.contentType)}
                  {contentTypeLabel(lesson.contentType)}
                </span>
                {/* Time estimate */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                  <Clock className="h-3 w-3" />
                  {lesson.estimatedMinutes} min
                </span>
                {/* Module badge */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                  Module {module.moduleNumber}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                <span className="text-white/30 mr-2">{lesson.lessonNumber}.</span>
                {lesson.title}
              </h1>
            </div>

            {/* Video Player — shown before content if video exists */}
            {lesson.videoUrl && (
              <VideoPlayer url={lesson.videoUrl} title={lesson.title} />
            )}

            {/* Lesson HTML content */}
            {lesson.content && (
              <div
                className={`lesson-content max-w-none ${lesson.videoUrl ? 'mt-6' : 'mb-8'}`}
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            )}

            {/* Vocabulary section */}
            {lesson.vocabulary && (
              <VocabularySection vocabularyData={lesson.vocabulary} />
            )}

            {/* Quiz section */}
            {lesson.quizData && (
              <QuizSection
                quizData={lesson.quizData}
                onQuizComplete={handleQuizComplete}
                existingScore={progress?.quizScore ?? quizScore}
                existingPassed={progress?.quizPassed ?? quizPassed}
              />
            )}

            {/* Audio/TTS button */}
            {lesson.audioScript && (
              <div className="mt-6">
                {ttsPlaying ? (
                  <button
                    onClick={handleStopTTS}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-red-500/15 border border-red-500/25 text-red-300 text-sm font-medium cursor-pointer hover:bg-red-500/20 transition-colors"
                  >
                    <Volume2 className="h-4 w-4 animate-pulse" />
                    Stop Audio
                  </button>
                ) : (
                  <button
                    onClick={handleTTS}
                    disabled={ttsLoading}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 glass-button text-sm font-medium text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {ttsLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading Audio...
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4" />
                        Listen to Lesson
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Mark as Complete / Completed indicator */}
            <div className="mt-8 pt-6 border-t border-white/5">
              {isCompleted ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-300">Lesson Completed</p>
                    {progress?.quizScore !== null && progress?.quizScore !== undefined && (
                      <p className="text-xs text-white/40 mt-0.5">Quiz score: {progress.quizScore}%</p>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleMarkComplete}
                  disabled={markingComplete}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {markingComplete ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Mark as Complete
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Previous / Next navigation */}
            <div className="mt-6 flex items-center justify-between gap-4">
              {prevLesson ? (
                <button
                  onClick={() => navigateToLesson(prevLesson.id)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 glass-button text-sm text-white cursor-pointer hover:-translate-y-0.5 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline truncate max-w-[200px]">{prevLesson.title}</span>
                  <span className="sm:hidden">Previous</span>
                </button>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <button
                  onClick={() => navigateToLesson(nextLesson.id)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-medium cursor-pointer hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/20"
                >
                  <span className="hidden sm:inline truncate max-w-[200px]">{nextLesson.title}</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <Link href="/learn">
                  <button className="flex items-center gap-2 rounded-xl px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-medium cursor-pointer hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/20">
                    Back to Courses
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ===== COURSE COMPLETION CELEBRATION ===== */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 40 }).map((_, i) => {
              const colors = ['#a855f7', '#ec4899', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
              const color = colors[i % colors.length];
              const left = Math.random() * 100;
              const delay = Math.random() * 3;
              const duration = 2 + Math.random() * 3;
              const size = 4 + Math.random() * 8;
              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${left}%`,
                    top: '-10px',
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                    animation: `confetti-fall ${duration}s linear ${delay}s forwards`,
                  }}
                />
              );
            })}
          </div>

          {/* Celebration Card */}
          <div className="relative z-10 mx-4 w-full max-w-md">
            <div className="glass-card p-8 text-center relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mt-32 pointer-events-none" />

              {/* Trophy icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white mb-6 shadow-lg shadow-blue-500/30" style={{ animation: 'celebration-bounce 2s ease-in-out infinite' }}>
                <Trophy className="h-10 w-10" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">Course Complete!</h2>
              <p className="text-white/60 mb-1">Congratulations! You&apos;ve finished</p>
              <p className="text-lg font-semibold gradient-text-static mb-6">
                {lessonData?.course?.title || 'the course'}
              </p>

              <p className="text-white/40 text-sm mb-8">
                Your course completion certificate is ready. You can view and download it anytime.
              </p>

              <div className="flex flex-col gap-3">
                {celebrationCertId && (
                  <Link href={`/certificate/${celebrationCertId}`}>
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer hover:-translate-y-0.5">
                      <Award className="h-5 w-5" />
                      View Your Certificate
                    </button>
                  </Link>
                )}
                <Link href="/learn">
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 glass-button text-white font-medium text-sm cursor-pointer hover:-translate-y-0.5 transition-all duration-300">
                    <BookOpen className="h-4 w-4" />
                    Back to My Courses
                  </button>
                </Link>
                <button
                  onClick={() => setShowCelebration(false)}
                  className="text-white/30 text-xs hover:text-white/50 transition-colors cursor-pointer mt-2"
                >
                  Continue reviewing this lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes slide-right {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-right {
          animation: slide-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes celebration-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   SIDEBAR CONTENT (shared between desktop & mobile)
   ============================================================ */
function SidebarContent({
  courseModules,
  currentLessonId,
  currentModuleId,
  completedLessonIds,
  expandedModules,
  toggleModule,
  navigateToLesson,
}: {
  courseModules: ModuleItem[];
  currentLessonId: string;
  currentModuleId: string;
  completedLessonIds: Set<string>;
  expandedModules: Set<string>;
  toggleModule: (id: string) => void;
  navigateToLesson: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {courseModules.map((mod) => {
        const isExpanded = expandedModules.has(mod.id);
        const isCurrentModule = mod.id === currentModuleId;

        return (
          <div key={mod.id} className="rounded-xl overflow-hidden">
            {/* Module header */}
            <button
              onClick={() => toggleModule(mod.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                isCurrentModule
                  ? 'bg-blue-500/10 border border-blue-500/20'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isCurrentModule
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                    : 'bg-white/10 text-white/60'
                }`}>
                  {mod.moduleNumber}
                </span>
                <span className={`text-sm font-medium truncate ${
                  isCurrentModule ? 'text-white' : 'text-white/70'
                }`}>
                  {mod.title}
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-white/40 shrink-0 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 text-white/40 shrink-0 ml-1" />
              )}
            </button>

            {/* Lessons */}
            {isExpanded && (
              <div className="mt-1 space-y-0.5 pl-2">
                {mod.lessons.map((les) => {
                  const isCurrentLesson = les.id === currentLessonId;
                  const isLessonCompleted = completedLessonIds.has(les.id);

                  return (
                    <button
                      key={les.id}
                      onClick={() => navigateToLesson(les.id)}
                      className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                        isCurrentLesson
                          ? 'bg-blue-500/15 border border-blue-500/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Lesson number or completed check */}
                      {isLessonCompleted ? (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-500/15 text-blue-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                          isCurrentLesson
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-white/5 text-white/40'
                        }`}>
                          {les.lessonNumber}
                        </div>
                      )}

                      {/* Content type icon */}
                      <span className={`shrink-0 ${
                        isCurrentLesson ? 'text-blue-400' : 'text-white/30'
                      }`}>
                        {contentTypeIcon(les.contentType)}
                      </span>

                      {/* Title */}
                      <span className={`text-sm truncate flex-1 ${
                        isCurrentLesson ? 'text-white font-medium' : 'text-white/60'
                      }`}>
                        {les.title}
                      </span>

                      {/* Time */}
                      <span className="text-[10px] text-white/30 shrink-0">
                        {les.estimatedMinutes}m
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
