'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PenLine,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
  Loader2,
  LogIn,
  Type,
  Hash,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  SpellCheck,
  MessageSquare,
  Palette,
  GraduationCap,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

/* ============================================================
   TYPES
   ============================================================ */
interface GrammarError {
  original: string;
  correction: string;
  explanation: string;
  category: 'grammar' | 'spelling' | 'punctuation' | 'style';
  severity: 'high' | 'medium' | 'low';
}

interface StyleSuggestion {
  type: string;
  original: string;
  suggestion: string;
  reason: string;
}

interface GrammarResult {
  originalText: string;
  correctedText: string;
  score: number;
  errors: GrammarError[];
  suggestions: StyleSuggestion[];
  levelAssessment: string;
}

/* ============================================================
   EXAMPLE TEXTS
   ============================================================ */
const EXAMPLE_TEXTS = [
  {
    label: 'Job Application Letter',
    icon: '✉️',
    text: 'Dear Sir, I am writing to apply for the position that was advertised on your website. I has went to university for four years and I am very good at computers. I have alot of experience in this field and I think I would be a great addition to you team. I look forward to hear from you soon.',
  },
  {
    label: 'Everyday Story',
    icon: '📖',
    text: 'Yesterday I go to the store for buying some foods. The whether was very nice so I decided to walking instead of taking bus. I buyed many things including breads, milks and some fruit. When I arrived at home I realized I forgot my keys inside the apartment.',
  },
  {
    label: 'Academic Writing',
    icon: '🎓',
    text: 'The result of the study shows that students which studied with the new method performed more better then those who didnt. The differance was statisticaly significant and suggest that the method should be adopt more widely across educational institutions.',
  },
];

/* ============================================================
   CATEGORY CONFIG
   ============================================================ */
const CATEGORY_CONFIG: Record<string, { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }> = {
  grammar: {
    label: 'Grammar',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/15',
    borderColor: 'border-blue-500/25',
    icon: <SpellCheck className="h-3.5 w-3.5" />,
  },
  spelling: {
    label: 'Spelling',
    color: 'text-red-400',
    bgColor: 'bg-red-500/15',
    borderColor: 'border-red-500/25',
    icon: <Type className="h-3.5 w-3.5" />,
  },
  punctuation: {
    label: 'Punctuation',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/25',
    icon: <MessageSquare className="h-3.5 w-3.5" />,
  },
  style: {
    label: 'Style',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15',
    borderColor: 'border-purple-500/25',
    icon: <Palette className="h-3.5 w-3.5" />,
  },
};

const SEVERITY_CONFIG: Record<string, { color: string; label: string }> = {
  high: { color: 'bg-red-400', label: 'High' },
  medium: { color: 'bg-yellow-400', label: 'Medium' },
  low: { color: 'bg-green-400', label: 'Low' },
};

/* ============================================================
   HELPER: Text Stats
   ============================================================ */
function getTextStats(text: string) {
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
  // Rough reading level estimate (Flesch-Kincaid approximation)
  const syllables = text.toLowerCase().split(/\s+/).reduce((count, word) => {
    const w = word.replace(/[^a-z]/g, '');
    if (w.length <= 3) return count + 1;
    let s = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').match(/[aeiouy]{1,2}/g);
    return count + (s ? s.length : 1);
  }, 0);
  const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
  const avgSyllablesPerWord = words > 0 ? syllables / words : 0;
  const fleschScore = Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord));
  let readingLevel = 'College';
  if (fleschScore >= 90) readingLevel = 'Very Easy';
  else if (fleschScore >= 80) readingLevel = 'Easy';
  else if (fleschScore >= 70) readingLevel = 'Fairly Easy';
  else if (fleschScore >= 60) readingLevel = 'Standard';
  else if (fleschScore >= 50) readingLevel = 'Fairly Difficult';
  else if (fleschScore >= 30) readingLevel = 'Difficult';

  return { chars, words, sentences, readingLevel };
}

/* ============================================================
   SCORE GAUGE COMPONENT
   ============================================================ */
