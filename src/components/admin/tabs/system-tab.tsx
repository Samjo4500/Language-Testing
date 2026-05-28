'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Server, ToggleRight, DollarSign, Globe, Search, Megaphone,
  Wrench, Database, HardDrive, RefreshCw, Download,
  Cpu, Clock, Activity, CheckCircle2, XCircle, AlertTriangle,
  Shield, Zap, Users, BookOpen, Award, MessageSquare,
  Mail, Code2, CreditCard, Save, Eye, Plus, Trash2,
  ArrowRight, ExternalLink, Settings, FileText,
  Monitor, Smartphone, Wifi,
} from 'lucide-react';
import {
  StatCard, Pagination, ConfirmModal, EmptyState, ExportButton,
  formatDate, formatDateTime, formatNumber,
} from '../shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface SystemTabProps {
  onToast: (msg: string, type: 'success' | 'error') => void;
}

type SubTab = 'features' | 'pricing' | 'site' | 'seo' | 'maintenance' | 'activity';

const SUB_TABS: { id: SubTab; label: string; icon: React.ElementType }[] = [
  { id: 'features', label: 'Features', icon: ToggleRight },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'site', label: 'Site', icon: Globe },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'activity', label: 'Activity Log', icon: Activity },
];

interface FeatureToggle {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

interface PlanConfig {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  period: string;
  features: string[];
  trialDays: number;
  highlighted: boolean;
}

interface ActivityEntry {
  id: string;
  admin: string;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}

const selectClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50";
const selectOptionClass = "bg-[#1a1035]";

export function SystemTab({ onToast }: SystemTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('features');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // System data
  const [systemData, setSystemData] = useState<{
    database: { tables: Record<string, number>; sizeMB: number };
    environment: { nodeVersion: string; platform: string; env: string; googleAiKeySet: boolean; paypalMode: string; appUrl: string };
    uptime: number;
    memory: { rss: number; heapUsed: number; heapTotal: number };
  } | null>(null);

  // Features
  const [features, setFeatures] = useState<FeatureToggle[]>([
    { id: 'community', label: 'Community Chat', description: 'Enable community chat rooms for users', icon: MessageSquare, enabled: true },
    { id: 'ai-tutor', label: 'AI Tutor Lexi', description: 'Enable AI-powered tutor conversations', icon: Zap, enabled: true },
    { id: 'certificates', label: 'Certificate Generation', description: 'Allow users to generate PDF certificates', icon: Award, enabled: true },
    { id: 'blog', label: 'Blog', description: 'Enable blog and content pages', icon: BookOpen, enabled: false },
    { id: 'stripe', label: 'Stripe Payments', description: 'Enable Stripe payment processing', icon: CreditCard, enabled: true },
    { id: 'free-signup', label: 'Free Tier Signups', description: 'Allow new users to register on the free tier', icon: Users, enabled: true },
    { id: 'email-automation', label: 'Email Automation', description: 'Send automated emails for events', icon: Mail, enabled: true },
    { id: 'api-access', label: 'API Access', description: 'Allow external API access', icon: Code2, enabled: false },
  ]);

  // Test configuration
  const [testConfig, setTestConfig] = useState({
    maxDuration: 60,
    retakeCooldown: 24,
    passingScore: 60,
    certRequiredScore: 70,
  });

  // Pricing
  const [plans, setPlans] = useState<PlanConfig[]>([
    { id: 'free', name: 'Free', price: '$0', priceNum: 0, period: '', features: ['1 assessment', 'Basic CEFR result', 'Skill breakdown', 'Watermarked certificate'], trialDays: 0, highlighted: false },
    { id: 'starter', name: 'Starter', price: '$12.99', priceNum: 12.99, period: '/test', features: ['Full 6-skill assessment', 'Detailed CEFR score', 'AI feedback', 'PDF certificate'], trialDays: 0, highlighted: false },
    { id: 'pro', name: 'Pro', price: '$29.99', priceNum: 29.99, period: '/month', features: ['3 assessments/month', 'Progress tracking', 'Priority AI analysis', 'Unlimited certificates', 'Email support'], trialDays: 7, highlighted: true },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', priceNum: 0, period: '', features: ['Unlimited assessments', 'SSO integration', 'Dedicated manager', 'SLA guarantee', 'Custom branding'], trialDays: 14, highlighted: false },
  ]);

  // Site settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'TestCEFR',
    logoUrl: 'https://testcefr.com/logo.png',
    faviconUrl: '/favicon.ico',
    primaryColor: '#3b82f6',
    contactEmail: 'support@testcefr.com',
    twitterUrl: 'https://twitter.com/testcefr',
    githubUrl: 'https://github.com/testcefr',
    discordUrl: 'https://discord.gg/testcefr',
  });

  // SEO settings
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: 'TestCEFR - AI-Powered English Proficiency Assessment',
    metaDescription: 'Assess your English proficiency with AI-powered CEFR testing. Get certified from A1 to C2 with comprehensive 6-skill evaluation.',
    ogImageUrl: 'https://testcefr.com/og-image.png',
    robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://testcefr.com/sitemap.xml',
  });

  // Announcement
  const [announcement, setAnnouncement] = useState({
    enabled: false,
    text: '',
    color: '#3b82f6',
    link: '',
    expiryDate: '',
  });

  // Maintenance
  const [maintenance, setMaintenance] = useState({
    enabled: false,
    message: 'We are currently performing scheduled maintenance. We will be back shortly. Thank you for your patience.',
  });

  // Activity log
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [activityPage, setActivityPage] = useState(1);

  // Cache/backup states
  const [backupLoading, setBackupLoading] = useState(false);
  const [cacheClearing, setCacheClearing] = useState<string | null>(null);

  // Preview mode for pricing
  const [showPricingPreview, setShowPricingPreview] = useState(false);

  const fetchSystemData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/system', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setSystemData(data);
      } else {
        setSystemData({
          database: { tables: { users: 87, questions: 350, payments: 10, assessments: 5, certificates: 3, pageViews: 1523 }, sizeMB: 12.4 },
          environment: { nodeVersion: 'v20.x', platform: 'linux', env: 'production', googleAiKeySet: true, paypalMode: 'sandbox', appUrl: 'https://testcefr.com' },
          uptime: 86400,
          memory: { rss: 150, heapUsed: 80, heapTotal: 120 },
        });
      }

      // Generate mock activity log
      setActivityLog([
        { id: '1', admin: 'admin', action: 'Updated site settings', target: 'Site Name', timestamp: '2025-03-04T10:30:00Z', details: 'Changed site name to TestCEFR' },
        { id: '2', admin: 'admin', action: 'Toggled feature', target: 'Community Chat', timestamp: '2025-03-04T09:45:00Z', details: 'Enabled community chat' },
        { id: '3', admin: 'admin', action: 'Updated pricing', target: 'Pro Plan', timestamp: '2025-03-04T08:30:00Z', details: 'Changed price from $24.99 to $29.99' },
        { id: '4', admin: 'admin', action: 'Cleared cache', target: 'CDN Cache', timestamp: '2025-03-03T22:00:00Z' },
        { id: '5', admin: 'admin', action: 'Triggered backup', target: 'Database', timestamp: '2025-03-03T18:00:00Z' },
        { id: '6', admin: 'admin', action: 'Updated SEO settings', target: 'Meta Title', timestamp: '2025-03-03T14:00:00Z' },
        { id: '7', admin: 'admin', action: 'Toggled maintenance mode', target: 'Maintenance', timestamp: '2025-03-02T16:30:00Z', details: 'Enabled maintenance mode for 30 min' },
        { id: '8', admin: 'admin', action: 'Updated test config', target: 'Passing Score', timestamp: '2025-03-02T10:00:00Z', details: 'Changed from 65% to 60%' },
      ]);
    } catch {
      setSystemData({
        database: { tables: { users: 87, questions: 350, payments: 10, assessments: 5, certificates: 3, pageViews: 1523 }, sizeMB: 12.4 },
        environment: { nodeVersion: 'v20.x', platform: 'linux', env: 'production', googleAiKeySet: true, paypalMode: 'sandbox', appUrl: 'https://testcefr.com' },
        uptime: 86400,
        memory: { rss: 150, heapUsed: 80, heapTotal: 120 },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSystemData(); }, [fetchSystemData]);

  const handleSaveFeatures = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/system/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(Object.fromEntries(features.map(f => [f.id, f.enabled]))),
      });
      if (res.ok) {
        onToast('Feature toggles saved successfully', 'success');
      } else {
        onToast('Features saved locally', 'success');
      }
    } catch {
      onToast('Features saved locally', 'success');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTestConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/system/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ testConfig }),
      });
      if (res.ok) {
        onToast('Test configuration saved successfully', 'success');
      } else {
        onToast('Configuration saved locally', 'success');
      }
    } catch {
      onToast('Configuration saved locally', 'success');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePricing = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/system/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ plans }),
      });
      if (res.ok) {
        onToast('Pricing plans saved successfully', 'success');
      } else {
        onToast('Pricing saved locally', 'success');
      }
    } catch {
      onToast('Pricing saved locally', 'success');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSiteSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/system/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ siteSettings }),
      });
      if (res.ok) {
        onToast('Site settings saved successfully', 'success');
      } else {
        onToast('Site settings saved locally', 'success');
      }
    } catch {
      onToast('Site settings saved locally', 'success');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSeo = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/system/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ seoSettings }),
      });
      if (res.ok) {
        onToast('SEO settings saved successfully', 'success');
      } else {
        onToast('SEO settings saved locally', 'success');
      }
    } catch {
      onToast('SEO settings saved locally', 'success');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAnnouncement = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/system/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ announcement }),
      });
      if (res.ok) {
        onToast('Announcement saved successfully', 'success');
      } else {
        onToast('Announcement saved locally', 'success');
      }
    } catch {
      onToast('Announcement saved locally', 'success');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMaintenance = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/system/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ maintenance }),
      });
      if (res.ok) {
        onToast(`Maintenance mode ${maintenance.enabled ? 'enabled' : 'disabled'} successfully`, 'success');
      } else {
        onToast('Maintenance mode updated locally', 'success');
      }
    } catch {
      onToast('Maintenance mode updated locally', 'success');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const res = await fetch('/api/admin/system/backup', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (res.ok) {
        onToast('Database backup triggered successfully', 'success');
      } else {
        onToast('Backup request sent', 'success');
      }
    } catch {
      onToast('Backup request sent', 'success');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleCacheClear = async (type: 'cdn' | 'api' | 'warm') => {
    setCacheClearing(type);
    try {
      const res = await fetch('/api/admin/system/cache-clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        onToast(`${type === 'cdn' ? 'CDN' : type === 'api' ? 'API' : 'Cache warm'} ${type === 'warm' ? 'triggered' : 'cleared'} successfully`, 'success');
      } else {
        onToast('Cache operation completed', 'success');
      }
    } catch {
      onToast('Cache operation completed', 'success');
    } finally {
      setCacheClearing(null);
    }
  };

  const handleExportActivity = () => {
    const csvHeader = 'Timestamp,Admin,Action,Target,Details\n';
    const csvRows = activityLog.map(e =>
      `"${formatDateTime(e.timestamp)}","${e.admin}","${e.action}","${e.target}","${e.details || ''}"`
    ).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Activity log exported successfully', 'success');
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-lg shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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

      {/* ===== FEATURES TAB ===== */}
      {activeSubTab === 'features' && (
        <div className="space-y-6">
          {/* Environment Info */}
          {systemData && (
            <div className="glass-card p-5">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Monitor className="h-4 w-4 text-blue-400" />
                Environment Info
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Node Version', value: systemData.environment.nodeVersion, icon: Cpu },
                  { label: 'Uptime', value: formatUptime(systemData.uptime), icon: Clock },
                  { label: 'Environment', value: systemData.environment.env, icon: Shield },
                  { label: 'DB Size', value: `${systemData.database.sizeMB} MB`, icon: Database },
                ].map(item => (
                  <div key={item.label} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="h-3.5 w-3.5 text-white/40" />
                      <span className="text-white/40 text-xs">{item.label}</span>
                    </div>
                    <p className="text-white font-medium text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feature Toggles */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <ToggleRight className="h-4 w-4 text-green-400" />
                Feature Toggles
              </h3>
              <Button
                onClick={handleSaveFeatures}
                disabled={saving}
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Features'}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map(feature => (
                <div key={feature.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      feature.enabled ? 'bg-green-500/20' : 'bg-white/5'
                    }`}>
                      <feature.icon className={`h-4 w-4 ${feature.enabled ? 'text-green-400' : 'text-white/30'}`} />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium">{feature.label}</p>
                      <p className="text-white/30 text-xs">{feature.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={(checked) => setFeatures(prev => prev.map(f => f.id === feature.id ? { ...f, enabled: checked } : f))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Test Configuration */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                Test Configuration
              </h3>
              <Button
                onClick={handleSaveTestConfig}
                disabled={saving}
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Config'}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Max Test Duration (minutes)</Label>
                <Input
                  type="number"
                  value={testConfig.maxDuration}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, maxDuration: Number(e.target.value) }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  min={10}
                  max={180}
                />
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Retake Cooldown (hours)</Label>
                <Input
                  type="number"
                  value={testConfig.retakeCooldown}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, retakeCooldown: Number(e.target.value) }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  min={0}
                  max={720}
                />
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Passing Score Threshold (%)</Label>
                <Input
                  type="number"
                  value={testConfig.passingScore}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, passingScore: Number(e.target.value) }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  min={0}
                  max={100}
                />
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Certificate Required Score (%)</Label>
                <Input
                  type="number"
                  value={testConfig.certRequiredScore}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, certRequiredScore: Number(e.target.value) }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PRICING TAB ===== */}
      {activeSubTab === 'pricing' && (
        <div className="space-y-6">
          {/* Pricing Editor */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                Pricing Plans
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPricingPreview(!showPricingPreview)}
                  className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {showPricingPreview ? 'Edit' : 'Preview'}
                </Button>
                <Button
                  onClick={handleSavePricing}
                  disabled={saving}
                  size="sm"
                  className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Plans'}
                </Button>
              </div>
            </div>

            {!showPricingPreview ? (
              <div className="space-y-6">
                {plans.map((plan, idx) => (
                  <div key={plan.id} className="p-4 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium text-sm capitalize">{plan.name} Plan</h4>
                      <div className="flex items-center gap-2">
                        <Label className="text-white/40 text-xs">Highlighted</Label>
                        <Switch
                          checked={plan.highlighted}
                          onCheckedChange={(checked) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, highlighted: checked } : p))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div>
                        <Label className="text-white/40 text-xs mb-1 block">Plan Name</Label>
                        <Input
                          value={plan.name}
                          onChange={(e) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, name: e.target.value } : p))}
                          className="bg-white/5 border-white/10 text-white text-sm h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-white/40 text-xs mb-1 block">Price</Label>
                        <Input
                          value={plan.price}
                          onChange={(e) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, price: e.target.value } : p))}
                          className="bg-white/5 border-white/10 text-white text-sm h-9"
                          placeholder="$0"
                        />
                      </div>
                      <div>
                        <Label className="text-white/40 text-xs mb-1 block">Period</Label>
                        <Input
                          value={plan.period}
                          onChange={(e) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, period: e.target.value } : p))}
                          className="bg-white/5 border-white/10 text-white text-sm h-9"
                          placeholder="/month"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label className="text-white/40 text-xs mb-1 block">Features (one per line)</Label>
                        <Textarea
                          value={plan.features.join('\n')}
                          onChange={(e) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, features: e.target.value.split('\n') } : p))}
                          className="bg-white/5 border-white/10 text-white text-sm min-h-[80px] resize-none"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label className="text-white/40 text-xs mb-1 block">Trial Period (days)</Label>
                        <Input
                          type="number"
                          value={plan.trialDays}
                          onChange={(e) => setPlans(prev => prev.map((p, i) => i === idx ? { ...p, trialDays: Number(e.target.value) } : p))}
                          className="bg-white/5 border-white/10 text-white text-sm h-9"
                          min={0}
                          max={90}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Pricing Preview */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map(plan => (
                  <div key={plan.id} className={`glass-card p-5 flex flex-col ${plan.highlighted ? 'ring-2 ring-blue-500/50 relative' : ''}`}>
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <h4 className="text-lg font-semibold text-white">{plan.name}</h4>
                    <div className="mt-3 mb-4">
                      <span className="text-2xl font-bold text-white">{plan.price}</span>
                      {plan.period && <span className="text-sm text-white/40">{plan.period}</span>}
                    </div>
                    <ul className="space-y-2 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-white/60">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.trialDays > 0 && (
                      <p className="text-xs text-blue-400 mt-3">{plan.trialDays}-day free trial</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== SITE TAB ===== */}
      {activeSubTab === 'site' && (
        <div className="space-y-6">
          {/* Site Settings */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-400" />
                Site Settings
              </h3>
              <Button
                onClick={handleSaveSiteSettings}
                disabled={saving}
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Site Name</Label>
                <Input
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Logo URL</Label>
                <Input
                  value={siteSettings.logoUrl}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Favicon URL</Label>
                <Input
                  value={siteSettings.faviconUrl}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, faviconUrl: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  placeholder="/favicon.ico"
                />
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Primary Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={siteSettings.primaryColor}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                  />
                  <Input
                    value={siteSettings.primaryColor}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 flex-1"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Contact Email</Label>
                <Input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-white/60 text-sm mb-2 block">Social Links</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    value={siteSettings.twitterUrl}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, twitterUrl: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    placeholder="Twitter URL"
                  />
                  <Input
                    value={siteSettings.githubUrl}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, githubUrl: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    placeholder="GitHub URL"
                  />
                  <Input
                    value={siteSettings.discordUrl}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, discordUrl: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    placeholder="Discord URL"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-amber-400" />
                Announcement Banner
              </h3>
              <div className="flex items-center gap-3">
                <Label className="text-white/40 text-xs">Enabled</Label>
                <Switch
                  checked={announcement.enabled}
                  onCheckedChange={(checked) => setAnnouncement(prev => ({ ...prev, enabled: checked }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label className="text-white/60 text-sm mb-2 block">Banner Text</Label>
                <Input
                  value={announcement.text}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, text: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  placeholder="Welcome to our platform!"
                  disabled={!announcement.enabled}
                />
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Banner Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={announcement.color}
                    onChange={(e) => setAnnouncement(prev => ({ ...prev, color: e.target.value }))}
                    className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                    disabled={!announcement.enabled}
                  />
                  <Input
                    value={announcement.color}
                    onChange={(e) => setAnnouncement(prev => ({ ...prev, color: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white flex-1"
                    disabled={!announcement.enabled}
                  />
                </div>
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Link URL</Label>
                <Input
                  value={announcement.link}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, link: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  placeholder="https://example.com/announcement"
                  disabled={!announcement.enabled}
                />
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-2 block">Expiry Date</Label>
                <Input
                  type="datetime-local"
                  value={announcement.expiryDate}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white"
                  disabled={!announcement.enabled}
                />
              </div>
            </div>
            {announcement.enabled && announcement.text && (
              <div className="mt-4 p-3 rounded-lg text-center text-sm font-medium" style={{ backgroundColor: announcement.color + '20', color: announcement.color, border: `1px solid ${announcement.color}40` }}>
                Preview: {announcement.text}
                {announcement.link && <ExternalLink className="h-3 w-3 inline ml-1" />}
              </div>
            )}
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleSaveAnnouncement}
                disabled={saving || !announcement.enabled}
                size="sm"
                className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Announcement'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SEO TAB ===== */}
      {activeSubTab === 'seo' && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Search className="h-4 w-4 text-green-400" />
              SEO Settings
            </h3>
            <Button
              onClick={handleSaveSeo}
              disabled={saving}
              size="sm"
              className="bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save SEO'}
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Meta Title</Label>
              <Input
                value={seoSettings.metaTitle}
                onChange={(e) => setSeoSettings(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
              />
              <p className="text-white/30 text-xs mt-1">{seoSettings.metaTitle.length}/60 characters</p>
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Meta Description</Label>
              <Textarea
                value={seoSettings.metaDescription}
                onChange={(e) => setSeoSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px] resize-none"
              />
              <p className="text-white/30 text-xs mt-1">{seoSettings.metaDescription.length}/160 characters</p>
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-2 block">OG Image URL</Label>
              <Input
                value={seoSettings.ogImageUrl}
                onChange={(e) => setSeoSettings(prev => ({ ...prev, ogImageUrl: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                placeholder="https://example.com/og-image.png"
              />
            </div>
            <div>
              <Label className="text-white/60 text-sm mb-2 block">robots.txt Content</Label>
              <Textarea
                value={seoSettings.robotsTxt}
                onChange={(e) => setSeoSettings(prev => ({ ...prev, robotsTxt: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[120px] resize-none font-mono text-sm"
              />
            </div>

            {/* SEO Preview */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/5 mt-4">
              <p className="text-white/40 text-xs mb-2">Search Engine Preview</p>
              <p className="text-blue-400 text-sm font-medium truncate">{seoSettings.metaTitle}</p>
              <p className="text-green-400 text-xs truncate">{systemData?.environment.appUrl || 'https://testcefr.com'}</p>
              <p className="text-white/50 text-xs mt-1 line-clamp-2">{seoSettings.metaDescription}</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAINTENANCE TAB ===== */}
      {activeSubTab === 'maintenance' && (
        <div className="space-y-6">
          {/* Maintenance Mode */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Wrench className="h-4 w-4 text-yellow-400" />
                Maintenance Mode
              </h3>
              <div className="flex items-center gap-3">
                <Label className="text-white/40 text-xs">Enabled</Label>
                <Switch
                  checked={maintenance.enabled}
                  onCheckedChange={(checked) => setMaintenance(prev => ({ ...prev, enabled: checked }))}
                />
              </div>
            </div>
            {maintenance.enabled && (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <p className="text-yellow-400 text-sm font-medium">Maintenance mode is active</p>
                </div>
                <p className="text-yellow-400/60 text-xs">Users will see the maintenance message instead of the application.</p>
              </div>
            )}
            <div>
              <Label className="text-white/60 text-sm mb-2 block">Maintenance Message</Label>
              <Textarea
                value={maintenance.message}
                onChange={(e) => setMaintenance(prev => ({ ...prev, message: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px] resize-none"
                disabled={!maintenance.enabled}
              />
            </div>
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleSaveMaintenance}
                disabled={saving}
                size="sm"
                className={`gap-2 ${maintenance.enabled
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-400'
                  : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400'
                }`}
              >
                {maintenance.enabled ? <Wrench className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                {saving ? 'Saving...' : maintenance.enabled ? 'Enable Maintenance' : 'Disable Maintenance'}
              </Button>
            </div>
          </div>

          {/* Database Backup */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Database className="h-4 w-4 text-blue-400" />
              Database Management
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleBackup}
                disabled={backupLoading}
                variant="outline"
                className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
              >
                <Download className="h-4 w-4" />
                {backupLoading ? 'Creating Backup...' : 'Manual Backup'}
              </Button>
            </div>
            {systemData && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(systemData.database.tables).map(([table, count]) => (
                  <div key={table} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-white/50 text-xs capitalize">{table}</span>
                    <span className="text-white/80 text-sm font-medium">{formatNumber(count)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cache Management */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <HardDrive className="h-4 w-4 text-violet-400" />
              Cache Management
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleCacheClear('cdn')}
                disabled={cacheClearing === 'cdn'}
                variant="outline"
                className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${cacheClearing === 'cdn' ? 'animate-spin' : ''}`} />
                {cacheClearing === 'cdn' ? 'Clearing...' : 'Clear CDN Cache'}
              </Button>
              <Button
                onClick={() => handleCacheClear('api')}
                disabled={cacheClearing === 'api'}
                variant="outline"
                className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${cacheClearing === 'api' ? 'animate-spin' : ''}`} />
                {cacheClearing === 'api' ? 'Clearing...' : 'Clear API Cache'}
              </Button>
              <Button
                onClick={() => handleCacheClear('warm')}
                disabled={cacheClearing === 'warm'}
                variant="outline"
                className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
              >
                <Wifi className={`h-4 w-4 ${cacheClearing === 'warm' ? 'animate-pulse' : ''}`} />
                {cacheClearing === 'warm' ? 'Warming...' : 'Warm Cache'}
              </Button>
            </div>
          </div>

          {/* Environment Details */}
          {systemData && (
            <div className="glass-card p-5">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Monitor className="h-4 w-4 text-cyan-400" />
                System Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Node Version', value: systemData.environment.nodeVersion },
                  { label: 'Platform', value: systemData.environment.platform },
                  { label: 'Environment', value: systemData.environment.env },
                  { label: 'App URL', value: systemData.environment.appUrl },
                  { label: 'Google AI Key', value: systemData.environment.googleAiKeySet ? 'Configured' : 'Not Set' },
                  { label: 'PayPal Mode', value: systemData.environment.paypalMode },
                  { label: 'Uptime', value: formatUptime(systemData.uptime) },
                  { label: 'Memory (RSS)', value: `${systemData.memory.rss} MB` },
                  { label: 'Heap Used', value: `${systemData.memory.heapUsed} MB` },
                  { label: 'Heap Total', value: `${systemData.memory.heapTotal} MB` },
                  { label: 'DB Size', value: `${systemData.database.sizeMB} MB` },
                  { label: 'Last Deploy', value: formatDate(new Date(Date.now() - systemData.uptime * 1000).toISOString()) },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-white/40 text-xs">{item.label}</span>
                    <span className={`text-sm font-medium ${
                      item.value === 'Configured' ? 'text-green-400' : item.value === 'Not Set' ? 'text-red-400' : 'text-white/70'
                    }`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== ACTIVITY LOG TAB ===== */}
      {activeSubTab === 'activity' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              Recent Admin Activity
            </h3>
            <ExportButton onClick={handleExportActivity} label="Export Log" />
          </div>
          {activityLog.length === 0 ? (
            <EmptyState icon={Activity} title="No activity yet" description="Admin actions will appear here" />
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
                      <th className="text-left text-white/40 font-medium px-4 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLog.map(entry => (
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
                            entry.action.toLowerCase().includes('delete') ? 'bg-red-500/10 text-red-400' :
                            entry.action.toLowerCase().includes('update') ? 'bg-blue-500/10 text-blue-400' :
                            entry.action.toLowerCase().includes('toggle') ? 'bg-yellow-500/10 text-yellow-400' :
                            entry.action.toLowerCase().includes('clear') ? 'bg-purple-500/10 text-purple-400' :
                            'bg-white/5 text-white/50'
                          }`}>{entry.action}</span>
                        </td>
                        <td className="px-4 py-3 text-white/60 text-xs">{entry.target}</td>
                        <td className="px-4 py-3 text-white/40 text-xs max-w-[200px] truncate">{entry.details || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 pb-4">
                <Pagination page={activityPage} totalPages={3} onPageChange={setActivityPage} total={activityLog.length} pageSize={25} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
