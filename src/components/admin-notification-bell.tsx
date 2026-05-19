'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useAdminNotificationStore } from '@/lib/admin-notification-store';
import { Bell, BellRing, Users, CreditCard, Award, Mail, Globe, Loader2, ExternalLink, Check } from 'lucide-react';

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
  admin_certificate: 'text-purple-400 bg-purple-500/20',
  contact_notification: 'text-cyan-400 bg-cyan-500/20',
  b2b_notification: 'text-orange-400 bg-orange-500/20',
};

export function AdminNotificationBell() {
  const { accessToken, isAuthenticated, user } = useAuthStore();
  const {
    unreadCount,
    notifications,
    isLoading,
    isOpen,
    fetchNotifications,
    markAllRead,
    toggleOpen,
    setIsOpen,
  } = useAdminNotificationStore();

  const pathname = usePathname();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications on mount and when auth changes
  useEffect(() => {
    if (!isAuthenticated || !accessToken || user?.role !== 'admin') return;
    fetchNotifications(accessToken);
  }, [isAuthenticated, accessToken, user?.role, fetchNotifications]);

  // Poll every 30 seconds
  useEffect(() => {
    if (!isAuthenticated || !accessToken || user?.role !== 'admin') return;
    pollingRef.current = setInterval(() => fetchNotifications(accessToken), 30000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isAuthenticated, accessToken, user?.role, fetchNotifications]);

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
    if (!isOpen) fetchNotifications(accessToken!);
    toggleOpen();
  }, [isOpen, accessToken, fetchNotifications, toggleOpen]);

  const handleMarkAllRead = useCallback(async () => {
    await markAllRead(accessToken!);
  }, [accessToken, markAllRead]);

  // Don't render for non-admin users
  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative flex items-center justify-center p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        title="Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5 text-purple-400 animate-pulse" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold shadow-lg shadow-purple-500/30">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 glass-card p-0 overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-purple-400" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleMarkAllRead(); }}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <Loader2 className="h-5 w-5 text-purple-400 animate-spin mx-auto mb-2" />
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
                  className={`px-4 py-3 border-b border-white/5 hover:bg-white/[0.03] transition-colors ${
                    !notif.isRead ? 'bg-purple-500/[0.05]' : ''
                  }`}
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
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed truncate">{notif.subject}</p>
                      <p className="text-white/30 text-[10px] mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
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
                className="flex items-center justify-center gap-1.5 w-full text-xs text-purple-400 hover:text-purple-300 transition-colors"
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
