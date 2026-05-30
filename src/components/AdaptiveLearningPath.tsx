'use client';

import React, { useState } from 'react';
import {
  BookOpen, Brain, MessageSquare, Headphones, PenTool,
  Lock, CheckCircle2, Circle, Play, Clock, Target,
  ChevronRight, Sparkles, TrendingUp, Zap, Award,
  ArrowRight, Flame
} from 'lucide-react';

/* ─────────────── Types ─────────────── */
export interface Milestone {
  id: string;
  title: string;
  description: string;
  cefrLevel: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  icon: string;
  estimatedMinutes: number;
  skills: string[];
}

export interface AdaptiveLearningPathProps {
  milestones: Milestone[];
  currentMilestoneId: string;
  skillLevels: Record<string, number>;
  onStartMilestone: (id: string) => void;
}

/* ─────────────── CEFR Color Map ─────────────── */
const CEFR_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  A1: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
  A2: { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30', glow: 'shadow-teal-500/20' },
  B1: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' },
  B2: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  C1: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
  C2: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
};

/* ─────────────── Icon Map ─────────────── */
const ICON_MAP: Record<string, React.ReactNode> = {
  book: <BookOpen className="h-5 w-5" />,
  brain: <Brain className="h-5 w-5" />,
  message: <MessageSquare className="h-5 w-5" />,
  headphones: <Headphones className="h-5 w-5" />,
  pen: <PenTool className="h-5 w-5" />,
  target: <Target className="h-5 w-5" />,
  sparkles: <Sparkles className="h-5 w-5" />,
  zap: <Zap className="h-5 w-5" />,
  award: <Award className="h-5 w-5" />,
  trending: <TrendingUp className="h-5 w-5" />,
};

