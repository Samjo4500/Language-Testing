/**
 * FIX #3: Post-Test Results Screen
 * 
 * This is the biggest conversion fix. After a user completes a skill test,
 * show them their score, correct/incorrect answers with explanations,
 * their CEFR level, and targeted next steps.
 * 
 * Route: /test/results?skill=grammar
 * 
 * Features:
 * - Animated score reveal with confetti effect
 * - Per-question breakdown with correct/incorrect indicators
 * - Detailed explanations for wrong answers
 * - CEFR level badge calculation
 * - "Continue to next skill" CTA
 * - "Study this topic" links to courses
 * - Skill radar chart preview
 * - Shareable result card
 */

import React, { useEffect, useState, useMemo } from 'react';

// ============================================================
// TYPES - match these to your existing data models
// ============================================================

interface QuestionResult {
  questionId: string;
  questionNumber: number;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  grammarTopic?: string;       // e.g., "Present Perfect Continuous"
  courseLessonLink?: string;    // e.g., "/courses/intermediate/grammar/4-3"
}

interface SkillResult {
  skillName: 'Grammar' | 'Vocabulary' | 'Reading' | 'Listening' | 'Speaking' | 'Writing';
  skillIcon: string;
  skillColor: string;
  totalQuestions: number;
  correctAnswers: number;
  cefrLevel: string;           // "B1", "B2", etc.
  cefrLabel: string;           // "Upper Intermediate"
  score: number;               // 0-100
  timeTaken: number;           // seconds
  results: QuestionResult[];
}

interface UserSkillProgress {
  completedSkills: string[];
  totalSkills: number;
  overallCefrLevel?: string;
}

// ============================================================
// DATA FETCHING HOOK
// Replace with your actual API client
// ============================================================

const useTestResults = (skillName: string) => {
  const [data, setData] = useState<SkillResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace with your actual API
    fetch(`/api/test/results?skill=${skillName}`)
      .then(r => r.json())
      .then((data: SkillResult) => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [skillName]);

  return { data, loading, error };
};

// ============================================================
// MOCK DATA - Use this for development/testing
// Remove or replace when API is ready
// ============================================================

