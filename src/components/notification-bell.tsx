'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';
import {
  Bell,
  BellRing,
  PartyPopper,
  Trophy,
  UserPlus,
  UserCheck,
  BookOpen,
  Award,
  ArrowUpCircle,
  Settings,
  MessageCircle,
  Loader2,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ─────────────────────────────────────────────────
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}

// ─── Notification type config ──────────────────────────────
const TYPE_ICONS: Record<string, React.ReactNode> = {
  welcome: <PartyPopper className="h-3.5 w-3.5" />,
  assessment_complete: <Trophy className="h-3.5 w-3.5" />,
  partner_request: <UserPlus className="h-3.5 w-3.5" />,
  partner_accepted: <UserCheck className="h-3.5 w-3.5" />,
  course_enrolled: <BookOpen className="h-3.5 w-3.5" />,
  certificate_ready: <Award className="h-3.5 w-3.5" />,
  plan_upgrade: <ArrowUpCircle className="h-3.5 w-3.5" />,
  system: <Settings className="h-3.5 w-3.5" />,
  chat_message: <MessageCircle className="h-3.5 w-3.5" />,
};

const TYPE_COLORS: Record<string, string> = {
  welcome: 'text-emerald-400 bg-emerald-500/20',
  assessment_complete: 'text-purple-400 bg-purple-500/20',
  partner_request: 'text-blue-400 bg-blue-500/20',
  partner_accepted: 'text-green-400 bg-green-500/20',
  course_enrolled: 'text-cyan-400 bg-cyan-500/20',
  certificate_ready: 'text-yellow-400 bg-yellow-500/20',
  plan_upgrade: 'text-orange-400 bg-orange-500/20',
  system: 'text-white/40 bg-white/10',
  chat_message: 'text-pink-400 bg-pink-500/20',
};

// ─── Time ago helper ──────────────────────────────────────
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function NotificationBell() {
  const { isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isAuth = mounted && isAuthenticated;

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuth) return;
    try {
      const res = await fetch('/api/notifications?limit=1', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount ?? 0);
      }
    } catch {
      // silent
    }
  }, [isAuth]);

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      if (!isAuth) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/notifications?limit=20&page=${pageNum}`, {
          credentials: 'same-origin',
        });
        if (res.ok) {
          const data = await res.json();
          const newNotifs = data.notifications ?? [];
          setNotifications((prev) => (append ? [...prev, ...newNotifs] : newNotifs));
          setUnreadCount(data.unreadCount ?? 0);
          setHasMore(newNotifs.length === 20);
        }
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    },
    [isAuth]
  );

  // Initial fetch + polling
  useEffect(() => {
    if (!isAuth) return;
    fetchUnreadCount();
    pollingRef.current = setInterval(fetchUnreadCount, 30000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isAuth, fetchUnreadCount]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    if (!isOpen) {
      setPage(1);
      fetchNotifications(1, false);
    }
    setIsOpen((prev) => !prev);
  }, [isOpen, fetchNotifications]);

  const handleMarkAllRead = useCallback(async () => {
    setMarkingAll(true);
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // silent
    } finally {
      setMarkingAll(false);
    }
  }, []);

  const handleMarkOneRead = useCallback(async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ notificationIds: [id] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silent
    }
  }, []);

  const handleNotificationClick = useCallback(
    (notif: Notification) => {
      if (!notif.isRead) handleMarkOneRead(notif.id);
      setIsOpen(false);
      if (notif.actionUrl) {
        router.push(notif.actionUrl);
      }
    },
    [handleMarkOneRead, router]
  );

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  }, [page, fetchNotifications]);

  if (!isAuth) return null;

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
          <BellRing className="h-5 w-5 text-cyan-400 animate-pulse" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold shadow-lg shadow-cyan-500/30">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-12 z-50 w-80 sm:w-96 overflow-hidden shadow-2xl shadow-cyan-500/10 border border-white/10 animate-slide-up rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-cyan-400" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllRead();
                }}
                disabled={markingAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 hover:text-white bg-cyan-500/20 hover:bg-cyan-500/40 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
            {isLoading && notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Loader2 className="h-5 w-5 text-cyan-400 animate-spin mx-auto mb-2" />
                <p className="text-white/40 text-xs">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-sm">No notifications yet</p>
                <p className="text-white/20 text-xs mt-1">
                  We&apos;ll notify you about assessments, courses, and more
                </p>
              </div>
            ) : (
              <>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      'px-4 py-3 border-b border-white/5 transition-colors',
                      !notif.isRead
                        ? 'bg-cyan-500/[0.05] hover:bg-cyan-500/[0.1] cursor-pointer'
                        : 'hover:bg-white/[0.03]',
                      notif.actionUrl && 'cursor-pointer'
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          'flex items-center justify-center h-7 w-7 rounded-lg shrink-0',
                          TYPE_COLORS[notif.type] || 'text-white/40 bg-white/10'
                        )}
                      >
                        {TYPE_ICONS[notif.type] || <Bell className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white/80 text-xs font-semibold truncate">
                            {notif.title}
                          </span>
                          {!notif.isRead && (
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-white/30 text-[10px] mt-1">
                          {timeAgo(notif.createdAt)}
                        </p>
                      </div>
                      {notif.actionUrl && (
                        <ExternalLink className="h-3 w-3 text-white/20 shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}

                {/* Load More */}
                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="w-full py-2.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Load more'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
