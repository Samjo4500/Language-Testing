'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import SmartEmailDigest, { DigestSettings } from '@/components/SmartEmailDigest';

const DEFAULT_SETTINGS: DigestSettings = {
  weeklyProgress: true,
  streakReminder: true,
  milestoneAlert: true,
  recommendations: false,
  communityUpdate: false,
  monthlyDeepDive: false,
  preferredDay: 'Monday',
  preferredTime: '8:00 AM',
};

export default function DigestsPage() {
  const [settings, setSettings] = useState<DigestSettings>(DEFAULT_SETTINGS);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Email Digests</h1>
            <p className="text-white/50">Configure smart email notifications for your learning journey</p>
          </div>
          <SmartEmailDigest
            settings={settings}
            onUpdate={setSettings}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
