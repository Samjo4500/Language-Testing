'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { useAdminNotificationStore } from '@/lib/admin-notification-store';
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
  Circle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  Mail,
  Code2,
  FileText,
  Timer,
  Hash,
  Copy,
  Palette,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Bell,
  BellRing,
  ExternalLink,
  MousePointerClick,
  LineChart,
  Search as SearchIcon,
  LayoutDashboard,
  CheckSquare,
  Square,
  Settings2,
  Pencil,
  UserCog,
  ScrollText,
  BadgeCheck,
  UserMinus,
  ShieldAlert,
  FileBadge,
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
  { id: 'payments', label: 'Financial', icon: CreditCard },
  { id: 'assessments', label: 'Test Takers', icon: ClipboardList },
  { id: 'emails', label: 'Emails', icon: Mail },
  { id: 'apis', label: 'APIs', icon: Code2 },
  { id: 'questions', label: 'Question Bank', icon: BookOpen },
  { id: 'governance', label: 'Governance', icon: Shield },
  { id: 'system', label: 'System', icon: Server },
  { id: 'analytics-integrations', label: 'Analytics', icon: Globe },
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

// ─── Emails Tab Component ────────────────────────────────────────────────────────

function EmailsTab({ notifUnread, onSwitchTab }: { notifUnread: number; onSwitchTab: (tab: TabId) => void }) {
  const [emailsData, setEmailsData] = useState<{
    users: Array<{
      id: string; email: string; name: string | null; emailVerified: boolean;
      plan: string; role: string; createdAt: string;
      payments: Array<{ id: string; amount: number; status: string; createdAt: string }>;
      assessments: Array<{ id: string; cefrLevel: string | null; status: string; completedAt: string | null }>;
    }>;
    pagination: { page: number; limit: number; total: number; totalPages: number };
    stats: { totalUsers: number; verifiedUsers: number; unverifiedUsers: number; premiumUsers: number; verificationRate: number };
    emailConfig: { resendKeySet: boolean; appUrlSet: boolean; appUrl: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchEmails = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20', filter });
      const res = await fetch(`/api/admin/emails/?${params}`, { credentials: 'same-origin' });
      if (res.ok) setEmailsData(await res.json());
    } catch (e) { console.error('Emails fetch error:', e); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);

  return (
    <div className="space-y-6">
      {/* Unread Notification Banner */}
      {notifUnread > 0 && (
        <div className="glass-card p-4 border border-purple-500/30 bg-purple-500/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                <BellRing className="h-4 w-4" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{notifUnread} Unread Notification{notifUnread !== 1 ? 's' : ''}</p>
                <p className="text-white/50 text-xs">New signups, payments, and contact form submissions</p>
              </div>
            </div>
            <button
              onClick={() => onSwitchTab('overview')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View in Bell
            </button>
          </div>
        </div>
      )}

      {/* Email Service Config */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Mail className="h-4 w-4 text-purple-400" />
          Email Service Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 text-white/40" />
              <span className="text-white/50 text-sm">Resend API Key</span>
            </div>
            <div className="flex items-center gap-2">
              {emailsData?.emailConfig.resendKeySet ? (
                <><CheckCircle2 className="h-4 w-4 text-green-400" /><span className="text-green-400 text-sm font-medium">Configured</span></>
              ) : (
                <><AlertCircle className="h-4 w-4 text-red-400" /><span className="text-red-400 text-sm font-medium">Not Set</span></>
              )}
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-white/40" />
              <span className="text-white/50 text-sm">App URL</span>
            </div>
            <span className="text-white text-sm">{emailsData?.emailConfig.appUrl || '—'}</span>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-white/40" />
              <span className="text-white/50 text-sm">Service Status</span>
            </div>
            <div className="flex items-center gap-2">
              {emailsData?.emailConfig.resendKeySet ? (
                <><Wifi className="h-4 w-4 text-green-400" /><span className="text-green-400 text-sm font-medium">Active</span></>
              ) : (
                <><XCircle className="h-4 w-4 text-red-400" /><span className="text-red-400 text-sm font-medium">Inactive</span></>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={emailsData?.stats.totalUsers ?? '—'} gradient="from-purple-500 to-indigo-600" />
        <StatCard icon={CheckCircle2} label="Verified" value={emailsData?.stats.verifiedUsers ?? '—'} gradient="from-green-500 to-emerald-600" />
        <StatCard icon={AlertCircle} label="Unverified" value={emailsData?.stats.unverifiedUsers ?? '—'} gradient="from-red-500 to-rose-600" />
        <StatCard icon={Shield} label="Verify Rate" value={emailsData?.stats.verificationRate != null ? `${emailsData.stats.verificationRate}%` : '—'} gradient="from-blue-500 to-cyan-600" />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {['all', 'verified', 'unverified'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Users List */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4">User Email Directory</h3>
        {loading ? (
          <Skeleton className="h-64 w-full bg-white/5" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 py-3 px-2">Email</th>
                  <th className="text-left text-white/40 py-3 px-2">Name</th>
                  <th className="text-left text-white/40 py-3 px-2">Status</th>
                  <th className="text-left text-white/40 py-3 px-2">Plan</th>
                  <th className="text-left text-white/40 py-3 px-2">Last CEFR</th>
                  <th className="text-left text-white/40 py-3 px-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {emailsData?.users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 text-white/80">{u.email}</td>
                    <td className="py-3 px-2 text-white/60">{u.name || '—'}</td>
                    <td className="py-3 px-2">
                      {u.emailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs"><CheckCircle2 className="h-3 w-3" />Verified</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs"><AlertCircle className="h-3 w-3" />Unverified</span>
                      )}
                    </td>
                    <td className="py-3 px-2"><span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">{u.plan}</span></td>
                    <td className="py-3 px-2 text-white/60">{u.assessments?.[0]?.cefrLevel || '—'}</td>
                    <td className="py-3 px-2 text-white/40 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {emailsData?.pagination && emailsData.pagination.totalPages > 1 && (
              <Pagination page={emailsData.pagination.page} totalPages={emailsData.pagination.totalPages} onPageChange={(p) => fetchEmails(p)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APIs Tab Component ────────────────────────────────────────────────────────

interface ApiKeyItem {
  id: string;
  key: string;
  name: string;
  userId: string;
  plan: string;
  type: string;
  permissions: string;
  rateLimit: number;
  isActive: boolean;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
}

interface WhiteLabelData {
  id?: string;
  companyName: string;
  primaryColor: string;
  logoUrl: string;
  domain: string;
  supportEmail: string;
  customCss: string;
  features: string;
  isActive: boolean;
  plan: string;
}

function APIsTab({ onToast }: { onToast: (msg: string, type: 'success' | 'error') => void }) {
  // ── API Service Health Data ──
  const [apisData, setApisData] = useState<{
    apiEndpoints: Array<{ path: string; method: string; description: string }>;
    topApiCalls: Array<{ path: string; count: number }>;
    assessmentStats: {
      totalAssessments: number; completedAssessments: number; inProgressAssessments: number;
      todayAssessments: number; avgCompletionMinutes: number;
      cefrDistribution: Array<{ level: string; count: number }>;
    };
    latestTestTakers: Array<{
      id: string; status: string; cefrLevel: string | null; score: number | null;
      startedAt: string | null; completedAt: string | null; createdAt: string;
      user: { id: string; email: string; name: string | null; plan: string };
      _count: { responses: number };
    }>;
    services: {
      database: { status: string; latencyMs: number; type: string };
      auth: { jwtSecretSet: boolean; provider: string };
      email: { provider: string; apiKeySet: boolean };
      payment: { provider: string; mode: string; clientIdSet: boolean; secretSet: boolean };
      ai: { provider: string; apiKeySet: boolean };
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // ── API Keys State ──
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [apiKeysLoading, setApiKeysLoading] = useState(true);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPlan, setNewKeyPlan] = useState('enterprise');
  const [newKeyType, setNewKeyType] = useState('live');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read']);
  const [newKeyRateLimit, setNewKeyRateLimit] = useState(1000);
  const [generating, setGenerating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  // ── White-Label State ──
  const [wlSettings, setWlSettings] = useState<WhiteLabelData>({
    companyName: 'TestCEFR',
    primaryColor: '#8B5CF6',
    logoUrl: '',
    domain: '',
    supportEmail: '',
    customCss: '',
    features: '{}',
    isActive: false,
    plan: 'enterprise',
  });
  const [wlLoading, setWlLoading] = useState(true);
  const [wlSaving, setWlSaving] = useState(false);

  // ── Sub-tab ──
  const [subTab, setSubTab] = useState<'health' | 'keys' | 'whitelabel'>('health');

  // ── Fetch API Health ──
  const fetchAPIs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/apis/', { credentials: 'same-origin' });
      if (res.ok) setApisData(await res.json());
    } catch (e) { console.error('APIs fetch error:', e); }
    finally { setLoading(false); }
  }, []);

  // ── Fetch API Keys ──
  const fetchApiKeys = useCallback(async () => {
    setApiKeysLoading(true);
    try {
      const res = await fetch('/api/admin/api-keys/', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.apiKeys);
      }
    } catch (e) { console.error('API keys fetch error:', e); }
    finally { setApiKeysLoading(false); }
  }, []);

  // ── Fetch White-Label ──
  const fetchWhiteLabel = useCallback(async () => {
    setWlLoading(true);
    try {
      const res = await fetch('/api/admin/white-label/', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setWlSettings(data.settings);
      }
    } catch (e) { console.error('White-label fetch error:', e); }
    finally { setWlLoading(false); }
  }, []);

  useEffect(() => { fetchAPIs(); fetchApiKeys(); fetchWhiteLabel(); }, [fetchAPIs, fetchApiKeys, fetchWhiteLabel]);

  // ── Generate API Key ──
  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/api-keys/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: newKeyName.trim(),
          plan: newKeyPlan,
          type: newKeyType,
          permissions: newKeyPermissions,
          rateLimit: newKeyRateLimit,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewlyCreatedKey(data.apiKey.key);
        onToast('API key generated successfully!', 'success');
        fetchApiKeys();
        setNewKeyName('');
        setNewKeyPlan('enterprise');
        setNewKeyType('live');
        setNewKeyPermissions(['read']);
        setNewKeyRateLimit(1000);
      } else {
        onToast(data.error || 'Failed to generate key', 'error');
      }
    } catch {
      onToast('Failed to generate key', 'error');
    } finally { setGenerating(false); }
  };

  // ── Toggle API Key Active ──
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/api-keys/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (res.ok) {
        onToast(`Key ${!currentActive ? 'activated' : 'deactivated'}`, 'success');
        fetchApiKeys();
      } else {
        onToast('Failed to update key', 'error');
      }
    } catch {
      onToast('Failed to update key', 'error');
    }
  };

  // ── Revoke API Key ──
  const handleRevokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/api-keys/${id}/`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        onToast('API key revoked', 'success');
        fetchApiKeys();
      } else {
        onToast('Failed to revoke key', 'error');
      }
    } catch {
      onToast('Failed to revoke key', 'error');
    }
  };

  // ── Copy to clipboard ──
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onToast('Copied to clipboard', 'success');
  };

  // ── Save White-Label ──
  const handleSaveWhiteLabel = async () => {
    setWlSaving(true);
    try {
      const res = await fetch('/api/admin/white-label/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(wlSettings),
      });
      if (res.ok) {
        onToast('White-label settings saved!', 'success');
        fetchWhiteLabel();
      } else {
        onToast('Failed to save settings', 'error');
      }
    } catch {
      onToast('Failed to save settings', 'error');
    } finally { setWlSaving(false); }
  };

  // ── Reset White-Label ──
  const handleResetWhiteLabel = () => {
    setWlSettings({
      companyName: 'TestCEFR',
      primaryColor: '#8B5CF6',
      logoUrl: '',
      domain: '',
      supportEmail: '',
      customCss: '',
      features: '{}',
      isActive: false,
      plan: 'enterprise',
    });
    onToast('Settings reset to defaults (not saved)', 'success');
  };

  const statusColor = (status: string) => {
    if (status === 'healthy') return 'text-green-400';
    if (status === 'degraded') return 'text-yellow-400';
    return 'text-red-400';
  };

  const maskKey = (key: string) => key.slice(0, 12) + '••••••••';

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex gap-2">
        {[
          { id: 'health' as const, label: 'Service Health', icon: Activity },
          { id: 'keys' as const, label: 'API Keys', icon: Key },
          { id: 'whitelabel' as const, label: 'White-Label', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
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

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB: SERVICE HEALTH
          ═══════════════════════════════════════════════════════════════ */}
      {subTab === 'health' && (
        <>
          {/* Service Health Dashboard */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Code2 className="h-4 w-4 text-purple-400" />
                API & Service Health
              </h3>
              <button onClick={fetchAPIs} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-white/40" />
                  <span className="text-white/50 text-sm">Database</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={statusColor(apisData?.services.database.status ?? 'unknown')}>
                    {apisData?.services.database.status === 'healthy' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  </span>
                  <span className={`text-sm font-medium ${statusColor(apisData?.services.database.status ?? 'unknown')}`}>
                    {apisData?.services.database.status ?? '...'}
                  </span>
                </div>
                <span className="text-white/30 text-xs">{apisData?.services.database.latencyMs ?? '—'}ms latency</span>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-white/40" />
                  <span className="text-white/50 text-sm">Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  {apisData?.services.auth.jwtSecretSet ? (
                    <><CheckCircle2 className="h-4 w-4 text-green-400" /><span className="text-green-400 text-sm font-medium">Active</span></>
                  ) : (
                    <><AlertCircle className="h-4 w-4 text-red-400" /><span className="text-red-400 text-sm font-medium">Missing</span></>
                  )}
                </div>
                <span className="text-white/30 text-xs">{apisData?.services.auth.provider}</span>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-white/40" />
                  <span className="text-white/50 text-sm">Email ({apisData?.services.email.provider})</span>
                </div>
                <div className="flex items-center gap-2">
                  {apisData?.services.email.apiKeySet ? (
                    <><CheckCircle2 className="h-4 w-4 text-green-400" /><span className="text-green-400 text-sm font-medium">Configured</span></>
                  ) : (
                    <><AlertCircle className="h-4 w-4 text-yellow-400" /><span className="text-yellow-400 text-sm font-medium">Not Set</span></>
                  )}
                </div>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-4 w-4 text-white/40" />
                  <span className="text-white/50 text-sm">AI ({apisData?.services.ai.provider})</span>
                </div>
                <div className="flex items-center gap-2">
                  {apisData?.services.ai.apiKeySet ? (
                    <><CheckCircle2 className="h-4 w-4 text-green-400" /><span className="text-green-400 text-sm font-medium">API Key Set</span></>
                  ) : (
                    <><AlertCircle className="h-4 w-4 text-red-400" /><span className="text-red-400 text-sm font-medium">Missing</span></>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-white/40" />
                <span className="text-white/50 text-sm">Payment ({apisData?.services.payment.provider})</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-white/60 text-xs">Mode: <span className="text-white font-medium">{apisData?.services.payment.mode}</span></span>
                <span className="text-white/60 text-xs">Client ID: {apisData?.services.payment.clientIdSet ? <CheckCircle2 className="h-3 w-3 text-green-400 inline" /> : <XCircle className="h-3 w-3 text-red-400 inline" />}</span>
                <span className="text-white/60 text-xs">Secret: {apisData?.services.payment.secretSet ? <CheckCircle2 className="h-3 w-3 text-green-400 inline" /> : <XCircle className="h-3 w-3 text-red-400 inline" />}</span>
              </div>
            </div>
          </div>

          {/* Assessment Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard icon={ClipboardList} label="Total Tests" value={apisData?.assessmentStats.totalAssessments ?? '—'} gradient="from-purple-500 to-indigo-600" />
            <StatCard icon={CheckCircle2} label="Completed" value={apisData?.assessmentStats.completedAssessments ?? '—'} gradient="from-green-500 to-emerald-600" />
            <StatCard icon={Clock} label="In Progress" value={apisData?.assessmentStats.inProgressAssessments ?? '—'} gradient="from-yellow-500 to-orange-600" />
            <StatCard icon={Timer} label="Avg Time" value={apisData?.assessmentStats.avgCompletionMinutes ? `${apisData.assessmentStats.avgCompletionMinutes}m` : '—'} gradient="from-cyan-500 to-blue-600" />
            <StatCard icon={TrendingUp} label="Today" value={apisData?.assessmentStats.todayAssessments ?? '—'} gradient="from-pink-500 to-rose-600" />
          </div>

          {/* CEFR Distribution */}
          {apisData?.assessmentStats.cefrDistribution && apisData.assessmentStats.cefrDistribution.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-pink-400" />
                CEFR Level Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={apisData.assessmentStats.cefrDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="level" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" name="Assessments" radius={[6, 6, 0, 0]}>
                      {apisData.assessmentStats.cefrDistribution.map((entry) => (
                        <Cell key={entry.level} fill={CEFR_PIE_COLORS[entry.level] || '#6B7280'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* API Endpoints Reference */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-green-400" />
              API Endpoints
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/40 py-3 px-2">Method</th>
                    <th className="text-left text-white/40 py-3 px-2">Endpoint</th>
                    <th className="text-left text-white/40 py-3 px-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {apisData?.apiEndpoints.map((ep) => (
                    <tr key={`${ep.method}-${ep.path}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                          ep.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                          ep.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                          ep.method === 'PATCH' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-white/10 text-white/60'
                        }`}>{ep.method}</span>
                      </td>
                      <td className="py-2.5 px-2 text-white/70 font-mono text-xs">{ep.path}</td>
                      <td className="py-2.5 px-2 text-white/50">{ep.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB: API KEYS
          ═══════════════════════════════════════════════════════════════ */}
      {subTab === 'keys' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Key} label="Total Keys" value={apiKeys.length} gradient="from-purple-500 to-indigo-600" />
            <StatCard icon={CheckCircle2} label="Active" value={apiKeys.filter(k => k.isActive).length} gradient="from-green-500 to-emerald-600" />
            <StatCard icon={XCircle} label="Inactive" value={apiKeys.filter(k => !k.isActive).length} gradient="from-red-500 to-rose-600" />
            <StatCard icon={Zap} label="Live Keys" value={apiKeys.filter(k => k.type === 'live').length} gradient="from-yellow-500 to-orange-600" />
          </div>

          {/* Generate Button */}
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Key className="h-4 w-4 text-purple-400" />
              API Keys
            </h3>
            <Button
              onClick={() => { setGenerateDialogOpen(true); setNewlyCreatedKey(null); }}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-500 hover:to-pink-400 shadow-lg shadow-purple-500/20"
            >
              <Key className="h-4 w-4 mr-2" />
              Generate API Key
            </Button>
          </div>

          {/* Newly Created Key Alert */}
          {newlyCreatedKey && (
            <div className="glass-card p-5 border border-green-500/30">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-green-400 font-semibold text-sm mb-2">API Key Generated Successfully</h4>
                  <p className="text-white/50 text-xs mb-2">Make sure to copy your API key now. You won&apos;t be able to see it again!</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded-lg bg-black/30 text-green-300 text-sm font-mono break-all">{newlyCreatedKey}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(newlyCreatedKey)}
                      className="shrink-0 border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <button onClick={() => setNewlyCreatedKey(null)} className="text-white/40 hover:text-white">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* API Keys Table */}
          <div className="glass-card p-5">
            {apiKeysLoading ? (
              <Skeleton className="h-48 w-full bg-white/5" />
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-12">
                <Key className="h-12 w-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No API keys yet. Generate one to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/40 py-3 px-2">Name</th>
                      <th className="text-left text-white/40 py-3 px-2">Key</th>
                      <th className="text-left text-white/40 py-3 px-2">Plan</th>
                      <th className="text-left text-white/40 py-3 px-2">Type</th>
                      <th className="text-left text-white/40 py-3 px-2">Status</th>
                      <th className="text-left text-white/40 py-3 px-2">Rate Limit</th>
                      <th className="text-left text-white/40 py-3 px-2">Last Used</th>
                      <th className="text-left text-white/40 py-3 px-2">Created</th>
                      <th className="text-left text-white/40 py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((k) => (
                      <tr key={k.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2">
                          <span className="text-white/80 font-medium">{k.name}</span>
                          {k.user && <span className="block text-white/40 text-xs">by {k.user.name || k.user.email}</span>}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <code className="text-white/60 font-mono text-xs">{maskKey(k.key)}</code>
                            <button
                              onClick={() => copyToClipboard(k.key)}
                              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                              title="Copy masked key reference"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            k.plan === 'enterprise' ? 'bg-purple-500/20 text-purple-400' :
                            k.plan === 'business' ? 'bg-cyan-500/20 text-cyan-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>{k.plan}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            k.type === 'live' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>{k.type}</span>
                        </td>
                        <td className="py-3 px-2">
                          {k.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Active</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">Revoked</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-white/60 text-xs">{k.rateLimit}/hr</td>
                        <td className="py-3 px-2 text-white/40 text-xs">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : '—'}</td>
                        <td className="py-3 px-2 text-white/40 text-xs">{new Date(k.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleActive(k.id, k.isActive)}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                              title={k.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {k.isActive ? <ToggleRight className="h-4 w-4 text-green-400" /> : <ToggleLeft className="h-4 w-4 text-red-400" />}
                            </button>
                            <button
                              onClick={() => handleRevokeKey(k.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                              title="Revoke key"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Generate API Key Dialog */}
          <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
            <DialogContent className="bg-[#1a1035] border border-white/10 text-white max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Key className="h-5 w-5 text-purple-400" />
                  Generate API Key
                </DialogTitle>
                <DialogDescription className="text-white/50">
                  Create a new API key for external access to the TestCEFR platform.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Key Name */}
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Key Name</Label>
                  <Input
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production Key, Staging Key"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50"
                  />
                </div>

                {/* Plan & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">Plan</Label>
                    <select
                      value={newKeyPlan}
                      onChange={(e) => setNewKeyPlan(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="enterprise" className="bg-[#1a1035]">Enterprise</option>
                      <option value="business" className="bg-[#1a1035]">Business</option>
                      <option value="team" className="bg-[#1a1035]">Team</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">Type</Label>
                    <select
                      value={newKeyType}
                      onChange={(e) => setNewKeyType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="live" className="bg-[#1a1035]">Live</option>
                      <option value="test" className="bg-[#1a1035]">Test</option>
                    </select>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Permissions</Label>
                  <div className="flex gap-4">
                    {['read', 'write', 'admin'].map((perm) => (
                      <label key={perm} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={newKeyPermissions.includes(perm)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewKeyPermissions([...newKeyPermissions, perm]);
                            } else {
                              setNewKeyPermissions(newKeyPermissions.filter(p => p !== perm));
                            }
                          }}
                          className="border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                        />
                        <span className="text-white/60 text-sm capitalize">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rate Limit */}
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Rate Limit (requests/hour)</Label>
                  <Input
                    type="number"
                    value={newKeyRateLimit}
                    onChange={(e) => setNewKeyRateLimit(Number(e.target.value))}
                    min={1}
                    max={100000}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setGenerateDialogOpen(false)}
                    className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateKey}
                    disabled={generating || !newKeyName.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-500 hover:to-pink-400"
                  >
                    {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
                    Generate Key
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB: WHITE-LABEL
          ═══════════════════════════════════════════════════════════════ */}
      {subTab === 'whitelabel' && (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-5">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Palette className="h-4 w-4 text-purple-400" />
                White-Label Configuration
              </h3>

              {wlLoading ? (
                <Skeleton className="h-64 w-full bg-white/5" />
              ) : (
                <div className="space-y-4">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">Company Name</Label>
                    <Input
                      value={wlSettings.companyName}
                      onChange={(e) => setWlSettings({ ...wlSettings, companyName: e.target.value })}
                      placeholder="Your Company Name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50"
                    />
                  </div>

                  {/* Primary Color */}
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={wlSettings.primaryColor}
                          onChange={(e) => setWlSettings({ ...wlSettings, primaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                        />
                      </div>
                      <Input
                        value={wlSettings.primaryColor}
                        onChange={(e) => setWlSettings({ ...wlSettings, primaryColor: e.target.value })}
                        placeholder="#8B5CF6"
                        className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 font-mono"
                      />
                      <div
                        className="w-10 h-10 rounded-lg border border-white/20 shrink-0"
                        style={{ backgroundColor: wlSettings.primaryColor }}
                      />
                    </div>
                  </div>

                  {/* Logo URL */}
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">Logo URL</Label>
                    <Input
                      value={wlSettings.logoUrl}
                      onChange={(e) => setWlSettings({ ...wlSettings, logoUrl: e.target.value })}
                      placeholder="https://example.com/logo.png"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50"
                    />
                  </div>

                  {/* Custom Domain */}
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">Custom Domain</Label>
                    <Input
                      value={wlSettings.domain}
                      onChange={(e) => setWlSettings({ ...wlSettings, domain: e.target.value })}
                      placeholder="assessment.yourcompany.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50"
                    />
                  </div>

                  {/* Support Email */}
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">Support Email</Label>
                    <Input
                      value={wlSettings.supportEmail}
                      onChange={(e) => setWlSettings({ ...wlSettings, supportEmail: e.target.value })}
                      placeholder="support@yourcompany.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50"
                    />
                  </div>

                  {/* Plan Requirement */}
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">Required Plan</Label>
                    <select
                      value={wlSettings.plan}
                      onChange={(e) => setWlSettings({ ...wlSettings, plan: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="enterprise" className="bg-[#1a1035]">Enterprise</option>
                      <option value="business" className="bg-[#1a1035]">Business</option>
                      <option value="team" className="bg-[#1a1035]">Team</option>
                    </select>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-white/70 text-sm">Enable White-Label</Label>
                      <p className="text-white/40 text-xs mt-0.5">Activate the branded version for your domain</p>
                    </div>
                    <button
                      onClick={() => setWlSettings({ ...wlSettings, isActive: !wlSettings.isActive })}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {wlSettings.isActive ? (
                        <ToggleRight className="h-6 w-6 text-green-400" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-white/40" />
                      )}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={handleResetWhiteLabel}
                      className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                    >
                      Reset to Default
                    </Button>
                    <Button
                      onClick={handleSaveWhiteLabel}
                      disabled={wlSaving}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-500 hover:to-pink-400"
                    >
                      {wlSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                      Save Configuration
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Card */}
          <div className="lg:col-span-2">
            <div className="glass-card p-5 sticky top-6">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Eye className="h-4 w-4 text-purple-400" />
                Preview
              </h3>
              <div
                className="rounded-xl overflow-hidden border border-white/10"
                style={{ backgroundColor: '#0F0A1E' }}
              >
                {/* Preview Header */}
                <div
                  className="p-4 flex items-center gap-3"
                  style={{ backgroundColor: `${wlSettings.primaryColor}20`, borderBottom: `1px solid ${wlSettings.primaryColor}40` }}
                >
                  {wlSettings.logoUrl ? (
                    <img
                      src={wlSettings.logoUrl}
                      alt="Logo"
                      className="h-8 w-8 rounded-lg object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: wlSettings.primaryColor }}
                    >
                      {wlSettings.companyName.charAt(0)}
                    </div>
                  )}
                  <span className="text-white font-semibold text-sm">{wlSettings.companyName || 'TestCEFR'}</span>
                </div>

                {/* Preview Body */}
                <div className="p-4 space-y-3">
                  <div className="text-center py-4">
                    <h4 className="text-white font-semibold text-lg">{wlSettings.companyName || 'TestCEFR'}</h4>
                    <p className="text-white/50 text-sm mt-1">CEFR Assessment Platform</p>
                  </div>

                  <div className="space-y-2">
                    <div
                      className="h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: wlSettings.primaryColor }}
                    >
                      Start Assessment
                    </div>
                    <div
                      className="h-10 rounded-lg flex items-center justify-center text-sm font-medium border"
                      style={{ color: wlSettings.primaryColor, borderColor: `${wlSettings.primaryColor}60` }}
                    >
                      View Results
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                      <div key={level} className="text-center p-1.5 rounded-lg bg-white/5">
                        <span className="text-white/60 text-xs font-medium">{level}</span>
                      </div>
                    ))}
                  </div>

                  {wlSettings.domain && (
                    <p className="text-white/30 text-xs text-center mt-3">{wlSettings.domain}</p>
                  )}
                  {wlSettings.supportEmail && (
                    <p className="text-white/30 text-xs text-center">{wlSettings.supportEmail}</p>
                  )}
                </div>

                {/* Preview Footer */}
                <div className="p-3 border-t border-white/10 text-center">
                  <span className="text-white/20 text-xs">Powered by TestCEFR</span>
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-white/50 text-sm">White-Label Status</span>
                {wlSettings.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/40 text-xs">
                    <XCircle className="h-3 w-3" /> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Governance Tab Component ────────────────────────────────────────────────

function GovernanceTab({
  onToast,
  systemData,
  onRefreshUsers,
}: {
  onToast: (msg: string, type: 'success' | 'error') => void;
  systemData: SystemData | null;
  onRefreshUsers: () => void;
}) {
  const [subTab, setSubTab] = useState<'audit' | 'admins' | 'actions'>('audit');

  // ── Audit Log State ──
  const [auditEntries, setAuditEntries] = useState<Array<{
    id: string; type: string; description: string; date: string;
    adminEmail?: string; adminName?: string; targetEmail?: string; targetName?: string;
    metadata?: Record<string, unknown>;
  }>>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditPagination, setAuditPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  // ── Admin Users State ──
  const [adminUsers, setAdminUsers] = useState<Array<{
    id: string; email: string; name: string | null; createdAt: string; updatedAt: string;
  }>>([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(true);
  const [demotingId, setDemotingId] = useState<string | null>(null);
  const [confirmDemoteId, setConfirmDemoteId] = useState<string | null>(null);

  // ── Quick Actions State ──
  const [seeding, setSeeding] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [clearingDemos, setClearingDemos] = useState(false);
  const [confirmClearDemos, setConfirmClearDemos] = useState(false);

  // ── Fetch Audit Log ──
  const fetchAuditLog = useCallback(async (page = 1) => {
    setAuditLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`/api/admin/audit-log/?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setAuditEntries(data.entries || []);
        setAuditPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
        // Also get admin users from the response
        if (data.adminUsers) setAdminUsers(data.adminUsers);
      }
    } catch (e) { console.error('Audit log fetch error:', e); }
    finally { setAuditLoading(false); }
  }, []);

  // ── Fetch Admin Users ──
  const fetchAdminUsers = useCallback(async () => {
    setAdminUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users/?limit=100&role=admin', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.users.filter((u: AdminUser) => u.role === 'admin'));
      }
    } catch (e) { console.error('Admin users fetch error:', e); }
    finally { setAdminUsersLoading(false); }
  }, []);

  useEffect(() => { fetchAuditLog(); fetchAdminUsers(); }, [fetchAuditLog, fetchAdminUsers]);

  // ── Demote Admin ──
  const handleDemoteAdmin = async (userId: string) => {
    setDemotingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ role: 'user' }),
      });
      const data = await res.json();
      if (res.ok) {
        onToast(`Demoted ${data.user?.email || 'user'} to regular user`, 'success');
        fetchAdminUsers();
        onRefreshUsers();
      } else {
        onToast(data.error || 'Failed to demote user', 'error');
      }
    } catch {
      onToast('Failed to demote user', 'error');
    } finally { setDemotingId(null); setConfirmDemoteId(null); }
  };

  // ── Seed Database ──
  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed/', { method: 'POST', credentials: 'same-origin' });
      const data = await res.json();
      if (res.ok) {
        onToast(data.message || 'Database seeded successfully', 'success');
      } else {
        onToast(data.error || 'Seed failed', 'error');
      }
    } catch {
      onToast('Seed request failed', 'error');
    } finally { setSeeding(false); }
  };

  // ── Rotate Listening Scripts ──
  const handleRotate = async () => {
    setRotating(true);
    try {
      const res = await fetch('/api/admin/rotate-scripts/', { method: 'POST', credentials: 'same-origin' });
      const data = await res.json();
      if (res.ok) {
        onToast(data.message || 'Scripts rotated successfully', 'success');
      } else {
        onToast(data.error || 'Rotation failed', 'error');
      }
    } catch {
      onToast('Rotation request failed', 'error');
    } finally { setRotating(false); }
  };

  // ── Clear Demo Accounts ──
  const handleClearDemos = async () => {
    setClearingDemos(true);
    try {
      const res = await fetch('/api/admin/users/clear-demo/', { method: 'DELETE', credentials: 'same-origin' });
      const data = await res.json();
      if (res.ok) {
        onToast(data.message || `Deleted ${data.deletedCount} demo accounts`, 'success');
        onRefreshUsers();
      } else {
        onToast(data.error || 'Failed to clear demos', 'error');
      }
    } catch {
      onToast('Clear demos request failed', 'error');
    } finally { setClearingDemos(false); setConfirmClearDemos(false); }
  };

  // ── Audit log type icons/colors ──
  const auditTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    admin_new_user: { icon: UserPlus, color: 'text-blue-400 bg-blue-500/20', label: 'New User' },
    admin_new_payment: { icon: CreditCard, color: 'text-green-400 bg-green-500/20', label: 'Payment' },
    admin_certificate: { icon: Award, color: 'text-purple-400 bg-purple-500/20', label: 'Certificate' },
    admin_user: { icon: Shield, color: 'text-orange-400 bg-orange-500/20', label: 'Admin' },
    password_reset: { icon: Lock, color: 'text-yellow-400 bg-yellow-500/20', label: 'Password Reset' },
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex gap-2">
        {[
          { id: 'audit' as const, label: 'Audit Log', icon: ScrollText },
          { id: 'admins' as const, label: 'Admin Users', icon: ShieldAlert },
          { id: 'actions' as const, label: 'Quick Actions', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
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

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB: AUDIT LOG
          ═══════════════════════════════════════════════════════════════ */}
      {subTab === 'audit' && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-purple-400" />
              Admin Audit Trail
            </h3>
            <button
              onClick={() => fetchAuditLog()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>

          {auditLoading ? (
            <Skeleton className="h-64 w-full bg-white/5" />
          ) : auditEntries.length === 0 ? (
            <div className="text-center py-12">
              <ScrollText className="h-8 w-8 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No audit log entries yet</p>
              <p className="text-white/20 text-xs mt-1">Admin actions will be recorded here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {auditEntries.map((entry) => {
                const config = auditTypeConfig[entry.type] || { icon: Activity, color: 'text-white/40 bg-white/10', label: entry.type };
                const Icon = config.icon;
                return (
                  <div key={entry.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5">
                    <div className={`flex items-center justify-center h-8 w-8 rounded-lg shrink-0 ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-white/80">{config.label}</span>
                        {entry.adminEmail && (
                          <span className="text-xs text-purple-400/70">by {entry.adminEmail}</span>
                        )}
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed">{entry.description}</p>
                      {entry.targetEmail && (
                        <p className="text-white/30 text-[10px] mt-0.5">Target: {entry.targetEmail}{entry.targetName ? ` (${entry.targetName})` : ''}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-white/30 text-[10px]">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-white/20 text-[10px]">{new Date(entry.date).toLocaleTimeString()}</p>
                    </div>
                  </div>
                );
              })}
              {auditPagination.totalPages > 1 && (
                <Pagination page={auditPagination.page} totalPages={auditPagination.totalPages} onPageChange={(p) => fetchAuditLog(p)} />
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB: ADMIN USERS
          ═══════════════════════════════════════════════════════════════ */}
      {subTab === 'admins' && (
        <div className="space-y-4">
          {/* Warning Banner */}
          <div className="glass-card p-4 border border-yellow-500/20 bg-yellow-500/[0.05]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <p className="text-yellow-400 font-semibold text-sm">Proceed with Caution</p>
                <p className="text-white/50 text-xs">Only demote users you trust. This action is logged and will invalidate their session immediately.</p>
              </div>
            </div>
          </div>

          {/* Admin Users List */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-orange-400" />
                Admin Users ({adminUsers.length})
              </h3>
              <button
                onClick={() => fetchAdminUsers()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>

            {adminUsersLoading ? (
              <Skeleton className="h-40 w-full bg-white/5" />
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-8 text-white/30 text-sm">No admin users found</div>
            ) : (
              <div className="space-y-2">
                {adminUsers.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-sm font-bold">
                        {(admin.name || admin.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{admin.name || 'No name'}</p>
                        <p className="text-white/50 text-xs">{admin.email}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-white/30 text-[10px]">Created: {new Date(admin.createdAt).toLocaleDateString()}</span>
                          <span className="text-white/30 text-[10px]">Last active: {new Date(admin.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {confirmDemoteId === admin.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 text-xs">Are you sure?</span>
                          <Button
                            size="sm"
                            onClick={() => handleDemoteAdmin(admin.id)}
                            disabled={demotingId === admin.id}
                            className="bg-red-600 hover:bg-red-500 text-white text-xs h-7 px-3"
                          >
                            {demotingId === admin.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Confirm'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setConfirmDemoteId(null)}
                            className="border-white/10 text-white/60 hover:text-white text-xs h-7 px-3"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmDemoteId(admin.id)}
                          className="border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-7 px-3"
                        >
                          <UserMinus className="h-3 w-3 mr-1" />
                          Demote to User
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SUB-TAB: QUICK ACTIONS
          ═══════════════════════════════════════════════════════════════ */}
      {subTab === 'actions' && (
        <div className="space-y-6">
          {/* Quick Action Buttons */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Seed Database */}
              <div className="glass-card p-4 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Seed Database</p>
                    <p className="text-white/40 text-xs">Populate sample questions</p>
                  </div>
                </div>
                <Button
                  onClick={handleSeed}
                  disabled={seeding}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:from-purple-500 hover:to-indigo-400 text-xs h-9"
                >
                  {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Database className="h-3.5 w-3.5 mr-1.5" />}
                  {seeding ? 'Seeding...' : 'Run Seed'}
                </Button>
              </div>

              {/* Rotate Listening Scripts */}
              <div className="glass-card p-4 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Rotate Scripts</p>
                    <p className="text-white/40 text-xs">Refresh listening content</p>
                  </div>
                </div>
                <Button
                  onClick={handleRotate}
                  disabled={rotating}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-400 text-xs h-9"
                >
                  {rotating ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <RefreshCw className="h-3.5 w-3.5 mr-1.5" />}
                  {rotating ? 'Rotating...' : 'Rotate'}
                </Button>
              </div>

              {/* Clear Demo Accounts */}
              <div className="glass-card p-4 hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Clear Demo Accounts</p>
                    <p className="text-white/40 text-xs">Delete all isDemo=true users</p>
                  </div>
                </div>
                {confirmClearDemos ? (
                  <div className="space-y-2">
                    <p className="text-red-400 text-xs font-medium">This will permanently delete all demo accounts and their data.</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleClearDemos}
                        disabled={clearingDemos}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs h-9"
                      >
                        {clearingDemos ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                        {clearingDemos ? 'Deleting...' : 'Confirm Delete'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setConfirmClearDemos(false)}
                        className="flex-1 border-white/10 text-white/60 hover:text-white text-xs h-9"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setConfirmClearDemos(true)}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-500 hover:to-orange-400 text-xs h-9"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Clear All Demos
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Environment Status */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-green-400" />
              Environment Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-white/40" />
                  <span className="text-white/50 text-sm">Resend Key</span>
                </div>
                <div className="flex items-center gap-2">
                  {systemData?.environment ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">Configured</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">Checking...</span>
                    </>
                  )}
                </div>
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-white/40" />
                  <span className="text-white/50 text-sm">PayPal Mode</span>
                </div>
                <span className="text-white text-sm font-medium">{systemData?.environment.paypalMode || '—'}</span>
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-4 w-4 text-white/40" />
                  <span className="text-white/50 text-sm">AI API Key</span>
                </div>
                <div className="flex items-center gap-2">
                  {systemData?.environment.googleAiKeySet ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">Set</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 text-sm font-medium">Missing</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authIsLoading, user } = useAuthStore();

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
  const [paypalTestResult, setPaypalTestResult] = useState<{ status: string; message: string; mode?: string } | null>(null);
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

  // ── Create User Dialog ────────────────────────────────────────────
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    email: '', name: '', password: '', plan: 'free', role: 'user',
    country: '', testCredits: 0, emailVerified: true, isDemo: false,
  });
  const [creatingUser, setCreatingUser] = useState(false);

  // ── Edit User Dialog ──────────────────────────────────────────────
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState<{
    id: string; name: string; plan: string; role: string; country: string;
    testCredits: number; emailVerified: boolean; isDemo: boolean;
  }>({ id: '', name: '', plan: 'free', role: 'user', country: '', testCredits: 0, emailVerified: true, isDemo: false });
  const [savingUser, setSavingUser] = useState(false);

  // ── User Detail Panel ─────────────────────────────────────────────
  const [userDetailData, setUserDetailData] = useState<{
    user: Record<string, unknown>;
    assessments: Array<Record<string, unknown>>;
    certificates: Array<Record<string, unknown>>;
    payments: Array<Record<string, unknown>>;
    emailLogs: Array<Record<string, unknown>>;
    stats: { totalAssessments: number; completedAssessments: number; totalCertificates: number; totalPayments: number; totalSpent: number; lastActivityAt: string | null; accountAgeDays: number };
  } | null>(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [userDetailSubTab, setUserDetailSubTab] = useState<'profile' | 'assessments' | 'certificates' | 'payments' | 'activity' | 'emails'>('profile');
  const [userActivity, setUserActivity] = useState<Array<{ type: string; description: string; date: string; metadata?: Record<string, unknown> }>>([]);
  const [userActivityLoading, setUserActivityLoading] = useState(false);

  // ── Notifications (shared Zustand store with navbar bell) ──────────
  const {
    unreadCount: notifUnread,
    notifications: notifList,
    isLoading: notifLoading,
    isOpen: notifOpen,
    fetchNotifications,
    markAllRead: storeMarkAllRead,
    setIsOpen: setNotifOpen,
  } = useAdminNotificationStore();

  const handleMarkAllRead = async () => {
    await storeMarkAllRead('');
    setToast({ message: 'All notifications marked as read', type: 'success' });
  };

  // ── Auth Check ───────────────────────────────────────────────────
  // NOTE: Early returns are placed AFTER all hooks (below) to comply
  // with React's Rules of Hooks. Do NOT add early returns here.

  // ── Helper: Auth Headers ──────────────────────────────────────────
  // With cookie-based auth, we only need Content-Type for JSON requests
  const jsonHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
  }), []);

  // ── Fetch Analytics ───────────────────────────────────────────────
  const fetchAnalytics = useCallback(async () => {
    if (!isAuthenticated) return;
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/admin/analytics/', { credentials: 'same-origin' });
      if (res.ok) setAnalytics(await res.json());
    } catch (e) { console.error('Analytics fetch error:', e); }
    finally { setAnalyticsLoading(false); }
  }, [isAuthenticated]);

  // ── Fetch Users ───────────────────────────────────────────────────
  const fetchUsers = useCallback(async (page = 1, search = '') => {
    if (!isAuthenticated) return;
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/users/?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setUsersPagination(data.pagination);
      }
    } catch (e) { console.error('Users fetch error:', e); }
    finally { setUsersLoading(false); }
  }, [isAuthenticated]);

  // ── Fetch Payments ────────────────────────────────────────────────
  const fetchPayments = useCallback(async (page = 1, status = '') => {
    if (!isAuthenticated) return;
    setPaymentsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (status && status !== 'all') params.set('status', status);
      const res = await fetch(`/api/admin/payments/?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments);
        setPaymentsPagination(data.pagination);
        setRevenueKpis(data.revenueKpis);
      }
    } catch (e) { console.error('Payments fetch error:', e); }
    finally { setPaymentsLoading(false); }
  }, [isAuthenticated]);

  // ── Fetch Assessments ─────────────────────────────────────────────
  const fetchAssessments = useCallback(async (page = 1) => {
    if (!isAuthenticated) return;
    setAssessmentsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`/api/admin/assessments/?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setAssessments(data.assessments);
        setAssessmentsPagination(data.pagination);
      }
    } catch (e) { console.error('Assessments fetch error:', e); }
    finally { setAssessmentsLoading(false); }
  }, [isAuthenticated]);

  // ── Fetch Certificates ────────────────────────────────────────────
  const fetchCertificates = useCallback(async (page = 1) => {
    if (!isAuthenticated) return;
    setCertificatesLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`/api/admin/certificates/?${params}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates);
        setCertificatesPagination(data.pagination);
        setCertCefrDistribution(data.cefrDistribution);
      }
    } catch (e) { console.error('Certificates fetch error:', e); }
    finally { setCertificatesLoading(false); }
  }, [isAuthenticated]);

  // ── Fetch Question Stats ──────────────────────────────────────────
  const fetchQuestionStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setQuestionStatsLoading(true);
    try {
      const res = await fetch('/api/admin/questions/stats/', { credentials: 'same-origin' });
      if (res.ok) setQuestionStats(await res.json());
    } catch (e) { console.error('Question stats error:', e); }
    finally { setQuestionStatsLoading(false); }
  }, [isAuthenticated]);

  // ── Fetch System ──────────────────────────────────────────────────
  const fetchSystem = useCallback(async () => {
    if (!isAuthenticated) return;
    setSystemLoading(true);
    try {
      const res = await fetch('/api/admin/system/', { credentials: 'same-origin' });
      if (res.ok) setSystemData(await res.json());
    } catch (e) { console.error('System fetch error:', e); }
    finally { setSystemLoading(false); }
  }, [isAuthenticated]);

  // ── Notifications: fetch & mark-read come from shared Zustand store ─
  // (useAdminNotificationStore handles polling, fetch, and mark-read)

  // ── Initial data fetch ────────────────────────────────────────────
  useEffect(() => {
    if (authIsLoading || !isAuthenticated) return;
    fetchAnalytics();
    fetchUsers();
    fetchPayments();
    fetchAssessments();
    fetchCertificates();
    fetchQuestionStats();
    fetchSystem();
    fetchNotifications('');
  }, [authIsLoading, isAuthenticated, fetchAnalytics, fetchUsers, fetchPayments, fetchAssessments, fetchCertificates, fetchQuestionStats, fetchSystem, fetchNotifications]);

  // ── Tab change refresh ────────────────────────────────────────────
  useEffect(() => {
    if (authIsLoading || !isAuthenticated) return;
    // Refresh data when switching tabs
  }, [activeTab, authIsLoading, isAuthenticated]);

  // ── Search debounce ───────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    const t = setTimeout(() => fetchUsers(1, usersSearch), 300);
    return () => clearTimeout(t);
  }, [usersSearch, isAuthenticated, fetchUsers]);

  // ── Notification polling handled by shared Zustand store ──────────
  // (AdminNotificationBell component manages its own 30s polling)

  // ── Actions ───────────────────────────────────────────────────────
  const handlePromoteUser = async (email: string) => {
    if (!isAuthenticated) return;
    setPromoting(true);
    try {
      const res = await fetch('/api/admin/promote/', {
        method: 'POST',
        headers: jsonHeaders(),
        credentials: 'same-origin',
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
    if (!isAuthenticated) return;
    setResettingPassword(true);
    try {
      // Generate a random 12-character password with mixed case, numbers, and symbols
      const chars = 'abcdefghijklmnopqrstuvwxyz';
      const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      const symbols = '!@#$%^&*';
      const allChars = chars + upperChars + numbers + symbols;
      const array = new Uint32Array(12);
      crypto.getRandomValues(array);
      let newPassword = '';
      // Ensure at least one of each type
      newPassword += chars[array[0] % chars.length];
      newPassword += upperChars[array[1] % upperChars.length];
      newPassword += numbers[array[2] % numbers.length];
      newPassword += symbols[array[3] % symbols.length];
      for (let i = 4; i < 12; i++) {
        newPassword += allChars[array[i] % allChars.length];
      }
      // Shuffle the password
      const shuffleArray = new Uint32Array(newPassword.length);
      crypto.getRandomValues(shuffleArray);
      newPassword = newPassword.split('').sort((a, b) => shuffleArray[newPassword.indexOf(a)] - shuffleArray[newPassword.indexOf(b)]).join('');
      const res = await fetch('/api/admin/users/reset-password/', {
        method: 'PATCH',
        headers: jsonHeaders(),
        credentials: 'same-origin',
        body: JSON.stringify({ userId, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: `Password reset to: ${newPassword}`, type: 'success' });
      } else {
        setToast({ message: data.error || 'Failed to reset password', type: 'error' });
      }
    } catch {
      setToast({ message: 'Failed to reset password', type: 'error' });
    } finally { setResettingPassword(false); }
  };

  const handleCreateDemoUsers = async () => {
    if (!isAuthenticated) return;
    setCreatingDemo(true);
    setDemoResult(null);
    try {
      const res = await fetch('/api/admin/users/demo/', {
        method: 'POST',
        headers: jsonHeaders(),
        credentials: 'same-origin',
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

  const handleCreateUser = async () => {
    if (!isAuthenticated) return;
    if (!createUserForm.email || !createUserForm.password) {
      setToast({ message: 'Email and password are required', type: 'error' });
      return;
    }
    if (createUserForm.password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    setCreatingUser(true);
    try {
      const res = await fetch('/api/admin/users/create/', {
        method: 'POST',
        headers: jsonHeaders(),
        credentials: 'same-origin',
        body: JSON.stringify(createUserForm),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: `User ${createUserForm.email} created successfully!`, type: 'success' });
        setCreateUserDialogOpen(false);
        setCreateUserForm({ email: '', name: '', password: '', plan: 'free', role: 'user', country: '', testCredits: 0, emailVerified: true, isDemo: false });
        fetchUsers(1, usersSearch);
      } else {
        setToast({ message: data.error || 'Failed to create user', type: 'error' });
      }
    } catch {
      setToast({ message: 'Failed to create user', type: 'error' });
    } finally { setCreatingUser(false); }
  };

  const handleEditUser = async () => {
    if (!isAuthenticated) return;
    setSavingUser(true);
    try {
      const { id, ...updateData } = editUserForm;
      const res = await fetch(`/api/admin/users/${id}/`, {
        method: 'PATCH',
        headers: jsonHeaders(),
        credentials: 'same-origin',
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: `User ${data.user?.email || id} updated successfully`, type: 'success' });
        setEditUserDialogOpen(false);
        fetchUsers(usersPagination.page, usersSearch);
        // Refresh detail panel if open
        if (userDetailOpen && selectedUser?.id === id) {
          fetchUserDetail(id);
        }
      } else {
        setToast({ message: data.error || 'Failed to update user', type: 'error' });
      }
    } catch {
      setToast({ message: 'Failed to update user', type: 'error' });
    } finally { setSavingUser(false); }
  };

  const fetchUserDetail = async (userId: string) => {
    setUserDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setUserDetailData(data);
      }
    } catch (e) { console.error('User detail fetch error:', e); }
    finally { setUserDetailLoading(false); }
  };

  const fetchUserActivity = async (userId: string) => {
    setUserActivityLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/activity/`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setUserActivity(data.events || []);
      }
    } catch (e) { console.error('User activity fetch error:', e); }
    finally { setUserActivityLoading(false); }
  };

  const openUserDetail = async (u: AdminUser) => {
    setSelectedUser(u);
    setUserDetailOpen(true);
    setUserDetailSubTab('profile');
    await fetchUserDetail(u.id);
  };

  const openEditUser = (u: AdminUser) => {
    setEditUserForm({
      id: u.id,
      name: u.name || '',
      plan: u.plan,
      role: u.role,
      country: '',
      testCredits: 0,
      emailVerified: u.emailVerified,
      isDemo: u.isDemo,
    });
    // Fetch full detail to populate country and testCredits
    fetch(`/api/admin/users/${u.id}/`, { credentials: 'same-origin' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setEditUserForm(prev => ({
            ...prev,
            name: data.user.name || '',
            plan: data.user.plan,
            role: data.user.role,
            country: data.user.country || '',
            testCredits: data.user.testCredits ?? 0,
            emailVerified: data.user.emailVerified ?? true,
            isDemo: data.user.isDemo ?? false,
          }));
        }
      })
      .catch(() => {});
    setEditUserDialogOpen(true);
  };

  const handleTestPaypal = async () => {
    if (!isAuthenticated) return;
    setPaypalTesting(true);
    setPaypalTestResult(null);
    try {
      const res = await fetch('/api/admin/test-paypal/', { credentials: 'same-origin' });
      const data = await res.json();
      setPaypalTestResult(data);
    } catch {
      setPaypalTestResult({ status: 'error', message: 'Connection failed' });
    } finally { setPaypalTesting(false); }
  };

  const handleBatchGenerate = async () => {
    if (!isAuthenticated) return;
    setGenerating(true);
    setGenerationError('');
    setGenerationResult(null);
    try {
      const res = await fetch('/api/admin/questions/batch/', {
        method: 'POST',
        headers: jsonHeaders(),
        credentials: 'same-origin',
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white mb-5 shadow-lg shadow-red-500/25">
                <Shield className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
              <p className="text-sm text-white/50 mb-6">
                {isAuthenticated
                  ? 'You need admin privileges to access this page.'
                  : 'Sign in with an admin account to access the admin panel.'}
              </p>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                    Sign in
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) fetchNotifications(''); }}
                  className="relative flex items-center justify-center p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Notifications"
                >
                  {notifUnread > 0 ? (
                    <BellRing className="h-5 w-5 text-purple-400 animate-pulse" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                  {notifUnread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold shadow-lg shadow-purple-500/30">
                      {notifUnread > 9 ? '9+' : notifUnread}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notifOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 glass-card p-0 overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10 animate-slide-up">
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                        <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                          <Bell className="h-4 w-4 text-purple-400" />
                          Notifications
                          {notifUnread > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold">{notifUnread} new</span>
                          )}
                        </h4>
                        {notifUnread > 0 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMarkAllRead(); }}
                            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      {/* Notifications List */}
                      <div className="max-h-80 overflow-y-auto">
                        {notifLoading ? (
                          <div className="p-6 text-center">
                            <Loader2 className="h-5 w-5 text-purple-400 animate-spin mx-auto mb-2" />
                            <p className="text-white/40 text-xs">Loading...</p>
                          </div>
                        ) : notifList.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="h-8 w-8 text-white/10 mx-auto mb-2" />
                            <p className="text-white/30 text-sm">No notifications yet</p>
                            <p className="text-white/20 text-xs mt-1">Email events like new signups, payments, and contact forms will appear here</p>
                          </div>
                        ) : (
                          notifList.map((notif) => {
                            const typeLabel: Record<string, string> = {
                              admin_new_user: 'New User',
                              admin_new_payment: 'New Payment',
                              admin_certificate: 'Certificate Issued',
                              contact_notification: 'Contact Form',
                              b2b_notification: 'B2B Inquiry',
                            };
                            const typeIcon: Record<string, React.ReactNode> = {
                              admin_new_user: <Users className="h-3.5 w-3.5" />,
                              admin_new_payment: <CreditCard className="h-3.5 w-3.5" />,
                              admin_certificate: <Award className="h-3.5 w-3.5" />,
                              contact_notification: <Mail className="h-3.5 w-3.5" />,
                              b2b_notification: <Globe className="h-3.5 w-3.5" />,
                            };
                            const typeColor: Record<string, string> = {
                              admin_new_user: 'text-blue-400 bg-blue-500/20',
                              admin_new_payment: 'text-green-400 bg-green-500/20',
                              admin_certificate: 'text-purple-400 bg-purple-500/20',
                              contact_notification: 'text-cyan-400 bg-cyan-500/20',
                              b2b_notification: 'text-orange-400 bg-orange-500/20',
                            };
                            return (
                              <div
                                key={notif.id}
                                className={`px-4 py-3 border-b border-white/5 hover:bg-white/[0.03] transition-colors ${!notif.isRead ? 'bg-purple-500/[0.05]' : ''}`}
                              >
                                <div className="flex items-start gap-2.5">
                                  <div className={`flex items-center justify-center h-7 w-7 rounded-lg shrink-0 ${typeColor[notif.type] || 'text-white/40 bg-white/10'}`}>
                                    {typeIcon[notif.type] || <Mail className="h-3.5 w-3.5" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="text-white/80 text-xs font-semibold">{typeLabel[notif.type] || notif.type}</span>
                                      {!notif.isRead && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                                      )}
                                    </div>
                                    <p className="text-white/50 text-xs leading-relaxed truncate">{notif.subject}</p>
                                    <p className="text-white/30 text-[10px] mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                      {/* Footer */}
                      {notifList.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02]">
                          <button
                            onClick={() => { setNotifOpen(false); setActiveTab('emails'); }}
                            className="flex items-center justify-center gap-1.5 w-full text-xs text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            View all in Emails tab
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => { fetchAnalytics(); fetchSystem(); fetchNotifications(''); }}
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
                  {tab.id === 'emails' && notifUnread > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-1">
                      {notifUnread > 9 ? '9+' : notifUnread}
                    </span>
                  )}
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
                      { label: 'PayPal', ok: paypalTestResult?.status === 'ok', detail: paypalTestResult?.status === 'ok' ? `${paypalTestResult.mode || 'sandbox'} mode` : systemData?.environment.paypalMode || 'Unknown' },
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCreateUserDialogOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-medium hover:from-green-500 hover:to-emerald-400 transition-all shadow-lg shadow-green-500/20 cursor-pointer"
                    >
                      <UserPlus className="h-4 w-4" />
                      Create User
                    </button>
                    <button
                      onClick={() => setDemoDialogOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
                    >
                      <UserCog className="h-4 w-4" />
                      Demo Accounts
                    </button>
                  </div>
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
                                u.plan === 'premium' || u.plan === 'pro'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-white/10 text-white/50 border border-white/10'
                              }`}>
                                {u.plan.charAt(0).toUpperCase() + u.plan.slice(1)}
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
                                  onClick={() => openUserDetail(u)}
                                  className="p-1.5 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => openEditUser(u)}
                                  className="p-1.5 rounded-lg text-white/40 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                                  title="Edit User"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
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

              {/* ═════════════════════════════════════════════════════════════
                  USER DETAIL PANEL (Full-Screen Dialog)
                  ═════════════════════════════════════════════════════════════ */}
              <Dialog open={userDetailOpen} onOpenChange={setUserDetailOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] bg-[#1a1f36] border-white/10 text-white overflow-hidden flex flex-col">
                  <DialogHeader className="shrink-0">
                    <DialogTitle className="text-white flex items-center gap-3">
                      {selectedUser && (
                        <>
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                            {(selectedUser.name || selectedUser.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{selectedUser.name || 'No name'}</p>
                            <p className="text-sm text-white/50 font-normal">{selectedUser.email}</p>
                          </div>
                          <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            selectedUser.plan === 'premium' || selectedUser.plan === 'pro'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-white/10 text-white/50 border border-white/10'
                          }`}>
                            {selectedUser.plan.charAt(0).toUpperCase() + selectedUser.plan.slice(1)}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            selectedUser.role === 'admin'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'bg-white/10 text-white/50 border border-white/10'
                          }`}>
                            {selectedUser.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </>
                      )}
                    </DialogTitle>
                  </DialogHeader>

                  {userDetailLoading ? (
                    <div className="flex-1 flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
                    </div>
                  ) : userDetailData ? (
                    <div className="flex-1 overflow-y-auto space-y-4 py-2 min-h-0">
                      {/* Stats Row */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="glass-card p-3 text-center">
                          <p className="text-white/40 text-xs mb-1">Assessments</p>
                          <p className="text-xl font-bold text-white">{userDetailData.stats.totalAssessments}</p>
                        </div>
                        <div className="glass-card p-3 text-center">
                          <p className="text-white/40 text-xs mb-1">Completed</p>
                          <p className="text-xl font-bold text-green-400">{userDetailData.stats.completedAssessments}</p>
                        </div>
                        <div className="glass-card p-3 text-center">
                          <p className="text-white/40 text-xs mb-1">Certificates</p>
                          <p className="text-xl font-bold text-purple-400">{userDetailData.stats.totalCertificates}</p>
                        </div>
                        <div className="glass-card p-3 text-center">
                          <p className="text-white/40 text-xs mb-1">Total Spent</p>
                          <p className="text-xl font-bold text-emerald-400">${userDetailData.stats.totalSpent.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Sub-tab Navigation */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {[
                          { id: 'profile' as const, label: 'Profile', icon: Users },
                          { id: 'assessments' as const, label: 'Assessments', icon: ClipboardList },
                          { id: 'certificates' as const, label: 'Certificates', icon: Award },
                          { id: 'payments' as const, label: 'Payments', icon: CreditCard },
                          { id: 'activity' as const, label: 'Activity', icon: Activity },
                          { id: 'emails' as const, label: 'Emails', icon: Mail },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          const isActive = userDetailSubTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={async () => {
                                setUserDetailSubTab(tab.id);
                                if (tab.id === 'activity' && selectedUser) {
                                  await fetchUserActivity(selectedUser.id);
                                }
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                                isActive
                                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                                  : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Profile Tab */}
                      {userDetailSubTab === 'profile' && userDetailData.user && (
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Name', value: String(userDetailData.user.name || '—') },
                            { label: 'Email', value: String(userDetailData.user.email || '—') },
                            { label: 'Plan', value: String(userDetailData.user.plan || '—') },
                            { label: 'Role', value: String(userDetailData.user.role || '—') },
                            { label: 'Country', value: String(userDetailData.user.country || '—') },
                            { label: 'Test Credits', value: String(userDetailData.user.testCredits ?? '—') },
                            { label: 'Email Verified', value: userDetailData.user.emailVerified ? 'Yes' : 'No' },
                            { label: 'Is Demo', value: userDetailData.user.isDemo ? 'Yes' : 'No' },
                            { label: 'Plan Expires', value: userDetailData.user.planExpiresAt ? new Date(String(userDetailData.user.planExpiresAt)).toLocaleDateString() : '—' },
                            { label: 'Account Age', value: `${userDetailData.stats.accountAgeDays} days` },
                            { label: 'Created', value: userDetailData.user.createdAt ? new Date(String(userDetailData.user.createdAt)).toLocaleString() : '—' },
                            { label: 'Updated', value: userDetailData.user.updatedAt ? new Date(String(userDetailData.user.updatedAt)).toLocaleString() : '—' },
                          ].map((item) => (
                            <div key={item.label} className="p-3 rounded-xl bg-white/5">
                              <p className="text-xs text-white/40 mb-1">{item.label}</p>
                              <p className="text-sm text-white font-medium">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Assessments Tab */}
                      {userDetailSubTab === 'assessments' && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left py-2 px-3 text-white/40 text-xs">Status</th>
                                <th className="text-center py-2 px-3 text-white/40 text-xs">CEFR Level</th>
                                <th className="text-center py-2 px-3 text-white/40 text-xs">Score</th>
                                <th className="text-center py-2 px-3 text-white/40 text-xs">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userDetailData.assessments.length === 0 ? (
                                <tr><td colSpan={4} className="py-8 text-center text-white/30 text-xs">No assessments</td></tr>
                              ) : userDetailData.assessments.map((a: Record<string, unknown>) => (
                                <tr key={String(a.id)} className="border-b border-white/5 hover:bg-white/[0.02]">
                                  <td className="py-2 px-3">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                      a.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>{String(a.status)}</span>
                                  </td>
                                  <td className="py-2 px-3 text-center">{a.cefrLevel ? (
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold border ${CEFR_COLORS_DARK[String(a.cefrLevel)] || 'bg-white/10 text-white/50'}`}>{String(a.cefrLevel)}</span>
                                  ) : '—'}</td>
                                  <td className="py-2 px-3 text-center text-white/70">{a.score != null ? `${a.score}%` : '—'}</td>
                                  <td className="py-2 px-3 text-center text-white/40 text-xs">{a.createdAt ? new Date(String(a.createdAt)).toLocaleDateString() : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Certificates Tab */}
                      {userDetailSubTab === 'certificates' && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left py-2 px-3 text-white/40 text-xs">Verification ID</th>
                                <th className="text-center py-2 px-3 text-white/40 text-xs">CEFR Level</th>
                                <th className="text-center py-2 px-3 text-white/40 text-xs">Score</th>
                                <th className="text-center py-2 px-3 text-white/40 text-xs">Issued</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userDetailData.certificates.length === 0 ? (
                                <tr><td colSpan={4} className="py-8 text-center text-white/30 text-xs">No certificates</td></tr>
                              ) : userDetailData.certificates.map((c: Record<string, unknown>) => (
                                <tr key={String(c.id)} className="border-b border-white/5 hover:bg-white/[0.02]">
                                  <td className="py-2 px-3">
                                    <Link href={`/certificate/${c.verificationId}`} target="_blank" className="text-purple-400 hover:text-purple-300 font-mono text-xs flex items-center gap-1">
                                      {String(c.verificationId).slice(0, 12)}...
                                      <ExternalLink className="h-3 w-3" />
                                    </Link>
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold border ${CEFR_COLORS_DARK[String(c.cefrLevel)] || 'bg-white/10 text-white/50'}`}>{String(c.cefrLevel)}</span>
                                  </td>
                                  <td className="py-2 px-3 text-center text-white/70">{c.score != null ? `${c.score}%` : '—'}</td>
                                  <td className="py-2 px-3 text-center text-white/40 text-xs">{c.issuedAt ? new Date(String(c.issuedAt)).toLocaleDateString() : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Payments Tab */}
                      {userDetailSubTab === 'payments' && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-center py-2 px-3 text-white/40 text-xs">Amount</th>
                                <th className="text-center py-2 px-3 text-white/40 text-xs">Status</th>
                                <th className="text-center py-2 px-3 text-white/40 text-xs">Plan</th>
                                <th className="text-center py-2 px-3 text-white/40 text-xs">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userDetailData.payments.length === 0 ? (
                                <tr><td colSpan={4} className="py-8 text-center text-white/30 text-xs">No payments</td></tr>
                              ) : userDetailData.payments.map((p: Record<string, unknown>) => (
                                <tr key={String(p.id)} className="border-b border-white/5 hover:bg-white/[0.02]">
                                  <td className="py-2 px-3 text-center text-white font-medium">${Number(p.amount).toFixed(2)}</td>
                                  <td className="py-2 px-3 text-center">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                      p.status === 'completed' ? 'bg-green-500/20 text-green-400' : p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                                    }`}>{String(p.status)}</span>
                                  </td>
                                  <td className="py-2 px-3 text-center text-white/60 text-xs">{String(p.plan || '—')}</td>
                                  <td className="py-2 px-3 text-center text-white/40 text-xs">{p.createdAt ? new Date(String(p.createdAt)).toLocaleDateString() : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Activity Tab */}
                      {userDetailSubTab === 'activity' && (
                        userActivityLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
                          </div>
                        ) : userActivity.length === 0 ? (
                          <div className="text-center text-white/30 text-sm py-12">No activity recorded</div>
                        ) : (
                          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                            {userActivity.map((event, i) => {
                              const iconMap: Record<string, React.ElementType> = {
                                assessment_created: ClipboardList,
                                assessment_completed: CheckCircle2,
                                payment_completed: DollarSign,
                                payment_failed: XCircle,
                                payment_refunded: CreditCard,
                                certificate_issued: Award,
                                email_sent: Mail,
                                email_failed: AlertCircle,
                                page_view: Eye,
                              };
                              const colorMap: Record<string, string> = {
                                assessment_created: 'text-cyan-400 bg-cyan-500/20',
                                assessment_completed: 'text-green-400 bg-green-500/20',
                                payment_completed: 'text-emerald-400 bg-emerald-500/20',
                                payment_failed: 'text-red-400 bg-red-500/20',
                                payment_refunded: 'text-blue-400 bg-blue-500/20',
                                certificate_issued: 'text-purple-400 bg-purple-500/20',
                                email_sent: 'text-white/50 bg-white/10',
                                email_failed: 'text-red-400 bg-red-500/20',
                                page_view: 'text-white/40 bg-white/5',
                              };
                              const Icon = iconMap[event.type] || Activity;
                              const color = colorMap[event.type] || 'text-white/40 bg-white/10';
                              return (
                                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                                  <div className={`flex items-center justify-center h-7 w-7 rounded-lg shrink-0 ${color}`}>
                                    <Icon className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white/70 text-xs leading-relaxed">{event.description}</p>
                                    <p className="text-white/30 text-[10px] mt-0.5">{new Date(event.date).toLocaleString()}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )
                      )}

                      {/* Emails Tab */}
                      {userDetailSubTab === 'emails' && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left py-2 px-3 text-white/40 text-xs">Type</th>
                                <th className="text-center py-2 px-3 text-white/40 text-xs">Status</th>
                                <th className="text-center py-2 px-3 text-white/40 text-xs">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userDetailData.emailLogs.length === 0 ? (
                                <tr><td colSpan={3} className="py-8 text-center text-white/30 text-xs">No email logs</td></tr>
                              ) : userDetailData.emailLogs.map((e: Record<string, unknown>) => (
                                <tr key={String(e.id)} className="border-b border-white/5 hover:bg-white/[0.02]">
                                  <td className="py-2 px-3 text-white/70 text-xs">{String(e.type)}</td>
                                  <td className="py-2 px-3 text-center">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                      e.status === 'sent' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>{String(e.status)}</span>
                                  </td>
                                  <td className="py-2 px-3 text-center text-white/40 text-xs">{e.createdAt ? new Date(String(e.createdAt)).toLocaleDateString() : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t border-white/10">
                        {selectedUser && (
                          <Button
                            onClick={() => { openEditUser(selectedUser); setUserDetailOpen(false); }}
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/10 gap-1.5"
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </Button>
                        )}
                        {selectedUser && (
                          <Button
                            onClick={() => { handleResetPassword(selectedUser.id); }}
                            disabled={resettingPassword}
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/10 gap-1.5"
                          >
                            <Lock className="h-4 w-4" /> Reset Password
                          </Button>
                        )}
                        {selectedUser && selectedUser.role !== 'admin' && (
                          <Button
                            onClick={() => { handlePromoteUser(selectedUser.email); setUserDetailOpen(false); }}
                            disabled={promoting}
                            className="bg-gradient-to-r from-orange-600 to-orange-500 text-white gap-1.5"
                          >
                            <Shield className="h-4 w-4" /> Promote
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center py-12">
                      <p className="text-white/30 text-sm">No data available</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* ═════════════════════════════════════════════════════════════
                  CREATE USER DIALOG
                  ═════════════════════════════════════════════════════════════ */}
              <Dialog open={createUserDialogOpen} onOpenChange={setCreateUserDialogOpen}>
                <DialogContent className="sm:max-w-[520px] bg-[#1a1f36] border-white/10 text-white max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-green-400" />
                      Create User
                    </DialogTitle>
                    <DialogDescription className="text-white/50">Manually create a new user account.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-sm text-white/60 mb-1.5 block">Email <span className="text-red-400">*</span></Label>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        value={createUserForm.email}
                        onChange={(e) => setCreateUserForm(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-white/60 mb-1.5 block">Name</Label>
                      <Input
                        type="text"
                        placeholder="Full name (optional)"
                        value={createUserForm.name}
                        onChange={(e) => setCreateUserForm(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-white/60 mb-1.5 block">Password <span className="text-red-400">*</span></Label>
                      <Input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={createUserForm.password}
                        onChange={(e) => setCreateUserForm(prev => ({ ...prev, password: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-white/60 mb-1.5 block">Plan</Label>
                        <select
                          value={createUserForm.plan}
                          onChange={(e) => setCreateUserForm(prev => ({ ...prev, plan: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
                        >
                          <option value="free" className="bg-[#1a1f36]">Free</option>
                          <option value="premium" className="bg-[#1a1f36]">Premium</option>
                          <option value="pro" className="bg-[#1a1f36]">Pro</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm text-white/60 mb-1.5 block">Role</Label>
                        <select
                          value={createUserForm.role}
                          onChange={(e) => setCreateUserForm(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
                        >
                          <option value="user" className="bg-[#1a1f36]">User</option>
                          <option value="admin" className="bg-[#1a1f36]">Admin</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-white/60 mb-1.5 block">Country</Label>
                        <Input
                          type="text"
                          placeholder="e.g. US"
                          value={createUserForm.country}
                          onChange={(e) => setCreateUserForm(prev => ({ ...prev, country: e.target.value }))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-white/60 mb-1.5 block">Test Credits</Label>
                        <Input
                          type="number"
                          min={0}
                          value={createUserForm.testCredits}
                          onChange={(e) => setCreateUserForm(prev => ({ ...prev, testCredits: Number(e.target.value) }))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="create-email-verified"
                          checked={createUserForm.emailVerified}
                          onCheckedChange={(checked) => setCreateUserForm(prev => ({ ...prev, emailVerified: checked === true }))}
                        />
                        <Label htmlFor="create-email-verified" className="text-sm text-white/60 cursor-pointer">Email Verified</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="create-is-demo"
                          checked={createUserForm.isDemo}
                          onCheckedChange={(checked) => setCreateUserForm(prev => ({ ...prev, isDemo: checked === true }))}
                        />
                        <Label htmlFor="create-is-demo" className="text-sm text-white/60 cursor-pointer">Is Demo</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={() => setCreateUserDialogOpen(false)}
                      className="border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateUser}
                      disabled={creatingUser || !createUserForm.email || !createUserForm.password}
                      className="bg-gradient-to-r from-green-600 to-emerald-500 text-white gap-1.5"
                    >
                      {creatingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                      Create User
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* ═════════════════════════════════════════════════════════════
                  EDIT USER DIALOG
                  ═════════════════════════════════════════════════════════════ */}
              <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
                <DialogContent className="sm:max-w-[520px] bg-[#1a1f36] border-white/10 text-white max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                      <Pencil className="h-5 w-5 text-yellow-400" />
                      Edit User
                    </DialogTitle>
                    <DialogDescription className="text-white/50">Update user details and permissions.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-sm text-white/60 mb-1.5 block">Name</Label>
                      <Input
                        type="text"
                        value={editUserForm.name}
                        onChange={(e) => setEditUserForm(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-white/60 mb-1.5 block">Plan</Label>
                        <select
                          value={editUserForm.plan}
                          onChange={(e) => setEditUserForm(prev => ({ ...prev, plan: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
                        >
                          <option value="free" className="bg-[#1a1f36]">Free</option>
                          <option value="premium" className="bg-[#1a1f36]">Premium</option>
                          <option value="pro" className="bg-[#1a1f36]">Pro</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm text-white/60 mb-1.5 block">Role</Label>
                        <select
                          value={editUserForm.role}
                          onChange={(e) => setEditUserForm(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
                        >
                          <option value="user" className="bg-[#1a1f36]">User</option>
                          <option value="admin" className="bg-[#1a1f36]">Admin</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-white/60 mb-1.5 block">Country</Label>
                        <Input
                          type="text"
                          value={editUserForm.country}
                          onChange={(e) => setEditUserForm(prev => ({ ...prev, country: e.target.value }))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-white/60 mb-1.5 block">Test Credits</Label>
                        <Input
                          type="number"
                          min={0}
                          value={editUserForm.testCredits}
                          onChange={(e) => setEditUserForm(prev => ({ ...prev, testCredits: Number(e.target.value) }))}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="edit-email-verified"
                          checked={editUserForm.emailVerified}
                          onCheckedChange={(checked) => setEditUserForm(prev => ({ ...prev, emailVerified: checked === true }))}
                        />
                        <Label htmlFor="edit-email-verified" className="text-sm text-white/60 cursor-pointer">Email Verified</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="edit-is-demo"
                          checked={editUserForm.isDemo}
                          onCheckedChange={(checked) => setEditUserForm(prev => ({ ...prev, isDemo: checked === true }))}
                        />
                        <Label htmlFor="edit-is-demo" className="text-sm text-white/60 cursor-pointer">Is Demo</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={() => setEditUserDialogOpen(false)}
                      className="border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEditUser}
                      disabled={savingUser}
                      className="bg-gradient-to-r from-yellow-600 to-orange-500 text-white gap-1.5"
                    >
                      {savingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* ═════════════════════════════════════════════════════════════
                  DEMO USER DIALOG
                  ═════════════════════════════════════════════════════════════ */}
              <Dialog open={demoDialogOpen} onOpenChange={(open) => { setDemoDialogOpen(open); if (!open) setDemoResult(null); }}>
                <DialogContent className="sm:max-w-[480px] bg-[#1a1f36] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                      <UserCog className="h-5 w-5 text-purple-400" />
                      Create Demo Accounts
                    </DialogTitle>
                    <DialogDescription className="text-white/50">Generate test accounts for development and QA.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label className="text-sm text-white/60 mb-2 block">Count (1-10)</Label>
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
                          <div key={i} className="text-xs text-white/60 flex items-center justify-between gap-2 p-1.5 rounded bg-black/20">
                            <div>
                              <p>Email: <span className="text-white">{cred.email}</span></p>
                              <p>Password: <span className="text-white font-mono">{cred.password}</span></p>
                            </div>
                            <button
                              onClick={() => { navigator.clipboard.writeText(`${cred.email}:${cred.password}`); setToast({ message: 'Credentials copied!', type: 'success' }); }}
                              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                              title="Copy credentials"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
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
              TAB: EMAILS
              ════════════════════════════════════════════════════════════ */}
          {activeTab === 'emails' && (
            <EmailsTab notifUnread={notifUnread} onSwitchTab={setActiveTab} />
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB: APIs
              ════════════════════════════════════════════════════════════ */}
          {activeTab === 'apis' && (
            <APIsTab onToast={(msg, type) => setToast({ message: msg, type })} />
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
              TAB: GOVERNANCE
              ════════════════════════════════════════════════════════════ */}
          {activeTab === 'governance' && (
            <GovernanceTab
              onToast={(msg, type) => setToast({ message: msg, type })}
              systemData={systemData}
              onRefreshUsers={() => fetchUsers(1, usersSearch)}
            />
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

          {/* ─── Analytics & Integrations Tab ─── */}
          {activeTab === 'analytics-integrations' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-400" />
                    Analytics & Integrations
                  </h2>
                  <p className="text-sm text-white/50 mt-1">
                    Configure and access your Google & third-party analytics services
                  </p>
                </div>
              </div>

              {/* ── Integration Status Cards ── */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* GA4 */}
                <div className="glass-card p-5 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Google Analytics 4</h3>
                        <p className="text-xs text-white/40">Web analytics & event tracking</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}>
                      {!!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
                        ? <><CheckCircle2 className="h-3 w-3" /> Connected</>
                        : <><XCircle className="h-3 w-3" /> Not Set</>}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-xs text-white/50">Measurement ID</span>
                      <span className="text-xs font-mono text-white/70">
                        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-xs text-white/50">Server-side Tracking</span>
                      <span className={`text-xs font-medium ${process.env.GA_API_SECRET ? 'text-green-400' : 'text-white/40'}`}>
                        {process.env.GA_API_SECRET ? 'Enabled' : 'Not configured'}
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-medium transition-all cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open GA4 Dashboard
                  </a>
                </div>

                {/* Search Console */}
                <div className="glass-card p-5 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                        <SearchIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Google Search Console</h3>
                        <p className="text-xs text-white/40">SEO, indexing & search performance</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/10">
                      <Square className="h-3 w-3" /> External
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-xs text-white/50">Property</span>
                      <span className="text-xs font-mono text-white/70">testcefr.com</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-xs text-white/50">Sitemap</span>
                      <a href="https://testcefr.com/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-purple-400 hover:text-purple-300">
                        /sitemap.xml
                      </a>
                    </div>
                  </div>
                  <a
                    href="https://search.google.com/search-console?resource_id=https://testcefr.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white text-sm font-medium transition-all cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Search Console
                  </a>
                </div>

                {/* PostHog */}
                <div className="glass-card p-5 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                        <MousePointerClick className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">PostHog</h3>
                        <p className="text-xs text-white/40">Session replay, feature flags & A/B tests</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      !!process.env.NEXT_PUBLIC_POSTHOG_KEY
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}>
                      {!!process.env.NEXT_PUBLIC_POSTHOG_KEY
                        ? <><CheckCircle2 className="h-3 w-3" /> Connected</>
                        : <><XCircle className="h-3 w-3" /> Not Set</>}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-xs text-white/50">API Key</span>
                      <span className="text-xs font-mono text-white/70">
                        {process.env.NEXT_PUBLIC_POSTHOG_KEY ? `${process.env.NEXT_PUBLIC_POSTHOG_KEY.substring(0, 12)}...` : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-xs text-white/50">Session Replay</span>
                      <span className={`text-xs font-medium ${process.env.NEXT_PUBLIC_POSTHOG_KEY ? 'text-green-400' : 'text-white/40'}`}>
                        {process.env.NEXT_PUBLIC_POSTHOG_KEY ? 'Enabled' : 'Requires API key'}
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://app.posthog.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-sm font-medium transition-all cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open PostHog
                  </a>
                </div>

                {/* Looker Studio */}
                <div className="glass-card p-5 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">
                        <LayoutDashboard className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Looker Studio</h3>
                        <p className="text-xs text-white/40">Custom dashboards & visual reports</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/10">
                      <Square className="h-3 w-3" /> External
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-xs text-white/50">Data Source</span>
                      <span className="text-xs text-white/70">GA4 + Search Console</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-xs text-white/50">Cost</span>
                      <span className="text-xs text-green-400">Free</span>
                    </div>
                  </div>
                  <a
                    href="https://lookerstudio.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-sm font-medium transition-all cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Looker Studio
                  </a>
                </div>
              </div>

              {/* ── Custom Events Reference ── */}
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  Tracked Events Reference
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 text-white/50 font-medium">Event</th>
                        <th className="text-left py-2 px-3 text-white/50 font-medium">Trigger</th>
                        <th className="text-left py-2 px-3 text-white/50 font-medium">Key Parameter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { event: 'test_start', trigger: 'Click skill in test page', param: 'plan, is_resume' },
                        { event: 'test_complete', trigger: 'Submit assessment', param: 'cefr_level, score' },
                        { event: 'test_abandon', trigger: 'Close page during test', param: 'step, skills_completed' },
                        { event: 'purchase', trigger: 'PayPal payment success', param: 'transaction_id, value, plan_type' },
                        { event: 'speaking_demo_start', trigger: 'Homepage mic button click', param: 'mic_permission' },
                        { event: 'speaking_demo_complete', trigger: 'Stop demo recording', param: '—' },
                        { event: 'pricing_view', trigger: 'Pricing section in viewport', param: '—' },
                        { event: 'certificate_download', trigger: 'Click Download PDF', param: 'cefr_level' },
                        { event: 'account_create', trigger: 'Registration success', param: 'account_type' },
                      ].map((row) => (
                        <tr key={row.event} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-purple-400 text-xs">{row.event}</td>
                          <td className="py-2.5 px-3 text-white/70">{row.trigger}</td>
                          <td className="py-2.5 px-3 text-white/50 text-xs">{row.param}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-white/30">
                  All events fire to both GA4 and PostHog simultaneously. Purchase events also fire server-side via GA4 Measurement Protocol.
                </p>
              </div>

              {/* ── Setup Checklist ── */}
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-green-400" />
                  Setup Checklist
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: 'Create Google account for TestCEFR (separate from personal)',
                      done: true,
                      link: 'https://accounts.google.com/',
                    },
                    {
                      label: 'Set up GA4 property: testcefr.com',
                      done: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
                      link: 'https://analytics.google.com/',
                    },
                    {
                      label: 'Add NEXT_PUBLIC_GA_MEASUREMENT_ID to Vercel env vars',
                      done: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
                      link: 'https://vercel.com/',
                    },
                    {
                      label: 'Add GA_API_SECRET for server-side purchase tracking',
                      done: !!process.env.GA_API_SECRET,
                      link: 'https://analytics.google.com/',
                    },
                    {
                      label: 'Verify Search Console ownership (HTML tag or DNS)',
                      done: false,
                      link: 'https://search.google.com/search-console',
                    },
                    {
                      label: 'Submit sitemap.xml to Search Console',
                      done: false,
                      link: 'https://search.google.com/search-console?resource_id=https://testcefr.com/',
                    },
                    {
                      label: 'Create PostHog project and add NEXT_PUBLIC_POSTHOG_KEY',
                      done: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
                      link: 'https://app.posthog.com/',
                    },
                    {
                      label: 'Connect Google Ads account to GA4',
                      done: false,
                      link: 'https://ads.google.com/',
                    },
                    {
                      label: 'Build first Looker Studio dashboard',
                      done: false,
                      link: 'https://lookerstudio.google.com/',
                    },
                    {
                      label: 'Launch first A/B test via PostHog',
                      done: false,
                      link: 'https://app.posthog.com/',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        item.done
                          ? 'bg-green-500/5 border-green-500/20'
                          : 'bg-white/5 border-white/5'
                      }`}
                    >
                      {item.done ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-white/20 shrink-0" />
                      )}
                      <span className={`text-sm flex-1 ${item.done ? 'text-white/70 line-through' : 'text-white/80'}`}>
                        {item.label}
                      </span>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition-colors shrink-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Environment Variables Reference ── */}
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-amber-400" />
                  Environment Variables
                </h3>
                <p className="text-xs text-white/40 mb-4">
                  Add these in Vercel Dashboard → Settings → Environment Variables. After adding, redeploy for changes to take effect.
                </p>
                <div className="space-y-2">
                  {[
                    { key: 'NEXT_PUBLIC_GA_MEASUREMENT_ID', desc: 'GA4 Measurement ID (G-XXXXXXXXXX)', set: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID },
                    { key: 'GA_API_SECRET', desc: 'GA4 Measurement Protocol API Secret', set: !!process.env.GA_API_SECRET },
                    { key: 'NEXT_PUBLIC_POSTHOG_KEY', desc: 'PostHog project API key (phc_...)', set: !!process.env.NEXT_PUBLIC_POSTHOG_KEY },
                    { key: 'NEXT_PUBLIC_POSTHOG_HOST', desc: 'PostHog region host (us/eu.i.posthog.com)', set: !!process.env.NEXT_PUBLIC_POSTHOG_HOST },
                  ].map((env) => (
                    <div key={env.key} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className={`shrink-0 ${env.set ? 'text-green-400' : 'text-red-400'}`}>
                        {env.set ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-white/80 truncate">{env.key}</p>
                        <p className="text-xs text-white/40">{env.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
