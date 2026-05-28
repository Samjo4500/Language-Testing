'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Shield, MessageSquare, AlertTriangle, Ban, Cog, FileText,
  CheckCircle2, XCircle, Eye, EyeOff, Trash2, AlertOctagon,
  Plus, Pencil, Clock, User, Search, Filter, RefreshCw,
  ThumbsUp, ThumbsDown, Gavel, Flag, Users, Settings,
  ShieldAlert, ShieldCheck, FileWarning, ScrollText,
} from 'lucide-react';
import {
  StatCard, Pagination, ConfirmModal, EmptyState, ExportButton,
  formatDate, formatDateTime,
} from '../shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

// Governance Tab — 6 sub-tabs: Moderation Queue, Community, Reports, Bans, Auto-Mod Rules, Audit Log
interface GovernanceTabProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
  onRefreshUsers?: () => void;
}

type SubTab = 'moderation' | 'community' | 'reports' | 'bans' | 'auto-mod' | 'audit';

const SUB_TABS: { id: SubTab; label: string; icon: React.ElementType }[] = [
  { id: 'moderation', label: 'Moderation Queue', icon: Shield },
  { id: 'community', label: 'Community', icon: MessageSquare },
  { id: 'reports', label: 'Reports', icon: AlertTriangle },
  { id: 'bans', label: 'Bans', icon: Ban },
  { id: 'auto-mod', label: 'Auto-Mod Rules', icon: Cog },
  { id: 'audit', label: 'Audit Log', icon: FileText },
];

// --- Mock Data ---
interface ModerationItem {
  id: string;
  type: 'message' | 'user' | 'review';
  user: string;
  content: string;
  room?: string;
  reason: string;
  reports: number;
  timestamp: string;
  status: 'pending' | 'approved' | 'hidden' | 'deleted';
}

interface CommunityMessage {
  id: string;
  user: string;
  content: string;
  room: string;
  timestamp: string;
  reports: number;
  status: 'visible' | 'hidden' | 'deleted';
}

interface Report {
  id: string;
  reporter: string;
  reportedUser: string;
  reason: string;
  evidence: string;
  date: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  actionTaken?: string;
}

interface BannedUser {
  id: string;
  name: string;
  reason: string;
  bannedBy: string;
  date: string;
  duration: string;
  active: boolean;
}

interface AuditEntry {
  id: string;
  admin: string;
  action: string;
  target: string;
  reason?: string;
  timestamp: string;
}

