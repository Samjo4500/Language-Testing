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

        // Validate auth via cookie-based /api/auth/me
        try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            const data = await response.json();
            setAuth(data.user, '', '');
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(data.user));
            }
          } else if (response.status === 401) {
            // Access token cookie expired — try refresh (browser sends refresh_token cookie)
            try {
              const refreshResponse = await fetch('/api/auth/refresh', { method: 'POST' });
              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                setAuth(refreshData.user || JSON.parse(userStr || '{}'), '', '');
                if (refreshData.user && typeof window !== 'undefined') {
                  localStorage.setItem('user', JSON.stringify(refreshData.user));
                }
              } else {
                // Refresh also failed — clear auth
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
