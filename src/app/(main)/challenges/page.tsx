'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import CommunityChallenges, { Challenge } from '@/components/CommunityChallenges';

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'ch-d1',
    title: 'Word of the Day',
    description: 'Learn and use the daily vocabulary word in a sentence. Build your active vocabulary one word at a time.',
    type: 'daily',
    goal: 5,
    currentProgress: 3,
    participants: 245,
    xpReward: 75,
    deadline: 'Ends today',
    category: 'Vocabulary',
  },
  {
    id: 'ch-d2',
    title: 'Grammar Fix',
    description: 'Identify and correct grammar errors in 3 short passages. Sharpen your eye for common mistakes.',
    type: 'daily',
    goal: 3,
    currentProgress: 0,
    participants: 189,
    xpReward: 50,
    deadline: 'Ends today',
    category: 'Grammar',
  },
  {
    id: 'ch-w1',
    title: 'Conversation Starter',
    description: 'Complete 5 speaking sessions this week. Practice makes perfect — build your confidence one chat at a time.',
    type: 'weekly',
    goal: 5,
    currentProgress: 2,
    participants: 412,
    xpReward: 200,
    deadline: '5 days left',
    category: 'Speaking',
  },
  {
    id: 'ch-w2',
    title: 'Reading Marathon',
    description: 'Read 10 articles or passages and answer comprehension questions. Expand your reading fluency.',
    type: 'weekly',
    goal: 10,
    currentProgress: 4,
    participants: 328,
    xpReward: 300,
    deadline: '5 days left',
    category: 'Reading',
  },
  {
    id: 'ch-w3',
    title: 'Write & Reflect',
    description: 'Write 3 short essays on given prompts. Get AI-powered feedback on grammar, vocabulary, and coherence.',
    type: 'weekly',
    goal: 3,
    currentProgress: 1,
    participants: 156,
    xpReward: 250,
    deadline: '5 days left',
    category: 'Writing',
  },
  {
    id: 'ch-m1',
    title: 'Level Up Challenge',
    description: 'Complete all skill assessments and improve your overall CEFR score by at least one sub-level this month.',
    type: 'monthly',
    goal: 6,
    currentProgress: 2,
    participants: 578,
    xpReward: 1000,
    deadline: '18 days left',
    category: 'Assessment',
  },
  {
    id: 'ch-m2',
    title: 'Community Contributor',
    description: 'Help 10 fellow learners by participating in discussions, providing feedback, and sharing study tips.',
    type: 'monthly',
    goal: 10,
    currentProgress: 3,
    participants: 234,
    xpReward: 500,
    deadline: '18 days left',
    category: 'Community',
  },
];

export default function ChallengesPage() {
  const [userProgress, setUserProgress] = useState<Record<string, number>>({
    'ch-d1': 3,
    'ch-d2': 0,
    'ch-w1': 2,
    'ch-w2': 4,
    'ch-w3': 1,
    'ch-m1': 2,
    'ch-m2': 3,
  });

  const handleJoin = (id: string) => {
    setUserProgress((prev) => ({
      ...prev,
      [id]: prev[id] ?? 0,
    }));
  };

  const handleContribute = (id: string, amount: number) => {
    setUserProgress((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + amount,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Community Challenges</h1>
            <p className="text-white/50">Compete with fellow learners, earn XP, and level up together</p>
          </div>
          <CommunityChallenges
            challenges={MOCK_CHALLENGES}
            userProgress={userProgress}
            onJoin={handleJoin}
            onContribute={handleContribute}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