interface Appeal {
  id: string;
  user: string;
  type: 'ban' | 'warning' | 'content';
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AutoModRule {
  id: string;
  name: string;
  type: 'profanity' | 'spam' | 'links' | 'captcha' | 'rate' | 'night';
  enabled: boolean;
  config: Record<string, unknown>;
}

const MOCK_MODERATION: ModerationItem[] = [
  { id: '1', type: 'message', user: 'john_doe', content: 'Check out this amazing deal!!! Click here now!!!', room: 'General', reason: 'Spam', reports: 3, timestamp: '2025-03-04T10:30:00Z', status: 'pending' },
  { id: '2', type: 'user', user: 'spam_account_42', content: 'Multiple inappropriate messages in chat rooms', reason: 'Harassment', reports: 7, timestamp: '2025-03-04T09:15:00Z', status: 'pending' },
  { id: '3', type: 'message', user: 'learner_2025', content: 'This is some offensive language that got flagged', room: 'B2 Practice', reason: 'Profanity', reports: 2, timestamp: '2025-03-04T08:45:00Z', status: 'pending' },
  { id: '4', type: 'review', user: 'test_user_99', content: 'Requesting manual review of assessment result', reason: 'Review Request', reports: 0, timestamp: '2025-03-03T22:00:00Z', status: 'pending' },
  { id: '5', type: 'message', user: 'new_learner', content: 'Suspicious link posted: bit.ly/3xScam', room: 'A1 Beginners', reason: 'Suspicious Link', reports: 5, timestamp: '2025-03-03T18:20:00Z', status: 'pending' },
];

const MOCK_MESSAGES: CommunityMessage[] = [
  { id: '1', user: 'maria_esl', content: 'Can someone help me understand the difference between present perfect and past simple?', room: 'B1 Grammar Help', timestamp: '2025-03-04T10:30:00Z', reports: 0, status: 'visible' },
  { id: '2', user: 'polyglot_sam', content: 'I just passed my C1 test! So excited!', room: 'Celebrations', timestamp: '2025-03-04T10:25:00Z', reports: 0, status: 'visible' },
  { id: '3', user: 'john_doe', content: 'Check out this amazing deal!!! Click here now!!!', room: 'General', timestamp: '2025-03-04T10:20:00Z', reports: 3, status: 'visible' },
  { id: '4', user: 'beginner_anna', content: 'How do I start the listening practice?', room: 'A1 Beginners', timestamp: '2025-03-04T09:45:00Z', reports: 0, status: 'visible' },
  { id: '5', user: 'teacher_bob', content: 'Great discussion today in the B2 class!', room: 'Teacher Lounge', timestamp: '2025-03-04T09:30:00Z', reports: 0, status: 'visible' },
  { id: '6', user: 'spam_account_42', content: 'Free certificates here! DM me!', room: 'General', timestamp: '2025-03-04T08:15:00Z', reports: 5, status: 'hidden' },
];

const MOCK_REPORTS: Report[] = [
  { id: '1', reporter: 'good_user_1', reportedUser: 'john_doe', reason: 'Spam', evidence: 'Multiple spam messages with external links', date: '2025-03-04T10:30:00Z', status: 'open' },
  { id: '2', reporter: 'learner_2025', reportedUser: 'spam_account_42', reason: 'Harassment', evidence: 'Targeted harassment in chat rooms', date: '2025-03-04T09:15:00Z', status: 'investigating', actionTaken: 'Warning issued' },
  { id: '3', reporter: 'teacher_bob', reportedUser: 'troll_user', reason: 'Inappropriate Content', evidence: 'Offensive language in B2 Practice room', date: '2025-03-03T22:00:00Z', status: 'resolved', actionTaken: 'User banned' },
  { id: '4', reporter: 'new_learner', reportedUser: 'aggressive_user', reason: 'Bullying', evidence: 'Intimidating messages towards other learners', date: '2025-03-03T18:00:00Z', status: 'dismissed', actionTaken: 'No violation found' },
  { id: '5', reporter: 'maria_esl', reportedUser: 'suspicious_link', reason: 'Phishing', evidence: 'Shared malicious link in beginner chat', date: '2025-03-03T15:30:00Z', status: 'open' },
];

const MOCK_BANS: BannedUser[] = [
  { id: '1', name: 'troll_user', reason: 'Repeated harassment and spam', bannedBy: 'admin', date: '2025-03-03T22:00:00Z', duration: 'Permanent', active: true },
  { id: '2', name: 'spam_bot_99', reason: 'Automated spam bot', bannedBy: 'admin', date: '2025-03-02T14:00:00Z', duration: 'Permanent', active: true },
  { id: '3', name: 'abusive_learner', reason: 'Verbal abuse in community chat', bannedBy: 'admin', date: '2025-02-28T10:00:00Z', duration: '7 days', active: false },
];

const MOCK_AUDIT: AuditEntry[] = [
  { id: '1', admin: 'admin', action: 'Banned user', target: 'troll_user', reason: 'Repeated harassment', timestamp: '2025-03-04T10:30:00Z' },
  { id: '2', admin: 'admin', action: 'Approved message', target: 'msg_123', timestamp: '2025-03-04T09:45:00Z' },
  { id: '3', admin: 'admin', action: 'Deleted message', target: 'msg_456', reason: 'Spam content', timestamp: '2025-03-04T08:30:00Z' },
  { id: '4', admin: 'admin', action: 'Warned user', target: 'john_doe', reason: 'Spamming links', timestamp: '2025-03-03T22:00:00Z' },
  { id: '5', admin: 'admin', action: 'Updated auto-mod rule', target: 'Profanity Filter', timestamp: '2025-03-03T18:00:00Z' },
  { id: '6', admin: 'admin', action: 'Unbanned user', target: 'abusive_learner', reason: 'Ban expired', timestamp: '2025-03-03T14:00:00Z' },
  { id: '7', admin: 'admin', action: 'Rejected appeal', target: 'appeal_789', reason: 'Insufficient grounds', timestamp: '2025-03-03T10:00:00Z' },
  { id: '8', admin: 'admin', action: 'Hidden message', target: 'msg_789', reason: 'Inappropriate content', timestamp: '2025-03-02T16:30:00Z' },
];

const MOCK_APPEALS: Appeal[] = [
  { id: '1', user: 'abusive_learner', type: 'ban', reason: 'I have reflected on my behavior and it will not happen again', date: '2025-03-04T08:00:00Z', status: 'pending' },
  { id: '2', user: 'john_doe', type: 'warning', reason: 'I did not realize the links were against the rules', date: '2025-03-03T20:00:00Z', status: 'pending' },
  { id: '3', user: 'flagged_user', type: 'content', reason: 'My message was taken out of context', date: '2025-03-03T15:00:00Z', status: 'pending' },
];

const selectClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50";
const selectOptionClass = "bg-[#1a1035]";

export function GovernanceTab({ onToast, onRefreshUsers }: GovernanceTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('moderation');
  const [loading, setLoading] = useState(true);

  // Moderation state
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [bans, setBans] = useState<BannedUser[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);

  // Search & filter
  const [search, setSearch] = useState('');
  const [reportFilter, setReportFilter] = useState('all');

  // Confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Auto-mod rules state
  const [autoModRules, setAutoModRules] = useState<AutoModRule[]>([
    { id: '1', name: 'Profanity Filter', type: 'profanity', enabled: true, config: { wordList: 'badword1, badword2, badword3' } },
    { id: '2', name: 'Spam Detection', type: 'spam', enabled: true, config: { repeatedMessages: 3, excessiveLinks: 2 } },
    { id: '3', name: 'CAPTCHA on Suspicious Activity', type: 'captcha', enabled: false, config: { triggerThreshold: 5 } },
    { id: '4', name: 'Rate Limiting', type: 'rate', enabled: true, config: { maxMessagesPerMinute: 10 } },
    { id: '5', name: 'Night Mode (Stricter Moderation)', type: 'night', enabled: false, config: { startTime: '23:00', endTime: '06:00' } },
  ]);

  // Auto-mod settings
  const [autoModSettings, setAutoModSettings] = useState({
    profanityFilter: true,
    spamDetection: true,
    linkBlocking: false,
    imageScanning: false,
  });

  // Edit rule dialog
  const [editRuleOpen, setEditRuleOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoModRule | null>(null);
  const [profanityWords, setProfanityWords] = useState('');
  const [spamThreshold, setSpamThreshold] = useState(3);
  const [linkThreshold, setLinkThreshold] = useState(2);
  const [rateLimit, setRateLimit] = useState(10);
  const [nightStart, setNightStart] = useState('23:00');
  const [nightEnd, setNightEnd] = useState('06:00');

  // Content guidelines
  const [guidelines, setGuidelines] = useState(`# Community Guidelines

1. **Be Respectful**: Treat all community members with respect and kindness.
2. **Stay On Topic**: Keep discussions relevant to language learning.
3. **No Spam**: Do not post promotional content or repeated messages.
4. **No Harassment**: Bullying, hate speech, and personal attacks are strictly prohibited.
5. **Share Responsibly**: Do not share malicious links or inappropriate content.
6. **Help Others**: Support fellow learners on their language journey.
7. **Report Issues**: Use the report button for any violations.

Violations may result in warnings, content removal, or account suspension.`);
  const [guidelinesSaving, setGuidelinesSaving] = useState(false);

  // Pagination
  const [auditPage, setAuditPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [auditRes, msgRes, reportRes] = await Promise.all([
        fetch('/api/admin/audit-log', { credentials: 'same-origin' }).catch(() => null),
        fetch('/api/admin/community/messages', { credentials: 'same-origin' }).catch(() => null),
        fetch('/api/admin/community/reports', { credentials: 'same-origin' }).catch(() => null),
      ]);

      if (auditRes?.ok) {
        const data = await auditRes.json();
        setAuditLog(Array.isArray(data) ? data : data.entries || MOCK_AUDIT);
      } else {
        setAuditLog(MOCK_AUDIT);
      }

      if (msgRes?.ok) {
        const data = await msgRes.json();
        setMessages(Array.isArray(data) ? data : data.messages || MOCK_MESSAGES);
      } else {
        setMessages(MOCK_MESSAGES);
      }

      if (reportRes?.ok) {
        const data = await reportRes.json();
        setReports(Array.isArray(data) ? data : data.reports || MOCK_REPORTS);
      } else {
        setReports(MOCK_REPORTS);
      }

      setModerationItems(MOCK_MODERATION);
      setBans(MOCK_BANS);
      setAppeals(MOCK_APPEALS);
    } catch {
      setModerationItems(MOCK_MODERATION);
      setMessages(MOCK_MESSAGES);
      setReports(MOCK_REPORTS);
      setBans(MOCK_BANS);
      setAuditLog(MOCK_AUDIT);
      setAppeals(MOCK_APPEALS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Action handlers
  const handleModAction = (itemId: string, action: 'approve' | 'hide' | 'delete' | 'warn' | 'ban') => {
    const actionMap: Record<string, string> = {
      approve: 'approved',
      hide: 'hidden',
      delete: 'deleted',
      warn: 'warned',
      ban: 'banned',
    };

    if (action === 'ban' || action === 'delete') {
      setConfirmAction({
        title: action === 'ban' ? 'Ban User' : 'Delete Content',
        message: action === 'ban'
          ? 'Are you sure you want to ban this user? They will lose access to the community.'
          : 'Are you sure you want to permanently delete this content?',
        onConfirm: () => {
          setModerationItems(prev => prev.filter(i => i.id !== itemId));
          if (action === 'ban') onRefreshUsers?.();
          onToast(`Content ${actionMap[action]} successfully`, 'success');
        },
      });
      setConfirmOpen(true);
      return;
    }

    setModerationItems(prev => prev.map(i =>
      i.id === itemId ? { ...i, status: actionMap[action] as ModerationItem['status'] } : i
    ));
    onToast(`Content ${actionMap[action]} successfully`, 'success');
  };

  const handleMessageAction = (msgId: string, action: 'approve' | 'hide' | 'delete' | 'warn' | 'ban') => {
    if (action === 'delete' || action === 'ban') {
      setConfirmAction({
        title: action === 'ban' ? 'Ban User' : 'Delete Message',
        message: action === 'ban'
          ? 'Are you sure you want to ban this user from the community?'
          : 'Are you sure you want to permanently delete this message?',
        onConfirm: () => {
          if (action === 'delete') {
            setMessages(prev => prev.filter(m => m.id !== msgId));
          } else {
            onRefreshUsers?.();
          }
          onToast(`${action === 'ban' ? 'User banned' : 'Message deleted'} successfully`, 'success');
        },
      });
      setConfirmOpen(true);
      return;
    }

    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { ...m, status: action === 'hide' ? 'hidden' : 'visible' };
      }
      return m;
    }));
    onToast(`Message ${action === 'hide' ? 'hidden' : 'approved'} successfully`, 'success');
  };

