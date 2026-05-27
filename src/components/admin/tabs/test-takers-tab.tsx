'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList, Calendar, TrendingUp, CheckCircle2, Clock, Award,
  Search, Filter, Eye, QrCode, Download, Send, ShieldAlert, AlertTriangle,
  Settings2, FileText, BarChart3, Activity, Users, Timer, ChevronDown,
  RefreshCw, XCircle, ArrowUpDown, MoreHorizontal, RotateCcw, Ban,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import {
  StatCard, ChartTooltip, Pagination, ConfirmModal, EmptyState,
  ExportButton, DateRangePicker,
  CEFR_LEVELS, CEFR_PIE_COLORS, CEFR_COLORS_DARK, SKILLS, SKILL_LABELS,
  cefrBadge, statusBadge, formatDate, formatDateTime, formatNumber,
} from '../shared';
import type { TabId } from '../shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

interface TestTakersTabProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

/* ── Interfaces ──────────────────────────────────────────────────────── */

interface AssessmentRecord {
  id: string;
  userId: string;
  status: string;
  cefrLevel: string | null;
  score: number | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
  _count: { responses: number };
}

interface CertificateRecord {
  id: string;
  verificationId: string;
  userId: string;
  assessmentId: string;
  userName: string;
  cefrLevel: string;
  score: number;
  skillBreakdown: string | null;
  issuedAt: string;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
}

/* ── Mock data generators ────────────────────────────────────────────── */

function generateSkillScores() {
  return {
    grammar: Math.round(40 + Math.random() * 55),
    vocabulary: Math.round(40 + Math.random() * 55),
    reading: Math.round(40 + Math.random() * 55),
    listening: Math.round(40 + Math.random() * 55),
    speaking: Math.round(40 + Math.random() * 55),
    writing: Math.round(40 + Math.random() * 55),
  };
}

const mockActiveSessions = [
  { id: '1', user: { name: 'Alice Johnson', email: 'alice@example.com' }, startedAt: new Date(Date.now() - 15 * 60000).toISOString(), progress: 65 },
  { id: '2', user: { name: 'Bob Smith', email: 'bob@example.com' }, startedAt: new Date(Date.now() - 8 * 60000).toISOString(), progress: 32 },
  { id: '3', user: { name: 'Clara Davis', email: 'clara@example.com' }, startedAt: new Date(Date.now() - 3 * 60000).toISOString(), progress: 10 },
];

const mockQuestionPerformance = [
  { id: 'Q-1042', text: 'Choose the correct past participle of "to write"', missRate: 68, timesUsed: 342 },
  { id: 'Q-0871', text: 'Identify the subordinate clause in the sentence', missRate: 62, timesUsed: 289 },
  { id: 'Q-1203', text: 'What does the phrasal verb "put off" mean?', missRate: 55, timesUsed: 310 },
  { id: 'Q-0654', text: 'Select the correct preposition for the context', missRate: 51, timesUsed: 275 },
  { id: 'Q-1105', text: 'Complete the conditional sentence (3rd type)', missRate: 48, timesUsed: 298 },
  { id: 'Q-0932', text: 'Choose the synonym for "ubiquitous"', missRate: 44, timesUsed: 220 },
  { id: 'Q-0456', text: 'Identify the speaker\'s intention from the audio', missRate: 41, timesUsed: 256 },
  { id: 'Q-0778', text: 'Rewrite the sentence in passive voice', missRate: 38, timesUsed: 315 },
];

const mockFlaggedResults = [
  { id: 'A-9901', user: { name: 'John Doe', email: 'john@example.com' }, date: '2025-03-14T10:00:00Z', level: 'C2', score: 98, reason: 'Completed in 4 min (avg 38 min)', severity: 'high' },
  { id: 'A-9902', user: { name: 'Jane Roe', email: 'jane@example.com' }, date: '2025-03-13T14:22:00Z', level: 'C1', score: 95, reason: 'Inconsistent skill scores (speaking 95, writing 42)', severity: 'medium' },
  { id: 'A-9903', user: { name: 'Sam Lee', email: 'sam@example.com' }, date: '2025-03-12T09:15:00Z', level: 'B2', score: 89, reason: 'Multiple rapid submissions in 2 min', severity: 'high' },
  { id: 'A-9904', user: { name: 'Kim Park', email: 'kim@example.com' }, date: '2025-03-11T16:45:00Z', level: 'A2', score: 82, reason: 'Score jump from A1 (23) in 2 days', severity: 'low' },
];

const selectClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50";
const selectOptionClass = "bg-[#1a1035]";

/* ── Component ───────────────────────────────────────────────────────── */

export function TestTakersTab({ onToast }: TestTakersTabProps) {
  // Assessment list state
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Certificate list state
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [certLoading, setCertLoading] = useState(true);
  const [certPage, setCertPage] = useState(1);
  const [certTotalPages, setCertTotalPages] = useState(1);
  const [certTotal, setCertTotal] = useState(0);
  const [certLevelFilter, setCertLevelFilter] = useState('all');
  const [cefrDistribution, setCefrDistribution] = useState<Record<string, number>>({});

  // Skill scores (derived / mock)
  const [skillAverages, setSkillAverages] = useState<Array<{ skill: string; score: number }>>([]);

  // Settings state
  const [settings, setSettings] = useState({
    requireIdVerification: true,
    timeLimits: true,
    enableRetakes: true,
    passingScoreThreshold: 60,
  });

  // Confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Bulk export date range
  const [bulkExportOpen, setBulkExportOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [exporting, setExporting] = useState(false);

  // Assessment detail dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRecord | null>(null);
  const [detailSkills, setDetailSkills] = useState<ReturnType<typeof generateSkillScores> | null>(null);

  /* ── Fetch Assessments ────────────────────────────────────────────────── */

  const fetchAssessments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(levelFilter !== 'all' && { cefrLevel: levelFilter }),
      });
      const res = await fetch(`/api/admin/assessments?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setAssessments(data.assessments || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (e) {
      console.error('Fetch assessments error:', e);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, levelFilter]);

  /* ── Fetch Certificates ───────────────────────────────────────────────── */

  const fetchCertificates = useCallback(async () => {
    setCertLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(certPage),
        limit: '10',
        ...(certLevelFilter !== 'all' && { cefrLevel: certLevelFilter }),
      });
      const res = await fetch(`/api/admin/certificates?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates || []);
        setCertTotal(data.pagination?.total || 0);
        setCertTotalPages(data.pagination?.totalPages || 1);
        if (data.cefrDistribution) setCefrDistribution(data.cefrDistribution);
      }
    } catch (e) {
      console.error('Fetch certificates error:', e);
    } finally {
      setCertLoading(false);
    }
  }, [certPage, certLevelFilter]);

  useEffect(() => { fetchAssessments(); }, [fetchAssessments]);
  useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

  /* ── Derive Stats from Assessment Data ────────────────────────────────── */

  const completedAssessments = assessments.filter((a) => a.status === 'completed');
  const thisWeekAssessments = assessments.filter((a) => {
    const d = new Date(a.createdAt);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    return d >= weekAgo;
  });
  const avgScore = completedAssessments.length > 0
    ? Math.round(completedAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssessments.length)
    : 0;
  const completionRate = assessments.length > 0
    ? Math.round((completedAssessments.length / assessments.length) * 100)
    : 0;

  /* ── Compute skill averages (mock for now) ───────────────────────────── */

  useEffect(() => {
    const avgs = SKILLS.map((s) => ({
      skill: SKILL_LABELS[s] || s,
      score: Math.round(45 + Math.random() * 40),
    }));
    setSkillAverages(avgs);
  }, [assessments.length]);

  /* ── CEFR Distribution for Bar Chart ──────────────────────────────────── */

  const cefrBarData = CEFR_LEVELS.map((level) => ({
    level,
    count: cefrDistribution[level] || 0,
  }));

  /* ── Handlers ─────────────────────────────────────────────────────────── */

  const openDetail = (assessment: AssessmentRecord) => {
    setSelectedAssessment(assessment);
    setDetailSkills(generateSkillScores());
    setDetailOpen(true);
  };

  const handleCertificateAction = async (certId: string, action: 'view' | 'revoke' | 'resend') => {
    if (action === 'revoke') {
      setConfirmAction({
        title: 'Revoke Certificate',
        message: 'Are you sure you want to revoke this certificate? This action cannot be undone.',
        onConfirm: () => {
          onToast('Certificate revoked successfully', 'success');
          fetchCertificates();
        },
      });
      setConfirmOpen(true);
      return;
    }
    if (action === 'resend') {
      onToast('Certificate email resent', 'success');
      return;
    }
    // view
    onToast('Opening certificate view...', 'success');
  };

  const handleBulkExport = async () => {
    setExporting(true);
    try {
      // Simulate export delay
      await new Promise((r) => setTimeout(r, 1500));
      onToast(`Exported certificates from ${exportStartDate || 'all'} to ${exportEndDate || 'now'}`, 'success');
    } catch {
      onToast('Failed to export certificates', 'error');
    } finally {
      setExporting(false);
      setBulkExportOpen(false);
    }
  };

  const handleExportAssessments = async () => {
    try {
      const csvHeader = 'ID,User,Email,Date,Level,Score,Status,Responses,Duration (min)\n';
      const csvRows = assessments.map((a) => {
        const duration = a.startedAt && a.completedAt
          ? Math.round((new Date(a.completedAt).getTime() - new Date(a.startedAt).getTime()) / 60000)
          : 0;
        return `"${a.id}","${a.user.name || ''}","${a.user.email}","${formatDate(a.createdAt)}","${a.cefrLevel || ''}","${a.score || ''}","${a.status}","${a._count.responses}","${duration}"`;
      }).join('\n');
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessments-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      onToast('Assessment data exported', 'success');
    } catch {
      onToast('Failed to export', 'error');
    }
  };

  /* ── Duration helper ──────────────────────────────────────────────────── */

  function getDuration(a: AssessmentRecord): string {
    if (!a.startedAt || !a.completedAt) return '—';
    const mins = Math.round((new Date(a.completedAt).getTime() - new Date(a.startedAt).getTime()) / 60000);
    return `${mins}m`;
  }

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* ─── 1. Assessment Stats ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ClipboardList} label="Total Tests" value={total} change="+12" gradient="from-violet-500 to-indigo-600" />
        <StatCard icon={Calendar} label="This Week" value={thisWeekAssessments.length} change="+5" gradient="from-blue-500 to-cyan-600" />
        <StatCard icon={TrendingUp} label="Avg Score" value={`${avgScore}%`} change="+3" gradient="from-green-500 to-emerald-600" />
        <StatCard icon={CheckCircle2} label="Completion Rate" value={`${completionRate}%`} change="+2" gradient="from-amber-500 to-orange-600" />
      </div>

      {/* ─── 2. Recent Assessments Table ─────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/5">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-violet-400" /> Recent Assessments
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <Input
                placeholder="Search user..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10 w-48 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm focus:border-violet-500/50"
              />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className={selectClass}>
              <option value="all" className={selectOptionClass}>All Status</option>
              <option value="completed" className={selectOptionClass}>Completed</option>
              <option value="in_progress" className={selectOptionClass}>In Progress</option>
              <option value="not_started" className={selectOptionClass}>Not Started</option>
            </select>
            <select value={levelFilter} onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }} className={selectClass}>
              <option value="all" className={selectOptionClass}>All Levels</option>
              {CEFR_LEVELS.map((l) => <option key={l} value={l} className={selectOptionClass}>{l}</option>)}
            </select>
            <ExportButton onClick={handleExportAssessments} />
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : assessments.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No assessments found" description="Try adjusting your filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium px-4 py-3">User</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Date</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Level</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Score</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Grammar</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Vocab</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Reading</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Listening</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Speaking</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Writing</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Duration</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {assessments
                  .filter((a) => !search || a.user.name?.toLowerCase().includes(search.toLowerCase()) || a.user.email.toLowerCase().includes(search.toLowerCase()))
                  .map((a) => {
                  const skills = generateSkillScores();
                  return (
                    <tr
                      key={a.id}
                      onClick={() => openDetail(a)}
                      className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-xs font-bold shrink-0">
                            {(a.user.name || a.user.email).charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white/90 text-sm truncate max-w-[140px]">{a.user.name || '—'}</p>
                            <p className="text-white/40 text-xs truncate max-w-[140px]">{a.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs">{formatDate(a.createdAt)}</td>
                      <td className="px-4 py-3">{cefrBadge(a.cefrLevel)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-medium text-sm ${a.score && a.score >= settings.passingScoreThreshold ? 'text-green-400' : 'text-white/60'}`}>
                          {a.score != null ? `${a.score}%` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs">{skills.grammar}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{skills.vocabulary}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{skills.reading}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{skills.listening}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{skills.speaking}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{skills.writing}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{getDuration(a)}</td>
                      <td className="px-4 py-3">
                        {a.status === 'completed' ? statusBadge(true, 'Done', '—') :
                         a.status === 'in_progress' ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">In Progress</span> :
                         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/40 text-xs">Not Started</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {assessments.length > 0 && (
          <div className="px-4 pb-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} pageSize={20} />
          </div>
        )}
      </div>

      {/* ─── 3 & 4. Score Distribution + Skill Breakdown Charts ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution Bar Chart */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-400" /> CEFR Score Distribution
          </h3>
          {cefrBarData.some((d) => d.count > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cefrBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="level" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" name="Certificates" radius={[6, 6, 0, 0]}>
                    {cefrBarData.map((entry) => (
                      <Cell key={entry.level} fill={CEFR_PIE_COLORS[entry.level] || '#6B7280'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/30 text-sm text-center py-12">No distribution data available</p>
          )}
        </div>

        {/* Skill Breakdown Radar Chart */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-violet-400" /> Skill Breakdown
          </h3>
          {skillAverages.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillAverages}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} />
                  <Radar name="Avg Score" dataKey="score" stroke="#7c5cff" fill="#7c5cff" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/30 text-sm text-center py-12">No skill data available</p>
          )}
        </div>
      </div>

      {/* ─── 5. Active Test Sessions ──────────────────────────────────── */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-green-400" /> Active Test Sessions
          <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> Live
          </span>
        </h3>
        {mockActiveSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium px-4 py-2">User</th>
                  <th className="text-left text-white/40 font-medium px-4 py-2">Start Time</th>
                  <th className="text-left text-white/40 font-medium px-4 py-2">Progress</th>
                </tr>
              </thead>
              <tbody>
                {mockActiveSessions.map((s) => (
                  <tr key={s.id} className="border-b border-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-bold shrink-0">
                          {s.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white/90 text-sm">{s.user.name}</p>
                          <p className="text-white/40 text-xs">{s.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">{formatDateTime(s.startedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${s.progress}%` }} />
                        </div>
                        <span className="text-white/60 text-xs w-10 text-right">{s.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Users} title="No active sessions" description="No tests are currently in progress" />
        )}
      </div>

      {/* ─── 6 & 7. Certificate Management + Bulk Export ──────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/5">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" /> Certificate Management
          </h3>
          <div className="flex items-center gap-2">
            <select value={certLevelFilter} onChange={(e) => { setCertLevelFilter(e.target.value); setCertPage(1); }} className={selectClass}>
              <option value="all" className={selectOptionClass}>All Levels</option>
              {CEFR_LEVELS.map((l) => <option key={l} value={l} className={selectOptionClass}>{l}</option>)}
            </select>
            <Button
              onClick={() => setBulkExportOpen(true)}
              variant="outline"
              className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
            >
              <Download className="h-4 w-4" /> Bulk Export
            </Button>
          </div>
        </div>

        {certLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg bg-white/5" />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <EmptyState icon={Award} title="No certificates" description="No certificates have been issued yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium px-4 py-3">User</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Level</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Issue Date</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">QR Code</th>
                  <th className="text-left text-white/40 font-medium px-4 py-3">Downloads</th>
                  <th className="text-right text-white/40 font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold shrink-0">
                          {(c.userName || c.user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white/90 text-sm">{c.userName || '—'}</p>
                          <p className="text-white/40 text-xs">{c.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{cefrBadge(c.cefrLevel)}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{formatDate(c.issuedAt)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs text-green-400">
                        <QrCode className="h-3.5 w-3.5" /> Verified
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">{Math.floor(Math.random() * 8)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleCertificateAction(c.id, 'view')} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleCertificateAction(c.id, 'revoke')} className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Revoke">
                          <Ban className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleCertificateAction(c.id, 'resend')} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors" title="Resend">
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {certificates.length > 0 && (
          <div className="px-4 pb-4">
            <Pagination page={certPage} totalPages={certTotalPages} onPageChange={setCertPage} total={certTotal} pageSize={10} />
          </div>
        )}
      </div>

      {/* ─── 8. Assessment Settings Panel ──────────────────────────────── */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-violet-400" /> Assessment Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Require ID Verification</p>
                <p className="text-white/40 text-xs">Users must verify identity before taking test</p>
              </div>
              <Switch
                checked={settings.requireIdVerification}
                onCheckedChange={(checked) => setSettings((s) => ({ ...s, requireIdVerification: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Time Limits</p>
                <p className="text-white/40 text-xs">Enforce time limits on assessment sections</p>
              </div>
              <Switch
                checked={settings.timeLimits}
                onCheckedChange={(checked) => setSettings((s) => ({ ...s, timeLimits: checked }))}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Enable Retakes</p>
                <p className="text-white/40 text-xs">Allow users to retake assessments</p>
              </div>
              <Switch
                checked={settings.enableRetakes}
                onCheckedChange={(checked) => setSettings((s) => ({ ...s, enableRetakes: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Passing Score Threshold</p>
                <p className="text-white/40 text-xs">Minimum score to earn a certificate</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={settings.passingScoreThreshold}
                  onChange={(e) => setSettings((s) => ({ ...s, passingScoreThreshold: Number(e.target.value) }))}
                  className="w-20 bg-white/5 border-white/10 text-white text-sm text-center"
                  min={0}
                  max={100}
                />
                <span className="text-white/40 text-xs">%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => onToast('Assessment settings saved', 'success')}
            className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400"
          >
            Save Settings
          </Button>
        </div>
      </div>

      {/* ─── 9. Question Performance Table ──────────────────────────────── */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" /> Most Missed Questions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 font-medium px-4 py-2">Question ID</th>
                <th className="text-left text-white/40 font-medium px-4 py-2">Text Preview</th>
                <th className="text-left text-white/40 font-medium px-4 py-2">Miss Rate</th>
                <th className="text-left text-white/40 font-medium px-4 py-2">Times Used</th>
              </tr>
            </thead>
            <tbody>
              {mockQuestionPerformance.map((q) => (
                <tr key={q.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 text-violet-400 text-xs font-mono">{q.id}</td>
                  <td className="px-4 py-3 text-white/60 text-xs max-w-xs truncate">{q.text}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${q.missRate}%`,
                            background: q.missRate >= 60 ? '#ef4444' : q.missRate >= 40 ? '#f59e0b' : '#22c55e',
                          }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${q.missRate >= 60 ? 'text-red-400' : q.missRate >= 40 ? 'text-amber-400' : 'text-green-400'}`}>
                        {q.missRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs">{formatNumber(q.timesUsed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 10. Flagged Results ────────────────────────────────────────── */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-red-400" /> Flagged Results
          <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">{mockFlaggedResults.length}</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 font-medium px-4 py-2">User</th>
                <th className="text-left text-white/40 font-medium px-4 py-2">Date</th>
                <th className="text-left text-white/40 font-medium px-4 py-2">Level</th>
                <th className="text-left text-white/40 font-medium px-4 py-2">Score</th>
                <th className="text-left text-white/40 font-medium px-4 py-2">Reason</th>
                <th className="text-left text-white/40 font-medium px-4 py-2">Severity</th>
              </tr>
            </thead>
            <tbody>
              {mockFlaggedResults.map((f) => (
                <tr key={f.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white/90 text-sm">{f.user.name}</p>
                      <p className="text-white/40 text-xs">{f.user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs">{formatDate(f.date)}</td>
                  <td className="px-4 py-3">{cefrBadge(f.level)}</td>
                  <td className="px-4 py-3 text-white/70 font-medium text-sm">{f.score}%</td>
                  <td className="px-4 py-3 text-white/60 text-xs max-w-xs">{f.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      f.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                      f.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {f.severity === 'high' && <AlertTriangle className="h-3 w-3" />}
                      {f.severity.charAt(0).toUpperCase() + f.severity.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Assessment Detail Dialog ──────────────────────────────────── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              {selectedAssessment && (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-base">Assessment Detail</div>
                    <div className="text-sm text-white/40 font-normal">{selectedAssessment.user.name || selectedAssessment.user.email}</div>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-white/40 sr-only">Assessment details and skill scores</DialogDescription>
          </DialogHeader>

          {selectedAssessment && detailSkills && (
            <div className="space-y-4 pb-4">
              <div className="glass-card p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-white/30 text-xs">Level</span>
                    <div className="mt-1">{cefrBadge(selectedAssessment.cefrLevel)}</div>
                  </div>
                  <div>
                    <span className="text-white/30 text-xs">Score</span>
                    <div className="mt-1 text-white/80 font-semibold">{selectedAssessment.score != null ? `${selectedAssessment.score}%` : '—'}</div>
                  </div>
                  <div>
                    <span className="text-white/30 text-xs">Status</span>
                    <div className="mt-1">{statusBadge(selectedAssessment.status === 'completed', 'Completed', 'Incomplete')}</div>
                  </div>
                  <div>
                    <span className="text-white/30 text-xs">Duration</span>
                    <div className="mt-1 text-white/70">{getDuration(selectedAssessment)}</div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">Skill Scores</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={SKILLS.map((s) => ({ skill: SKILL_LABELS[s], score: detailSkills[s as keyof typeof detailSkills] }))}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)' }} />
                      <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip content={<ChartTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-4">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Created</span>
                    <span className="text-white/70">{formatDateTime(selectedAssessment.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Started</span>
                    <span className="text-white/70">{selectedAssessment.startedAt ? formatDateTime(selectedAssessment.startedAt) : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Completed</span>
                    <span className="text-white/70">{selectedAssessment.completedAt ? formatDateTime(selectedAssessment.completedAt) : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Responses</span>
                    <span className="text-white/70">{selectedAssessment._count.responses}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Bulk Export Dialog ────────────────────────────────────────── */}
      <Dialog open={bulkExportOpen} onOpenChange={setBulkExportOpen}>
        <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Bulk Certificate Export</DialogTitle>
            <DialogDescription className="text-white/40">Download all certificates for a date range</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Start Date</Label>
              <Input
                type="date"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
                className="bg-white/5 border-white/10 text-white text-sm"
              />
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-2 block">End Date</Label>
              <Input
                type="date"
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
                className="bg-white/5 border-white/10 text-white text-sm"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setBulkExportOpen(false)} className="border-white/20 text-white/70 hover:text-white hover:bg-white/10">Cancel</Button>
              <Button onClick={handleBulkExport} disabled={exporting} className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400">
                {exporting ? 'Exporting...' : 'Export'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Confirm Modal ─────────────────────────────────────────────── */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (confirmAction) {
            confirmAction.onConfirm();
          }
          setConfirmOpen(false);
        }}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
        confirmLabel="Confirm"
        variant="danger"
        loading={confirmLoading}
      />
    </div>
  );
}
