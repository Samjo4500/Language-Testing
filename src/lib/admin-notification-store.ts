import { create } from 'zustand';

export interface AdminNotification {
  id: string;
  to: string;
  from: string;
  subject: string;
  type: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}

interface AdminNotificationState {
  unreadCount: number;
  notifications: AdminNotification[];
  isLoading: boolean;
  isOpen: boolean;
  lastFetched: number | null;

  // Actions
  setUnreadCount: (count: number) => void;
  setNotifications: (notifications: AdminNotification[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
  fetchNotifications: (_accessToken: string) => Promise<void>;
  markAllRead: (_accessToken: string) => Promise<void>;
  markAsRead: (_accessToken: string, ids: string[]) => Promise<void>;
}

export const useAdminNotificationStore = create<AdminNotificationState>((set, get) => ({
  unreadCount: 0,
  notifications: [],
  isLoading: false,
  isOpen: false,
  lastFetched: null,

  setUnreadCount: (count) => set({ unreadCount: count }),
  setNotifications: (notifications) => set({ notifications }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsOpen: (open) => set({ isOpen: open }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  // _accessToken parameter kept for API compatibility but cookies are used instead
  fetchNotifications: async (_accessToken) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/admin/notifications/');
      if (res.ok) {
        const data = await res.json();
        set({
          unreadCount: data.unreadCount || 0,
          notifications: data.notifications || [],
          lastFetched: Date.now(),
        });
      }
    } catch (e) {
      console.error('Notifications fetch error:', e);
    } finally {
      set({ isLoading: false });
    }
  },

  markAllRead: async (_accessToken) => {
    try {
      const res = await fetch('/api/admin/notifications/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        set((state) => ({
          unreadCount: 0,
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      }
    } catch (e) {
      console.error('Mark all read error:', e);
    }
  },

  markAsRead: async (_accessToken, ids) => {
    if (!ids.length) return;
    try {
      const res = await fetch('/api/admin/notifications/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds: ids }),
      });
      if (res.ok) {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            ids.includes(n.id) ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - ids.length),
        }));
      }
    } catch (e) {
      console.error('Mark as read error:', e);
    }
  },
}));
