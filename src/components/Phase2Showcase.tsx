'use client';

import React, { useCallback } from 'react';
import { TrendingUp, Mic, PenTool } from 'lucide-react';
import AdaptiveLearningPath, { type Milestone } from '@/components/AdaptiveLearningPath';
import SpeechAnalyticsDashboard, { type SpeakingSession } from '@/components/SpeechAnalyticsDashboard';
import AIWritingEditor, { type AnalysisResult } from '@/components/AIWritingEditor';

/* ═══════════════ Mock Data ═══════════════ */

const MOCK_MILESTONES: Milestone[] = [
  {
    id: 'a1-foundations',
    title: 'A1 Foundations',
    description: 'Master basic greetings, introductions, and simple phrases for everyday situations.',
    cefrLevel: 'A1',
    status: 'completed',
    icon: 'book',
    estimatedMinutes: 45,
    skills: ['Greetings', 'Numbers', 'Basic Phrases'],
  },
  {
    id: 'a1-survival',
    title: 'A1 Survival English',
    description: 'Learn essential vocabulary for shopping, ordering food, and asking directions.',
    cefrLevel: 'A1',
    status: 'completed',
    icon: 'target',
    estimatedMinutes: 60,
    skills: ['Shopping', 'Food', 'Directions'],
  },
  {
    id: 'a2-everyday',
    title: 'A2 Everyday Communication',
    description: 'Handle routine social interactions and describe your background and environment.',
    cefrLevel: 'A2',
    status: 'completed',
    icon: 'message',
    estimatedMinutes: 75,
    skills: ['Small Talk', 'Past Tense', 'Descriptions'],
  },
  {
    id: 'b1-intermediate',
    title: 'B1 Intermediate Bridge',
    description: 'Express opinions, narrate events, and handle most travel situations with confidence.',
    cefrLevel: 'B1',
    status: 'in-progress',
    icon: 'trending',
    estimatedMinutes: 90,
    skills: ['Opinions', 'Narration', 'Travel English'],
  },
  {
    id: 'b1-writing',
    title: 'B1 Writing Foundation',
    description: 'Write connected text on familiar topics and compose simple formal emails.',
    cefrLevel: 'B1',
    status: 'available',
    icon: 'pen',
    estimatedMinutes: 80,
    skills: ['Email Writing', 'Paragraphs', 'Connectors'],
  },
  {
    id: 'b2-fluency',
    title: 'B2 Fluency Builder',
    description: 'Interact with a degree of fluency and spontaneity with native speakers.',
    cefrLevel: 'B2',
    status: 'locked',
    icon: 'zap',
    estimatedMinutes: 120,
    skills: ['Debate', 'Abstract Topics', 'Nuance'],
  },
  {
    id: 'c1-advanced',
    title: 'C1 Advanced Mastery',
    description: 'Express ideas fluently and spontaneously for social and professional purposes.',
    cefrLevel: 'C1',
    status: 'locked',
    icon: 'brain',
    estimatedMinutes: 150,
    skills: ['Academic Writing', 'Presentations', 'Idioms'],
  },
  {
    id: 'c2-proficiency',
    title: 'C2 Proficiency',
    description: 'Understand virtually everything heard or read with near-native precision.',
    cefrLevel: 'C2',
    status: 'locked',
    icon: 'award',
    estimatedMinutes: 180,
    skills: ['Literary Analysis', 'Subtle Nuance', 'Expert Discourse'],
  },
];

const MOCK_SKILL_LEVELS: Record<string, number> = {
  Grammar: 68,
  Vocabulary: 55,
  Reading: 72,
  Listening: 60,
  Speaking: 45,
  Writing: 50,
};

