'use client';

import { useState } from 'react';
import {
  Trophy, Flame, Zap, Target, Clock, Users, Award,
  ChevronRight, Star, TrendingUp, CheckCircle2, Lock,
  ArrowUp, Crown, Medal
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

/* ── Types ─────────────────────────────────────── */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  goal: number;
  currentProgress: number;
  participants: number;
  xpReward: number;
  deadline: string;
  category: string;
}

interface CommunityChallengesProps {
  challenges: Challenge[];
  userProgress: Record<string, number>;
  onJoin: (id: string) => void;
  onContribute: (id: string, amount: number) => void;
}

/* ── Constants ─────────────────────────────────── */
const TYPE_CONFIG = {
  daily: {
    label: 'Daily Drill',
    gradient: 'from-cyan-400 to-blue-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-300',
    icon: <Zap className="h-3.5 w-3.5" />,
  },
  weekly: {
    label: 'Weekly Sprint',
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-300',
    icon: <Flame className="h-3.5 w-3.5" />,
  },
  monthly: {
    label: 'Monthly Marathon',
    gradient: 'from-indigo-400 to-purple-500',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-300',
    icon: <Target className="h-3.5 w-3.5" />,
  },
};

const LEADERBOARD = [
  { rank: 1, name: 'Alex M.', score: 2840, avatar: 'A' },
  { rank: 2, name: 'Yuki T.', score: 2650, avatar: 'Y' },
  { rank: 3, name: 'Sofia R.', score: 2480, avatar: 'S' },
  { rank: 4, name: 'Kenji L.', score: 2310, avatar: 'K' },
  { rank: 5, name: 'Maria G.', score: 2190, avatar: 'M' },
];

const COMPLETED_CHALLENGES = [
  { id: 'cc1', title: 'Vocabulary Builder', badge: '🏆', xp: 250, date: 'Mar 1' },
  { id: 'cc2', title: 'Grammar Master', badge: '🎯', xp: 500, date: 'Feb 22' },
  { id: 'cc3', title: 'Speaking Streak', badge: '🔥', xp: 150, date: 'Feb 15' },
];

/* ── Sub-components (declared outside render) ──── */
function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-4 w-4 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-gray-300" />;
  if (rank === 3) return <Medal className="h-4 w-4 text-amber-600" />;
  return <span className="text-xs text-white/30 font-bold">{rank}</span>;
}

function ChallengeCard({
  challenge,
  progress,
  isSelected,
  isConfirming,
  onSelect,
  onJoin,
  onContribute,
  onCancelConfirm,
  onConfirmJoin,
}: {
  challenge: Challenge;
  progress: number;
  isSelected: boolean;
  isConfirming: boolean;
  onSelect: () => void;
  onJoin: () => void;
  onContribute: () => void;
  onCancelConfirm: () => void;
  onConfirmJoin: () => void;
}) {
  const config = TYPE_CONFIG[challenge.type];
  const pct = Math.min(100, Math.round((progress / challenge.goal) * 100));
  const isJoined = progress > 0;

  return (
    <div
      className={`bg-white/[0.02] border rounded-2xl p-5 transition-all cursor-pointer ${
        isSelected ? 'border-cyan-500/30 bg-white/[0.04]' : 'border-white/5 hover:border-white/10'
      }`}
      onClick={onSelect}
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold text-white truncate">{challenge.title}</h4>
            <span className={`inline-flex items-center gap-1 rounded-full ${config.bg} ${config.border} border px-2 py-0.5 text-[10px] font-medium ${config.text}`}>
              {config.label}
            </span>
          </div>
          <p className="text-xs text-white/40 line-clamp-2">{challenge.description}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-white/30">Progress</span>
          <span className="text-xs font-medium text-white/60">{progress}/{challenge.goal} · {pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-[10px] text-white/30 mb-3">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3 w-3" /> {challenge.participants}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {challenge.deadline}
        </span>
        <span className="inline-flex items-center gap-1 text-violet-300">
          <Star className="h-3 w-3" /> {challenge.xpReward} XP
        </span>
      </div>

      {/* Action */}
      {isJoined ? (
        <button
          onClick={e => { e.stopPropagation(); onContribute(); }}
          className="flex items-center gap-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500/20 transition-all cursor-pointer"
        >
          <ArrowUp className="h-3 w-3" /> Contribute
        </button>
      ) : isConfirming ? (
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onConfirmJoin(); }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            <CheckCircle2 className="h-3 w-3" /> Confirm
          </button>
          <button
            onClick={e => { e.stopPropagation(); onCancelConfirm(); }}
            className="flex items-center gap-1.5 rounded-xl bg-white/[0.04] border border-white/10 px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white/70 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={e => { e.stopPropagation(); onJoin(); }}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:from-cyan-500/30 hover:to-blue-600/30 transition-all cursor-pointer"
        >
          <Trophy className="h-3 w-3" /> Join Challenge
        </button>
      )}
    </div>
  );
}

