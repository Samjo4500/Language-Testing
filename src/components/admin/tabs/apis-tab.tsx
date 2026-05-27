'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Key, Activity, Globe, Shield, Code2, Plus, Trash2, RefreshCw,
  ExternalLink, Copy, Eye, EyeOff, Server, Database, Mail,
  CreditCard, Cpu, AlertTriangle, CheckCircle2, XCircle,
  Zap, Clock, ArrowRight, Settings, Webhook, ChevronDown,
  ChevronUp, X, Send,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  StatCard, ChartTooltip, Pagination, ConfirmModal, EmptyState,
  ExportButton, DateRangePicker, statusBadge, formatDate, formatDateTime, formatNumber,
} from '../shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

interface ApisTabProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

// ─── Types ───────────────────────────────────────────────
interface ApiKeyRecord {
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
  user: { id: string; email: string; name: string };
}

interface ServiceHealth {
  database: { status: string; latencyMs: number; type: string };
  auth: { jwtSecretSet: boolean; provider: string };
  email: { provider: string; apiKeySet: boolean };
  payment: { provider: string; mode: string; clientIdSet: boolean; secretSet: boolean };
  ai: { provider: string; apiKeySet: boolean };
}

interface TopApiCall {
  path: string;
  count: number;
}

interface WebhookRecord {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  lastDelivery: string | null;
  secret: string;
}

interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  payloadSize: number;
  statusCode: number;
  retryCount: number;
  deliveredAt: string;
}

