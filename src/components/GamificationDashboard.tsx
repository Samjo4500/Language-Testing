'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Flame, Trophy, Star, Target, Zap, Award, BookOpen, MessageSquare,
  Calendar, ChevronRight, TrendingUp, Crown, Medal, Lock, CheckCircle2,
  Sparkles, Clock, BarChart3, Users
} from 'lucide-react';

/* ============================================================
   TYPES
   ============================================================ */
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: string;
  xpReward: number;
  color: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  type: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  isCurrentUser?: boolean;
}

interface XPHistoryEntry {
  day: string;
  xp: number;
}

interface GamificationState {
  totalXP: number;
  streak: number;
  lastActiveDate: string;
  badges: Record<string, boolean>;
  quests: Quest[];
  weeklyGoal: number;
  weeklyProgress: number;
  xpHistory: XPHistoryEntry[];
}

/* ============================================================
   XP ACTION MAP
   ============================================================ */
const XP_ACTIONS: Record<string, number> = {
  complete_lesson: 50,
  complete_test: 200,
  perfect_test: 500,
  speak_5_minutes: 30,
  speak_15_minutes: 100,
  complete_quest: 75,
  streak_3_days: 150,
  streak_7_days: 500,
  streak_30_days: 2000,
  earn_badge: 100,
  first_test: 300,
  improve_level: 1000,
};

/* ============================================================
   BADGE DEFINITIONS
   ============================================================ */
const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'first_test',
    name: 'First Test',
    description: 'Complete your first CEFR test',
    icon: <CheckCircle2 className="h-5 w-5" />,
    earned: false,
    xpReward: 300,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: <Flame className="h-5 w-5" />,
    earned: false,
    xpReward: 500,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'b2_achiever',
    name: 'B2 Achiever',
    description: 'Reach B2 level in any skill',
    icon: <Trophy className="h-5 w-5" />,
    earned: false,
    xpReward: 1000,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Score 100% on any test section',
    icon: <Star className="h-5 w-5" />,
    earned: false,
    xpReward: 500,
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Complete 10 reading lessons',
    icon: <BookOpen className="h-5 w-5" />,
    earned: false,
    xpReward: 300,
    color: 'from-cyan-500 to-indigo-500',
  },
  {
    id: 'conversation_starter',
    name: 'Conversation Starter',
    description: 'Complete 5 speaking sessions',
    icon: <MessageSquare className="h-5 w-5" />,
    earned: false,
    xpReward: 300,
    color: 'from-blue-500 to-purple-500',
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Be active every day for a week',
    icon: <Calendar className="h-5 w-5" />,
    earned: false,
    xpReward: 500,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'vocabulary_vault',
    name: 'Vocabulary Vault',
    description: 'Learn 100 new vocabulary words',
    icon: <Sparkles className="h-5 w-5" />,
    earned: false,
    xpReward: 400,
    color: 'from-purple-500 to-violet-500',
  },
];

/* ============================================================
   DEFAULT QUESTS
   ============================================================ */
const DEFAULT_QUESTS: Quest[] = [
  {
    id: 'daily_test',
    title: 'Daily Practice',
    description: 'Complete a practice test today',
    progress: 0,
    target: 1,
    xpReward: 75,
    type: 'test',
  },
  {
    id: 'vocab_20',
    title: 'Vocabulary Sprint',
    description: 'Review 20 vocabulary cards',
    progress: 0,
    target: 20,
    xpReward: 50,
    type: 'vocabulary',
  },
  {
    id: 'speak_10',
    title: 'Speaking Warm-up',
    description: 'Practice speaking for 10 minutes',
    progress: 0,
    target: 10,
    xpReward: 60,
    type: 'speaking',
  },
];

/* ============================================================
   LEADERBOARD MOCK DATA
   ============================================================ */
const LEADERBOARD_MOCK: LeaderboardEntry[] = [
  { rank: 1, name: 'Elena K.', xp: 12450, level: 25, avatar: 'EK', isCurrentUser: false },
  { rank: 2, name: 'James L.', xp: 10280, level: 21, avatar: 'JL', isCurrentUser: false },
  { rank: 3, name: 'Yuki T.', xp: 8900, level: 18, avatar: 'YT', isCurrentUser: false },
  { rank: 4, name: 'You', xp: 0, level: 1, avatar: 'YO', isCurrentUser: true },
  { rank: 5, name: 'Marco R.', xp: 5600, level: 12, avatar: 'MR', isCurrentUser: false },
];

/* ============================================================
   HELPER: get day label
   ============================================================ */
