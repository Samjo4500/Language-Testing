'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Target,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';

/* ============================================================
   TYPES
   ============================================================ */
interface SkillScore {
  skill: string;
  score: number;
  cefrLevel: string;
}

interface PriorityLesson {
  title: string;
  skillArea: string;
  relevance: 'critical' | 'recommended' | 'supplementary';
}

interface CourseRecommendation {
  courseSlug: string;
  courseLevel: string;
  courseTitle: string;
  matchPercentage: number;
  priorityLessons: PriorityLesson[];
  reason: string;
}

interface RecommendationData {
  hasAssessment: boolean;
  overallCEFR: string | null;
  overallCEFRNumeric?: number;
  skillScores?: SkillScore[];
  weakAreas: string[];
  strongAreas?: string[];
  recommendation: CourseRecommendation | null;
  alternativeRecommendation?: CourseRecommendation | null;
  assessmentCount?: number;
  latestScore?: number;
  message?: string;
}

/* ============================================================
   CEFR COLORS & HELPERS
   ============================================================ */
const CEFR_COLORS: Record<string, { gradient: string; badge: string; text: string; glow: string }> = {
  A1: {
    gradient: 'from-emerald-400 to-teal-500',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
  },
  A2: {
    gradient: 'from-teal-400 to-cyan-500',
    badge: 'bg-teal-500/15 text-teal-300 border-teal-500/25',
    text: 'text-teal-400',
    glow: 'shadow-teal-500/20',
  },
  B1: {
    gradient: 'from-blue-400 to-indigo-500',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20',
  },
  B2: {
    gradient: 'from-indigo-400 to-violet-500',
    badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
    text: 'text-indigo-400',
    glow: 'shadow-indigo-500/20',
  },
  C1: {
    gradient: 'from-violet-400 to-purple-500',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
    text: 'text-violet-400',
    glow: 'shadow-violet-500/20',
  },
  C2: {
    gradient: 'from-violet-400 to-purple-500',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20',
  },
};

const SKILL_LABELS: Record<string, string> = {
  reading: 'Reading',
  writing: 'Writing',
  listening: 'Listening',
  speaking: 'Speaking',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
};