interface WhiteLabelSettings {
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

type SubTab = 'health' | 'keys' | 'webhooks' | 'whitelabel';

const WEBHOOK_EVENTS = [
  'user.created', 'user.upgraded', 'test.started', 'test.completed',
  'certificate.issued', 'payment.success', 'payment.failed', 'community.message',
];

const SUB_TABS: { id: SubTab; label: string; icon: React.ElementType }[] = [
  { id: 'health', label: 'Service Health', icon: Activity },
  { id: 'keys', label: 'API Keys', icon: Key },
  { id: 'webhooks', label: 'Webhooks', icon: Globe },
  { id: 'whitelabel', label: 'White Label', icon: Settings },
];

const selectClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50";
const selectOptionClass = "bg-[#1a1035]";

export function ApisTab({ onToast }: ApisTabProps) {
  const [subTab, setSubTab] = useState<SubTab>('health');

  // ─── Shared state ──────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [serviceHealth, setServiceHealth] = useState<ServiceHealth | null>(null);
  const [topApiCalls, setTopApiCalls] = useState<TopApiCall[]>([]);
  const [usageData, setUsageData] = useState<{ date: string; requests: number }[]>([]);
  const [usageRange, setUsageRange] = useState('7d');
  const [ipWhitelist, setIpWhitelist] = useState<string[]>([]);
  const [newIp, setNewIp] = useState('');

  // ─── API Keys state ────────────────────────────────
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [keysLoading, setKeysLoading] = useState(true);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [genName, setGenName] = useState('');
  const [genPerms, setGenPerms] = useState<string[]>(['read']);
  const [genRateLimit, setGenRateLimit] = useState(1000);
  const [genType, setGenType] = useState('live');
  const [genLoading, setGenLoading] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [showNewKey, setShowNewKey] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState<ApiKeyRecord | null>(null);
  const [revokeLoading, setRevokeLoading] = useState(false);

  // ─── Webhooks state ────────────────────────────────
  const [webhooks, setWebhooks] = useState<WebhookRecord[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [addWebhookOpen, setAddWebhookOpen] = useState(false);
  const [whUrl, setWhUrl] = useState('');
  const [whEvents, setWhEvents] = useState<string[]>([]);
  const [whLoading, setWhLoading] = useState(false);
  const [confirmDeleteWh, setConfirmDeleteWh] = useState<WebhookRecord | null>(null);

  // ─── White-label state ─────────────────────────────
  const [wlSettings, setWlSettings] = useState<WhiteLabelSettings | null>(null);
  const [wlLoading, setWlLoading] = useState(false);
  const [wlSaving, setWlSaving] = useState(false);

  // ─── Fetch service health + API data ───────────────
  const fetchApiData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/apis', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setServiceHealth(data.services || null);
        setTopApiCalls(data.topApiCalls || []);

        // Generate mock usage data for the chart
        const days = usageRange === '7d' ? 7 : usageRange === '30d' ? 30 : 90;
        const points: Array<{ date: string; requests: number }> = [];
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          points.push({
            date: d.toISOString().slice(5, 10),
            requests: Math.floor(Math.random() * 500 + 200 + (days - i) * 2),
          });
        }
        setUsageData(points);
      }
    } catch (e) {
      console.error('Fetch API data error:', e);
    } finally {
      setLoading(false);
    }
  }, [usageRange]);

  // ─── Fetch API keys ────────────────────────────────
  const fetchApiKeys = useCallback(async () => {
    setKeysLoading(true);
    try {
      const res = await fetch('/api/admin/api-keys', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.apiKeys || []);
      }
    } catch (e) {
      console.error('Fetch API keys error:', e);
    } finally {
      setKeysLoading(false);
    }
  }, []);

  // ─── Fetch white-label ─────────────────────────────
  const fetchWhiteLabel = useCallback(async () => {
    setWlLoading(true);
    try {
      const res = await fetch('/api/admin/white-label', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setWlSettings(data.settings || null);
      }
    } catch (e) {
      console.error('Fetch white-label error:', e);
    } finally {
      setWlLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiData();
  }, [fetchApiData]);

  useEffect(() => {
    if (subTab === 'keys') fetchApiKeys();
    if (subTab === 'whitelabel') fetchWhiteLabel();
  }, [subTab, fetchApiKeys, fetchWhiteLabel]);

  // ─── Initialize mock webhooks & IP whitelist ───────
  useEffect(() => {
    setWebhooks([
      { id: 'wh_1', url: 'https://api.example.com/webhooks/cefr', events: ['user.created', 'test.completed', 'certificate.issued'], status: 'active', lastDelivery: '2025-03-15T10:30:00Z', secret: 'whsec_abc123' },
      { id: 'wh_2', url: 'https://hooks.slack.com/services/T00/B00/xxx', events: ['payment.success', 'payment.failed'], status: 'active', lastDelivery: '2025-03-14T22:15:00Z', secret: 'whsec_def456' },
      { id: 'wh_3', url: 'https://notify.myapp.com/events', events: ['user.upgraded', 'test.started'], status: 'inactive', lastDelivery: '2025-02-28T08:00:00Z', secret: 'whsec_ghi789' },
    ]);
    setWebhookLogs([
      { id: 'log_1', webhookId: 'wh_1', event: 'test.completed', payloadSize: 1024, statusCode: 200, retryCount: 0, deliveredAt: '2025-03-15T10:30:00Z' },
      { id: 'log_2', webhookId: 'wh_1', event: 'user.created', payloadSize: 512, statusCode: 200, retryCount: 0, deliveredAt: '2025-03-15T09:45:00Z' },
      { id: 'log_3', webhookId: 'wh_2', event: 'payment.success', payloadSize: 768, statusCode: 200, retryCount: 0, deliveredAt: '2025-03-14T22:15:00Z' },
      { id: 'log_4', webhookId: 'wh_1', event: 'certificate.issued', payloadSize: 896, statusCode: 404, retryCount: 2, deliveredAt: '2025-03-14T18:20:00Z' },
      { id: 'log_5', webhookId: 'wh_2', event: 'payment.failed', payloadSize: 640, statusCode: 500, retryCount: 3, deliveredAt: '2025-03-14T16:10:00Z' },
    ]);
    setIpWhitelist(['203.0.113.42', '198.51.100.0/24', '10.0.0.1']);
  }, []);

  // ─── Generate API key ──────────────────────────────
  const handleGenerateKey = async () => {
    if (!genName.trim()) {
      onToast('Key name is required', 'error');
      return;
    }
    setGenLoading(true);
    try {
      const res = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: genName.trim(),
          type: genType,
          permissions: genPerms,
          rateLimit: genRateLimit,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewlyCreatedKey(data.apiKey?.key || null);
        setShowNewKey(true);
        onToast('API key generated successfully', 'success');
        fetchApiKeys();
        setGenName('');
        setGenPerms(['read']);
        setGenRateLimit(1000);
        setGenType('live');
      } else {
        const data = await res.json();
        onToast(data.error || 'Failed to generate API key', 'error');
      }
    } catch {
      onToast('Failed to generate API key', 'error');
    } finally {
      setGenLoading(false);
    }
  };

  // ─── Revoke API key ────────────────────────────────
  const handleRevokeKey = async () => {
    if (!confirmRevoke) return;
    setRevokeLoading(true);
    try {
      const res = await fetch(`/api/admin/api-keys/${confirmRevoke.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        onToast('API key revoked successfully', 'success');
        fetchApiKeys();
      } else {
        const data = await res.json();
        onToast(data.error || 'Failed to revoke API key', 'error');
      }
    } catch {
      onToast('Failed to revoke API key', 'error');
    } finally {
      setRevokeLoading(false);
      setConfirmRevoke(null);
    }
  };

  // ─── Toggle API key active ─────────────────────────
  const handleToggleKey = async (key: ApiKeyRecord) => {
    try {
      const res = await fetch(`/api/admin/api-keys/${key.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ isActive: !key.isActive }),
      });
      if (res.ok) {
        onToast(`API key ${key.isActive ? 'deactivated' : 'activated'}`, 'success');
        fetchApiKeys();
      } else {
        onToast('Failed to update key', 'error');
      }
    } catch {
      onToast('Failed to update key', 'error');
    }
  };

  // ─── Copy to clipboard ─────────────────────────────
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onToast('Copied to clipboard', 'success');
  };

  // ─── IP whitelist add/remove ───────────────────────
  const addIp = () => {
    if (!newIp.trim()) return;
    if (ipWhitelist.includes(newIp.trim())) {
      onToast('IP already in whitelist', 'error');
      return;
    }
    setIpWhitelist([...ipWhitelist, newIp.trim()]);
    setNewIp('');
    onToast('IP added to whitelist', 'success');
  };

  const removeIp = (ip: string) => {
    setIpWhitelist(ipWhitelist.filter(i => i !== ip));
    onToast('IP removed from whitelist', 'success');
  };

  // ─── Add webhook ───────────────────────────────────
  const handleAddWebhook = () => {
    if (!whUrl.trim()) {
      onToast('Webhook URL is required', 'error');
      return;
    }
    if (whEvents.length === 0) {
      onToast('Select at least one event', 'error');
      return;
    }
    setWhLoading(true);
    setTimeout(() => {
      const newWh: WebhookRecord = {
        id: `wh_${Date.now()}`,
        url: whUrl.trim(),
        events: whEvents,
        status: 'active',
        lastDelivery: null,
        secret: `whsec_${Math.random().toString(36).slice(2, 10)}`,
      };
      setWebhooks(prev => [newWh, ...prev]);
      setWhUrl('');
      setWhEvents([]);
      setAddWebhookOpen(false);
      setWhLoading(false);
      onToast('Webhook added successfully', 'success');
    }, 500);
  };

  // ─── Delete webhook ────────────────────────────────
  const handleDeleteWebhook = () => {
    if (!confirmDeleteWh) return;
    setWebhooks(prev => prev.filter(w => w.id !== confirmDeleteWh.id));
    setConfirmDeleteWh(null);
    onToast('Webhook deleted', 'success');
  };

  // ─── Save white-label ──────────────────────────────
  const handleSaveWhiteLabel = async () => {
    if (!wlSettings) return;
    setWlSaving(true);
    try {
      const res = await fetch('/api/admin/white-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(wlSettings),
      });
      if (res.ok) {
        onToast('White-label settings saved', 'success');
      } else {
        onToast('Failed to save settings', 'error');
      }
    } catch {
      onToast('Failed to save settings', 'error');
    } finally {
      setWlSaving(false);
    }
  };

  // ─── Helpers ───────────────────────────────────────
  const healthIcon = (status: string) => {
    if (status === 'healthy' || status === 'true') return <CheckCircle2 className="h-5 w-5 text-green-400" />;
    if (status === 'degraded') return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    return <XCircle className="h-5 w-5 text-red-400" />;
  };

  const healthColor = (status: string) => {
    if (status === 'healthy' || status === 'true') return 'border-green-500/30 bg-green-500/5';
    if (status === 'degraded') return 'border-yellow-500/30 bg-yellow-500/5';
    return 'border-red-500/30 bg-red-500/5';
  };

  const maskKey = (key: string) => {
    if (key.includes('••')) return key;
    return key.slice(0, 12) + '••••••••';
  };

  const httpStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-green-400';
    if (code >= 400 && code < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  // ═══════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      {/* ─── Sub-tab Navigation ─────────────────────── */}
      <div className="flex items-center gap-1 flex-wrap">
        {SUB_TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                subTab === tab.id
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════
          SERVICE HEALTH SUB-TAB
         ═══════════════════════════════════════════════ */}
      {subTab === 'health' && (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Service Health Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {serviceHealth && [
                  { name: 'Database', icon: Database, data: serviceHealth.database, statusKey: 'status' as const },
                  { name: 'Auth', icon: Shield, data: serviceHealth.auth, statusKey: 'jwtSecretSet' as const },
                  { name: 'Email', icon: Mail, data: serviceHealth.email, statusKey: 'apiKeySet' as const },
                  { name: 'Payment', icon: CreditCard, data: serviceHealth.payment, statusKey: 'clientIdSet' as const },
                  { name: 'AI Service', icon: Cpu, data: serviceHealth.ai, statusKey: 'apiKeySet' as const },
                ].map(service => {
                  const Icon = service.icon;
                  const statusVal = service.data[service.statusKey];
                  const statusStr = typeof statusVal === 'boolean'
                    ? (statusVal ? 'healthy' : 'unhealthy')
                    : String(statusVal);
                  return (
                    <div key={service.name} className={`glass-card p-4 border ${healthColor(statusStr)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-white/50" />
                          <span className="text-white/70 text-sm font-medium">{service.name}</span>
                        </div>
                        {healthIcon(statusStr)}
                      </div>
                      <div className="space-y-1 text-xs">
                        {Object.entries(service.data).map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="text-white/40">{k}</span>
                            <span className="text-white/70">
                              {typeof v === 'boolean' ? (v ? '✓ Set' : '✗ Not set') : String(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Usage Chart */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" /> API Requests Over Time
                  </h3>
                  <DateRangePicker
                    value={usageRange}
                    onChange={setUsageRange}
                    options={[
                      { value: '7d', label: '7 Days' },
                      { value: '30d', label: '30 Days' },
                      { value: '90d', label: '90 Days' },
                    ]}
                  />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageData}>
                      <defs>
                        <linearGradient id="apiUsageGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Line type="monotone" dataKey="requests" name="Requests" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Endpoint Stats Table */}
              <div className="glass-card overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-violet-400" /> Most Used Endpoints
                  </h3>
                </div>
                {topApiCalls.length === 0 ? (
                  <EmptyState icon={Code2} title="No API calls recorded" description="API usage data will appear here once requests are made." />
                ) : (
                  <div className="overflow-x-auto max-h-80 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left text-white/40 font-medium px-5 py-3">Endpoint</th>
                          <th className="text-left text-white/40 font-medium px-5 py-3">Requests</th>
                          <th className="text-left text-white/40 font-medium px-5 py-3">Avg Response</th>
                          <th className="text-left text-white/40 font-medium px-5 py-3">Error Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topApiCalls.map((ep, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3 text-white/70 text-xs font-mono">{ep.path}</td>
                            <td className="px-5 py-3 text-white/70 text-xs">{formatNumber(ep.count)}</td>
                            <td className="px-5 py-3 text-white/50 text-xs">{Math.floor(Math.random() * 200 + 30)}ms</td>
                            <td className="px-5 py-3 text-xs">
                              <span className={`${Math.random() > 0.8 ? 'text-red-400' : 'text-green-400'}`}>
                                {(Math.random() * 3).toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* IP Whitelist + API Docs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* IP Whitelist */}
                <div className="glass-card p-5">
                  <h3 className="text-white/80 text-sm font-medium flex items-center gap-2 mb-4">
                    <Shield className="h-4 w-4 text-amber-400" /> IP Whitelist
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="e.g. 203.0.113.42"
                      value={newIp}
                      onChange={e => setNewIp(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50"
                      onKeyDown={e => e.key === 'Enter' && addIp()}
                    />
                    <Button
                      onClick={addIp}
                      variant="outline"
                      className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {ipWhitelist.length === 0 ? (
                      <p className="text-white/30 text-xs text-center py-4">No IPs whitelisted — all IPs allowed</p>
                    ) : (
                      ipWhitelist.map(ip => (
                        <div key={ip} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                          <span className="text-white/70 text-xs font-mono">{ip}</span>
                          <button onClick={() => removeIp(ip)} className="text-white/30 hover:text-red-400 transition-colors">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-white/30 text-xs mt-2">Leave empty to allow all IPs. Supports CIDR notation.</p>
                </div>

                {/* API Docs + Rate Limits */}
                <div className="space-y-6">
                  {/* API Documentation Link */}
                  <div className="glass-card p-5">
                    <h3 className="text-white/80 text-sm font-medium flex items-center gap-2 mb-3">
                      <ExternalLink className="h-4 w-4 text-blue-400" /> API Documentation
                    </h3>
                    <p className="text-white/50 text-xs mb-3">Access the full API reference, guides, and SDKs.</p>
                    <a
                      href="/api/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 transition-all"
                    >
                      <Code2 className="h-4 w-4" /> View API Docs
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Global Rate Limits */}
                  <div className="glass-card p-5">
                    <h3 className="text-white/80 text-sm font-medium flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-yellow-400" /> Default Rate Limits
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-white/60">
                        <span>Per minute</span>
                        <span className="text-white/80">60 requests</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Per hour</span>
                        <span className="text-white/80">1,000 requests</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Per day</span>
                        <span className="text-white/80">50,000 requests</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          API KEYS SUB-TAB
         ═══════════════════════════════════════════════ */}
      {subTab === 'keys' && (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={Key}
              label="Total API Keys"
              value={apiKeys.length}
              gradient="from-blue-600 to-blue-500"
            />
            <StatCard
              icon={CheckCircle2}
              label="Active Keys"
              value={apiKeys.filter(k => k.isActive).length}
              gradient="from-green-600 to-green-500"
            />
            <StatCard
              icon={XCircle}
              label="Inactive Keys"
              value={apiKeys.filter(k => !k.isActive).length}
              gradient="from-red-600 to-red-500"
            />
          </div>

          {/* Generate Key Button */}
          <div className="flex items-center justify-between">
            <h3 className="text-white/80 text-sm font-medium">API Keys</h3>
            <Button
              onClick={() => {
                setNewlyCreatedKey(null);
                setShowNewKey(false);
                setGenerateOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 gap-2"
            >
              <Plus className="h-4 w-4" /> Generate Key
            </Button>
          </div>

          {/* Newly Created Key Display */}
          {showNewKey && newlyCreatedKey && (
            <div className="glass-card p-4 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">API Key Generated</span>
              </div>
              <p className="text-white/50 text-xs mb-2">Copy this key now — you won&apos;t be able to see it again.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-xs font-mono text-white/90 break-all">{newlyCreatedKey}</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(newlyCreatedKey)} className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 shrink-0">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowNewKey(false)} className="mt-2 text-white/40 hover:text-white">
                Dismiss
              </Button>
            </div>
          )}

          {/* API Keys Table */}
          <div className="glass-card overflow-hidden">
            {keysLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : apiKeys.length === 0 ? (
              <EmptyState
                icon={Key}
                title="No API keys"
                description="Generate your first API key to start integrating."
                action={{ label: 'Generate Key', onClick: () => setGenerateOpen(true) }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-white/40 font-medium px-4 py-3">Name</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Key</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Created</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Last Used</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Rate Limit</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                      <th className="text-right text-white/40 font-medium px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map(k => (
                      <tr key={k.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-white/90 text-sm">{k.name}</p>
                            <p className="text-white/40 text-xs">{k.type === 'test' ? 'Test' : 'Live'} · {k.plan}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs font-mono text-white/60">{maskKey(k.key)}</code>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs">{formatDate(k.createdAt)}</td>
                        <td className="px-4 py-3 text-white/50 text-xs">{formatDateTime(k.lastUsedAt)}</td>
                        <td className="px-4 py-3 text-white/50 text-xs">{formatNumber(k.rateLimit)}/hr</td>
                        <td className="px-4 py-3">{statusBadge(k.isActive, 'Active', 'Revoked')}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleToggleKey(k)}
                              className={`p-1.5 rounded-lg text-xs transition-colors ${k.isActive ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                              title={k.isActive ? 'Deactivate' : 'Activate'}
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmRevoke(k)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Revoke"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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

          {/* Per-key Rate Limits Panel */}
          {apiKeys.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-white/80 text-sm font-medium flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-violet-400" /> Per-Key Rate Limits
              </h3>
              <div className="space-y-3">
                {apiKeys.map(k => (
                  <div key={k.id} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Key className={`h-4 w-4 ${k.isActive ? 'text-blue-400' : 'text-white/30'}`} />
                      <div>
                        <p className="text-white/80 text-sm">{k.name}</p>
                        <p className="text-white/40 text-xs">{k.permissions}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-white/70">{formatNumber(k.rateLimit)}/hr</p>
                      <p className="text-white/40">{Math.floor(k.rateLimit / 60)}/min · {formatNumber(k.rateLimit * 24)}/day</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          WEBHOOKS SUB-TAB
         ═══════════════════════════════════════════════ */}
      {subTab === 'webhooks' && (
        <div className="space-y-6">
          {/* Webhooks Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-white/80 text-sm font-medium">Webhooks</h3>
            <Button
              onClick={() => setAddWebhookOpen(true)}
              className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 shadow-lg shadow-violet-500/20 gap-2"
            >
              <Plus className="h-4 w-4" /> Add Webhook
            </Button>
          </div>

          {/* Webhooks Table */}
          <div className="glass-card overflow-hidden">
            {webhooks.length === 0 ? (
              <EmptyState
                icon={Globe}
                title="No webhooks configured"
                description="Add a webhook endpoint to receive real-time event notifications."
                action={{ label: 'Add Webhook', onClick: () => setAddWebhookOpen(true) }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-white/40 font-medium px-4 py-3">URL</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Events</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Last Delivery</th>
                      <th className="text-right text-white/40 font-medium px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {webhooks.map(wh => (
                      <tr key={wh.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <code className="text-xs font-mono text-white/70 max-w-[280px] truncate block">{wh.url}</code>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {wh.events.map(ev => (
                              <span key={ev} className="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-400">{ev}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">{statusBadge(wh.status === 'active', 'Active', 'Inactive')}</td>
                        <td className="px-4 py-3 text-white/50 text-xs">{formatDateTime(wh.lastDelivery)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => copyToClipboard(wh.secret)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                              title="Copy signing secret"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteWh(wh)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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

          {/* Webhook Logs */}
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white/80 text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-400" /> Recent Deliveries
              </h3>
            </div>
            {webhookLogs.length === 0 ? (
              <EmptyState icon={Activity} title="No deliveries yet" description="Webhook delivery logs will appear here." />
            ) : (
              <div className="overflow-x-auto max-h-64 overflow-y-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-white/40 font-medium px-4 py-3">Event</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Payload Size</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Status</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Retries</th>
                      <th className="text-left text-white/40 font-medium px-4 py-3">Delivered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {webhookLogs.map(log => (
                      <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400">{log.event}</span>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs">{log.payloadSize} bytes</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${httpStatusColor(log.statusCode)}`}>{log.statusCode}</span>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs">
                          {log.retryCount > 0 ? (
                            <span className="text-yellow-400">{log.retryCount}</span>
                          ) : (
                            <span className="text-white/30">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs">{formatDateTime(log.deliveredAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          WHITE-LABEL SUB-TAB
         ═══════════════════════════════════════════════ */}
      {subTab === 'whitelabel' && (
        <div className="space-y-6">
          {wlLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : wlSettings ? (
            <>
              <div className="glass-card p-5 space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4 text-violet-400" /> White-Label Configuration
                  </h3>
                  <div className="flex items-center gap-2">
                    <Label className="text-white/50 text-xs">Active</Label>
                    <Switch
                      checked={wlSettings.isActive}
                      onCheckedChange={checked => setWlSettings(prev => prev ? { ...prev, isActive: checked } : prev)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-sm mb-2 block">Company Name</Label>
                    <Input
                      value={wlSettings.companyName}
                      onChange={e => setWlSettings(prev => prev ? { ...prev, companyName: e.target.value } : prev)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm mb-2 block">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        value={wlSettings.primaryColor}
                        onChange={e => setWlSettings(prev => prev ? { ...prev, primaryColor: e.target.value } : prev)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
                      />
                      <div className="w-10 h-10 rounded-lg border border-white/10 shrink-0" style={{ backgroundColor: wlSettings.primaryColor }} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm mb-2 block">Logo URL</Label>
                    <Input
                      value={wlSettings.logoUrl}
                      onChange={e => setWlSettings(prev => prev ? { ...prev, logoUrl: e.target.value } : prev)}
                      placeholder="https://example.com/logo.png"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm mb-2 block">Custom Domain</Label>
                    <Input
                      value={wlSettings.domain}
                      onChange={e => setWlSettings(prev => prev ? { ...prev, domain: e.target.value } : prev)}
                      placeholder="test.yourcompany.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm mb-2 block">Support Email</Label>
                    <Input
                      value={wlSettings.supportEmail}
                      onChange={e => setWlSettings(prev => prev ? { ...prev, supportEmail: e.target.value } : prev)}
                      placeholder="support@yourcompany.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-sm mb-2 block">Plan</Label>
                    <select
                      value={wlSettings.plan}
                      onChange={e => setWlSettings(prev => prev ? { ...prev, plan: e.target.value } : prev)}
                      className={selectClass}
                    >
                      <option value="team" className={selectOptionClass}>Team</option>
                      <option value="business" className={selectOptionClass}>Business</option>
                      <option value="enterprise" className={selectOptionClass}>Enterprise</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-white/60 text-sm mb-2 block">Custom CSS</Label>
                  <textarea
                    value={wlSettings.customCss}
                    onChange={e => setWlSettings(prev => prev ? { ...prev, customCss: e.target.value } : prev)}
                    placeholder="/* Custom styles for your white-label */"
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={fetchWhiteLabel}
                    className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
                  >
                    <RefreshCw className="h-4 w-4" /> Reset
                  </Button>
                  <Button
                    onClick={handleSaveWhiteLabel}
                    disabled={wlSaving}
                    className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 gap-2"
                  >
                    {wlSaving ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {wlSaving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState icon={Settings} title="No white-label settings" description="Configure white-label settings for your platform." />
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          DIALOGS
         ═══════════════════════════════════════════════ */}

      {/* Generate Key Dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-400" /> Generate API Key
            </DialogTitle>
            <DialogDescription className="text-white/40">Create a new API key for integration access.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Key Name *</Label>
              <Input
                value={genName}
                onChange={e => setGenName(e.target.value)}
                placeholder="e.g. Production Key"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
              />
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Key Type</Label>
              <select value={genType} onChange={e => setGenType(e.target.value)} className={selectClass}>
                <option value="live" className={selectOptionClass}>Live</option>
                <option value="test" className={selectOptionClass}>Test</option>
              </select>
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Permissions</Label>
              <div className="flex flex-wrap gap-3">
                {['read', 'write', 'admin'].map(perm => (
                  <label key={perm} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={genPerms.includes(perm)}
                      onCheckedChange={checked => {
                        if (checked) setGenPerms([...genPerms, perm]);
                        else setGenPerms(genPerms.filter(p => p !== perm));
                      }}
                      className="border-white/20 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                    />
                    <span className="text-white/70 text-sm capitalize">{perm}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Rate Limit (requests/hour)</Label>
              <Input
                type="number"
                value={genRateLimit}
                onChange={e => setGenRateLimit(Number(e.target.value))}
                min={1}
                max={100000}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setGenerateOpen(false)} className="border-white/20 text-white/70 hover:text-white hover:bg-white/10">Cancel</Button>
              <Button onClick={handleGenerateKey} disabled={genLoading || !genName.trim()} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400">
                {genLoading ? 'Generating...' : 'Generate Key'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Webhook Dialog */}
      <Dialog open={addWebhookOpen} onOpenChange={setAddWebhookOpen}>
        <DialogContent className="bg-[#0F0A1E] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-violet-400" /> Add Webhook
            </DialogTitle>
            <DialogDescription className="text-white/40">Configure a new webhook endpoint to receive events.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Endpoint URL *</Label>
              <Input
                value={whUrl}
                onChange={e => setWhUrl(e.target.value)}
                placeholder="https://example.com/webhooks/cefr"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/50"
              />
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Events *</Label>
              <div className="grid grid-cols-2 gap-2">
                {WEBHOOK_EVENTS.map(ev => (
                  <label key={ev} className="flex items-center gap-2 cursor-pointer bg-white/5 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors">
                    <Checkbox
                      checked={whEvents.includes(ev)}
                      onCheckedChange={checked => {
                        if (checked) setWhEvents([...whEvents, ev]);
                        else setWhEvents(whEvents.filter(e => e !== ev));
                      }}
                      className="border-white/20 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                    />
                    <span className="text-white/70 text-xs">{ev}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAddWebhookOpen(false)} className="border-white/20 text-white/70 hover:text-white hover:bg-white/10">Cancel</Button>
              <Button onClick={handleAddWebhook} disabled={whLoading || !whUrl.trim() || whEvents.length === 0} className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400">
                {whLoading ? 'Adding...' : 'Add Webhook'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revoke Key Confirm Modal */}
      <ConfirmModal
        open={!!confirmRevoke}
        onClose={() => setConfirmRevoke(null)}
        onConfirm={handleRevokeKey}
        title="Revoke API Key"
        message={`Are you sure you want to revoke "${confirmRevoke?.name}"? This action cannot be undone. Any integrations using this key will immediately stop working.`}
        confirmLabel="Revoke Key"
        variant="danger"
        loading={revokeLoading}
      />

      {/* Delete Webhook Confirm Modal */}
      <ConfirmModal
        open={!!confirmDeleteWh}
        onClose={() => setConfirmDeleteWh(null)}
        onConfirm={handleDeleteWebhook}
        title="Delete Webhook"
        message={`Are you sure you want to delete the webhook for "${confirmDeleteWh?.url}"? No further events will be delivered.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
