'use client';

import { create } from 'zustand';

interface User {
  userId: string;
  email: string;
  name: string | null;
  plan: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
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

  setAuth: (user, accessToken, refreshToken) => {
    // Persist tokens to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({
      user,
      accessToken,
      refreshToken,
      isLoading: false,
      isAuthenticated: true,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
    });
  },

  refreshAccessToken: async () => {
    const { refreshToken } = get();
    if (!refreshToken) {
      get().logout();
      return null;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        get().logout();
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', newAccessToken);
      }

      set({ accessToken: newAccessToken });
      return newAccessToken;
    } catch {
      get().logout();
      return null;
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
