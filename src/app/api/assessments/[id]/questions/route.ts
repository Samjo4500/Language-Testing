import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, verifyTokenVersion } from '@/lib/auth-middleware';

/**
 * GET /api/assessments/[id]/questions
 * Fetch questions for an in-progress assessment by looking up the questionSet snapshot.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const versionError = await verifyTokenVersion(authResult);
    if (versionError) return versionError;

    const { id: assessmentId } = await params;

    const assessment = await db.assessment.findFirst({
      where: { id: assessmentId, userId: authResult.userId },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    if (assessment.status !== 'in_progress') {
      return NextResponse.json({ error: 'Assessment is not in progress' }, { status: 400 });
    }

    if (!assessment.questionSet) {
      return NextResponse.json({ error: 'No question set found for this assessment' }, { status: 404 });
    }

    const qs = JSON.parse(assessment.questionSet);

    // Handle both old format (reading: string[]) and new format (reading: {passageId, questionIds}[])
    const readingIds = (qs.reading || []).map((r: any) => typeof r === 'string' ? r : r.passageId);
    const listeningIds = (qs.listening || []).map((l: any) => typeof l === 'string' ? l : l.itemId);

    // Fetch actual question data from DB using the snapshot IDs
    const [grammar, vocabulary, reading, listening, speaking, writing] = await Promise.all([
      // Grammar MCQs
      db.question.findMany({
        where: { id: { in: qs.grammar || [] } },
      }),
      // Vocabulary MCQs
      db.question.findMany({
        where: { id: { in: qs.vocabulary || [] } },
      }),
      // Reading passages with sub-questions
      db.readingPassage.findMany({
        where: { id: { in: readingIds } },
        include: { questions: { orderBy: { sortOrder: 'asc' } } },
      }),
      // Listening items with sub-questions
      db.listeningItem.findMany({
        where: { id: { in: listeningIds } },
        include: { questions: { orderBy: { sortOrder: 'asc' } } },
      }),
      // Speaking prompt
      qs.speaking ? db.speakingPrompt.findUnique({ where: { id: qs.speaking } }) : null,
      // Writing prompt
      qs.writing ? db.writingPrompt.findUnique({ where: { id: qs.writing } }) : null,
    ]);

    // Format for client (strip correctIndex!)
    const questions = {
      grammar: grammar.map(q => ({
        id: q.id, text: q.text, options: JSON.parse(q.options),
        level: q.level, category: q.category, difficultyTier: q.difficultyTier,
      })),
      vocabulary: vocabulary.map(q => ({
        id: q.id, text: q.text, options: JSON.parse(q.options),
        level: q.level, category: q.category, difficultyTier: q.difficultyTier,
      })),
      reading: reading.map(p => ({
        id: p.id, level: p.level, title: p.title, passageText: p.passageText,
        questions: p.questions.map((q: any) => ({
          id: q.id, questionText: q.questionText, options: JSON.parse(q.options), sortOrder: q.sortOrder,
        })),
      })),
      listening: listening.map(i => ({
        id: i.id, level: i.level, scriptText: i.scriptText, audioUrl: i.audioUrl, context: i.context,
        questions: i.questions.map((q: any) => ({
          id: q.id, questionText: q.questionText, options: JSON.parse(q.options), sortOrder: q.sortOrder,
        })),
      })),
      speaking: speaking ? {
        id: speaking.id, level: speaking.level, promptText: speaking.promptText,
        preparationTime: speaking.preparationTime, responseTime: speaking.responseTime,
      } : null,
      writing: writing ? {
        id: writing.id, level: writing.level, promptText: writing.promptText,
        minWords: writing.minWords, maxWords: writing.maxWords,
      } : null,
    };

    return NextResponse.json({ assessment: { id: assessment.id, status: assessment.status, startedAt: assessment.startedAt }, questions });
  } catch (error) {
    console.error('Fetch assessment questions error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
