'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Mail, Send, Eye, Clock, CheckCircle2, AlertCircle, XCircle,
  Search, Filter, Plus, Pencil, Copy, Trash2, FileText, BarChart3,
  Users, Zap, ArrowRight, RefreshCw, Download, ExternalLink,
  Settings2, Activity, Key, Globe, Wifi, BellRing,
  TrendingUp, Shield, Calendar, Sparkles, Megaphone, Workflow,
  MousePointerClick, MailOpen, MailX, ArrowUpRight, AlertTriangle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  StatCard, ChartTooltip, Pagination, ConfirmModal, EmptyState,
  ExportButton, DateRangePicker,
  cefrBadge, planBadge, statusBadge, formatDate, formatDateTime, formatNumber,
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
import { Textarea } from '@/components/ui/textarea';

interface EmailsTabProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
  notifUnread?: number;
  onSwitchTab?: (tab: TabId) => void;
}

/* ── Types ──────────────────────────────────────────────────────────── */

interface EmailLog {
  id: string;
  to: string;
  from: string;
  subject: string;
  type: string;
  status: string;
  isRead: boolean;
  createdAt: string;
  user?: { id: string; email: string; name: string | null };
}

interface EmailConfig {
  resendKeySet: boolean;
  appUrlSet: boolean;
  appUrl: string;
}

interface EmailStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  premiumUsers: number;
  verificationRate: number;
}

/* ── Sub-tab type ───────────────────────────────────────────────────── */

type EmailSubTab = 'templates' | 'campaigns' | 'automation' | 'delivery' | 'settings';

const SUB_TABS: Array<{ id: EmailSubTab; label: string; icon: React.ElementType }> = [
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'automation', label: 'Automation', icon: Workflow },
  { id: 'delivery', label: 'Delivery', icon: Send },
  { id: 'settings', label: 'Settings', icon: Settings2 },
];

/* ── Template Variables ─────────────────────────────────────────────── */

const TEMPLATE_VARIABLES = [
  { name: '{{name}}', description: 'User\'s full name' },
  { name: '{{email}}', description: 'User\'s email address' },
  { name: '{{level}}', description: 'CEFR level achieved (e.g. B2)' },
  { name: '{{score}}', description: 'Assessment score percentage' },
  { name: '{{certificate_url}}', description: 'Link to certificate page' },
  { name: '{{plan}}', description: 'Current subscription plan' },
  { name: '{{test_date}}', description: 'Date of last assessment' },
  { name: '{{dashboard_url}}', description: 'Link to user dashboard' },
  { name: '{{unsubscribe_url}}', description: 'Unsubscribe link' },
  { name: '{{support_email}}', description: 'Support email address' },
];

/* ── Mock Template Data ─────────────────────────────────────────────── */

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  lastEdited: string;
  usedCount: number;
}

const initialTemplates: EmailTemplate[] = [
  { id: '1', name: 'Welcome Email', subject: 'Welcome to TestCEFR, {{name}}!', body: 'Hi {{name}},\n\nWelcome to TestCEFR! We\'re excited to have you on board.\n\nStart your language journey by taking your first CEFR assessment.\n\n[Take Assessment]({{dashboard_url}})\n\nBest regards,\nThe TestCEFR Team', lastEdited: '2025-03-14T10:00:00Z', usedCount: 1247 },
  { id: '2', name: 'Certificate Issued', subject: 'Your {{level}} Certificate is Ready!', body: 'Hi {{name}},\n\nCongratulations! You\'ve achieved {{level}} level with a score of {{score}}%.\n\nView and download your certificate:\n{{certificate_url}}\n\nKeep improving your skills!', lastEdited: '2025-03-12T08:30:00Z', usedCount: 856 },
  { id: '3', name: 'Plan Upgrade', subject: 'Unlock Premium Features, {{name}}', body: 'Hi {{name}},\n\nYou\'re currently on the {{plan}} plan. Upgrade to unlock unlimited tests, certificates, and advanced analytics.\n\nSpecial offer: 20% off your first month!\n\n[Upgrade Now]({{dashboard_url}})', lastEdited: '2025-03-10T14:00:00Z', usedCount: 423 },
  { id: '4', name: 'Assessment Reminder', subject: 'Ready for your next test, {{name}}?', body: 'Hi {{name}},\n\nIt\'s been a while since your last assessment on {{test_date}}.\n\nTrack your progress and see how much you\'ve improved!\n\n[Start Assessment]({{dashboard_url}})', lastEdited: '2025-03-08T09:15:00Z', usedCount: 634 },
  { id: '5', name: 'Weekly Digest', subject: 'Your Weekly Language Progress', body: 'Hi {{name}},\n\nHere\'s your weekly progress update:\n\n- Current Level: {{level}}\n- Last Score: {{score}}%\n\nKeep up the great work!\n\n[View Dashboard]({{dashboard_url}})', lastEdited: '2025-03-06T16:45:00Z', usedCount: 2105 },
];

