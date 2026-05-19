import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { generateAIJSON } from '@/lib/ai-provider';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SKILLS = ['grammar', 'vocabulary', 'reading', 'listening'];

interface GeneratedQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export async function POST(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const { levels, skills, countPerSlot } = body as {
      levels: string[];
      skills: string[];
      countPerSlot: number;
    };

    if (!levels?.length || !skills?.length || !countPerSlot) {
      return NextResponse.json(
        { error: 'levels, skills, and countPerSlot are required.' },
        { status: 400 }
      );
    }

    const validLevels = levels.filter((l) => CEFR_LEVELS.includes(l));
    const validSkills = skills.filter((s) => SKILLS.includes(s));
    const targetCount = Math.min(Math.max(countPerSlot, 1), 100);

    const results: { level: string; skill: string; generated: number; skipped: number; errors: number }[] = [];
    let totalGenerated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    let lastError: string | null = null;

    for (const level of validLevels) {
      for (const skill of validSkills) {
        const existingCount = await db.question.count({
          where: { level, category: skill },
        });

        const needed = Math.max(0, targetCount - existingCount);
        if (needed === 0) {
          results.push({ level, skill, generated: 0, skipped: existingCount, errors: 0 });
          totalSkipped += existingCount;
          continue;
        }

        let generated = 0;
        let slotErrors = 0;
        const batchSize = 5;
        const batches = Math.ceil(needed / batchSize);

        for (let batch = 0; batch < batches; batch++) {
          const batchCount = Math.min(batchSize, needed - generated);
          try {
            const questions = await generateQuestionsWithAI(level, skill, batchCount);

            for (const q of questions) {
              await db.question.create({
                data: {
                  level,
                  category: skill,
                  text: q.text,
                  options: JSON.stringify(q.options),
                  correctIndex: q.correctIndex,
                  explanation: q.explanation || null,
                },
              });
              generated++;
              totalGenerated++;
            }
          } catch (error: any) {
            console.error(`Failed batch for ${level}/${skill}:`, error?.message || error);
            slotErrors++;
            totalErrors++;
            lastError = error?.message || String(error);
            // Wait and continue
            await sleep(2000);
          }

          // Small delay between batches
          await sleep(1500);
        }

        results.push({ level, skill, generated, skipped: existingCount, errors: slotErrors });
        totalSkipped += existingCount;
      }
    }

    return NextResponse.json({
      success: totalGenerated > 0,
      totalGenerated,
      totalSkipped,
      totalErrors,
      results,
      lastError: totalErrors > 0 ? lastError : undefined,
    });
  } catch (error) {
    console.error('Batch question generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error during batch generation.', details: error instanceof Error ? error.message : undefined },
      { status: 500 }
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateQuestionsWithAI(
  level: string,
  skill: string,
  count: number
): Promise<GeneratedQuestion[]> {
  const skillDescriptions: Record<string, string> = {
    grammar: 'English grammar rules, sentence structure, verb tenses, and correct word usage',
    vocabulary: 'Word meanings, synonyms, antonyms, collocations, and word choice in context',
    reading: 'Reading comprehension based on short passages, understanding main ideas, details, and inferences',
    listening: 'Listening comprehension based on described audio scenarios, understanding spoken English contexts',
  };

  const levelDescriptions: Record<string, string> = {
    A1: 'Beginner - very basic words and simple sentences',
    A2: 'Elementary - everyday expressions and simple communication',
    B1: 'Intermediate - common topics and routine situations',
    B2: 'Upper Intermediate - complex texts and abstract topics',
    C1: 'Advanced - demanding texts and implicit meanings',
    C2: 'Proficient - near-native mastery, nuance, and subtlety',
  };

  const prompt = `You are a CEFR English language test question generator. Generate exactly ${count} multiple-choice questions for CEFR level ${level} (${levelDescriptions[level]}) focusing on ${skill} (${skillDescriptions[skill]}).

Each question must have exactly 4 options and one correct answer. Questions should be appropriate for the specified CEFR level.

${skill === 'reading' ? 'Each question should include a short passage (2-4 sentences) followed by a comprehension question.' : ''}
${skill === 'listening' ? 'Each question should describe a listening scenario (e.g., "You hear: ...") followed by a comprehension question about what was heard.' : ''}

Return ONLY a valid JSON array with this exact format, no other text:
[
  {
    "text": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why the correct answer is right"
  }
]

Important rules:
- correctIndex is 0-based (0=A, 1=B, 2=C, 3=D)
- All 4 options must be plausible
- The correct answer must be clearly correct for the given level
- Questions must be ORIGINAL, not copied from common test prep materials
- Vary question difficulty within the level range
- Ensure diverse question types and topics`;

  const parsed = await generateAIJSON<any[]>(prompt, { temperature: 0.8, maxTokens: 4000 });

  if (!Array.isArray(parsed)) {
    throw new Error('Response is not an array');
  }

  const validQuestions = parsed.filter((q: any) => {
    return (
      typeof q.text === 'string' &&
      q.text.length > 5 &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.options.every((o: any) => typeof o === 'string') &&
      typeof q.correctIndex === 'number' &&
      q.correctIndex >= 0 &&
      q.correctIndex <= 3
    );
  }).map((q: any) => ({
    text: q.text,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation || undefined,
  }));

  if (validQuestions.length === 0) {
    throw new Error('No valid questions generated from AI response');
  }

  return validQuestions;
}
