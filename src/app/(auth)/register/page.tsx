'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { trackAccountCreate } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  UserPlus,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  User,
  Building2,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

type AccountType = 'individual' | 'university' | 'business';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setAuth, isAuthenticated, isLoading: authIsLoading } = useAuthStore();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authIsLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [authIsLoading, isAuthenticated, router]);

  const isB2B = accountType === 'university' || accountType === 'business';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }

    if (isB2B && !organizationName.trim()) {
      setError('Please enter your organization name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          accountType,
          organizationName: isB2B ? organizationName : undefined,
        }),
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      setAuth(data.user, data.accessToken, data.refreshToken);
      // Track account creation
      trackAccountCreate({ account_type: accountType });
      router.push('/onboarding');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb orb-purple w-[400px] h-[400px] -top-20 -left-20 animate-float-slow" />
          <div className="orb orb-pink w-[300px] h-[300px] bottom-0 right-1/4 animate-float-reverse" />
        </div>

        <div className="relative w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">
          {/* Left Panel - Benefits & Account Type */}
          <div className="hidden md:block pt-4">
            <div className="flex items-center gap-2.5 text-2xl font-bold text-white mb-6">
              <img src="/logo-icon.svg" alt="CEFR Test" className="h-10 w-10" />
              <span className="tracking-tight">test<span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">cefr</span><span className="text-blue-300">.com</span></span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Start your English journey</h1>
            <p className="text-white/50 mb-6">
              Join thousands of learners who have discovered their true English level with our professional CEFR assessment.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                '1 free assessment included',
                'Detailed CEFR results & breakdown',
                'Official certificate with QR verification',
                'Progress tracking across all skills',
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Account Type Selector */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">I am signing up as:</p>

              <button
                type="button"
                onClick={() => setAccountType('individual')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  accountType === 'individual'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 hover:border-blue-500/40'
                }`}
              >
                <User className={`h-5 w-5 shrink-0 ${accountType === 'individual' ? 'text-blue-400' : 'text-white/40'}`} />
                <div>
                  <p className={`font-semibold text-sm ${accountType === 'individual' ? 'text-white' : 'text-white/70'}`}>
                    Individual Learner
                  </p>
                  <p className="text-xs text-white/40">Personal assessment &amp; certificates</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('university')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  accountType === 'university'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 hover:border-blue-500/40'
                }`}
              >
                <GraduationCap className={`h-5 w-5 shrink-0 ${accountType === 'university' ? 'text-blue-400' : 'text-white/40'}`} />
                <div>
                  <p className={`font-semibold text-sm ${accountType === 'university' ? 'text-white' : 'text-white/70'}`}>
                    University / School
                  </p>
                  <p className="text-xs text-white/40">Student management, bulk testing, reports</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('business')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  accountType === 'business'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 hover:border-blue-500/40'
                }`}
              >
                <Building2 className={`h-5 w-5 shrink-0 ${accountType === 'business' ? 'text-blue-400' : 'text-white/40'}`} />
                <div>
                  <p className={`font-semibold text-sm ${accountType === 'business' ? 'text-white' : 'text-white/70'}`}>
                    Business / Corporate
                  </p>
                  <p className="text-xs text-white/40">Team dashboard, bulk import, API access</p>
                </div>
              </button>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div>
            {/* Mobile: Account type selector */}
            <div className="md:hidden flex flex-col items-center mb-6">
              <div className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                <img src="/logo-icon.svg" alt="CEFR Test" className="h-8 w-8" />
                <span className="tracking-tight">test<span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">cefr</span><span className="text-blue-300">.com</span></span>
              </div>
              <div className="flex gap-2 w-full">
                {[
                  { type: 'individual' as AccountType, icon: <User className="h-4 w-4" />, label: 'Individual' },
                  { type: 'university' as AccountType, icon: <GraduationCap className="h-4 w-4" />, label: 'School' },
                  { type: 'business' as AccountType, icon: <Building2 className="h-4 w-4" />, label: 'Business' },
                ].map(({ type, icon, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      accountType === type
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-white/10 text-white/50'
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 md:p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Create your account</h1>
                <p className="text-sm text-white/50 mt-1">
                  Free forever — no credit card required
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/70">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    autoComplete="name"
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 rounded-xl glow-input focus:border-blue-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/70">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 rounded-xl glow-input focus:border-blue-500/50"
                  />
                </div>

                {/* Organization Name - shown for B2B/University */}
                {isB2B && (
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-white/70">
                      {accountType === 'university' ? 'University / School Name' : 'Company / Organization Name'}
                    </Label>
                    <Input
                      id="organizationName"
                      type="text"
                      placeholder={accountType === 'university' ? 'e.g., Oxford University' : 'e.g., Acme Corp'}
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder-white/30 rounded-xl glow-input focus:border-blue-500/50"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/70">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="bg-white/5 border-white/10 text-white placeholder-white/30 rounded-xl glow-input focus:border-blue-500/50 pr-10"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white/70">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="bg-white/5 border-white/10 text-white placeholder-white/30 rounded-xl glow-input focus:border-blue-500/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Create Free Account
                    </>
                  )}
                </button>

                {/* Security badges */}
                <div className="flex flex-col items-center gap-2 pt-1">
                  <p className="text-xs text-white/30">Your data is safe with us</p>
                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                      <Lock className="h-3 w-3 text-emerald-400" />
                      <span className="text-[11px] font-medium text-white/50">SSL Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                      <ShieldCheck className="h-3 w-3 text-blue-400" />
                      <span className="text-[11px] font-medium text-white/50">GDPR Compliant</span>
                    </div>
                  </div>
                </div>
              </form>

              <div className="mt-4 text-center text-sm text-white/40">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
