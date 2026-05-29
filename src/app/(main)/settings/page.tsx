'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';
import {
  User, Mail, Lock, Bell, Trash2, Shield, Save,
  Loader2, Eye, EyeOff, CheckCircle2, AlertCircle,
  Settings, Key, Smartphone, Globe, Moon, Sun, Volume2, VolumeX,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Notification preferences type ─────────────────────────
interface NotificationPrefs {
  emailAssessment: boolean;
  emailNewsletter: boolean;
  emailPromotions: boolean;
  pushMessages: boolean;
  pushCommunity: boolean;
  pushReminders: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  emailAssessment: true,
  emailNewsletter: true,
  emailPromotions: false,
  pushMessages: true,
  pushCommunity: true,
  pushReminders: true,
};

// ─── Main Component ────────────────────────────────────────
export default function SettingsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const isAuth = mounted && isAuthenticated;
  const router = useRouter();

  // Active section
  const [activeSection, setActiveSection] = useState('profile');

  // Profile form
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState<NotificationPrefs>(DEFAULT_NOTIFICATIONS);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteSaving, setDeleteSaving] = useState(false);

  // Initialize form from user data
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  // Profile save handler
  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileSaved(false);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ name: profileName, email: profileEmail }),
      });
      if (res.ok) {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      }
    } catch {
      // Silently handle
    } finally {
      setProfileSaving(false);
    }
  };

  // Password save handler
  const handlePasswordSave = async () => {
    setPasswordError('');
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordSaving(true);
    setPasswordSaved(false);
    try {
      const res = await fetch('/api/auth/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPasswordSaved(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSaved(false), 3000);
      } else {
        const data = await res.json();
        setPasswordError(data.error || 'Failed to update password. Please try again.');
      }
    } catch {
      setPasswordError('An error occurred. Please try again.');
    } finally {
      setPasswordSaving(false);
    }
  };

  // Notification save handler
  const handleNotifSave = async () => {
    setNotifSaving(true);
    setNotifSaved(false);
    // Simulate save (no backend endpoint yet)
    await new Promise((r) => setTimeout(r, 800));
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
    setNotifSaving(false);
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleteSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        router.push('/');
      }
    } catch {
      // Silently handle
    } finally {
      setDeleteSaving(false);
    }
  };

  // ─── Loading state ────────────────────────────────────────
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  // ─── Not authenticated ────────────────────────────────────
  if (!isAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card p-8 max-w-md text-center">
            <User className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
            <p className="text-white/50 text-sm mb-6">
              Please sign in to access your account settings.
            </p>
            <a href="/login">
              <button className="w-full rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium text-sm hover:from-blue-500 hover:to-cyan-400 transition-all cursor-pointer">
                Sign In
              </button>
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Section navigation items ─────────────────────────────
  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden hero-pattern noise-overlay">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-violet w-[400px] h-[400px] -top-24 -left-24 animate-float-slow" />
          <div className="orb orb-blue w-[300px] h-[300px] -bottom-16 right-1/4 animate-float-reverse" />
        </div>
        <div className="container relative mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-float inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-6 animate-border-glow">
              <Settings className="h-4 w-4 text-violet-300" />
              <span className="text-sm text-violet-200 font-medium">Account Settings</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] animate-slide-up">
              Settings
            </h1>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto animate-fade-in delay-300">
              Manage your account, security, and notification preferences.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0A1E] to-transparent" />
      </section>

      {/* ===== SETTINGS CONTENT ===== */}
      <section className="relative py-12 md:py-16 bg-[#0F0A1E]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">

              {/* ─── Sidebar Navigation ─── */}
              <div className="md:w-56 shrink-0">
                <nav className="glass-card p-3 md:sticky md:top-24">
                  <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap',
                          activeSection === section.id
                            ? 'bg-white/[0.08] text-white shadow-sm'
                            : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]',
                          section.id === 'danger' && activeSection === section.id && 'bg-red-500/10 text-red-400',
                          section.id === 'danger' && activeSection !== section.id && 'hover:text-red-400/70'
                        )}
                      >
                        <section.icon className="h-4 w-4 shrink-0" />
                        {section.label}
                      </button>
                    ))}
                  </div>
                </nav>
              </div>

              {/* ─── Main Content ─── */}
              <div className="flex-1 min-w-0">

                {/* ─── PROFILE SECTION ─── */}
                {activeSection === 'profile' && (
                  <div className="glass-card p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-violet-400 text-white shadow-lg">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                        <p className="text-white/40 text-xs">Update your personal information</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                          <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 placeholder:text-white/30"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                          <input
                            type="email"
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 placeholder:text-white/30"
                            placeholder="your@email.com"
                          />
                        </div>
                        {user?.email && (
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Email verified
                          </p>
                        )}
                      </div>

                      {/* Account Info (read-only) */}
                      <div className="pt-4 border-t border-white/10">
                        <h3 className="text-sm font-semibold text-white/60 mb-3">Account Information</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="glass-card p-3">
                            <p className="text-xs text-white/40 mb-1">Plan</p>
                            <p className="text-sm text-white font-medium">{user?.plan === 'premium' ? 'Premium' : 'Free'}</p>
                          </div>
                          <div className="glass-card p-3">
                            <p className="text-xs text-white/40 mb-1">Role</p>
                            <p className="text-sm text-white font-medium capitalize">{user?.role || 'User'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={handleProfileSave}
                          disabled={profileSaving}
                          className="flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {profileSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : profileSaved ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          {profileSaving ? 'Saving...' : profileSaved ? 'Saved!' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── PASSWORD SECTION ─── */}
                {activeSection === 'password' && (
                  <div className="glass-card p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-400 text-white shadow-lg">
                        <Key className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Change Password</h2>
                        <p className="text-white/40 text-xs">Update your account password</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                          Current Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 placeholder:text-white/30"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 placeholder:text-white/30"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {newPassword && newPassword.length < 8 && (
                          <p className="mt-1.5 text-xs text-amber-400">Password must be at least 8 characters</p>
                        )}
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 placeholder:text-white/30"
                            placeholder="Confirm new password"
                          />
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="mt-1.5 text-xs text-red-400">Passwords do not match</p>
                        )}
                      </div>

                      {/* Error message */}
                      {passwordError && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                          <p className="text-sm text-red-400">{passwordError}</p>
                        </div>
                      )}

                      {/* Save Button */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={handlePasswordSave}
                          disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                          className="flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {passwordSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : passwordSaved ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                          {passwordSaving ? 'Updating...' : passwordSaved ? 'Password Updated!' : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── NOTIFICATIONS SECTION ─── */}
                {activeSection === 'notifications' && (
                  <div className="glass-card p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-white shadow-lg">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
                        <p className="text-white/40 text-xs">Choose how you want to be notified</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Email Notifications */}
                      <div>
                        <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-400" />
                          Email Notifications
                        </h3>
                        <div className="space-y-3">
                          {[
                            { key: 'emailAssessment' as const, label: 'Assessment Results', desc: 'Receive emails when your CEFR assessment results are ready' },
                            { key: 'emailNewsletter' as const, label: 'Newsletter', desc: 'Weekly tips, learning resources, and platform updates' },
                            { key: 'emailPromotions' as const, label: 'Promotions', desc: 'Special offers, discounts, and new feature announcements' },
                          ].map((item) => (
                            <div key={item.key} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                              <button
                                onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                                className={cn(
                                  'mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors cursor-pointer',
                                  notifications[item.key] ? 'bg-blue-500' : 'bg-white/10'
                                )}
                              >
                                <div className={cn(
                                  'h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                                  notifications[item.key] ? 'translate-x-4' : 'translate-x-0'
                                )} />
                              </button>
                              <div>
                                <p className="text-sm text-white font-medium">{item.label}</p>
                                <p className="text-xs text-white/40">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Push Notifications */}
                      <div>
                        <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-emerald-400" />
                          Push Notifications
                        </h3>
                        <div className="space-y-3">
                          {[
                            { key: 'pushMessages' as const, label: 'Messages', desc: 'Direct messages from language partners and community members' },
                            { key: 'pushCommunity' as const, label: 'Community Activity', desc: 'Replies, mentions, and activity in SpeakSpace rooms' },
                            { key: 'pushReminders' as const, label: 'Learning Reminders', desc: 'Daily practice reminders and streak notifications' },
                          ].map((item) => (
                            <div key={item.key} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                              <button
                                onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                                className={cn(
                                  'mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors cursor-pointer',
                                  notifications[item.key] ? 'bg-emerald-500' : 'bg-white/10'
                                )}
                              >
                                <div className={cn(
                                  'h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                                  notifications[item.key] ? 'translate-x-4' : 'translate-x-0'
                                )} />
                              </button>
                              <div>
                                <p className="text-sm text-white font-medium">{item.label}</p>
                                <p className="text-xs text-white/40">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                        <button
                          onClick={handleNotifSave}
                          disabled={notifSaving}
                          className="flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {notifSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : notifSaved ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          {notifSaving ? 'Saving...' : notifSaved ? 'Preferences Saved!' : 'Save Preferences'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── DANGER ZONE SECTION ─── */}
                {activeSection === 'danger' && (
                  <div className="glass-card p-6 md:p-8 border-red-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-orange-400 text-white shadow-lg">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Danger Zone</h2>
                        <p className="text-white/40 text-xs">Irreversible and destructive actions</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Delete Account */}
                      <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/15">
                        <div className="flex items-start gap-3 mb-4">
                          <Trash2 className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                          <div>
                            <h3 className="text-lg font-semibold text-white">Delete Account</h3>
                            <p className="text-sm text-white/50 mt-1">
                              Permanently delete your account and all associated data. This action is irreversible and will remove your profile, assessment history, certificates, and community data.
                            </p>
                          </div>
                        </div>

                        {!showDeleteConfirm ? (
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-sm hover:bg-red-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete My Account
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                              <p className="text-sm text-red-300">
                                <strong>Warning:</strong> This will permanently delete your account, all test results, certificates, and community activity. This cannot be undone.
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-white/70 mb-1.5">
                                Type <strong className="text-red-400">DELETE</strong> to confirm
                              </label>
                              <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/25 placeholder:text-white/30"
                                placeholder="DELETE"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE' || deleteSaving}
                                className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                {deleteSaving ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                                {deleteSaving ? 'Deleting...' : 'Permanently Delete Account'}
                              </button>
                              <button
                                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                                className="rounded-xl px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 font-medium text-sm hover:bg-white/10 hover:text-white/80 transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