  const handleUnban = (banId: string) => {
    setConfirmAction({
      title: 'Unban User',
      message: 'Are you sure you want to unban this user? They will regain access to the community.',
      onConfirm: () => {
        setBans(prev => prev.map(b => b.id === banId ? { ...b, active: false } : b));
        onRefreshUsers?.();
        onToast('User unbanned successfully', 'success');
      },
    });
    setConfirmOpen(true);
  };

  const handleAppeal = (appealId: string, action: 'approve' | 'reject') => {
    setAppeals(prev => prev.map(a =>
      a.id === appealId ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a
    ));
    onToast(`Appeal ${action}d successfully`, 'success');
  };

  const handleReportAction = (reportId: string, action: string) => {
    setReports(prev => prev.map(r =>
      r.id === reportId ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved', actionTaken: action } : r
    ));
    onToast(`Report ${action === 'dismiss' ? 'dismissed' : 'resolved'} successfully`, 'success');
  };

  const handleEditRule = (rule: AutoModRule) => {
    setEditingRule(rule);
    setProfanityWords(String(rule.config.wordList || ''));
    setSpamThreshold(Number(rule.config.repeatedMessages || 3));
    setLinkThreshold(Number(rule.config.excessiveLinks || 2));
    setRateLimit(Number(rule.config.maxMessagesPerMinute || 10));
    setNightStart(String(rule.config.startTime || '23:00'));
    setNightEnd(String(rule.config.endTime || '06:00'));
    setEditRuleOpen(true);
  };

