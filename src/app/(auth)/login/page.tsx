'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setAuth, isAuthenticated, isLoading: authIsLoading } = useAuthStore();

  // Redirect to dashboard if already authenticated (after auth hydration completes)
  useEffect(() => {
    // Wait for auth hydration to finish before deciding whether to redirect
    if (authIsLoading) return;
    if (isAuthenticated) {
      // Use the redirect param if present (sanitized), otherwise go to dashboard
      const params = new URLSearchParams(window.location.search);
      const rawRedirect = params.get('redirect') || '/dashboard';
      const redirectTo = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/dashboard';
      router.replace(redirectTo);
    }
  }, [authIsLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setError('Server returned an invalid response. Please refresh the page and try again.');
        return;
      }

      if (!response.ok) {
        // Handle service unavailability (database errors) with a friendlier message
        if (response.status === 503 || data.code === 'DB_AUTH_ERROR' || data.code === 'DB_CONNECTION_ERROR') {
          setError('Service temporarily unavailable. Our team has been notified. Please try again in a few minutes.');
        } else {
          setError(data.error || 'Login failed. Please try again.');
        }
        return;
      }

      setAuth(data.user, data.accessToken, data.refreshToken);

      // Redirect to onboarding if profile is incomplete
      if (data.user.isProfileComplete === false) {
        router.push('/onboarding');
      } else {
        // Use the redirect param if present (sanitized), otherwise go to dashboard
        const params = new URLSearchParams(window.location.search);
        const rawRedirect = params.get('redirect') || '/dashboard';
        const redirectTo = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/dashboard';
        router.push(redirectTo);
      }
    } catch (err) {
      // Network-level error (Failed to fetch)
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Network error: Unable to reach the server. Please check your internet connection and try again. If the problem persists, try clearing your browser cache.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking auth status to prevent form flash
  if (authIsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </div>
    );
  }

  // If authenticated, show spinner while redirect happens
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb orb-purple w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
          <div className="orb orb-pink w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="w-full max-w-md relative">
          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4 shadow-lg shadow-purple-500/25">
                <LogIn className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-white">Welcome back</h1>
              <p className="text-sm text-white/50 mt-1">
                Sign in to your account to continue your English proficiency journey.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="bg-white/5 border-white/10 text-white placeholder-white/30 rounded-xl glow-input focus:border-purple-500/50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white/70">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 rounded-xl glow-input focus:border-purple-500/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Sign in
                  </>
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-white/40">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo credentials for preview/sandbox */}
            <div className="mt-4 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
              <p className="text-xs text-blue-300 font-medium mb-1">Demo Account (Sandbox Mode)</p>
              <p className="text-xs text-white/50">Email: <span className="text-white/70 font-mono">demo01@testcefr.com</span></p>
              <p className="text-xs text-white/50">Password: <span className="text-white/70 font-mono">Demo@2026!</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
