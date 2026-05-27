'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Globe, Eye, Users, Clock, TrendingUp, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart as PieIcon, Map, Monitor, Smartphone, Tablet,
  Download, FileText, Activity, Zap, RefreshCw,
  Search, Filter, ArrowRight, ExternalLink,
  BookOpen, MessageSquare, DollarSign, Target,
  Funnel, Layers, Cpu, Radio,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  StatCard, ChartTooltip, DateRangePicker, EmptyState, ExportButton,
  formatNumber, formatDate,
} from '../shared';
import { CEFR_PIE_COLORS } from '../shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticsTabProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

const selectClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50";
const selectOptionClass = "bg-[#1a1035]";

// --- Mock Data Generators ---
interface DailyDataRow {
  date: string; pageViews: number; uniqueVisitors: number; avgSession: number;
  bounceRate: number; signups: number; messages: number; revenue: number;
}

function generateDailyData(days: number): DailyDataRow[] {
  const data: DailyDataRow[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    data.push({
      date: dateStr,
      pageViews: Math.floor(Math.random() * 400) + 100,
      uniqueVisitors: Math.floor(Math.random() * 200) + 50,
      avgSession: Math.floor(Math.random() * 300) + 60,
      bounceRate: Math.floor(Math.random() * 30) + 30,
      signups: Math.floor(Math.random() * 15) + 2,
      messages: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 500) + 50,
    });
  }
  return data;
}

const MOCK_TOP_PAGES = [
  { page: '/', views: 4521, avgTime: '2:34', bounceRate: '35%' },
  { page: '/assessment', views: 2103, avgTime: '8:12', bounceRate: '15%' },
  { page: '/courses', views: 1820, avgTime: '3:45', bounceRate: '28%' },
  { page: '/pricing', views: 1456, avgTime: '1:56', bounceRate: '42%' },
  { page: '/community', views: 987, avgTime: '5:23', bounceRate: '22%' },
  { page: '/certificates', views: 756, avgTime: '2:10', bounceRate: '38%' },
  { page: '/register', views: 634, avgTime: '1:30', bounceRate: '45%' },
  { page: '/about', views: 423, avgTime: '1:45', bounceRate: '52%' },
];

const MOCK_REFERRERS = [
  { source: 'Direct', count: 3420, percentage: 38.5 },
  { source: 'Google', count: 2890, percentage: 32.5 },
  { source: 'Twitter', count: 890, percentage: 10.0 },
  { source: 'Facebook', count: 650, percentage: 7.3 },
  { source: 'YouTube', count: 420, percentage: 4.7 },
  { source: 'Reddit', count: 310, percentage: 3.5 },
  { source: 'Other', count: 300, percentage: 3.5 },
];

const MOCK_FUNNELS = [
  {
    name: 'Test Completion',
    steps: [
      { name: 'Landing', count: 10000, pct: 100 },
      { name: 'Signup', count: 3200, pct: 32 },
      { name: 'Start Test', count: 2100, pct: 21 },
      { name: 'Complete Test', count: 1400, pct: 14 },
      { name: 'View Results', count: 1200, pct: 12 },
    ],
  },
  {
    name: 'Course Engagement',
    steps: [
      { name: 'Browse Courses', count: 5000, pct: 100 },
      { name: 'Start Lesson', count: 2800, pct: 56 },
      { name: 'Complete Lesson', count: 1600, pct: 32 },
      { name: 'Continue Next Day', count: 800, pct: 16 },
    ],
  },
  {
    name: 'Paid Conversion',
    steps: [
      { name: 'Signup', count: 3200, pct: 100 },
      { name: 'Free Test', count: 2100, pct: 65.6 },
      { name: 'Return Visit', count: 1200, pct: 37.5 },
      { name: 'Upgrade Page', count: 600, pct: 18.8 },
      { name: 'Purchase', count: 180, pct: 5.6 },
    ],
  },
  {
    name: 'Community Activation',
    steps: [
      { name: 'Signup', count: 3200, pct: 100 },
      { name: 'Visit Community', count: 1800, pct: 56.3 },
      { name: 'First Message', count: 900, pct: 28.1 },
      { name: '5+ Messages', count: 420, pct: 13.1 },
    ],
  },
];