/* ── Mock Campaign Data ─────────────────────────────────────────────── */

interface Campaign {
  id: string;
  name: string;
  template: string;
  audience: string;
  sentCount: number;
  opens: number;
  clicks: number;
  date: string;
  status: 'sent' | 'scheduled' | 'draft';
}

const mockCampaigns: Campaign[] = [
  { id: '1', name: 'March Welcome Series', template: 'Welcome Email', audience: 'New Users', sentCount: 342, opens: 256, clicks: 89, date: '2025-03-14T09:00:00Z', status: 'sent' },
  { id: '2', name: 'Certificate Celebration', template: 'Certificate Issued', audience: 'B2+ Achievers', sentCount: 128, opens: 112, clicks: 67, date: '2025-03-12T10:00:00Z', status: 'sent' },
  { id: '3', name: 'Spring Upsell', template: 'Plan Upgrade', audience: 'Free Users', sentCount: 0, opens: 0, clicks: 0, date: '2025-03-18T08:00:00Z', status: 'scheduled' },
  { id: '4', name: 'Weekly Digest #12', template: 'Weekly Digest', audience: 'All Users', sentCount: 1890, opens: 1204, clicks: 345, date: '2025-03-10T07:00:00Z', status: 'sent' },
  { id: '5', name: 'Re-engagement Drive', template: 'Assessment Reminder', audience: 'Inactive 30d+', sentCount: 0, opens: 0, clicks: 0, date: '', status: 'draft' },
];

/* ── Automation Preset Data ─────────────────────────────────────────── */

interface AutomationFlow {
  id: string;
  name: string;
  trigger: string;
  emailCount: number;
  purpose: string;
  enabled: boolean;
  steps: number[];
}

const initialFlows: AutomationFlow[] = [
  { id: '1', name: 'Welcome Series', trigger: 'User signs up', emailCount: 3, purpose: 'Onboard new users over 5 days with tips and guidance', enabled: true, steps: [1, 2, 3] },
  { id: '2', name: 'Post-Test Certificate', trigger: 'Assessment completed (pass)', emailCount: 1, purpose: 'Send certificate and sharing encouragement', enabled: true, steps: [1] },
  { id: '3', name: 'Nurture Sequence', trigger: '3 days inactive', emailCount: 5, purpose: 'Re-engage with lessons and practice reminders', enabled: false, steps: [1, 2, 3, 4, 5] },
  { id: '4', name: 'Re-engagement', trigger: '14 days inactive', emailCount: 3, purpose: 'Win back users with offers and progress insights', enabled: true, steps: [1, 2, 3] },
  { id: '5', name: 'Upsell to Paid', trigger: 'Free user hits limit', emailCount: 2, purpose: 'Convert free users with discount and feature preview', enabled: false, steps: [1, 2] },
  { id: '6', name: 'Weekly Newsletter', trigger: 'Every Monday 8am', emailCount: 1, purpose: 'Share weekly tips, articles, and platform updates', enabled: true, steps: [1] },
];

/* ── Spam Score Rules ───────────────────────────────────────────────── */