const MOCK_SESSIONS: SpeakingSession[] = [
  {
    id: 's1', date: '2025-05-20', duration: 120, score: 45, wordsPerMinute: 78, pauseCount: 18,
    topics: ['Introductions', 'Hobbies'],
    errors: [{ phoneme: 'th', count: 8 }, { phoneme: 'r', count: 5 }, { phoneme: 'v', count: 3 }],
  },
  {
    id: 's2', date: '2025-05-22', duration: 150, score: 52, wordsPerMinute: 85, pauseCount: 15,
    topics: ['Travel', 'Food'],
    errors: [{ phoneme: 'th', count: 6 }, { phoneme: 'l', count: 4 }, { phoneme: 'sh', count: 3 }],
  },
  {
    id: 's3', date: '2025-05-25', duration: 180, score: 58, wordsPerMinute: 92, pauseCount: 12,
    topics: ['Work', 'Education'],
    errors: [{ phoneme: 'th', count: 5 }, { phoneme: 'r', count: 4 }, { phoneme: 'ng', count: 2 }],
  },
  {
    id: 's4', date: '2025-05-28', duration: 160, score: 63, wordsPerMinute: 98, pauseCount: 10,
    topics: ['Technology', 'Health'],
    errors: [{ phoneme: 'th', count: 4 }, { phoneme: 'ch', count: 3 }, { phoneme: 'ae', count: 2 }],
  },
  {
    id: 's5', date: '2025-06-01', duration: 200, score: 67, wordsPerMinute: 105, pauseCount: 9,
    topics: ['Environment', 'Culture'],
    errors: [{ phoneme: 'th', count: 3 }, { phoneme: 'str', count: 2 }, { phoneme: 'er', count: 3 }],
  },
  {
    id: 's6', date: '2025-06-04', duration: 170, score: 71, wordsPerMinute: 110, pauseCount: 8,
    topics: ['News', 'Opinions'],
    errors: [{ phoneme: 'th', count: 3 }, { phoneme: 'r', count: 2 }, { phoneme: 'ih', count: 2 }],
  },
  {
    id: 's7', date: '2025-06-07', duration: 190, score: 74, wordsPerMinute: 115, pauseCount: 7,
    topics: ['Science', 'Future'],
    errors: [{ phoneme: 'th', count: 2 }, { phoneme: 'pr', count: 2 }, { phoneme: 'aw', count: 1 }],
  },
  {
    id: 's8', date: '2025-06-10', duration: 180, score: 76, wordsPerMinute: 118, pauseCount: 6,
    topics: ['Society', 'Philosophy'],
    errors: [{ phoneme: 'th', count: 2 }, { phoneme: 'st', count: 1 }, { phoneme: 'oh', count: 2 }],
  },
];

const MOCK_OVERALL_SCORE = 76;

const INITIAL_WRITING_TEXT = `Learning a new language is one of the most rewarding experience a person can have. It opens doors to new cultures, ways of thinking, and opportunities that would otherwise remain close.

When I first started learning English, I was very nervious. I was worry about making mistakes and sounding foolish. But over time, I realized that making mistakes is a natural part of the learning process. Every error I made was a chance to improve and grow.

The most important thing I learned is that consistency is more important than intensity. Studying for twenty minutes every day is much more effective than studying for three hours once a week. This is because the brain needs regular repetition to form new neural pathways and consolidate memories.

I also discovered that immersion is key. Watching movies, listening to podcasts, and reading books in English has helped me tremendously. Even if I don't understand everything, the exposure to the language helps my brain absorb patterns naturally.`;

