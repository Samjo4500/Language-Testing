import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';
import {
  generateRecommendation,
  scoreToCEFR,
  type SkillScore,
  type ExistingProgress,
} from '@/lib/recommendation-engine';

// GET /api/user/recommendations — Get personalized course recommendation based on assessment scores
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to get recommendations.' },
        { status: 401 }
      );
    }

    // Fetch user's completed AND in-progress assessments (most recent first)
    // Including in-progress allows recommendations after completing just 1 skill
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.userId,
        status: { in: ['completed', 'in_progress'] },
      },
      orderBy: [
        { completedAt: 'desc' },
        { startedAt: 'desc' },
      ],
      take: 5,
      include: {
        responses: {
          select: {
            questionType: true,
            isCorrect: true,
            aiScore: true,
          },
        },
      },
    });

    // Fetch existing course enrollments
    const enrollments = await db.courseEnrollment.findMany({
      where: {
        userId: user.userId,
        status: { in: ['active', 'completed'] },
      },
      include: {
        course: {
          select: {
            slug: true,
            level: true,
          },
        },
      },
    });

    // No assessments taken yet
    if (assessments.length === 0) {
      return NextResponse.json({
        hasAssessment: false,
        overallCEFR: null,
        recommendation: null,
        weakAreas: [],
        message: 'Take a CEFR assessment to get personalized course recommendations.',
      });
    }

    // Calculate skill scores from the most recent assessment
    const latestAssessment = assessments[0];

    // Also check for certificates with skillBreakdown
    const latestCertificate = await db.certificate.findFirst({
      where: {
        userId: user.userId,
        type: 'assessment',
        assessmentId: latestAssessment.id,
      },
      select: {
        skillBreakdown: true,
        cefrLevel: true,
        score: true,
      },
    });

    let skillScores: SkillScore[] = [];

    if (latestCertificate?.skillBreakdown) {
      // Use the certificate's skillBreakdown if available (most accurate)
      try {
        const breakdown = JSON.parse(latestCertificate.skillBreakdown);
        const skills: Array<{ skill: SkillScore['skill']; key: string }> = [
          { skill: 'reading', key: 'reading' },
          { skill: 'writing', key: 'writing' },
          { skill: 'listening', key: 'listening' },
          { skill: 'speaking', key: 'speaking' },
          { skill: 'grammar', key: 'grammar' },
          { skill: 'vocabulary', key: 'vocabulary' },
        ];

        skillScores = skills
          .filter(s => breakdown[s.key] !== undefined)
          .map(s => ({
            skill: s.skill,
            score: typeof breakdown[s.key] === 'number' ? breakdown[s.key] : 0,
            cefrLevel: scoreToCEFR(typeof breakdown[s.key] === 'number' ? breakdown[s.key] : 0),
          }));
      } catch {
        // Fall through to response-based calculation
      }
    }

    // Fallback: calculate skill scores from assessment responses
    if (skillScores.length === 0 && latestAssessment.responses.length > 0) {
      const skillCategories = ['reading', 'writing', 'listening', 'speaking', 'grammar', 'vocabulary'] as const;
      const typeToCategory: Record<string, string> = {
        reading: 'reading',
        writing: 'writing',
        listening: 'listening',
        speaking: 'speaking',
        mcq: 'grammar', // MCQ questions are grammar/vocabulary
      };

      // Group responses by category
      const byCategory: Record<string, { correct: number; total: number }> = {};

      for (const response of latestAssessment.responses) {
        const category = typeToCategory[response.questionType] || 'grammar';
        if (!byCategory[category]) {
          byCategory[category] = { correct: 0, total: 0 };
        }
        byCategory[category].total++;

        if (response.questionType === 'speaking' || response.questionType === 'writing') {
          // For AI-scored responses, use aiScore threshold
          if ((response.aiScore || 0) >= 50) {
            byCategory[category].correct++;
          }
        } else {
          if (response.isCorrect) {
            byCategory[category].correct++;
          }
        }
      }

      // Distribute grammar MCQs between grammar and vocabulary (rough split)
      if (byCategory['grammar'] && byCategory['grammar'].total > 2) {
        const half = Math.ceil(byCategory['grammar'].total / 2);
        const correctHalf = Math.ceil(byCategory['grammar'].correct / 2);
        byCategory['vocabulary'] = {
          total: byCategory['grammar'].total - half,
          correct: byCategory['grammar'].correct - correctHalf,
        };
        byCategory['grammar'] = { total: half, correct: correctHalf };
      }

      skillScores = skillCategories
        .filter(cat => byCategory[cat] && byCategory[cat].total > 0)
        .map(cat => {
          const score = byCategory[cat].total > 0
            ? Math.round((byCategory[cat].correct / byCategory[cat].total) * 100)
            : 0;
          return {
            skill: cat,
            score,
            cefrLevel: scoreToCEFR(score),
          };
        });
    }

    // If we still don't have skill scores, derive from overall assessment score
    if (skillScores.length === 0) {
      const overallScore = latestAssessment.score || 0;
      const overallCEFR = latestAssessment.cefrLevel || scoreToCEFR(overallScore);

      // Generate approximate skill scores based on overall score
      skillScores = [
        { skill: 'reading', score: Math.min(100, overallScore + 5), cefrLevel: scoreToCEFR(Math.min(100, overallScore + 5)) },
        { skill: 'writing', score: Math.max(0, overallScore - 5), cefrLevel: scoreToCEFR(Math.max(0, overallScore - 5)) },
        { skill: 'listening', score: overallScore, cefrLevel: scoreToCEFR(overallScore) },
        { skill: 'speaking', score: Math.max(0, overallScore - 10), cefrLevel: scoreToCEFR(Math.max(0, overallScore - 10)) },
        { skill: 'grammar', score: Math.min(100, overallScore + 3), cefrLevel: scoreToCEFR(Math.min(100, overallScore + 3)) },
        { skill: 'vocabulary', score: overallScore, cefrLevel: scoreToCEFR(overallScore) },
      ];
    }

    // Build existing progress
    const existingProgress: ExistingProgress[] = enrollments.map(e => ({
      courseSlug: e.course?.slug || '',
      progress: e.progress || 0,
      status: e.status,
    }));

    // Generate recommendation
    const result = generateRecommendation(skillScores, existingProgress);

    return NextResponse.json({
      hasAssessment: true,
      overallCEFR: result.overallCEFR,
      overallCEFRNumeric: result.overallCEFRNumeric,
      skillScores: result.skillScores,
      weakAreas: result.weakAreas,
      strongAreas: result.strongAreas,
      recommendation: result.recommendation,
      alternativeRecommendation: result.alternativeRecommendation || null,
      assessmentCount: assessments.length,
      latestScore: latestAssessment.score,
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to generate recommendations.' },
      { status: 500 }
    );
  }
}
