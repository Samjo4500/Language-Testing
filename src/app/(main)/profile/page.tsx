'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';
import { isPaidPlan, getPlanLabel, getPlanBadgeClasses } from '@/lib/plan-utils';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Globe,
  Edit3,
  Save,
  X,
  Loader2,
  Shield,
  Mail,
  Clock,
  GraduationCap,
  Languages,
  ArrowRight,
  AlertCircle,
  Trophy,
  MessageSquare,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { AvatarUpload } from '@/components/avatar-upload';

// ─── Country list (common) ──────────────────────────────────
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
  { value: 'A1', label: 'A1 — Beginner', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { value: 'A2', label: 'A2 — Elementary', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { value: 'B1', label: 'B1 — Intermediate', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'B2', label: 'B2 — Upper Intermediate', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'C1', label: 'C1 — Advanced', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'C2', label: 'C2 — Proficient', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
];

const LANGUAGES: Record<string, string> = {
  en: 'English', es: 'Spanish', fr: 'French', zh: 'Chinese',
  ja: 'Japanese', ko: 'Korean', de: 'German', pt: 'Portuguese',
  ar: 'Arabic', ru: 'Russian', it: 'Italian', hi: 'Hindi',
  tr: 'Turkish', nl: 'Dutch', sv: 'Swedish',
};

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
  'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'bg-green-500/20 text-green-400 border-green-500/30',
  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'bg-slate-500/20 text-slate-400 border-slate-500/30',
];

// ─── Types ─────────────────────────────────────────────────
interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  bio: string | null;
  englishLevel: string | null;
  occupation: string | null;
  country: string | null;
  plan: string;
  role: string;
  accountType: string;
  isProfileComplete: boolean;
  interests: string | null;
  isVerified: boolean;
  emailVerified: boolean;
  trustScore: number;
  createdAt: string;
}

interface LanguageProfileData {
  id: string;
  nativeLanguage: string;
  targetLanguages: string[];
  proficiencyLevel: string;
  timezone: string | null;
  isOnline: boolean;
  isDiscoverable: boolean;
}