/* ═══════════════ Mock Analyze Function ═══════════════ */
async function mockAnalyze(text: string): Promise<AnalysisResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const words = text.split(/\s+/);
  const wordCount = words.length;

  // Build highlights from text analysis
  const highlights: AnalysisResult['highlights'] = [];

  // Find "experience" (should be "experiences") - Grammar
  const expIdx = text.indexOf('experience a person');
  if (expIdx !== -1) {
    highlights.push({ start: expIdx, end: expIdx + 10, type: 'Grammar', suggestion: 'experiences' });
  }

  // Find "close" (should be "closed") - Vocabulary
  const closeIdx = text.indexOf('remain close');
  if (closeIdx !== -1) {
    highlights.push({ start: closeIdx + 7, end: closeIdx + 12, type: 'Vocabulary', suggestion: 'closed' });
  }

  // Find "nervious" (should be "nervous") - Grammar
  const nervIdx = text.indexOf('nervious');
  if (nervIdx !== -1) {
    highlights.push({ start: nervIdx, end: nervIdx + 8, type: 'Grammar', suggestion: 'nervous' });
  }

  // Find "I was worry" (should be "I was worried") - Grammar
  const worryIdx = text.indexOf('worry about');
  if (worryIdx !== -1) {
    highlights.push({ start: worryIdx, end: worryIdx + 5, type: 'Grammar', suggestion: 'worried' });
  }

  // Find "twenty minutes" - could be "20 minutes" - Style
  const twentyIdx = text.indexOf('twenty minutes');
  if (twentyIdx !== -1) {
    highlights.push({ start: twentyIdx, end: twentyIdx + 6, type: 'Style', suggestion: '20' });
  }

  // Find "three hours" - could be "3 hours" - Style
  const threeIdx = text.indexOf('three hours');
  if (threeIdx !== -1) {
    highlights.push({ start: threeIdx, end: threeIdx + 5, type: 'Style', suggestion: '3' });
  }

  // Find sentence starting with "When I first" - Coherence (transition suggestion)
  const whenIdx = text.indexOf('When I first');
  if (whenIdx !== -1) {
    highlights.push({ start: whenIdx, end: whenIdx + 4, type: 'Coherence', suggestion: 'Initially, when I' });
  }

  // Find "tremendously" - Vocabulary (more precise word)
  const tremIdx = text.indexOf('tremendously');
  if (tremIdx !== -1) {
    highlights.push({ start: tremIdx, end: tremIdx + 12, type: 'Vocabulary', suggestion: 'significantly' });
  }

  const grammarScore = Math.max(40, 90 - highlights.filter(h => h.type === 'Grammar').length * 8);
  const vocabScore = Math.max(45, 85 - highlights.filter(h => h.type === 'Vocabulary').length * 10);
  const coherenceScore = Math.max(50, 88 - highlights.filter(h => h.type === 'Coherence').length * 12);
  const styleScore = Math.max(55, 92 - highlights.filter(h => h.type === 'Style').length * 6);
  const overall = Math.round((grammarScore + vocabScore + coherenceScore + styleScore) / 4);

  let cefrEstimate = 'A2';
  if (overall >= 85) cefrEstimate = 'C1';
  else if (overall >= 75) cefrEstimate = 'B2';
  else if (overall >= 60) cefrEstimate = 'B1';
  else if (overall >= 45) cefrEstimate = 'A2';

  if (wordCount > 150) {
    const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIdx = cefrLevels.indexOf(cefrEstimate);
    if (currentIdx < cefrLevels.length - 1) cefrEstimate = cefrLevels[currentIdx + 1];
  }

  return {
    overallScore: overall,
    cefrEstimate,
    categories: [
      {
        name: 'Grammar',
        score: grammarScore,
        suggestions: [
          ...(expIdx !== -1 ? [{ original: 'experience', suggested: 'experiences', reason: '"One of the most" requires a plural noun. Use "experiences" instead of "experience".', category: 'Grammar' }] : []),
          ...(nervIdx !== -1 ? [{ original: 'nervious', suggested: 'nervous', reason: 'Spelling error: "nervious" is not a word. The correct spelling is "nervous".', category: 'Grammar' }] : []),
          ...(worryIdx !== -1 ? [{ original: 'worry', suggested: 'worried', reason: 'After "was", use the past participle "worried" instead of the base form "worry".', category: 'Grammar' }] : []),
        ],
      },
      {
        name: 'Vocabulary',
        score: vocabScore,
        suggestions: [
          ...(closeIdx !== -1 ? [{ original: 'close', suggested: 'closed', reason: '"Closed" (adjective) is more precise here than "close" to describe doors/opportunities that are shut.', category: 'Vocabulary' }] : []),
          ...(tremIdx !== -1 ? [{ original: 'tremendously', suggested: 'significantly', reason: '"Significantly" is more precise and commonly used in academic/formal contexts than "tremendously".', category: 'Vocabulary' }] : []),
        ],
      },
      {
        name: 'Coherence',
        score: coherenceScore,
        suggestions: [
          ...(whenIdx !== -1 ? [{ original: 'When', suggested: 'Initially, when I', reason: 'Adding a transition word improves paragraph flow and signals a shift from general statement to personal narrative.', category: 'Coherence' }] : []),
        ],
      },
      {
        name: 'Style',
        score: styleScore,
        suggestions: [
          ...(twentyIdx !== -1 ? [{ original: 'twenty', suggested: '20', reason: 'In formal writing, numbers under 10 are spelled out, but measurements and quantities (like "20 minutes") are typically written as numerals for clarity.', category: 'Style' }] : []),
          ...(threeIdx !== -1 ? [{ original: 'three', suggested: '3', reason: 'For consistency with other numerical quantities in the text, use the numeral "3" instead of "three".', category: 'Style' }] : []),
        ],
      },
    ],
    highlights,
  };
}

