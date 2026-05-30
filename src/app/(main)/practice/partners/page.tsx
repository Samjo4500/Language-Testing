'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import PeerMatching, { PeerUser } from '@/components/PeerMatching';

const MOCK_ONLINE_USERS: PeerUser[] = [
  {
    id: 'u1',
    name: 'Maria G.',
    avatar: 'MG',
    cefrLevel: 'B2',
    nativeLanguage: 'Spanish',
    targetLanguage: 'English',
    isOnline: true,
    compatibilityScore: 92,
  },
  {
    id: 'u2',
    name: 'Kenji T.',
    avatar: 'KT',
    cefrLevel: 'B1',
    nativeLanguage: 'Japanese',
    targetLanguage: 'English',
    isOnline: true,
    compatibilityScore: 85,
  },
  {
    id: 'u3',
    name: 'Sophie L.',
    avatar: 'SL',
    cefrLevel: 'C1',
    nativeLanguage: 'French',
    targetLanguage: 'English',
    isOnline: true,
    compatibilityScore: 78,
  },
  {
    id: 'u4',
    name: 'Marco R.',
    avatar: 'MR',
    cefrLevel: 'A2',
    nativeLanguage: 'Italian',
    targetLanguage: 'English',
    isOnline: false,
    compatibilityScore: 65,
  },
  {
    id: 'u5',
    name: 'Yuki A.',
    avatar: 'YA',
    cefrLevel: 'B1',
    nativeLanguage: 'Korean',
    targetLanguage: 'English',
    isOnline: true,
    compatibilityScore: 88,
  },
  {
    id: 'u6',
    name: 'Hans W.',
    avatar: 'HW',
    cefrLevel: 'B2',
    nativeLanguage: 'German',
    targetLanguage: 'English',
    isOnline: false,
    compatibilityScore: 72,
  },
];

export default function PracticePartnersPage() {
  const [currentMatch, setCurrentMatch] = useState<PeerUser | null>(null);

  const handleFindMatch = () => {
    // Simulate finding a match after a brief delay
    setTimeout(() => {
      const onlineUsers = MOCK_ONLINE_USERS.filter((u) => u.isOnline);
      const match = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
      if (match) setCurrentMatch(match);
    }, 2000);
  };

  const handleStartCall = (userId: string) => {
    const user = MOCK_ONLINE_USERS.find((u) => u.id === userId);
    if (user) setCurrentMatch(user);
  };

  const handleEndCall = () => {
    setCurrentMatch(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Practice Partners</h1>
            <p className="text-white/50">Find language partners at your level and practice together</p>
          </div>
          <PeerMatching
            onlineUsers={MOCK_ONLINE_USERS}
            currentMatch={currentMatch}
            onFindMatch={handleFindMatch}
            onStartCall={handleStartCall}
            onEndCall={handleEndCall}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