// ─── Main Component ────────────────────────────────────────
export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const isAuth = mounted && isAuthenticated;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [langProfile, setLangProfile] = useState<LanguageProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formAvatarUrl, setFormAvatarUrl] = useState<string | null>('');
  const [formCountry, setFormCountry] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formGender, setFormGender] = useState('');
  const [formDateOfBirth, setFormDateOfBirth] = useState('');
  const [formEnglishLevel, setFormEnglishLevel] = useState('');
  const [formOccupation, setFormOccupation] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formInterests, setFormInterests] = useState<string[]>([]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/profile', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setLangProfile(data.languageProfile);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuth) fetchProfile();
    else setLoading(false);
  }, [isAuth, fetchProfile]);

  const startEditing = () => {
    if (!profile) return;
    setFormName(profile.name || '');
    setFormAvatarUrl(profile.avatarUrl || '');
    setFormCountry(profile.country || '');
    setFormPhone(profile.phone || '');
    setFormGender(profile.gender || '');
    setFormDateOfBirth(profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '');
    setFormEnglishLevel(profile.englishLevel || '');
    setFormOccupation(profile.occupation || '');
    setFormBio(profile.bio || '');
    setFormInterests(profile.interests ? JSON.parse(profile.interests) : []);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: formName,
          avatarUrl: formAvatarUrl,
          country: formCountry,
          phone: formPhone,
          gender: formGender,
          dateOfBirth: formDateOfBirth || null,
          englishLevel: formEnglishLevel,
          occupation: formOccupation,
          bio: formBio,
          interests: formInterests,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setLangProfile(data.languageProfile);
        setEditing(false);
      }
    } catch (err) {
      console.error('Save profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  const getLevelBadge = (level: string | null) => {
    if (!level) return null;
    const l = ENGLISH_LEVELS.find((e) => e.value === level);
    if (!l) return null;
    return (
      <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border', l.color)}>
        {l.value}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGenderLabel = (value: string | null) => {
    if (!value) return 'Not specified';
    return GENDER_OPTIONS.find((g) => g.value === value)?.label || value;
  };

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // Calculate profile completeness
  const getProfileCompleteness = () => {
    if (!profile) return 0;
    const fields: { filled: boolean; weight: number }[] = [
      { filled: !!profile.name, weight: 15 },
      { filled: !!profile.avatarUrl, weight: 15 },
      { filled: !!profile.country, weight: 10 },
      { filled: !!profile.phone, weight: 10 },
      { filled: !!profile.gender, weight: 10 },
      { filled: !!profile.dateOfBirth, weight: 10 },
      { filled: !!profile.englishLevel, weight: 15 },
      { filled: !!profile.occupation, weight: 5 },
      { filled: !!profile.bio, weight: 10 },
    ];
    const total = fields.reduce((sum, f) => sum + f.weight, 0);
    const filled = fields.reduce((sum, f) => sum + (f.filled ? f.weight : 0), 0);
    return Math.round((filled / total) * 100);
  };

  const completeness = getProfileCompleteness();
  const getCompletenessColor = (pct: number) => {
    if (pct >= 80) return 'from-emerald-500 to-green-400';
    if (pct >= 50) return 'from-yellow-500 to-amber-400';
    return 'from-red-500 to-orange-400';
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card p-8 max-w-md text-center">
            <User className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
            <p className="text-white/50 text-sm mb-6">
              Please sign in to view your profile.
            </p>
            <a href="/login">
              <button className="w-full rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium text-sm">
                Sign In
              </button>
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <section className="relative hero-pattern noise-overlay overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
          <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4 py-12 md:py-16">
          {!editing ? (
            /* ═══ VIEW MODE ═══ */
            <>
              {/* Profile Completeness Bar */}
              <div className="max-w-3xl mx-auto mb-4">
                <div className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/70">Profile Completeness</span>
                    <span className={cn(
                      'text-sm font-bold',
                      completeness >= 80 ? 'text-emerald-400' : completeness >= 50 ? 'text-yellow-400' : 'text-red-400'
                    )}>
                      {completeness}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', getCompletenessColor(completeness))}
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                  {completeness < 100 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <AlertCircle className="h-3.5 w-3.5 text-white/30" />
                      <p className="text-xs text-white/40">
                        Complete your profile to unlock all features.{' '}
                        <button
                          onClick={startEditing}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        >
                          Edit Profile →
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Header */}
              <div className="max-w-3xl mx-auto mb-8">
                <div className="glass-card p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar */}
                    <div className="relative group">
                      {profile?.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={profile.name || 'User'}
                          className="h-24 w-24 rounded-full object-cover border-2 border-white/10"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-3xl font-bold text-white border-2 border-white/10">
                          {(profile?.name || profile?.email || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      {profile?.isProfileComplete && (
                        <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-[#0F0A1E] flex items-center justify-center">
                          <Shield className="h-3 w-3 text-white" />
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-white">
                          {profile?.name || 'Anonymous User'}
                        </h1>
                        {getLevelBadge(profile?.englishLevel || null)}
                        {/* Verification Badges */}
                        {profile?.emailVerified && (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium" title="Email Verified">
                            <Mail className="h-3 w-3" /> Verified
                          </span>
                        )}
                        {profile?.isProfileComplete && (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium" title="Profile Complete">
                            <CheckCircle2 className="h-3 w-3" /> Complete
                          </span>
                        )}
                      </div>
                      {/* Trust Score */}
                      {profile && profile.trustScore > 0 && (
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                          <span className="text-xs text-amber-400/80">Trust Score: {Math.min(profile.trustScore, 100)}</span>
                          <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{ width: `${Math.min(profile.trustScore, 100)}%` }} />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-white/50">
                        {profile?.country && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {profile.country}
                          </span>
                        )}
                        {profile?.occupation && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />
                            {profile.occupation}
                          </span>
                        )}
                        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', getPlanBadgeClasses(profile?.plan))}>
                          {getPlanLabel(profile?.plan)}
                        </span>
                      </div>
                      {profile?.bio && (
                        <p className="text-white/60 text-sm mt-3 max-w-lg">{profile.bio}</p>
                      )}
                    </div>

                    {/* Edit button */}
                    <button
                      onClick={startEditing}
                      className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="max-w-3xl mx-auto grid gap-4 sm:grid-cols-2">
                {/* Personal Info */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-400" />
                    Personal Info
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Phone', value: profile?.phone, icon: Phone },
                      { label: 'Gender', value: getGenderLabel(profile?.gender || null), icon: User },
                      { label: 'Date of Birth', value: profile?.dateOfBirth ? `${formatDate(profile.dateOfBirth)} (Age ${calculateAge(profile.dateOfBirth)})` : null, icon: Calendar },
                      { label: 'Country', value: profile?.country, icon: MapPin },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-2.5">
                        <item.icon className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-white/40">{item.label}</p>
                          <p className="text-sm text-white/80">{item.value || 'Not specified'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Language Profile */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                    <Languages className="h-4 w-4 text-blue-400" />
                    Language Profile
                  </h3>
                  {langProfile ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <Globe className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-white/40">Native Language</p>
                          <p className="text-sm text-white/80">{LANGUAGES[langProfile.nativeLanguage] || langProfile.nativeLanguage}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <GraduationCap className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-white/40">Target Languages</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {langProfile.targetLanguages.map((lang) => (
                              <span key={lang} className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-medium">
                                {LANGUAGES[lang] || lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Briefcase className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-white/40">Proficiency</p>
                          <p className="text-sm text-white/80 capitalize">{langProfile.proficiencyLevel}</p>
                        </div>
                      </div>
                      <a href="/community" className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-2">
                        Edit language profile
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-white/40 text-sm mb-3">No language profile yet</p>
                      <a href="/community" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-500/25 transition-all">
                        <Languages className="h-3 w-3" />
                        Set Up Language Profile
                      </a>
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-400" />
                    Interests
                  </h3>
                  {profile?.interests ? (
                    <div className="flex flex-wrap gap-1.5">
                      {JSON.parse(profile.interests).map((interest: string, i: number) => (
                        <span
                          key={interest}
                          className={cn(
                            'px-2.5 py-1 rounded-full text-xs font-medium border',
                            INTEREST_COLORS[INTEREST_TAGS.indexOf(interest) % INTEREST_COLORS.length] || 'bg-white/5 text-white/40 border-white/10'
                          )}
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm">No interests selected yet.</p>
                  )}
                </div>

                {/* Account Info */}
                <div className="glass-card p-5 sm:col-span-2">
                  <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    Account Info
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-start gap-2.5">
                      <Mail className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-white/40">Email</p>
                        <p className="text-sm text-white/80">{profile?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Shield className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-white/40">Plan</p>
                        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', getPlanBadgeClasses(profile?.plan))}>
                          {getPlanLabel(profile?.plan)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-white/40">Member Since</p>
                        <p className="text-sm text-white/80">{profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <User className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-white/40">Account Type</p>
                        <p className="text-sm text-white/80 capitalize">{profile?.accountType || 'Individual'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ═══ EDIT MODE ═══ */
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                <p className="text-white/50 text-sm mt-1">Update your personal information</p>
              </div>

              <div className="glass-card p-6 space-y-5">
                {/* Avatar Upload */}
                <div className="flex justify-center">
                  <AvatarUpload
                    value={formAvatarUrl}
                    onChange={setFormAvatarUrl}
                    fallbackText={formName || profile?.email || 'U'}
                    size="md"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25"
                    placeholder="Your full name"
                  />
                </div>

                {/* Avatar URL field removed — use AvatarUpload above */}

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Country</label>
                  <select
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
                  >
                    <option value="" className="bg-[#1a1f36]">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} className="bg-[#1a1f36]">{c}</option>
                    ))}
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
                  >
                    <option value="" className="bg-[#1a1f36]">Prefer not to say</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value} className="bg-[#1a1f36]">{g.label}</option>
                    ))}
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={formDateOfBirth}
                    onChange={(e) => setFormDateOfBirth(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 [color-scheme:dark]"
                  />
                </div>

                {/* English Level */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">English Level</label>
                  <div className="flex flex-wrap gap-2">
                    {ENGLISH_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setFormEnglishLevel(level.value)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border',
                          formEnglishLevel === level.value
                            ? level.color
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
                        )}
                      >
                        {level.value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Occupation</label>
                  <input
                    type="text"
                    value={formOccupation}
                    onChange={(e) => setFormOccupation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
                    placeholder="e.g., Student, Teacher, Software Engineer"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Bio</label>
                  <textarea
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value.slice(0, 500))}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 placeholder:text-white/30 resize-none"
                    placeholder="Tell us about yourself and your language goals..."
                  />
                  <p className="text-white/30 text-xs mt-1">{formBio.length}/500</p>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    <Heart className="inline h-3.5 w-3.5 mr-1 text-pink-400" />
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {INTEREST_TAGS.map((tag, i) => (
                      <button
                        key={tag}
                        onClick={() => setFormInterests((prev) =>
                          prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                        )}
                        className={cn(
                          'px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border',
                          formInterests.includes(tag)
                            ? INTEREST_COLORS[i % INTEREST_COLORS.length] + ' border-current'
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={cancelEditing}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
