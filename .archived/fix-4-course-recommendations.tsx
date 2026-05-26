/**
 * FIX #4: Connect Test Scores to Course Recommendations
 * 
 * After a user completes a test, calculate their CEFR level and
 * recommend the appropriate course with targeted lessons.
 * 
 * Includes:
 * - useSmartRecommendations hook (CEFR → course mapping)
 * - RecommendationBanner component (dashboard banner)
 * - CourseCard with progress integration
 * - API route for saving/retrieving recommendations
 */

import React, { useEffect, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

interface TestScore {
  skillName: string;
  cefrLevel: string;    // "A1", "A2", "B1", "B2", "C1", "C2"
  score: number;        // 0-100
  completedAt: string;
}

interface CourseRecommendation {
  courseId: string;
  courseName: string;
  courseSlug: string;
  level: string;        // "A1-A2", "B1-B2", "C1-C2"
  matchScore: number;   // 0-100 how well this matches user's level
  reason: string;       // Why we're recommending this
  priorityLessons: RecommendedLesson[];  // Specific lessons based on weak areas
  estimatedCompletion: string;  // "3 months at 30 min/day"
}

interface RecommendedLesson {
  lessonId: string;
  title: string;
  slug: string;
  reason: string;       // "You scored 67% on Present Perfect questions"
  skillTags: string[];
}

interface UserCourseProgress {
  courseId: string;
  courseName: string;
  level: string;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
}

// ============================================================
// CEFR LEVEL CALCULATION ENGINE
// ============================================================

const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const CEFR_NUMERIC: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

/**
 * Calculates overall CEFR level from individual skill scores
 */
export function calculateOverallCEFR(scores: TestScore[]): {
  level: string;
  label: string;
  numeric: number;
} {
  if (scores.length === 0) {
    return { level: 'A1', label: 'Beginner', numeric: 1 };
  }

  // Average the numeric CEFR levels
  const avgNumeric = scores.reduce((sum, s) => {
    return sum + (CEFR_NUMERIC[s.cefrLevel] || 3);
  }, 0) / scores.length;

  // Round to nearest CEFR level
  const rounded = Math.round(avgNumeric);
  const level = CEFR_ORDER[Math.min(rounded - 1, 5)];

  const labels: Record<string, string> = {
    A1: 'Beginner',
    A2: 'Elementary',
    B1: 'Intermediate',
    B2: 'Upper Intermediate',
    C1: 'Advanced',
    C2: 'Proficient',
  };

  return { level, label: labels[level] || 'Intermediate', numeric: avgNumeric };
}

/**
 * Maps overall CEFR level to recommended course
 */
export function getCourseRecommendation(
  overallCEFR: number,
  weakAreas: string[],
  existingProgress?: UserCourseProgress[]
): CourseRecommendation {
  // Determine which course bucket
  let courseLevel: string;
  let courseName: string;
  let courseSlug: string;
  let courseId: string;

  if (overallCEFR < 2.5) {
    courseLevel = 'A1-A2';
    courseName = 'Beginner English';
    courseSlug = 'beginner-english';
    courseId = 'course-beginner';
  } else if (overallCEFR < 4.5) {
    courseLevel = 'B1-B2';
    courseName = 'Intermediate English';
    courseSlug = 'intermediate-english';
    courseId = 'course-intermediate';
  } else {
    courseLevel = 'C1-C2';
    courseName = 'Advanced English';
    courseSlug = 'advanced-english';
    courseId = 'course-advanced';
  }

  // Calculate match score (how well the course fits)
  const matchScore = Math.min(100, Math.round(
    100 - Math.abs(overallCEFR - (courseLevel === 'A1-A2' ? 2 : courseLevel === 'B1-B2' ? 4 : 6)) * 20
  ));

  // Map weak areas to specific lessons
  const priorityLessons = mapWeakAreasToLessons(weakAreas, courseLevel);

  // Check if user already started this course
  const existing = existingProgress?.find(p => p.courseId === courseId);
  const completedCount = existing?.completedLessons || 0;

  return {
    courseId,
    courseName,
    courseSlug,
    level: courseLevel,
    matchScore,
    reason: generateReason(overallCEFR, weakAreas, completedCount),
    priorityLessons,
    estimatedCompletion: `${Math.ceil((20 - completedCount) / 5)} weeks at 30 min/day`,
  };
}

/**
 * Maps grammar/weakness areas to specific course lessons
 */
function mapWeakAreasToLessons(weakAreas: string[], courseLevel: string): RecommendedLesson[] {
  const lessonMap: Record<string, RecommendedLesson[]> = {
    'A1-A2': [
      { lessonId: 'l-1-1', title: 'Present Simple', slug: 'present-simple', reason: 'Foundation for all tenses', skillTags: ['grammar'] },
      { lessonId: 'l-1-2', title: 'Articles (a, an, the)', slug: 'articles', reason: 'Common early mistake area', skillTags: ['grammar'] },
      { lessonId: 'l-2-1', title: 'Prepositions of Place', slug: 'prepositions-place', reason: 'Essential for daily conversation', skillTags: ['vocabulary'] },
      { lessonId: 'l-2-3', title: 'Basic Question Formation', slug: 'questions', reason: 'Critical for real-world use', skillTags: ['grammar'] },
      { lessonId: 'l-3-1', title: 'Present Continuous', slug: 'present-continuous', reason: 'Builds on Present Simple', skillTags: ['grammar'] },
    ],
    'B1-B2': [
      { lessonId: 'l-3-2', title: 'Present Perfect Continuous', slug: 'present-perfect-continuous', reason: 'You scored below 80% on duration-focused questions', skillTags: ['grammar'] },
      { lessonId: 'l-2-4', title: 'Comparative & Superlative Adjectives', slug: 'comparatives', reason: 'Gap identified in your assessment', skillTags: ['grammar'] },
      { lessonId: 'l-5-1', title: 'Third Conditional', slug: 'third-conditional', reason: 'Complex grammar for fluency', skillTags: ['grammar'] },
      { lessonId: 'l-5-3', title: 'Mixed Conditionals', slug: 'mixed-conditionals', reason: 'Advanced structure practice needed', skillTags: ['grammar'] },
      { lessonId: 'l-4-2', title: 'Modal Verbs of Deduction', slug: 'modal-deduction', reason: 'must/might/can’t distinction needs work', skillTags: ['grammar'] },
      { lessonId: 'l-4-4', title: 'Passive Voice (All Tenses)', slug: 'passive-voice', reason: 'Common gap at B2 level', skillTags: ['grammar'] },
    ],
    'C1-C2': [
      { lessonId: 'l-1-2', title: 'Inversion & Emphasis', slug: 'inversion', reason: 'Rarely/never/Seldom structures', skillTags: ['grammar'] },
      { lessonId: 'l-2-1', title: 'Subjunctive Mood', slug: 'subjunctive', reason: 'If I were / suggest that he go', skillTags: ['grammar'] },
      { lessonId: 'l-3-3', title: 'Complex Nominalisation', slug: 'nominalisation', reason: 'Academic writing skill', skillTags: ['writing'] },
      { lessonId: 'l-5-2', title: 'Cleft Sentences', slug: 'cleft-sentences', reason: 'What I need is... / It was... who', skillTags: ['grammar'] },
    ],
  };

  // Return lessons for the appropriate level, filtered by weak areas if available
  const lessons = lessonMap[courseLevel] || lessonMap['B1-B2'];
  
  if (weakAreas.length === 0) {
    return lessons.slice(0, 3);
  }

  // Prioritize lessons matching weak areas
  return lessons
    .sort((a, b) => {
      const aMatch = weakAreas.some(w => a.skillTags.includes(w.toLowerCase()) || a.reason.toLowerCase().includes(w.toLowerCase()));
      const bMatch = weakAreas.some(w => b.skillTags.includes(w.toLowerCase()) || b.reason.toLowerCase().includes(w.toLowerCase()));
      return bMatch ? 1 : aMatch ? -1 : 0;
    })
    .slice(0, 4);
}

function generateReason(overallCEFR: number, weakAreas: string[], completedLessons: number): string {
  const levelLabels: Record<string, string> = {
    A1: 'beginner', A2: 'elementary', B1: 'intermediate', 
    B2: 'upper-intermediate', C1: 'advanced', C2: 'proficient'
  };

  const roundedLevel = CEFR_ORDER[Math.min(Math.round(overallCEFR) - 1, 5)];
  const levelLabel = levelLabels[roundedLevel] || 'intermediate';

  if (completedLessons > 0) {
    return `Continue your ${levelLabel} journey — you've completed ${completedLessons} lessons. Focus on your weak areas to reach the next level.`;
  }

  if (weakAreas.length > 0) {
    return `Your assessment shows ${levelLabel} level overall. We've identified gaps in ${weakAreas.join(', ')} — these targeted lessons will help you improve.`;
  }

  return `Based on your assessment, you're at ${levelLabel} level. This course is perfectly matched to help you progress to the next CEFR band.`;
}


// ============================================================
// REACT HOOK: useSmartRecommendations
// ============================================================

export function useSmartRecommendations(userId: string) {
  const [scores, setScores] = React.useState<TestScore[]>([]);
  const [progress, setProgress] = React.useState<UserCourseProgress[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/user/${userId}/test-scores`).then(r => r.json()),
      fetch(`/api/user/${userId}/course-progress`).then(r => r.json()),
    ])
      .then(([scoresData, progressData]) => {
        setScores(scoresData.scores || []);
        setProgress(progressData.courses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const recommendation = useMemo(() => {
    if (scores.length === 0) return null;
    const overall = calculateOverallCEFR(scores);
    
    // Identify weak areas from incorrect answers
    const weakAreas = identifyWeakAreas(scores);
    
    return getCourseRecommendation(overall.numeric, weakAreas, progress);
  }, [scores, progress]);

  const overallCEFR = useMemo(() => {
    if (scores.length === 0) return null;
    return calculateOverallCEFR(scores);
  }, [scores]);

  return { recommendation, overallCEFR, scores, progress, loading };
}

function identifyWeakAreas(scores: TestScore[]): string[] {
  // In production, query the actual incorrect answers
  // For now, return areas where score is below 80
  const areas: string[] = [];
  scores.forEach(s => {
    if (s.score < 70) areas.push(s.skillName.toLowerCase());
  });
  return areas.length > 0 ? areas : ['grammar'];
}


// ============================================================
// UI COMPONENTS
// ============================================================

/** Main recommendation banner - place on dashboard */
export const RecommendationBanner: React.FC<{
  userId: string;
}> = ({ userId }) => {
  const { recommendation, overallCEFR, loading } = useSmartRecommendations(userId);

  if (loading) {
    return (
      <div style={{
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ height: 20, width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 14, width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />
      </div>
    );
  }

  if (!recommendation || !overallCEFR) {
    // Show "Take a test first" CTA
    return (
      <div style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.08), rgba(192, 132, 252, 0.03))',
        borderRadius: '1rem',
        border: '1px solid rgba(167, 139, 250, 0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
              Discover Your Level
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
              Take a quick assessment to get personalized course recommendations.
            </p>
          </div>
          <a
            href="/test"
            style={{
              padding: '0.625rem 1.5rem',
              background: 'linear-gradient(135deg, #a78bfa, #c084fc)',
              color: '#fff',
              borderRadius: '0.625rem',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              flexShrink: 0,
            }}
          >
            Start Assessment
          </a>
        </div>
      </div>
    );
  }

  const { courseName, courseSlug, reason, priorityLessons, matchScore } = recommendation;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.08), rgba(192, 132, 252, 0.03))',
      border: '1px solid rgba(167, 139, 250, 0.15)',
      borderRadius: '1rem',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* CEFR Level Badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.5rem 1rem',
            background: 'rgba(167, 139, 250, 0.15)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(167, 139, 250, 0.3)',
          }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa' }}>{overallCEFR.level}</span>
            <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {overallCEFR.label}
            </span>
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
              Recommended: {courseName}
            </h3>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
              {reason}
            </p>
          </div>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          background: `${matchScore >= 80 ? 'rgba(74, 222, 128, 0.15)' : 'rgba(167, 139, 250, 0.15)'}`,
          color: matchScore >= 80 ? '#4ade80' : '#a78bfa',
          flexShrink: 0,
        }}>
          {matchScore}% Match
        </span>
      </div>

      {/* Priority Lessons */}
      {priorityLessons.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ margin: '0 0 0.625rem 0', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Priority Lessons Based on Your Assessment
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {priorityLessons.map(lesson => (
              <a
                key={lesson.lessonId}
                href={`/courses/${courseSlug}/${lesson.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '0.625rem',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a78bfa20, #c084fc20)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '0.125rem' }}>
                    {lesson.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
                    {lesson.reason}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <a
          href={`/courses/${courseSlug}`}
          style={{
            padding: '0.625rem 1.5rem',
            background: 'linear-gradient(135deg, #a78bfa, #c084fc)',
            color: '#fff',
            borderRadius: '0.625rem',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(167, 139, 250, 0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Start {courseName}
        </a>
        <a
          href="/test"
          style={{
            padding: '0.625rem 1.5rem',
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.625rem',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          Retake Assessment
        </a>
      </div>
    </div>
  );
};


/** Small course progress card for dashboard */
export const CourseProgressCard: React.FC<{
  progress: UserCourseProgress;
}> = ({ progress }) => {
  const pct = Math.round((progress.completedLessons / progress.totalLessons) * 100);
  const colors: Record<string, string> = {
    'A1-A2': '#4ade80',
    'B1-B2': '#a78bfa',
    'C1-C2': '#f472b6',
  };
  const color = colors[progress.level] || '#a78bfa';

  return (
    <div style={{
      padding: '1.25rem',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '0.875rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#fff' }}>{progress.courseName}</h4>
          <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {progress.level}
          </span>
        </div>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden', marginBottom: '0.5rem' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.5s ease' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
          {progress.completedLessons} / {progress.totalLessons} lessons
        </span>
        <a href={`/learn/${progress.courseId}`} style={{ fontSize: '0.75rem', color, textDecoration: 'none', fontWeight: 600 }}>
          Continue →
        </a>
      </div>
    </div>
  );
};


// ============================================================
// API ROUTE: Save test score + get recommendations
// File: app/api/user/[id]/recommendations/route.ts
// ============================================================

/*

import { NextRequest, NextResponse } from 'next/server';
import { calculateOverallCEFR, getCourseRecommendation } from './recommendation-engine';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  // Fetch user's latest test scores
  const scores = await db.testScores.findMany({
    where: { userId },
    orderBy: { completedAt: 'desc' },
    take: 6, // All skills
  });

  if (scores.length === 0) {
    return NextResponse.json({ recommendation: null });
  }

  // Calculate overall CEFR
  const overall = calculateOverallCEFR(scores);

  // Identify weak areas from recent incorrect answers
  const weakAnswers = await db.userAnswers.findMany({
    where: { 
      userId, 
      isCorrect: false 
    },
    include: { question: { select: { skillType: true, grammarTopic: true } } },
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  const weakAreas = [...new Set(
    weakAnswers.map(a => a.question.grammarTopic || a.question.skillType)
  )].slice(0, 3);

  // Get existing course progress
  const progress = await db.courseProgress.findMany({
    where: { userId },
  });

  const recommendation = getCourseRecommendation(
    overall.numeric, 
    weakAreas, 
    progress
  );

  return NextResponse.json({
    overallCEFR: overall,
    recommendation,
    weakAreas,
    scoresCount: scores.length,
  });
}

// POST: Save a new test score (call this after completing any skill)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const body = await req.json();

  const { skillName, cefrLevel, score, answers } = body;

  // Save test score
  await db.testScores.upsert({
    where: {
      userId_skillName: { userId, skillName },
    },
    update: {
      cefrLevel,
      score,
      completedAt: new Date(),
    },
    create: {
      userId,
      skillName,
      cefrLevel,
      score,
      completedAt: new Date(),
    },
  });

  // Save individual answers for analysis
  if (answers?.length > 0) {
    await db.userAnswers.createMany({
      data: answers.map((a: any) => ({
        userId,
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer,
        isCorrect: a.isCorrect,
        skillName,
      })),
      skipDuplicates: true,
    });
  }

  // Invalidate recommendation cache
  // (Implementation depends on your caching strategy)

  return NextResponse.json({ success: true });
}

*/


export { calculateOverallCEFR, getCourseRecommendation };
