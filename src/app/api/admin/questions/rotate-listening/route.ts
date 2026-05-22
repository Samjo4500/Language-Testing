import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { generateAIJSON } from '@/lib/ai-provider';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * POST /api/admin/questions/rotate-listening
 *
 * Generates fresh listening comprehension scripts for specified CEFR levels
 * and replaces existing ones (marks old ones as inactive).
 *
 * Body: { levels: string[], countPerLevel: number }
 * - levels: CEFR levels to rotate (e.g. ["A2", "B1", "B2", "C1"])
 * - countPerLevel: how many new scripts per level (default: 10, max: 25)
 */
export async function POST(request: NextRequest) {
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const { levels, countPerLevel = 10 } = body as {
      levels: string[];
      countPerLevel?: number;
    };

    const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const validLevels = (levels || []).filter((l: string) => CEFR_LEVELS.includes(l));
    const targetCount = Math.min(Math.max(countPerLevel, 1), 25);

    if (validLevels.length === 0) {
      return NextResponse.json(
        { error: 'At least one valid CEFR level is required (A1-C2).' },
        { status: 400 }
      );
    }

    const results: { level: string; generated: number; deactivated: number; errors: number }[] = [];
    let totalGenerated = 0;
    let totalDeactivated = 0;
    let totalErrors = 0;
    let lastError: string | null = null;

    for (const level of validLevels) {
      let generated = 0;
      let errors = 0;

      // Deactivate existing listening items for this level
      const deactivateResult = await db.listeningItem.updateMany({
        where: { level, isActive: true, organizationId: null },
        data: { isActive: false },
      });
      const deactivated = deactivateResult.count;

      // Generate new listening items in batches of 3
      const batchSize = 3;
      const batches = Math.ceil(targetCount / batchSize);

      for (let batch = 0; batch < batches; batch++) {
        const batchCount = Math.min(batchSize, targetCount - generated);
        try {
          const items = await generateListeningScriptsWithAI(level, batchCount);

          for (const item of items) {
            await db.listeningItem.create({
              data: {
                level,
                scriptText: item.scriptText,
                context: item.context,
                difficultyTier: item.difficultyTier,
                variantGroup: item.variantGroup,
                isActive: true,
                questions: {
                  create: item.questions.map((q: any, idx: number) => ({
                    questionText: q.questionText,
                    options: JSON.stringify(q.options),
                    correctIndex: q.correctIndex,
                    explanation: q.explanation || null,
                    sortOrder: idx,
                  })),
                },
              },
            });
            generated++;
            totalGenerated++;
          }
        } catch (error: any) {
          console.error(`Failed batch for ${level} listening:`, error?.message || error);
          errors++;
          totalErrors++;
          lastError = error?.message || String(error);
          await sleep(2000);
        }

        // Delay between batches to avoid rate limits
        await sleep(2000);
      }

      totalDeactivated += deactivated;
      results.push({ level, generated, deactivated, errors });
    }

    return NextResponse.json({
      success: totalGenerated > 0,
      totalGenerated,
      totalDeactivated,
      totalErrors,
      results,
      lastError: totalErrors > 0 ? lastError : undefined,
    });
  } catch (error) {
    console.error('Rotate listening scripts error:', error);
    return NextResponse.json(
      { error: 'Internal server error during listening script rotation.' },
      { status: 500 }
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  A1: 'Beginner - very basic words, simple sentences, slow clear speech',
  A2: 'Elementary - everyday expressions, simple communication, routine situations',
  B1: 'Intermediate - common topics, routine situations, moderate complexity',
  B2: 'Upper Intermediate - complex texts, abstract topics, natural paced speech',
  C1: 'Advanced - demanding texts, implicit meanings, fast natural speech with idioms',
  C2: 'Proficient - near-native mastery, nuance, subtlety, rapid natural speech',
};

const TOPIC_POOLS: Record<string, string[]> = {
  A1: ['shopping', 'greetings', 'numbers and prices', 'family', 'food and drink', 'daily routine', 'weather'],
  A2: ['travel', 'health', 'work', 'hobbies', 'directions', 'restaurants', 'phone calls', 'appointments', 'housing'],
  B1: ['education', 'technology', 'environment', 'relationships', 'career', 'media', 'culture', 'finance'],
  B2: ['urban planning', 'economics', 'psychology', 'healthcare', 'politics', 'science', 'arts', 'law', 'sustainability'],
  C1: ['philosophy', 'neuroscience', 'cybersecurity', 'quantum computing', 'moral responsibility', 'climate economics', 'surveillance and democracy'],
  C2: ['post-colonial theory', 'existentialism in modern literature', 'computational linguistics', 'bioethics of gene editing', 'geopolitics of rare earth minerals'],
};

async function generateListeningScriptsWithAI(
  level: string,
  count: number
): Promise<any[]> {
  const topics = TOPIC_POOLS[level] || TOPIC_POOLS['B1'];
  const randomTopics = topics.sort(() => Math.random() - 0.5).slice(0, Math.min(5, topics.length));

  const prompt = `You are a professional CEFR English language test content creator. Generate exactly ${count} listening comprehension items for CEFR level ${level} (${LEVEL_DESCRIPTIONS[level]}).

Each item represents an audio recording that a test-taker will listen to, followed by comprehension questions. The scriptText will be read aloud by a text-to-speech system, so it must be written as SPOKEN English (dialogues, monologues, announcements, interviews, lectures, etc.) — NOT as written text.

Topics to choose from: ${randomTopics.join(', ')}. Use a variety of these topics across the items.

IMPORTANT RULES:
1. scriptText must be natural spoken English — include contractions, natural pauses, filler words appropriate to the level
2. For A1-A2: short simple dialogues (2 speakers), 4-6 sentences total
3. For B1-B2: longer dialogues or short monologues, 6-12 sentences, more complex vocabulary
4. For C1-C2: extended monologues, lectures, or debates, 10-20 sentences, sophisticated vocabulary and idioms
5. Each item must have exactly 2 comprehension questions
6. Questions should test understanding of key information, not trivial details
7. All scripts must be COMPLETELY ORIGINAL — never reuse common test content
8. context field should describe the listening scenario (e.g. "You hear two colleagues discussing...", "You hear a radio announcement about...")
9. difficultyTier should range from 1-10 within the level (1=easiest, 10=hardest)
10. variantGroup should be in format "level-topic" (e.g. "b1-technology")

Return ONLY a valid JSON array with this exact format, no other text:
[
  {
    "scriptText": "The full spoken text that will be read aloud by TTS...",
    "context": "You hear a conversation between...",
    "difficultyTier": 5,
    "variantGroup": "b1-technology",
    "questions": [
      {
        "questionText": "What is the main topic of the conversation?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "explanation": "Brief explanation"
      },
      {
        "questionText": "What does the speaker suggest?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 2,
        "explanation": "Brief explanation"
      }
    ]
  }
]`;

  const parsed = await generateAIJSON<any[]>(prompt, { temperature: 0.85, maxTokens: 8000 });

  if (!Array.isArray(parsed)) {
    throw new Error('AI response is not an array');
  }

  // Validate each item
  const validItems = parsed.filter((item: any) => {
    return (
      typeof item.scriptText === 'string' &&
      item.scriptText.length > 20 &&
      typeof item.context === 'string' &&
      item.context.length > 5 &&
      Array.isArray(item.questions) &&
      item.questions.length >= 2 &&
      item.questions.every((q: any) =>
        typeof q.questionText === 'string' &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctIndex === 'number' &&
        q.correctIndex >= 0 &&
        q.correctIndex <= 3
      )
    );
  });

  if (validItems.length === 0) {
    throw new Error('No valid listening items generated from AI response');
  }

  return validItems;
}
