'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BarChart3,
  Users,
  CreditCard,
  ClipboardList,
  BookOpen,
  Server,
  Loader2,
  RefreshCw,
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  DollarSign,
  Award,
  Database,
  Cpu,
  Globe,
  Key,
  Zap,
  UserPlus,
  Lock,
  Eye,
  XCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ─── Constants ────────────────────────────────────────────────────────────────

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SKILLS = ['grammar', 'vocabulary', 'reading', 'listening'];

const CEFR_COLORS_DARK: Record<string, string> = {
  A1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  A2: 'bg-green-500/20 text-green-400 border-green-500/30',
  B1: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  B2: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  C1: 'bg-red-500/20 text-red-400 border-red-500/30',
  C2: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const CEFR_PIE_COLORS: Record<string, string> = {
  A1: '#3B82F6',
  A2: '#22C55E',
  B1: '#EAB308',
  B2: '#F97316',
  C1: '#EF4444',
  C2: '#A855F7',
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'assessments', label: 'Assessments', icon: ClipboardList },
  { id: 'questions', label: 'Question Bank', icon: BookOpen },
  { id: 'system', label: 'System', icon: Server },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ─── Interfaces ───────────────────────────────────────────────────────────────

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

interface AnalyticsData {
  kpis: AnalyticsKPIs;
  dailyPageViews: Record<string, number>;
  dailySignups: Record<string, number>;
  conversionFunnel: { visitors: number; signups: number; assessments: number; certificates: number };
  cefrDistribution: Record<string, number>;
  topPages: { path: string; views: number }[];
}

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  role: string;
  isDemo: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { assessments: number; certificates: number; payments: number };
}

interface AdminPayment {
  id: string;
  userId: string;
  paypalOrderId: string | null;
  paypalCaptureId: string | null;
  amount: number;
  currency: string;
  status: string;
  plan: string | null;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
}

interface AdminAssessment {
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

interface AdminCertificate {
  id: string;
  verificationId: string;
  userId: string;
  assessmentId: string;
  userName: string;
  cefrLevel: string;
  score: number;
  issuedAt: string;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
}

interface QuestionStats {
  stats: Record<string, Record<string, number>>;
  total: number;
}

interface SystemData {
  database: {
    tables: { users: number; questions: number; payments: number; assessments: number; certificates: number; pageViews: number };
    sizeMB: number;
  };
  environment: {
    nodeVersion: string;
    platform: string;
    env: string;
    googleAiKeySet: boolean;
    paypalMode: string;
    appUrl: string;
  };
  uptime: number;
  memory: { rss: number; heapUsed: number; heapTotal: number };
}

// ─── Custom Tooltip for Charts ────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 rounded-xl border border-white/10 text-sm">
      <p className="text-white/60 text-xs mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-white font-medium" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
}