/* ─────────────── Skill Radar Chart ─────────────── */
function SkillRadarChart({ skillLevels }: { skillLevels: Record<string, number> }) {
  const skills = ['Grammar', 'Vocabulary', 'Reading', 'Listening', 'Speaking', 'Writing'];
  const size = 220;
  const center = size / 2;
  const maxRadius = 85;
  const angleStep = (2 * Math.PI) / skills.length;
  const startAngle = -Math.PI / 2; // Start from top

  // Calculate points for each skill level
  const points = skills.map((skill, i) => {
    const level = (skillLevels[skill] || 0) / 100;
    const angle = startAngle + i * angleStep;
    const r = maxRadius * level;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (maxRadius + 28) * Math.cos(angle),
      labelY: center + (maxRadius + 28) * Math.sin(angle),
      skill,
      level: skillLevels[skill] || 0,
    };
  });

  const dataPath = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Grid rings at 25%, 50%, 75%, 100%
  const gridRings = [0.25, 0.5, 0.75, 1].map((frac) => {
    const ringPoints = skills.map((_, i) => {
      const angle = startAngle + i * angleStep;
      const r = maxRadius * frac;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    });
    return ringPoints.join(' ');
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Grid rings */}
        {gridRings.map((ring, i) => (
          <polygon
            key={i}
            points={ring}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}
        {/* Axis lines */}
        {skills.map((_, i) => {
          const angle = startAngle + i * angleStep;
          const endX = center + maxRadius * Math.cos(angle);
          const endY = center + maxRadius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}
        {/* Data area - gradient fill */}
        <defs>
          <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(6,182,212,0.3)" />
            <stop offset="50%" stopColor="rgba(59,130,246,0.25)" />
            <stop offset="100%" stopColor="rgba(124,92,255,0.2)" />
          </linearGradient>
        </defs>
        <polygon
          points={dataPath}
          fill="url(#radarGrad)"
          stroke="url(#radarGrad)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#3B82F6"
            stroke="#60A5FA"
            strokeWidth="2"
          />
        ))}
        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-white/50 text-[10px] font-medium"
          >
            {p.skill}
          </text>
        ))}
      </svg>
      {/* Skill Level Legend */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-2">
        {skills.map((skill) => (
          <div key={skill} className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            <span className="text-[10px] text-white/40">{skill}</span>
            <span className="text-[10px] text-white/60 font-semibold">{skillLevels[skill] || 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── Milestone Node ─────────────── */
function MilestoneNode({
  milestone,
  isCurrent,
  isLast,
  onStart,
}: {
  milestone: Milestone;
  isCurrent: boolean;
  isLast: boolean;
  onStart: (id: string) => void;
}) {
  const cefr = CEFR_COLORS[milestone.cefrLevel] || CEFR_COLORS.B1;
  const icon = ICON_MAP[milestone.icon] || ICON_MAP.book;

  const statusConfig = {
    completed: { icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />, ring: 'ring-emerald-500/30', bg: 'bg-emerald-500/10' },
    'in-progress': { icon: <Flame className="h-5 w-5 text-blue-400" />, ring: 'ring-blue-500/40', bg: 'bg-blue-500/10' },
    available: { icon: <Play className="h-5 w-5 text-cyan-400" />, ring: 'ring-cyan-500/30', bg: 'bg-cyan-500/10' },
    locked: { icon: <Lock className="h-5 w-5 text-white/20" />, ring: 'ring-white/10', bg: 'bg-white/5' },
  };

  const status = statusConfig[milestone.status];
  const isLocked = milestone.status === 'locked';

  return (
    <div className="relative flex gap-5">
      {/* Timeline Column */}
      <div className="flex flex-col items-center shrink-0">
        {/* Node Circle */}
        <div
          className={`
            relative flex h-12 w-12 items-center justify-center rounded-full
            ring-2 ${status.ring} ${status.bg}
            transition-all duration-500
            ${isCurrent ? 'scale-110' : ''}
            ${isLocked ? 'opacity-50' : ''}
          `}
        >
          {isCurrent && (
            <div className="absolute inset-0 rounded-full animate-ping-slow opacity-30 bg-blue-500/40" />
          )}
          <div className={isLocked ? 'text-white/20' : cefr.text}>
            {status.icon}
          </div>
        </div>

        {/* Connecting Line */}
        {!isLast && (
          <div className="relative w-0.5 flex-1 min-h-[40px]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5" />
            {milestone.status === 'completed' && (
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/30 to-cyan-500/20" />
            )}
            {isCurrent && (
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 to-purple-500/20 animate-pulse-slow" />
            )}
          </div>
        )}
      </div>

      {/* Content Card */}
      <div
        className={`
          flex-1 mb-6 rounded-2xl p-4
          bg-white/[0.02] border border-white/5
          transition-all duration-300
          ${isCurrent ? 'border-blue-500/30 shadow-lg shadow-blue-500/10' : ''}
          ${isLocked ? 'opacity-40' : 'hover:border-white/10 hover:bg-white/[0.04]'}
        `}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${cefr.bg} ${cefr.text} border ${cefr.border}`}>
                {milestone.cefrLevel}
              </span>
              {isCurrent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  <Circle className="h-2 w-2 fill-blue-400" /> Current
                </span>
              )}
              <span className="flex items-center gap-1 text-[10px] text-white/30">
                <Clock className="h-3 w-3" /> {milestone.estimatedMinutes}min
              </span>
            </div>
            <h3 className={`text-sm font-semibold mb-1 ${isLocked ? 'text-white/40' : 'text-white'}`}>
              {milestone.title}
            </h3>
            <p className={`text-xs leading-relaxed ${isLocked ? 'text-white/20' : 'text-white/50'}`}>
              {milestone.description}
            </p>
            {/* Skills Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {milestone.skills.map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded-md text-[10px] bg-white/[0.04] text-white/40 border border-white/[0.06]">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          {!isLocked && milestone.status !== 'completed' && (
            <button
              onClick={() => onStart(milestone.id)}
              className={`
                shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                transition-all duration-300 cursor-pointer
                ${isCurrent
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                  : 'bg-white/[0.06] text-white/60 border border-white/10 hover:bg-white/[0.1] hover:text-white/80'
                }
              `}
            >
              {milestone.status === 'in-progress' ? 'Continue' : 'Start'}
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
          {milestone.status === 'completed' && (
            <div className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" /> Done
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Recommended Next Card ─────────────── */
function RecommendedNextCard({
  milestone,
  onStart,
}: {
  milestone: Milestone;
  onStart: (id: string) => void;
}) {
  const cefr = CEFR_COLORS[milestone.cefrLevel] || CEFR_COLORS.B1;
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-blue-400" />
        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Recommended Next</span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${cefr.bg} ${cefr.text} border ${cefr.border}`}>
              {milestone.cefrLevel}
            </span>
          </div>
          <h4 className="text-base font-bold text-white mb-1">{milestone.title}</h4>
          <p className="text-xs text-white/50 leading-relaxed mb-3">{milestone.description}</p>
          <div className="flex items-center gap-3 text-[10px] text-white/30">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {milestone.estimatedMinutes} min</span>
            <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {milestone.skills.length} skills</span>
          </div>
        </div>
        <button
          onClick={() => onStart(milestone.id)}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        >
          Start Now
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────── Path Stats ─────────────── */
function PathStats({ milestones }: { milestones: Milestone[] }) {
  const completed = milestones.filter((m) => m.status === 'completed').length;
  const inProgress = milestones.find((m) => m.status === 'in-progress');
  const totalMinutes = milestones.reduce((sum, m) => sum + m.estimatedMinutes, 0);
  const completedMinutes = milestones
    .filter((m) => m.status === 'completed')
    .reduce((sum, m) => sum + m.estimatedMinutes, 0);
  const progressPct = Math.round((completedMinutes / totalMinutes) * 100);

  const stats = [
    {
      label: 'Est. Total Time',
      value: `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m`,
      icon: <Clock className="h-4 w-4 text-cyan-400" />,
    },
    {
      label: 'Modules Completed',
      value: `${completed}/${milestones.length}`,
      icon: <CheckCircle2 className="h-4 w-4 text-blue-400" />,
    },
    {
      label: 'Current Focus',
      value: inProgress?.title || '—',
      icon: <Target className="h-4 w-4 text-purple-400" />,
    },
    {
      label: 'Overall Progress',
      value: `${progressPct}%`,
      icon: <TrendingUp className="h-4 w-4 text-indigo-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl p-3 bg-white/[0.02] border border-white/5"
        >
          <div className="flex items-center gap-2 mb-1">
            {stat.icon}
            <span className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</span>
          </div>
          <div className="text-sm font-bold text-white truncate">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════ Main Component ═══════════════ */
export default function AdaptiveLearningPath({
  milestones,
  currentMilestoneId,
  skillLevels,
  onStartMilestone,
}: AdaptiveLearningPathProps) {
  const [expanded, setExpanded] = useState(true);
  const nextAvailable = milestones.find(
    (m) => m.status === 'available' || m.status === 'in-progress'
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Adaptive Learning Path</h2>
            <p className="text-xs text-white/40">Personalized to your skill levels</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/70 transition-all cursor-pointer"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {expanded && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Timeline */}
          <div className="lg:col-span-2 space-y-0">
            {/* Recommended Next */}
            {nextAvailable && (
              <div className="mb-6">
                <RecommendedNextCard milestone={nextAvailable} onStart={onStartMilestone} />
              </div>
            )}

            {/* Milestone Timeline */}
            <div className="space-y-0">
              {milestones.map((milestone, idx) => (
                <MilestoneNode
                  key={milestone.id}
                  milestone={milestone}
                  isCurrent={milestone.id === currentMilestoneId}
                  isLast={idx === milestones.length - 1}
                  onStart={onStartMilestone}
                />
              ))}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-5">
            {/* Skill Radar */}
            <div className="rounded-2xl p-4 bg-white/[0.02] border border-white/5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-400" />
                Skill Profile
              </h3>
              <SkillRadarChart skillLevels={skillLevels} />
            </div>

            {/* Path Stats */}
            <PathStats milestones={milestones} />

            {/* Progress Bar */}
            <div className="rounded-2xl p-4 bg-white/[0.02] border border-white/5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                Path Progress
              </h3>
              <div className="relative h-3 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-700"
                  style={{
                    width: `${Math.round(
                      (milestones.filter((m) => m.status === 'completed').length / milestones.length) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-white/30">
                <span>A1</span>
                <span>A2</span>
                <span>B1</span>
                <span>B2</span>
                <span>C1</span>
                <span>C2</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