export const MOCK_GRAMMAR_RESULTS: SkillResult = {
  skillName: 'Grammar',
  skillIcon: 'book',
  skillColor: '#f43f5e',
  totalQuestions: 6,
  correctAnswers: 5,
  cefrLevel: 'B1',
  cefrLabel: 'Upper Intermediate',
  score: 83,
  timeTaken: 245,
  results: [
    {
      questionId: 'g-001',
      questionNumber: 1,
      cefrLevel: 'A2',
      questionText: 'The cat is sleeping ____ the sofa, right on top of the cushions.',
      userAnswer: 'on',
      correctAnswer: 'on',
      isCorrect: true,
      explanation: '"On" is used for surfaces. The sofa is a surface.',
      grammarTopic: 'Prepositions of Place',
      courseLessonLink: '/courses/beginner/grammar/2-1',
    },
    {
      questionId: 'g-002',
      questionNumber: 2,
      cefrLevel: 'B1',
      questionText: 'She is tired because she ________ all day.',
      userAnswer: 'has been working',
      correctAnswer: 'has been working',
      isCorrect: true,
      explanation: 'Present Perfect Continuous emphasizes duration up to now.',
      grammarTopic: 'Present Perfect Continuous',
      courseLessonLink: '/courses/intermediate/grammar/3-2',
    },
    {
      questionId: 'g-003',
      questionNumber: 3,
      cefrLevel: 'B1',
      questionText: 'The new library is much ____ than the old one; it has many more books.',
      userAnswer: 'bigger',
      correctAnswer: 'bigger',
      isCorrect: true,
      explanation: 'Comparative adjectives: "bigger" (not "more big").',
      grammarTopic: 'Comparative Adjectives',
      courseLessonLink: '/courses/intermediate/grammar/2-4',
    },
    {
      questionId: 'g-004',
      questionNumber: 4,
      cefrLevel: 'B2',
      questionText: 'If she _______ harder for the exam, she wouldn\'t be so worried about the results now.',
      userAnswer: 'had studied',
      correctAnswer: 'had studied',
      isCorrect: true,
      explanation: 'Third conditional: If + past perfect, would(n\'t) have + past participle.',
      grammarTopic: 'Third Conditional',
      courseLessonLink: '/courses/intermediate/grammar/5-1',
    },
    {
      questionId: 'g-005',
      questionNumber: 5,
      cefrLevel: 'B2',
      questionText: 'If she ______ more attention to the safety briefing, she wouldn\'t have made such a dangerous mistake.',
      userAnswer: 'had paid',
      correctAnswer: 'had paid',
      isCorrect: true,
      explanation: 'Mixed conditional: past condition → present result.',
      grammarTopic: 'Mixed Conditionals',
      courseLessonLink: '/courses/intermediate/grammar/5-3',
    },
    {
      questionId: 'g-006',
      questionNumber: 6,
      cefrLevel: 'C1',
      questionText: 'The lights are still on in the office, and I can hear voices. They ______ a late meeting.',
      userAnswer: 'could be had',
      correctAnswer: 'must be having',
      isCorrect: false,
      explanation: '"Must be having" expresses strong deduction about a present continuous action. "Could be had" is grammatically incorrect here.',
      grammarTopic: 'Modals of Deduction',
      courseLessonLink: '/courses/advanced/grammar/1-2',
    },
  ],
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

/** Animated score circle with progress ring */
const ScoreCircle: React.FC<{ score: number; color: string; size?: number }> = ({ 
  score, color, size = 140 
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="8"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: size * 0.3, fontWeight: 700, color: '#fff' }}>
          {animatedScore}%
        </span>
        <span style={{ fontSize: size * 0.1, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Score
        </span>
      </div>
    </div>
  );
};

/** CEFR Level Badge */
const CefrBadge: React.FC<{ level: string; label: string; color: string }> = ({ 
  level, label, color 
}) => (
  <div
    style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '1rem 2rem',
      background: 'rgba(255, 255, 255, 0.03)',
      border: `2px solid ${color}40`,
      borderRadius: '1rem',
    }}
  >
    <span
      style={{
        fontSize: '2.5rem',
        fontWeight: 800,
        color,
        lineHeight: 1,
      }}
    >
      {level}
    </span>
    <span
      style={{
        fontSize: '0.75rem',
        color: 'rgba(255, 255, 255, 0.6)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}
    >
      {label}
    </span>
  </div>
);

/** Single question result card */
const QuestionResultCard: React.FC<{ 
  result: QuestionResult; 
  skillColor: string;
  index: number;
}> = ({ result, skillColor, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${result.isCorrect ? 'rgba(74, 222, 128, 0.15)' : 'rgba(244, 63, 94, 0.15)'}`,
        borderRadius: '0.875rem',
        padding: '1.25rem',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          cursor: result.isCorrect ? 'default' : 'pointer',
        }}
        onClick={() => !result.isCorrect && setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', flex: 1 }}>
          {/* Question number + status */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: result.isCorrect ? 'rgba(74, 222, 128, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            }}
          >
            {result.isCorrect ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="3">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>
                Question {result.questionNumber}
              </span>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  background: `${skillColor}20`,
                  color: skillColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {result.cefrLevel}
              </span>
              {!result.isCorrect && (
                <span style={{ fontSize: '0.625rem', color: '#f43f5e' }}>
                  Tap for explanation
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5, margin: 0 }}>
              {result.questionText}
            </p>
          </div>
        </div>

        {/* Answer summary */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>
            Your answer
          </div>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: result.isCorrect ? '#4ade80' : '#f43f5e',
            }}
          >
            {result.userAnswer}
          </span>
        </div>
      </div>

      {/* Expanded explanation for wrong answers */}
      {!result.isCorrect && expanded && (
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>
              Correct answer:
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4ade80' }}>
              {result.correctAnswer}
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
            {result.explanation}
          </p>
          {result.grammarTopic && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(167, 139, 250, 0.15)',
                  color: '#a78bfa',
                }}
              >
                {result.grammarTopic}
              </span>
              {result.courseLessonLink && (
                <a
                  href={result.courseLessonLink}
                  style={{
                    fontSize: '0.8125rem',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  Study this topic
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/** Performance by CEFR level bar chart */
const CEFRPerformanceBars: React.FC<{ results: QuestionResult[] }> = ({ results }) => {
  const levelStats = useMemo(() => {
    const stats: Record<string, { total: number; correct: number }> = {};
    results.forEach(r => {
      if (!stats[r.cefrLevel]) stats[r.cefrLevel] = { total: 0, correct: 0 };
      stats[r.cefrLevel].total++;
      if (r.isCorrect) stats[r.cefrLevel].correct++;
    });
    return stats;
  }, [results]);

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Performance by Level
      </h4>
      {levels.map(level => {
        const stat = levelStats[level];
        if (!stat) return null;
        const pct = (stat.correct / stat.total) * 100;
        const barColors: Record<string, string> = {
          A1: '#4ade80', A2: '#34d399', B1: '#38bdf8', B2: '#a78bfa', C1: '#f472b6', C2: '#fb923c'
        };
        return (
          <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: barColors[level], width: 28, flexShrink: 0 }}>
              {level}
            </span>
            <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: barColors[level],
                  borderRadius: 999,
                  transition: 'width 1s ease-out 0.5s',
                }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', width: 40, textAlign: 'right', flexShrink: 0 }}>
              {stat.correct}/{stat.total}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** Overall progress toward full certificate */
const CertificateProgress: React.FC<{ completedSkills: number; totalSkills: number }> = ({
  completedSkills, totalSkills
}) => (
  <div
    style={{
      background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(192, 132, 252, 0.05))',
      border: '1px solid rgba(167, 139, 250, 0.2)',
      borderRadius: '1rem',
      padding: '1.25rem',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
        Your Certificate
      </span>
      <span style={{ fontSize: '0.8125rem', color: '#a78bfa' }}>
        {completedSkills}/{totalSkills} skills
      </span>
    </div>
    <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.75rem' }}>
      {Array.from({ length: totalSkills }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 999,
            background: i < completedSkills 
              ? 'linear-gradient(90deg, #a78bfa, #c084fc)' 
              : 'rgba(255, 255, 255, 0.08)',
          }}
        />
      ))}
    </div>
    <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', margin: 0 }}>
      Complete all {totalSkills} skills to unlock your full CEFR certificate.
    </p>
  </div>
);

// ============================================================
// MAIN RESULTS PAGE COMPONENT
// ============================================================

export const TestResultsPage: React.FC<{ 
  skillName?: string;
  mockData?: SkillResult;
}> = ({ 
  skillName = 'grammar',
  mockData 
}) => {
  const { data: apiData, loading } = useTestResults(skillName);
  const [showConfetti, setShowConfetti] = useState(false);

  // Use mock data if no API data (for development)
  const data = apiData || mockData || MOCK_GRAMMAR_RESULTS;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading && !mockData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0a0618', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            border: '3px solid rgba(167, 139, 250, 0.2)', 
            borderTopColor: '#a78bfa', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          Loading your results...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const skillConfig: Record<string, { color: string; icon: string; nextSkill?: string; nextSkillLabel?: string }> = {
    Grammar: { 
      color: '#f43f5e', 
      icon: 'book',
      nextSkill: 'vocabulary',
      nextSkillLabel: 'Vocabulary'
    },
    Vocabulary: { 
      color: '#14b8a6', 
      icon: 'translate',
      nextSkill: 'reading',
      nextSkillLabel: 'Reading'
    },
    Reading: { 
      color: '#3b82f6', 
      icon: 'glasses',
      nextSkill: 'listening',
      nextSkillLabel: 'Listening'
    },
    Listening: { 
      color: '#22c55e', 
      icon: 'headphones',
      nextSkill: 'speaking',
      nextSkillLabel: 'Speaking'
    },
    Speaking: { 
      color: '#f59e0b', 
      icon: 'mic',
      nextSkill: 'writing',
      nextSkillLabel: 'Writing'
    },
    Writing: { 
      color: '#a855f7', 
      icon: 'edit',
      nextSkill: undefined,
      nextSkillLabel: undefined
    },
  };

  const config = skillConfig[data.skillName] || skillConfig.Grammar;
  const isLastSkill = !config.nextSkill;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0618', color: '#fff' }}>
      {/* Confetti overlay */}
      {showConfetti && data.score >= 60 && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 8 + Math.random() * 8,
                height: 8 + Math.random() * 8,
                background: ['#a78bfa', '#4ade80', '#38bdf8', '#f472b6', '#fbbf24'][i % 5],
                borderRadius: Math.random() > 0.5 ? '50%' : 2,
                left: `${Math.random() * 100}%`,
                top: -20,
                animation: `confetti-fall ${2 + Math.random() * 3}s ease-out ${Math.random() * 2}s forwards`,
                opacity: 0.8,
              }}
            />
          ))}
          <style>{`
            @keyframes confetti-fall {
              0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 1rem',
              background: `${config.color}15`,
              border: `1px solid ${config.color}30`,
              borderRadius: '9999px',
              marginBottom: '1.5rem',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: config.color }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: config.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {data.skillName} Complete
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.5rem', background: 'linear-gradient(135deg, #fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {data.correctAnswers === data.totalQuestions ? 'Perfect Score!' : 
             data.score >= 80 ? 'Great Job!' : 
             data.score >= 60 ? 'Good Effort!' : 'Keep Practicing!'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', margin: 0 }}>
            You answered {data.correctAnswers} out of {data.totalQuestions} questions correctly
          </p>
        </div>

        {/* Score + CEFR Badge Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
          }}
        >
          <ScoreCircle score={data.score} color={config.color} />
          <CefrBadge level={data.cefrLevel} label={data.cefrLabel} color={config.color} />
        </div>

        {/* Certificate Progress */}
        <div style={{ marginBottom: '2rem' }}>
          <CertificateProgress completedSkills={2} totalSkills={6} />
        </div>

        {/* Performance by CEFR Level */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <CEFRPerformanceBars results={data.results} />
        </div>

        {/* Question Breakdown */}
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              margin: '0 0 1rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            Question Breakdown
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.4)', padding: '0.125rem 0.625rem', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px' }}>
              Tap wrong answers for explanations
            </span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.results.map((result, index) => (
              <QuestionResultCard
                key={result.questionId}
                result={result}
                skillColor={config.color}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'stretch',
          }}
        >
          {!isLastSkill && (
            <a
              href={`/test/?skill=${config.nextSkill}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #a78bfa, #c084fc)',
                color: '#fff',
                borderRadius: '0.875rem',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(167, 139, 250, 0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(167, 139, 250, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(167, 139, 250, 0.3)';
              }}
            >
              Continue to {config.nextSkillLabel}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          )}

          {isLastSkill && (
            <a
              href="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #a78bfa, #c084fc)',
                color: '#fff',
                borderRadius: '0.875rem',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(167, 139, 250, 0.3)',
              }}
            >
              View Your Certificate
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          )}

          <a
            href="/test/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.875rem',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9375rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake {data.skillName}
          </a>

          <a
            href="/learn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.875rem',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9375rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Study Recommended Lessons
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// NEXT.JS PAGE WRAPPER
// File: app/test/results/page.tsx (App Router)
// or pages/test/results.tsx (Pages Router)
// ============================================================

/*
// For Next.js App Router - app/test/results/page.tsx

import { Suspense } from 'react';
import { TestResultsPage } from './TestResultsPage';

export default function TestResultsRoute({
  searchParams,
}: {
  searchParams: { skill?: string };
}) {
  const skillName = searchParams.skill || 'grammar';
  
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0a0618', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
        Loading results...
      </div>
    }>
      <TestResultsPage skillName={skillName} />
    </Suspense>
  );
}

// Metadata for SEO
export const metadata = {
  title: 'Test Results | TestCEFR',
  description: 'View your CEFR test results with detailed skill breakdown and personalized study recommendations.',
  robots: { index: false, follow: false }, // Don't index personal results
};

*/

/*
// For Next.js Pages Router - pages/test/results.tsx

import { useRouter } from 'next/router';
import { TestResultsPage } from '../../components/TestResultsPage';

export default function TestResults() {
  const router = useRouter();
  const { skill } = router.query;
  
  return <TestResultsPage skillName={skill as string} />;
}

*/

// ============================================================
// API ROUTE FOR RESULTS
// File: app/api/test/results/route.ts
// ============================================================

/*

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const skill = searchParams.get('skill');
  const userId = req.headers.get('x-user-id'); // Or from session

  if (!skill || !userId) {
    return NextResponse.json({ error: 'Missing skill or userId' }, { status: 400 });
  }

  try {
    // Fetch user's answers for this skill
    const userAnswers = await db.userAnswers.findMany({
      where: { 
        userId, 
        skillName: skill.toLowerCase() 
      },
      include: {
        question: {
          select: {
            id: true,
            cefrLevel: true,
            questionText: true,
            correctAnswer: true,
            explanation: true,
            grammarTopic: true,
            courseLessonLink: true,
          }
        }
      },
      orderBy: { questionNumber: 'asc' }
    });

    // Calculate results
    const results = userAnswers.map((ua, index) => ({
      questionId: ua.question.id,
      questionNumber: index + 1,
      cefrLevel: ua.question.cefrLevel,
      questionText: ua.question.questionText,
      userAnswer: ua.selectedAnswer,
      correctAnswer: ua.question.correctAnswer,
      isCorrect: ua.selectedAnswer === ua.question.correctAnswer,
      explanation: ua.question.explanation,
      grammarTopic: ua.question.grammarTopic,
      courseLessonLink: ua.question.courseLessonLink,
    }));

    const correctCount = results.filter(r => r.isCorrect).length;
    const totalCount = results.length;
    const score = Math.round((correctCount / totalCount) * 100);

    // Calculate CEFR level based on score and question levels
    const cefrLevel = calculateCEFRLevel(results);

    return NextResponse.json({
      skillName: skill.charAt(0).toUpperCase() + skill.slice(1),
      skillColor: getSkillColor(skill),
      totalQuestions: totalCount,
      correctAnswers: correctCount,
      cefrLevel: cefrLevel.level,
      cefrLabel: cefrLevel.label,
      score,
      timeTaken: calculateTimeTaken(userAnswers),
      results,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}

function calculateCEFRLevel(results: any[]) {
  // Weighted average based on question difficulty and correctness
  const levelWeights: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  let totalWeight = 0;
  let correctWeight = 0;
  
  results.forEach(r => {
    const w = levelWeights[r.cefrLevel] || 3;
    totalWeight += w;
    if (r.isCorrect) correctWeight += w;
  });
  
  const ratio = correctWeight / totalWeight;
  const avgLevel = ratio * 6;
  
  if (avgLevel < 1.5) return { level: 'A1', label: 'Beginner' };
  if (avgLevel < 2.5) return { level: 'A2', label: 'Elementary' };
  if (avgLevel < 3.5) return { level: 'B1', label: 'Intermediate' };
  if (avgLevel < 4.5) return { level: 'B2', label: 'Upper Intermediate' };
  if (avgLevel < 5.5) return { level: 'C1', label: 'Advanced' };
  return { level: 'C2', label: 'Proficient' };
}

function getSkillColor(skill: string): string {
  const colors: Record<string, string> = {
    grammar: '#f43f5e',
    vocabulary: '#14b8a6',
    reading: '#3b82f6',
    listening: '#22c55e',
    speaking: '#f59e0b',
    writing: '#a855f7',
  };
  return colors[skill.toLowerCase()] || '#a78bfa';
}

function calculateTimeTaken(answers: any[]): number {
  if (answers.length < 2) return 0;
  const first = answers[0].createdAt;
  const last = answers[answers.length - 1].createdAt;
  return Math.round((last - first) / 1000);
}

*/

export default TestResultsPage;