// ─── Stat Card Component ──────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  gradient: string;
}) {
  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-full h-full" />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-white/50 text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {change && (
          <span className={`text-xs font-medium flex items-center gap-0.5 mb-1 ${change.startsWith('+') ? 'text-green-400' : change.startsWith('-') ? 'text-red-400' : 'text-white/40'}`}>
            {change.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : change.startsWith('-') ? <ArrowDownRight className="h-3 w-3" /> : null}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Pagination Component ─────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-white/40">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl animate-slide-up ${
      type === 'success'
        ? 'bg-green-500/20 border border-green-500/30 text-green-400 backdrop-blur-xl'
        : 'bg-red-500/20 border border-red-500/30 text-red-400 backdrop-blur-xl'
    }`}>
      {type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {message}
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authIsLoading, user, accessToken } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ── Analytics ─────────────────────────────────────────────────────
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // ── Users ─────────────────────────────────────────────────────────
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersPagination, setUsersPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersFilterPlan, setUsersFilterPlan] = useState<string>('all');
  const [usersFilterRole, setUsersFilterRole] = useState<string>('all');

  // ── Payments ──────────────────────────────────────────────────────
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [paymentsPagination, setPaymentsPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsFilterStatus, setPaymentsFilterStatus] = useState<string>('all');
  const [revenueKpis, setRevenueKpis] = useState({ totalRevenue: 0, completedPayments: 0 });

  // ── Assessments ───────────────────────────────────────────────────
  const [assessments, setAssessments] = useState<AdminAssessment[]>([]);
  const [assessmentsPagination, setAssessmentsPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [assessmentsLoading, setAssessmentsLoading] = useState(true);

  // ── Certificates ──────────────────────────────────────────────────
  const [certificates, setCertificates] = useState<AdminCertificate[]>([]);
  const [certificatesPagination, setCertificatesPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [certificatesLoading, setCertificatesLoading] = useState(true);
  const [certCefrDistribution, setCertCefrDistribution] = useState<Record<string, number>>({});

  // ── Question Bank ─────────────────────────────────────────────────
  const [questionStats, setQuestionStats] = useState<QuestionStats | null>(null);
  const [questionStatsLoading, setQuestionStatsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(CEFR_LEVELS);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(SKILLS);
  const [countPerSlot, setCountPerSlot] = useState(50);
  const [generating, setGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<{ totalGenerated: number; totalSkipped: number; totalErrors: number; results: Array<{ level: string; skill: string; generated: number; skipped: number; errors: number }> } | null>(null);
  const [generationError, setGenerationError] = useState('');

  // ── System ────────────────────────────────────────────────────────
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [systemLoading, setSystemLoading] = useState(true);
  const [paypalTestResult, setPaypalTestResult] = useState<{ status: string; message: string } | null>(null);
  const [paypalTesting, setPaypalTesting] = useState(false);

  // ── User Details Dialog ───────────────────────────────────────────
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [promoting, setPromoting] = useState(false);

  // ── Demo User Dialog ──────────────────────────────────────────────
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
  const [demoCount, setDemoCount] = useState(1);
  const [demoPlan, setDemoPlan] = useState<'free' | 'premium'>('free');
  const [creatingDemo, setCreatingDemo] = useState(false);
  const [demoResult, setDemoResult] = useState<{ message: string; credentials: Array<{ email: string; password: string; userId: string }> } | null>(null);

  // ── Auth Check ────────────────────────────────────────────────────
  useEffect(() => {
    if (!authIsLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [authIsLoading, isAuthenticated, user, router]);

  // ── Helper: Auth Headers ──────────────────────────────────────────
  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }), [accessToken]);

  // ── Fetch Analytics ───────────────────────────────────────────────
  const fetchAnalytics = useCallback(async () => {
    if (!accessToken) return;
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.ok) setAnalytics(await res.json());
    } catch (e) { console.error('Analytics fetch error:', e); }
    finally { setAnalyticsLoading(false); }
  }, [accessToken]);

  // ── Fetch Users ───────────────────────────────────────────────────
  const fetchUsers = useCallback(async (page = 1, search = '') => {
    if (!accessToken) return;
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/users?${params}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setUsersPagination(data.pagination);
      }
    } catch (e) { console.error('Users fetch error:', e); }
    finally { setUsersLoading(false); }
  }, [accessToken]);

  // ── Fetch Payments ────────────────────────────────────────────────
  const fetchPayments = useCallback(async (page = 1, status = '') => {
    if (!accessToken) return;
    setPaymentsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (status && status !== 'all') params.set('status', status);
      const res = await fetch(`/api/admin/payments?${params}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments);
        setPaymentsPagination(data.pagination);
        setRevenueKpis(data.revenueKpis);
      }
    } catch (e) { console.error('Payments fetch error:', e); }
    finally { setPaymentsLoading(false); }
  }, [accessToken]);

  // ── Fetch Assessments ─────────────────────────────────────────────
  const fetchAssessments = useCallback(async (page = 1) => {
    if (!accessToken) return;
    setAssessmentsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`/api/admin/assessments?${params}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.ok) {
        const data = await res.json();
        setAssessments(data.assessments);
        setAssessmentsPagination(data.pagination);
      }
    } catch (e) { console.error('Assessments fetch error:', e); }
    finally { setAssessmentsLoading(false); }
  }, [accessToken]);

  // ── Fetch Certificates ────────────────────────────────────────────
  const fetchCertificates = useCallback(async (page = 1) => {
    if (!accessToken) return;
    setCertificatesLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`/api/admin/certificates?${params}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates);
        setCertificatesPagination(data.pagination);
        setCertCefrDistribution(data.cefrDistribution);
      }
    } catch (e) { console.error('Certificates fetch error:', e); }
    finally { setCertificatesLoading(false); }
  }, [accessToken]);

  // ── Fetch Question Stats ──────────────────────────────────────────
  const fetchQuestionStats = useCallback(async () => {
    if (!accessToken) return;
    setQuestionStatsLoading(true);
    try {
      const res = await fetch('/api/admin/questions/stats', { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.ok) setQuestionStats(await res.json());
    } catch (e) { console.error('Question stats error:', e); }
    finally { setQuestionStatsLoading(false); }
  }, [accessToken]);

  // ── Fetch System ──────────────────────────────────────────────────
  const fetchSystem = useCallback(async () => {
    if (!accessToken) return;
    setSystemLoading(true);
    try {
      const res = await fetch('/api/admin/system', { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.ok) setSystemData(await res.json());
    } catch (e) { console.error('System fetch error:', e); }
    finally { setSystemLoading(false); }
  }, [accessToken]);

  // ── Initial data fetch ────────────────────────────────────────────
  useEffect(() => {
    if (authIsLoading || !isAuthenticated || !accessToken) return;
    fetchAnalytics();
    fetchUsers();
    fetchPayments();
    fetchAssessments();
    fetchCertificates();
    fetchQuestionStats();
    fetchSystem();
  }, [authIsLoading, isAuthenticated, accessToken, fetchAnalytics, fetchUsers, fetchPayments, fetchAssessments, fetchCertificates, fetchQuestionStats, fetchSystem]);

  // ── Tab change refresh ────────────────────────────────────────────
  useEffect(() => {
    if (authIsLoading || !isAuthenticated || !accessToken) return;
    // Refresh data when switching tabs
  }, [activeTab, authIsLoading, isAuthenticated, accessToken]);

  // ── Search debounce ───────────────────────────────────────────────
  useEffect(() => {
    if (!accessToken) return;
    const t = setTimeout(() => fetchUsers(1, usersSearch), 300);
    return () => clearTimeout(t);
  }, [usersSearch, accessToken, fetchUsers]);

  // ── Actions ───────────────────────────────────────────────────────
  const handlePromoteUser = async (email: string) => {
    if (!accessToken) return;
    setPromoting(true);
    try {
      const res = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: data.message || 'User promoted to admin', type: 'success' });
        fetchUsers(usersPagination.page, usersSearch);
      } else {
        setToast({ message: data.error || 'Failed to promote user', type: 'error' });
      }
    } catch {
      setToast({ message: 'Failed to promote user', type: 'error' });
    } finally { setPromoting(false); }
  };

  const handleResetPassword = async (userId: string) => {
    if (!accessToken) return;
    setResettingPassword(true);
    try {
      const res = await fetch('/api/admin/users/reset-password', {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ userId, newPassword: 'NewPass123!' }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: 'Password reset to: NewPass123!', type: 'success' });
      } else {
        setToast({ message: data.error || 'Failed to reset password', type: 'error' });
      }
    } catch {
      setToast({ message: 'Failed to reset password', type: 'error' });
    } finally { setResettingPassword(false); }
  };

  const handleCreateDemoUsers = async () => {
    if (!accessToken) return;
    setCreatingDemo(true);
    setDemoResult(null);
    try {
      const res = await fetch('/api/admin/users/demo', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ count: demoCount, plan: demoPlan }),
      });
      const data = await res.json();
      if (res.ok) {
        setDemoResult(data);
        setToast({ message: `Created ${demoCount} demo account(s)`, type: 'success' });
        fetchUsers(1, usersSearch);
      } else {
        setToast({ message: data.error || 'Failed to create demo users', type: 'error' });
      }
    } catch {
      setToast({ message: 'Failed to create demo users', type: 'error' });
    } finally { setCreatingDemo(false); }
  };

  const handleTestPaypal = async () => {
    if (!accessToken) return;
    setPaypalTesting(true);
    setPaypalTestResult(null);
    try {
      const res = await fetch('/api/admin/test-paypal', { headers: { Authorization: `Bearer ${accessToken}` } });
      const data = await res.json();
      setPaypalTestResult(data);
    } catch {
      setPaypalTestResult({ status: 'error', message: 'Connection failed' });
    } finally { setPaypalTesting(false); }
  };

  const handleBatchGenerate = async () => {
    if (!accessToken) return;
    setGenerating(true);
    setGenerationError('');
    setGenerationResult(null);
    try {
      const res = await fetch('/api/admin/questions/batch', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ levels: selectedLevels, skills: selectedSkills, countPerSlot }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Generation failed');
      setGenerationResult(data);
      fetchQuestionStats();
    } catch (e: unknown) {
      setGenerationError(e instanceof Error ? e.message : 'An error occurred');
    } finally { setGenerating(false); }
  };

  // ── Toggle helpers for question bank ──────────────────────────────
  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]);
  };
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  };
  const toggleAllLevels = () => setSelectedLevels((prev) => prev.length === CEFR_LEVELS.length ? [] : [...CEFR_LEVELS]);
  const toggleAllSkills = () => setSelectedSkills((prev) => prev.length === SKILLS.length ? [] : [...SKILLS]);

  // ── Prepare chart data ────────────────────────────────────────────
  const revenueChartData = analytics?.dailyPageViews
    ? Object.entries(analytics.dailyPageViews).map(([date, views]) => {
        const signups = analytics.dailySignups?.[date] || 0;
        return { date: date.slice(5), views, signups };
      })
    : [];

  const cefrChartData = analytics?.cefrDistribution
    ? Object.entries(analytics.cefrDistribution).map(([level, count]) => ({ level, count }))
    : [];

  const certCefrChartData = Object.entries(certCefrDistribution).map(([level, count]) => ({ level, count }));

  const totalSlots = selectedLevels.length * selectedSkills.length;
  const totalTarget = totalSlots * countPerSlot;

  // ── Filtered users (client-side filter for plan/role) ─────────────
  const filteredUsers = users.filter((u) => {
    if (usersFilterPlan !== 'all' && u.plan !== usersFilterPlan) return false;
    if (usersFilterRole !== 'all' && u.role !== usersFilterRole) return false;
    return true;
  });

  // ── Loading state ─────────────────────────────────────────────────
  if (authIsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64 bg-white/5" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 bg-white/5" />)}
            </div>
            <Skeleton className="h-64 w-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <div className="flex-1 py-6 px-4">
        <div className="container max-w-7xl mx-auto space-y-6">

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-400" />
                <span className="gradient-text-static">Super Admin</span> Dashboard
              </h1>
              <p className="text-white/40 text-sm mt-1">Manage your CEFR assessment platform</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { fetchAnalytics(); fetchSystem(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>
          </div>

          {/* ── Tab Navigation ─────────────────────────────────────── */}
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ════════════════════════════════════════════════════════════
              TAB: OVERVIEW / ANALYTICS
              ════════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={analytics?.kpis.totalUsers?.toLocaleString() ?? '—'}
                  change={analytics?.kpis.todaySignups ? `+${analytics.kpis.todaySignups} today` : undefined}
                  gradient="from-purple-500 to-indigo-600"
                />
                <StatCard
                  icon={ClipboardList}
                  label="Total Assessments"
                  value={analytics?.kpis.totalAssessments?.toLocaleString() ?? '—'}
                  change={analytics?.kpis.todayAssessments ? `+${analytics.kpis.todayAssessments} today` : undefined}
                  gradient="from-cyan-500 to-blue-600"
                />
                <StatCard
                  icon={DollarSign}
                  label="Revenue"
                  value={analytics?.kpis.totalRevenue != null ? `$${analytics.kpis.totalRevenue.toFixed(2)}` : '—'}
                  change={analytics?.kpis.todayRevenue ? `+$${analytics.kpis.todayRevenue.toFixed(2)} today` : undefined}
                  gradient="from-green-500 to-emerald-600"
                />
                <StatCard
                  icon={Award}
                  label="Certificates"
                  value={analytics?.kpis.totalCertificates?.toLocaleString() ?? '—'}
                  gradient="from-orange-500 to-red-600"
                />
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Traffic Chart */}
                <div className="lg:col-span-2 glass-card p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-400" />
                    Traffic &amp; Signups (30 days)
                  </h3>
                  {analyticsLoading ? (
                    <Skeleton className="h-64 w-full bg-white/5" />
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueChartData}>
                          <defs>
                            <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="signupsGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                          <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                          <Tooltip content={<ChartTooltip />} />
                          <Area type="monotone" dataKey="views" name="Page Views" stroke="#8B5CF6" fill="url(#viewsGrad)" strokeWidth={2} />
                          <Area type="monotone" dataKey="signups" name="Signups" stroke="#EC4899" fill="url(#signupsGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* CEFR Distribution */}
                <div className="glass-card p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-pink-400" />
                    CEFR Distribution
                  </h3>
                  {analyticsLoading ? (
                    <Skeleton className="h-64 w-full bg-white/5" />
                  ) : cefrChartData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={cefrChartData} dataKey="count" nameKey="level" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2}>
                            {cefrChartData.map((entry) => (
                              <Cell key={entry.level} fill={CEFR_PIE_COLORS[entry.level] || '#6B7280'} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {cefrChartData.map((entry) => (
                          <span key={entry.level} className="flex items-center gap-1 text-xs text-white/50">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CEFR_PIE_COLORS[entry.level] }} />
                            {entry.level}: {entry.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-white/30 text-sm">No data yet</div>
                  )}
                </div>
              </div>

              {/* Conversion Funnel + Top Pages + System Health */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Conversion Funnel */}
                <div className="glass-card p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    Conversion Funnel (30d)
                  </h3>
                  {analytics?.conversionFunnel ? (
                    <div className="space-y-3">
                      {[
                        { label: 'Visitors', value: analytics.conversionFunnel.visitors, color: 'from-blue-500 to-cyan-500', pct: 100 },
                        { label: 'Signups', value: analytics.conversionFunnel.signups, color: 'from-purple-500 to-indigo-500', pct: analytics.conversionFunnel.visitors ? Math.round((analytics.conversionFunnel.signups / analytics.conversionFunnel.visitors) * 100) : 0 },
                        { label: 'Assessments', value: analytics.conversionFunnel.assessments, color: 'from-pink-500 to-rose-500', pct: analytics.conversionFunnel.visitors ? Math.round((analytics.conversionFunnel.assessments / analytics.conversionFunnel.visitors) * 100) : 0 },
                        { label: 'Certificates', value: analytics.conversionFunnel.certificates, color: 'from-green-500 to-emerald-500', pct: analytics.conversionFunnel.visitors ? Math.round((analytics.conversionFunnel.certificates / analytics.conversionFunnel.visitors) * 100) : 0 },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/60">{item.label}</span>
                            <span className="text-white font-medium">{item.value} <span className="text-white/30 text-xs">({item.pct}%)</span></span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${Math.max(item.pct, 1)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white/30 text-sm text-center py-8">Loading...</div>
                  )}
                </div>

                {/* Top Pages */}
                <div className="glass-card p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-cyan-400" />
                    Top Pages
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    {analytics?.topPages?.length ? analytics.topPages.slice(0, 10).map((page, i) => (
                      <div key={page.path} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                        <span className="text-sm text-white/60 truncate max-w-[180px]">{page.path}</span>
                        <span className="text-sm text-white font-medium shrink-0 ml-2">{page.views}</span>
                      </div>
                    )) : (
                      <div className="text-white/30 text-sm text-center py-8">No data yet</div>
                    )}
                  </div>
                </div>

                {/* System Health */}
                <div className="glass-card p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-green-400" />
                    System Health
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Database', ok: !!systemData, detail: systemData ? `${systemData.database.tables.users} users` : 'Checking...' },
                      { label: 'AI Service', ok: systemData?.environment.googleAiKeySet ?? false, detail: systemData?.environment.googleAiKeySet ? 'API Key Set' : 'Not Configured' },
                      { label: 'PayPal', ok: paypalTestResult?.status === 'ok', detail: paypalTestResult?.status === 'ok' ? `${paypalTestResult.mode} mode` : systemData?.environment.paypalMode || 'Unknown' },
                      { label: 'Uptime', ok: true, detail: systemData ? `${Math.floor(systemData.uptime / 3600)}h ${Math.floor((systemData.uptime % 3600) / 60)}m` : '—' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${item.ok ? 'bg-green-400 shadow-sm shadow-green-400/50' : 'bg-yellow-400 shadow-sm shadow-yellow-400/50'}`} />
                          <span className="text-sm text-white/60">{item.label}</span>
                        </div>
                        <span className="text-sm text-white/80">{item.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB: USERS
              ════════════════════════════════════════════════════════════ */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="glass-card p-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap gap-3 items-center flex-1">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={usersSearch}
                        onChange={(e) => setUsersSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                      />
                    </div>
                    <select
                      value={usersFilterPlan}
                      onChange={(e) => setUsersFilterPlan(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="all" className="bg-[#1a1f36]">All Plans</option>
                      <option value="free" className="bg-[#1a1f36]">Free</option>
                      <option value="premium" className="bg-[#1a1f36]">Premium</option>
                    </select>
                    <select
                      value={usersFilterRole}
                      onChange={(e) => setUsersFilterRole(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="all" className="bg-[#1a1f36]">All Roles</option>
                      <option value="user" className="bg-[#1a1f36]">User</option>
                      <option value="admin" className="bg-[#1a1f36]">Admin</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setDemoDialogOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4" />
                    Create Demo User
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="glass-card p-4 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/40 font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-white/40 font-medium">Email</th>
                        <th className="text-center py-3 px-4 text-white/40 font-medium">Plan</th>
                        <th className="text-center py-3 px-4 text-white/40 font-medium">Role</th>
                        <th className="text-center py-3 px-4 text-white/40 font-medium">Joined</th>
                        <th className="text-center py-3 px-4 text-white/40 font-medium">Tests</th>
                        <th className="text-right py-3 px-4 text-white/40 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b border-white/5">
                            {Array.from({ length: 7 }).map((_, j) => (
                              <td key={j} className="py-3 px-4"><Skeleton className="h-5 w-20 bg-white/5" /></td>
                            ))}
                          </tr>
                        ))
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-white/30">No users found</td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                  {(u.name || u.email)[0].toUpperCase()}
                                </div>
                                <span className="text-white truncate max-w-[120px]">{u.name || '—'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-white/60 truncate max-w-[180px]">{u.email}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                u.plan === 'premium'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-white/10 text-white/50 border border-white/10'
                              }`}>
                                {u.plan === 'premium' ? 'Premium' : 'Free'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                u.role === 'admin'
                                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                  : 'bg-white/10 text-white/50 border border-white/10'
                              }`}>
                                {u.role === 'admin' ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-white/50 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-center text-white/50">{u._count.assessments}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => { setSelectedUser(u); setUserDetailOpen(true); }}
                                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                {u.role !== 'admin' && (
                                  <button
                                    onClick={() => handlePromoteUser(u.email)}
                                    disabled={promoting}
                                    className="p-1.5 rounded-lg text-orange-400/60 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
                                    title="Promote to Admin"
                                  >
                                    <Shield className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleResetPassword(u.id)}
                                  disabled={resettingPassword}
                                  className="p-1.5 rounded-lg text-purple-400/60 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                                  title="Reset Password"
                                >
                                  <Lock className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination page={usersPagination.page} totalPages={usersPagination.totalPages} onPageChange={(p) => fetchUsers(p, usersSearch)} />
              </div>

              {/* User Detail Dialog */}
              <Dialog open={userDetailOpen} onOpenChange={setUserDetailOpen}>
                <DialogContent className="sm:max-w-[500px] bg-[#1a1f36] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">User Details</DialogTitle>
                  </DialogHeader>
                  {selectedUser && (
                    <div className="space-y-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-lg font-bold">
                          {(selectedUser.name || selectedUser.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{selectedUser.name || 'No name'}</p>
                          <p className="text-sm text-white/50">{selectedUser.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Plan', value: selectedUser.plan, badge: true },
                          { label: 'Role', value: selectedUser.role, badge: true },
                          { label: 'Joined', value: new Date(selectedUser.createdAt).toLocaleDateString() },
                          { label: 'Email Verified', value: selectedUser.emailVerified ? 'Yes' : 'No' },
                          { label: 'Assessments', value: selectedUser._count.assessments },
                          { label: 'Certificates', value: selectedUser._count.certificates },
                          { label: 'Payments', value: selectedUser._count.payments },
                          { label: 'Demo Account', value: selectedUser.isDemo ? 'Yes' : 'No' },
                        ].map((item) => (
                          <div key={item.label} className="p-3 rounded-xl bg-white/5">
                            <p className="text-xs text-white/40 mb-1">{item.label}</p>
                            {item.badge ? (
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                (item.label === 'Plan' && item.value === 'premium')
                                  ? 'bg-green-500/20 text-green-400'
                                  : (item.label === 'Role' && item.value === 'admin')
                                  ? 'bg-orange-500/20 text-orange-400'
                                  : 'bg-white/10 text-white/60'
                              }`}>
                                {String(item.value)}
                              </span>
                            ) : (
                              <p className="text-sm text-white font-medium">{String(item.value)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        {selectedUser.role !== 'admin' && (
                          <Button
                            onClick={() => { handlePromoteUser(selectedUser.email); setUserDetailOpen(false); }}
                            disabled={promoting}
                            className="bg-gradient-to-r from-orange-600 to-orange-500 text-white gap-1.5"
                          >
                            <Shield className="h-4 w-4" />
                            Promote to Admin
                          </Button>
                        )}
                        <Button
                          onClick={() => { handleResetPassword(selectedUser.id); }}
                          disabled={resettingPassword}
                          variant="outline"
                          className="border-white/10 text-white hover:bg-white/10 gap-1.5"
                        >
                          <Lock className="h-4 w-4" />
                          Reset Password
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Demo User Dialog */}
              <Dialog open={demoDialogOpen} onOpenChange={(open) => { setDemoDialogOpen(open); if (!open) setDemoResult(null); }}>
                <DialogContent className="sm:max-w-[480px] bg-[#1a1f36] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create Demo Users</DialogTitle>
                    <DialogDescription className="text-white/50">Generate test accounts for development and QA.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label className="text-sm text-white/60 mb-2 block">Count</Label>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={demoCount}
                          onChange={(e) => setDemoCount(Math.min(10, Math.max(1, Number(e.target.value))))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm text-white/60 mb-2 block">Plan</Label>
                        <select
                          value={demoPlan}
                          onChange={(e) => setDemoPlan(e.target.value as 'free' | 'premium')}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
                        >
                          <option value="free" className="bg-[#1a1f36]">Free</option>
                          <option value="premium" className="bg-[#1a1f36]">Premium</option>
                        </select>
                      </div>
                    </div>
                    {demoResult && (
                      <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 space-y-2 max-h-48 overflow-y-auto">
                        <p className="text-green-400 text-sm font-medium">{demoResult.message}</p>
                        {demoResult.credentials.map((cred, i) => (
                          <div key={i} className="text-xs text-white/60 space-y-0.5">
                            <p>Email: <span className="text-white">{cred.email}</span></p>
                            <p>Password: <span className="text-white">{cred.password}</span></p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button onClick={handleCreateDemoUsers} disabled={creatingDemo} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white gap-1.5">
                      {creatingDemo ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                      Create
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB: PAYMENTS
              ════════════════════════════════════════════════════════════ */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Revenue Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  icon={DollarSign}
                  label="Total Revenue"
                  value={`$${revenueKpis.totalRevenue.toFixed(2)}`}
                  gradient="from-green-500 to-emerald-600"
                />
                <StatCard
                  icon={CheckCircle2}
                  label="Completed Payments"
                  value={revenueKpis.completedPayments}
                  gradient="from-purple-500 to-indigo-600"
                />
                <StatCard
                  icon={CreditCard}
                  label="Total Transactions"
                  value={paymentsPagination.total}
                  gradient="from-cyan-500 to-blue-600"
                />
              </div>

              {/* Filter + Table */}
              <div className="glass-card p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-400" />
                    Payment History
                  </h3>
                  <select
                    value={paymentsFilterStatus}
                    onChange={(e) => { setPaymentsFilterStatus(e.target.value); fetchPayments(1, e.target.value); }}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="all" className="bg-[#1a1f36]">All Status</option>
                    <option value="completed" className="bg-[#1a1f36]">Completed</option>
                    <option value="pending" className="bg-[#1a1f36]">Pending</option>
                    <option value="failed" className="bg-[#1a1f36]">Failed</option>
                    <option value="refunded" className="bg-[#1a1f36]">Refunded</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/40 font-medium">Transaction ID</th>
                        <th className="text-left py-3 px-4 text-white/40 font-medium">User</th>
                        <th className="text-center py-3 px-4 text-white/40 font-medium">Amount</th>
                        <th className="text-center py-3 px-4 text-white/40 font-medium">Plan</th>
                        <th className="text-center py-3 px-4 text-white/40 font-medium">Status</th>
                        <th className="text-center py-3 px-4 text-white/40 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentsLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b border-white/5">
                            {Array.from({ length: 6 }).map((_, j) => (
                              <td key={j} className="py-3 px-4"><Skeleton className="h-5 w-20 bg-white/5" /></td>
                            ))}
                          </tr>
                        ))
                      ) : payments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-white/30">No payments found</td>
                        </tr>
                      ) : (
                        payments.map((p) => (
                          <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4 text-white/50 font-mono text-xs max-w-[140px] truncate">{p.paypalOrderId || p.id.slice(0, 16)}</td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="text-white text-sm">{p.user.name || '—'}</p>
                                <p className="text-white/40 text-xs">{p.user.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center text-white font-medium">${p.amount.toFixed(2)}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                p.plan === 'premium'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-white/10 text-white/50 border border-white/10'
                              }`}>
                                {p.plan || '—'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                p.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                p.status === 'failed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                p.status === 'refunded' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                'bg-white/10 text-white/50 border border-white/10'
                              }`}>
                                {p.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                                {p.status === 'pending' && <Clock className="h-3 w-3" />}
                                {p.status === 'failed' && <XCircle className="h-3 w-3" />}
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-white/50 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination page={paymentsPagination.page} totalPages={paymentsPagination.totalPages} onPageChange={(p) => fetchPayments(p, paymentsFilterStatus)} />
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB: ASSESSMENTS
              ════════════════════════════════════════════════════════════ */}
          {activeTab === 'assessments' && (
            <div className="space-y-6">
              {/* Assessment Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={ClipboardList}
                  label="Total Assessments"
                  value={assessmentsPagination.total}
                  gradient="from-cyan-500 to-blue-600"
                />
                <StatCard
                  icon={CheckCircle2}
                  label="Completed"
                  value={analytics?.kpis.completedAssessments ?? '—'}
                  gradient="from-green-500 to-emerald-600"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Avg Score"
                  value={assessments.length > 0
                    ? `${Math.round(assessments.filter(a => a.score != null).reduce((sum, a) => sum + (a.score || 0), 0) / Math.max(assessments.filter(a => a.score != null).length, 1))}%`
                    : '—'}
                  gradient="from-purple-500 to-indigo-600"
                />
                <StatCard
                  icon={Award}
                  label="Certificates"
                  value={analytics?.kpis.totalCertificates ?? '—'}
                  gradient="from-orange-500 to-red-600"
                />
              </div>

              {/* CEFR Distribution + Table */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* CEFR Distribution Chart */}
                <div className="glass-card p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    CEFR Level Distribution
                  </h3>
                  {cefrChartData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cefrChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                          <XAxis dataKey="level" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} />
                          <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                          <Tooltip content={<ChartTooltip />} />
                          <Bar dataKey="count" name="Assessments" radius={[6, 6, 0, 0]}>
                            {cefrChartData.map((entry) => (
                              <Cell key={entry.level} fill={CEFR_PIE_COLORS[entry.level] || '#6B7280'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-white/30 text-sm">No data yet</div>
                  )}
                </div>

                {/* Assessments Table */}
                <div className="lg:col-span-2 glass-card p-4 overflow-hidden">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-cyan-400" />
                    Recent Assessments
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-white/40 font-medium">User</th>
                          <th className="text-center py-3 px-4 text-white/40 font-medium">CEFR Level</th>
                          <th className="text-center py-3 px-4 text-white/40 font-medium">Score</th>
                          <th className="text-center py-3 px-4 text-white/40 font-medium">Status</th>
                          <th className="text-center py-3 px-4 text-white/40 font-medium">Date</th>
                          <th className="text-center py-3 px-4 text-white/40 font-medium">Questions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assessmentsLoading ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-b border-white/5">
                              {Array.from({ length: 6 }).map((_, j) => (
                                <td key={j} className="py-3 px-4"><Skeleton className="h-5 w-16 bg-white/5 mx-auto" /></td>
                              ))}
                            </tr>
                          ))
                        ) : assessments.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-white/30">No assessments found</td>
                          </tr>
                        ) : (
                          assessments.map((a) => (
                            <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="text-white text-sm">{a.user.name || '—'}</p>
                                  <p className="text-white/40 text-xs">{a.user.email}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {a.cefrLevel ? (
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${CEFR_COLORS_DARK[a.cefrLevel] || 'bg-white/10 text-white/50'}`}>
                                    {a.cefrLevel}
                                  </span>
                                ) : (
                                  <span className="text-white/30 text-xs">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {a.score != null ? (
                                  <span className="text-white font-medium">{a.score}%</span>
                                ) : (
                                  <span className="text-white/30 text-xs">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                  a.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                  a.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                  'bg-white/10 text-white/50 border border-white/10'
                                }`}>
                                  {a.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center text-white/50 text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                              <td className="py-3 px-4 text-center text-white/50">{a._count.responses}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={assessmentsPagination.page} totalPages={assessmentsPagination.totalPages} onPageChange={(p) => fetchAssessments(p)} />
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB: QUESTION BANK
              ════════════════════════════════════════════════════════════ */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                    Question Bank
                    <span className="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {questionStats?.total ?? 0} total
                    </span>
                  </h2>
                  <p className="text-white/40 text-sm mt-0.5">Manage and generate CEFR assessment questions</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-white hover:bg-white/10 gap-1.5"
                    onClick={fetchQuestionStats}
                    disabled={questionStatsLoading}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${questionStatsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white gap-1.5"
                  >
                    <BookOpen className="h-4 w-4" />
                    Fill Question Bank
                  </Button>
                </div>
              </div>

              {/* Stats Table */}
              <div className="glass-card p-4 overflow-hidden">
                <div className="overflow-x-auto">
                  {questionStatsLoading && !questionStats ? (
                    <Skeleton className="h-48 w-full bg-white/5" />
                  ) : questionStats ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-white/40 font-medium w-24">Level</th>
                          {SKILLS.map((skill) => (
                            <th key={skill} className="text-center py-3 px-4 text-white/40 font-medium capitalize">{skill}</th>
                          ))}
                          <th className="text-center py-3 px-4 text-white/40 font-medium">Row Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CEFR_LEVELS.map((level) => {
                          const rowTotal = SKILLS.reduce((sum, skill) => sum + (questionStats.stats[level]?.[skill] || 0), 0);
                          return (
                            <tr key={level} className="border-b border-white/5 hover:bg-white/[0.02]">
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${CEFR_COLORS_DARK[level]}`}>
                                  {level}
                                </span>
                              </td>
                              {SKILLS.map((skill) => {
                                const count = questionStats.stats[level]?.[skill] || 0;
                                return (
                                  <td key={skill} className="py-3 px-4 text-center">
                                    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      count >= 50
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : count > 0
                                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        : 'bg-white/5 text-white/30 border border-white/5'
                                    }`}>
                                      {count}
                                    </span>
                                  </td>
                                );
                              })}
                              <td className="py-3 px-4 text-center text-white font-medium">{rowTotal}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : null}
                </div>
              </div>

              {/* Category breakdown chart */}
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  Category Breakdown
                </h3>
                {questionStats ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={SKILLS.map((skill) => ({
                        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
                        count: CEFR_LEVELS.reduce((sum, level) => sum + (questionStats.stats[level]?.[skill] || 0), 0),
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="skill" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} />
                        <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="count" name="Questions" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-white/30 text-sm">Loading...</div>
                )}
              </div>

              {/* Fill Question Bank Dialog */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-[#1a1f36] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">Fill Question Bank</DialogTitle>
                    <DialogDescription className="text-white/50">
                      Automatically generates questions for each selected level × skill combination
                      until the target count is reached.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* CEFR Levels */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold text-white/80">CEFR Levels</Label>
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-white/50 hover:text-white hover:bg-white/10" onClick={toggleAllLevels}>
                          {selectedLevels.length === CEFR_LEVELS.length ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {CEFR_LEVELS.map((level) => (
                          <label
                            key={level}
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
                              selectedLevels.includes(level)
                                ? 'border-purple-500/50 bg-purple-500/10'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <Checkbox checked={selectedLevels.includes(level)} onCheckedChange={() => toggleLevel(level)} />
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold border ${CEFR_COLORS_DARK[level]}`}>{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold text-white/80">Skills</Label>
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-white/50 hover:text-white hover:bg-white/10" onClick={toggleAllSkills}>
                          {selectedSkills.length === SKILLS.length ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS.map((skill) => (
                          <label
                            key={skill}
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 cursor-pointer transition-colors capitalize ${
                              selectedSkills.includes(skill)
                                ? 'border-purple-500/50 bg-purple-500/10'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <Checkbox checked={selectedSkills.includes(skill)} onCheckedChange={() => toggleSkill(skill)} />
                            <span className="text-sm text-white/80">{skill}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Count */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-white/80">Target questions per level × skill</Label>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={countPerSlot}
                        onChange={(e) => setCountPerSlot(Number(e.target.value))}
                        className="w-48 bg-white/5 border-white/10 text-white"
                      />
                      <p className="text-sm text-white/40">
                        Total target: {totalSlots} slots × {countPerSlot} = <strong className="text-white/80">{totalTarget}</strong> questions
                      </p>
                    </div>

                    {/* Result/Error */}
                    {generationError && (
                      <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{generationError}</span>
                      </div>
                    )}
                    {generationResult && (
                      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400 space-y-1">
                        <p className="font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" />
                          Generated {generationResult.totalGenerated} new questions ({generationResult.totalSkipped} already existed)
                        </p>
                        {generationResult.results?.map((r, i) => (
                          <p key={i} className="text-xs pl-5">
                            {r.level}/{r.skill}: +{r.generated} generated, {r.skipped} existing
                            {r.errors > 0 && <span className="text-red-400 ml-1">({r.errors} errors)</span>}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleBatchGenerate}
                      disabled={generating || !selectedLevels.length || !selectedSkills.length}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white gap-1.5"
                    >
                      {generating ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                      ) : (
                        'Start Batch Generation'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB: SYSTEM
              ════════════════════════════════════════════════════════════ */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              {/* Database Status */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-400" />
                    Database Status
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400 shadow-sm shadow-green-400/50 animate-pulse" />
                    <span className="text-xs text-green-400">Connected</span>
                  </div>
                </div>
                {systemLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 bg-white/5" />)}
                  </div>
                ) : systemData ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(systemData.database.tables).map(([table, count]) => (
                        <div key={table} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                          <p className="text-xs text-white/40 capitalize mb-1">{table}</p>
                          <p className="text-xl font-bold text-white">{count.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <span className="text-sm text-white/50">Estimated DB Size</span>
                      <span className="text-sm font-medium text-white">{systemData.database.sizeMB} MB</span>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Service Tests */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* PayPal */}
                <div className="glass-card p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-400" />
                    PayPal Connection
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-sm text-white/50">Mode</span>
                      <span className="text-sm font-medium text-white">{systemData?.environment.paypalMode || '—'}</span>
                    </div>
                    {paypalTestResult && (
                      <div className={`p-3 rounded-xl border ${
                        paypalTestResult.status === 'ok'
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        <p className="text-sm font-medium">{paypalTestResult.message}</p>
                      </div>
                    )}
                    <Button
                      onClick={handleTestPaypal}
                      disabled={paypalTesting}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white gap-1.5"
                    >
                      {paypalTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                      Test PayPal Connection
                    </Button>
                  </div>
                </div>

                {/* AI Service */}
                <div className="glass-card p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-pink-400" />
                    AI Service
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-sm text-white/50">Google AI Key</span>
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${systemData?.environment.googleAiKeySet ? 'text-green-400' : 'text-red-400'}`}>
                        {systemData?.environment.googleAiKeySet ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        {systemData?.environment.googleAiKeySet ? 'Configured' : 'Not Set'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-sm text-white/50">Model</span>
                      <span className="text-sm font-medium text-white">Gemini 2.5 Flash</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <span className="text-sm text-white/50">Questions in Bank</span>
                      <span className="text-sm font-medium text-white">{systemData?.database.tables.questions.toLocaleString() ?? '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environment Info */}
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Key className="h-4 w-4 text-yellow-400" />
                  Environment Info
                </h3>
                {systemLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 bg-white/5" />)}
                  </div>
                ) : systemData ? (
                  <div className="space-y-2">
                    {[
                      { label: 'Node Version', value: systemData.environment.nodeVersion },
                      { label: 'Platform', value: systemData.environment.platform },
                      { label: 'Environment', value: systemData.environment.env },
                      { label: 'App URL', value: systemData.environment.appUrl },
                      { label: 'Uptime', value: `${Math.floor(systemData.uptime / 3600)}h ${Math.floor((systemData.uptime % 3600) / 60)}m ${Math.floor(systemData.uptime % 60)}s` },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-sm text-white/50">{item.label}</span>
                        <span className="text-sm font-medium text-white font-mono">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Memory Usage */}
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  Memory Usage
                </h3>
                {systemLoading ? (
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 bg-white/5" />)}
                  </div>
                ) : systemData ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'RSS', value: systemData.memory.rss, total: systemData.memory.rss },
                      { label: 'Heap Used', value: systemData.memory.heapUsed, total: systemData.memory.heapTotal },
                      { label: 'Heap Total', value: systemData.memory.heapTotal, total: systemData.memory.heapTotal },
                    ].map((item) => (
                      <div key={item.label} className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-xs text-white/40 mb-1">{item.label}</p>
                        <p className="text-xl font-bold text-white">{item.value} MB</p>
                        <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${Math.min((item.value / Math.max(item.total, 1)) * 100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Certificates Stats */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4 text-orange-400" />
                    Certificates
                  </h3>
                  <span className="text-xs text-white/40">{certificatesPagination.total} total</span>
                </div>
                {certCefrChartData.length > 0 ? (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={certCefrChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="level" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} />
                        <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="count" name="Certificates" radius={[6, 6, 0, 0]}>
                          {certCefrChartData.map((entry) => (
                            <Cell key={entry.level} fill={CEFR_PIE_COLORS[entry.level] || '#6B7280'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-white/30 text-sm">No certificates yet</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
