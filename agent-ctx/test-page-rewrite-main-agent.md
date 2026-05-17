# Task: Rewrite CEFR Test Page with Dark Theme & Individual Test Types

## Task ID: test-page-rewrite

## Summary
Completely rewrote the test page (`/test`) from a light-themed single-assessment flow to a dark-themed multi-test selection platform with 4 individual test types and a full assessment option. Also updated the speaking evaluate API to return 6-dimension scoring.

## Files Modified

### 1. `/home/z/my-project/src/app/(main)/test/page.tsx` — COMPLETE REWRITE
**Changes:**
- Changed background from `bg-gradient-to-b from-gray-50 to-white` to `bg-[#0F0A1E]` (dark)
- Replaced all white/light cards with `glass-card` and `glass-card-neon` CSS classes
- Changed all text colors to `text-white`, `text-white/60`, `text-white/40` (dark theme palette)
- Changed badges from light theme (`bg-emerald-100 text-emerald-800`) to dark theme (`bg-emerald-500/20 text-emerald-400 border-emerald-500/30`)
- Changed primary CTA from `from-teal-600` to `from-purple-600 to-pink-500`

**New Features:**
- **Test Selection Landing (intro phase):** 4 glass-card test type cards in a 2x2 grid with icons, descriptions, durations, and "Start Test" buttons
  - Reading (BookOpen) — grammar, vocabulary, reading comprehension
  - Listening (Headphones) — audio passages with comprehension questions  
  - Writing (PenTool) — AI-evaluated writing prompts
  - Speaking (Mic) — 6-dimension AI scoring
- **Full Assessment option** below the cards — runs all 4 tests in sequence with progress indicator
- **Reading Test:** Same MCQ system but fully dark-themed with glassmorphism cards
- **Listening Test (NEW):**
  - Uses `window.speechSynthesis` (Web Speech API) for TTS
  - Level selector (A1-C2) with all 6 listening passages
  - Playback speed control (Slow/Normal/Fast)
  - Play/Pause/Resume/Replay controls
  - Passage text displayed while being read
  - 4 comprehension questions per passage (main idea, detail, inference, purpose)
  - Score calculation and "done" state with next-phase navigation
- **Writing Test:** Dark themed with glass-card prompt, textarea with word count
- **Speaking Test (ENHANCED):**
  - Input level selector (Low/Medium/High)
  - Recording timer with READY 00:00 format
  - Microphone button with ripple animation when recording
  - Fallback text input for unsupported browsers
  - 6-dimension result display with progress bars
  - Demo notice for interactive mode
- **Results Phase:** Dark themed with CEFR level badge, skill breakdown with circular progress charts, 6-dimension speaking analysis with progress bars, certificate link, and retake button

**Listening Passages Content:**
- All 6 passages (A1-C2) included as specified in the requirements
- 4 questions per passage with 4 options each
- Question types: main_idea, detail, inference, purpose

### 2. `/home/z/my-project/src/app/api/assessments/speaking/evaluate/route.ts` — UPDATED
**Changes:**
- Updated Gemini prompt to evaluate 6 dimensions instead of 5:
  1. Grammar (G) — tense usage, agreement, sentence structure
  2. Vocabulary (V) — range, appropriateness, idiomatic expressions
  3. Fluency (F) — speech flow, pacing, hesitation markers
  4. Pronunciation (P) — estimated from transcript patterns
  5. Coherence (C) — logical organization, discourse markers
  6. Interaction (I) — prompt engagement, idea communication
- Added `inputLevel` parameter support
- Response now includes `dimensions` object with score (0-100) and feedback for each dimension
- Added validation for dimensions structure with fallback defaults

## Build & Lint Status
- ✅ `npx next build` — successful
- ✅ `npx eslint` on modified files — no errors
- ✅ Dev server running on port 3000
