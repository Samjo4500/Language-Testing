'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import SpeechAnalyticsDashboard, { SpeakingSession } from '@/components/SpeechAnalyticsDashboard';

const MOCK_SESSIONS: SpeakingSession[] = [
  {
    id: 's1',
    date: '2025-03-01T10:30:00Z',
    duration: 120,
    score: 52,
    wordsPerMinute: 85,
    pauseCount: 18,
    topics: ['Travel', 'Daily Life'],
    errors: [
      { phoneme: 'th', count: 8 },
      { phoneme: 'r', count: 5 },
      { phoneme: 'v', count: 3 },
    ],
  },
  {
    id: 's2',
    date: '2025-03-02T14:00:00Z',
    duration: 180,
    score: 58,
    wordsPerMinute: 92,
    pauseCount: 14,
    topics: ['Business', 'Technology'],
    errors: [
      { phoneme: 'th', count: 6 },
      { phoneme: 'l', count: 4 },
      { phoneme: 'sh', count: 3 },
    ],
  },
  {
    id: 's3',
    date: '2025-03-03T09:15:00Z',
    duration: 90,
    score: 63,
    wordsPerMinute: 98,
    pauseCount: 11,
    topics: ['Academic'],
    errors: [
      { phoneme: 'th', count: 4 },
      { phoneme: 'r', count: 3 },
      { phoneme: 'ng', count: 2 },
    ],
  },
  {
    id: 's4',
    date: '2025-03-04T16:45:00Z',
    duration: 150,
    score: 67,
    wordsPerMinute: 105,
    pauseCount: 9,
    topics: ['Culture', 'Daily Life'],
    errors: [
      { phoneme: 'th', count: 3 },
      { phoneme: 'v', count: 2 },
      { phoneme: 'z', count: 2 },
    ],
  },
  {
    id: 's5',
    date: '2025-03-05T11:00:00Z',
    duration: 200,
    score: 72,
    wordsPerMinute: 112,
    pauseCount: 7,
    topics: ['Business', 'Travel'],
    errors: [
      { phoneme: 'th', count: 2 },
      { phoneme: 'r', count: 2 },
    ],
  },
  {
    id: 's6',
    date: '2025-03-06T13:30:00Z',
    duration: 160,
    score: 75,
    wordsPerMinute: 118,
    pauseCount: 6,
    topics: ['Academic', 'Technology'],
    errors: [
      { phoneme: 'th', count: 2 },
      { phoneme: 'ch', count: 1 },
    ],
  },
];

export default function SpeakingAnalyticsPage() {
  const overallScore = 68;

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Speaking Analytics</h1>
            <p className="text-white/50">Deep insights into your pronunciation, fluency, and speaking progress</p>
          </div>
          <SpeechAnalyticsDashboard
            sessions={MOCK_SESSIONS}
            overallScore={overallScore}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
