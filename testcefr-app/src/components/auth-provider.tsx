'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setLoading, logout } = useAuthStore();

  useEffect(() => {
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
          } else {
            logout();
          }
        } else {
          // No stored tokens, stop loading
          setLoading(false);
        }
      } catch {
        logout();
      }
    };

    hydrate();
  }, [setAuth, setLoading, logout]);

  return <>{children}</>;
}