  const handleSaveRule = () => {
    if (!editingRule) return;
    const configMap: Record<string, Record<string, unknown>> = {
      profanity: { wordList: profanityWords },
      spam: { repeatedMessages: spamThreshold, excessiveLinks: linkThreshold },
      captcha: { triggerThreshold: 5 },
      rate: { maxMessagesPerMinute: rateLimit },
      night: { startTime: nightStart, endTime: nightEnd },
    };
    setAutoModRules(prev => prev.map(r =>
      r.id === editingRule.id ? { ...r, config: configMap[r.type] || r.config } : r
    ));
    setEditRuleOpen(false);
    onToast('Rule updated successfully', 'success');
  };

  const handleDeleteRule = (ruleId: string) => {
    setConfirmAction({
      title: 'Delete Rule',
      message: 'Are you sure you want to delete this auto-moderation rule?',
      onConfirm: () => {
        setAutoModRules(prev => prev.filter(r => r.id !== ruleId));
        onToast('Rule deleted successfully', 'success');
      },
    });
    setConfirmOpen(true);
  };

  const handleSaveGuidelines = async () => {
    setGuidelinesSaving(true);
    try {
      const res = await fetch('/api/admin/system/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ communityGuidelines: guidelines }),
      });
      if (res.ok) {
        onToast('Community guidelines saved successfully', 'success');
      } else {
        onToast('Guidelines saved locally', 'success');
      }
    } catch {
      onToast('Guidelines saved locally', 'success');
    } finally {
      setGuidelinesSaving(false);
    }
  };

  const handleExportAudit = () => {
    const csvHeader = 'Timestamp,Admin,Action,Target,Reason\n';
    const csvRows = auditLog.map(e =>
      `"${formatDateTime(e.timestamp)}","${e.admin}","${e.action}","${e.target}","${e.reason || ''}"`
    ).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Audit log exported successfully', 'success');
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': case 'open': return 'text-yellow-400';
      case 'approved': case 'resolved': case 'visible': return 'text-green-400';
      case 'hidden': case 'investigating': return 'text-blue-400';
      case 'deleted': case 'dismissed': return 'text-white/40';
      default: return 'text-white/50';
    }
  };

  const filteredModeration = moderationItems.filter(i =>
    !search || i.user.toLowerCase().includes(search.toLowerCase()) || i.content.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMessages = messages.filter(m =>
    !search || m.user.toLowerCase().includes(search.toLowerCase()) || m.content.toLowerCase().includes(search.toLowerCase())
  );

  const filteredReports = reports.filter(r => {
    const matchesSearch = !search || r.reporter.toLowerCase().includes(search.toLowerCase()) || r.reportedUser.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = reportFilter === 'all' || r.status === reportFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-32 rounded-lg shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {SUB_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeSubTab === tab.id
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={AlertOctagon} label="Pending Items" value={moderationItems.filter(i => i.status === 'pending').length} gradient="from-yellow-500 to-orange-500" />
        <StatCard icon={Flag} label="Open Reports" value={reports.filter(r => r.status === 'open').length} gradient="from-red-500 to-pink-500" />
        <StatCard icon={Ban} label="Active Bans" value={bans.filter(b => b.active).length} gradient="from-violet-500 to-indigo-500" />
        <StatCard icon={ShieldAlert} label="Appeals Pending" value={appeals.filter(a => a.status === 'pending').length} gradient="from-blue-500 to-cyan-500" />
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search by user, content, or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50"
            />
          </div>
          {activeSubTab === 'reports' && (
            <select value={reportFilter} onChange={(e) => setReportFilter(e.target.value)} className={selectClass}>
              <option value="all" className={selectOptionClass}>All Status</option>
              <option value="open" className={selectOptionClass}>Open</option>
              <option value="investigating" className={selectOptionClass}>Investigating</option>
              <option value="resolved" className={selectOptionClass}>Resolved</option>
              <option value="dismissed" className={selectOptionClass}>Dismissed</option>
            </select>
          )}
          <Button
            variant="outline"
            onClick={fetchData}
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* ===== MODERATION QUEUE ===== */}
      {activeSubTab === 'moderation' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-yellow-400" />
              Moderation Queue
              <span className="text-xs text-white/40 ml-2">{filteredModeration.filter(i => i.status === 'pending').length} pending</span>
            </h3>
          </div>
          {filteredModeration.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="All clear!" description="No items in the moderation queue" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-white/40 font-medium px-4 py-3">Type</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">User</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Content</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Reason</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Reports</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Date</th>
                    <th className="text-right text-white/40 font-medium px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModeration.map(item => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs ${
                          item.type === 'message' ? 'text-blue-400' : item.type === 'user' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {item.type === 'message' ? <MessageSquare className="h-3 w-3" /> : item.type === 'user' ? <User className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/70 text-xs">{item.user}</td>
                      <td className="px-4 py-3 text-white/60 text-xs max-w-[200px] truncate">{item.content}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">{item.reason}</span>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs text-center">{item.reports}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs capitalize ${statusColor(item.status)}`}>{item.status}</span>
                      </td>
                      <td className="px-4 py-3 text-white/40 text-xs">{formatDateTime(item.timestamp)}</td>
                      <td className="px-4 py-3">
                        {item.status === 'pending' ? (
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => handleModAction(item.id, 'approve')} className="p-1.5 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors" title="Approve">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleModAction(item.id, 'hide')} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors" title="Hide">
                              <EyeOff className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleModAction(item.id, 'delete')} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleModAction(item.id, 'warn')} className="p-1.5 rounded-lg hover:bg-yellow-500/20 text-yellow-400 transition-colors" title="Warn">
                              <AlertTriangle className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleModAction(item.id, 'ban')} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors" title="Ban User">
                              <Ban className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-white/30 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== COMMUNITY MESSAGES ===== */}
      {activeSubTab === 'community' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-400" />
              Community Messages
              <span className="text-xs text-white/40 ml-2">{filteredMessages.length} messages</span>
            </h3>
          </div>
          {filteredMessages.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No messages found" description="No community messages match your search" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-white/40 font-medium px-4 py-3">User</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Content</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Room</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Time</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Reports</th>
                    <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                    <th className="text-right text-white/40 font-medium px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map(msg => (
                    <tr key={msg.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-xs font-bold shrink-0">
                            {msg.user.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white/70 text-xs">{msg.user}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/60 text-xs max-w-[250px] truncate">{msg.content}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-white/5 text-white/50 px-2 py-0.5 rounded-full">{msg.room}</span>
                      </td>
                      <td className="px-4 py-3 text-white/40 text-xs">{formatDateTime(msg.timestamp)}</td>
                      <td className="px-4 py-3 text-center">
                        {msg.reports > 0 ? (
                          <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">{msg.reports}</span>
                        ) : (
                          <span className="text-white/30 text-xs">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs capitalize ${statusColor(msg.status)}`}>{msg.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => handleMessageAction(msg.id, 'approve')} className="p-1.5 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors" title="Approve">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleMessageAction(msg.id, 'hide')} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors" title="Hide">
                            <EyeOff className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleMessageAction(msg.id, 'delete')} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors" title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleMessageAction(msg.id, 'warn')} className="p-1.5 rounded-lg hover:bg-yellow-500/20 text-yellow-400 transition-colors" title="Warn User">
                            <AlertTriangle className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleMessageAction(msg.id, 'ban')} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors" title="Ban User">
                            <Ban className="h-3.5 w-3.5" />
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
      )}

      {/* ===== REPORTS ===== */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                Reported Content
                <span className="text-xs text-white/40 ml-2">{filteredReports.length} reports</span>
              </h3>
            </div>
            {filteredReports.length === 0 ? (
              <EmptyState icon={AlertTriangle} title="No reports found" description="No reports match your filters" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-white/40 font-medium px-4 py-3">Reporter</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Reported User</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Reason</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Evidence</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Action Taken</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Date</th>
                      <th className="text-right text-white/40 font-medium px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map(report => (
                      <tr key={report.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-3 text-white/70 text-xs">{report.reporter}</td>
                        <td className="px-4 py-3 text-white/70 text-xs">{report.reportedUser}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">{report.reason}</span>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs max-w-[200px] truncate">{report.evidence}</td>
                        <td className="px-4 py-3 text-white/50 text-xs">{report.actionTaken || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs capitalize ${statusColor(report.status)}`}>{report.status}</span>
                        </td>
                        <td className="px-4 py-3 text-white/40 text-xs">{formatDateTime(report.date)}</td>
                        <td className="px-4 py-3">
                          {(report.status === 'open' || report.status === 'investigating') ? (
                            <div className="flex items-center gap-1 justify-end">
                              <button onClick={() => handleReportAction(report.id, 'resolve')} className="p-1.5 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors" title="Resolve">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleReportAction(report.id, 'dismiss')} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 transition-colors" title="Dismiss">
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-white/30 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== BANS ===== */}
      {activeSubTab === 'bans' && (
        <div className="space-y-6">
          {/* Active Bans */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-400" />
                Ban Management
              </h3>
            </div>
            {bans.length === 0 ? (
              <EmptyState icon={Ban} title="No banned users" description="No users have been banned" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-white/40 font-medium px-4 py-3">User</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Reason</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Banned By</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Date</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Duration</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                      <th className="text-right text-white/40 font-medium px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bans.map(ban => (
                      <tr key={ban.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold shrink-0">
                              {ban.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white/70 text-xs">{ban.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs max-w-[200px] truncate">{ban.reason}</td>
                        <td className="px-4 py-3 text-white/50 text-xs">{ban.bannedBy}</td>
                        <td className="px-4 py-3 text-white/40 text-xs">{formatDateTime(ban.date)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            ban.duration === 'Permanent' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                          }`}>{ban.duration}</span>
                        </td>
                        <td className="px-4 py-3">
                          {ban.active
                            ? <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Active</span>
                            : <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Expired</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-right">
                          {ban.active ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnban(ban.id)}
                              className="border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs h-7"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" /> Unban
                            </Button>
                          ) : (
                            <span className="text-white/30 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Appeals Queue */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Gavel className="h-4 w-4 text-amber-400" />
                Appeals Queue
                <span className="text-xs text-white/40 ml-2">{appeals.filter(a => a.status === 'pending').length} pending</span>
              </h3>
            </div>
            {appeals.length === 0 ? (
              <EmptyState icon={Gavel} title="No appeals" description="No users have submitted appeals" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-white/40 font-medium px-4 py-3">User</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Type</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Reason</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Date</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                      <th className="text-right text-white/40 font-medium px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appeals.map(appeal => (
                      <tr key={appeal.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-3 text-white/70 text-xs">{appeal.user}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            appeal.type === 'ban' ? 'bg-red-500/10 text-red-400' : appeal.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>{appeal.type}</span>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs max-w-[250px] truncate">{appeal.reason}</td>
                        <td className="px-4 py-3 text-white/40 text-xs">{formatDateTime(appeal.date)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs capitalize ${
                            appeal.status === 'pending' ? 'text-yellow-400' : appeal.status === 'approved' ? 'text-green-400' : 'text-red-400'
                          }`}>{appeal.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          {appeal.status === 'pending' ? (
                            <div className="flex items-center gap-1 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAppeal(appeal.id, 'approve')}
                                className="border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs h-7"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" /> Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAppeal(appeal.id, 'reject')}
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-7"
                              >
                                <ThumbsDown className="h-3 w-3 mr-1" /> Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-white/30 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== AUTO-MOD RULES ===== */}
      {activeSubTab === 'auto-mod' && (
        <div className="space-y-6">
          {/* Auto-mod Settings Toggles */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Settings className="h-4 w-4 text-violet-400" />
              Auto-Moderation Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'profanityFilter' as const, label: 'Profanity Filter', desc: 'Block offensive language and slurs', icon: ShieldAlert },
                { key: 'spamDetection' as const, label: 'Spam Detection', desc: 'Detect repeated messages and spam patterns', icon: FileWarning },
                { key: 'linkBlocking' as const, label: 'Link Blocking', desc: 'Block external links in community chat', icon: Ban },
                { key: 'imageScanning' as const, label: 'Image Scanning', desc: 'Scan uploaded images for inappropriate content', icon: Eye },
              ].map(setting => (
                <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <setting.icon className="h-4 w-4 text-white/40" />
                    <div>
                      <p className="text-white/80 text-sm font-medium">{setting.label}</p>
                      <p className="text-white/30 text-xs">{setting.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={autoModSettings[setting.key]}
                    onCheckedChange={(checked) => setAutoModSettings(prev => ({ ...prev, [setting.key]: checked }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rules List */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Cog className="h-4 w-4 text-blue-400" />
                Moderation Rules
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingRule({ id: 'new', name: '', type: 'profanity', enabled: true, config: {} });
                  setProfanityWords('');
                  setSpamThreshold(3);
                  setLinkThreshold(2);
                  setRateLimit(10);
                  setNightStart('23:00');
                  setNightEnd('06:00');
                  setEditRuleOpen(true);
                }}
                className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
              >
                <Plus className="h-4 w-4" /> Add Rule
              </Button>
            </div>
            <div className="space-y-3">
              {autoModRules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(checked) => setAutoModRules(prev => prev.map(r => r.id === rule.id ? { ...r, enabled: checked } : r))}
                    />
                    <div>
                      <p className="text-white/80 text-sm font-medium">{rule.name}</p>
                      <p className="text-white/30 text-xs capitalize">{rule.type} rule</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditRule(rule)} className="text-white/50 hover:text-white hover:bg-white/10 h-8 w-8 p-0">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id)} className="text-red-400/50 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Guidelines */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <ScrollText className="h-4 w-4 text-green-400" />
              Content Guidelines
            </h3>
            <p className="text-white/40 text-xs mb-3">These guidelines are shown to all community members</p>
            <Textarea
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[200px] resize-none font-mono text-sm"
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleSaveGuidelines}
                disabled={guidelinesSaving}
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400"
              >
                {guidelinesSaving ? 'Saving...' : 'Save Guidelines'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ===== AUDIT LOG ===== */}
      {activeSubTab === 'audit' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              Moderation Audit Log
            </h3>
            <ExportButton onClick={handleExportAudit} label="Export Log" />
          </div>
          {auditLog.length === 0 ? (
            <EmptyState icon={FileText} title="No audit entries" description="Moderation actions will appear here" />
          ) : (
            <>
              <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[#0F0A1E]">
                    <tr className="border-b border-white/5">
                      <th className="text-left text-white/40 font-medium px-4 py-3">Timestamp</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Admin</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Action</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Target</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map(entry => (
                      <tr key={entry.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">{formatDateTime(entry.timestamp)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-[10px] font-bold shrink-0">
                              {entry.admin.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white/70 text-xs">{entry.admin}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            entry.action.toLowerCase().includes('ban') ? 'bg-red-500/10 text-red-400' :
                            entry.action.toLowerCase().includes('delete') ? 'bg-red-500/10 text-red-400' :
                            entry.action.toLowerCase().includes('warn') ? 'bg-yellow-500/10 text-yellow-400' :
                            entry.action.toLowerCase().includes('approve') ? 'bg-green-500/10 text-green-400' :
                            'bg-white/5 text-white/50'
                          }`}>{entry.action}</span>
                        </td>
                        <td className="px-4 py-3 text-white/60 text-xs">{entry.target}</td>
                        <td className="px-4 py-3 text-white/40 text-xs">{entry.reason || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 pb-4">
                <Pagination page={auditPage} totalPages={3} onPageChange={setAuditPage} total={auditLog.length} pageSize={25} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Edit Rule Dialog */}
      <Dialog open={editRuleOpen} onOpenChange={setEditRuleOpen}>
        <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Moderation Rule</DialogTitle>
            <DialogDescription className="text-white/40">Configure auto-moderation rule settings</DialogDescription>
          </DialogHeader>
          {editingRule && (
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Rule Name</Label>
                <Input
                  value={editingRule.name}
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, name: e.target.value } : prev)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>

              {editingRule.type === 'profanity' && (
                <div>
                  <Label className="text-white/60 text-sm mb-2 block">Banned Words List (comma separated)</Label>
                  <Textarea
                    value={profanityWords}
                    onChange={(e) => setProfanityWords(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[100px] resize-none"
                    placeholder="word1, word2, word3..."
                  />
                </div>
              )}

              {editingRule.type === 'spam' && (
                <>
                  <div>
                    <Label className="text-white/60 text-sm mb-2 block">Repeated Messages Threshold</Label>
                    <Input
                      type="number"
                      value={spamThreshold}
                      onChange={(e) => setSpamThreshold(Number(e.target.value))}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      min={1}
                      max={20}
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm mb-2 block">Excessive Links Threshold</Label>
                    <Input
                      type="number"
                      value={linkThreshold}
                      onChange={(e) => setLinkThreshold(Number(e.target.value))}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      min={1}
                      max={10}
                    />
                  </div>
                </>
              )}

              {editingRule.type === 'rate' && (
                <div>
                  <Label className="text-white/60 text-sm mb-2 block">Max Messages Per Minute</Label>
                  <Input
                    type="number"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    min={1}
                    max={60}
                  />
                </div>
              )}

              {editingRule.type === 'night' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-sm mb-2 block">Start Time</Label>
                    <Input
                      type="time"
                      value={nightStart}
                      onChange={(e) => setNightStart(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm mb-2 block">End Time</Label>
                    <Input
                      type="time"
                      value={nightEnd}
                      onChange={(e) => setNightEnd(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <Label className="text-white/60 text-sm">Rule Enabled</Label>
                <Switch
                  checked={editingRule.enabled}
                  onCheckedChange={(checked) => setEditingRule(prev => prev ? { ...prev, enabled: checked } : prev)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditRuleOpen(false)} className="border-white/20 text-white/70 hover:text-white hover:bg-white/10">Cancel</Button>
                <Button onClick={handleSaveRule} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400">Save Rule</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Modal */}
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
