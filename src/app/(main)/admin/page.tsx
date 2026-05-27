'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useAdminNotificationStore } from '@/lib/admin-notification-store';
import { Navbar } from '@/components/navbar';
import {
  BarChart3, Users, CreditCard, Award, Mail, Code2,
  BookOpen, Shield, Server, Globe, RefreshCw,
} from 'lucide-react';
import { TABS, type TabId } from '@/components/admin/shared';
import { OverviewTab } from '@/components/admin/tabs/overview-tab';
import { UsersTab } from '@/components/admin/tabs/users-tab';
import { FinancialTab } from '@/components/admin/tabs/financial-tab';
import { TestTakersTab } from '@/components/admin/tabs/test-takers-tab';
import { EmailsTab } from '@/components/admin/tabs/emails-tab';
import { ApisTab } from '@/components/admin/tabs/apis-tab';
import { QuestionBankTab } from '@/components/admin/tabs/question-bank-tab';
import { GovernanceTab } from '@/components/admin/tabs/governance-tab';
import { SystemTab } from '@/components/admin/tabs/system-tab';
import { AnalyticsTab } from '@/components/admin/tabs/analytics-tab';

const TAB_ICONS: Record<string, React.ElementType> = {
  BarChart3, Users, CreditCard, Award, Mail, Code2, BookOpen, Shield, Server, Globe,
};

// ─── Toast Notification ───────────────────────────────────────────────────

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
      {type === 'success' ? '✓' : '✕'} {message}
      <button onClick={onClose} className="ml-2 hover:opacity-70 text-current">×</button>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const { unreadCount } = useAdminNotificationStore();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const onToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Auth gate
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F0A1E] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onSwitchTab={setActiveTab} onToast={onToast} />;
      case 'users':
        return <UsersTab onToast={onToast} />;
      case 'financial':
        return <FinancialTab onToast={onToast} />;
      case 'assessments':
        return <TestTakersTab onToast={onToast} />;
      case 'emails':
        return <EmailsTab onToast={onToast} notifUnread={unreadCount} onSwitchTab={setActiveTab} />;
      case 'apis':
        return <ApisTab onToast={onToast} />;
      case 'questions':
        return <QuestionBankTab onToast={onToast} />;
      case 'governance':
        return <GovernanceTab onToast={onToast} />;
      case 'system':
        return <SystemTab onToast={onToast} />;
      case 'analytics':
        return <AnalyticsTab onToast={onToast} />;
      default:
        return <OverviewTab onSwitchTab={setActiveTab} onToast={onToast} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A1E]">
      <Navbar />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="h-7 w-7 text-violet-400" />
              Super Admin Dashboard
            </h1>
            <p className="text-white/40 text-sm mt-1">Platform management & analytics</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <span className="text-violet-400 text-sm font-medium">{unreadCount} notification{unreadCount !== 1 ? 's' : ''}</span>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-1 pb-2 min-w-max">
            {TABS.map((tab) => {
              const Icon = TAB_ICONS[tab.icon];
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>{renderTab()}</div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