function getDayLabel(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

/* ============================================================
   useGamification HOOK
   ============================================================ */
const STORAGE_KEY = 'gamification-state';

function getInitialState(): GamificationState {
  if (typeof window === 'undefined') {
    return {
      totalXP: 0,
      streak: 0,
      lastActiveDate: '',
      badges: {},
      quests: DEFAULT_QUESTS,
      weeklyGoal: 500,
      weeklyProgress: 0,
      xpHistory: Array.from({ length: 7 }, (_, i) => ({
        day: getDayLabel(6 - i),
        xp: 0,
      })),
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    totalXP: 0,
    streak: 0,
    lastActiveDate: '',
    badges: {},
    quests: DEFAULT_QUESTS,
    weeklyGoal: 500,
    weeklyProgress: 0,
    xpHistory: Array.from({ length: 7 }, (_, i) => ({
      day: getDayLabel(6 - i),
      xp: 0,
    })),
  };
}

export function useGamification() {
  const [state, setState] = useState<GamificationState>(getInitialState);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const level = useMemo(() => Math.floor(state.totalXP / 500) + 1, [state.totalXP]);
  const xpInLevel = state.totalXP % 500;
  const xpToNextLevel = 500;

  const awardXP = useCallback((action: string, amount?: number) => {
    const xpGain = amount ?? XP_ACTIONS[action] ?? 0;
    if (xpGain <= 0) return;

    setState((prev) => {
      const newHistory = [...prev.xpHistory];
      newHistory[6] = { ...newHistory[6], xp: newHistory[6].xp + xpGain };

      return {
        ...prev,
        totalXP: prev.totalXP + xpGain,
        weeklyProgress: prev.weeklyProgress + xpGain,
        xpHistory: newHistory,
      };
    });
  }, []);

  const checkStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setState((prev) => {
      if (prev.lastActiveDate === today) return prev;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const newStreak = prev.lastActiveDate === yesterdayStr ? prev.streak + 1 : 1;

      return {
        ...prev,
        streak: newStreak,
        lastActiveDate: today,
      };
    });
  }, []);

  const weeklyProgress = useMemo(
    () => Math.min((state.weeklyProgress / state.weeklyGoal) * 100, 100),
    [state.weeklyProgress, state.weeklyGoal]
  );

  const earnedBadges = useMemo(() => {
    return BADGE_DEFINITIONS.map((b) => ({
      ...b,
      earned: !!state.badges[b.id],
      earnedDate: state.badges[b.id] || undefined,
    }));
  }, [state.badges]);

  const quests = state.quests;

  return {
    xp: state.totalXP,
    level,
    xpInLevel,
    xpToNextLevel,
    streak: state.streak,
    badges: earnedBadges,
    quests,
    weeklyProgress,
    xpHistory: state.xpHistory,
    awardXP,
    checkStreak,
  };
}

/* ============================================================
   PROGRESS RING COMPONENT
   ============================================================ */
