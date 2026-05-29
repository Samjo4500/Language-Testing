'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  CheckCircle2,
  Heart,
  Download,
  Share2,
  Flame,
  Zap,
  BookOpen,
  Headphones,
  Users,
  MessageSquare,
  Brain,
  Star,
  Award,
  Sparkles,
  Eye,
  Filter,
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

const LANGUAGE_FLAGS: Record<string, string> = {
  en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷', zh: '🇨🇳',
  ja: '🇯🇵', ko: '🇰🇷', de: '🇩🇪', pt: '🇧🇷',
  ar: '🇸🇦', ru: '🇷🇺', it: '🇮🇹', hi: '🇮🇳',
  tr: '🇹🇷', nl: '🇳🇱', sv: '🇸🇪',
};

const INTEREST_TAGS = [
  'Travel', 'Photography', 'Cooking', 'Sports', 'Music', 'Movies',
  'Technology', 'Art', 'Reading', 'Gaming', 'Fashion', 'Nature',
  'Fitness', 'Business', 'Science', 'History', 'Literature', 'Dance',
];

const INTEREST_COLORS = [
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'bg-lime-500/20 text-lime-400 border-lime-500/30',
  'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'bg-green-500/20 text-green-400 border-green-500/30',
  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'bg-slate-500/20 text-slate-400 border-slate-500/30',
];

// ─── CEFR Progress levels for the bar ──────────────────────
const CEFR_LEVELS_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const CEFR_LEVEL_COLORS: Record<string, string> = {
  A1: 'from-emerald-600 to-emerald-400',
  A2: 'from-emerald-500 to-green-400',
  B1: 'from-blue-500 to-cyan-400',
  B2: 'from-cyan-500 to-blue-400',
  C1: 'from-purple-500 to-violet-400',
  C2: 'from-violet-500 to-fuchsia-400',
};

const CEFR_LEVEL_BG: Record<string, string> = {
  A1: 'bg-emerald-500/30',
  A2: 'bg-emerald-500/30',
  B1: 'bg-blue-500/30',
  B2: 'bg-cyan-500/30',
  C1: 'bg-purple-500/30',
  C2: 'bg-violet-500/30',
};

// ─── Rarity colors ─────────────────────────────────────────
const RARITY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  common: { bg: 'bg-gray-500/15', text: 'text-gray-400', border: 'border-gray-500/30', glow: '' },
  rare: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', glow: '' },
  epic: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-500/20 shadow-lg' },
  legendary: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20 shadow-lg' },
};

const RARITY_LABELS: Record<string, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

// ─── Activity type config ──────────────────────────────────
const ACTIVITY_TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  lesson: { icon: '📚', color: 'text-blue-400' },
  test: { icon: '📝', color: 'text-emerald-400' },
  room: { icon: '🎙️', color: 'text-purple-400' },
  match: { icon: '👥', color: 'text-cyan-400' },
  vocab: { icon: '🔤', color: 'text-amber-400' },
  streak: { icon: '🔥', color: 'text-orange-400' },
};

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

// ─── Mock Data ─────────────────────────────────────────────
function generateMockHeatmap() {
  const data: { date: string; count: number }[] = [];
  const now = new Date();
  // Seed for consistent render
  let seed = 42;
  const seededRandom = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 84; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      count: seededRandom() > 0.4 ? Math.floor(seededRandom() * 5) : 0,
    });
  }
  return data;
}

const MOCK_CERTIFICATES = [
  { id: '1', courseName: 'B1 English Grammar Mastery', score: 92, issuedAt: '2025-03-15', level: 'B1' },
  { id: '2', courseName: 'A2 Vocabulary & Reading', score: 88, issuedAt: '2025-02-01', level: 'A2' },
];

