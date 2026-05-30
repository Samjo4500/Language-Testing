'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import AdaptiveLearningPath, { Milestone } from '@/components/AdaptiveLearningPath';

const MOCK_MILESTONES: Milestone[] = [
  {
    id: 'a1-basics',
    title: 'English Foundations',
    description: 'Master basic greetings, introductions, and everyday phrases. Build a foundation of 200+ essential words.',
    cefrLevel: 'A1',
    status: 'completed',
    icon: 'book',
    estimatedMinutes: 120,
    skills: ['Vocabulary', 'Speaking'],
  },
  {
    id: 'a1-survival',
    title: 'Survival English',
    description: 'Navigate daily situations — shopping, directions, ordering food, and asking for help.',
    cefrLevel: 'A1',
    status: 'completed',
    icon: 'target',
    estimatedMinutes: 90,
    skills: ['Listening', 'Speaking'],
  },
  {
    id: 'a2-everyday',
    title: 'Everyday Communication',
    description: 'Express opinions, describe experiences, and handle routine social interactions with confidence.',
    cefrLevel: 'A2',
    status: 'completed',
    icon: 'message',
    estimatedMinutes: 150,
    skills: ['Reading', 'Writing', 'Speaking'],
  },
  {
    id: 'b1-bridge',
    title: 'The Intermediate Bridge',
    description: 'Transition to independent communication. Discuss familiar topics, narrate events, and explain viewpoints.',
    cefrLevel: 'B1',
    status: 'in-progress',
    icon: 'sparkles',
    estimatedMinutes: 180,
    skills: ['Grammar', 'Vocabulary', 'Writing'],
  },
  {
    id: 'b2-fluency',
    title: 'Fluent Interaction',
    description: 'Interact with fluency and spontaneity. Handle complex discussions and understand nuanced texts.',
    cefrLevel: 'B2',
    status: 'locked',
    icon: 'brain',
    estimatedMinutes: 200,
    skills: ['Reading', 'Listening', 'Speaking'],
  },
  {
    id: 'c1-advanced',
    title: 'Advanced Proficiency',
    description: 'Use language flexibly for academic, professional, and creative purposes. Master complex grammar patterns.',
    cefrLevel: 'C1',
    status: 'locked',
    icon: 'zap',
    estimatedMinutes: 240,
    skills: ['Grammar', 'Writing', 'Vocabulary'],
  },
  {
    id: 'c2-mastery',
    title: 'Near-Native Mastery',
    description: 'Understand virtually everything heard or read. Express yourself spontaneously with precision and nuance.',
    cefrLevel: 'C2',
    status: 'locked',
    icon: 'award',
    estimatedMinutes: 300,
    skills: ['Reading', 'Listening', 'Speaking', 'Writing'],
  },
];

const MOCK_SKILL_LEVELS: Record<string, number> = {
  Grammar: 55,
  Vocabulary: 62,
  Reading: 70,
  Listening: 48,
  Speaking: 45,
  Writing: 58,
};

export default function PathPage() {
  const [milestones, setMilestones] = useState(MOCK_MILESTONES);

  const handleStartMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return { ...m, status: 'in-progress' as const };
        }
        return m;
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Learning Path</h1>
            <p className="text-white/50">A personalized roadmap from A1 to C2, adapted to your skill levels</p>
          </div>
          <AdaptiveLearningPath
            milestones={milestones}
            currentMilestoneId="b1-bridge"
            skillLevels={MOCK_SKILL_LEVELS}
            onStartMilestone={handleStartMilestone}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
