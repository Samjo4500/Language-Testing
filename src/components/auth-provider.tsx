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

    // Hydrate auth state from localStorage on mount
    const hydrate = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');

        if (accessToken && refreshToken && userStr) {
          // Validate the token by hitting /api/auth/me
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setAuth(data.user, accessToken, refreshToken);
          } else if (response.status === 401) {
            // Try refreshing the token
            try {
              const refreshResponse = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${refreshToken}`,
                },
              });

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                const user = JSON.parse(userStr);
                setAuth(user, refreshData.accessToken, refreshData.refreshToken);
              } else {
                logout();
              }
            } catch {
              logout();
            }
          } else {
            logout();
          }
        } else {
          // No stored tokens, stop loading
          setLoading(false);
        }
      } catch {
        // Network error or other issue - just stop loading, don't logout
        // This prevents redirect loops when the API is temporarily unreachable
        setLoading(false);
      }
    };

    hydrate();
  }, [setAuth, setLoading, logout]);

  return <>{children}</>;
}