const MOCK_DATA = {
  stats: {
    lessons: 42,
    wordsLearned: 1280,
    hoursInRooms: 24,
    quizScore: 87,
    speakPartners: 8,
    posts: 15,
    certificates: 2,
    streak: 7,
    xp: 4250,
    following: 12,
    followers: 34,
  },
  badges: [
    { id: '1', name: 'First Steps', description: 'Complete your first lesson', icon: '🎓', rarity: 'common' as const, earnedAt: '2025-01-15' },
    { id: '2', name: 'Word Warrior', description: 'Learn 1000 words', icon: '📝', rarity: 'rare' as const, earnedAt: '2025-02-20' },
    { id: '3', name: 'Voice Pioneer', description: 'Join your first SpeakSpace room', icon: '🎙️', rarity: 'common' as const, earnedAt: '2025-01-20' },
    { id: '4', name: 'Week Warrior', description: '7-day learning streak', icon: '🔥', rarity: 'rare' as const, earnedAt: '2025-03-01' },
    { id: '5', name: 'Social Butterfly', description: 'Connect with 5 language partners', icon: '🦋', rarity: 'epic' as const, earnedAt: '2025-03-15' },
    { id: '6', name: 'CEFR Climber', description: 'Improve your CEFR level', icon: '📈', rarity: 'rare' as const, earnedAt: '2025-04-01' },
    { id: '7', name: 'Test Master', description: 'Score 90%+ on a test', icon: '🏆', rarity: 'epic' as const, earnedAt: '2025-04-10' },
    { id: '8', name: 'Polyglot', description: 'Learn 3+ languages', icon: '🌍', rarity: 'legendary' as const, earnedAt: null },
  ],
  activity: [
    { id: '1', type: 'lesson', title: 'Completed B1 Grammar Course', detail: 'Chapter 5: Conditionals', xp: 50, createdAt: '2025-05-28T14:30:00Z' },
    { id: '2', type: 'room', title: 'Joined SpeakSpace Room', detail: 'Intermediate Conversation Practice', xp: 30, createdAt: '2025-05-28T10:00:00Z' },
    { id: '3', type: 'vocab', title: 'Vocabulary Practice', detail: 'Learned 15 new words', xp: 25, createdAt: '2025-05-27T16:00:00Z' },
    { id: '4', type: 'test', title: 'CEFR Assessment', detail: 'B1 Listening - Score: 87%', xp: 100, createdAt: '2025-05-27T09:00:00Z' },
    { id: '5', type: 'streak', title: '7-Day Streak!', detail: 'Keep it going!', xp: 75, createdAt: '2025-05-26T00:00:00Z' },
    { id: '6', type: 'match', title: 'Speak Partner Match', detail: 'Paired with Maria S.', xp: 20, createdAt: '2025-05-25T15:00:00Z' },
  ],
  heatmap: generateMockHeatmap(),
};

