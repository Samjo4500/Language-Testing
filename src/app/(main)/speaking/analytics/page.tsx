'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import SpeechAnalyticsDashboard, { SpeakingSession } from '@/components/SpeechAnalyticsDashboard';

const MOCK_SESSIONS: SpeakingSession[] = [
  {
    id: 's1',
    date: '2026-05-30',
    duration: 420,
    score: 72,
    wordsPerMinute: 118,
    pauseCount: 8,
    topics: ['Travel', 'Food'],
    errors: [
      { phoneme: 'th', count: 3 },
      { phoneme: 'r', count: 2 },
    ],
  },
  {
    id: 's2',
    date: '2026-05-28',
    duration: 360,
    score: 68,
    wordsPerMinute: 112,
    pauseCount: 11,
    topics: ['Work', 'Technology'],
    errors: [
      { phoneme: 'v', count: 4 },
      { phoneme: 'th', count: 2 },
    ],
  },
  {
    id: 's3',
    date: '2026-05-25',
    duration: 540,
    score: 75,
    wordsPerMinute: 124,
    pauseCount: 6,
    topics: ['Education', 'Hobbies'],
    errors: [
      { phoneme: 'l', count: 1 },
      { phoneme: 'th', count: 2 },
    ],
  },
  {
    id: 's4',
    date: '2026-05-22',
    duration: 300,
    score: 63,
    wordsPerMinute: 105,
    pauseCount: 14,
    topics: ['Health'],
    errors: [
      { phoneme: 'r', count: 5 },
      { phoneme: 'th', count: 4 },
    ],
  },
  {
    id: 's5',
    date: '2026-05-18',
    duration: 480,
    score: 70,
    wordsPerMinute: 115,
    pauseCount: 9,
    topics: ['Culture', 'Music'],
    errors: [
      { phoneme: 'v', count: 2 },
      { phoneme: 'w', count: 3 },
    ],
  },
];

export default function SpeakingAnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Speech Analytics</h1>
            <p className="text-white/50">Track your pronunciation, fluency, and speaking progress over time</p>
          </div>
          <SpeechAnalyticsDashboard sessions={MOCK_SESSIONS} overallScore={70} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
