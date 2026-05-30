'use client';

import { useState, useCallback } from 'react';
import {
  Users, Trophy, Wifi, Mail, Mic,
  ChevronRight, Sparkles
} from 'lucide-react';
import PeerMatching, { type PeerUser, type MatchFilters } from '@/components/PeerMatching';
import CommunityChallenges, { type Challenge } from '@/components/CommunityChallenges';
import PWAOfflineMode, { type OfflineContent } from '@/components/PWAOfflineMode';
import SmartEmailDigest, { type DigestSettings } from '@/components/SmartEmailDigest';
import LexiSpeakingPractice, { type SpeakingResult } from '@/components/LexiSpeakingPractice';

/* ── Mock Data ─────────────────────────────────── */
const MOCK_ONLINE_USERS: PeerUser[] = [
  { id: 'u1', name: 'Maria García', avatar: '', cefrLevel: 'B2', nativeLanguage: 'Spanish', targetLanguage: 'English', isOnline: true, compatibilityScore: 92 },
  { id: 'u2', name: 'Kenji Tanaka', avatar: '', cefrLevel: 'B1', nativeLanguage: 'Japanese', targetLanguage: 'English', isOnline: true, compatibilityScore: 87 },
  { id: 'u3', name: 'Sophie Laurent', avatar: '', cefrLevel: 'C1', nativeLanguage: 'French', targetLanguage: 'English', isOnline: true, compatibilityScore: 78 },
  { id: 'u4', name: 'Ahmed Malik', avatar: '', cefrLevel: 'A2', nativeLanguage: 'Arabic', targetLanguage: 'English', isOnline: false, compatibilityScore: 65 },
  { id: 'u5', name: 'Yuki Sato', avatar: '', cefrLevel: 'B2', nativeLanguage: 'Japanese', targetLanguage: 'English', isOnline: true, compatibilityScore: 89 },
  { id: 'u6', name: 'Carlos Silva', avatar: '', cefrLevel: 'A1', nativeLanguage: 'Portuguese', targetLanguage: 'English', isOnline: false, compatibilityScore: 58 },
];

const MOCK_CHALLENGES: Challenge[] = [
  { id: 'ch1', title: 'Vocabulary Blitz', description: 'Learn 50 new words in a day. Complete vocabulary exercises to rack up points.', type: 'daily', goal: 50, currentProgress: 32, participants: 1284, xpReward: 100, deadline: '8h left', category: 'Vocabulary' },
  { id: 'ch2', title: 'Grammar Perfect', description: 'Complete 20 grammar exercises with 90%+ accuracy.', type: 'daily', goal: 20, currentProgress: 14, participants: 856, xpReward: 80, deadline: '8h left', category: 'Grammar' },
  { id: 'ch3', title: 'Reading Marathon', description: 'Read 5 full articles and answer comprehension questions.', type: 'weekly', goal: 5, currentProgress: 2, participants: 3420, xpReward: 300, deadline: '4 days left', category: 'Reading' },
  { id: 'ch4', title: 'Speaking Streak', description: 'Complete speaking practice for 5 consecutive days.', type: 'weekly', goal: 5, currentProgress: 3, participants: 2100, xpReward: 250, deadline: '4 days left', category: 'Speaking' },
  { id: 'ch5', title: 'CEFR Level Up', description: 'Improve your overall CEFR score by completing assessments across all skills.', type: 'monthly', goal: 4, currentProgress: 1, participants: 8900, xpReward: 1000, deadline: '18 days left', category: 'Assessment' },
  { id: 'ch6', title: 'Community Champion', description: 'Help 10 community members by answering questions and giving feedback.', type: 'monthly', goal: 10, currentProgress: 3, participants: 5640, xpReward: 750, deadline: '18 days left', category: 'Community' },
];

const MOCK_OFFLINE_CONTENT: OfflineContent[] = [
  { id: 'oc1', title: 'B1 Essential Vocabulary', type: 'vocabulary', size: 12, downloadedAt: '2 days ago', lastSyncedAt: '1 hour ago' },
  { id: 'oc2', title: 'Travel English Pack', type: 'lesson', size: 24, downloadedAt: '5 days ago', lastSyncedAt: '3 hours ago' },
  { id: 'oc3', title: 'Listening Practice A2', type: 'audio', size: 45, downloadedAt: '1 week ago', lastSyncedAt: 'Yesterday' },
];

const INITIAL_DIGEST_SETTINGS: DigestSettings = {
  weeklyProgress: true,
  streakReminder: true,
  milestoneAlert: true,
  recommendations: false,
  communityUpdate: true,
  monthlyDeepDive: false,
  preferredDay: 'Monday',
  preferredTime: '8:00 AM',
};