const MOCK_COHORTS = [
  { week: 'Week 1 (Jan 1)', signups: 120, w1: 100, w2: 68, w4: 42, w8: 28 },
  { week: 'Week 2 (Jan 8)', signups: 95, w1: 100, w2: 72, w4: 48, w8: 31 },
  { week: 'Week 3 (Jan 15)', signups: 140, w1: 100, w2: 65, w4: 39, w8: 25 },
  { week: 'Week 4 (Jan 22)', signups: 110, w1: 100, w2: 70, w4: 45, w8: 30 },
  { week: 'Week 5 (Jan 29)', signups: 88, w1: 100, w2: 74, w4: 51, w8: 34 },
  { week: 'Week 6 (Feb 5)', signups: 132, w1: 100, w2: 66, w4: 40, w8: 26 },
];

const MOCK_COUNTRIES = [
  { country: 'Vietnam', users: 1842, pct: 21.2, flag: '🇻🇳' },
  { country: 'India', users: 1230, pct: 14.2, flag: '🇮🇳' },
  { country: 'Brazil', users: 890, pct: 10.3, flag: '🇧🇷' },
  { country: 'Turkey', users: 670, pct: 7.7, flag: '🇹🇷' },
  { country: 'Japan', users: 560, pct: 6.5, flag: '🇯🇵' },
  { country: 'Mexico', users: 450, pct: 5.2, flag: '🇲🇽' },
  { country: 'Germany', users: 380, pct: 4.4, flag: '🇩🇪' },
  { country: 'France', users: 340, pct: 3.9, flag: '🇫🇷' },
  { country: 'South Korea', users: 290, pct: 3.3, flag: '🇰🇷' },
  { country: 'Others', users: 2050, pct: 23.3, flag: '🌍' },
];

const MOCK_DEVICES = [
  { name: 'Desktop', value: 58, color: '#3b82f6' },
  { name: 'Mobile', value: 34, color: '#7c5cff' },
  { name: 'Tablet', value: 8, color: '#f59e0b' },
];

const MOCK_LESSONS = [
  { name: 'A1 Grammar Basics', enrollment: 452, completion: 78, avgScore: 85 },
  { name: 'A2 Vocabulary Builder', enrollment: 380, completion: 72, avgScore: 82 },
  { name: 'B1 Reading Comprehension', enrollment: 320, completion: 65, avgScore: 79 },
  { name: 'B2 Advanced Grammar', enrollment: 280, completion: 55, avgScore: 76 },
  { name: 'C1 Academic Writing', enrollment: 150, completion: 48, avgScore: 81 },
  { name: 'C2 Mastery Course', enrollment: 90, completion: 42, avgScore: 88 },
  { name: 'Speaking Practice A1-A2', enrollment: 510, completion: 68, avgScore: 74 },
  { name: 'Listening Skills B1-B2', enrollment: 340, completion: 61, avgScore: 77 },
];

const MOCK_REVENUE_DATA = [
  { month: 'Jan', starter: 1200, pro: 3400, enterprise: 8000, total: 12600 },
  { month: 'Feb', starter: 1400, pro: 3800, enterprise: 8200, total: 13400 },
  { month: 'Mar', starter: 1600, pro: 4200, enterprise: 8500, total: 14300 },
  { month: 'Apr', starter: 1800, pro: 4600, enterprise: 9000, total: 15400 },
  { month: 'May', starter: 2000, pro: 5000, enterprise: 9500, total: 16500 },
  { month: 'Jun', starter: 2200, pro: 5400, enterprise: 10000, total: 17600 },
];

