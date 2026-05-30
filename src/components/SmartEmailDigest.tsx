'use client';

import { useState } from 'react';
import {
  Mail, TrendingUp, Flame, Award, Sparkles, Users, BookOpen,
  ChevronDown, ChevronUp, Bell, BellOff, Clock, Calendar,
  Eye, Settings, Unplug
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

/* ── Types ─────────────────────────────────────── */
export interface DigestSettings {
  weeklyProgress: boolean;
  streakReminder: boolean;
  milestoneAlert: boolean;
  recommendations: boolean;
  communityUpdate: boolean;
  monthlyDeepDive: boolean;
  preferredDay: string;
  preferredTime: string;
}

interface SmartEmailDigestProps {
  settings: DigestSettings;
  onUpdate: (settings: DigestSettings) => void;
}

/* ── Constants ─────────────────────────────────── */
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '12:00 PM', '6:00 PM', '8:00 PM'];

const DIGEST_TYPES: {
  key: keyof DigestSettings;
  title: string;
  description: string;
  frequency: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}[] = [
  {
    key: 'weeklyProgress',
    title: 'Weekly Progress',
    description: 'Summary of your learning stats, skill improvements, and time spent each week.',
    frequency: 'Weekly',
    icon: <TrendingUp className="h-4 w-4" />,
    gradient: 'from-cyan-400 to-blue-500',
    iconBg: 'bg-cyan-500/10',
  },
  {
    key: 'streakReminder',
    title: 'Streak Reminder',
    description: 'Gentle nudge when your daily streak is at risk of breaking.',
    frequency: 'Daily',
    icon: <Flame className="h-4 w-4" />,
    gradient: 'from-blue-400 to-indigo-500',
    iconBg: 'bg-blue-500/10',
  },
  {
    key: 'milestoneAlert',
    title: 'Milestone Alert',
    description: 'Celebrate when you reach a new CEFR level, complete a course, or hit a streak milestone.',
    frequency: 'On Event',
    icon: <Award className="h-4 w-4" />,
    gradient: 'from-indigo-400 to-purple-500',
    iconBg: 'bg-indigo-500/10',
  },
  {
    key: 'recommendations',
    title: 'Recommendations',
    description: 'Personalized lesson, course, and practice suggestions based on your level and goals.',
    frequency: 'Weekly',
    icon: <Sparkles className="h-4 w-4" />,
    gradient: 'from-purple-400 to-violet-500',
    iconBg: 'bg-purple-500/10',
  },
  {
    key: 'communityUpdate',
    title: 'Community Update',
    description: 'Highlights from the community — top challenges, popular discussions, and events.',
    frequency: 'Weekly',
    icon: <Users className="h-4 w-4" />,
    gradient: 'from-violet-400 to-blue-500',
    iconBg: 'bg-violet-500/10',
  },
  {
    key: 'monthlyDeepDive',
    title: 'Monthly Deep Dive',
    description: 'In-depth analysis of your strengths, weaknesses, and a personalized study plan for next month.',
    frequency: 'Monthly',
    icon: <BookOpen className="h-4 w-4" />,
    gradient: 'from-blue-400 to-cyan-500',
    iconBg: 'bg-blue-500/10',
  },
];

const PREVIEW_DIGEST = {
  subject: 'Your Weekly Progress — B2 Level 🎯',
  date: 'Monday, Mar 3',
  sections: [
    { label: 'Words Learned', value: '42', change: '+12 from last week' },
    { label: 'Practice Time', value: '3h 45m', change: '+30min' },
    { label: 'Current Streak', value: '14 days 🔥', change: '' },
    { label: 'Skill Focus', value: 'Listening', change: 'Next: Speaking' },
  ],
};

/* ── Main Component ────────────────────────────── */
export default function SmartEmailDigest({ settings, onUpdate }: SmartEmailDigestProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);

  const handleToggle = (key: keyof DigestSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  const handleUnsubscribeAll = () => {
    onUpdate({
      ...settings,
      weeklyProgress: false,
      streakReminder: false,
      milestoneAlert: false,
      recommendations: false,
      communityUpdate: false,
      monthlyDeepDive: false,
    });
    setShowUnsubscribeConfirm(false);
  };

  const activeCount = Object.values(settings).filter(v => typeof v === 'boolean' && v).length;

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-violet-500/20">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Email Digest</h2>
            <p className="text-xs text-white/40">{activeCount} of 6 digests active</p>
          </div>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="glass-button flex items-center gap-2 px-4 py-2 text-sm text-white cursor-pointer"
        >
          <Eye className="h-4 w-4 text-violet-400" />
          Preview
          {showPreview ? <ChevronUp className="h-3.5 w-3.5 text-white/50" /> : <ChevronDown className="h-3.5 w-3.5 text-white/50" />}
        </button>
      </div>

      {/* ── Digest Toggle Cards ─────────────── */}
      <div className="space-y-3">
        {DIGEST_TYPES.map(digest => {
          const isEnabled = settings[digest.key] as boolean;
          return (
            <div
              key={digest.key}
              className={`bg-white/[0.02] border rounded-2xl p-5 transition-all ${
                isEnabled ? 'border-white/10' : 'border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${digest.gradient} text-white shadow-lg`}>
                  {digest.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-semibold text-white">{digest.title}</h4>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${digest.iconBg} border border-white/5 text-white/50`}>
                      <Clock className="h-2.5 w-2.5 mr-1" /> {digest.frequency}
                    </span>
                  </div>
                  <p className="text-xs text-white/40">{digest.description}</p>
                </div>
                <div className="shrink-0 pt-0.5">
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => handleToggle(digest.key)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Time Preferences ────────────────── */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Schedule Preferences</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Preferred Day</label>
            <select
              value={settings.preferredDay}
              onChange={e => onUpdate({ ...settings, preferredDay: e.target.value })}
              className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/40 transition-colors"
            >
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Preferred Time</label>
            <select
              value={settings.preferredTime}
              onChange={e => onUpdate({ ...settings, preferredTime: e.target.value })}
              className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/40 transition-colors"
            >
              {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Latest Digest Preview ───────────── */}
      {showPreview && (
        <div className="glass-card p-5 animate-slide-down">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Latest Digest Preview</h3>
            <span className="text-[10px] text-white/30 ml-auto">{PREVIEW_DIGEST.date}</span>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-3">
            <p className="text-sm font-medium text-white mb-1">{PREVIEW_DIGEST.subject}</p>
            <p className="text-xs text-white/30">From: TestCEFR · To: your@email.com</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PREVIEW_DIGEST.sections.map(s => (
              <div key={s.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                <p className="text-[10px] text-white/30 mb-0.5">{s.label}</p>
                <p className="text-sm font-semibold text-white">{s.value}</p>
                {s.change && <p className="text-[10px] text-cyan-400">{s.change}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Unsubscribe All ─────────────────── */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="text-xs text-white/30">
          Manage all your email preferences in one place
        </div>
        {showUnsubscribeConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleUnsubscribeAll}
              className="flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <Unplug className="h-3 w-3" /> Confirm Unsubscribe
            </button>
            <button
              onClick={() => setShowUnsubscribeConfirm(false)}
              className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:text-white/70 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowUnsubscribeConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-red-300 transition-colors cursor-pointer"
          >
            <BellOff className="h-3.5 w-3.5" /> Unsubscribe All
          </button>
        )}
      </div>
    </div>
  );
}
