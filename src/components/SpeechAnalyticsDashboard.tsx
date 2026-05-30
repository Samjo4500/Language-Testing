'use client';

import React, { useMemo } from 'react';
import {
  Mic, TrendingUp, Clock, AlertCircle, Brain,
  BarChart3, Volume2,
  Activity, Zap, Target, Award,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';

/* ─────────────── Types ─────────────── */
export interface SpeakingSession {
  id: string;
  date: string;
  duration: number;
  score: number;
  wordsPerMinute: number;
  pauseCount: number;
  topics: string[];
  errors: { phoneme: string; count: number }[];
}

export interface SpeechAnalyticsDashboardProps {
  sessions: SpeakingSession[];
  overallScore: number;
}

/* ─────────────── Circular Progress Ring ─────────────── */
function CircularScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  const getScoreColor = (s: number) => {
    if (s >= 80) return { stroke: '#3B82F6', text: 'text-blue-400', label: 'Excellent' };
    if (s >= 60) return { stroke: '#06B6D4', text: 'text-cyan-400', label: 'Good' };
    if (s >= 40) return { stroke: '#8B5CF6', text: 'text-purple-400', label: 'Fair' };
    return { stroke: '#6366F1', text: 'text-indigo-400', label: 'Needs Work' };
  };

  const colorConfig = getScoreColor(score);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${colorConfig.text}`}>{score}</span>
        <span className="text-[10px] text-white/30 uppercase tracking-wider mt-1">
          {colorConfig.label}
        </span>
      </div>
    </div>
  );
}

/* ─────────────── Fluency Metrics ─────────────── */
function FluencyMetrics({ sessions }: { sessions: SpeakingSession[] }) {
  const latest = sessions[sessions.length - 1];
  const avgWPM = sessions.length
    ? Math.round(sessions.reduce((s, sess) => s + sess.wordsPerMinute, 0) / sessions.length)
    : 0;
  const avgPauses = sessions.length
    ? Math.round(sessions.reduce((s, sess) => s + sess.pauseCount, 0) / sessions.length)
    : 0;
  const avgDuration = sessions.length
    ? Math.round(sessions.reduce((s, sess) => s + sess.duration, 0) / sessions.length)
    : 0;

  const metrics = [
    {
      label: 'Words/Min',
      value: latest?.wordsPerMinute ?? 0,
      avg: avgWPM,
      icon: <Zap className="h-4 w-4 text-cyan-400" />,
      trend: latest && latest.wordsPerMinute >= avgWPM ? 'up' : 'down',
    },
    {
      label: 'Pause Count',
      value: latest?.pauseCount ?? 0,
      avg: avgPauses,
      icon: <Activity className="h-4 w-4 text-blue-400" />,
      trend: latest && latest.pauseCount <= avgPauses ? 'up' : 'down',
    },
    {
      label: 'Avg Duration',
      value: `${avgDuration}s`,
      avg: avgDuration,
      icon: <Clock className="h-4 w-4 text-purple-400" />,
      trend: 'neutral',
    },
    {
      label: 'Sessions',
      value: sessions.length,
      avg: sessions.length,
      icon: <BarChart3 className="h-4 w-4 text-indigo-400" />,
      trend: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-xl p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">{m.label}</span>
            {m.icon}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-white">{m.value}</span>
            {m.trend === 'up' && <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 mb-0.5" />}
            {m.trend === 'down' && <ArrowDownRight className="h-3.5 w-3.5 text-amber-400 mb-0.5" />}
          </div>
          {typeof m.avg === 'number' && m.label !== 'Avg Duration' && m.label !== 'Sessions' && (
            <span className="text-[10px] text-white/20">Avg: {m.avg}</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────── Phoneme Breakdown ─────────────── */
function PhonemeBreakdown({ sessions }: { sessions: SpeakingSession[] }) {
  const phonemeMap = useMemo(() => {
    const map: Record<string, { total: number; category: string }> = {};
    const vowelPhonemes = new Set(['ae', 'ah', 'aw', 'eh', 'er', 'ee', 'ih', 'oh', 'oo', 'uh', 'ay', 'oy', 'ow']);
    const consonantPhonemes = new Set(['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z']);
    const clusterPhonemes = new Set(['ch', 'sh', 'th', 'zh', 'ng', 'nk', 'st', 'str', 'sp', 'sk', 'pr', 'pl', 'tr', 'kl']);

    sessions.forEach((sess) => {
      sess.errors.forEach((err) => {
        const p = err.phoneme.toLowerCase();
        if (!map[p]) {
          let category = 'Consonants';
          if (vowelPhonemes.has(p)) category = 'Vowels';
          else if (clusterPhonemes.has(p)) category = 'Clusters';
          map[p] = { total: 0, category };
        }
        map[p].total += err.count;
      });
    });
    return map;
  }, [sessions]);

  const categories = useMemo(() => {
    const cats: Record<string, { total: number; items: { phoneme: string; count: number }[] }> = {
      Vowels: { total: 0, items: [] },
      Consonants: { total: 0, items: [] },
      Clusters: { total: 0, items: [] },
    };
    Object.entries(phonemeMap).forEach(([phoneme, data]) => {
      if (cats[data.category]) {
        cats[data.category].total += data.total;
        cats[data.category].items.push({ phoneme, count: data.total });
      }
    });
    Object.values(cats).forEach((cat) => cat.items.sort((a, b) => b.count - a.count));
    return cats;
  }, [phonemeMap]);

  const maxTotal = Math.max(...Object.values(categories).map((c) => c.total), 1);

  const catColors: Record<string, { bg: string; bar: string; text: string }> = {
    Vowels: { bg: 'bg-cyan-500/10', bar: 'bg-gradient-to-r from-cyan-500 to-blue-500', text: 'text-cyan-400' },
    Consonants: { bg: 'bg-blue-500/10', bar: 'bg-gradient-to-r from-blue-500 to-indigo-500', text: 'text-blue-400' },
    Clusters: { bg: 'bg-purple-500/10', bar: 'bg-gradient-to-r from-indigo-500 to-purple-500', text: 'text-purple-400' },
  };

  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([name, data]) => {
        const color = catColors[name] || catColors.Consonants;
        return (
          <div key={name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-semibold ${color.text}`}>{name}</span>
              <span className="text-[10px] text-white/30">{data.total} errors</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden mb-2">
              <div
                className={`h-full rounded-full ${color.bar} transition-all duration-700`}
                style={{ width: `${(data.total / maxTotal) * 100}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.items.slice(0, 5).map((item) => (
                <span
                  key={item.phoneme}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] ${color.bg} ${color.text} border border-white/5`}
                >
                  /{item.phoneme}/ <span className="text-white/30">×{item.count}</span>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────── Progress Over Time Chart (CSS) ─────────────── */
function ProgressChart({ sessions }: { sessions: SpeakingSession[] }) {
  const maxScore = 100;
  const chartHeight = 120;
  const chartWidth = 320;

  const points = sessions.slice(-10).map((sess, i) => {
    const x = (i / Math.max(sessions.length - 1, 1)) * (chartWidth - 20) + 10;
    const y = chartHeight - (sess.score / maxScore) * (chartHeight - 20) - 10;
    return { x, y, score: sess.score, date: sess.date };
  });

  // Build line path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  // Build area path
  const areaPath = linePath + ` L ${points[points.length - 1]?.x ?? 0} ${chartHeight} L ${points[0]?.x ?? 0} ${chartHeight} Z`;

  return (
    <div className="relative">
      <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59,130,246,0.25)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = chartHeight - (val / maxScore) * (chartHeight - 20) - 10;
          return (
            <g key={val}>
              <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x="0" y={y - 3} className="fill-white/20 text-[8px]">{val}</text>
            </g>
          );
        })}
        {/* Area fill */}
        {points.length > 1 && <path d={areaPath} fill="url(#areaGrad)" />}
        {/* Line */}
        {points.length > 1 && (
          <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#0F0A1E" stroke="#3B82F6" strokeWidth="2" />
            <text x={p.x} y={chartHeight + 14} textAnchor="middle" className="fill-white/20 text-[7px]">
              {new Date(p.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─────────────── Waveform Visualization ─────────────── */
function WaveformVisualization() {
  const bars = Array.from({ length: 40 }, (_, i) => {
    const baseHeight = 8 + Math.random() * 24;
    const delay = i * 0.05;
    return { baseHeight, delay, active: i % 3 !== 0 };
  });

  return (
    <div className="flex items-end justify-center gap-[2px] h-12">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full bg-gradient-to-t from-cyan-500 via-blue-500 to-purple-500 ${
            bar.active ? 'animate-pulse-slow' : ''
          }`}
          style={{
            height: `${bar.baseHeight}px`,
            opacity: bar.active ? 0.7 : 0.3,
            animationDelay: `${bar.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────── Session History Table ─────────────── */
function SessionHistoryTable({ sessions }: { sessions: SpeakingSession[] }) {
  return (
    <div className="max-h-64 overflow-y-auto custom-scrollbar">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5">
            <th className="pb-2 text-[10px] text-white/30 uppercase tracking-wider font-medium">Date</th>
            <th className="pb-2 text-[10px] text-white/30 uppercase tracking-wider font-medium">Duration</th>
            <th className="pb-2 text-[10px] text-white/30 uppercase tracking-wider font-medium">Score</th>
            <th className="pb-2 text-[10px] text-white/30 uppercase tracking-wider font-medium">Topics</th>
          </tr>
        </thead>
        <tbody>
          {sessions.slice().reverse().map((sess) => (
            <tr key={sess.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
              <td className="py-2.5 text-xs text-white/60">
                {new Date(sess.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              </td>
              <td className="py-2.5 text-xs text-white/50">{sess.duration}s</td>
              <td className="py-2.5">
                <span className={`text-xs font-semibold ${
                  sess.score >= 80 ? 'text-blue-400' :
                  sess.score >= 60 ? 'text-cyan-400' :
                  sess.score >= 40 ? 'text-purple-400' : 'text-indigo-400'
                }`}>
                  {sess.score}
                </span>
              </td>
              <td className="py-2.5">
                <div className="flex flex-wrap gap-1">
                  {sess.topics.slice(0, 2).map((topic) => (
                    <span key={topic} className="px-1.5 py-0.5 rounded text-[9px] bg-white/[0.04] text-white/40 border border-white/[0.06]">
                      {topic}
                    </span>
                  ))}
                  {sess.topics.length > 2 && (
                    <span className="text-[9px] text-white/20">+{sess.topics.length - 2}</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────── Common Errors List ─────────────── */
function CommonErrorsList({ sessions }: { sessions: SpeakingSession[] }) {
  const errors = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach((sess) => {
      sess.errors.forEach((err) => {
        map[err.phoneme] = (map[err.phoneme] || 0) + err.count;
      });
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);
  }, [sessions]);

  const maxCount = errors.length > 0 ? errors[0][1] : 1;

  return (
    <div className="space-y-2.5">
      {errors.map(([phoneme, count], idx) => (
        <div key={phoneme} className="flex items-center gap-3">
          <span className="text-[10px] text-white/20 w-4 text-right">{idx + 1}</span>
          <span className="text-xs text-white/70 font-medium w-10">/{phoneme}/</span>
          <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${(count / maxCount) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-white/30 w-8 text-right">×{count}</span>
        </div>
      ))}
      {errors.length === 0 && (
        <p className="text-xs text-white/30 text-center py-4">No errors recorded yet</p>
      )}
    </div>
  );
}

/* ─────────────── Practice Recommendations ─────────────── */
function PracticeRecommendations({ sessions }: { sessions: SpeakingSession[] }) {
  const recommendations = useMemo(() => {
    const recs: { area: string; reason: string; icon: React.ReactNode; priority: 'high' | 'medium' | 'low' }[] = [];
    if (sessions.length === 0) return recs;

    const latest = sessions[sessions.length - 1];
    if (latest.wordsPerMinute < 100) {
      recs.push({
        area: 'Fluency Speed',
        reason: 'Your speaking pace is below 100 WPM. Practice reading aloud to build speed.',
        icon: <Zap className="h-4 w-4 text-cyan-400" />,
        priority: 'high',
      });
    }
    if (latest.pauseCount > 10) {
      recs.push({
        area: 'Reduce Pauses',
        reason: 'High pause count detected. Focus on connected speech exercises.',
        icon: <Activity className="h-4 w-4 text-blue-400" />,
        priority: 'high',
      });
    }
    if (latest.score < 60) {
      recs.push({
        area: 'Pronunciation Basics',
        reason: 'Work on core sounds. Start with vowel clarity exercises.',
        icon: <Volume2 className="h-4 w-4 text-purple-400" />,
        priority: 'high',
      });
    }

    // Check for recurring phoneme errors
    const phonemeTotals: Record<string, number> = {};
    sessions.forEach((s) => s.errors.forEach((e) => { phonemeTotals[e.phoneme] = (phonemeTotals[e.phoneme] || 0) + e.count; }));
    const topError = Object.entries(phonemeTotals).sort(([, a], [, b]) => b - a)[0];
    if (topError) {
      recs.push({
        area: `Practice /${topError[0]}/ sound`,
        reason: `Most frequent error (${topError[1]} occurrences). Try minimal pair drills.`,
        icon: <Target className="h-4 w-4 text-indigo-400" />,
        priority: 'medium',
      });
    }

    if (recs.length === 0) {
      recs.push({
        area: 'Keep Practicing',
        reason: 'Your speech metrics look good! Try more advanced topics.',
        icon: <Award className="h-4 w-4 text-blue-400" />,
        priority: 'low',
      });
    }

    return recs;
  }, [sessions]);

  const priorityStyles = {
    high: 'border-blue-500/20 bg-blue-500/5',
    medium: 'border-purple-500/20 bg-purple-500/5',
    low: 'border-white/5 bg-white/[0.02]',
  };

  return (
    <div className="space-y-2.5">
      {recommendations.map((rec, idx) => (
        <div
          key={idx}
          className={`rounded-xl p-3 border ${priorityStyles[rec.priority]} transition-all hover:border-white/10`}
        >
          <div className="flex items-start gap-2.5">
            <div className="shrink-0 mt-0.5">{rec.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-white">{rec.area}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider ${
                  rec.priority === 'high' ? 'bg-blue-500/15 text-blue-300' :
                  rec.priority === 'medium' ? 'bg-purple-500/15 text-purple-300' :
                  'bg-white/5 text-white/30'
                }`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed">{rec.reason}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════ Main Component ═══════════════ */
export default function SpeechAnalyticsDashboard({
  sessions,
  overallScore,
}: SpeechAnalyticsDashboardProps) {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-500 shadow-lg shadow-blue-500/20">
          <Mic className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Speech Analytics</h2>
          <p className="text-xs text-white/40">Track your pronunciation & fluency progress</p>
        </div>
      </div>

      {/* Top Row: Score + Metrics */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Overall Score */}
        <div className="rounded-2xl p-5 bg-white/[0.02] border border-white/5 flex flex-col items-center">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award className="h-3.5 w-3.5" /> Overall Pronunciation Score
          </h3>
          <CircularScoreRing score={overallScore} />
          <div className="mt-4 w-full">
            <WaveformVisualization />
          </div>
        </div>

        {/* Fluency Metrics */}
        <div className="rounded-2xl p-5 bg-white/[0.02] border border-white/5">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="h-3.5 w-3.5" /> Fluency Metrics
          </h3>
          <FluencyMetrics sessions={sessions} />
        </div>
      </div>

      {/* Middle Row: Phoneme Breakdown + Progress Chart */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Phoneme Breakdown */}
        <div className="rounded-2xl p-5 bg-white/[0.02] border border-white/5">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Volume2 className="h-3.5 w-3.5" /> Pronunciation by Category
          </h3>
          <PhonemeBreakdown sessions={sessions} />
        </div>

        {/* Progress Over Time */}
        <div className="rounded-2xl p-5 bg-white/[0.02] border border-white/5">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5" /> Progress Over Time
          </h3>
          <ProgressChart sessions={sessions} />
        </div>
      </div>

      {/* Bottom Row: Common Errors + Session History */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Common Errors */}
        <div className="rounded-2xl p-5 bg-white/[0.02] border border-white/5">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5" /> Common Errors
          </h3>
          <CommonErrorsList sessions={sessions} />
        </div>

        {/* Session History */}
        <div className="rounded-2xl p-5 bg-white/[0.02] border border-white/5">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" /> Session History
          </h3>
          <SessionHistoryTable sessions={sessions} />
        </div>
      </div>

      {/* Practice Recommendations */}
      <div className="rounded-2xl p-5 bg-white/[0.02] border border-white/5">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Brain className="h-3.5 w-3.5" /> Practice Recommendations
        </h3>
        <PracticeRecommendations sessions={sessions} />
      </div>
    </div>
  );
}