// ─── Helper: format relative time ──────────────────────────
function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
  const [activeTab, setActiveTab] = useState('overview');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');

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

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // Compute CEFR progress index
  const cefrIndex = profile?.englishLevel
    ? CEFR_LEVELS_ORDER.indexOf(profile.englishLevel)
    : -1;

  // Heatmap month labels
  const heatmapMonthLabels = useMemo(() => {
    const months: { label: string; col: number }[] = [];
    const data = MOCK_DATA.heatmap;
    let lastMonth = '';
    for (let i = 0; i < data.length; i++) {
      const m = new Date(data[i].date).toLocaleDateString('en-US', { month: 'short' });
      if (m !== lastMonth) {
        months.push({ label: m, col: Math.floor(i / 7) });
        lastMonth = m;
      }
    }
    return months;
  }, []);

  // Filtered badges
  const filteredBadges = useMemo(() => {
    if (badgeFilter === 'all') return MOCK_DATA.badges;
    return MOCK_DATA.badges.filter((b) => b.rarity === badgeFilter);
  }, [badgeFilter]);

  // Stat items for the overview grid
  const statItems = useMemo(() => [
    { label: 'Lessons', value: MOCK_DATA.stats.lessons, icon: BookOpen, color: 'text-blue-400' },
    { label: 'Words Learned', value: MOCK_DATA.stats.wordsLearned, icon: Brain, color: 'text-emerald-400' },
    { label: 'Hours in Rooms', value: MOCK_DATA.stats.hoursInRooms, icon: Headphones, color: 'text-purple-400' },
    { label: 'Quiz Score', value: `${MOCK_DATA.stats.quizScore}%`, icon: Trophy, color: 'text-amber-400' },
    { label: 'Speak Partners', value: MOCK_DATA.stats.speakPartners, icon: Users, color: 'text-cyan-400' },
    { label: 'Posts', value: MOCK_DATA.stats.posts, icon: MessageSquare, color: 'text-pink-400' },
    { label: 'Certificates', value: MOCK_DATA.stats.certificates, icon: Award, color: 'text-yellow-400' },
  ], []);

  // Heatmap color based on count
  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-white/[0.04]';
    if (count === 1) return 'bg-emerald-900/60';
    if (count === 2) return 'bg-emerald-700/60';
    if (count === 3) return 'bg-emerald-500/60';
    return 'bg-emerald-400/70';
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

  // ─── EDIT MODE ────────────────────────────────────────────
  if (editing) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <section className="relative hero-pattern noise-overlay overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-blue w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
            <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          </div>
          <div className="container relative mx-auto px-4 py-12 md:py-16">
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
                    <Heart className="inline h-3.5 w-3.5 mr-1 text-blue-400" />
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
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // ─── VIEW MODE (Rich Profile) ─────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <main className="flex-1">
        {/* ─── Cover Image + Profile Header ─── */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-40 sm:h-52 md:h-60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-[#0F0A1E] to-purple-900/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1E] via-transparent to-transparent" />
            {/* Decorative orbs */}
            <div className="absolute top-4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>

          {/* Profile info overlapping the cover */}
          <div className="container relative mx-auto px-4 -mt-20 sm:-mt-24">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="relative">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name || 'User'}
                      className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-[#0F0A1E] shadow-2xl"
                    />
                  ) : (
                    <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-4xl font-bold text-white border-4 border-[#0F0A1E] shadow-2xl">
                      {(profile?.name || profile?.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  {/* Online indicator */}
                  <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 border-3 border-[#0F0A1E] shadow-lg shadow-emerald-500/50" />
                  {/* Level badge */}
                  {profile?.englishLevel && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 whitespace-nowrap">
                      {profile.englishLevel}
                    </span>
                  )}
                </div>

                {/* Name + info */}
                <div className="flex-1 text-center sm:text-left pb-1">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      {profile?.name || 'Anonymous User'}
                    </h1>
                    {profile?.emailVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium" title="Email Verified">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    )}
                    {getLevelBadge(profile?.englishLevel || null)}
                  </div>

                  {/* Bio */}
                  {profile?.bio && (
                    <p className="text-white/60 text-sm mt-1 max-w-lg">{profile.bio}</p>
                  )}

                  {/* Location + username */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm text-white/50">
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
                    <span className="flex items-center gap-1">
                      <span className="text-white/30">@</span>
                      {profile?.email?.split('@')[0] || 'user'}
                    </span>
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', getPlanBadgeClasses(profile?.plan))}>
                      {getPlanLabel(profile?.plan)}
                    </span>
                  </div>
                </div>

                {/* Edit Profile button */}
                <button
                  onClick={startEditing}
                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer backdrop-blur-sm"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-center sm:justify-start gap-6 mt-6 py-4 border-b border-white/[0.06]">
                <button className="flex flex-col items-center gap-0.5 hover:opacity-80 transition-opacity cursor-pointer">
                  <span className="text-white font-bold text-lg">{MOCK_DATA.stats.following}</span>
                  <span className="text-white/40 text-xs">Following</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 hover:opacity-80 transition-opacity cursor-pointer">
                  <span className="text-white font-bold text-lg">{MOCK_DATA.stats.followers}</span>
                  <span className="text-white/40 text-xs">Followers</span>
                </button>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-orange-400 font-bold text-lg flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    {MOCK_DATA.stats.streak}
                  </span>
                  <span className="text-white/40 text-xs">Streak</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-cyan-400 font-bold text-lg flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {MOCK_DATA.stats.xp.toLocaleString()}
                  </span>
                  <span className="text-white/40 text-xs">XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="container mx-auto px-4 mt-6">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'activity', label: 'Activity', icon: Zap },
                { id: 'certificates', label: 'Certificates', icon: Award },
                { id: 'badges', label: 'Badges', icon: Star },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex-1 justify-center',
                    activeTab === tab.id
                      ? 'bg-white/[0.08] text-white shadow-sm'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ─── Overview Tab ─── */}
            {activeTab === 'overview' && (
              <div className="space-y-6 pb-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {statItems.map((stat) => (
                    <div key={stat.label} className="glass-card p-4 flex flex-col items-center gap-2 text-center">
                      <stat.icon className={cn('h-5 w-5', stat.color)} />
                      <span className="text-white font-bold text-xl">{stat.value}</span>
                      <span className="text-white/40 text-xs">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Language Profile + CEFR Progress */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Language Profile */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                      <Languages className="h-4 w-4 text-blue-400" />
                      Language Profile
                    </h3>
                    {langProfile ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{LANGUAGE_FLAGS[langProfile.nativeLanguage] || '🌐'}</span>
                          <div>
                            <p className="text-xs text-white/40">Native Language</p>
                            <p className="text-sm text-white/80 font-medium">{LANGUAGES[langProfile.nativeLanguage] || langProfile.nativeLanguage}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 mb-1.5">Learning</p>
                          <div className="flex flex-wrap gap-1.5">
                            {langProfile.targetLanguages.map((lang) => (
                              <span key={lang} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400 text-xs font-medium">
                                <span>{LANGUAGE_FLAGS[lang] || '🌐'}</span>
                                {LANGUAGES[lang] || lang}
                              </span>
                            ))}
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

                  {/* CEFR Progress */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-400" />
                      CEFR Progress
                    </h3>
                    <div className="space-y-3">
                      {CEFR_LEVELS_ORDER.map((level, idx) => {
                        const isActive = idx <= cefrIndex;
                        const isCurrent = idx === cefrIndex;
                        return (
                          <div key={level} className="flex items-center gap-3">
                            <span className={cn(
                              'w-8 text-xs font-bold',
                              isCurrent ? 'text-white' : isActive ? 'text-white/60' : 'text-white/25'
                            )}>
                              {level}
                            </span>
                            <div className="flex-1 h-3 bg-white/[0.04] rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full transition-all duration-500',
                                  isActive
                                    ? `bg-gradient-to-r ${CEFR_LEVEL_COLORS[level]}`
                                    : 'bg-transparent'
                                )}
                                style={{ width: isActive ? '100%' : '0%' }}
                              />
                            </div>
                            {isCurrent && (
                              <span className="text-[10px] font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {cefrIndex === -1 && (
                      <p className="text-white/30 text-xs mt-3 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Take a CEFR test to set your level
                      </p>
                    )}
                  </div>
                </div>

                {/* Activity Heatmap */}
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    Activity Heatmap
                    <span className="text-white/30 text-xs font-normal ml-1">Last 12 weeks</span>
                  </h3>
                  <div className="overflow-x-auto">
                    {/* Month labels */}
                    <div className="flex mb-1 ml-8">
                      {heatmapMonthLabels.map((m, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-white/30"
                          style={{ position: 'relative', left: `${m.col * 13}px` }}
                        >
                          {m.label}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-0.5">
                      {/* Day labels */}
                      <div className="flex flex-col gap-0.5 mr-1">
                        {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                          <span key={i} className="text-[10px] text-white/25 h-[13px] flex items-center justify-end w-7">
                            {day}
                          </span>
                        ))}
                      </div>
                      {/* Grid cells */}
                      <div className="flex gap-[2px]">
                        {Array.from({ length: Math.ceil(MOCK_DATA.heatmap.length / 7) }).map((_, weekIdx) => (
                          <div key={weekIdx} className="flex flex-col gap-[2px]">
                            {Array.from({ length: 7 }).map((_, dayIdx) => {
                              const dataIdx = weekIdx * 7 + dayIdx;
                              const cell = dataIdx < MOCK_DATA.heatmap.length ? MOCK_DATA.heatmap[dataIdx] : null;
                              return (
                                <div
                                  key={dayIdx}
                                  className={cn(
                                    'w-[11px] h-[11px] rounded-[2px] transition-colors',
                                    cell ? getHeatmapColor(cell.count) : 'bg-transparent'
                                  )}
                                  title={cell ? `${cell.date}: ${cell.count} activities` : ''}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-2 mt-3 ml-8">
                      <span className="text-[10px] text-white/25">Less</span>
                      <div className="w-[11px] h-[11px] rounded-[2px] bg-white/[0.04]" />
                      <div className="w-[11px] h-[11px] rounded-[2px] bg-emerald-900/60" />
                      <div className="w-[11px] h-[11px] rounded-[2px] bg-emerald-700/60" />
                      <div className="w-[11px] h-[11px] rounded-[2px] bg-emerald-500/60" />
                      <div className="w-[11px] h-[11px] rounded-[2px] bg-emerald-400/70" />
                      <span className="text-[10px] text-white/25">More</span>
                    </div>
                  </div>
                </div>

                {/* Recent Badges */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-400" />
                      Recent Badges
                    </h3>
                    <button
                      onClick={() => setActiveTab('badges')}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      View All <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                    {MOCK_DATA.badges.filter((b) => b.earnedAt).slice(0, 5).map((badge) => {
                      const rarity = RARITY_COLORS[badge.rarity];
                      return (
                        <div
                          key={badge.id}
                          className={cn(
                            'flex flex-col items-center gap-2 p-3 rounded-xl border min-w-[90px] shrink-0 transition-all hover:scale-105',
                            rarity.bg, rarity.border, rarity.glow
                          )}
                        >
                          <span className="text-2xl">{badge.icon}</span>
                          <span className={cn('text-[10px] font-semibold text-center leading-tight', rarity.text)}>
                            {badge.name}
                          </span>
                          <span className={cn('text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full', rarity.bg, rarity.text, rarity.border)}>
                            {badge.rarity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Personal Info + Interests */}
                <div className="grid gap-4 md:grid-cols-2">
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

                  {/* Interests */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-blue-400" />
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
                </div>

                {/* Account Info */}
                <div className="glass-card p-5">
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
            )}

            {/* ─── Activity Tab ─── */}
            {activeTab === 'activity' && (
              <div className="space-y-3 pb-12">
                {MOCK_DATA.activity.map((item) => {
                  const config = ACTIVITY_TYPE_CONFIG[item.type] || { icon: '📋', color: 'text-white/50' };
                  return (
                    <div key={item.id} className="glass-card p-4 flex items-center gap-4 group hover:border-white/[0.1] transition-all">
                      {/* Icon */}
                      <div className={cn(
                        'h-10 w-10 rounded-xl flex items-center justify-center text-lg shrink-0',
                        item.type === 'lesson' ? 'bg-blue-500/15' :
                        item.type === 'test' ? 'bg-emerald-500/15' :
                        item.type === 'room' ? 'bg-purple-500/15' :
                        item.type === 'match' ? 'bg-cyan-500/15' :
                        item.type === 'vocab' ? 'bg-amber-500/15' :
                        'bg-orange-500/15'
                      )}>
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.title}</p>
                        <p className="text-xs text-white/40 truncate">{item.detail}</p>
                      </div>

                      {/* XP */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Zap className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="text-sm font-bold text-cyan-400">+{item.xp}</span>
                      </div>

                      {/* Timestamp */}
                      <span className="text-[10px] text-white/25 shrink-0 hidden sm:block">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>
                  );
                })}

                {/* Activity summary */}
                <div className="glass-card p-4 text-center">
                  <p className="text-white/30 text-xs">Showing recent activity. More history will appear as you continue learning.</p>
                </div>
              </div>
            )}

            {/* ─── Certificates Tab ─── */}
            {activeTab === 'certificates' && (
              <div className="space-y-4 pb-12">
                {MOCK_CERTIFICATES.length > 0 ? (
                  MOCK_CERTIFICATES.map((cert) => (
                    <div
                      key={cert.id}
                      className="glass-card p-5 relative overflow-hidden group hover:border-amber-500/30 transition-all"
                    >
                      {/* Gold border accent */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/60 via-yellow-400/60 to-amber-500/60" />

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Certificate icon */}
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                          <Award className="h-7 w-7 text-amber-400" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-white">{cert.courseName}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                              CEFR_LEVEL_BG[cert.level] || 'bg-white/10',
                              'text-white/70 border-white/10'
                            )}>
                              {cert.level}
                            </span>
                            <span className="text-xs text-white/40">
                              Issued {formatDate(cert.issuedAt)}
                            </span>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-400">{cert.score}%</div>
                            <div className="text-[10px] text-white/30 uppercase tracking-wider">Score</div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-1.5">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all cursor-pointer">
                              <Download className="h-3 w-3" />
                              Download
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs font-medium hover:bg-white/10 hover:text-white/70 transition-all cursor-pointer">
                              <Share2 className="h-3 w-3" />
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass-card p-8 text-center">
                    <Award className="h-12 w-12 text-white/20 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white/70 mb-1">No Certificates Yet</h3>
                    <p className="text-white/40 text-sm mb-4">Complete courses and tests to earn certificates.</p>
                    <a
                      href="/courses"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg shadow-blue-500/25"
                    >
                      <Sparkles className="h-4 w-4" />
                      Continue Learning
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* ─── Badges Tab ─── */}
            {activeTab === 'badges' && (
              <div className="space-y-4 pb-12">
                {/* Rarity Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="h-4 w-4 text-white/30" />
                  {['all', 'common', 'rare', 'epic', 'legendary'].map((rarity) => (
                    <button
                      key={rarity}
                      onClick={() => setBadgeFilter(rarity)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border',
                        badgeFilter === rarity
                          ? rarity === 'all'
                            ? 'bg-white/10 text-white border-white/20'
                            : cn(RARITY_COLORS[rarity]?.bg, RARITY_COLORS[rarity]?.text, RARITY_COLORS[rarity]?.border)
                          : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60'
                      )}
                    >
                      {rarity === 'all' ? 'All' : RARITY_LABELS[rarity]}
                    </button>
                  ))}
                </div>

                {/* Badge Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredBadges.map((badge) => {
                    const rarity = RARITY_COLORS[badge.rarity];
                    const earned = !!badge.earnedAt;
                    return (
                      <div
                        key={badge.id}
                        className={cn(
                          'glass-card p-4 flex flex-col items-center gap-2 text-center relative group transition-all hover:scale-[1.02]',
                          earned ? '' : 'opacity-40',
                          rarity.glow
                        )}
                      >
                        {/* Rarity border glow for legendary */}
                        {badge.rarity === 'legendary' && earned && (
                          <div className="absolute inset-0 rounded-xl border border-amber-500/20 group-hover:border-amber-500/40 transition-colors" />
                        )}
                        <span className="text-3xl">{badge.icon}</span>
                        <span className="text-sm font-semibold text-white">{badge.name}</span>
                        <p className="text-[10px] text-white/40 leading-tight">{badge.description}</p>
                        <span className={cn(
                          'text-[8px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border',
                          rarity.bg, rarity.text, rarity.border
                        )}>
                          {badge.rarity}
                        </span>
                        {earned ? (
                          <span className="text-[10px] text-white/30">
                            Earned {formatDate(badge.earnedAt!)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-white/20 flex items-center gap-0.5">
                            <Shield className="h-2.5 w-2.5" /> Locked
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {filteredBadges.length === 0 && (
                  <div className="glass-card p-8 text-center">
                    <Star className="h-10 w-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No badges found for this filter.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
