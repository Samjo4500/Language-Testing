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
          // First, set auth from localStorage immediately to prevent flicker
          try {
            const user = JSON.parse(userStr);
            // Set auth with existing tokens so the UI shows authenticated immediately
            setAuth(user, accessToken, refreshToken);
            // Also refresh the cookie so middleware sees it with updated expiry
            document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax; Secure`;
          } catch {
            // Bad localStorage data
            logout();
            return;
          }

          // Then validate the token in the background
          try {
            const response = await fetch('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            });

            if (response.ok) {
              // Token is still valid - update user data from server
              const data = await response.json();
              setAuth(data.user, accessToken, refreshToken);
            } else if (response.status === 401) {
              // Access token expired - try refreshing
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
                  setAuth(user, refreshData.accessToken, refreshData.refreshToken || refreshToken);
                } else if (refreshResponse.status === 401) {
                  // Refresh token also expired - must re-login
                  logout();
                }
                // On 5xx from refresh, keep localStorage auth (server issue, not auth issue)
              } catch {
                // Network error during refresh - keep localStorage auth
              }
            }
            // On 5xx from /me, keep localStorage auth (already set above)
          } catch {
            // Network error during /me validation - keep localStorage auth
          }
        } else {
          // No stored tokens, stop loading
          setLoading(false);
        }
      } catch {
        // localStorage not available or other issue - just stop loading
        setLoading(false);
      }
    };

    hydrate();
  }, [setAuth, setLoading, logout]);

  return <>{children}</>;
}