const RELEVANCE_STYLING: Record<string, { icon: React.ReactNode; badge: string }> = {
  critical: {
    icon: <Zap className="h-3 w-3" />,
    badge: 'bg-red-500/10 text-red-300 border-red-500/20',
  },
  recommended: {
    icon: <TrendingUp className="h-3 w-3" />,
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  supplementary: {
    icon: <BookOpen className="h-3 w-3" />,
    badge: 'bg-white/5 text-white/40 border-white/10',
  },
};

/* ============================================================
   COMPONENT
   ============================================================ */
export function RecommendationBanner() {
  const [data, setData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlternative, setShowAlternative] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/user/recommendations', { credentials: 'same-origin' });
        if (!res.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 animate-pulse">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Course Recommendation</h2>
            <p className="text-xs text-white/40">Analyzing your assessment results...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-violet-400 animate-spin" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-white">Course Recommendation</h2>
        </div>
        <div className="text-center py-6 space-y-2">
          <AlertCircle className="h-8 w-8 text-white/20 mx-auto" />
          <p className="text-sm text-white/40">Unable to load recommendations</p>
        </div>
      </div>
    );
  }

  // No assessment taken yet — show CTA
  if (!data?.hasAssessment) {
    return (
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -ml-8 -mb-8 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Course Recommendation</h2>
              <p className="text-xs text-white/40">Personalized learning path</p>
            </div>
          </div>

          <div className="text-center py-8 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-400">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Discover Your Perfect Course</h3>
            <p className="text-sm text-white/40 max-w-sm mx-auto">
              Take a CEFR assessment to get personalized course recommendations tailored to your English proficiency level.
            </p>
            <Link href="/test">
              <button className="mt-2 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 cursor-pointer">
                <BookOpen className="h-4 w-4" />
                Take Assessment
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Has assessment but no recommendation (shouldn't happen, but handle gracefully)
  if (!data.recommendation) {
    return null;
  }

  const cefrLevel = data.overallCEFR || 'A1';
  const cefrColors = CEFR_COLORS[cefrLevel] || CEFR_COLORS['A1'];
  const activeRecommendation = showAlternative && data.alternativeRecommendation
    ? data.alternativeRecommendation
    : data.recommendation;
  const activeCefrColors = showAlternative && data.alternativeRecommendation
    ? CEFR_COLORS[data.alternativeRecommendation.courseLevel === 'C1-C2' ? 'C1' : data.alternativeRecommendation.courseLevel === 'B1-B2' ? 'B1' : 'A1']
    : cefrColors;

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -ml-8 -mb-8 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Course Recommendation</h2>
              <p className="text-xs text-white/40">Based on your latest assessment</p>
            </div>
          </div>
          {data.assessmentCount && data.assessmentCount > 1 && (
            <span className="text-xs text-white/30">
              {data.assessmentCount} assessment{data.assessmentCount > 1 ? 's' : ''} taken
            </span>
          )}
        </div>

        {/* Main recommendation card */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left: CEFR Badge & Match */}
          <div className="flex flex-row lg:flex-col items-center gap-4 lg:gap-5 shrink-0">
            {/* CEFR Level Badge */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${activeCefrColors.gradient} text-white text-xl font-bold shadow-lg ${activeCefrColors.glow}`}>
                {cefrLevel}
              </div>
              <p className="text-xs text-white/40 mt-1.5">Your Level</p>
            </div>

            {/* Match Percentage */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="text-center">
                  <span className="text-xl font-bold text-violet-400">{activeRecommendation.matchPercentage}%</span>
                </div>
              </div>
              <p className="text-xs text-white/40 mt-1.5">Match</p>
            </div>
          </div>

          {/* Right: Recommendation details */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Course Title & Level */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">
                  {activeRecommendation.courseTitle}
                </h3>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${activeCefrColors.badge}`}>
                  {activeRecommendation.courseLevel}
                </span>
              </div>
              <p className="text-sm text-white/50 mt-1.5 leading-relaxed">
                {activeRecommendation.reason}
              </p>
            </div>

            {/* Weak Areas */}
            {data.weakAreas.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-white/30">Focus areas:</span>
                {data.weakAreas.map(area => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    <TrendingUp className="h-2.5 w-2.5" />
                    {SKILL_LABELS[area] || area}
                  </span>
                ))}
              </div>
            )}

            {/* Priority Lessons */}
            {activeRecommendation.priorityLessons.length > 0 && (
              <div>
                <p className="text-xs text-white/30 mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-violet-400" />
                  Priority Lessons
                </p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                  {activeRecommendation.priorityLessons.map((lesson, index) => {
                    const styling = RELEVANCE_STYLING[lesson.relevance] || RELEVANCE_STYLING.supplementary;
                    return (
                      <Link
                        key={index}
                        href={`/learn/${activeRecommendation.courseSlug}`}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.03] transition-colors group"
                      >
                        <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium border ${styling.badge}`}>
                          {styling.icon}
                        </span>
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors flex-1">
                          {lesson.title}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="flex items-center gap-3 pt-1">
              <Link href={`/learn/${activeRecommendation.courseSlug}`}>
                <button className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 cursor-pointer">
                  <BookOpen className="h-4 w-4" />
                  Start Course
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>

              {/* Alternative recommendation toggle */}
              {data.alternativeRecommendation && (
                <button
                  onClick={() => setShowAlternative(!showAlternative)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                    showAlternative
                      ? 'bg-white/[0.06] text-violet-300 border border-violet-500/20'
                      : 'bg-white/[0.03] text-white/50 hover:text-white/70 border border-white/[0.08] hover:border-white/[0.15]'
                  }`}
                >
                  <Award className="h-3.5 w-3.5" />
                  {showAlternative ? 'Back to Primary' : 'Challenge Yourself'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Skill Scores Mini-Chart */}
        {data.skillScores && data.skillScores.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <p className="text-xs text-white/30 mb-3">Skill Breakdown</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {data.skillScores.map(score => {
                const colors = CEFR_COLORS[score.cefrLevel] || CEFR_COLORS['A1'];
                const isWeak = data.weakAreas.includes(score.skill);
                return (
                  <div
                    key={score.skill}
                    className={`p-2.5 rounded-xl text-center ${
                      isWeak
                        ? 'bg-amber-500/[0.04] border border-amber-500/10'
                        : 'bg-white/[0.02] border border-white/[0.05]'
                    }`}
                  >
                    <p className="text-[10px] text-white/30 mb-1">{SKILL_LABELS[score.skill] || score.skill}</p>
                    <p className={`text-sm font-bold ${colors.text}`}>{score.score}%</p>
                    <p className="text-[10px] text-white/25">{score.cefrLevel}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
