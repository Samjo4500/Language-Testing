'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users, Award, DollarSign, FileBadge, TrendingUp, UserPlus, Mail, Shield,
  ArrowUpRight, CheckCircle2, AlertCircle, AlertTriangle, Eye, Send, MessageSquare, Zap,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { StatCard, ChartTooltip, CEFR_PIE_COLORS, formatDate, formatCurrency, formatNumber } from '../shared';
import type { TabId } from '../shared';

interface OverviewTabProps {
  onSwitchTab: (tab: TabId) => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

interface AnalyticsKPIs {
  totalUsers: number;
  totalAssessments: number;
  completedAssessments: number;
  totalRevenue: number;
  totalCertificates: number;
  todaySignups: number;
  todayAssessments: number;
  todayRevenue: number;
}

interface RecentUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  createdAt: string;
}

interface RecentAssessment {
  id: string;
  status: string;
  cefrLevel: string | null;
  score: number | null;
  completedAt: string | null;
  user: { id: string; email: string; name: string | null };
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  time: string;
}

export function OverviewTab({ onSwitchTab, onToast }: OverviewTabProps) {
  const [kpis, setKpis] = useState<AnalyticsKPIs | null>(null);
  const [dailySignups, setDailySignups] = useState<Array<{ date: string; signups: number; pageViews: number }>>([]);
  const [cefrDistribution, setCefrDistribution] = useState<Array<{ level: string; count: number }>>([]);
  const [recentSignups, setRecentSignups] = useState<RecentUser[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<RecentAssessment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [analyticsRes, statsRes] = await Promise.all([
        fetch('/api/admin/analytics', { credentials: 'same-origin' }),
        fetch('/api/admin/stats', { credentials: 'same-origin' }),
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setKpis(data.kpis);

        const signupsArr = Object.entries(data.dailySignups || {}).map(([date, count]) => ({
          date,
          signups: count as number,
          pageViews: (data.dailyPageViews || {})[date] || 0,
        })).sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
        setDailySignups(signupsArr);

        const cefrArr = Object.entries(data.cefrDistribution || {}).map(([level, count]) => ({
          level,
          count: count as number,
        }));
        setCefrDistribution(cefrArr);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setRecentSignups(statsData.recentSignups || []);
      }

      const assessRes = await fetch('/api/admin/assessments?limit=5', { credentials: 'same-origin' });
      if (assessRes.ok) {
        const assessData = await assessRes.json();
        setRecentAssessments((assessData.assessments || assessData).slice(0, 5));
      }

      const alertList: Alert[] = [];
      if (kpis && kpis.totalRevenue === 0) {
        alertList.push({ id: 'no-revenue', type: 'info', message: 'No revenue recorded yet. Consider setting up payment integration.', time: 'System' });
      }
      setAlerts(alertList);
    } catch (e) {
      console.error('Overview fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const alertIcon = (type: string) => {
    if (type === 'error') return <AlertCircle className="h-4 w-4 text-red-400" />;
    if (type === 'warning') return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    return <AlertCircle className="h-4 w-4 text-blue-400" />;
  };

  return (
    <div className="space-y-6">
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={kpis ? formatNumber(kpis.totalUsers) : '—'} change={kpis?.todaySignups ? `+${kpis.todaySignups} today` : undefined} gradient="from-blue-500 to-cyan-500" subtitle="All registered users" />
        <StatCard icon={Award} label="Total Assessments" value={kpis ? formatNumber(kpis.totalAssessments) : '—'} change={kpis?.todayAssessments ? `+${kpis.todayAssessments} today` : undefined} gradient="from-violet-500 to-indigo-600" subtitle="Tests taken" />
        <StatCard icon={DollarSign} label="Revenue" value={kpis ? formatCurrency(kpis.totalRevenue) : '—'} change={kpis?.todayRevenue ? `+${formatCurrency(kpis.todayRevenue)} today` : undefined} gradient="from-green-500 to-emerald-600" subtitle="Total platform revenue" />
        <StatCard icon={FileBadge} label="Certificates" value={kpis ? formatNumber(kpis.totalCertificates) : '—'} gradient="from-amber-500 to-orange-600" subtitle="Issued certificates" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic & Signups Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            Traffic & Signups (30 days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySignups}>
                <defs>
                  <linearGradient id="signupsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c5cff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="signups" name="Signups" stroke="#3B82F6" fill="url(#signupsGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#7c5cff" fill="url(#viewsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CEFR Distribution Donut */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-violet-400" />
            CEFR Distribution
          </h3>
          <div className="h-64">
            {cefrDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cefrDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="count" nameKey="level" paddingAngle={2}>
                    {cefrDistribution.map((entry) => (
                      <Cell key={entry.level} fill={CEFR_PIE_COLORS[entry.level] || '#6B7280'} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-white/30 text-sm">No data yet</div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {cefrDistribution.map((entry) => (
              <span key={entry.level} className="flex items-center gap-1 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CEFR_PIE_COLORS[entry.level] }} />
                <span className="text-white/50">{entry.level}: {entry.count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tables + Quick Actions + Alerts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Signups */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-green-400" />
              Recent Signups
            </h3>
            <button onClick={() => onSwitchTab('users')} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all</button>
          </div>
          <div className="space-y-3">
            {recentSignups.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-4">No recent signups</p>
            ) : (
              recentSignups.map((u) => (
                <div key={u.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-xs font-bold">
                    {(u.name || u.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm truncate">{u.name || u.email}</p>
                    <p className="text-white/30 text-xs truncate">{u.email}</p>
                  </div>
                  <span className="text-white/30 text-xs">{formatDate(u.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-violet-400" />
              Recent Tests
            </h3>
            <button onClick={() => onSwitchTab('assessments')} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all</button>
          </div>
          <div className="space-y-3">
            {recentAssessments.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-4">No recent assessments</p>
            ) : (
              recentAssessments.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs font-bold">
                    {(a.user?.name || a.user?.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm truncate">{a.user?.name || a.user?.email}</p>
                    <p className="text-white/30 text-xs">{a.cefrLevel || 'Pending'} {a.score !== null ? `• ${a.score}%` : ''}</p>
                  </div>
                  <span className={`text-xs ${a.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>{a.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions + Alerts */}
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { icon: Eye, label: 'View All Users', tab: 'users' as TabId, color: 'text-blue-400' },
                { icon: Send, label: 'Send Email', tab: 'emails' as TabId, color: 'text-green-400' },
                { icon: MessageSquare, label: 'Moderate Community', tab: 'governance' as TabId, color: 'text-violet-400' },
                { icon: DollarSign, label: 'View Revenue', tab: 'financial' as TabId, color: 'text-amber-400' },
              ].map((action) => (
                <button key={action.tab} onClick={() => onSwitchTab(action.tab)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group">
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                  <span className="text-white/70 text-sm group-hover:text-white">{action.label}</span>
                  <ArrowUpRight className="h-3 w-3 text-white/30 ml-auto" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              Alerts
            </h3>
            {alerts.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="h-8 w-8 text-green-400/30 mx-auto mb-2" />
                <p className="text-white/30 text-sm">All systems normal</p>
              </div>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-2 py-2 border-b border-white/5 last:border-0">
                    {alertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-xs">{alert.message}</p>
                      <p className="text-white/30 text-xs mt-0.5">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