/* ── Section Config ────────────────────────────── */
const SECTIONS = [
  { key: 'peer', label: 'Peer Matching', icon: <Users className="h-4 w-4" />, gradient: 'from-cyan-400 to-blue-500' },
  { key: 'challenges', label: 'Challenges', icon: <Trophy className="h-4 w-4" />, gradient: 'from-blue-400 to-indigo-500' },
  { key: 'offline', label: 'Offline Mode', icon: <Wifi className="h-4 w-4" />, gradient: 'from-indigo-400 to-purple-500' },
  { key: 'email', label: 'Email Digest', icon: <Mail className="h-4 w-4" />, gradient: 'from-purple-400 to-violet-500' },
  { key: 'speaking', label: 'Speaking Practice', icon: <Mic className="h-4 w-4" />, gradient: 'from-violet-400 to-blue-500' },
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

/* ── Main Component ────────────────────────────── */
export default function Phase3Page() {
  const [activeSection, setActiveSection] = useState<SectionKey>('peer');
  const [currentMatch, setCurrentMatch] = useState<PeerUser | null>(null);
  const [digestSettings, setDigestSettings] = useState<DigestSettings>(INITIAL_DIGEST_SETTINGS);
  const [isOnline] = useState(true);
  const [storageUsed] = useState(324);
  const [storageTotal] = useState(1024);

  // PeerMatching handlers
  const handleFindMatch = useCallback((filters: MatchFilters) => {
    // Simulate finding a match after a delay
    setTimeout(() => {
      const match = MOCK_ONLINE_USERS.find(u => u.isOnline) ?? null;
      setCurrentMatch(match);
    }, 2000);
  }, []);

  const handleStartCall = useCallback((_userId: string) => {
    // Call started
  }, []);

  const handleEndCall = useCallback(() => {
    setCurrentMatch(null);
  }, []);

  // Challenges handlers
  const handleJoinChallenge = useCallback((_id: string) => {
    // Joined challenge
  }, []);

  const handleContributeChallenge = useCallback((_id: string, _amount: number) => {
    // Contributed to challenge
  }, []);

  // Offline handlers
  const handleDownload = useCallback((_id: string) => {
    // Download content
  }, []);

  const handleSync = useCallback(() => {
    // Sync data
  }, []);

  // Speaking handlers
  const handleSessionComplete = useCallback((_results: SpeakingResult[]) => {
    // Session complete
  }, []);

  const userProgress: Record<string, number> = {
    ch1: 32, ch2: 14, ch3: 2, ch4: 3, ch5: 1, ch6: 3,
  };

  return (
    <section className="relative py-20 md:py-28 bg-[#0F0A1E] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-blue w-[500px] h-[500px] top-0 left-0 animate-float-slow" />
        <div className="orb orb-violet w-[400px] h-[400px] bottom-0 right-0 animate-float-reverse" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* ── Section Header ──────────────── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-4 py-1.5 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-xs text-indigo-300 font-medium uppercase tracking-wider">Phase 3 & 4</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Advanced Features
          </h2>
          <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
            Peer matching, community challenges, offline mode, email digests, and AI speaking practice.
          </p>
        </div>

        {/* ── Tab Navigation ──────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 custom-scrollbar justify-center flex-wrap">
          {SECTIONS.map(section => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeSection === section.key
                  ? `bg-gradient-to-r ${section.gradient} text-white shadow-lg`
                  : 'bg-white/[0.04] border border-white/5 text-white/50 hover:text-white/70 hover:border-white/10'
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        {/* ── Content Panels ──────────────── */}
        <div className="max-w-4xl mx-auto">
          {activeSection === 'peer' && (
            <div className="glass-card p-6 animate-fade-in">
              <PeerMatching
                onlineUsers={MOCK_ONLINE_USERS}
                currentMatch={currentMatch}
                onFindMatch={handleFindMatch}
                onStartCall={handleStartCall}
                onEndCall={handleEndCall}
              />
            </div>
          )}

          {activeSection === 'challenges' && (
            <div className="glass-card p-6 animate-fade-in">
              <CommunityChallenges
                challenges={MOCK_CHALLENGES}
                userProgress={userProgress}
                onJoin={handleJoinChallenge}
                onContribute={handleContributeChallenge}
              />
            </div>
          )}

          {activeSection === 'offline' && (
            <div className="glass-card p-6 animate-fade-in">
              <PWAOfflineMode
                isOnline={isOnline}
                downloadedContent={MOCK_OFFLINE_CONTENT}
                onDownload={handleDownload}
                onSync={handleSync}
                storageUsed={storageUsed}
                storageTotal={storageTotal}
              />
            </div>
          )}

          {activeSection === 'email' && (
            <div className="glass-card p-6 animate-fade-in">
              <SmartEmailDigest
                settings={digestSettings}
                onUpdate={setDigestSettings}
              />
            </div>
          )}

          {activeSection === 'speaking' && (
            <div className="glass-card p-6 animate-fade-in">
              <LexiSpeakingPractice
                onSessionComplete={handleSessionComplete}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
