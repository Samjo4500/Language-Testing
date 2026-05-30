'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  PenTool, Sparkles, CheckCircle2, BookOpen,
  Brain, Save, Loader2,
  MessageSquare, BarChart3, Type, Target,
  ArrowRight, RotateCcw, Lightbulb
} from 'lucide-react';

/* ─────────────── Types ─────────────── */
export interface Suggestion {
  original: string;
  suggested: string;
  reason: string;
  category: string;
}

export interface AnalysisResult {
  overallScore: number;
  cefrEstimate: string;
  categories: { name: string; score: number; suggestions: Suggestion[] }[];
  highlights: { start: number; end: number; type: string; suggestion: string }[];
}

export interface AIWritingEditorProps {
  initialText?: string;
  onAnalyze: (text: string) => Promise<AnalysisResult>;
  onSave: (text: string) => void;
}

/* ─────────────── Category Colors & Icons ─────────────── */
const CATEGORY_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode; underline: string }> = {
  Grammar: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/25',
    icon: <BookOpen className="h-4 w-4" />,
    underline: 'underline-cyan-400/60',
  },
  Vocabulary: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    icon: <Type className="h-4 w-4" />,
    underline: 'underline-blue-400/60',
  },
  Coherence: {
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/25',
    icon: <MessageSquare className="h-4 w-4" />,
    underline: 'underline-indigo-400/60',
  },
  Style: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/25',
    icon: <PenTool className="h-4 w-4" />,
    underline: 'underline-purple-400/60',
  },
};