function ProgressRing({ progress, size = 80, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ============================================================
   FLAME ANIMATION COMPONENT
   ============================================================ */
function FlameIcon({ active }: { active: boolean }) {
  return (
    <div className="relative">
      <Flame
        className={`h-8 w-8 transition-all duration-300 ${
          active ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]' : 'text-white/20'
        }`}
      />
      {active && (
        <>
          <Flame className="absolute inset-0 h-8 w-8 text-amber-500/40 animate-ping-slow" />
          <div className="absolute inset-0 h-8 w-8 bg-amber-400/20 rounded-full blur-md animate-pulse-slow" />
        </>
      )}
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function GamificationDashboard() {
  const {
    xp, level, xpInLevel, xpToNextLevel,
    streak, badges, quests, weeklyProgress, xpHistory,
    awardXP, checkStreak,
  } = useGamification();

  // Check streak on mount
  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  const leaderboard = useMemo(() => {
    return LEADERBOARD_MOCK.map((entry) =>
      entry.isCurrentUser ? { ...entry, xp, level } : entry
    ).sort((a, b) => b.xp - a.xp).map((entry, i) => ({ ...entry, rank: i + 1 }));
  }, [xp, level]);

  const maxHistoryXP = useMemo(() => Math.max(...xpHistory.map((h) => h.xp), 1), [xpHistory]);

  return (
    <div className="w-full space-y-6">
      {/* ===== HEADER STATS ROW ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* XP Bar with Level */}
        <div className="glass-card p-5 col-span-1 sm:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20">
                {level}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Level {level}</p>
                <p className="text-xs text-white/40">{xp.toLocaleString()} XP total</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-bold text-cyan-400">+{xpToNextLevel - xpInLevel} to next</span>
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-700 ease-out relative"
              style={{ width: `${(xpInLevel / xpToNextLevel) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-white/30">{xpInLevel} XP</span>
            <span className="text-[10px] text-white/30">{xpToNextLevel} XP</span>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="glass-card p-5 flex flex-col items-center justify-center">
          <FlameIcon active={streak > 0} />
          <p className="text-2xl font-bold text-white mt-2">{streak}</p>
          <p className="text-xs text-white/40">Day Streak</p>
          {streak >= 3 && (
            <span className="mt-1 text-[10px] text-amber-400/80 font-medium">🔥 On fire!</span>
          )}
        </div>

        {/* Weekly Goal Progress Ring */}
        <div className="glass-card p-5 flex flex-col items-center justify-center">
          <div className="relative">
            <ProgressRing progress={weeklyProgress} size={72} strokeWidth={5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{Math.round(weeklyProgress)}%</span>
            </div>
          </div>
          <p className="text-xs text-white/40 mt-2">Weekly Goal</p>
          <p className="text-[10px] text-white/25">{Math.round((weeklyProgress / 100) * 500)}/500 XP</p>
        </div>
      </div>

      {/* ===== MIDDLE ROW: Badges + Leaderboard ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Badge Grid */}
        <div className="glass-card p-5 lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Badges</h3>
            <span className="text-[10px] text-white/30 ml-auto">
              {badges.filter((b) => b.earned).length}/{badges.length} earned
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300 ${
                  badge.earned
                    ? 'bg-white/[0.06] border border-white/[0.08]'
                    : 'bg-white/[0.02] border border-white/[0.04] opacity-40'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    badge.earned
                      ? `bg-gradient-to-br ${badge.color} text-white shadow-lg`
                      : 'bg-white/[0.04] text-white/20'
                  }`}
                >
                  {badge.earned ? badge.icon : <Lock className="h-4 w-4" />}
                </div>
                <p className="text-[10px] text-white/60 text-center leading-tight font-medium">
                  {badge.name}
                </p>
                {badge.earned && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Leaderboard</h3>
          </div>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 ${
                  entry.isCurrentUser
                    ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20'
                    : 'bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${
                    entry.rank === 1
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black'
                      : entry.rank === 2
                        ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-black'
                        : entry.rank === 3
                          ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                          : 'bg-white/[0.06] text-white/40'
                  }`}
                >
                  {entry.rank}
                </div>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                    entry.isCurrentUser
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                  }`}
                >
                  {entry.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${entry.isCurrentUser ? 'text-cyan-300' : 'text-white/70'}`}>
                    {entry.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white/80">{entry.xp.toLocaleString()}</p>
                  <p className="text-[10px] text-white/30">Lv.{entry.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== BOTTOM ROW: Quests + XP History ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Quests */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Daily Quests</h3>
          </div>
          <div className="space-y-3">
            {quests.map((quest) => {
              const progressPct = Math.min((quest.progress / quest.target) * 100, 100);
              const isComplete = quest.progress >= quest.target;
              return (
                <div key={quest.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-white/20" />
                      )}
                      <div>
                        <p className={`text-xs font-medium ${isComplete ? 'text-white/40 line-through' : 'text-white/80'}`}>
                          {quest.title}
                        </p>
                        <p className="text-[10px] text-white/30">{quest.description}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-400/70 font-medium">+{quest.xpReward} XP</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/20 text-right">
                    {quest.progress}/{quest.target}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* XP History Chart */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">XP This Week</h3>
            <span className="text-[10px] text-white/30 ml-auto">
              Total: {xpHistory.reduce((s, h) => s + h.xp, 0)} XP
            </span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {xpHistory.map((entry, i) => {
              const height = maxHistoryXP > 0 ? (entry.xp / maxHistoryXP) * 100 : 0;
              const isToday = i === 6;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-white/40 font-medium">
                    {entry.xp > 0 ? entry.xp : ''}
                  </span>
                  <div className="w-full h-24 flex items-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-cyan-600 to-blue-400 shadow-lg shadow-cyan-500/20'
                          : entry.xp > 0
                            ? 'bg-gradient-to-t from-indigo-600 to-purple-400'
                            : 'bg-white/[0.04]'
                      }`}
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className={`text-[10px] ${isToday ? 'text-cyan-400 font-semibold' : 'text-white/30'}`}>
                    {entry.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== DEMO ACTIONS (for testing) ===== */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Quick XP Actions</h3>
          <span className="text-[10px] text-white/20 ml-auto">Demo controls</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { action: 'complete_lesson', label: 'Complete Lesson', icon: <BookOpen className="h-3 w-3" /> },
            { action: 'complete_test', label: 'Complete Test', icon: <CheckCircle2 className="h-3 w-3" /> },
            { action: 'perfect_test', label: 'Perfect Score', icon: <Star className="h-3 w-3" /> },
            { action: 'speak_5_minutes', label: 'Speak 5min', icon: <MessageSquare className="h-3 w-3" /> },
            { action: 'speak_15_minutes', label: 'Speak 15min', icon: <MessageSquare className="h-3 w-3" /> },
          ].map(({ action, label, icon }) => (
            <button
              key={action}
              onClick={() => awardXP(action)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/70 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:text-white transition-all duration-200 cursor-pointer"
            >
              {icon}
              {label}
              <span className="text-cyan-400/60">+{XP_ACTIONS[action]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
