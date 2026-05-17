'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  PenTool,
  Mic,
  MicOff,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Target,
  Sparkles,
  Download,
  RotateCcw,
  Volume2,
  AlertTriangle,
  ChevronRight,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────────

interface CefrQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  level: string;
  category: string;
}

interface WritingEvaluation {
  cefrLevel: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface SpeakingEvaluation {
  cefrLevel: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface SubmitResult {
  assessment: {
    id: string;
    status: string;
    cefrLevel: string;
    score: number;
    completedAt: string;
  };
  results: {
    correctCount: number;
    totalQuestions: number;
    percentage: number;
  };
  certificate: {
    id: string;
    verificationId: string;
    cefrLevel: string;
    score: number;
    userName: string;
    issuedAt: string;
  };
  message: string;
}

type Phase = 'intro' | 'mcq' | 'writing' | 'speaking' | 'results';

interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  level: string;
  category: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────────

const CEFR_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  A2: 'bg-green-100 text-green-800 border-green-200',
  B1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  B2: 'bg-orange-100 text-orange-800 border-orange-200',
  C1: 'bg-red-100 text-red-800 border-red-200',
  C2: 'bg-purple-100 text-purple-800 border-purple-200',
};

const CEFR_BG_GRADIENT: Record<string, string> = {
  A1: 'from-emerald-500 to-teal-600',
  A2: 'from-green-500 to-emerald-600',
  B1: 'from-yellow-500 to-amber-600',
  B2: 'from-orange-500 to-amber-600',
  C1: 'from-red-500 to-rose-600',
  C2: 'from-purple-500 to-violet-600',
};

const CEFR_DESCRIPTIONS: Record<string, string> = {
  A1: 'Beginner — Can understand and use familiar everyday expressions and very basic phrases.',
  A2: 'Elementary — Can communicate in simple and routine tasks requiring a direct exchange of information.',
  B1: 'Intermediate — Can deal with most situations likely to arise while travelling in an area where the language is spoken.',
  B2: 'Upper Intermediate — Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible.',
  C1: 'Advanced — Can express ideas fluently and spontaneously without much obvious searching for expressions.',
  C2: 'Proficiency — Can understand with ease virtually everything heard or read.',
};

const WRITING_PROMPTS: Record<string, string> = {
  A1: 'Write a short paragraph about yourself. Include your name, where you live, and what you like to do in your free time. (50-100 words)',
  A2: 'Write an email to a friend telling them about your last holiday. Where did you go? What did you do? Did you enjoy it? (80-120 words)',
  B1: 'Some people think that technology has made our lives easier, while others believe it has made life more complicated. What is your opinion? Write a short essay explaining your view with examples. (120-180 words)',
  B2: 'Many cities around the world are facing problems with traffic congestion and pollution. What measures could governments and individuals take to tackle these issues? Write a well-structured essay discussing the causes and proposing solutions. (180-250 words)',
  C1: 'The rise of artificial intelligence is transforming the workplace in unprecedented ways. Some argue this will lead to widespread unemployment, while others believe it will create new opportunities we cannot yet imagine. Critically evaluate both perspectives and present your own well-reasoned position. (250-350 words)',
  C2: 'In an era of increasing global interconnectedness, the tension between cultural homogenisation and the preservation of local identity has become a defining challenge of our time. Write a critical analysis examining how globalisation both threatens and enriches cultural diversity, drawing on specific examples from at least two different regions of the world. (350-500 words)',
};

const SPEAKING_PROMPTS: Record<string, string> = {
  A1: 'Tell me about your daily routine. What do you usually do from morning to evening?',
  A2: 'Describe a memorable trip you have taken. Where did you go, and what made it special?',
  B1: 'Talk about a skill you would like to learn in the future. Why is it important to you, and how would you go about learning it?',
  B2: 'Discuss the advantages and disadvantages of working remotely compared to working in an office. Give specific examples to support your points.',
  C1: 'Present your perspective on whether universities should prioritise practical skills over theoretical knowledge in their curricula. Consider the implications for both students and society.',
  C2: 'Deliver a reasoned argument on whether social media platforms should be held legally accountable for the spread of misinformation. Consider the balance between free speech and public safety.',
};

const SKILL_ICONS: Record<string, React.ReactNode> = {
  grammar: <BookOpen className="h-4 w-4" />,
  vocabulary: <MessageSquare className="h-4 w-4" />,
  reading: <FileText className="h-4 w-4" />,
  listening: <Volume2 className="h-4 w-4" />,
  writing: <PenTool className="h-4 w-4" />,
  speaking: <Mic className="h-4 w-4" />,
};

const SKILL_COLORS: Record<string, string> = {
  grammar: 'text-teal-600 bg-teal-50',
  vocabulary: 'text-cyan-600 bg-cyan-50',
  reading: 'text-emerald-600 bg-emerald-50',
  listening: 'text-amber-600 bg-amber-50',
  writing: 'text-rose-600 bg-rose-50',
  speaking: 'text-violet-600 bg-violet-50',
};

// ─── Phase Progress Indicator ────────────────────────────────────────────────────

function PhaseProgress({ currentPhase }: { currentPhase: Phase }) {
  const steps = [
    { key: 'mcq', label: 'MCQ Questions', icon: <BookOpen className="h-4 w-4" /> },
    { key: 'writing', label: 'Writing', icon: <PenTool className="h-4 w-4" /> },
    { key: 'speaking', label: 'Speaking', icon: <Mic className="h-4 w-4" /> },
    { key: 'results', label: 'Results', icon: <Award className="h-4 w-4" /> },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentPhase);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isActive = i === currentIndex;
          const isCompleted = i < currentIndex;
          const isUpcoming = i > currentIndex;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500
                    ${isCompleted
                      ? 'border-teal-500 bg-teal-500 text-white shadow-md shadow-teal-500/25'
                      : isActive
                        ? 'border-teal-600 bg-teal-600 text-white shadow-lg shadow-teal-600/30 scale-110'
                        : 'border-gray-200 bg-gray-50 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : step.icon}
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-300 hidden sm:block ${
                    isActive ? 'text-teal-700' : isCompleted ? 'text-teal-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 sm:mx-4 rounded-full transition-all duration-500
                    ${i < currentIndex ? 'bg-teal-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Animated Transition Wrapper ─────────────────────────────────────────────────

function FadeIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ${className}`}>
      {children}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────────

export default function TestPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authIsLoading, accessToken, user } = useAuthStore();

  // Phase management
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');

  // Assessment data
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [questions, setQuestions] = useState<CefrQuestion[]>([]);
  const [estimatedLevel, setEstimatedLevel] = useState<string>('B1');

  // MCQ state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [mcqStartTime, setMcqStartTime] = useState<number>(0);

  // Writing state
  const [writingText, setWritingText] = useState('');
  const [writingEvaluation, setWritingEvaluation] = useState<WritingEvaluation | null>(null);
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState(false);

  // Speaking state
  const [speakingTranscript, setSpeakingTranscript] = useState('');
  const [speakingEvaluation, setSpeakingEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [isEvaluatingSpeaking, setIsEvaluatingSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [useFallbackInput, setUseFallbackInput] = useState(false);
  const [fallbackText, setFallbackText] = useState('');
  const recognitionRef = useRef<any>(null);

  // Results state
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [skillBreakdown, setSkillBreakdown] = useState<Record<string, number>>({});

  // Loading states
  const [isStartingAssessment, setIsStartingAssessment] = useState(false);
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer
  const [elapsedTime, setElapsedTime] = useState(0);

  // Check Speech API support
  useEffect(() => {
    const supported = typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setSpeechSupported(supported);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authIsLoading && !isAuthenticated && typeof window !== 'undefined') {
      router.push('/login');
    }
  }, [authIsLoading, isAuthenticated, router]);

  // Check premium plan
  const isPremium = user?.plan === 'premium';

  // Timer effect
  useEffect(() => {
    if (currentPhase !== 'intro' && currentPhase !== 'results') {
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentPhase]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ─── Start Assessment ────────────────────────────────────────────────────────

  const startAssessment = useCallback(async () => {
    if (!accessToken) return;
    setIsStartingAssessment(true);
    setError(null);

    try {
      const res = await fetch('/api/assessments/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError('Premium plan required. Please upgrade to take the CEFR assessment.');
          return;
        }
        setError(data.message || data.error || 'Failed to start assessment.');
        return;
      }

      setAssessmentId(data.assessment.id);
      setQuestions(data.questions || []);
      setMcqStartTime(Date.now());
      setElapsedTime(0);
      setCurrentPhase('mcq');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsStartingAssessment(false);
    }
  }, [accessToken]);

  // ─── MCQ Answer Handling ─────────────────────────────────────────────────────

  const handleAnswerSelect = useCallback((index: number) => {
    if (showAnswerFeedback) return;
    setSelectedAnswer(index);
    setShowAnswerFeedback(true);

    const question = questions[currentQuestionIndex];
    const isCorrect = index === question.correctIndex;

    const answerRecord: AnswerRecord = {
      questionId: question.id,
      selectedIndex: index,
      isCorrect,
      level: question.level,
      category: question.category,
    };

    setAnswers((prev) => [...prev, answerRecord]);

    // Auto-advance after delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowAnswerFeedback(false);
      } else {
        // MCQ phase complete — estimate level and move to writing
        estimateLevelFromAnswers([...answers, answerRecord]);
      }
    }, 1200);
  }, [showAnswerFeedback, questions, currentQuestionIndex, answers]);

  const estimateLevelFromAnswers = (allAnswers: AnswerRecord[]) => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    let highestPassed = 'A1';

    for (const level of levels) {
      const levelAnswers = allAnswers.filter((a) => a.level === level);
      if (levelAnswers.length > 0) {
        const correct = levelAnswers.filter((a) => a.isCorrect).length;
        if (correct / levelAnswers.length >= 0.5) {
          highestPassed = level;
        }
      }
    }

    setEstimatedLevel(highestPassed);
    setCurrentPhase('writing');
  };

  // ─── Writing Evaluation ──────────────────────────────────────────────────────

  const evaluateWriting = useCallback(async () => {
    if (!accessToken || !writingText.trim()) return;
    const wordCount = writingText.trim().split(/\s+/).length;
    if (wordCount < 50) return;

    setIsEvaluatingWriting(true);
    setError(null);

    try {
      const res = await fetch('/api/assessments/writing/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          text: writingText,
          prompt: WRITING_PROMPTS[estimatedLevel],
          level: estimatedLevel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to evaluate writing.');
        return;
      }

      setWritingEvaluation(data);
    } catch {
      setError('Network error during writing evaluation.');
    } finally {
      setIsEvaluatingWriting(false);
    }
  }, [accessToken, writingText, estimatedLevel]);

  // ─── Speaking / Speech Recognition ───────────────────────────────────────────

  const startRecording = useCallback(() => {
    if (!speechSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = speakingTranscript;

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
          setSpeakingTranscript(finalTranscript.trim());
        } else {
          interim += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access or use the text input option.');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [speechSupported, speakingTranscript]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const evaluateSpeaking = useCallback(async () => {
    const transcriptToEvaluate = speakingTranscript || fallbackText;
    if (!accessToken || !transcriptToEvaluate.trim()) return;
    const wordCount = transcriptToEvaluate.trim().split(/\s+/).length;
    if (wordCount < 20) return;

    setIsEvaluatingSpeaking(true);
    setError(null);

    try {
      const res = await fetch('/api/assessments/speaking/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          transcript: transcriptToEvaluate,
          prompt: SPEAKING_PROMPTS[estimatedLevel],
          level: estimatedLevel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to evaluate speaking.');
        return;
      }

      setSpeakingEvaluation(data);
    } catch {
      setError('Network error during speaking evaluation.');
    } finally {
      setIsEvaluatingSpeaking(false);
    }
  }, [accessToken, speakingTranscript, fallbackText, estimatedLevel]);

  // ─── Submit Assessment ───────────────────────────────────────────────────────

  const submitAssessment = useCallback(async () => {
    if (!accessToken || !assessmentId) return;

    setIsSubmittingAssessment(true);
    setError(null);

    try {
      const responses = answers.map((a) => ({
        questionId: a.questionId,
        answer: String(a.selectedIndex),
        isCorrect: a.isCorrect,
        level: a.level,
        category: a.category,
      }));

      const res = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          assessmentId,
          responses,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || 'Failed to submit assessment.');
        return;
      }

      setSubmitResult(data);

      // Build skill breakdown combining MCQ + writing + speaking
      const breakdown: Record<string, number> = {};

      // From MCQ answers
      const categories = ['grammar', 'vocabulary', 'reading', 'listening'] as const;
      for (const cat of categories) {
        const catAnswers = answers.filter((a) => a.category === cat);
        if (catAnswers.length > 0) {
          const correct = catAnswers.filter((a) => a.isCorrect).length;
          breakdown[cat] = Math.round((correct / catAnswers.length) * 100);
        } else {
          breakdown[cat] = Math.round(data.results.percentage * 0.9);
        }
      }

      // From evaluations
      breakdown['writing'] = writingEvaluation?.score ?? Math.round(data.results.percentage * 0.85);
      breakdown['speaking'] = speakingEvaluation?.score ?? Math.round(data.results.percentage * 0.8);

      setSkillBreakdown(breakdown);
      setCurrentPhase('results');
    } catch {
      setError('Network error during submission.');
    } finally {
      setIsSubmittingAssessment(false);
    }
  }, [accessToken, assessmentId, answers, writingEvaluation, speakingEvaluation]);

  // ─── Retake Test ─────────────────────────────────────────────────────────────

  const retakeTest = () => {
    setCurrentPhase('intro');
    setAssessmentId('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswerFeedback(false);
    setAnswers([]);
    setWritingText('');
    setWritingEvaluation(null);
    setSpeakingTranscript('');
    setSpeakingEvaluation(null);
    setFallbackText('');
    setSubmitResult(null);
    setSkillBreakdown({});
    setError(null);
    setElapsedTime(0);
  };

  // ─── Loading State ───────────────────────────────────────────────────────────

  if (authIsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // ─── Not Premium ─────────────────────────────────────────────────────────────

  if (!isPremium && currentPhase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-8 px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
              <CardTitle className="text-xl">Premium Required</CardTitle>
              <CardDescription>
                You need a Premium plan to access the full CEFR assessment.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Upgrade to Premium to take the comprehensive CEFR English test and earn your certificate.
              </p>
              <Link href="/pricing">
                <Button className="gap-2">
                  <Star className="h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Error Banner ────────────────────────────────────────────────────────────

  const ErrorBanner = () => {
    if (!error) return null;
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start gap-3 animate-in fade-in-0 slide-in-from-top-2 duration-300">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium">{error}</p>
        </div>
        <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // ─── Render Phases ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="flex-1 py-6 px-4">
        <div className="container max-w-3xl mx-auto space-y-6">

          {/* Phase Progress (hide on intro) */}
          {currentPhase !== 'intro' && (
            <FadeIn>
              <div className="bg-white rounded-xl border p-4 sm:p-6 shadow-sm">
                <PhaseProgress currentPhase={currentPhase} />
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(elapsedTime)}</span>
                  </div>
                  {currentPhase === 'mcq' && questions.length > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <Target className="h-3 w-3" />
                      {currentQuestionIndex + 1} / {questions.length}
                    </Badge>
                  )}
                </div>
              </div>
            </FadeIn>
          )}

          <ErrorBanner />

          {/* ─── INTRO PHASE ──────────────────────────────────────────────────── */}
          {currentPhase === 'intro' && (
            <FadeIn>
              <div className="text-center space-y-6 py-8">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-500/25">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    CEFR English Assessment
                  </h1>
                  <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                    Evaluate your English proficiency across all skills. This comprehensive assessment covers grammar, vocabulary, reading, listening, writing, and speaking.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
                  {[
                    {
                      icon: <BookOpen className="h-6 w-6" />,
                      title: 'MCQ Questions',
                      desc: 'Multiple-choice questions across all CEFR levels',
                      color: 'text-teal-600 bg-teal-50',
                    },
                    {
                      icon: <PenTool className="h-6 w-6" />,
                      title: 'Writing Test',
                      desc: 'Level-appropriate writing with AI feedback',
                      color: 'text-amber-600 bg-amber-50',
                    },
                    {
                      icon: <Mic className="h-6 w-6" />,
                      title: 'Speaking Test',
                      desc: 'Speech recognition with AI evaluation',
                      color: 'text-violet-600 bg-violet-50',
                    },
                  ].map((item) => (
                    <Card key={item.title} className="text-center">
                      <CardContent className="pt-6 space-y-2">
                        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                          {item.icon}
                        </div>
                        <h3 className="font-semibold text-sm">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-lg mx-auto text-left">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Before you begin</p>
                      <ul className="text-xs text-amber-700 mt-1 space-y-1">
                        <li>• Ensure you have a stable internet connection</li>
                        <li>• The speaking test requires microphone access (Chrome/Edge)</li>
                        <li>• You cannot pause the test once started</li>
                        <li>• Estimated time: 25-40 minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg shadow-teal-600/25"
                  onClick={startAssessment}
                  disabled={isStartingAssessment}
                >
                  {isStartingAssessment ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Starting Assessment...
                    </>
                  ) : (
                    <>
                      Begin Assessment
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </FadeIn>
          )}

          {/* ─── MCQ PHASE ────────────────────────────────────────────────────── */}
          {currentPhase === 'mcq' && questions.length > 0 && (
            <FadeIn key={`q-${currentQuestionIndex}`}>
              <Card className="overflow-hidden">
                {/* Progress header */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        {questions[currentQuestionIndex].level}
                      </Badge>
                      <Badge variant="outline" className="border-white/30 text-white">
                        {questions[currentQuestionIndex].category}
                      </Badge>
                    </div>
                    <span className="text-sm text-white/80">
                      {currentQuestionIndex + 1} of {questions.length}
                    </span>
                  </div>
                  <Progress
                    value={((currentQuestionIndex + 1) / questions.length) * 100}
                    className="h-2 bg-white/20 [&>div]:bg-white"
                  />
                </div>

                <CardContent className="pt-6 space-y-6">
                  <h2 className="text-lg sm:text-xl font-semibold leading-relaxed">
                    {questions[currentQuestionIndex].text}
                  </h2>

                  <div className="space-y-3">
                    {questions[currentQuestionIndex].options.map((option, i) => {
                      const isSelected = selectedAnswer === i;
                      const isCorrectOption = i === questions[currentQuestionIndex].correctIndex;
                      const showCorrectness = showAnswerFeedback;

                      let optionStyle = 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/50 cursor-pointer';

                      if (showCorrectness) {
                        if (isCorrectOption) {
                          optionStyle = 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-400/30';
                        } else if (isSelected && !isCorrectOption) {
                          optionStyle = 'border-red-400 bg-red-50 ring-2 ring-red-400/30';
                        } else {
                          optionStyle = 'border-gray-100 bg-gray-50/50 opacity-60';
                        }
                      } else if (isSelected) {
                        optionStyle = 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/30';
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswerSelect(i)}
                          disabled={showAnswerFeedback}
                          className={`
                            w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                            ${optionStyle}
                            ${showAnswerFeedback ? 'cursor-default' : 'active:scale-[0.99]'}
                          `}
                        >
                          <div className={`
                            flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold shrink-0 transition-colors
                            ${showCorrectness && isCorrectOption
                              ? 'bg-emerald-500 text-white'
                              : showCorrectness && isSelected && !isCorrectOption
                                ? 'bg-red-500 text-white'
                                : isSelected
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-100 text-gray-600'
                            }
                          `}>
                            {showCorrectness && isCorrectOption ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : showCorrectness && isSelected && !isCorrectOption ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              String.fromCharCode(65 + i)
                            )}
                          </div>
                          <span className="text-sm sm:text-base flex-1">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Answer feedback message */}
                  {showAnswerFeedback && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ${
                      selectedAnswer === questions[currentQuestionIndex].correctIndex
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {selectedAnswer === questions[currentQuestionIndex].correctIndex ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 shrink-0" />
                          <span className="text-sm font-medium">Correct! Well done.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 shrink-0" />
                          <span className="text-sm font-medium">
                            Incorrect. The correct answer is{' '}
                            <strong>{questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctIndex]}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <Card className="py-3">
                  <CardContent className="text-center p-0">
                    <p className="text-2xl font-bold text-teal-600">
                      {answers.filter((a) => a.isCorrect).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Correct</p>
                  </CardContent>
                </Card>
                <Card className="py-3">
                  <CardContent className="text-center p-0">
                    <p className="text-2xl font-bold text-red-500">
                      {answers.filter((a) => !a.isCorrect).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Incorrect</p>
                  </CardContent>
                </Card>
                <Card className="py-3">
                  <CardContent className="text-center p-0">
                    <p className="text-2xl font-bold text-gray-600">
                      {questions.length - answers.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          )}

          {/* ─── WRITING PHASE ────────────────────────────────────────────────── */}
          {currentPhase === 'writing' && (
            <FadeIn>
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 sm:p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                      <PenTool className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Writing Assessment</h2>
                      <p className="text-sm text-white/80">
                        Estimated level: <Badge className="bg-white/20 text-white border-white/30 ml-1">{estimatedLevel}</Badge>
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="pt-6 space-y-5">
                  {/* Writing prompt */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Writing Prompt</p>
                        <p className="text-sm text-amber-700 mt-1">{WRITING_PROMPTS[estimatedLevel]}</p>
                      </div>
                    </div>
                  </div>

                  {!writingEvaluation ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Your Response</label>
                          <span className={`text-xs ${
                            writingText.trim().split(/\s+/).length >= 50 ? 'text-emerald-600' : 'text-muted-foreground'
                          }`}>
                            {writingText.trim().split(/\s+/).filter(Boolean).length} words
                            {writingText.trim().split(/\s+/).filter(Boolean).length < 50 && ' (minimum 50)'}
                          </span>
                        </div>
                        <Textarea
                          value={writingText}
                          onChange={(e) => setWritingText(e.target.value)}
                          placeholder="Write your response here..."
                          className="min-h-[200px] resize-y"
                          disabled={isEvaluatingWriting}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {writingText.trim().split(/\s+/).filter(Boolean).length >= 50 ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Minimum met
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              {50 - writingText.trim().split(/\s+/).filter(Boolean).length} more words needed
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={evaluateWriting}
                          disabled={isEvaluatingWriting || writingText.trim().split(/\s+/).filter(Boolean).length < 50}
                          className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                        >
                          {isEvaluatingWriting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              AI Evaluating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Submit for Evaluation
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    /* Writing evaluation feedback */
                    <FadeIn>
                      <div className="space-y-4">
                        {/* Score card */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
                            <div className="text-center">
                              <p className="text-lg font-bold">{writingEvaluation.score}</p>
                              <p className="text-[10px] opacity-80">/100</p>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge className={`text-sm font-bold px-3 py-1 ${CEFR_COLORS[writingEvaluation.cefrLevel]}`}>
                                {writingEvaluation.cefrLevel}
                              </Badge>
                              <span className="text-sm text-muted-foreground">Writing Level</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{writingEvaluation.feedback}</p>
                          </div>
                        </div>

                        {/* Strengths & Improvements */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          {writingEvaluation.strengths.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4" /> Strengths
                              </h4>
                              {writingEvaluation.strengths.map((s, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm bg-emerald-50 rounded-lg p-2.5">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{s}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {writingEvaluation.improvements.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-amber-700 flex items-center gap-1.5">
                                <TrendingUp className="h-4 w-4" /> Areas to Improve
                              </h4>
                              {writingEvaluation.improvements.map((s, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm bg-amber-50 rounded-lg p-2.5">
                                  <TrendingUp className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <span>{s}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={() => setCurrentPhase('speaking')} className="gap-2">
                            Continue to Speaking
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </FadeIn>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {/* ─── SPEAKING PHASE ───────────────────────────────────────────────── */}
          {currentPhase === 'speaking' && (
            <FadeIn>
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 sm:p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                      <Mic className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Speaking Assessment</h2>
                      <p className="text-sm text-white/80">
                        Estimated level: <Badge className="bg-white/20 text-white border-white/30 ml-1">{estimatedLevel}</Badge>
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="pt-6 space-y-5">
                  {/* Speaking prompt */}
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Volume2 className="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-violet-800">Speaking Prompt</p>
                        <p className="text-sm text-violet-700 mt-1">{SPEAKING_PROMPTS[estimatedLevel]}</p>
                      </div>
                    </div>
                  </div>

                  {!speakingEvaluation ? (
                    <>
                      {/* Speech API status */}
                      {!speechSupported && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-amber-800">Speech Recognition Unavailable</p>
                              <p className="text-xs text-amber-700 mt-1">
                                Your browser doesn&apos;t support the Web Speech API. Please use Chrome or Edge, or type your response below.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recording controls */}
                      {speechSupported && !useFallbackInput && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-4">
                            <button
                              onClick={isRecording ? stopRecording : startRecording}
                              className={`
                                flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 shadow-lg
                                ${isRecording
                                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30 animate-pulse'
                                  : 'bg-violet-500 hover:bg-violet-600 shadow-violet-500/30 hover:scale-105'
                                }
                              `}
                            >
                              {isRecording ? (
                                <MicOff className="h-8 w-8 text-white" />
                              ) : (
                                <Mic className="h-8 w-8 text-white" />
                              )}
                            </button>
                          </div>
                          <p className="text-center text-sm text-muted-foreground">
                            {isRecording ? '🔴 Recording... Click to stop' : 'Click the microphone to start recording'}
                          </p>

                          {/* Live transcript */}
                          {speakingTranscript && (
                            <div className="bg-gray-50 border rounded-lg p-4">
                              <p className="text-xs font-medium text-muted-foreground mb-2">Your speech transcript:</p>
                              <p className="text-sm leading-relaxed">{speakingTranscript}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {speakingTranscript.trim().split(/\s+/).filter(Boolean).length} words
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground"
                              onClick={() => setUseFallbackInput(true)}
                            >
                              <PenTool className="h-4 w-4 mr-1" />
                              Type instead
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Fallback text input */}
                      {(useFallbackInput || !speechSupported) && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Type Your Response</label>
                              <span className={`text-xs ${
                                fallbackText.trim().split(/\s+/).filter(Boolean).length >= 20 ? 'text-emerald-600' : 'text-muted-foreground'
                              }`}>
                                {fallbackText.trim().split(/\s+/).filter(Boolean).length} words
                                {fallbackText.trim().split(/\s+/).filter(Boolean).length < 20 && ' (minimum 20)'}
                              </span>
                            </div>
                            <Textarea
                              value={fallbackText}
                              onChange={(e) => setFallbackText(e.target.value)}
                              placeholder="Type what you would say in response to the prompt..."
                              className="min-h-[160px] resize-y"
                              disabled={isEvaluatingSpeaking}
                            />
                          </div>
                          {speechSupported && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground"
                              onClick={() => setUseFallbackInput(false)}
                            >
                              <Mic className="h-4 w-4 mr-1" />
                              Use microphone instead
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Submit button */}
                      <div className="flex items-center justify-between pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPhase('writing')}
                          className="gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          onClick={evaluateSpeaking}
                          disabled={
                            isEvaluatingSpeaking ||
                            ((speakingTranscript || fallbackText).trim().split(/\s+/).filter(Boolean).length < 20)
                          }
                          className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                        >
                          {isEvaluatingSpeaking ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              AI Evaluating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Submit for Evaluation
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    /* Speaking evaluation feedback */
                    <FadeIn>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                            <div className="text-center">
                              <p className="text-lg font-bold">{speakingEvaluation.score}</p>
                              <p className="text-[10px] opacity-80">/100</p>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge className={`text-sm font-bold px-3 py-1 ${CEFR_COLORS[speakingEvaluation.cefrLevel]}`}>
                                {speakingEvaluation.cefrLevel}
                              </Badge>
                              <span className="text-sm text-muted-foreground">Speaking Level</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{speakingEvaluation.feedback}</p>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {speakingEvaluation.strengths.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4" /> Strengths
                              </h4>
                              {speakingEvaluation.strengths.map((s, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm bg-emerald-50 rounded-lg p-2.5">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{s}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {speakingEvaluation.improvements.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-amber-700 flex items-center gap-1.5">
                                <TrendingUp className="h-4 w-4" /> Areas to Improve
                              </h4>
                              {speakingEvaluation.improvements.map((s, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm bg-amber-50 rounded-lg p-2.5">
                                  <TrendingUp className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <span>{s}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <Button
                            onClick={submitAssessment}
                            disabled={isSubmittingAssessment}
                            className="gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
                          >
                            {isSubmittingAssessment ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                View Results
                                <Award className="h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </FadeIn>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {/* ─── RESULTS PHASE ────────────────────────────────────────────────── */}
          {currentPhase === 'results' && submitResult && (
            <FadeIn>
              <div className="space-y-6">
                {/* Hero result card */}
                <Card className="overflow-hidden">
                  <div className={`bg-gradient-to-r ${CEFR_BG_GRADIENT[submitResult.assessment.cefrLevel] || 'from-teal-600 to-teal-700'} p-6 sm:p-8 text-white text-center`}>
                    <div className="flex justify-center mb-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                        <Award className="h-10 w-10" />
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">Assessment Complete!</h2>
                    <p className="text-white/80 text-sm mb-4">Your CEFR English proficiency level</p>
                    <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4">
                      <span className="text-5xl sm:text-6xl font-black">{submitResult.assessment.cefrLevel}</span>
                    </div>
                    <p className="text-white/90 mt-4 max-w-md mx-auto text-sm">
                      {CEFR_DESCRIPTIONS[submitResult.assessment.cefrLevel]}
                    </p>
                  </div>

                  <CardContent className="pt-6">
                    {/* Score overview */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 rounded-xl bg-teal-50">
                        <p className="text-2xl font-bold text-teal-700">{submitResult.results.percentage}%</p>
                        <p className="text-xs text-teal-600">MCQ Score</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-amber-50">
                        <p className="text-2xl font-bold text-amber-700">{writingEvaluation?.score || '—'}</p>
                        <p className="text-xs text-amber-600">Writing</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-violet-50">
                        <p className="text-2xl font-bold text-violet-700">{speakingEvaluation?.score || '—'}</p>
                        <p className="text-xs text-violet-600">Speaking</p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Skill breakdown */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Target className="h-5 w-5 text-teal-600" />
                        Skill Breakdown
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(skillBreakdown).map(([skill, score]) => (
                          <div key={skill} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`flex h-6 w-6 items-center justify-center rounded-md ${SKILL_COLORS[skill] || 'text-gray-600 bg-gray-50'}`}>
                                  {SKILL_ICONS[skill] || <Target className="h-3 w-3" />}
                                </div>
                                <span className="text-sm font-medium capitalize">{skill}</span>
                              </div>
                              <span className={`text-sm font-bold ${
                                score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'
                              }`}>
                                {score}%
                              </span>
                            </div>
                            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                  score >= 80
                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                    : score >= 60
                                      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                      : 'bg-gradient-to-r from-red-400 to-red-500'
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Level badges */}
                    <div className="space-y-3">
                      <h3 className="font-semibold">CEFR Level Reference</h3>
                      <div className="flex flex-wrap gap-2">
                        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                          <Badge
                            key={level}
                            className={`text-sm px-3 py-1 ${
                              level === submitResult.assessment.cefrLevel
                                ? `${CEFR_COLORS[level]} ring-2 ring-offset-2 ring-current scale-110`
                                : `${CEFR_COLORS[level]} opacity-50`
                            } transition-all`}
                          >
                            {level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex-col sm:flex-row gap-3">
                    {submitResult.certificate && (
                      <Link href={`/certificate/${submitResult.certificate.verificationId}`} className="flex-1 w-full sm:w-auto">
                        <Button className="w-full gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-md">
                          <Award className="h-4 w-4" />
                          View Certificate
                        </Button>
                      </Link>
                    )}
                    {submitResult.certificate && (
                      <a
                        href={`/api/certificates/download/${submitResult.certificate.verificationId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 w-full sm:w-auto"
                      >
                        <Button variant="outline" className="w-full gap-2">
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="outline"
                      onClick={retakeTest}
                      className="gap-2 flex-1 w-full sm:w-auto"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Retake Test
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </FadeIn>
          )}

          {/* Loading overlay for submission */}
          {isSubmittingAssessment && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
              <Card className="max-w-sm w-full mx-4">
                <CardContent className="pt-6 text-center space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-teal-600 mx-auto" />
                  <div>
                    <p className="font-semibold">Processing Your Results</p>
                    <p className="text-sm text-muted-foreground mt-1">Calculating your CEFR level and generating certificate...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
