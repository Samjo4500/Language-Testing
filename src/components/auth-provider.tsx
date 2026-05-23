'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setLoading, logout } = useAuthStore();
  const hasHydrated = useRef(false);

  useEffect(() => {
    // Prevent double hydration in React strict mode
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    // Hydrate auth state using HttpOnly cookies
    const hydrate = async () => {
      try {
        // Try to read user from localStorage for immediate UI
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            setAuth(user, '', ''); // Set user data immediately (tokens come from cookies)
          } catch {
            localStorage.removeItem('user');
          }
        }

        // Always validate auth via cookie-based /api/auth/me
        // Even if localStorage is empty, HttpOnly cookies may still be valid
        // (e.g., after browser data clear, incognito mode, or different tab)
        try {
          const response = await fetch('/api/auth/me/', { credentials: 'same-origin' });
          if (response.ok) {
            const data = await response.json();
            setAuth(data.user, '', '');
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(data.user));
            }
          } else if (response.status === 401) {
            // Access token cookie expired — try refresh (browser sends refresh_token cookie)
            try {
              const refreshResponse = await fetch('/api/auth/refresh/', { method: 'POST', credentials: 'same-origin' });
              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                const user = refreshData.user || (userStr ? JSON.parse(userStr) : null);
                if (user) {
                  setAuth(user, '', '');
                  if (refreshData.user && typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(refreshData.user));
                  }
                } else {
                  logout();
                }
              } else {
                // Refresh also failed — clear auth silently
                logout();
              }
            } catch {
              // Network error — keep optimistic auth from localStorage
            }
          }
        } catch {
          // Network error — keep optimistic auth from localStorage
        }

        setLoading(false);
      } catch {
        // localStorage not available or other issue - just stop loading
        setLoading(false);
      }
    };

    hydrate();
  }, [setAuth, setLoading, logout]);

  return <>{children}</>;
}
