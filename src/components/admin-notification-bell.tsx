'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useAdminNotificationStore } from '@/lib/admin-notification-store';
import { Bell, BellRing, Users, CreditCard, Award, Mail, Globe, Loader2, ExternalLink, CheckCheck } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  admin_new_user: 'New User',
  admin_new_payment: 'New Payment',
  admin_certificate: 'Certificate Issued',
  contact_notification: 'Contact Form',
  b2b_notification: 'B2B Inquiry',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  admin_new_user: <Users className="h-3.5 w-3.5" />,
  admin_new_payment: <CreditCard className="h-3.5 w-3.5" />,
  admin_certificate: <Award className="h-3.5 w-3.5" />,
  contact_notification: <Mail className="h-3.5 w-3.5" />,
  b2b_notification: <Globe className="h-3.5 w-3.5" />,
};

const TYPE_COLORS: Record<string, string> = {
  admin_new_user: 'text-blue-400 bg-blue-500/20',
  admin_new_payment: 'text-green-400 bg-green-500/20',
  admin_certificate: 'text-violet-400 bg-violet-500/20',
  contact_notification: 'text-cyan-400 bg-cyan-500/20',
  b2b_notification: 'text-orange-400 bg-orange-500/20',
};

export function AdminNotificationBell() {
  const { isAuthenticated, user } = useAuthStore();
  const {
    unreadCount,
    notifications,
    isLoading,
    isOpen,
    fetchNotifications,
    markAllRead,
    markAsRead,
    toggleOpen,
    setIsOpen,
  } = useAdminNotificationStore();

  const pathname = usePathname();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [markingAll, setMarkingAll] = useState(false);

  // Fetch notifications on mount and when auth changes
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    fetchNotifications('');
  }, [isAuthenticated, user?.role, fetchNotifications]);

  // Poll every 30 seconds
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    pollingRef.current = setInterval(() => fetchNotifications(''), 30000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isAuthenticated, user?.role, fetchNotifications]);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, setIsOpen]);

  const handleToggle = useCallback(() => {
    if (!isOpen) fetchNotifications('');
    toggleOpen();
  }, [isOpen, fetchNotifications, toggleOpen]);

  const handleMarkAllRead = useCallback(async () => {
    setMarkingAll(true);
    try {
      await markAllRead('');
    } finally {
      setMarkingAll(false);
    }
  }, [markAllRead]);

  const handleMarkOneRead = useCallback(async (id: string) => {
    await markAsRead('', [id]);
  }, [markAsRead]);

  // Don't render for non-admin users
  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative flex items-center justify-center p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        title="Notifications"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5 text-violet-400 animate-pulse" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-bold shadow-lg shadow-blue-500/30">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown — using inline styles instead of glass-card to avoid the hover transform that shifts the entire dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-12 z-50 w-80 sm:w-96 overflow-hidden shadow-2xl shadow-violet-500/10 border border-white/10 animate-slide-up rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-violet-400" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleMarkAllRead(); }}
                disabled={markingAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-300 hover:text-white bg-violet-500/20 hover:bg-violet-500/40 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {markingAll ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCheck className="h-3.5 w-3.5" />
                )}
                {markingAll ? 'Marking...' : 'Mark all read'}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <Loader2 className="h-5 w-5 text-violet-400 animate-spin mx-auto mb-2" />
                <p className="text-white/40 text-xs">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-sm">No notifications yet</p>
                <p className="text-white/20 text-xs mt-1">
                  Email events like new signups, payments, and contact forms will appear here
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => { if (!notif.isRead) handleMarkOneRead(notif.id); }}
                  className={`px-4 py-3 border-b border-white/5 transition-colors ${
                    !notif.isRead
                      ? 'bg-violet-500/[0.05] hover:bg-violet-500/[0.1] cursor-pointer'
                      : 'hover:bg-white/[0.03]'
                  }`}
                  title={!notif.isRead ? 'Click to mark as read' : undefined}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`flex items-center justify-center h-7 w-7 rounded-lg shrink-0 ${
                        TYPE_COLORS[notif.type] || 'text-white/40 bg-white/10'
                      }`}
                    >
                      {TYPE_ICONS[notif.type] || <Mail className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white/80 text-xs font-semibold">
                          {TYPE_LABELS[notif.type] || notif.type}
                        </span>
                        {!notif.isRead && (
                          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed truncate">{notif.subject}</p>
                      <p className="text-white/30 text-[10px] mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="shrink-0 self-center">
                        <span className="text-[10px] text-violet-400/60 hover:text-violet-300 transition-colors">
                          Mark read
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02]">
              <a
                href="/admin"
                className="flex items-center justify-center gap-1.5 w-full text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                View all in Admin
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
