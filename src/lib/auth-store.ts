'use client';

import { create } from 'zustand';

interface User {
  userId: string;
  email: string;
  name: string | null;
  plan: string;
  role?: string;
  accountType?: string;
  organizationName?: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isRefreshing: boolean;

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  updatePlan: (plan: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true, // Start as true to handle initial hydration
  isAuthenticated: false,
  isRefreshing: false,

  setAuth: (user, accessToken, refreshToken) => {
    // Persist tokens to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      // Also set cookies for middleware (server-side route protection)
      document.cookie = `auth_token=${accessToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax; Secure`;
      // Note: user_role cookie REMOVED — role is now extracted from verified JWT in middleware
    }
    set({
      user,
      accessToken,
      refreshToken,
      isLoading: false,
      isAuthenticated: true,
      isRefreshing: false,
    });
  },

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Clear middleware cookie
      document.cookie = 'auth_token=; path=/; max-age=0';
    }
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      isRefreshing: false,
    });
  },

  refreshAccessToken: async () => {
    const { refreshToken, isRefreshing } = get();

    // If already refreshing, wait for it to complete
    if (isRefreshing) {
      // Poll until refresh is done
      return new Promise<string | null>((resolve) => {
        const interval = setInterval(() => {
          const state = get();
          if (!state.isRefreshing) {
            clearInterval(interval);
            resolve(state.accessToken);
          }
        }, 100);
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(interval);
          resolve(null);
        }, 10000);
      });
    }

    if (!refreshToken) {
      get().logout();
      return null;
    }

    set({ isRefreshing: true });

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        // Only logout on explicit 401 (token invalid/expired)
        // On 5xx or network issues, keep the user logged in
        if (response.status === 401) {
          get().logout();
          return null;
        }
        // Server error - don't logout, just fail the refresh
        set({ isRefreshing: false });
        return get().accessToken;
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;
      const newRefreshToken = data.refreshToken;

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
      }

      set({ accessToken: newAccessToken, refreshToken: newRefreshToken || refreshToken, isRefreshing: false });

      // Update middleware cookie with new access token
      if (typeof window !== 'undefined') {
        document.cookie = `auth_token=${newAccessToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax; Secure`;
      }
      return newAccessToken;
    } catch {
      // Network error - DON'T logout, keep existing auth
      // The user might just have a temporary network issue
      set({ isRefreshing: false });
      return get().accessToken;
    }
  },

  updatePlan: (plan) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, plan };
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      set({ user: updatedUser });
    }
  },
}));