const SPAM_RULES = [
  { pattern: /FREE/i, weight: 2, suggestion: 'Avoid all-caps "FREE" — use "free" or "complimentary"' },
  { pattern: /!!!/, weight: 1, suggestion: 'Reduce exclamation marks — use max one per sentence' },
  { pattern: /\$[\d,]+/, weight: 1, suggestion: 'Price mentions can trigger spam filters — rephrase if possible' },
  { pattern: /click here/i, weight: 2, suggestion: 'Replace "click here" with descriptive link text' },
  { pattern: /unsubscribe/i, weight: -1, suggestion: '' },
  { pattern: /https?:\/\//g, weight: 1, suggestion: 'Multiple URLs can increase spam score — minimize links' },
  { pattern: /ACT NOW/i, weight: 3, suggestion: 'Urgency phrases like "ACT NOW" are major spam triggers' },
  { pattern: /GUARANTEED/i, weight: 2, suggestion: 'Avoid "GUARANTEED" — it\'s a common spam keyword' },
  { pattern: /no obligation/i, weight: 1, suggestion: '"No obligation" phrasing can raise spam score' },
  { pattern: /winner/i, weight: 2, suggestion: '"Winner" is a high-risk spam keyword' },
];

const selectClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50";
const selectOptionClass = "bg-[#1a1035]";

/* ── Component ──────────────────────────────────────────────────────── */

export function EmailsTab({ onToast, notifUnread = 0, onSwitchTab }: EmailsTabProps) {
  /* ── Sub-tab state ──────────────────────────────────────────────────── */
  const [subTab, setSubTab] = useState<EmailSubTab>('templates');

  /* ── Emails API data ────────────────────────────────────────────────── */
  const [emailsData, setEmailsData] = useState<{
    users: Array<{
      id: string; email: string; name: string | null; emailVerified: boolean;
      plan: string; role: string; createdAt: string;
    }>;
    pagination: { page: number; limit: number; total: number; totalPages: number };
    stats: EmailStats;
    emailConfig: EmailConfig;
  } | null>(null);
  const [emailsLoading, setEmailsLoading] = useState(true);

  /* ── Email logs data ────────────────────────────────────────────────── */
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logStats, setLogStats] = useState({ totalSent: 0, totalFailed: 0, totalSkipped: 0, todayCount: 0, todayFailed: 0, successRate: 0 });

  /* ── Templates state ────────────────────────────────────────────────── */
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [templateEditorOpen, setTemplateEditorOpen] = useState(false);

  /* ── Campaign state ─────────────────────────────────────────────────── */
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [sendCampaignOpen, setSendCampaignOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    templateId: '',
    audience: 'all',
    scheduleType: 'now' as 'now' | 'scheduled',
    scheduledDate: '',
  });

  /* ── Automation state ───────────────────────────────────────────────── */
  const [flows, setFlows] = useState<AutomationFlow[]>(initialFlows);

  /* ── Spam checker state ─────────────────────────────────────────────── */
  const [spamContent, setSpamContent] = useState('');
  const [spamScore, setSpamScore] = useState<number | null>(null);
  const [spamSuggestions, setSpamSuggestions] = useState<Array<{ rule: string; suggestion: string }>>([]);

  /* ── Email settings state ───────────────────────────────────────────── */
  const [emailSettings, setEmailSettings] = useState({
    fromAddress: 'TestCEFR <noreply@testcefr.com>',
    replyTo: 'support@testcefr.com',
    footerText: '© 2025 TestCEFR. All rights reserved.',
    unsubscribeLink: true,
  });

  /* ── Confirm modal ──────────────────────────────────────────────────── */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  /* ── Email queue mock ───────────────────────────────────────────────── */
  const emailQueue = [
    { id: '1', recipient: 'alice@example.com', template: 'Welcome Email', scheduledTime: '2025-03-15T08:00:00Z', status: 'Queued' },
    { id: '2', recipient: 'bob@example.com', template: 'Certificate Issued', scheduledTime: '2025-03-15T08:30:00Z', status: 'Sent' },
    { id: '3', recipient: 'clara@example.com', template: 'Plan Upgrade', scheduledTime: '2025-03-15T09:00:00Z', status: 'Failed' },
    { id: '4', recipient: 'david@example.com', template: 'Assessment Reminder', scheduledTime: '2025-03-15T10:00:00Z', status: 'Queued' },
    { id: '5', recipient: 'emma@example.com', template: 'Weekly Digest', scheduledTime: '2025-03-15T07:00:00Z', status: 'Sent' },
  ];

  /* ── Fetch Emails Data ──────────────────────────────────────────────── */

  const fetchEmails = useCallback(async () => {
    setEmailsLoading(true);
    try {
      const res = await fetch('/api/admin/emails?page=1&limit=5', { credentials: 'same-origin' });
      if (res.ok) setEmailsData(await res.json());
    } catch (e) {
      console.error('Emails fetch error:', e);
    } finally {
      setEmailsLoading(false);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetch(`/api/admin/email-logs?page=${logsPage}&limit=20`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setLogsTotal(data.pagination?.total || 0);
        setLogsTotalPages(data.pagination?.totalPages || 1);
        if (data.stats) setLogStats(data.stats);
      }
    } catch (e) {
      console.error('Email logs fetch error:', e);
    } finally {
      setLogsLoading(false);
    }
  }, [logsPage]);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);
  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  /* ── Computed stats ─────────────────────────────────────────────────── */

  const sentToday = logStats.todayCount;
  const openRate = campaigns.filter((c) => c.status === 'sent').reduce((sum, c) => sum + (c.sentCount > 0 ? Math.round((c.opens / c.sentCount) * 100) : 0), 0) / Math.max(campaigns.filter((c) => c.status === 'sent').length, 1);
  const clickRate = campaigns.filter((c) => c.status === 'sent').reduce((sum, c) => sum + (c.sentCount > 0 ? Math.round((c.clicks / c.sentCount) * 100) : 0), 0) / Math.max(campaigns.filter((c) => c.status === 'sent').length, 1);
  const bounceRate = logStats.totalSent + logStats.totalFailed + logStats.totalSkipped > 0 ? Math.round((logStats.totalFailed / (logStats.totalSent + logStats.totalFailed + logStats.totalSkipped)) * 100) : 0;

  /* ── Handlers ───────────────────────────────────────────────────────── */

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate({ ...template });
    setTemplateEditorOpen(true);
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: String(Date.now()),
      name: `${template.name} (Copy)`,
      usedCount: 0,
      lastEdited: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, newTemplate]);
    onToast('Template duplicated', 'success');
  };

  const handleDeleteTemplate = (template: EmailTemplate) => {
    setConfirmAction({
      title: 'Delete Template',
      message: `Are you sure you want to delete "${template.name}"? This action cannot be undone.`,
      onConfirm: () => {
        setTemplates((prev) => prev.filter((t) => t.id !== template.id));
        onToast('Template deleted', 'success');
      },
    });
    setConfirmOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    setTemplates((prev) => prev.map((t) => t.id === editingTemplate.id ? { ...editingTemplate, lastEdited: new Date().toISOString() } : t));
    setTemplateEditorOpen(false);
    onToast('Template saved successfully', 'success');
  };

  const handleSpamCheck = () => {
    let score = 0;
    const suggestions: Array<{ rule: string; suggestion: string }> = [];
    SPAM_RULES.forEach((rule) => {
      const matches = spamContent.match(rule.pattern);
      if (matches && rule.weight > 0) {
        score += rule.weight * matches.length;
        if (rule.suggestion) {
          suggestions.push({ rule: matches[0], suggestion: rule.suggestion });
        }
      }
    });
    // Bonus for unsubscribe link
    if (/unsubscribe/i.test(spamContent)) score = Math.max(0, score - 1);
    setSpamScore(score);
    setSpamSuggestions(suggestions);
  };

  const handleSendCampaign = () => {
    if (!campaignForm.templateId) {
      onToast('Please select a template', 'error');
      return;
    }
    onToast(`Campaign ${campaignForm.scheduleType === 'now' ? 'sent' : 'scheduled'} successfully!`, 'success');
    setSendCampaignOpen(false);
  };

  const handleTestEmail = async () => {
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        onToast(data.message || 'Test email sent!', 'success');
      } else {
        onToast(data.error || 'Failed to send test email', 'error');
      }
    } catch {
      onToast('Failed to send test email', 'error');
    }
  };

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* ─── Notification Banner ──────────────────────────────────────── */}
      {notifUnread > 0 && (
        <div className="glass-card p-4 border border-violet-500/30 bg-violet-500/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
                <BellRing className="h-4 w-4" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{notifUnread} Unread Notification{notifUnread !== 1 ? 's' : ''}</p>
                <p className="text-white/50 text-xs">New signups, payments, and contact submissions</p>
              </div>
            </div>
            {onSwitchTab && (
              <button
                onClick={() => onSwitchTab('overview')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> View in Bell
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── 1. Email Stats ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Send} label="Sent Today" value={sentToday} change="+8" gradient="from-violet-500 to-indigo-600" />
        <StatCard icon={MailOpen} label="Open Rate" value={`${Math.round(openRate)}%`} change="+3" gradient="from-green-500 to-emerald-600" />
        <StatCard icon={MousePointerClick} label="Click Rate" value={`${Math.round(clickRate)}%`} change="+1" gradient="from-blue-500 to-cyan-600" />
        <StatCard icon={MailX} label="Bounce Rate" value={`${bounceRate}%`} change="-2" gradient="from-amber-500 to-orange-600" />
      </div>

      {/* ─── 2. Email Queue ───────────────────────────────────────────── */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-400" /> Email Queue
          <span className="ml-auto flex items-center gap-1 text-xs text-white/40">
            {emailQueue.filter((e) => e.status === 'Queued').length} pending
          </span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 font-medium px-4 py-2">Recipient</th>
                <th className="text-left text-white/40 font-medium px-4 py-2">Template</th>
                <th className="text-left text-white/40 font-medium px-4 py-2">Scheduled</th>
                <th className="text-left text-white/40 font-medium px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {emailQueue.map((eq) => (
                <tr key={eq.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 text-white/80 text-sm">{eq.recipient}</td>
                  <td className="px-4 py-3 text-white/60 text-sm">{eq.template}</td>
                  <td className="px-4 py-3 text-white/50 text-xs">{formatDateTime(eq.scheduledTime)}</td>
                  <td className="px-4 py-3">
                    {eq.status === 'Queued' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs"><Clock className="h-3 w-3" />Queued</span>}
                    {eq.status === 'Sent' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs"><CheckCircle2 className="h-3 w-3" />Sent</span>}
                    {eq.status === 'Failed' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs"><XCircle className="h-3 w-3" />Failed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Sub-tab Navigation ───────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SUB-TAB: TEMPLATES
          ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'templates' && (
        <>
          {/* 3. Templates List */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-400" /> Email Templates
              </h3>
              <Button
                onClick={() => {
                  setEditingTemplate({ id: String(Date.now()), name: '', subject: '', body: '', lastEdited: new Date().toISOString(), usedCount: 0 });
                  setTemplateEditorOpen(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 text-sm"
              >
                <Plus className="h-4 w-4 mr-2" /> New Template
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-white/40 font-medium px-4 py-3">Template Name</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Subject</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Last Edited</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Used</th>
                    <th className="text-right text-white/40 font-medium px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((t) => (
                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 text-white/90 font-medium">{t.name}</td>
                      <td className="px-4 py-3 text-white/60 max-w-xs truncate">{t.subject}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{formatDate(t.lastEdited)}</td>
                      <td className="px-4 py-3 text-white/50 text-sm">{formatNumber(t.usedCount)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEditTemplate(t)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDuplicateTemplate(t)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors" title="Duplicate">
                            <Copy className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteTemplate(t)} className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 & 5. Template Editor Dialog */}
          <Dialog open={templateEditorOpen} onOpenChange={setTemplateEditorOpen}>
            <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <DialogHeader>
                <DialogTitle className="text-white">{editingTemplate?.name ? 'Edit Template' : 'New Template'}</DialogTitle>
                <DialogDescription className="text-white/40">Design your email template with variable placeholders</DialogDescription>
              </DialogHeader>

              {editingTemplate && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
                  {/* Editor Area (2/3 width) */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <Label className="text-white/60 text-sm mb-2 block">Template Name</Label>
                      <Input
                        value={editingTemplate.name}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                        placeholder="e.g. Welcome Email"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60 text-sm mb-2 block">Subject Line</Label>
                      <Input
                        value={editingTemplate.subject}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                        placeholder="e.g. Welcome to TestCEFR, {{name}}!"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60 text-sm mb-2 block">Email Body</Label>
                      <Textarea
                        value={editingTemplate.body}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                        placeholder="Write your email content here... Use {{variable}} for dynamic content."
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[300px] resize-none font-mono text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setTemplateEditorOpen(false)} className="border-white/20 text-white/70 hover:text-white hover:bg-white/10">Cancel</Button>
                      <Button onClick={handleSaveTemplate} className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400">
                        Save Template
                      </Button>
                    </div>
                  </div>

                  {/* 5. Variables Sidebar (1/3 width) */}
                  <div className="space-y-3">
                    <div className="glass-card p-4">
                      <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-violet-400" /> Available Variables
                      </h4>
                      <div className="space-y-2">
                        {TEMPLATE_VARIABLES.map((v) => (
                          <button
                            key={v.name}
                            onClick={() => {
                              const textarea = document.querySelector('textarea');
                              if (textarea) {
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const text = editingTemplate.body;
                                const newBody = text.substring(0, start) + v.name + text.substring(end);
                                setEditingTemplate({ ...editingTemplate, body: newBody });
                              }
                            }}
                            className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors group"
                          >
                            <code className="text-violet-400 text-xs font-mono">{v.name}</code>
                            <p className="text-white/40 text-xs mt-0.5">{v.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SUB-TAB: CAMPAIGNS
          ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'campaigns' && (
        <>
          {/* 6. Send Campaign Form */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-amber-400" /> Send Campaign
              </h3>
              <Button
                onClick={() => setSendCampaignOpen(true)}
                className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-500/20 text-sm"
              >
                <Send className="h-4 w-4 mr-2" /> New Campaign
              </Button>
            </div>
          </div>

          {/* 7. Campaign History Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" /> Campaign History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-white/40 font-medium px-4 py-3">Name</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Sent</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Opens</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Clicks</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Date</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white/90 font-medium">{c.name}</p>
                        <p className="text-white/40 text-xs">{c.template} · {c.audience}</p>
                      </td>
                      <td className="px-4 py-3 text-white/60">{formatNumber(c.sentCount)}</td>
                      <td className="px-4 py-3">
                        <span className="text-green-400">{formatNumber(c.opens)}</span>
                        {c.sentCount > 0 && <span className="text-white/30 text-xs ml-1">{Math.round((c.opens / c.sentCount) * 100)}%</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-blue-400">{formatNumber(c.clicks)}</span>
                        {c.sentCount > 0 && <span className="text-white/30 text-xs ml-1">{Math.round((c.clicks / c.sentCount) * 100)}%</span>}
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs">{c.date ? formatDate(c.date) : '—'}</td>
                      <td className="px-4 py-3">
                        {c.status === 'sent' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs"><CheckCircle2 className="h-3 w-3" />Sent</span>}
                        {c.status === 'scheduled' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs"><Clock className="h-3 w-3" />Scheduled</span>}
                        {c.status === 'draft' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/40 text-xs"><FileText className="h-3 w-3" />Draft</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Send Campaign Dialog */}
          <Dialog open={sendCampaignOpen} onOpenChange={setSendCampaignOpen}>
            <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">New Campaign</DialogTitle>
                <DialogDescription className="text-white/40">Select a template and audience to send a campaign</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label className="text-white/60 text-sm mb-2 block">Template</Label>
                  <select value={campaignForm.templateId} onChange={(e) => setCampaignForm({ ...campaignForm, templateId: e.target.value })} className={selectClass}>
                    <option value="" className={selectOptionClass}>Select a template...</option>
                    {templates.map((t) => <option key={t.id} value={t.id} className={selectOptionClass}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-white/60 text-sm mb-2 block">Audience</Label>
                  <select value={campaignForm.audience} onChange={(e) => setCampaignForm({ ...campaignForm, audience: e.target.value })} className={selectClass}>
                    <option value="all" className={selectOptionClass}>All Users</option>
                    <option value="free" className={selectOptionClass}>Free Plan Users</option>
                    <option value="paid" className={selectOptionClass}>Paid Users</option>
                    <option value="inactive" className={selectOptionClass}>Inactive (30d+)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white/60 text-sm mb-2 block">Schedule</Label>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setCampaignForm({ ...campaignForm, scheduleType: 'now' })}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        campaignForm.scheduleType === 'now' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'text-white/50 hover:text-white hover:bg-white/5 border border-white/10'
                      }`}
                    >Send Now</button>
                    <button
                      onClick={() => setCampaignForm({ ...campaignForm, scheduleType: 'scheduled' })}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        campaignForm.scheduleType === 'scheduled' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'text-white/50 hover:text-white hover:bg-white/5 border border-white/10'
                      }`}
                    >Schedule</button>
                  </div>
                  {campaignForm.scheduleType === 'scheduled' && (
                    <Input
                      type="datetime-local"
                      value={campaignForm.scheduledDate}
                      onChange={(e) => setCampaignForm({ ...campaignForm, scheduledDate: e.target.value })}
                      className="bg-white/5 border-white/10 text-white text-sm"
                    />
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setSendCampaignOpen(false)} className="border-white/20 text-white/70 hover:text-white hover:bg-white/10">Cancel</Button>
                  <Button onClick={handleSendCampaign} className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400">
                    {campaignForm.scheduleType === 'now' ? 'Send Now' : 'Schedule'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SUB-TAB: AUTOMATION
          ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'automation' && (
        <>
          {/* 8. Active Automation Flows */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Workflow className="h-4 w-4 text-violet-400" /> Automation Flows
            </h3>
            <div className="space-y-3">
              {flows.map((flow) => (
                <div key={flow.id} className="glass-card p-4 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white/90 font-medium text-sm">{flow.name}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${flow.enabled ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                          {flow.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs mb-2">{flow.purpose}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-white/30">Trigger:</span>
                        <span className="text-violet-400">{flow.trigger}</span>
                        <span className="text-white/20 mx-1">·</span>
                        <span className="text-white/30">{flow.emailCount} email{flow.emailCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <Switch
                      checked={flow.enabled}
                      onCheckedChange={(checked) => {
                        setFlows((prev) => prev.map((f) => f.id === flow.id ? { ...f, enabled: checked } : f));
                        onToast(`${flow.name} ${checked ? 'enabled' : 'disabled'}`, 'success');
                      }}
                    />
                  </div>

                  {/* Flow Steps Visual */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1">
                      <span className="text-white/30 text-xs mr-2">Steps:</span>
                      {flow.steps.map((step, i) => (
                        <div key={i} className="flex items-center">
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                            flow.enabled ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-white/30'
                          }`}>
                            {step}
                          </div>
                          {i < flow.steps.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-white/20 mx-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 9. Automation Presets */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" /> Quick Presets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'Welcome Series', desc: '3 emails over 5 days', icon: '👋', color: 'from-green-500/20 to-emerald-500/20 border-green-500/20' },
                { name: 'Post-Test Certificate', desc: '1 email with certificate', icon: '🏆', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/20' },
                { name: 'Nurture Sequence', desc: '5 emails with lessons', icon: '📚', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/20' },
                { name: 'Re-engagement', desc: '3 emails with offers', icon: '🔄', color: 'from-violet-500/20 to-indigo-500/20 border-violet-500/20' },
                { name: 'Upsell to Paid', desc: '2 emails with discount', icon: '💎', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/20' },
                { name: 'Weekly Newsletter', desc: '1 email with tips', icon: '📧', color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/20' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onToast(`${preset.name} preset activated`, 'success')}
                  className={`p-4 rounded-xl bg-gradient-to-br ${preset.color} border text-left hover:scale-[1.02] transition-transform`}
                >
                  <span className="text-2xl">{preset.icon}</span>
                  <h4 className="text-white/90 font-medium text-sm mt-2">{preset.name}</h4>
                  <p className="text-white/40 text-xs mt-1">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SUB-TAB: DELIVERY
          ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'delivery' && (
        <>
          {/* 10. Delivery Log Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Send className="h-4 w-4 text-green-400" /> Delivery Log
              </h3>
              <button onClick={fetchLogs} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>

            {logsLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg bg-white/5" />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <EmptyState icon={Send} title="No delivery logs" description="Email delivery logs will appear here" />
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[#0F0A1E] z-10">
                    <tr className="border-b border-white/5">
                      <th className="text-left text-white/40 font-medium px-4 py-3">Recipient</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Type</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Sent Time</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Opened</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-white/80 text-sm">{log.to}</p>
                            {log.user?.name && <p className="text-white/40 text-xs">{log.user.name}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-white/50 text-xs">{log.type}</span>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs">{formatDateTime(log.createdAt)}</td>
                        <td className="px-4 py-3">
                          {log.isRead
                            ? <CheckCircle2 className="h-4 w-4 text-green-400" />
                            : <XCircle className="h-4 w-4 text-white/20" />}
                        </td>
                        <td className="px-4 py-3">
                          {log.status === 'sent' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Delivered</span>}
                          {log.status === 'failed' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">Failed</span>}
                          {log.status === 'skipped' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs">Skipped</span>}
                          {log.status === 'pending' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">Pending</span>}
                          {!['sent', 'failed', 'skipped', 'pending'].includes(log.status) && <span className="text-white/40 text-xs">{log.status}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {logs.length > 0 && (
              <div className="px-4 pb-4">
                <Pagination page={logsPage} totalPages={logsTotalPages} onPageChange={setLogsPage} total={logsTotal} pageSize={20} />
              </div>
            )}
          </div>

          {/* 11. Spam Score Checker */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-400" /> Spam Score Checker
            </h3>
            <Textarea
              value={spamContent}
              onChange={(e) => { setSpamContent(e.target.value); setSpamScore(null); }}
              placeholder="Paste your email content here to check for spam triggers..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[120px] resize-none text-sm"
            />
            <div className="flex items-center gap-3 mt-3">
              <Button
                onClick={handleSpamCheck}
                disabled={!spamContent.trim()}
                className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400"
              >
                <Shield className="h-4 w-4 mr-2" /> Check Spam Score
              </Button>
              {spamScore !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-white/50 text-sm">Score:</span>
                  <span className={`text-2xl font-bold ${spamScore <= 2 ? 'text-green-400' : spamScore <= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                    {spamScore}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    spamScore <= 2 ? 'bg-green-500/20 text-green-400' :
                    spamScore <= 5 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {spamScore <= 2 ? 'Low Risk' : spamScore <= 5 ? 'Medium Risk' : 'High Risk'}
                  </span>
                </div>
              )}
            </div>
            {spamSuggestions.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider">Suggestions</h4>
                {spamSuggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <code className="text-amber-400 text-xs">&quot;{s.rule}&quot;</code>
                      <p className="text-white/50 text-xs mt-0.5">{s.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SUB-TAB: SETTINGS
          ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'settings' && (
        <>
          {/* 12. Email Settings */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-violet-400" /> Email Settings
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-white/60 text-sm mb-2 block">From Address</Label>
                <Input
                  value={emailSettings.fromAddress}
                  onChange={(e) => setEmailSettings({ ...emailSettings, fromAddress: e.target.value })}
                  className="bg-white/5 border-white/10 text-white text-sm"
                />
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Reply-To Address</Label>
                <Input
                  value={emailSettings.replyTo}
                  onChange={(e) => setEmailSettings({ ...emailSettings, replyTo: e.target.value })}
                  className="bg-white/5 border-white/10 text-white text-sm"
                />
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Footer Text</Label>
                <Textarea
                  value={emailSettings.footerText}
                  onChange={(e) => setEmailSettings({ ...emailSettings, footerText: e.target.value })}
                  className="bg-white/5 border-white/10 text-white text-sm min-h-[60px] resize-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Include Unsubscribe Link</p>
                  <p className="text-white/40 text-xs">Required for compliance (CAN-SPAM, GDPR)</p>
                </div>
                <Switch
                  checked={emailSettings.unsubscribeLink}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, unsubscribeLink: checked })}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => onToast('Email settings saved', 'success')}
                  className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </div>

          {/* 13. Email Service Config Card */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-400" /> Email Service Configuration
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
                <span className="text-white text-sm break-all">{emailsData?.emailConfig.appUrl || '—'}</span>
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="h-4 w-4 text-white/40" />
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
            <div className="mt-4 flex items-center gap-3">
              <Button
                onClick={handleTestEmail}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400"
              >
                <Send className="h-4 w-4 mr-2" /> Send Test Email
              </Button>
              <p className="text-white/40 text-xs">Sends a test email to verify Resend integration</p>
            </div>
          </div>

          {/* Delivery Stats Summary */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cyan-400" /> Delivery Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-white font-semibold text-lg">{formatNumber(logStats.totalSent)}</p>
                <p className="text-white/40 text-xs">Total Sent</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-red-400 font-semibold text-lg">{formatNumber(logStats.totalFailed)}</p>
                <p className="text-white/40 text-xs">Failed</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-green-400 font-semibold text-lg">{logStats.successRate}%</p>
                <p className="text-white/40 text-xs">Success Rate</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-blue-400 font-semibold text-lg">{logStats.todayCount}</p>
                <p className="text-white/40 text-xs">Sent Today</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── Confirm Modal ─────────────────────────────────────────────── */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (confirmAction) confirmAction.onConfirm();
          setConfirmOpen(false);
        }}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