function ScoreGauge({ score }: { score: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const getColor = (s: number) => {
    if (s >= 90) return { stroke: '#3b82f6', glow: 'shadow-blue-500/30', text: 'text-blue-400', label: 'Excellent' };
    if (s >= 70) return { stroke: '#22c55e', glow: 'shadow-green-500/30', text: 'text-green-400', label: 'Good' };
    if (s >= 50) return { stroke: '#eab308', glow: 'shadow-yellow-500/30', text: 'text-yellow-400', label: 'Fair' };
    return { stroke: '#ef4444', glow: 'shadow-red-500/30', text: 'text-red-400', label: 'Needs Work' };
  };

  const config = getColor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="150" height="150" className="-rotate-90">
          {/* Background circle */}
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke={config.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${config.stroke}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${config.text}`}>{score}</span>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">Score</span>
        </div>
      </div>
      <div className="text-center">
        <span className={`text-sm font-semibold ${config.text}`}>{config.label}</span>
      </div>
    </div>
  );
}

/* ============================================================
   CORRECTED TEXT DISPLAY
   ============================================================ */
function CorrectedTextDisplay({ original, corrected, errors }: { original: string; corrected: string; errors: GrammarError[] }) {
  // Build highlighted version by finding error spans in the original text
  const highlightedOriginal = useMemo(() => {
    if (errors.length === 0) return original;

    // Sort errors by position in original text
    const errorPositions = errors
      .map(err => {
        const idx = original.indexOf(err.original);
        return { ...err, start: idx };
      })
      .filter(e => e.start !== -1)
      .sort((a, b) => a.start - b.start);

    if (errorPositions.length === 0) return original;

    const parts: React.ReactNode[] = [];
    let lastEnd = 0;

    errorPositions.forEach((err, i) => {
      if (err.start > lastEnd) {
        parts.push(<span key={`t-${i}`}>{original.slice(lastEnd, err.start)}</span>);
      }
      const catConfig = CATEGORY_CONFIG[err.category] || CATEGORY_CONFIG.grammar;
      parts.push(
        <span key={`e-${i}`} className="relative group">
          <span className={`line-through decoration-red-400/60 decoration-2 ${catConfig.color} bg-white/5 rounded px-0.5`}>
            {err.original}
          </span>
          <span className={`underline decoration-green-400/60 decoration-2 underline-offset-4 font-medium ${catConfig.color}`}>
            {err.correction}
          </span>
          {/* Tooltip */}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-[#1a1030] border border-white/10 text-xs text-white/80 max-w-[260px] w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-xl">
            <span className={`font-medium ${catConfig.color}`}>{err.category}</span>: {err.explanation}
          </span>
        </span>
      );
      lastEnd = err.start + err.original.length;
    });

    if (lastEnd < original.length) {
      parts.push(<span key="end">{original.slice(lastEnd)}</span>);
    }

    return <>{parts}</>;
  }, [original, corrected, errors]);

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-400" />
        Corrected Text
        <span className="text-[10px] text-white/30 ml-1">(hover over changes for details)</span>
      </h3>
      <div className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
        {highlightedOriginal}
      </div>
      {errors.length === 0 && (
        <div className="flex items-center gap-2 mt-2 text-green-400/70 text-sm">
          <CheckCircle2 className="h-4 w-4" />
          No errors found — your text looks great!
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ERROR GROUP COMPONENT
   ============================================================ */
function ErrorGroup({ category, errors }: { category: string; errors: GrammarError[] }) {
  const [expanded, setExpanded] = useState(true);
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.grammar;

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full group cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${config.bgColor} ${config.color} ${config.borderColor}`}>
            {config.icon}
            {config.label}
          </span>
          <span className="text-xs text-white/40">{errors.length} {errors.length === 1 ? 'issue' : 'issues'}</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-white/30 group-hover:text-white/50 transition-colors" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/30 group-hover:text-white/50 transition-colors" />
        )}
      </button>

      {expanded && (
        <div className="space-y-2 ml-1">
          {errors.map((err, i) => {
            const sevConfig = SEVERITY_CONFIG[err.severity] || SEVERITY_CONFIG.medium;
            return (
              <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                <div className="flex items-start gap-2">
                  <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${sevConfig.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm line-through text-red-300/70">{err.original}</span>
                      <ArrowRight className="h-3 w-3 text-white/20 shrink-0" />
                      <span className="text-sm font-medium text-green-300">{err.correction}</span>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">{err.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */
export default function GrammarCheckPage() {
  const { isAuthenticated, isLoading: authIsLoading, user } = useAuthStore();
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCorrected, setCopiedCorrected] = useState(false);

  const textStats = useMemo(() => getTextStats(text), [text]);

  const handleCheckGrammar = useCallback(async () => {
    if (!text.trim() || text.trim().length < 10) return;

    setIsChecking(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/grammar-check/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to check grammar.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsChecking(false);
    }
  }, [text]);

  const handleCopyCorrected = useCallback(async () => {
    if (!result?.correctedText) return;
    try {
      await navigator.clipboard.writeText(result.correctedText);
      setCopiedCorrected(true);
      setTimeout(() => setCopiedCorrected(false), 2000);
    } catch {}
  }, [result?.correctedText]);

  const handleClear = useCallback(() => {
    setText('');
    setResult(null);
    setError(null);
  }, []);

  const handleTryExample = useCallback((exampleText: string) => {
    setText(exampleText);
    setResult(null);
    setError(null);
  }, []);

  // Group errors by category
  const groupedErrors = useMemo(() => {
    if (!result?.errors) return {};
    const groups: Record<string, GrammarError[]> = {};
    for (const err of result.errors) {
      if (!groups[err.category]) groups[err.category] = [];
      groups[err.category].push(err);
    }
    return groups;
  }, [result?.errors]);

  // Auth loading
  if (authIsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64 bg-white/5" />
            <Skeleton className="h-96 w-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="orb orb-blue w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
            <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          </div>
          <div className="w-full max-w-md relative">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white mb-5 shadow-lg shadow-blue-500/25">
                <LogIn className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Sign in to continue</h1>
              <p className="text-sm text-white/50 mb-6">
                Use the AI Grammar Checker to analyze your writing for errors, get corrections, and improve your English skills.
              </p>
              <Link href="/login?redirect=/grammar-check">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  Sign in
                </button>
              </Link>
              <p className="text-xs text-white/30 mt-4">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <div className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
                  <PenLine className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    Grammar Checker
                    <Badge variant="outline" className="bg-purple-500/15 text-purple-300 border-purple-500/25 text-[10px] px-2 py-0">
                      AI-Powered
                    </Badge>
                  </h1>
                  <p className="text-sm text-white/40 mt-0.5">
                    Paste your text for deep grammatical analysis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Input Area */}
            <div className="space-y-4">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2">
                    <Type className="h-4 w-4 text-purple-400" />
                    Your Text
                  </h3>
                  <button
                    onClick={handleClear}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1 cursor-pointer"
                    disabled={!text}
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </button>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your English text here for grammar analysis..."
                  className="w-full min-h-[280px] bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-sm text-white/90 placeholder:text-white/20 resize-y focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/15 transition-all duration-300 custom-scrollbar"
                  disabled={isChecking}
                />

                {/* Text Stats */}
                <div className="flex items-center gap-4 mt-3 text-[11px] text-white/30">
                  <span className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {textStats.chars} chars
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {textStats.words} words
                  </span>
                  <span className="flex items-center gap-1">
                    <PenLine className="h-3 w-3" />
                    {textStats.sentences} sentences
                  </span>
                  {textStats.words > 10 && (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      {textStats.readingLevel}
                    </span>
                  )}
                </div>

                {/* Check Button */}
                <button
                  onClick={handleCheckGrammar}
                  disabled={isChecking || text.trim().length < 10}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-blue-800/50 disabled:to-indigo-800/50 disabled:text-white/30 disabled:cursor-not-allowed text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:hover:translate-y-0 cursor-pointer"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Check Grammar
                    </>
                  )}
                </button>

                {text.trim().length > 0 && text.trim().length < 10 && (
                  <p className="text-xs text-white/30 mt-2 text-center">
                    Enter at least a full sentence to analyze
                  </p>
                )}
              </div>

              {/* Example Texts (show when no result) */}
              {!result && !isChecking && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-400" />
                    Try an Example
                  </h3>
                  <div className="space-y-2">
                    {EXAMPLE_TEXTS.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => handleTryExample(ex.text)}
                        className="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-blue-500/20 transition-all duration-200 group cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{ex.icon}</span>
                          <span className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors">{ex.label}</span>
                          <ArrowRight className="h-3 w-3 text-white/20 ml-auto group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-xs text-white/30 line-clamp-2">{ex.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Results Panel */}
            <div className="space-y-4">
              {/* Loading State */}
              {isChecking && (
                <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="relative mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center animate-pulse-slow">
                      <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
                    </div>
                    <div className="absolute -inset-4 rounded-3xl border border-blue-500/20 animate-ping-slow" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Analyzing your text...</h3>
                  <p className="text-sm text-white/40 text-center max-w-xs">
                    Our AI is checking for grammar, spelling, punctuation, and style issues
                  </p>
                  <div className="flex gap-1 mt-4">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="h-2 w-2 rounded-full bg-purple-400"
                        style={{
                          animation: 'chat-typing-bounce 1.4s infinite ease-in-out both',
                          animationDelay: `${i * 0.16}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isChecking && (
                <div className="glass-card p-6 border-red-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-400 text-sm">Analysis Failed</h3>
                      <p className="text-sm text-white/40 mt-1">{error}</p>
                      <button
                        onClick={handleCheckGrammar}
                        className="mt-3 flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Results */}
              {result && !isChecking && (
                <div className="space-y-4">
                  {/* Score & Stats Row */}
                  <div className="glass-card p-5">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <ScoreGauge score={result.score} />
                      <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                          <div className="text-lg font-bold text-white">{result.errors.length}</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-wider">Errors Found</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                          <div className="text-lg font-bold text-white">{result.suggestions.length}</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-wider">Suggestions</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                          <div className="text-lg font-bold text-white">{getTextStats(text).words}</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-wider">Words</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                          <div className="text-lg font-bold text-white">{getTextStats(text).sentences}</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-wider">Sentences</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Corrected Text */}
                  <CorrectedTextDisplay
                    original={result.originalText}
                    corrected={result.correctedText}
                    errors={result.errors}
                  />

                  {/* Copy Corrected Text Button */}
                  {result.errors.length > 0 && (
                    <button
                      onClick={handleCopyCorrected}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-blue-500/20 transition-all duration-200 cursor-pointer"
                    >
                      {copiedCorrected ? (
                        <>
                          <Check className="h-4 w-4 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy corrected text
                        </>
                      )}
                    </button>
                  )}

                  {/* Errors by Category */}
                  {Object.keys(groupedErrors).length > 0 && (
                    <div className="glass-card p-5">
                      <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        Errors Found
                      </h3>
                      <div className="space-y-4">
                        {['grammar', 'spelling', 'punctuation', 'style'].map(category => {
                          const errs = groupedErrors[category];
                          if (!errs || errs.length === 0) return null;
                          return (
                            <ErrorGroup key={category} category={category} errors={errs} />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Style Suggestions */}
                  {result.suggestions.length > 0 && (
                    <div className="glass-card p-5">
                      <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-400" />
                        Style Suggestions
                      </h3>
                      <div className="space-y-2">
                        {result.suggestions.map((sug, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-sm text-white/50 line-through">{sug.original}</span>
                              <ArrowRight className="h-3 w-3 text-white/20" />
                              <span className="text-sm font-medium text-purple-300">{sug.suggestion}</span>
                            </div>
                            <p className="text-xs text-white/40">{sug.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Level Assessment */}
                  <div className="glass-card p-5 border-purple-500/15">
                    <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-400" />
                      CEFR Level Assessment
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">{result.levelAssessment}</p>
                  </div>

                  {/* Reading Level Estimate */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-cyan-400" />
                      Text Statistics
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Characters', value: getTextStats(text).chars },
                        { label: 'Words', value: getTextStats(text).words },
                        { label: 'Sentences', value: getTextStats(text).sentences },
                        { label: 'Readability', value: getTextStats(text).readingLevel },
                      ].map((stat) => (
                        <div key={stat.label} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-center">
                          <div className="text-sm font-bold text-white">{stat.value}</div>
                          <div className="text-[9px] text-white/30 uppercase tracking-wider">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Check Again */}
                  <button
                    onClick={handleCheckGrammar}
                    disabled={isChecking}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-blue-500/20 transition-all duration-200 cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Re-check text
                  </button>
                </div>
              )}

              {/* Empty State (no result, not checking) */}
              {!result && !isChecking && !error && (
                <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div className="h-16 w-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                    <PenLine className="h-8 w-8 text-white/15" />
                  </div>
                  <h3 className="text-lg font-semibold text-white/40 mb-2">Results will appear here</h3>
                  <p className="text-sm text-white/25 max-w-xs">
                    Enter your text on the left and click &quot;Check Grammar&quot; to get a detailed analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
