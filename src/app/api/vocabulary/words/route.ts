import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

// ── Types ───────────────────────────────────────────────────────────────────
interface VocabWordRow {
  id: string;
  word: string;
  definition: string;
  example: string;
  pronunciation: string | null;
  level: string;
  category: string;
  gapSentence: string | null;
  partOfSpeech: string | null;
  distractors: string | null;
}

interface WordResponse {
  id: string;
  word: string;
  gapSentence: string;
  definition: string;
  example: string;
  options?: string[];
  correctAnswer: string;
  partOfSpeech: string;
  level: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
type CEFRLevel = (typeof VALID_LEVELS)[number];

const VALID_TYPES = ['fill_gap', 'sentence_builder', 'multiple_choice'] as const;
type ExerciseType = (typeof VALID_TYPES)[number];

const VALID_POOLS = ['all', 'recent', 'weak'] as const;
type Pool = (typeof VALID_POOLS)[number];

/**
 * Generate a gap-fill sentence from an example by replacing the target word with "_____"
 */
function generateGapSentence(word: string, example: string): string {
  // Case-insensitive replacement, preserve original casing of first occurrence
  const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'i');
  return example.replace(regex, '_____');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate distractor options for multiple-choice exercises.
 * Picks 3 random words from the same level (excluding the correct word).
 */
function generateOptions(
  correctWord: string,
  sameLevelWords: string[],
  storedDistractors: string | null
): string[] {
  // If the word already has stored distractors, use them
  if (storedDistractors) {
    try {
      const parsed = JSON.parse(storedDistractors) as string[];
      if (Array.isArray(parsed) && parsed.length >= 3) {
        const options = [correctWord, ...parsed.slice(0, 3)];
        return shuffle(options);
      }
    } catch {
      // Fall through to dynamic generation
    }
  }

  // Dynamically pick distractors from same level
  const candidates = sameLevelWords.filter((w) => w !== correctWord);
  const distractors: string[] = [];

  while (distractors.length < 3 && candidates.length > 0) {
    const idx = Math.floor(Math.random() * candidates.length);
    distractors.push(candidates.splice(idx, 1)[0]);
  }

  // If not enough same-level words, pad with generic distractors
  const genericDistractors = ['option', 'concept', 'method', 'process', 'system', 'approach'];
  while (distractors.length < 3) {
    const d = genericDistractors[Math.floor(Math.random() * genericDistractors.length)];
    if (d !== correctWord && !distractors.includes(d)) {
      distractors.push(d);
    }
  }

  return shuffle([correctWord, ...distractors]);
}

/**
 * Infer part of speech from the word and definition heuristics
 */
function inferPartOfSpeech(word: string, definition: string): string {
  const lower = definition.toLowerCase();

  if (lower.startsWith('to ')) return 'verb';
  if (lower.includes('a feeling') || lower.includes('an emotion')) return 'adjective';
  if (lower.startsWith('a ') || lower.startsWith('an ') || lower.startsWith('the ')) {
    if (lower.includes('of ') || lower.includes('for ')) return 'noun';
    if (lower.includes('who ') || lower.includes('that ')) return 'noun';
    return 'noun';
  }
  if (lower.includes(' -ly') || word.endsWith('ly')) return 'adverb';
  if (word.endsWith('tion') || word.endsWith('sion') || word.endsWith('ment') || word.endsWith('ness')) return 'noun';
  if (word.endsWith('ful') || word.endsWith('less') || word.endsWith('ous') || word.endsWith('ive') || word.endsWith('able') || word.endsWith('ible')) return 'adjective';
  if (word.endsWith('ize') || word.endsWith('ify') || word.endsWith('ate')) return 'verb';

  return 'noun';
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ── Route Handler ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user = getAuthUser(request);

    // ── Validate query params ─────────────────────────────────────────────
    const level = searchParams.get('level')?.toUpperCase() as CEFRLevel;
    if (!level || !VALID_LEVELS.includes(level)) {
      return NextResponse.json(
        { error: `Invalid or missing 'level' parameter. Must be one of: ${VALID_LEVELS.join(', ')}` },
        { status: 400 }
      );
    }

    const count = Math.min(Math.max(parseInt(searchParams.get('count') || '10'), 1), 50);

    const type = searchParams.get('type') as ExerciseType | null;
    if (type && !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid 'type' parameter. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    const pool = (searchParams.get('pool') || 'all') as Pool;
    if (!VALID_POOLS.includes(pool)) {
      return NextResponse.json(
        { error: `Invalid 'pool' parameter. Must be one of: ${VALID_POOLS.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Build where clause ────────────────────────────────────────────────
    const where: Record<string, unknown> = {
      isActive: true,
      level,
    };

    // Type-specific filters
    if (type === 'fill_gap') {
      // Words that have gapSentence OR have example (can generate gap)
      where.OR = [
        { gapSentence: { not: null } },
        { example: { not: '' } },
      ];
    } else if (type === 'sentence_builder') {
      where.example = { not: '' };
    }
    // multiple_choice: no extra filter — all words are eligible

    // ── Fetch word IDs based on pool ──────────────────────────────────────
    let targetWordIds: string[] | null = null; // null means "all words"

    if (user) {
      const userId = user.userId;

      if (pool === 'recent') {
        // Words reviewed in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentProgress = await db.userVocabProgress.findMany({
          where: {
            userId,
            lastReviewed: { gte: sevenDaysAgo },
          },
          select: { wordId: true },
        });
        targetWordIds = recentProgress.map((p) => p.wordId);
      } else if (pool === 'weak') {
        // Words that need review (low mastery or incorrect streak)
        const weakProgress = await db.userVocabProgress.findMany({
          where: {
            userId,
            OR: [
              { status: 'needs_review' },
              { status: 'learning', masteryScore: { lt: 50 } },
              { correctStreak: 0, totalReviews: { gt: 0 } },
            ],
          },
          select: { wordId: true },
        });
        targetWordIds = weakProgress.map((p) => p.wordId);
      }
      // pool === 'all': no filtering needed
    }

    // Apply word ID filter
    if (targetWordIds !== null) {
      if (targetWordIds.length === 0) {
        // No matching words for this pool
        return NextResponse.json({ words: [] });
      }
      where.id = { in: targetWordIds };
    }

    // ── For authenticated users with pool "all", prioritize unseen words ──
    let prioritizedWordIds: string[] | null = null;
    if (user && pool === 'all') {
      const learnedWordIds = await db.userVocabProgress.findMany({
        where: { userId: user.userId },
        select: { wordId: true },
      });
      const learnedIds = new Set(learnedWordIds.map((p) => p.wordId));

      // First try to get unseen words
      const unseenWords = await db.vocabWord.findMany({
        where: { ...where, id: { notIn: [...learnedIds] } },
        select: { id: true },
      });

      if (unseenWords.length >= count) {
        prioritizedWordIds = unseenWords.map((w) => w.id);
      } else {
        // Mix unseen + due for review
        const now = new Date();
        const dueProgress = await db.userVocabProgress.findMany({
          where: {
            userId: user.userId,
            nextReview: { lte: now },
          },
          select: { wordId: true },
        });
        const dueIds = dueProgress.map((p) => p.wordId).filter((id) => learnedIds.has(id));

        prioritizedWordIds = [
          ...unseenWords.map((w) => w.id),
          ...dueIds,
        ];
      }
    }

    // ── Fetch words ───────────────────────────────────────────────────────
    let words: VocabWordRow[];

    if (prioritizedWordIds && prioritizedWordIds.length > 0) {
      // Fetch prioritized words, shuffle, and limit
      const allPrioritized = await db.vocabWord.findMany({
        where: {
          ...where,
          id: { in: prioritizedWordIds },
        },
      });
      words = shuffle(allPrioritized).slice(0, count) as VocabWordRow[];
    } else {
      // Random selection for unauthenticated users
      // SQLite doesn't support RANDOM() in orderBy natively via Prisma,
      // so we fetch all matching and shuffle in JS
      const allWords = await db.vocabWord.findMany({ where });
      words = shuffle(allWords).slice(0, count) as VocabWordRow[];
    }

    if (words.length === 0) {
      return NextResponse.json({ words: [] });
    }

    // ── Get same-level word list for distractor generation ────────────────
    const sameLevelWords = await db.vocabWord.findMany({
      where: { level, isActive: true },
      select: { word: true },
    });
    const sameLevelWordList = sameLevelWords.map((w) => w.word);

    // ── Build response ────────────────────────────────────────────────────
    const responseWords: WordResponse[] = words.map((w) => {
      const gapSentence = w.gapSentence || generateGapSentence(w.word, w.example);
      const partOfSpeech = w.partOfSpeech || inferPartOfSpeech(w.word, w.definition);

      const result: WordResponse = {
        id: w.id,
        word: w.word,
        gapSentence,
        definition: w.definition,
        example: w.example,
        correctAnswer: w.word,
        partOfSpeech,
        level: w.level,
      };

      // Include options for multiple_choice type (or always for flexibility)
      if (type === 'multiple_choice' || !type) {
        result.options = generateOptions(w.word, sameLevelWordList, w.distractors);
      }

      return result;
    });

    return NextResponse.json({ words: responseWords });
  } catch (error) {
    console.error('Vocabulary words GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vocabulary words.' },
      { status: 500 }
    );
  }
}