/* ─────────────── Score Gauge ─────────────── */
function ScoreGauge({ score, label, size = 100 }: { score: number; label: string; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  const getColor = (s: number) => {
    if (s >= 80) return '#3B82F6';
    if (s >= 60) return '#06B6D4';
    if (s >= 40) return '#8B5CF6';
    return '#6366F1';
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`gauge-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor={getColor(score)} />
          </linearGradient>
        </defs>
        <circle
          cx={center} cy={center} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
        />
        <circle
          cx={center} cy={center} r={radius}
          fill="none" stroke={`url(#gauge-${label})`}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{score}</span>
        <span className="text-[8px] text-white/30 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}

/* ─────────────── CEFR Level Badge ─────────────── */
function CEFREstimateBadge({ level }: { level: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    A1: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    A2: { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30' },
    B1: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    B2: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
    C1: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
    C2: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  };
  const c = colors[level] || colors.B1;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold uppercase tracking-wider ${c.bg} ${c.text} border ${c.border}`}>
      <Target className="h-3.5 w-3.5" />
      CEFR: {level}
    </span>
  );
}

/* ─────────────── Highlighted Text Renderer ─────────────── */
function HighlightedText({
  text,
  highlights,
  onHighlightClick,
}: {
  text: string;
  highlights: AnalysisResult['highlights'];
  onHighlightClick: (highlight: AnalysisResult['highlights'][0]) => void;
}) {
  if (!highlights.length) {
    return <span className="text-white/70 whitespace-pre-wrap">{text}</span>;
  }

  // Sort highlights by start position
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  sorted.forEach((hl, i) => {
    // Text before this highlight
    if (hl.start > lastIndex) {
      parts.push(
        <span key={`text-${i}`} className="text-white/70 whitespace-pre-wrap">
          {text.slice(lastIndex, hl.start)}
        </span>
      );
    }

    const config = CATEGORY_CONFIG[hl.type] || CATEGORY_CONFIG.Grammar;
    const highlightedText = text.slice(hl.start, hl.end);

    parts.push(
      <span
        key={`hl-${i}`}
        className={`underline decoration-2 decoration-wavy ${config.underline} cursor-pointer hover:bg-white/[0.06] transition-colors whitespace-pre-wrap`}
        onClick={() => onHighlightClick(hl)}
        title={hl.suggestion}
      >
        {highlightedText}
      </span>
    );

    lastIndex = hl.end;
  });

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key="text-end" className="text-white/70 whitespace-pre-wrap">
        {text.slice(lastIndex)}
      </span>
    );
  }

  return <>{parts}</>;
}

/* ─────────────── Suggestion Card ─────────────── */
function SuggestionCard({
  suggestion,
  onApply,
  category,
}: {
  suggestion: Suggestion;
  onApply: (suggestion: Suggestion) => void;
  category: string;
}) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Grammar;

  return (
    <div className={`rounded-xl p-3.5 border ${config.border} ${config.bg} hover:border-white/10 transition-all group`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`${config.color}`}>{config.icon}</span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${config.color}`}>{category}</span>
      </div>

      {/* Original → Suggested */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-white/40 line-through decoration-red-400/50">{suggestion.original}</span>
        <ArrowRight className="h-3 w-3 text-white/20 shrink-0" />
        <span className="text-xs text-blue-300 font-medium">{suggestion.suggested}</span>
      </div>

      <p className="text-[11px] text-white/40 leading-relaxed mb-3">{suggestion.reason}</p>

      <button
        onClick={() => onApply(suggestion)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] text-white/60 border border-white/10 hover:bg-blue-500/15 hover:text-blue-300 hover:border-blue-500/25 transition-all cursor-pointer"
      >
        <CheckCircle2 className="h-3 w-3" /> Apply
      </button>
    </div>
  );
}

/* ─────────────── Category Score Bar ─────────────── */
function CategoryScoreBar({ name, score }: { name: string; score: number }) {
  const config = CATEGORY_CONFIG[name] || CATEGORY_CONFIG.Grammar;

  return (
    <div className="flex items-center gap-3">
      <div className={`shrink-0 ${config.color}`}>{config.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/60 font-medium">{name}</span>
          <span className={`text-xs font-bold ${config.color}`}>{score}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              name === 'Grammar' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
              name === 'Vocabulary' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
              name === 'Coherence' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
              'bg-gradient-to-r from-purple-500 to-violet-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ Main Component ═══════════════ */
export default function AIWritingEditor({
  initialText = '',
  onAnalyze,
  onSave,
}: AIWritingEditorProps) {
  const [text, setText] = useState(initialText);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [text]);

  const lineCount = useMemo(() => {
    return text.split('\n').length;
  }, [text]);

  const handleAnalyze = useCallback(async () => {
    if (!text.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const result = await onAnalyze(text);
      setAnalysis(result);
      setActiveCategory(result.categories[0]?.name ?? null);
    } catch {
      // Silently handle analysis errors
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, isAnalyzing, onAnalyze]);

  const handleApplySuggestion = useCallback((suggestion: Suggestion) => {
    setText((prev) => {
      const idx = prev.indexOf(suggestion.original);
      if (idx !== -1) {
        return prev.slice(0, idx) + suggestion.suggested + prev.slice(idx + suggestion.original.length);
      }
      return prev;
    });

    // Update analysis highlights to remove applied ones
    setAnalysis((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        highlights: prev.highlights.filter(
          (hl) => !(hl.suggestion === suggestion.suggested && text.slice(hl.start, hl.end) === suggestion.original)
        ),
        categories: prev.categories.map((cat) => ({
          ...cat,
          suggestions: cat.suggestions.filter((s) => s !== suggestion),
        })),
      };
    });
  }, []);

  const handleHighlightClick = useCallback((highlight: AnalysisResult['highlights'][0]) => {
    setActiveCategory(highlight.type);
  }, []);

  const handleSave = useCallback(() => {
    onSave(text);
  }, [text, onSave]);

  // All suggestions flattened
  const allSuggestions = useMemo(() => {
    if (!analysis) return [];
    return analysis.categories.flatMap((cat) =>
      cat.suggestions.map((s) => ({ ...s, category: cat.name }))
    );
  }, [analysis]);

  // Filter by active category
  const filteredSuggestions = useMemo(() => {
    if (!activeCategory) return allSuggestions;
    return allSuggestions.filter((s) => s.category === activeCategory);
  }, [allSuggestions, activeCategory]);

  // Active highlights for display
  const activeHighlights = useMemo(() => {
    if (!analysis) return [];
    if (!activeCategory) return analysis.highlights;
    return analysis.highlights.filter((hl) => hl.type === activeCategory);
  }, [analysis, activeCategory]);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 shadow-lg shadow-purple-500/20">
            <PenTool className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Writing Editor</h2>
            <p className="text-xs text-white/40">Write, analyze, and improve your English</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {analysis && (
            <CEFREstimateBadge level={analysis.cefrEstimate} />
          )}
        </div>
      </div>

      {/* Split Pane */}
      <div className="grid gap-4 lg:grid-cols-2 min-h-[500px]">
        {/* Left: Editor */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col overflow-hidden">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/30">
                <Type className="h-3 w-3 inline mr-1" />
                {wordCount} words
              </span>
              <span className="text-[10px] text-white/20">|</span>
              <span className="text-[10px] text-white/30">
                {lineCount} lines
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={!text.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] text-white/60 border border-white/10 hover:bg-white/[0.1] hover:text-white/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Save className="h-3 w-3" /> Save
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" /> Analyze
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative">
            {/* Line Numbers + Textarea */}
            <div className="absolute inset-0 flex">
              {/* Line numbers */}
              <div className="shrink-0 w-10 py-3 text-right pr-2 overflow-hidden border-r border-white/5 bg-white/[0.01]">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="text-[10px] text-white/15 leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  // Clear analysis when text changes significantly
                  if (analysis) setAnalysis(null);
                }}
                placeholder="Start writing in English... Paste or type your text here for AI-powered analysis."
                className="flex-1 p-3 bg-transparent text-white/70 text-sm leading-6 resize-none outline-none placeholder:text-white/15 font-mono"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Highlighted preview (shown after analysis) */}
          {analysis && (
            <div className="border-t border-white/5 max-h-48 overflow-y-auto custom-scrollbar p-4 bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                  Preview with Highlights
                </span>
              </div>
              <div className="text-sm leading-6">
                <HighlightedText
                  text={text}
                  highlights={activeHighlights}
                  onHighlightClick={handleHighlightClick}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: AI Feedback Panel */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col overflow-hidden">
          {!analysis && !isAnalyzing && (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-white/15" />
              </div>
              <h3 className="text-sm font-semibold text-white/40 mb-1">No Analysis Yet</h3>
              <p className="text-xs text-white/20 max-w-xs">
                Write some text in the editor and click &quot;Analyze&quot; to get AI-powered feedback on grammar, vocabulary, coherence, and style.
              </p>
            </div>
          )}

          {isAnalyzing && (
            /* Loading State */
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-2xl animate-ping-slow opacity-30 bg-blue-500/20" />
              </div>
              <h3 className="text-sm font-semibold text-white/60 mb-1">Analyzing Your Writing</h3>
              <p className="text-xs text-white/30">Evaluating grammar, vocabulary, coherence, and style...</p>
            </div>
          )}

          {analysis && !isAnalyzing && (
            <div className="flex flex-col h-full">
              {/* Score Overview */}
              <div className="p-4 border-b border-white/5">
                <div className="flex items-start gap-4">
                  <ScoreGauge score={analysis.overallScore} label="Overall" size={90} />
                  <div className="flex-1 space-y-2.5 pt-1">
                    {analysis.categories.map((cat) => (
                      <CategoryScoreBar key={cat.name} name={cat.name} score={cat.score} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 px-4 py-2 border-b border-white/5 overflow-x-auto">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    !activeCategory
                      ? 'bg-blue-500/15 text-blue-300 border border-blue-500/25'
                      : 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]'
                  }`}
                >
                  All ({allSuggestions.length})
                </button>
                {analysis.categories.map((cat) => {
                  const config = CATEGORY_CONFIG[cat.name] || CATEGORY_CONFIG.Grammar;
                  const count = cat.suggestions.length;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        activeCategory === cat.name
                          ? `${config.bg} ${config.color} border ${config.border}`
                          : 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]'
                      }`}
                    >
                      {config.icon}
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Suggestions */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {filteredSuggestions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400/40 mb-2" />
                    <p className="text-xs text-white/30">
                      {activeCategory
                        ? `No ${activeCategory} suggestions found. Great job!`
                        : 'No suggestions found. Your writing looks excellent!'}
                    </p>
                  </div>
                )}
                {filteredSuggestions.map((suggestion, idx) => (
                  <SuggestionCard
                    key={`${suggestion.original}-${suggestion.suggested}-${idx}`}
                    suggestion={suggestion}
                    category={suggestion.category}
                    onApply={handleApplySuggestion}
                  />
                ))}
              </div>

              {/* Summary Footer */}
              <div className="px-4 py-3 border-t border-white/5 bg-white/[0.01]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/20">
                    {allSuggestions.length} suggestion{allSuggestions.length !== 1 ? 's' : ''} found
                  </span>
                  <button
                    onClick={handleAnalyze}
                    className="flex items-center gap-1 text-[10px] text-blue-400/60 hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" /> Re-analyze
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
