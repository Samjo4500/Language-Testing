import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalAssessments,
      completedAssessments,
      inProgressAssessments,
      thisWeekAssessments,
      completedWithScore,
      cefrDistributionRaw,
      // Skill-level data from AssessmentResponse
      grammarResponses,
      vocabResponses,
      readingResponses,
      listeningResponses,
      speakingResponses,
      writingResponses,
    ] = await Promise.all([
      db.assessment.count(),
      db.assessment.count({ where: { status: 'completed' } }),
      db.assessment.count({ where: { status: 'in_progress' } }),
      db.assessment.count({ where: { createdAt: { gte: weekAgo } } }),
      db.assessment.findMany({
        where: { status: 'completed', score: { not: null } },
        select: { score: true },
      }),
      db.assessment.groupBy({
        by: ['cefrLevel'],
        where: { status: 'completed', cefrLevel: { not: null } },
        _count: { cefrLevel: true },
      }),
      // Skill averages from assessment responses
      db.assessmentResponse.aggregate({
        _avg: { aiScore: true },
        where: { questionType: 'mcq', isCorrect: { not: null } },
      }),
      db.assessmentResponse.aggregate({
        _avg: { aiScore: true },
        where: { questionType: 'mcq', isCorrect: { not: null } },
      }),
      db.assessmentResponse.aggregate({
        _avg: { aiScore: true },
        where: { questionType: 'reading' },
      }),
      db.assessmentResponse.aggregate({
        _avg: { aiScore: true },
        where: { questionType: 'listening' },
      }),
      db.assessmentResponse.aggregate({
        _avg: { aiScore: true },
        where: { questionType: 'speaking' },
      }),
      db.assessmentResponse.aggregate({
        _avg: { aiScore: true },
        where: { questionType: 'writing' },
      }),
    ]);

    // Average score
    const avgScore = completedWithScore.length > 0
      ? Math.round(completedWithScore.reduce((sum, a) => sum + (a.score || 0), 0) / completedWithScore.length)
      : 0;

    // Completion rate
    const completionRate = totalAssessments > 0
      ? Math.round((completedAssessments / totalAssessments) * 100)
      : 0;

    // CEFR distribution
    const cefrDistribution = cefrDistributionRaw
      .filter((item) => item.cefrLevel !== null)
      .map((item) => ({
        level: item.cefrLevel!,
        count: item._count.cefrLevel,
      }));

    // Skill averages - derive from correct rate for mcq and ai score for others
    // For grammar/vocabulary, use correct answer rate as a percentage
    const [grammarCorrect, grammarTotal] = await Promise.all([
      db.assessmentResponse.count({
        where: { questionType: 'mcq', isCorrect: true },
      }),
      db.assessmentResponse.count({
        where: { questionType: 'mcq', isCorrect: { not: null } },
      }),
    ]);

    const grammarAvg = grammarTotal > 0 ? Math.round((grammarCorrect / grammarTotal) * 100) : 0;

    // For vocab, approximate from mcq as well (since there's no separate vocab questionType)
    const vocabAvg = grammarAvg;

    const skillAverages = {
      grammar: grammarAvg,
      vocabulary: vocabAvg,
      reading: readingResponses._avg.aiScore ? Math.round(readingResponses._avg.aiScore) : 0,
      listening: listeningResponses._avg.aiScore ? Math.round(listeningResponses._avg.aiScore) : 0,
      speaking: speakingResponses._avg.aiScore ? Math.round(speakingResponses._avg.aiScore) : 0,
      writing: writingResponses._avg.aiScore ? Math.round(writingResponses._avg.aiScore) : 0,
    };

    return NextResponse.json({
      totalAssessments,
      completedAssessments,
      inProgressAssessments,
      thisWeek: thisWeekAssessments,
      avgScore,
      completionRate,
      cefrDistribution,
      skillAverages,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Assessment Stats API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