function ChallengeSection({ title, challenges, icon, userProgress, selectedChallenge, confirmJoin, onSelectChallenge, onJoinChallenge, onContributeChallenge, setConfirmJoin }: {
  title: string;
  challenges: Challenge[];
  icon: React.ReactNode;
  userProgress: Record<string, number>;
  selectedChallenge: string | null;
  confirmJoin: string | null;
  onSelectChallenge: (id: string | null) => void;
  onJoinChallenge: (id: string) => void;
  onContributeChallenge: (id: string) => void;
  setConfirmJoin: (id: string | null) => void;
}) {
  if (challenges.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-white/60">{title}</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map(c => (
          <ChallengeCard
            key={c.id}
            challenge={c}
            progress={userProgress[c.id] ?? 0}
            isSelected={selectedChallenge === c.id}
            isConfirming={confirmJoin === c.id}
            onSelect={() => onSelectChallenge(selectedChallenge === c.id ? null : c.id)}
            onJoin={() => setConfirmJoin(c.id)}
            onContribute={() => onContributeChallenge(c.id)}
            onCancelConfirm={() => setConfirmJoin(null)}
            onConfirmJoin={() => { onJoinChallenge(c.id); setConfirmJoin(null); }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────── */
export default function CommunityChallenges({
  challenges,
  userProgress,
  onJoin,
  onContribute,
}: CommunityChallengesProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'leaderboard'>('active');
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [confirmJoin, setConfirmJoin] = useState<string | null>(null);

  const dailyChallenges = challenges.filter(c => c.type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
  const monthlyChallenges = challenges.filter(c => c.type === 'monthly');

  const sectionProps = {
    userProgress,
    selectedChallenge,
    confirmJoin,
    onSelectChallenge: setSelectedChallenge,
    onJoinChallenge: onJoin,
    onContributeChallenge: (id: string) => onContribute(id, 1),
    setConfirmJoin,
  };

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/20">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Community Challenges</h2>
            <p className="text-xs text-white/40">Compete, learn, and earn XP together</p>
          </div>
        </div>
      </div>

      {/* ── Tab Selector ────────────────────── */}
      <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/5">
        {[
          { key: 'active' as const, label: 'Active', icon: <Flame className="h-3.5 w-3.5" /> },
          { key: 'completed' as const, label: 'Completed', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
          { key: 'leaderboard' as const, label: 'Leaderboard', icon: <Crown className="h-3.5 w-3.5" /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/20'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Active Tab ──────────────────────── */}
      {activeTab === 'active' && (
        <div className="space-y-8">
          <ChallengeSection
            title="Daily Drills"
            challenges={dailyChallenges}
            icon={<Zap className="h-4 w-4 text-cyan-400" />}
            {...sectionProps}
          />
          <ChallengeSection
            title="Weekly Sprints"
            challenges={weeklyChallenges}
            icon={<Flame className="h-4 w-4 text-blue-400" />}
            {...sectionProps}
          />
          <ChallengeSection
            title="Monthly Marathons"
            challenges={monthlyChallenges}
            icon={<Target className="h-4 w-4 text-indigo-400" />}
            {...sectionProps}
          />
        </div>
      )}

      {/* ── Completed Tab ───────────────────── */}
      {activeTab === 'completed' && (
        <div className="space-y-3">
          {COMPLETED_CHALLENGES.map(ch => (
            <div key={ch.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/20 flex items-center justify-center text-2xl">
                {ch.badge}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white">{ch.title}</h4>
                <p className="text-xs text-white/30">Completed on {ch.date}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1">
                <Star className="h-3 w-3 text-violet-400" />
                <span className="text-xs font-bold text-violet-300">+{ch.xp} XP</span>
              </div>
              <Award className="h-5 w-5 text-violet-400" />
            </div>
          ))}
        </div>
      )}

      {/* ── Leaderboard Tab ─────────────────── */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-2">
          {LEADERBOARD.map(user => (
            <div key={user.rank} className="bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center">
                <RankIcon rank={user.rank} />
              </div>
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {user.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-cyan-400" />
                <span className="text-sm font-bold text-white">{user.score.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
