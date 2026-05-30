'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import GamificationDashboard from '@/components/GamificationDashboard';

export default function ProgressPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Progress</h1>
            <p className="text-white/50">Track your XP, streaks, badges, and achievements</p>
          </div>
          <GamificationDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