/* ═══════════════ Main Showcase ═══════════════ */
export default function Phase2Showcase() {
  const handleStartMilestone = useCallback((_id: string) => {
    // Placeholder: connect to your API
  }, []);

  const handleAnalyze = useCallback(async (text: string) => {
    return mockAnalyze(text);
  }, []);

  const handleSave = useCallback((_text: string) => {
    // Placeholder: connect to your API
  }, []);

  return (
    <div className="space-y-20">
      {/* ── Adaptive Learning Path ── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[400px] h-[400px] top-1/4 -left-24 animate-float-slow" />
          <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 right-0 animate-float-reverse" />
        </div>
        <div className="container relative mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-4 py-1.5 mb-4">
              <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs text-cyan-300 font-medium uppercase tracking-wider">Phase 2</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Adaptive Learning Path</h2>
            <p className="mt-3 text-white/40 max-w-xl mx-auto text-sm">
              A personalized roadmap from A1 to C2, adapting to your skill profile in real-time.
            </p>
          </div>
          <div className="glass-card p-6 md:p-8">
            <AdaptiveLearningPath
              milestones={MOCK_MILESTONES}
              currentMilestoneId="b1-intermediate"
              skillLevels={MOCK_SKILL_LEVELS}
              onStartMilestone={handleStartMilestone}
            />
          </div>
        </div>
      </section>

      {/* ── Speech Analytics Dashboard ── */}
      <section className="relative py-16 md:py-24 dark-section-alt hero-pattern noise-overlay overflow-hidden">
        <div className="container relative mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 mb-4">
              <Mic className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">Phase 2</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Speech Analytics</h2>
            <p className="mt-3 text-white/40 max-w-xl mx-auto text-sm">
              Deep-dive into your pronunciation, fluency, and phoneme accuracy with AI-powered insights.
            </p>
          </div>
          <div className="glass-card p-6 md:p-8">
            <SpeechAnalyticsDashboard
              sessions={MOCK_SESSIONS}
              overallScore={MOCK_OVERALL_SCORE}
            />
          </div>
        </div>
      </section>

      {/* ── AI Writing Editor ── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-violet w-[400px] h-[400px] top-1/3 right-0 animate-float-slow" />
          <div className="orb orb-blue w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>
        <div className="container relative mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 px-4 py-1.5 mb-4">
              <PenTool className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Phase 2</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">AI Writing Editor</h2>
            <p className="mt-3 text-white/40 max-w-xl mx-auto text-sm">
              Write with confidence. Get instant AI feedback on grammar, vocabulary, coherence, and style.
            </p>
          </div>
          <div className="glass-card p-6 md:p-8">
            <AIWritingEditor
              initialText={INITIAL_WRITING_TEXT}
              onAnalyze={handleAnalyze}
              onSave={handleSave}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