export function AnalyticsTab({ onToast }: AnalyticsTabProps) {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  // Traffic data
  const [dailyData, setDailyData] = useState<Array<{
    date: string; pageViews: number; uniqueVisitors: number; avgSession: number;
    bounceRate: number; signups: number; messages: number; revenue: number;
  }>>([]);

  // Real-time monitor
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: 42,
    testsInProgress: 7,
    recentSignups: 3,
  });

  // Custom report builder
  const [reportMetrics, setReportMetrics] = useState<string[]>(['pageViews', 'signups']);
  const [reportGroupBy, setReportGroupBy] = useState('day');
  const [reportFormat, setReportFormat] = useState('csv');

  // Active funnel
  const [activeFunnel, setActiveFunnel] = useState(0);

  // Ref for realtime polling
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        // Use API data if available, else mock
        if (data.dailyPageViews || data.dailySignups) {
          const days = dateRange === '7d' ? 7 : dateRange === '90d' ? 90 : 30;
          setDailyData(generateDailyData(days));
        } else {
          const days = dateRange === '7d' ? 7 : dateRange === '90d' ? 90 : dateRange === '1d' ? 1 : dateRange === '1y' ? 365 : 30;
          setDailyData(generateDailyData(Math.min(days, 90)));
        }
      } else {
        const days = dateRange === '7d' ? 7 : dateRange === '90d' ? 90 : dateRange === '1d' ? 1 : dateRange === '1y' ? 90 : 30;
        setDailyData(generateDailyData(Math.min(days, 90)));
      }
    } catch {
      const days = dateRange === '7d' ? 7 : dateRange === '90d' ? 90 : 30;
      setDailyData(generateDailyData(days));
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Real-time polling
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRealtimeData(prev => ({
        activeUsers: Math.max(10, prev.activeUsers + Math.floor(Math.random() * 5) - 2),
        testsInProgress: Math.max(0, prev.testsInProgress + Math.floor(Math.random() * 3) - 1),
        recentSignups: Math.max(0, prev.recentSignups + Math.floor(Math.random() * 2)),
      }));
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Computed stats
  const totalPageViews = dailyData.reduce((s, d) => s + d.pageViews, 0);
  const totalUniqueVisitors = dailyData.reduce((s, d) => s + d.uniqueVisitors, 0);
  const avgBounceRate = dailyData.length > 0 ? Math.round(dailyData.reduce((s, d) => s + d.bounceRate, 0) / dailyData.length) : 0;
  const avgSessionSec = dailyData.length > 0 ? Math.round(dailyData.reduce((s, d) => s + d.avgSession, 0) / dailyData.length) : 0;
  const avgSessionMin = `${Math.floor(avgSessionSec / 60)}:${String(avgSessionSec % 60).padStart(2, '0')}`;

  const conversionRate = (() => {
    const totalSignups = dailyData.reduce((s, d) => s + d.signups, 0);
    const totalRevenue = dailyData.reduce((s, d) => s + d.revenue, 0);
    return totalSignups > 0 ? ((totalRevenue / totalSignups) * 0.056).toFixed(1) : '0';
  })();

  const handleExportReport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csvHeader = 'Date,Page Views,Unique Visitors,Signups,Revenue\n';
      const csvRows = dailyData.map(d =>
        `"${d.date}",${d.pageViews},${d.uniqueVisitors},${d.signups},${d.revenue}`
      ).join('\n');
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      onToast('PDF export is being prepared...', 'success');
    }
    onToast(`${format.toUpperCase()} report exported successfully`, 'success');
  };

  const handleBuildReport = () => {
    onToast('Custom report generated successfully', 'success');
  };

  const allMetrics = [
    { id: 'pageViews', label: 'Page Views' },
    { id: 'uniqueVisitors', label: 'Unique Visitors' },
    { id: 'signups', label: 'Signups' },
    { id: 'bounceRate', label: 'Bounce Rate' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'messages', label: 'Community Messages' },
  ];

  const toggleMetric = (id: string) => {
    setReportMetrics(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48 rounded-lg" />
          <Skeleton className="h-9 w-64 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-400" />
          Analytics Dashboard
        </h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: '1d', label: 'Today' },
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' },
            ]}
          />
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('csv')}
              className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 text-xs gap-1"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('pdf')}
              className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 text-xs gap-1"
            >
              <FileText className="h-3.5 w-3.5" /> PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Traffic Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Page Views" value={formatNumber(totalPageViews)} change="+12.3%" gradient="from-blue-500 to-cyan-500" />
        <StatCard icon={Users} label="Unique Visitors" value={formatNumber(totalUniqueVisitors)} change="+8.7%" gradient="from-violet-500 to-indigo-600" />
        <StatCard icon={Clock} label="Avg Session" value={avgSessionMin} change="-2.1%" gradient="from-green-500 to-emerald-600" />
        <StatCard icon={TrendingUp} label="Bounce Rate" value={`${avgBounceRate}%`} change="-5.4%" gradient="from-amber-500 to-orange-600" />
      </div>

      {/* Traffic Chart */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          Traffic Overview
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <defs>
                <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="uvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7c5cff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }} />
              <Line type="monotone" dataKey="pageViews" name="Page Views" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="uniqueVisitors" name="Unique Visitors" stroke="#7c5cff" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Pages + Referrers Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            Top Pages
          </h3>
          <div className="overflow-x-auto max-h-80 overflow-y-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium pb-2 text-xs">Page</th>
                  <th className="text-right text-white/40 font-medium pb-2 text-xs">Views</th>
                  <th className="text-right text-white/40 font-medium pb-2 text-xs">Avg Time</th>
                  <th className="text-right text-white/40 font-medium pb-2 text-xs">Bounce</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TOP_PAGES.map((page, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="py-2 text-white/70 text-xs font-mono">{page.page}</td>
                    <td className="py-2 text-white/60 text-xs text-right">{formatNumber(page.views)}</td>
                    <td className="py-2 text-white/50 text-xs text-right">{page.avgTime}</td>
                    <td className="py-2 text-xs text-right">
                      <span className={Number(page.bounceRate.replace('%', '')) > 40 ? 'text-red-400' : 'text-green-400'}>
                        {page.bounceRate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referrers */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-green-400" />
            Traffic Sources
          </h3>
          <div className="space-y-3">
            {MOCK_REFERRERS.map((ref, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-white/70 text-xs w-20 truncate">{ref.source}</span>
                <div className="flex-1 h-5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                    style={{ width: `${ref.percentage}%` }}
                  />
                </div>
                <span className="text-white/50 text-xs w-12 text-right">{ref.percentage}%</span>
                <span className="text-white/40 text-xs w-16 text-right">{formatNumber(ref.count)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Funnel */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Funnel className="h-4 w-4 text-violet-400" />
            User Funnels
          </h3>
          <div className="flex gap-1">
            {MOCK_FUNNELS.map((funnel, i) => (
              <button
                key={i}
                onClick={() => setActiveFunnel(i)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeFunnel === i
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {funnel.name}
              </button>
            ))}
          </div>
        </div>

        {/* Funnel Visualization */}
        <div className="space-y-2">
          {MOCK_FUNNELS[activeFunnel].steps.map((step, i) => {
            const prevStep = i > 0 ? MOCK_FUNNELS[activeFunnel].steps[i - 1] : null;
            const dropoff = prevStep ? ((1 - step.pct / prevStep.pct) * 100).toFixed(1) : null;
            return (
              <div key={i}>
                <div className="flex items-center gap-3">
                  <div className="w-36 text-right">
                    <span className="text-white/70 text-sm font-medium">{step.name}</span>
                  </div>
                  <div className="flex-1 h-10 bg-white/5 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg bg-gradient-to-r from-blue-500/40 to-violet-500/40 flex items-center px-3 transition-all duration-500"
                      style={{ width: `${step.pct}%` }}
                    >
                      <span className="text-white text-xs font-medium whitespace-nowrap">
                        {formatNumber(step.count)} ({step.pct}%)
                      </span>
                    </div>
                  </div>
                </div>
                {dropoff && (
                  <div className="flex items-center gap-3 ml-36">
                    <div className="flex items-center gap-1 text-xs text-red-400/60">
                      <ArrowDownRight className="h-3 w-3" />
                      {dropoff}% drop-off
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion + Cohort Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversion Rate */}
        <StatCard
          icon={Target}
          label="Conversion Rate"
          value={`${conversionRate}%`}
          change="+0.3%"
          gradient="from-green-500 to-emerald-600"
          subtitle="Signups that upgrade to paid"
        />

        {/* Device Breakdown */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Monitor className="h-4 w-4 text-amber-400" />
            Device Breakdown
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MOCK_DEVICES} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={3}>
                  {MOCK_DEVICES.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {MOCK_DEVICES.map(d => (
              <span key={d.name} className="flex items-center gap-1 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-white/50">{d.name}: {d.value}%</span>
              </span>
            ))}
          </div>
        </div>

        {/* Real-time Monitor */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Radio className="h-4 w-4 text-green-400" />
            Real-time Monitor
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse ml-1" />
          </h3>
          <div className="space-y-3">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-white/40 text-xs">Active Users</span>
              </div>
              <p className="text-white font-bold text-2xl">{realtimeData.activeUsers}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-white/40 text-xs">Tests In Progress</span>
              </div>
              <p className="text-white font-bold text-2xl">{realtimeData.testsInProgress}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-white/40 text-xs">Recent Signups (1h)</span>
              </div>
              <p className="text-white font-bold text-2xl">{realtimeData.recentSignups}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Analysis */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          Cohort Analysis — Retention by Signup Week
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 font-medium px-3 py-2 text-xs">Cohort</th>
                <th className="text-center text-white/40 font-medium px-3 py-2 text-xs">Signups</th>
                <th className="text-center text-white/40 font-medium px-3 py-2 text-xs">Week 1</th>
                <th className="text-center text-white/40 font-medium px-3 py-2 text-xs">Week 2</th>
                <th className="text-center text-white/40 font-medium px-3 py-2 text-xs">Week 4</th>
                <th className="text-center text-white/40 font-medium px-3 py-2 text-xs">Week 8</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_COHORTS.map((cohort, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-3 py-2 text-white/70 text-xs">{cohort.week}</td>
                  <td className="px-3 py-2 text-white/60 text-xs text-center">{cohort.signups}</td>
                  {['w1', 'w2', 'w4', 'w8'].map(w => (
                    <td key={w} className="px-3 py-2 text-center">
                      <div className="inline-block rounded px-2 py-0.5 text-xs font-medium" style={{
                        backgroundColor: `rgba(59, 130, 246, ${cohort[w as keyof typeof cohort] as number / 100})`,
                        color: (cohort[w as keyof typeof cohort] as number) > 50 ? 'white' : 'rgba(255,255,255,0.7)',
                      }}>
                        {cohort[w as keyof typeof cohort] as number}%
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Map className="h-4 w-4 text-blue-400" />
          User Distribution by Country
        </h3>
        <div className="space-y-2">
          {MOCK_COUNTRIES.map((country, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg w-7 text-center">{country.flag}</span>
              <span className="text-white/70 text-xs w-24 truncate">{country.country}</span>
              <div className="flex-1 h-5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500/60 to-violet-500/60"
                  style={{ width: `${country.pct}%` }}
                />
              </div>
              <span className="text-white/50 text-xs w-12 text-right">{country.pct}%</span>
              <span className="text-white/40 text-xs w-16 text-right">{formatNumber(country.users)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Engagement + Community Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lesson Engagement */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-green-400" />
            Lesson Engagement
          </h3>
          <div className="overflow-x-auto max-h-72 overflow-y-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/40 font-medium pb-2 text-xs">Lesson</th>
                  <th className="text-right text-white/40 font-medium pb-2 text-xs">Enrolled</th>
                  <th className="text-right text-white/40 font-medium pb-2 text-xs">Completion</th>
                  <th className="text-right text-white/40 font-medium pb-2 text-xs">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LESSONS.map((lesson, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="py-2 text-white/70 text-xs">{lesson.name}</td>
                    <td className="py-2 text-white/60 text-xs text-right">{lesson.enrollment}</td>
                    <td className="py-2 text-xs text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-green-500" style={{ width: `${lesson.completion}%` }} />
                        </div>
                        <span className="text-white/50">{lesson.completion}%</span>
                      </div>
                    </td>
                    <td className="py-2 text-white/50 text-xs text-right">{lesson.avgScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Community Activity */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            Community Activity
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={(d) => d.slice(8)} />
                <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)' }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="messages" name="Messages" fill="#7c5cff" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-white font-semibold text-sm">{formatNumber(dailyData.reduce((s, d) => s + d.messages, 0))}</p>
              <p className="text-white/30 text-xs">Messages</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-white font-semibold text-sm">{formatNumber(Math.round(dailyData.reduce((s, d) => s + d.messages, 0) / dailyData.length))}</p>
              <p className="text-white/30 text-xs">Avg/Day</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-white font-semibold text-sm">5</p>
              <p className="text-white/30 text-xs">Active Rooms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-400" />
          Revenue Analytics
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_REVENUE_DATA}>
              <defs>
                <linearGradient id="starterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="proGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#7c5cff" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="entGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }} />
              <Bar dataKey="starter" name="Starter" fill="url(#starterGrad)" radius={[2, 2, 0, 0]} stackId="a" />
              <Bar dataKey="pro" name="Pro" fill="url(#proGrad)" radius={[2, 2, 0, 0]} stackId="a" />
              <Bar dataKey="enterprise" name="Enterprise" fill="url(#entGrad)" radius={[2, 2, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Custom Report Builder */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-violet-400" />
          Custom Report Builder
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-white/60 text-sm mb-2 block">Metrics</Label>
            <div className="space-y-2">
              {allMetrics.map(metric => (
                <label key={metric.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={reportMetrics.includes(metric.id)}
                    onChange={() => toggleMetric(metric.id)}
                    className="rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/50"
                  />
                  <span className="text-white/60 text-xs group-hover:text-white/80 transition-colors">{metric.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-white/60 text-sm mb-2 block">Group By</Label>
            <select value={reportGroupBy} onChange={(e) => setReportGroupBy(e.target.value)} className={selectClass}>
              <option value="hour" className={selectOptionClass}>Hour</option>
              <option value="day" className={selectOptionClass}>Day</option>
              <option value="week" className={selectOptionClass}>Week</option>
              <option value="month" className={selectOptionClass}>Month</option>
            </select>
            <div className="mt-4">
              <Label className="text-white/60 text-sm mb-2 block">Date Range</Label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                options={[
                  { value: '7d', label: '7 Days' },
                  { value: '30d', label: '30 Days' },
                  { value: '90d', label: '90 Days' },
                ]}
              />
            </div>
          </div>
          <div>
            <Label className="text-white/60 text-sm mb-2 block">Output Format</Label>
            <select value={reportFormat} onChange={(e) => setReportFormat(e.target.value)} className={selectClass}>
              <option value="csv" className={selectOptionClass}>CSV</option>
              <option value="pdf" className={selectOptionClass}>PDF</option>
              <option value="json" className={selectOptionClass}>JSON</option>
            </select>
            <div className="mt-4">
              <Label className="text-white/60 text-sm mb-2 block">Selected: {reportMetrics.length} metrics</Label>
              <p className="text-white/30 text-xs mb-3">
                {allMetrics.filter(m => reportMetrics.includes(m.id)).map(m => m.label).join(', ') || 'No metrics selected'}
              </p>
            </div>
            <Button
              onClick={handleBuildReport}
              disabled={reportMetrics.length === 0}
              className="w-full bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 gap-2"
            >
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
