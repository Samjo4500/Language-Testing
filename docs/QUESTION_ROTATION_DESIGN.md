# Question Rotation System — Design Document

**Platform:** CEFR English Test (Next.js / Prisma / Neon PostgreSQL / Vercel)
**Date:** 2026-03-04
**Status:** Draft Blueprint

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Analysis](#2-current-state-analysis)
3. [Database Schema Changes](#3-database-schema-changes)
4. [Question Selection Algorithm](#4-question-selection-algorithm)
5. [API Design](#5-api-design)
6. [Migration Strategy](#6-migration-strategy)
7. [B2B / Institution Features](#7-b2b--institution-features)
8. [Implementation Checklist](#8-implementation-checklist)

---

## 1. Executive Summary

### Problems Solved

| # | Problem | Root Cause | Solution |
|---|---------|-----------|----------|
| 1 | Same questions every attempt | `orderBy: createdAt desc, take: N` is deterministic | Random selection via `TABLESAMPLE` / application-level shuffle |
| 2 | No anti-repeat on retakes | No tracking of seen questions | `SeenQuestion` join table + exclusion filter |
| 3 | Reading/listening/speaking/writing hardcoded in React | Only `Question` model exists in DB | New polymorphic question models for all 4 skills |
| 4 | No B2B/institution pools | No org-scoping on questions | `organizationId` FK on all question models |
| 5 | Rigid 2-per-level structure | Fixed `QUESTIONS_PER_LEVEL = 2` loop | Blended A2–C1 selection algorithm |
| 6 | No question variants | Single pool, no difficulty stratification | `difficultyTier` + `variantGroup` for parallel forms |

### Key Design Decisions

- **Blended A2–C1 approach** — the test no longer tests "each level separately." Instead it draws from a weighted mix, heavy in B1/B2, with A2 and C1 as anchors.
- **Adaptive spiral** — the first few questions target B1/B2 (the middle). Based on early performance, later questions shift up or down.
- **All question types in the database** — reading passages, listening items, speaking prompts, writing prompts all become first-class DB models.
- **Organization-scoped pools** — every question model gets an optional `organizationId`. Null = global pool. Non-null = org-exclusive.
- **Random via `TABLESAMPLE BERNOULLI`** — Prisma doesn't support `ORDER BY RANDOM()`, so we use raw SQL with `TABLESAMPLE` for efficient random sampling on large tables, with application-level Fisher-Yates shuffle for small result sets.

---

## 2. Current State Analysis

### Current Schema

```
Question: { id, level, category, text, options (JSON), correctIndex, explanation }
Assessment: { id, userId, status, cefrLevel, score, startedAt, completedAt }
AssessmentResponse: { id, assessmentId, questionId, answer, isCorrect }
```

### Current Question Selection (broken)

```typescript
// start/route.ts — always returns same questions
const dbQuestions = await db.question.findMany({
  where: { level, category: skill },
  take: QUESTIONS_PER_LEVEL - levelQuestions.length,
  orderBy: { createdAt: 'desc' },  // ← DETERMINISTIC
});
```

### Current Hardcoded Content (in React)

| Type | Count | Location |
|------|-------|----------|
| Reading passages | 6 (one per level, 2 questions each) | `READING_PASSAGES` constant in `test/page.tsx` |
| Listening items | 6 (one per level, 1 question each) | `LISTENING_ITEMS` constant in `test/page.tsx` |
| Speaking prompts | 6 (one per level) | `SPEAKING_PROMPTS` constant in `test/page.tsx` |
| Writing prompts | 6 (one per level) | `WRITING_PROMPTS` constant in `test/page.tsx` |

### Current Submit Flow (broken)

The submit route has **hardcoded answer keys** for reading/listening:

```typescript
const READING_ANSWERS: Record<string, number> = {
  'r-a1-0': 1, 'r-a1-1': 2, ...
};
const LISTENING_ANSWERS: Record<string, number> = {
  'l-a1': 1, 'l-a2': 1, ...
};
```

This means any new reading/listening questions added to the DB cannot be server-verified. This must be fixed.

---

## 3. Database Schema Changes

### 3.1 Complete New Schema

```prisma
// ═══════════════════════════════════════════════════════════
//  ORGANIZATION (for B2B/institution pools)
// ═══════════════════════════════════════════════════════════

model Organization {
  id              String   @id @default(cuid())
  name            String   @unique
  slug            String   @unique   // URL-safe identifier for subdomain/path
  plan            String   @default("team")  // "team" | "business" | "enterprise"
  maxMembers      Int      @default(50)
  questionPoolAccess Boolean @default(true)  // Can use shared global pool?
  customBranding  Boolean  @default(false)
  primaryColor    String?
  logoUrl         String?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  members         OrganizationMember[]
  questions       Question[]
  readingPassages ReadingPassage[]
  listeningItems  ListeningItem[]
  speakingPrompts SpeakingPrompt[]
  writingPrompts  WritingPrompt[]
}

model OrganizationMember {
  id             String   @id @default(cuid())
  organizationId String
  userId         String
  role           String   @default("member")  // "admin" | "member" | "viewer"
  joinedAt       DateTime @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([organizationId, userId])
  @@index([organizationId])
  @@index([userId])
}

// ═══════════════════════════════════════════════════════════
//  USER — updated with organization relation
// ═══════════════════════════════════════════════════════════

model User {
  id            String     @id @default(cuid())
  email         String     @unique
  name          String?
  passwordHash  String
  plan          String     @default("free")
  role          String     @default("user")
  accountType   String     @default("individual")
  organizationId String?   // FK to Organization (for B2B users)
  isDemo        Boolean    @default(false)
  emailVerified Boolean    @default(false)
  testCredits   Int        @default(0)
  country       String?
  tokenVersion  Int        @default(0)
  planExpiresAt DateTime?
  passwordResetAt DateTime?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  payments       Payment[]
  assessments    Assessment[]
  certificates   Certificate[]
  apiKeys        ApiKey[]
  emailLogs      EmailLog[]
  seenQuestions  SeenQuestion[]
  orgMembership  OrganizationMember?

  @@index([organizationId])
}

// ═══════════════════════════════════════════════════════════
//  QUESTION — enhanced MCQ model (grammar, vocabulary,
//  and short reading/listening MCQs)
// ═══════════════════════════════════════════════════════════

model Question {
  id             String        @id @default(cuid())
  level          String        // "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  category       String        // "grammar" | "vocabulary" | "reading" | "listening"
  difficultyTier Int           @default(5)  // 1-10 within the level (for adaptive selection)
  variantGroup   String?       // Questions that test the same concept (variants for anti-cheat)
  text           String
  options        String        // JSON array of 4 options
  correctIndex   Int           // 0-3
  explanation    String?
  organizationId String?       // null = global pool; non-null = org-exclusive
  isActive       Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  organization   Organization? @relation(fields: [organizationId], references: [id])
  seenBy         SeenQuestion[]

  @@index([level, category, isActive, organizationId])
  @@index([variantGroup])
  @@index([difficultyTier])
  @@index([organizationId])
  @@index([isActive])
}

// ═══════════════════════════════════════════════════════════
//  READING PASSAGE — parent entity with sub-questions
// ═══════════════════════════════════════════════════════════

model ReadingPassage {
  id             String   @id @default(cuid())
  level          String   // "A2" | "B1" | "B2" | "C1"
  title          String?
  passageText    String   // The full passage text
  difficultyTier Int      @default(5)
  variantGroup   String?  // Passages about similar topics (variants)
  organizationId String?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization   Organization? @relation(fields: [organizationId], references: [id])
  questions      ReadingQuestion[]
  seenBy         SeenQuestion[]

  @@index([level, isActive, organizationId])
  @@index([variantGroup])
  @@index([organizationId])
}

model ReadingQuestion {
  id             String   @id @default(cuid())
  passageId      String
  questionText   String
  options        String   // JSON array of 4 options
  correctIndex   Int      // 0-3
  explanation    String?
  sortOrder      Int      @default(0)  // Display order within passage
  createdAt      DateTime @default(now())

  passage        ReadingPassage @relation(fields: [passageId], references: [id], onDelete: Cascade)

  @@index([passageId])
}

// ═══════════════════════════════════════════════════════════
//  LISTENING ITEM — audio script with question(s)
// ═══════════════════════════════════════════════════════════

model ListeningItem {
  id             String   @id @default(cuid())
  level          String   // "A2" | "B1" | "B2" | "C1"
  scriptText     String   // TTS script (read aloud by browser speech synthesis)
  audioUrl       String?  // Optional: pre-recorded audio URL
  context        String?  // "You hear:" or "Listen to a conversation about..."
  difficultyTier Int      @default(5)
  variantGroup   String?
  organizationId String?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization   Organization? @relation(fields: [organizationId], references: [id])
  questions      ListeningQuestion[]
  seenBy         SeenQuestion[]

  @@index([level, isActive, organizationId])
  @@index([variantGroup])
  @@index([organizationId])
}

model ListeningQuestion {
  id             String   @id @default(cuid())
  itemId         String
  questionText   String
  options        String   // JSON array of 4 options
  correctIndex   Int      // 0-3
  explanation    String?
  sortOrder      Int      @default(0)
  createdAt      DateTime @default(now())

  item           ListeningItem @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@index([itemId])
}

// ═══════════════════════════════════════════════════════════
//  SPEAKING PROMPT
// ═══════════════════════════════════════════════════════════

model SpeakingPrompt {
  id               String   @id @default(cuid())
  level            String   // "A2" | "B1" | "B2" | "C1"
  promptText       String
  preparationTime  Int      @default(30)  // seconds
  responseTime     Int      @default(120) // seconds
  difficultyTier   Int      @default(5)
  variantGroup     String?
  organizationId   String?
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  organization     Organization? @relation(fields: [organizationId], references: [id])
  seenBy           SeenQuestion[]

  @@index([level, isActive, organizationId])
  @@index([variantGroup])
  @@index([organizationId])
}

// ═══════════════════════════════════════════════════════════
//  WRITING PROMPT
// ═══════════════════════════════════════════════════════════

model WritingPrompt {
  id             String   @id @default(cuid())
  level          String   // "A2" | "B1" | "B2" | "C1"
  promptText     String
  minWords       Int      @default(50)
  maxWords       Int      @default(250)
  difficultyTier Int      @default(5)
  variantGroup   String?
  organizationId String?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization   Organization? @relation(fields: [organizationId], references: [id])
  seenBy         SeenQuestion[]

  @@index([level, isActive, organizationId])
  @@index([variantGroup])
  @@index([organizationId])
}

// ═══════════════════════════════════════════════════════════
//  SEEN QUESTION — anti-repeat tracking
// ═══════════════════════════════════════════════════════════

model SeenQuestion {
  id              String   @id @default(cuid())
  userId          String
  questionType    String   // "mcq" | "reading" | "listening" | "speaking" | "writing"
  questionId      String   // Polymorphic: points to Question/ReadingPassage/ListeningItem/SpeakingPrompt/WritingPrompt.id
  assessmentId    String?  // Which assessment showed this question
  seenAt          DateTime @default(now())

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, questionType, questionId])  // A user can only "see" a question once
  @@index([userId, questionType])
  @@index([userId, questionType, seenAt])
  @@index([assessmentId])
}

// ═══════════════════════════════════════════════════════════
//  ASSESSMENT — updated with questionSet snapshot
// ═══════════════════════════════════════════════════════════

model Assessment {
  id             String   @id @default(cuid())
  userId         String
  status         String   @default("not_started")
  cefrLevel      String?
  score          Int?
  questionSet    String?  // JSON snapshot of the question IDs selected for this assessment
  startedAt      DateTime?
  completedAt    DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user           User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  responses      AssessmentResponse[]
  certificate    Certificate?

  @@index([userId])
  @@index([status])
  @@index([userId, status])
}

// ═══════════════════════════════════════════════════════════
//  ASSESSMENT RESPONSE — updated with questionType
// ═══════════════════════════════════════════════════════════

model AssessmentResponse {
  id            String   @id @default(cuid())
  assessmentId  String
  questionId    String   // The specific question ID
  questionType  String   // "mcq" | "reading" | "listening" | "speaking" | "writing"
  parentItemId  String?  // For reading/listening: the passageId or itemId
  answer        String?
  isCorrect     Boolean?
  aiScore       Int?     // For speaking/writing: the AI-evaluated score (0-100)
  aiFeedback    String?  // JSON: AI evaluation details
  createdAt     DateTime @default(now())

  assessment    Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)

  @@index([assessmentId])
  @@index([questionType, questionId])
}

// Remaining models (Payment, Certificate, PageView, ApiKey, WhiteLabelSetting, EmailLog)
// unchanged from current schema.
```

### 3.2 Schema Design Rationale

#### Why separate models instead of single polymorphic Question?

| Approach | Pros | Cons |
|----------|------|------|
| **Single `Question` with `type` field** | Fewer models, simpler queries | Reading has passage + sub-questions (nested). Listening has script + questions. Speaking/Writing have no `correctIndex`. The schema would need many nullable columns. |
| **Separate models per type** (CHOSEN) | Clean schemas, type safety, proper relationships, no nullable noise | More models, slightly more complex selection logic |

**Decision:** Separate models. The structures are fundamentally different:
- Reading: 1 passage → N questions (parent-child)
- Listening: 1 audio item → N questions (parent-child)
- Speaking: 1 prompt, no correct answer (AI-evaluated)
- Writing: 1 prompt, no correct answer (AI-evaluated)
- MCQ: 1 question with 4 options and a correct answer

#### Why `SeenQuestion` instead of checking `AssessmentResponse`?

Checking `AssessmentResponse` seems simpler but has problems:
1. Responses are per-assessment, requiring a JOIN every time
2. Failed/incomplete assessments still create responses — do those count as "seen"?
3. B2B users may have questions that should be seen-tracked across organizations
4. `SeenQuestion` with a unique constraint gives us a clean, queryable anti-repeat mechanism

#### Why `difficultyTier` (1-10) in addition to `level`?

Two questions both labeled "B1" can vary in actual difficulty. `difficultyTier` enables:
- **Adaptive selection**: Start with tier 5 (mid-B1), go to tier 7 if correct, tier 3 if wrong
- **Within-level variety**: Avoid always picking the hardest/easiest B1 questions
- **Future ML scoring**: Train a difficulty predictor and update tiers automatically

#### Why `variantGroup`?

Questions in the same `variantGroup` test the same concept (e.g., "second conditional" grammar). On retakes, if a user has seen variant A, we pick variant B from the same group. This prevents:
- Users memorizing specific answers
- Test content becoming stale

### 3.3 New Indexes Summary

| Model | Index | Purpose |
|-------|-------|---------|
| Question | `[level, category, isActive, organizationId]` | Primary selection query |
| Question | `[variantGroup]` | Anti-cheat variant lookup |
| Question | `[difficultyTier]` | Adaptive selection |
| ReadingPassage | `[level, isActive, organizationId]` | Level-blended selection |
| ListeningItem | `[level, isActive, organizationId]` | Level-blended selection |
| SpeakingPrompt | `[level, isActive, organizationId]` | Level-blended selection |
| WritingPrompt | `[level, isActive, organizationId]` | Level-blended selection |
| SeenQuestion | `UNIQUE [userId, questionType, questionId]` | Anti-repeat enforcement |
| SeenQuestion | `[userId, questionType]` | Fast seen-question lookups |
| AssessmentResponse | `[questionType, questionId]` | Cross-type question lookups |

---

## 4. Question Selection Algorithm

### 4.1 Test Structure (New)

The test uses a **blended A2–C1** approach. We exclude A1 (too basic for diagnostic value) and C2 (too rare in general population, and the user explicitly asked for A2–C1).

| Section | Type | Questions | Level Distribution |
|---------|------|-----------|-------------------|
| 1. Grammar | MCQ | 6 questions | 1×A2, 2×B1, 2×B2, 1×C1 |
| 2. Vocabulary | MCQ | 6 questions | 1×A2, 2×B1, 2×B2, 1×C1 |
| 3. Reading | Passage + sub-questions | 2 passages × 2 questions = 4 | 1×B1 passage, 1×B2 passage |
| 4. Listening | Audio item + sub-questions | 2 items × 1 question = 2 | 1×B1 item, 1×B2 item |
| 5. Speaking | AI-evaluated | 1 prompt | 1×B2 (adaptive) |
| 6. Writing | AI-evaluated | 1 prompt | 1×B2 (adaptive) |
| **Total** | | **20 items** | Mixed A2–C1 |

**Why this structure?**
- 20 items is a meaningful test length without being exhausting
- Grammar + Vocabulary MCQs provide the primary level discrimination
- Reading/Listening provide applied comprehension verification
- Speaking/Writing provide production skill evidence
- The heavy weighting toward B1/B2 ensures the test can discriminate in the most common range

### 4.2 Level Weight Distribution

For the MCQ sections (grammar + vocabulary), the target distribution across 12 questions:

```
A2: 2 questions (16.7%) — "can you handle elementary English?"
B1: 4 questions (33.3%) — core diagnostic range
B2: 4 questions (33.3%) — core diagnostic range
C1: 2 questions (16.7%) — "can you handle advanced English?"
```

This "bell curve" centered on B1/B2 ensures:
1. Most test-takers will find the majority of questions at their level
2. A2 questions anchor the bottom — if you miss these, your level is clearly A1/A2
3. C1 questions anchor the top — if you ace these, you're C1+
4. The test can assign a precise level even if the user's ability is between B1 and B2

### 4.3 Selection Algorithm (Pseudocode)

```typescript
/**
 * Question Selection Algorithm
 * 
 * Phase 1: Collect candidate pools (with anti-repeat filtering)
 * Phase 2: Apply level-weighted random selection
 * Phase 3: Apply adaptive difficulty adjustment (if prior assessment exists)
 * Phase 4: Record selected questions in SeenQuestion + Assessment.questionSet
 */

interface SelectionConfig {
  userId: string;
  organizationId: string | null;
  assessmentId: string;
}

interface SectionConfig {
  type: 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'speaking' | 'writing';
  count: number;
  levels: LevelDistribution[];
}

interface LevelDistribution {
  level: string;  // "A2" | "B1" | "B2" | "C1"
  weight: number; // relative weight (0-1)
}

// ─── MAIN ENTRY POINT ───

async function selectQuestions(config: SelectionConfig): Promise<AssessmentQuestionSet> {
  const { userId, organizationId, assessmentId } = config;
  
  // Step 0: Get previously seen question IDs for anti-repeat
  const seenQuestionIds = await getSeenQuestionIds(userId);
  
  // Step 1: Get user's previous assessment performance (for adaptive adjustment)
  const priorPerformance = await getPriorPerformance(userId);
  
  // Step 2: Define section configurations
  const sections: SectionConfig[] = [
    {
      type: 'grammar',
      count: 6,
      levels: [
        { level: 'A2', weight: 0.17 },
        { level: 'B1', weight: 0.33 },
        { level: 'B2', weight: 0.33 },
        { level: 'C1', weight: 0.17 },
      ],
    },
    {
      type: 'vocabulary',
      count: 6,
      levels: [
        { level: 'A2', weight: 0.17 },
        { level: 'B1', weight: 0.33 },
        { level: 'B2', weight: 0.33 },
        { level: 'C1', weight: 0.17 },
      ],
    },
    {
      type: 'reading',
      count: 2,  // 2 passages
      levels: [
        { level: 'B1', weight: 0.5 },
        { level: 'B2', weight: 0.5 },
      ],
    },
    {
      type: 'listening',
      count: 2,  // 2 items
      levels: [
        { level: 'B1', weight: 0.5 },
        { level: 'B2', weight: 0.5 },
      ],
    },
    {
      type: 'speaking',
      count: 1,
      levels: [
        { level: 'B2', weight: 1.0 },  // Adjusted adaptively below
      ],
    },
    {
      type: 'writing',
      count: 1,
      levels: [
        { level: 'B2', weight: 1.0 },  // Adjusted adaptively below
      ],
    },
  ];
  
  // Step 3: Apply adaptive difficulty adjustment
  if (priorPerformance) {
    adjustWeightsAdaptively(sections, priorPerformance);
  }
  
  // Step 4: Select questions for each section
  const questionSet: AssessmentQuestionSet = {
    assessmentId,
    grammar: [],
    vocabulary: [],
    reading: [],
    listening: [],
    speaking: null,
    writing: null,
  };
  
  for (const section of sections) {
    const selected = await selectSectionQuestions(
      section, userId, organizationId, seenQuestionIds
    );
    questionSet[section.type] = selected;
  }
  
  // Step 5: Record all selected questions as seen
  await recordSeenQuestions(userId, assessmentId, questionSet);
  
  // Step 6: Store questionSet snapshot on the Assessment
  await db.assessment.update({
    where: { id: assessmentId },
    data: { questionSet: JSON.stringify(serializeQuestionSet(questionSet)) },
  });
  
  return questionSet;
}

// ─── SECTION-LEVEL SELECTION ───

async function selectSectionQuestions(
  section: SectionConfig,
  userId: string,
  organizationId: string | null,
  seenIds: Set<string>
): Promise<any[]> {
  const selected: any[] = [];
  
  for (const levelDist of section.levels) {
    const countForLevel = Math.round(section.count * levelDist.weight);
    if (countForLevel === 0) continue;
    
    // Build the where clause with anti-repeat exclusion
    const whereClause = buildWhereClause(section.type, levelDist.level, organizationId, seenIds);
    
    // Fetch candidates using application-level shuffle
    // (Use TABLESAMPLE for large pools — see Appendix B)
    const candidates = await fetchCandidates(whereClause);
    
    // Filter out seen questions (double-check after fetch)
    let pool = candidates.filter(q => !seenIds.has(q.id));
    
    // Filter out variantGroup conflicts (don't select 2 questions from same variant group)
    const selectedVariantGroups = new Set(selected.map(q => q.variantGroup).filter(Boolean));
    pool = pool.filter(q => !q.variantGroup || !selectedVariantGroups.has(q.variantGroup));
    
    // Shuffle and take needed count
    const shuffled = fisherYatesShuffle(pool);
    let picked = shuffled.slice(0, countForLevel);
    
    // Handle shortfall: if we couldn't get enough, relax constraints
    if (picked.length < countForLevel) {
      const relaxedPool = await fetchCandidates(
        buildWhereClause(section.type, levelDist.level, organizationId, null) // no seen-filter
      );
      const additionalPicks = fisherYatesShuffle(
        relaxedPool.filter(q => !selected.some(s => s.id === q.id))
      ).slice(0, countForLevel - picked.length);
      picked.push(...additionalPicks);
    }
    
    selected.push(...picked);
  }
  
  return selected;
}

// ─── RANDOM SELECTION STRATEGIES ───

/**
 * Strategy 1: Application-level shuffle (recommended for current pool sizes <500)
 */
async function selectRandomQuestions(
  level: string,
  category: string,
  count: number,
  excludeIds: Set<string>,
  organizationId: string | null
): Promise<Question[]> {
  const candidates = await db.question.findMany({
    where: {
      level,
      category,
      isActive: true,
      organizationId: organizationId || null,
      id: excludeIds.size > 0 ? { notIn: [...excludeIds] } : undefined,
    },
  });
  
  return fisherYatesShuffle(candidates).slice(0, count);
}

/**
 * Strategy 2: TABLESAMPLE BERNOULLI for efficient random sampling on large tables (10k+ rows)
 * 
 * Why not ORDER BY RANDOM()?
 * - On large tables, ORDER BY RANDOM() scans ALL rows and sorts them
 * - TABLESAMPLE BERNOULLI(percentage) randomly samples a percentage of rows
 * - Much faster on large tables
 */
async function fetchRandomCandidatesTABLESAMPLE(
  level: string,
  category: string,
  targetCount: number,
  organizationId: string | null
): Promise<any[]> {
  const samplePercent = Math.min(Math.max(targetCount * 10, 5), 50);
  
  const result = await db.$queryRaw`
    SELECT * FROM "Question"
    TABLESAMPLE BERNOULLI(${samplePercent})
    WHERE "level" = ${level}
      AND "category" = ${category}
      AND "isActive" = true
      AND ("organizationId" IS NULL OR "organizationId" = ${organizationId})
    LIMIT ${targetCount * 2}
  `;
  
  return result;
}

/**
 * Strategy 3: $queryRaw with RANDOM() for medium pools where TABLESAMPLE is wasteful
 */
async function fetchRandomCandidatesRaw(
  level: string,
  category: string,
  count: number,
  excludeIds: Set<string>,
  organizationId: string | null
): Promise<any[]> {
  const excludeList = excludeIds.size > 0 ? [...excludeIds] : [];
  
  return db.$queryRaw`
    SELECT * FROM "Question"
    WHERE "level" = ${level}
      AND "category" = ${category}
      AND "isActive" = true
      AND ("organizationId" IS NULL OR "organizationId" = ${organizationId})
      AND ${excludeList.length > 0 ? Prisma.sql`"id" != ALL(${excludeList})` : Prisma.sql`true`}
    ORDER BY RANDOM()
    LIMIT ${count}
  `;
}

// ─── FISHER-YATES SHUFFLE ───

function fisherYatesShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── ADAPTIVE DIFFICULTY ADJUSTMENT ───

interface PriorPerformance {
  previousLevel: string;   // "B1", "B2", etc.
  previousScore: number;   // 0-100
  attemptCount: number;
}

function adjustWeightsAdaptively(
  sections: SectionConfig[],
  prior: PriorPerformance
): void {
  const levelOrder = ['A2', 'B1', 'B2', 'C1'];
  const priorIdx = levelOrder.indexOf(prior.previousLevel);
  
  // Shift weights toward the user's demonstrated level
  for (const section of sections) {
    if (section.type === 'speaking' || section.type === 'writing') {
      // For speaking/writing, target one level above prior performance
      // (since these are production skills, we want to test ceiling)
      const targetLevel = levelOrder[Math.min(priorIdx + 1, levelOrder.length - 1)];
      section.levels = [{ level: targetLevel, weight: 1.0 }];
      continue;
    }
    
    // For MCQ sections, shift the bell curve center
    const shift = priorIdx - 1; // -1 for A2, 0 for B1, 1 for B2, 2 for C1
    
    section.levels = section.levels.map(ld => ({
      ...ld,
      weight: applyShift(ld.level, ld.weight, shift, levelOrder),
    }));
    
    // Re-normalize weights to sum to 1
    const totalWeight = section.levels.reduce((sum, ld) => sum + ld.weight, 0);
    section.levels = section.levels.map(ld => ({
      ...ld,
      weight: ld.weight / totalWeight,
    }));
  }
}

function applyShift(
  level: string,
  baseWeight: number,
  shift: number,
  levelOrder: string[]
): number {
  const levelIdx = levelOrder.indexOf(level);
  // Shift moves the peak. Positive shift = favor higher levels.
  const distance = Math.abs(levelIdx - (1 + shift)); // 1 = center (B1)
  return baseWeight * Math.pow(0.6, distance); // Decay by distance
}

// ─── ANTI-REPEAT ───

async function getSeenQuestionIds(userId: string): Promise<Set<string>> {
  const seen = await db.seenQuestion.findMany({
    where: { userId },
    select: { questionId: true, questionType: true },
  });
  return new Set(seen.map(s => s.questionId));
}

async function recordSeenQuestions(
  userId: string,
  assessmentId: string,
  questionSet: AssessmentQuestionSet
): Promise<void> {
  const records = [];
  
  for (const q of questionSet.grammar) {
    records.push({ userId, questionType: 'mcq', questionId: q.id, assessmentId });
  }
  for (const q of questionSet.vocabulary) {
    records.push({ userId, questionType: 'mcq', questionId: q.id, assessmentId });
  }
  for (const p of questionSet.reading) {
    records.push({ userId, questionType: 'reading', questionId: p.id, assessmentId });
  }
  for (const l of questionSet.listening) {
    records.push({ userId, questionType: 'listening', questionId: l.id, assessmentId });
  }
  if (questionSet.speaking) {
    records.push({ userId, questionType: 'speaking', questionId: questionSet.speaking.id, assessmentId });
  }
  if (questionSet.writing) {
    records.push({ userId, questionType: 'writing', questionId: questionSet.writing.id, assessmentId });
  }
  
  // Use createMany with skipDuplicates (relies on @@unique constraint)
  await db.seenQuestion.createMany({
    data: records,
    skipDuplicates: true,
  });
}

// ─── PRIOR PERFORMANCE LOOKUP ───

async function getPriorPerformance(userId: string): Promise<PriorPerformance | null> {
  const lastAssessment = await db.assessment.findFirst({
    where: {
      userId,
      status: 'completed',
      cefrLevel: { not: null },
    },
    orderBy: { completedAt: 'desc' },
  });
  
  if (!lastAssessment?.cefrLevel) return null;
  
  return {
    previousLevel: lastAssessment.cefrLevel,
    previousScore: lastAssessment.score || 50,
    attemptCount: await db.assessment.count({
      where: { userId, status: 'completed' },
    }),
  };
}

// ─── POOL EXHAUSTION FALLBACK ───

/**
 * If the anti-repeat filter eliminates too many questions:
 * 1. First: try relaxing variantGroup constraint
 * 2. Second: try including questions from adjacent levels
 * 3. Third: allow repeat questions (oldest seen first — LRU eviction)
 * 4. Last resort: use hardcoded fallback questions
 */
async function handlePoolExhaustion(
  section: SectionConfig,
  userId: string,
  organizationId: string | null,
  seenIds: Set<string>
): Promise<any[]> {
  // Strategy 1: Include seen questions, prioritizing least-recently-seen
  const allQuestions = await fetchCandidates(
    buildWhereClause(section.type, 'B1', organizationId, null) // no seen-filter
  );
  
  if (allQuestions.length === 0) {
    // Strategy 2: Hardcoded fallback (maintain backward compat)
    return generateFallbackQuestions(section.type);
  }
  
  // Sort by least-recently-seen
  const seenDates = await db.seenQuestion.findMany({
    where: {
      userId,
      questionId: { in: allQuestions.map(q => q.id) },
    },
    orderBy: { seenAt: 'asc' },
  });
  
  const seenDateMap = new Map(seenDates.map(s => [s.questionId, s.seenAt]));
  allQuestions.sort((a, b) => {
    const aDate = seenDateMap.get(a.id) || new Date(0);
    const bDate = seenDateMap.get(b.id) || new Date(0);
    return aDate.getTime() - bDate.getTime(); // Oldest first
  });
  
  return allQuestions.slice(0, section.count);
}
```

### 4.4 Random Selection Strategy Decision Matrix

**Problem:** Prisma doesn't support `ORDER BY RANDOM()` or `ORDER BY md5(id::text)`.

| Strategy | When to Use | Performance | Implementation |
|----------|-------------|-------------|----------------|
| **Application-level shuffle** | Pool < 500 per level/category | Good enough (~50ms) | `findMany` → Fisher-Yates → slice |
| **`$queryRaw` + RANDOM()** | Pool 500–10,000 | Better (~20ms) | Raw SQL query |
| **TABLESAMPLE BERNOULLI** | Pool > 10,000 | Best (~5ms) | Raw SQL with sampling |

**Recommended for this project:** Start with **application-level shuffle**. The current pool is small. Migrate to TABLESAMPLE once the pool exceeds 500 per level/category.

### 4.5 Full Assessment Flow Diagram

```
User clicks "Start Test"
        │
        ▼
POST /api/assessments/start
        │
        ├── Check auth + credits + email verified
        ├── Check for existing in-progress assessment
        ├── Decrement credit (inside transaction)
        ├── Create Assessment record
        │
        ▼
selectQuestions({ userId, organizationId, assessmentId })
        │
        ├── Get seen question IDs (SeenQuestion)
        ├── Get prior performance (last Assessment)
        ├── Apply adaptive weight adjustment
        │
        ├── For each section:
        │   ├── Calculate level distribution
        │   ├── Fetch candidate pool (excluding seen)
        │   ├── Filter variantGroup conflicts
        │   ├── Fisher-Yates shuffle → take N
        │   └── Handle pool exhaustion if needed
        │
        ├── Record all selected in SeenQuestion
        ├── Store questionSet JSON on Assessment
        │
        ▼
Return full question payload to client
(strip correctIndex for security!)
        │
        ▼
Client renders 6 sections sequentially
        │
        ▼
POST /api/assessments/submit
        │
        ├── Validate questionIds against Assessment.questionSet
        ├── Verify MCQ answers server-side (from DB)
        ├── AI-evaluate speaking + writing
        ├── Calculate weighted score + CEFR level
        ├── Save AssessmentResponses
        ├── Generate certificate
        │
        ▼
Return results + certificate
```

---

## 5. API Design

### 5.1 Modified Endpoints

#### `POST /api/assessments/start`

**Current behavior:** Returns only MCQ questions (grammar + vocabulary from DB). Reading/listening/speaking/writing are hardcoded client-side.

**New behavior:** Returns ALL question types from the database, with randomized selection and anti-repeat logic.

**Request:** (unchanged)
```typescript
// No body required — auth from cookie
```

**Response:**
```typescript
{
  assessment: {
    id: string;
    status: "in_progress";
    startedAt: string;        // ISO 8601
  };
  questions: {
    grammar: Array<{
      id: string;
      text: string;
      options: string[];      // Already parsed from JSON
      level: string;
      category: "grammar";
    }>;
    vocabulary: Array<{
      id: string;
      text: string;
      options: string[];
      level: string;
      category: "vocabulary";
    }>;
    reading: Array<{
      id: string;
      level: string;
      title: string | null;
      passageText: string;
      questions: Array<{
        id: string;
        questionText: string;
        options: string[];
        sortOrder: number;
      }>;
    }>;
    listening: Array<{
      id: string;
      level: string;
      scriptText: string;
      audioUrl: string | null;
      context: string | null;
      questions: Array<{
        id: string;
        questionText: string;
        options: string[];
        sortOrder: number;
      }>;
    }>;
    speaking: {
      id: string;
      level: string;
      promptText: string;
      preparationTime: number;
      responseTime: number;
    } | null;
    writing: {
      id: string;
      level: string;
      promptText: string;
      minWords: number;
      maxWords: number;
    } | null;
  };
  message: string;
}
```

> **CRITICAL SECURITY FIX:** `correctIndex` and `explanation` must NOT be included in the client response. Currently the start endpoint sends them! The server verifies answers from the DB on submit.

#### `POST /api/assessments/submit`

**Current behavior:** Uses hardcoded `READING_ANSWERS` and `LISTENING_ANSWERS` maps for server-side verification.

**New behavior:** Looks up correct answers from the database based on the assessment's `questionSet`.

**Request:**
```typescript
{
  assessmentId: string;
  responses: Array<{
    questionId: string;
    questionType: "mcq" | "reading" | "listening" | "speaking" | "writing";
    parentItemId?: string;    // For reading/listening sub-questions
    answer: string;           // Selected option index (MCQ) or text (speaking/writing)
    aiScore?: number;         // For speaking/writing: AI evaluation score
  }>;
}
```

**Server-side verification logic (new):**
```typescript
async function verifyResponses(
  assessmentId: string,
  responses: SubmittedResponse[]
): Promise<VerifiedResponse[]> {
  // 1. Get the questionSet snapshot for this assessment
  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId },
  });
  const questionSet = JSON.parse(assessment.questionSet || '{}');
  
  // 2. Build a set of valid question IDs for this assessment
  const validQuestionIds = extractAllQuestionIds(questionSet);
  
  const verified: VerifiedResponse[] = [];
  
  for (const response of responses) {
    // 3. Reject responses for questions not in this assessment
    if (!validQuestionIds.has(response.questionId)) {
      continue; // Skip invalid question
    }
    
    let isCorrect: boolean | null = null;
    let aiScore: number | null = null;
    
    switch (response.questionType) {
      case 'mcq': {
        const question = await db.question.findUnique({
          where: { id: response.questionId },
          select: { correctIndex: true, level: true },
        });
        isCorrect = question ? Number(response.answer) === question.correctIndex : false;
        break;
      }
      case 'reading': {
        const question = await db.readingQuestion.findUnique({
          where: { id: response.questionId },
          select: { correctIndex: true, passage: { select: { level: true } } },
        });
        isCorrect = question ? Number(response.answer) === question.correctIndex : false;
        break;
      }
      case 'listening': {
        const question = await db.listeningQuestion.findUnique({
          where: { id: response.questionId },
          select: { correctIndex: true, item: { select: { level: true } } },
        });
        isCorrect = question ? Number(response.answer) === question.correctIndex : false;
        break;
      }
      case 'speaking':
      case 'writing': {
        // AI-evaluated; isCorrect is derived from AI score
        aiScore = response.aiScore || null;
        isCorrect = aiScore !== null ? aiScore >= 50 : false;
        break;
      }
    }
    
    verified.push({
      ...response,
      isCorrect,
      aiScore,
    });
  }
  
  return verified;
}
```

### 5.2 New Endpoints

#### `GET /api/assessments/questions`

Returns the questions for an in-progress assessment (for page refresh / resume).

```typescript
// Request: GET /api/assessments/questions?assessmentId=xxx
// Auth: Required (must own the assessment)
// Response: Same shape as POST /api/assessments/start response.questions
```

#### `POST /api/admin/questions/manage` (CRUD for all question types)

```typescript
// Create/Update/Delete questions of any type
// Body:
{
  action: "create" | "update" | "delete" | "batch_create";
  type: "mcq" | "reading" | "listening" | "speaking" | "writing";
  data: QuestionInput;          // For create/update
  id?: string;                  // For update/delete
  items?: QuestionInput[];      // For batch_create
}

// QuestionInput varies by type:
type MCQInput = {
  level: string;
  category: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficultyTier?: number;
  variantGroup?: string;
  organizationId?: string;
};

type ReadingInput = {
  level: string;
  title?: string;
  passageText: string;
  questions: Array<{
    questionText: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }>;
  difficultyTier?: number;
  variantGroup?: string;
  organizationId?: string;
};

type ListeningInput = {
  level: string;
  scriptText: string;
  audioUrl?: string;
  context?: string;
  questions: Array<{
    questionText: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }>;
  difficultyTier?: number;
  variantGroup?: string;
  organizationId?: string;
};

type SpeakingInput = {
  level: string;
  promptText: string;
  preparationTime?: number;
  responseTime?: number;
  difficultyTier?: number;
  variantGroup?: string;
  organizationId?: string;
};

type WritingInput = {
  level: string;
  promptText: string;
  minWords?: number;
  maxWords?: number;
  difficultyTier?: number;
  variantGroup?: string;
  organizationId?: string;
};
```

#### `GET /api/admin/questions/pool-stats`

Enhanced version of the existing stats endpoint.

```typescript
// Response:
{
  mcq: {
    total: number;
    byLevel: Record<string, number>;
    byLevelAndCategory: Record<string, Record<string, number>>;
  };
  reading: {
    total: number;
    passages: number;
    questions: number;
    byLevel: Record<string, number>;
  };
  listening: {
    total: number;
    items: number;
    questions: number;
    byLevel: Record<string, number>;
  };
  speaking: { total: number; byLevel: Record<string, number> };
  writing: { total: number; byLevel: Record<string, number> };
  organizations: {
    total: number;
    byOrg: Record<string, {
      mcq: number; reading: number; listening: number; speaking: number; writing: number;
    }>;
  };
  coverage: {
    canRunFullTest: boolean;
    deficiencies: string[];  // e.g., ["Need at least 3 more B2 grammar questions"]
  };
}
```

#### `POST /api/admin/questions/generate-batch` (Enhanced)

Extends the existing batch generation to support all question types:

```typescript
// Body:
{
  type: "mcq" | "reading" | "listening" | "speaking" | "writing";
  levels: string[];
  countPerSlot: number;
  organizationId?: string;
}

// Response:
{
  success: boolean;
  totalGenerated: number;
  results: Array<{
    level: string;
    generated: number;
    skipped: number;
    errors: number;
  }>;
}
```

#### Organization Endpoints (B2B)

```typescript
// GET  /api/admin/organizations          — List all organizations
// POST /api/admin/organizations          — Create organization
// GET  /api/organizations/[orgId]        — Get org details
// PUT  /api/organizations/[orgId]        — Update org
// GET  /api/organizations/[orgId]/members     — List org members
// POST /api/organizations/[orgId]/invite      — Invite member
// GET  /api/organizations/[orgId]/questions   — List org's questions
// POST /api/organizations/[orgId]/questions   — Create custom question
// GET  /api/organizations/[orgId]/assessments — View member test results
```

---

## 6. Migration Strategy

### 6.1 Phase 1: Schema Migration (Week 1)

**Step 1: Add new models without removing old ones.**

```bash
npx prisma migrate dev --name add_question_rotation_system
```

This migration adds:
- `Organization`, `OrganizationMember`
- `ReadingPassage`, `ReadingQuestion`
- `ListeningItem`, `ListeningQuestion`
- `SpeakingPrompt`, `WritingPrompt`
- `SeenQuestion`
- New fields on `User` (`organizationId`)
- New fields on `Assessment` (`questionSet`)
- New fields on `AssessmentResponse` (`questionType`, `parentItemId`, `aiScore`, `aiFeedback`)
- New fields on `Question` (`difficultyTier`, `variantGroup`, `organizationId`, `isActive`)

**No breaking changes** — existing Question model keeps all current fields. New fields have defaults.

### 6.2 Phase 2: Seed Hardcoded Content into DB (Week 1)

Create a seed script that reads the hardcoded constants from `test/page.tsx` and inserts them into the new models:

```typescript
// prisma/seed-questions.ts

async function seedFromHardcodedContent() {
  // ─── Seed Reading Passages ───
  const READING_PASSAGES = [ /* ... copy from test/page.tsx ... */ ];
  
  for (const passage of READING_PASSAGES) {
    const exists = await db.readingPassage.findFirst({
      where: { passageText: passage.passage },
    });
    if (exists) continue;
    
    const newPassage = await db.readingPassage.create({
      data: {
        level: passage.level,
        passageText: passage.passage,
        difficultyTier: 5,
      },
    });
    
    for (let i = 0; i < passage.questions.length; i++) {
      const q = passage.questions[i];
      await db.readingQuestion.create({
        data: {
          passageId: newPassage.id,
          questionText: q.question,
          options: JSON.stringify(q.options),
          correctIndex: q.correctIndex,
          sortOrder: i,
        },
      });
    }
  }
  
  // ─── Seed Listening Items ───
  const LISTENING_ITEMS = [ /* ... */ ];
  
  for (const item of LISTENING_ITEMS) {
    const exists = await db.listeningItem.findFirst({
      where: { scriptText: item.script },
    });
    if (exists) continue;
    
    const newItem = await db.listeningItem.create({
      data: {
        level: item.level,
        scriptText: item.script,
        difficultyTier: 5,
      },
    });
    
    await db.listeningQuestion.create({
      data: {
        itemId: newItem.id,
        questionText: item.question,
        options: JSON.stringify(item.options),
        correctIndex: item.correctIndex,
        sortOrder: 0,
      },
    });
  }
  
  // ─── Seed Speaking Prompts ───
  const SPEAKING_PROMPTS = [ /* ... */ ];
  
  for (const prompt of SPEAKING_PROMPTS) {
    const exists = await db.speakingPrompt.findFirst({
      where: { promptText: prompt.prompt },
    });
    if (exists) continue;
    
    await db.speakingPrompt.create({
      data: {
        level: prompt.level,
        promptText: prompt.prompt,
        preparationTime: prompt.preparationTime,
        responseTime: prompt.responseTime,
        difficultyTier: 5,
      },
    });
  }
  
  // ─── Seed Writing Prompts ───
  const WRITING_PROMPTS = [ /* ... */ ];
  
  for (const prompt of WRITING_PROMPTS) {
    const exists = await db.writingPrompt.findFirst({
      where: { promptText: prompt.prompt },
    });
    if (exists) continue;
    
    await db.writingPrompt.create({
      data: {
        level: prompt.level,
        promptText: prompt.prompt,
        minWords: prompt.minWords,
        maxWords: prompt.maxWords,
        difficultyTier: 5,
      },
    });
  }
}
```

### 6.3 Phase 3: Generate Additional Content (Week 1-2)

The current pool is far too small for rotation. Minimum viable pool sizes:

| Type | Per Level | Total (4 levels: A2–C1) | Notes |
|------|-----------|--------------------------|-------|
| Grammar MCQ | 20 | 80 | Need variety for rotation |
| Vocabulary MCQ | 20 | 80 | Need variety for rotation |
| Reading Passage | 5 | 20 | 2 per test, ~10 retakes without repeat |
| Listening Item | 5 | 20 | 2 per test, ~10 retakes without repeat |
| Speaking Prompt | 5 | 20 | 1 per test |
| Writing Prompt | 5 | 20 | 1 per test |
| **Total items** | | **300** | |

**Use the existing AI batch generation** (`/api/admin/questions/batch`) to fill MCQ gaps. Create a new generation endpoint for reading/listening/speaking/writing prompts.

### 6.4 Phase 4: Update API Routes (Week 2)

1. **`/api/assessments/start`**: Replace `getQuestionsFromBank()` with the new `selectQuestions()` algorithm
2. **`/api/assessments/submit`**: Replace hardcoded `READING_ANSWERS`/`LISTENING_ANSWERS` with DB lookups
3. **Client `test/page.tsx`**: Remove hardcoded constants, consume questions from API response

### 6.5 Phase 5: Backward Compatibility

During migration, maintain dual support:

```typescript
// In start/route.ts — during transition period
async function getQuestions(config: SelectionConfig): Promise<AssessmentQuestionSet> {
  try {
    // Try new DB-backed system
    return await selectQuestions(config);
  } catch (error) {
    console.error('New question system failed, falling back to hardcoded:', error);
    // Fall back to legacy system
    return getQuestionsFromBankLegacy();
  }
}
```

**For the submit route**, during transition:

```typescript
// During transition: check DB first, fall back to hardcoded maps
async function verifyReadingAnswer(questionId: string, answer: number): Promise<boolean> {
  // Try DB lookup first
  const question = await db.readingQuestion.findUnique({ where: { id: questionId } });
  if (question) return answer === question.correctIndex;
  
  // Fallback to hardcoded (for in-progress assessments started before migration)
  if (questionId in READING_ANSWERS) return answer === READING_ANSWERS[questionId];
  
  console.error(`Cannot verify answer for question ${questionId}`);
  return false;
}
```

### 6.6 Phase 6: Remove Hardcoded Content (Week 3)

Once the DB pool is sufficiently large and all in-progress assessments from the old system are completed:

1. Remove hardcoded constants from `test/page.tsx`
2. Remove `READING_ANSWERS` and `LISTENING_ANSWERS` from `submit/route.ts`
3. Remove `generateFallbackCefrQuestions()` from `start/route.ts`
4. Remove the `id` fields that used the old format (`r-a1-0`, `l-a1`, etc.)

---

## 7. B2B / Institution Features

### 7.1 Organization-Scoped Question Pools

Every question model has an `organizationId` field:

- `null` → **Global pool** — available to all users
- `"org_xxx"` → **Org-exclusive** — only available to users in that organization

**Selection logic:**

```typescript
function buildOrganizationScope(organizationId: string | null) {
  if (!organizationId) {
    // Individual users: only see global pool
    return { organizationId: null };
  }
  
  // B2B users: see global pool + their org's pool
  return {
    OR: [
      { organizationId: null },           // Global pool
      { organizationId: organizationId },  // Org pool
    ],
  };
}
```

This means a B2B test can include:
- Standard global questions (for comparability across institutions)
- Custom questions specific to their domain (e.g., medical English for a hospital)

### 7.2 Admin Question Management

**Organization admin** can:

| Action | Endpoint | Permission |
|--------|----------|------------|
| View their org's questions | `GET /api/organizations/[orgId]/questions` | `org_admin` |
| Create custom questions | `POST /api/organizations/[orgId]/questions` | `org_admin` |
| Edit custom questions | `PUT /api/organizations/[orgId]/questions/[id]` | `org_admin` |
| Delete custom questions | `DELETE /api/organizations/[orgId]/questions/[id]` | `org_admin` |
| View test results for members | `GET /api/organizations/[orgId]/assessments` | `org_admin` |
| Invite members | `POST /api/organizations/[orgId]/invite` | `org_admin` |

**Platform admin** (super-admin) can:

| Action | Endpoint | Permission |
|--------|----------|------------|
| Manage all organizations | `GET/POST/PUT/DELETE /api/admin/organizations` | `admin` |
| Assign questions to orgs | `PUT /api/admin/questions/[id]` (set organizationId) | `admin` |
| Generate AI questions for orgs | `POST /api/admin/questions/generate-batch` with organizationId | `admin` |
| View cross-org analytics | `GET /api/admin/analytics` | `admin` |

### 7.3 "Shared Question Bank Access" — Team Plan Feature

The Team plan gives organizations:

1. **Access to the global question pool** (`questionPoolAccess: true`)
   - Without this, org users only see org-specific questions
   - With this, they get the full global pool + org pool

2. **Dedicated question allocation**
   - When the selection algorithm runs for a B2B user, it can preferentially select from the org pool first (if custom questions exist), then fill remaining slots from the global pool
   - This ensures the test "feels" customized for the institution

3. **Custom difficulty calibration** (future enhancement)
   - Organizations can flag certain questions as "must include" or "must exclude"
   - This would be a `QuestionOrgPreference` model:

```prisma
model QuestionOrgPreference {
  id             String   @id @default(cuid())
  organizationId String
  questionId     String
  questionType   String   // "mcq" | "reading" | "listening" | "speaking" | "writing"
  preference     String   // "required" | "excluded" | "preferred" | "neutral"
  createdAt      DateTime @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([organizationId, questionType, questionId])
  @@index([organizationId])
}
```

### 7.4 White-Label + Custom Assessment Flow (Future)

For enterprise organizations:

```
1. Admin creates Organization with white-label settings
2. Admin creates custom question pool (or uses global)
3. Admin creates AssessmentTemplate:
   - Which sections to include
   - How many questions per section
   - Time limits per section
   - Required vs. optional sections
4. Organization members take the custom assessment
5. Results are scoped to the organization
6. Certificates can be branded with org logo
```

```prisma
model AssessmentTemplate {
  id              String   @id @default(cuid())
  organizationId  String
  name            String   // "Medical English Placement Test"
  description     String?
  sections        String   // JSON: [{ type: "grammar", count: 10, levels: {...} }, ...]
  timeLimit       Int?     // Total time limit in minutes
  isDefault       Boolean  @default(false)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organization    Organization @relation(fields: [organizationId], references: [id])

  @@index([organizationId, isActive])
}
```

---

## 8. Implementation Checklist

### Week 1: Foundation

- [ ] Create Prisma migration with all new models
- [ ] Run migration on dev database
- [ ] Create seed script to migrate hardcoded content to DB
- [ ] Add `difficultyTier` and `variantGroup` to existing Question records (set defaults)
- [ ] Generate additional question content via AI batch endpoint (target: 20 per level/category)
- [ ] Create `GET /api/assessments/questions` endpoint (for resume)

### Week 2: Core Algorithm

- [ ] Implement `selectQuestions()` algorithm in `src/lib/question-selection.ts`
- [ ] Implement `SeenQuestion` recording and querying
- [ ] Update `POST /api/assessments/start` to use new algorithm
- [ ] Update `POST /api/assessments/submit` to verify from DB (remove hardcoded maps)
- [ ] Remove `correctIndex` from API responses to client (security fix)
- [ ] Update `calculateResults()` to handle the new blended level structure

### Week 3: Client Refactor

- [ ] Refactor `test/page.tsx` to consume questions from API instead of hardcoded constants
- [ ] Update reading section to render DB-provided passages
- [ ] Update listening section to render DB-provided items
- [ ] Update speaking section to render DB-provided prompts
- [ ] Update writing section to render DB-provided prompts
- [ ] Handle the "single speaking prompt" and "single writing prompt" flow (currently iterates through all 6)
- [ ] Test full assessment flow end-to-end

### Week 4: B2B + Polish

- [ ] Implement Organization CRUD API
- [ ] Implement organization-scoped question selection
- [ ] Create admin UI for managing all question types
- [ ] Create org admin UI for managing their question pool
- [ ] Add `AssessmentTemplate` model and API (if time permits)
- [ ] Pool exhaustion testing (what happens when a user takes 20+ tests?)
- [ ] Performance testing (ensure question selection is <200ms)
- [ ] Remove hardcoded fallback code and legacy constants

### Week 5: Content + Launch

- [ ] Bulk-generate reading passages (target: 5 per level = 20)
- [ ] Bulk-generate listening items (target: 5 per level = 20)
- [ ] Bulk-generate speaking prompts (target: 5 per level = 20)
- [ ] Bulk-generate writing prompts (target: 5 per level = 20)
- [ ] QA: verify anti-repeat works across 5+ consecutive tests
- [ ] QA: verify adaptive difficulty shifts correctly
- [ ] QA: verify B2B org-scoping works
- [ ] Deploy to production with feature flag
- [ ] Monitor error rates and question coverage
- [ ] Remove feature flag after validation

---

## Appendix A: Security Considerations

### A.1 Answer Exposure (CRITICAL FIX)

**Current vulnerability:** The `POST /api/assessments/start` endpoint returns `correctIndex` for every question. A malicious user can inspect the network response to see all correct answers before taking the test.

**Fix:** Strip `correctIndex` and `explanation` from the API response.

```typescript
// In start/route.ts response builder:
function sanitizeForClient(question: any) {
  const { correctIndex, explanation, ...clientSafe } = question;
  return clientSafe;
}
```

### A.2 Answer Verification Integrity

**Current vulnerability:** Reading and listening answers are verified against hardcoded maps. A client could submit a different `questionId` that maps to an easy answer.

**Fix:** Verify against the `Assessment.questionSet` snapshot. Only accept responses for questions that were actually selected for this assessment.

```typescript
// In submit/route.ts:
const assessment = await db.assessment.findUnique({ where: { id: assessmentId } });
const questionSet = JSON.parse(assessment.questionSet || '{}');
const validQuestionIds = new Set(extractAllQuestionIds(questionSet));

for (const response of responses) {
  if (!validQuestionIds.has(response.questionId)) {
    return NextResponse.json({ error: 'Invalid question ID' }, { status: 400 });
  }
}
```

### A.3 Race Condition on Credit Consumption

**Current behavior:** Credit is decremented before question selection. If question selection fails, the credit is lost.

**Fix:** Wrap credit decrement + assessment creation + question selection in a transaction:

```typescript
await db.$transaction(async (tx) => {
  // Decrement credit
  await tx.user.update({
    where: { id: userId },
    data: { testCredits: { decrement: 1 } },
  });
  
  // Create assessment
  const assessment = await tx.assessment.create({ ... });
  
  // Select questions (may fail — entire transaction rolls back if so)
  const questions = await selectQuestions({ ... });
  
  // Store questionSet
  await tx.assessment.update({
    where: { id: assessment.id },
    data: { questionSet: JSON.stringify(questions) },
  });
});
```

---

## Appendix B: Performance Considerations

### B.1 Question Selection Latency

Target: <200ms for `POST /api/assessments/start`.

**Optimization strategies:**
1. Pre-compute seen question IDs at the start (single query with `select: { questionId: true }`)
2. Use indexed queries for candidate pools: `[level, category, isActive, organizationId]`
3. Fisher-Yates shuffle is O(n) — fast for pools <1000
4. Avoid N+1 queries: batch all candidate fetches per section

### B.2 Database Connection Pooling

Neon PostgreSQL on Vercel uses pooled connections. The current setup already handles this. No changes needed, but:
- Connection limit: ~20 concurrent on starter plan
- Question selection makes ~8 queries (1 per section per level) — well within limits
- Consider caching the question pool in memory for 5 minutes if latency becomes an issue

### B.3 TABLESAMPLE Performance (Future Scale)

For future scale (10,000+ questions):

```sql
-- Instead of scanning all rows:
SELECT * FROM "Question" ORDER BY RANDOM() LIMIT 6;
-- Time: ~500ms on 10k rows

-- Use TABLESAMPLE:
SELECT * FROM "Question" 
  TABLESAMPLE BERNOULLI(0.5)
  WHERE "level" = 'B1' AND "category" = 'grammar' AND "isActive" = true
  LIMIT 6;
-- Time: ~5ms on 10k rows
```

---

## Appendix C: CEFR Level Determination (New Algorithm)

The current algorithm finds "the highest level where the user got at least 50% correct." This doesn't work well with blended questions. New algorithm:

```typescript
function determineCefrLevel(responses: VerifiedResponse[]): string {
  const levelScores: Record<string, { correct: number; total: number }> = {};
  
  for (const r of responses) {
    if (!levelScores[r.level]) levelScores[r.level] = { correct: 0, total: 0 };
    levelScores[r.level].total++;
    if (r.isCorrect) levelScores[r.level].correct++;
  }
  
  // Calculate percentage correct at each level
  const levelPercentages: Record<string, number> = {};
  for (const [level, scores] of Object.entries(levelScores)) {
    levelPercentages[level] = scores.total > 0 ? scores.correct / scores.total : 0;
  }
  
  // IRT-inspired scoring: weighted by level difficulty
  // A user's level = the highest level where they score ≥60%
  // PLUS: if they score ≥80% at a level, they get +0.5 level credit
  
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  let numericLevel = 0; // 0 = A1, 1 = A2, ..., 5 = C2
  
  for (let i = 0; i < LEVELS.length; i++) {
    const pct = levelPercentages[LEVELS[i]] || 0;
    if (pct >= 0.6) {
      numericLevel = i;
      if (pct >= 0.8 && i < LEVELS.length - 1) {
        numericLevel = i + 0.5; // Partial credit at next level
      }
    }
  }
  
  // Round down to nearest full level
  const levelIndex = Math.min(Math.floor(numericLevel), LEVELS.length - 1);
  return LEVELS[levelIndex];
}
```

This gives smoother level determination and handles the blended question approach better than the current binary "50% threshold" method.

---

## Appendix D: File Structure for New Code

```
src/
├── lib/
│   ├── question-selection.ts        # Main algorithm (selectQuestions, etc.)
│   ├── question-selection.types.ts   # TypeScript interfaces for selection
│   ├── question-seed.ts             # Seed functions for hardcoded→DB migration
│   ├── db.ts                        # Existing Prisma client
│   └── ...
├── app/
│   ├── api/
│   │   ├── assessments/
│   │   │   ├── start/route.ts       # MODIFIED: use selectQuestions()
│   │   │   ├── submit/route.ts      # MODIFIED: DB-verified answers
│   │   │   ├── questions/route.ts   # NEW: GET for resume
│   │   │   ├── speaking/evaluate/route.ts  # UNCHANGED
│   │   │   └── writing/evaluate/route.ts   # UNCHANGED
│   │   ├── admin/
│   │   │   ├── questions/
│   │   │   │   ├── stats/route.ts        # MODIFIED: include all types
│   │   │   │   ├── batch/route.ts        # MODIFIED: support all types
│   │   │   │   ├── manage/route.ts       # NEW: CRUD for all types
│   │   │   │   └── pool-stats/route.ts   # NEW: coverage analysis
│   │   │   ├── organizations/
│   │   │   │   └── route.ts              # NEW: org CRUD
│   │   │   └── ...
│   │   ├── organizations/
│   │   │   └── [orgId]/
│   │   │       ├── route.ts              # NEW: org details
│   │   │       ├── questions/route.ts    # NEW: org question management
│   │   │       ├── members/route.ts      # NEW: member management
│   │   │       ├── invite/route.ts       # NEW: member invitations
│   │   │       └── assessments/route.ts  # NEW: org assessment results
│   │   └── ...
│   └── test/
│       └── page.tsx                      # MODIFIED: consume API questions
├── components/
│   ├── test/
│   │   ├── GrammarSection.tsx       # NEW: extracted from page.tsx
│   │   ├── VocabularySection.tsx    # NEW
│   │   ├── ReadingSection.tsx       # NEW
│   │   ├── ListeningSection.tsx     # NEW
│   │   ├── SpeakingSection.tsx      # NEW
│   │   ├── WritingSection.tsx       # NEW
│   │   └── TestResults.tsx          # NEW
│   └── ...
prisma/
├── schema.prisma                    # MODIFIED: all new models
└── seed-questions.ts                # NEW: hardcoded→DB migration
```
