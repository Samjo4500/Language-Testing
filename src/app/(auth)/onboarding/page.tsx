'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { AvatarUpload } from '@/components/avatar-upload';
import { cn } from '@/lib/utils';
import {
  Loader2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  PartyPopper,
  Trophy,
  BookOpen,
  MapPin,
  Phone,
  User,
  Calendar,
  Briefcase,
  Globe,
  FileText,
} from 'lucide-react';

// ─── Country list ──────────────────────────────────────────
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bangladesh', 'Belarus', 'Belgium', 'Bolivia',
  'Bosnia and Herzegovina', 'Brazil', 'Bulgaria', 'Cambodia', 'Cameroon',
  'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Cuba',
  'Czech Republic', 'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Estonia', 'Ethiopia', 'Finland', 'France', 'Georgia',
  'Germany', 'Ghana', 'Greece', 'Guatemala', 'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia',
  'Lebanon', 'Libya', 'Lithuania', 'Luxembourg', 'Malaysia', 'Mali', 'Mexico',
  'Moldova', 'Mongolia', 'Morocco', 'Mozambique', 'Myanmar', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Nigeria', 'Norway', 'Oman',
  'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saudi Arabia',
  'Senegal', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia',
  'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Sweden',
  'Switzerland', 'Syria', 'Taiwan', 'Tanzania', 'Thailand', 'Tunisia',
  'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe',
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const ENGLISH_LEVELS = [
  { value: 'A1', label: 'A1 — Beginner', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', desc: 'Just starting out' },
  { value: 'A2', label: 'A2 — Elementary', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', desc: 'Basic phrases & simple communication' },
  { value: 'B1', label: 'B1 — Intermediate', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', desc: 'Can handle most travel & work situations' },
  { value: 'B2', label: 'B2 — Upper Intermediate', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', desc: 'Fluent for most professional contexts' },
  { value: 'C1', label: 'C1 — Advanced', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', desc: 'Complex texts & nuanced expression' },
  { value: 'C2', label: 'C2 — Proficient', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', desc: 'Near-native mastery' },
];

const INTEREST_TAGS = [
  'Travel', 'Photography', 'Cooking', 'Sports', 'Music', 'Movies',
  'Technology', 'Art', 'Reading', 'Gaming', 'Fashion', 'Nature',
  'Fitness', 'Business', 'Science', 'History', 'Literature', 'Dance',
];

const INTEREST_COLORS = [
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'bg-red-500/20 text-red-400 border-red-500/30',
  'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'bg-lime-500/20 text-lime-400 border-lime-500/30',
  'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
  'bg-green-500/20 text-green-400 border-green-500/30',
  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'bg-slate-500/20 text-slate-400 border-slate-500/30',
];

// ─── Step Definitions ──────────────────────────────────────
const STEPS = [
  { title: 'Welcome', icon: Sparkles },
  { title: 'Personal Info', icon: User },
  { title: 'English Profile', icon: Globe },
  { title: 'Interests', icon: Sparkles },
  { title: 'All Done!', icon: PartyPopper },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [englishLevel, setEnglishLevel] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authIsLoading, isAuthenticated, router]);

  // Redirect if profile already complete
  useEffect(() => {
    if (!authIsLoading && isAuthenticated && user?.isProfileComplete) {
      router.replace('/dashboard');
    }
  }, [authIsLoading, isAuthenticated, user, router]);

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection('backward');
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    goNext();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          avatarUrl,
          country: country || null,
          phone: phone || null,
          gender: gender || null,
          dateOfBirth: dateOfBirth || null,
          englishLevel: englishLevel || null,
          occupation: occupation || null,
          bio: bio || null,
          interests: selectedInterests,
        }),
      });

      if (res.ok) {
        goNext(); // go to "All Done!" step
      }
    } catch (err) {
      console.error('Onboarding submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authIsLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb orb-blue w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
          <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="w-full max-w-lg relative">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={cn(
                      'flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-all duration-300',
                      i <= currentStep
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-white/5 text-white/30 border border-white/10'
                    )}
                  >
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'h-0.5 w-8 sm:w-16 transition-all duration-300',
                        i < currentStep
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                          : 'bg-white/10'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-white/40 text-xs">
              Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].title}
            </p>
          </div>

          {/* Step Content */}
          <div className="overflow-hidden">
            <div
              className="transition-all duration-300 ease-in-out"
              style={{
                transform: `translateX(${direction === 'forward' ? '0' : '0'})`,
              }}
            >
              {/* Step 1: Welcome + Avatar */}
              {currentStep === 0 && (
                <div className="glass-card p-6 md:p-8 text-center space-y-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                      Welcome, {user?.name || 'there'}! 👋
                    </h1>
                    <p className="text-white/50 text-sm">
                      Let&apos;s set up your profile so we can personalize your learning experience. It only takes a minute!
                    </p>
                  </div>

                  {/* Avatar Upload */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-white/70">Upload your profile photo</p>
                    <AvatarUpload
                      value={avatarUrl}
                      onChange={setAvatarUrl}
                      fallbackText={user?.name || user?.email || 'U'}
                      size="lg"
                    />
                    <p className="text-white/30 text-xs">JPG, PNG, GIF or WebP. Max 2MB.</p>
                  </div>

                  <button
                    onClick={goNext}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Personal Info */}
              {currentStep === 1 && (
                <div className="glass-card p-6 md:p-8 space-y-5">
                  <div className="text-center mb-2">
                    <h2 className="text-xl font-bold text-white mb-1">Personal Info</h2>
                    <p className="text-white/50 text-sm">Tell us a bit about yourself</p>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      <MapPin className="inline h-3.5 w-3.5 mr-1" />
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25"
                    >
                      <option value="" className="bg-[#1a1f36]">Select country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} className="bg-[#1a1f36]">{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      <Phone className="inline h-3.5 w-3.5 mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 placeholder:text-white/30"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      <User className="inline h-3.5 w-3.5 mr-1" />
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25"
                    >
                      <option value="" className="bg-[#1a1f36]">Prefer not to say</option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g.value} value={g.value} className="bg-[#1a1f36]">{g.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      <Calendar className="inline h-3.5 w-3.5 mr-1" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 [color-scheme:dark]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={goBack}
                      className="flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    <button
                      onClick={handleSkip}
                      className="flex items-center justify-center gap-1 rounded-xl py-2.5 px-4 text-white/40 text-sm hover:text-white/60 transition-colors cursor-pointer"
                    >
                      <SkipForward className="h-3.5 w-3.5" />
                      Skip
                    </button>
                    <button
                      onClick={goNext}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-cyan-500/25 cursor-pointer"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: English Profile */}
              {currentStep === 2 && (
                <div className="glass-card p-6 md:p-8 space-y-5">
                  <div className="text-center mb-2">
                    <h2 className="text-xl font-bold text-white mb-1">English Profile</h2>
                    <p className="text-white/50 text-sm">Help us understand your English level and goals</p>
                  </div>

                  {/* English Level */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      <Globe className="inline h-3.5 w-3.5 mr-1" />
                      Your English Level
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ENGLISH_LEVELS.map((level) => (
                        <button
                          key={level.value}
                          onClick={() => setEnglishLevel(level.value)}
                          className={cn(
                            'px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer border',
                            englishLevel === level.value
                              ? level.color + ' border-current'
                              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
                          )}
                        >
                          <div className="text-sm font-semibold">{level.value}</div>
                          <div className="text-[10px] opacity-70">{level.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      <Briefcase className="inline h-3.5 w-3.5 mr-1" />
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 placeholder:text-white/30"
                      placeholder="e.g., Student, Teacher, Software Engineer"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      <FileText className="inline h-3.5 w-3.5 mr-1" />
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value.slice(0, 500))}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 placeholder:text-white/30 resize-none"
                      placeholder="Tell us about yourself and your language goals..."
                    />
                    <p className="text-white/30 text-xs mt-1">{bio.length}/500</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={goBack}
                      className="flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    <button
                      onClick={handleSkip}
                      className="flex items-center justify-center gap-1 rounded-xl py-2.5 px-4 text-white/40 text-sm hover:text-white/60 transition-colors cursor-pointer"
                    >
                      <SkipForward className="h-3.5 w-3.5" />
                      Skip
                    </button>
                    <button
                      onClick={goNext}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-cyan-500/25 cursor-pointer"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Interests */}
              {currentStep === 3 && (
                <div className="glass-card p-6 md:p-8 space-y-5">
                  <div className="text-center mb-2">
                    <h2 className="text-xl font-bold text-white mb-1">Your Interests</h2>
                    <p className="text-white/50 text-sm">Select topics you enjoy — this helps match you with language partners!</p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {INTEREST_TAGS.map((tag, i) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedInterests((prev) =>
                          prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                        )}
                        className={cn(
                          'px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer border',
                          selectedInterests.includes(tag)
                            ? INTEREST_COLORS[i % INTEREST_COLORS.length] + ' border-current'
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {selectedInterests.length > 0 && (
                    <p className="text-center text-white/30 text-xs">{selectedInterests.length} selected</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={goBack}
                      className="flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    <button
                      onClick={handleSkip}
                      className="flex items-center justify-center gap-1 rounded-xl py-2.5 px-4 text-white/40 text-sm hover:text-white/60 transition-colors cursor-pointer"
                    >
                      <SkipForward className="h-3.5 w-3.5" />
                      Skip
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Complete Setup
                          <Sparkles className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: All Done! */}
              {currentStep === 4 && (
                <div className="glass-card p-6 md:p-8 text-center space-y-6">
                  {/* Celebration */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl rounded-full" />
                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30">
                      <PartyPopper className="h-9 w-9" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">You&apos;re all set! 🎉</h2>
                    <p className="text-white/50 text-sm">
                      Your profile is ready. Let&apos;s start your English journey!
                    </p>
                  </div>

                  {/* Profile Card Preview */}
                  <div className="glass-card p-4 text-left">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="h-12 w-12 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center text-lg font-bold text-white border border-white/10">
                          {(user?.name || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">{user?.name || 'Anonymous'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {country && (
                            <span className="text-white/40 text-xs flex items-center gap-1">
                              <MapPin className="h-3 w-3" />{country}
                            </span>
                          )}
                          {englishLevel && (
                            <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                              {englishLevel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push('/test')}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Trophy className="h-4 w-4" />
                      Take Assessment
                    </button>
                    <button
                      onClick={() => router.push('/courses')}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                      <BookOpen className="h-4 w-4" />
                      Browse Courses
                    </button>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="text-white/30 text-xs hover:text-white/50 transition-colors cursor-pointer"
                    >
                      Go to Dashboard →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
