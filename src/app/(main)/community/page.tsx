'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';
import {
  Globe,
  Search,
  Send,
  Check,
  X,
  Users,
  MessageCircle,
  ArrowRight,
  UserPlus,
  Clock,
  Loader2,
  ChevronDown,
  Languages,
  Sparkles,
  Filter,
  Wifi,
  Mail,
} from 'lucide-react';

// ─── Language data ─────────────────────────────────────────
const LANGUAGES: Record<string, string> = {
  en: 'English', es: 'Spanish', fr: 'French', zh: 'Chinese',
  ja: 'Japanese', ko: 'Korean', de: 'German', pt: 'Portuguese',
  ar: 'Arabic', ru: 'Russian', it: 'Italian', hi: 'Hindi',
  tr: 'Turkish', nl: 'Dutch', sv: 'Swedish',
};

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China',
  'Colombia', 'Croatia', 'Cuba', 'Czech Republic', 'Denmark',
  'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 'Finland', 'France',
  'Germany', 'Ghana', 'Greece', 'Hungary', 'Iceland', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica',
  'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia',
  'Lebanon', 'Lithuania', 'Malaysia', 'Mexico', 'Mongolia', 'Morocco',
  'Myanmar', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway',
  'Pakistan', 'Panama', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia',
  'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka',
  'Sweden', 'Switzerland', 'Taiwan', 'Tanzania', 'Thailand', 'Tunisia',
  'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam',
  'Zambia', 'Zimbabwe',
];

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'native', label: 'Native' },
];

// ─── Types ─────────────────────────────────────────────────
interface LanguageProfile {
  id: string;
  userId: string;
  nativeLanguage: string;
  targetLanguages: string[];
  proficiencyLevel: string;
  bio: string | null;
  timezone: string | null;
  avatarUrl: string | null;
  isOnline: boolean;
  lastSeenAt: string;
  isDiscoverable: boolean;
  userName?: string;
}

interface Partner {
  id: string;
  userId: string;
  userName: string;
  nativeLanguage: string;
  targetLanguages: string[];
  proficiencyLevel: string;
  bio: string | null;
  isOnline: boolean;
  lastSeenAt: string;
  hasPendingRequest: boolean;
  country: string | null;
  gender: string | null;
  interests: string[];
  isVerified: boolean;
  emailVerified: boolean;
  isProfileComplete: boolean;
}

interface PartnerRequestItem {
  id: string;
  message: string | null;
  status: string;
  createdAt: string;
  partner: {
    userId: string;
    userName: string;
    nativeLanguage: string;
    targetLanguages: string[];
    isOnline: boolean;
  };
}

interface Conversation {
  id: string;
  partner: {
    userId: string;
    userName: string;
    nativeLanguage: string;
    targetLanguages: string[];
    isOnline: boolean;
    avatarUrl: string | null;
  };
  lastMessage: {
    id: string;
    content: string;
    type: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  lastMessageAt: string;
}

// ─── Main Component ────────────────────────────────────────
export default function CommunityPage() {
  const { user, isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const router = useRouter();
  const isAuth = mounted && isAuthenticated;

  const [profile, setProfile] = useState<LanguageProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'partners'>('discover');

  // Profile form state
  const [nativeLanguage, setNativeLanguage] = useState('en');
  const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
  const [proficiencyLevel, setProficiencyLevel] = useState('intermediate');
  const [bio, setBio] = useState('');
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [saving, setSaving] = useState(false);

  // Discover state
  const [partners, setPartners] = useState<Partner[]>([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [filterNativeLang, setFilterNativeLang] = useState('');
  const [filterTargetLang, setFilterTargetLang] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterOnlineOnly, setFilterOnlineOnly] = useState(false);
  const [filterProficiency, setFilterProficiency] = useState('');

  // Requests state
  const [sentRequests, setSentRequests] = useState<PartnerRequestItem[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<PartnerRequestItem[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);

  // Sending request state
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/community/profile', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
          setNativeLanguage(data.profile.nativeLanguage);
          setTargetLanguages(data.profile.targetLanguages);
          setProficiencyLevel(data.profile.proficiencyLevel);
          setBio(data.profile.bio || '');
          setIsDiscoverable(data.profile.isDiscoverable);
        }
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

  // Fetch discover partners
  const fetchPartners = useCallback(async () => {
    setDiscoverLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterNativeLang) params.set('nativeLang', filterNativeLang);
      if (filterTargetLang) params.set('targetLang', filterTargetLang);
      if (filterCountry) params.set('country', filterCountry);
      if (filterGender && filterGender !== 'any') params.set('gender', filterGender);
      if (filterOnlineOnly) params.set('onlineOnly', 'true');
      if (filterProficiency) params.set('proficiencyLevel', filterProficiency);
      const res = await fetch(`/api/community/discover?${params.toString()}`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setPartners(data.partners || []);
      }
    } catch (err) {
      console.error('Fetch partners error:', err);
    } finally {
      setDiscoverLoading(false);
    }
  }, [filterNativeLang, filterTargetLang, filterCountry, filterGender, filterOnlineOnly, filterProficiency]);

  useEffect(() => {
    if (profile && activeTab === 'discover') fetchPartners();
  }, [profile, activeTab, fetchPartners]);

  // Fetch requests
  const fetchRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const res = await fetch('/api/community/requests', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setSentRequests(data.sent || []);
        setReceivedRequests(data.received || []);
      }
    } catch (err) {
      console.error('Fetch requests error:', err);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile && activeTab === 'requests') fetchRequests();
  }, [profile, activeTab, fetchRequests]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    setConversationsLoading(true);
    try {
      const res = await fetch('/api/community/conversations', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile && activeTab === 'partners') fetchConversations();
  }, [profile, activeTab, fetchConversations]);

  // Save profile
  const handleSaveProfile = async () => {
    if (targetLanguages.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch('/api/community/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          nativeLanguage,
          targetLanguages,
          proficiencyLevel,
          bio,
          isDiscoverable,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Save profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Send partner request
  const handleSendRequest = async (toUserId: string) => {
    setSendingTo(toUserId);
    try {
      const res = await fetch('/api/community/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ toUserId }),
      });
      if (res.ok) {
        fetchPartners(); // Refresh to update hasPendingRequest
      }
    } catch (err) {
      console.error('Send request error:', err);
    } finally {
      setSendingTo(null);
    }
  };

  // Accept/decline request
  const handleRequestAction = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const res = await fetch('/api/community/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ requestId, action }),
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch (err) {
      console.error('Handle request error:', err);
    }
  };

  // Toggle target language
  const toggleTargetLanguage = (code: string) => {
    setTargetLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  };

  // Format time ago
  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
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
            <Globe className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Join the Community</h2>
            <p className="text-white/50 text-sm mb-6">
              Sign in to find language partners and start practicing together.
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

  // Profile setup form
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <section className="relative hero-pattern noise-overlay overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb orb-blue w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
            <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
          </div>
          <div className="container relative mx-auto px-4 py-16 md:py-24">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-4">
                  <Languages className="h-4 w-4 text-blue-300" />
                  <span className="text-sm text-blue-200 font-medium">Language Partners</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  Create Your <span className="gradient-text">Language Profile</span>
                </h1>
                <p className="mt-3 text-white/50 text-sm">
                  Tell us about yourself so we can find you the best language partners.
                </p>
              </div>

              <div className="glass-card p-6 space-y-6">
                {/* Native Language */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Your Native Language
                  </label>
                  <select
                    value={nativeLanguage}
                    onChange={(e) => setNativeLanguage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
                  >
                    {Object.entries(LANGUAGES).map(([code, name]) => (
                      <option key={code} value={code} className="bg-[#1a1f36]">
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Languages */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Languages You Want to Learn
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(LANGUAGES)
                      .filter(([code]) => code !== nativeLanguage)
                      .map(([code, name]) => (
                        <button
                          key={code}
                          onClick={() => toggleTargetLanguage(code)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border',
                            targetLanguages.includes(code)
                              ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
                          )}
                        >
                          {name}
                        </button>
                      ))}
                  </div>
                  {targetLanguages.length === 0 && (
                    <p className="text-red-400/70 text-xs mt-2">Please select at least one language</p>
                  )}
                </div>

                {/* Proficiency Level */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Your Proficiency Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PROFICIENCY_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setProficiencyLevel(level.value)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border',
                          proficiencyLevel === level.value
                            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
                        )}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    About You (optional)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 500))}
                    placeholder="Tell potential partners about yourself and your language goals..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 placeholder:text-white/30 resize-none"
                  />
                  <p className="text-white/30 text-xs mt-1">{bio.length}/500</p>
                </div>

                {/* Discoverable toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">Appear in partner search</p>
                    <p className="text-xs text-white/40">Let others find and send you requests</p>
                  </div>
                  <button
                    onClick={() => setIsDiscoverable(!isDiscoverable)}
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors cursor-pointer',
                      isDiscoverable ? 'bg-blue-500' : 'bg-white/10'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                        isDiscoverable ? 'translate-x-5.5' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                </div>

                {/* Save */}
                <button
                  onClick={handleSaveProfile}
                  disabled={saving || targetLanguages.length === 0}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Create Profile
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Main community page with tabs
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <section className="relative hero-pattern noise-overlay overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-blue w-[400px] h-[400px] -top-20 -right-20 animate-float-slow" />
          <div className="orb orb-cyan w-[300px] h-[300px] bottom-0 left-1/4 animate-float-reverse" />
        </div>

        <div className="container relative mx-auto px-4 py-12 md:py-16">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-4">
              <Languages className="h-4 w-4 text-blue-300" />
              <span className="text-sm text-blue-200 font-medium">Community</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Find Your <span className="gradient-text">Language Partner</span>
            </h1>
            <p className="mt-3 text-white/50 text-sm max-w-xl mx-auto">
              Connect with native speakers, practice together, and join our global chatroom.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <a href="/community/moments" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 text-sm font-medium hover:bg-purple-500/25 transition-all">
                <Sparkles className="h-4 w-4" />
                Moments
              </a>
              <a href="/community/chatroom" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/25 transition-all">
                <Globe className="h-4 w-4" />
                Global Chatroom
              </a>
            </div>
          </div>

          {/* Tabs with distinct colors */}
          <div className="max-w-5xl mx-auto">
            <div className="flex gap-1 mb-6 p-1 glass-light rounded-xl max-w-md mx-auto">
              {(['discover', 'requests', 'partners'] as const).map((tab) => {
                const icons = { discover: Search, requests: UserPlus, partners: MessageCircle };
                const labels = { discover: 'Discover', requests: 'Requests', partners: 'My Partners' };
                const tabColors = {
                  discover: { active: 'bg-blue-500/20 border border-blue-500/30 text-blue-300', icon: 'text-blue-400' },
                  requests: { active: 'bg-amber-500/20 border border-amber-500/30 text-amber-300', icon: 'text-amber-400' },
                  partners: { active: 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300', icon: 'text-emerald-400' },
                };
                const Icon = icons[tab];
                const tabColor = tabColors[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer',
                      activeTab === tab
                        ? tabColor.active
                        : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                    )}
                  >
                    <Icon className={cn('h-3.5 w-3.5', activeTab === tab ? tabColor.icon : '')} />
                    {labels[tab]}
                    {tab === 'requests' && receivedRequests.filter((r) => r.status === 'pending').length > 0 && (
                      <span className="flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {receivedRequests.filter((r) => r.status === 'pending').length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ─── Discover Tab ─────────────────────────────── */}
            {activeTab === 'discover' && (
              <div>
                {/* Filter Bar */}
                <div className="glass-card p-4 mb-6 space-y-3">
                  <div className="flex items-center gap-2 text-white/60">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Filters</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-white/50">Speaks:</label>
                      <select
                        value={filterNativeLang}
                        onChange={(e) => setFilterNativeLang(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500/50"
                      >
                        <option value="" className="bg-[#1a1f36]">Any</option>
                        {Object.entries(LANGUAGES).map(([code, name]) => (
                          <option key={code} value={code} className="bg-[#1a1f36]">{name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-white/50">Learning:</label>
                      <select
                        value={filterTargetLang}
                        onChange={(e) => setFilterTargetLang(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500/50"
                      >
                        <option value="" className="bg-[#1a1f36]">Any</option>
                        {Object.entries(LANGUAGES).map(([code, name]) => (
                          <option key={code} value={code} className="bg-[#1a1f36]">{name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-white/50">Country:</label>
                      <select
                        value={filterCountry}
                        onChange={(e) => setFilterCountry(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500/50 max-w-[120px]"
                      >
                        <option value="" className="bg-[#1a1f36]">Any</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c} className="bg-[#1a1f36]">{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-white/50">Gender:</label>
                      <select
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500/50"
                      >
                        <option value="" className="bg-[#1a1f36]">Any</option>
                        <option value="male" className="bg-[#1a1f36]">Male</option>
                        <option value="female" className="bg-[#1a1f36]">Female</option>
                        <option value="non-binary" className="bg-[#1a1f36]">Non-binary</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-white/50">Level:</label>
                      <select
                        value={filterProficiency}
                        onChange={(e) => setFilterProficiency(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500/50"
                      >
                        <option value="" className="bg-[#1a1f36]">Any</option>
                        <option value="beginner" className="bg-[#1a1f36]">Beginner</option>
                        <option value="intermediate" className="bg-[#1a1f36]">Intermediate</option>
                        <option value="advanced" className="bg-[#1a1f36]">Advanced</option>
                        <option value="native" className="bg-[#1a1f36]">Native</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-white/50 flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        Online:
                      </label>
                      <button
                        onClick={() => setFilterOnlineOnly(!filterOnlineOnly)}
                        className={cn(
                          'relative w-9 h-5 rounded-full transition-colors cursor-pointer',
                          filterOnlineOnly ? 'bg-emerald-500' : 'bg-white/10'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
                            filterOnlineOnly ? 'translate-x-4' : 'translate-x-0.5'
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {discoverLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                  </div>
                ) : partners.length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <Users className="h-10 w-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/70 text-base font-semibold mb-1">Be the first to join!</p>
                    <p className="text-white/40 text-sm mb-4">Our community is growing. Complete your language profile to help others find you as a practice partner.</p>
                    <Link href="/profile">
                      <button className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 cursor-pointer">
                        Complete Your Profile
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {partners.map((partner) => (
                      <div key={partner.userId} className="glass-card p-5 hover:border-white/15 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-white">
                              {partner.userName[0].toUpperCase()}
                            </div>
                            {partner.isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#0F0A1E]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-white font-medium text-sm truncate">{partner.userName}</p>
                              {partner.emailVerified && (
                                <span className="inline-flex items-center rounded-full px-1 py-0.5 bg-blue-500/20 text-blue-400" title="Email Verified">
                                  <Mail className="h-2.5 w-2.5" />
                                </span>
                              )}
                              {partner.isProfileComplete && (
                                <span className="inline-flex items-center rounded-full px-1 py-0.5 bg-emerald-500/20 text-emerald-400" title="Profile Complete">
                                  <Check className="h-2.5 w-2.5" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-emerald-400">
                                {LANGUAGES[partner.nativeLanguage] || partner.nativeLanguage}
                              </span>
                              <ArrowRight className="h-2.5 w-2.5 text-white/30" />
                              <span className="text-xs text-blue-400">
                                {partner.targetLanguages.map((l) => LANGUAGES[l] || l).join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {partner.bio && (
                          <p className="text-white/40 text-xs mt-3 line-clamp-2">{partner.bio}</p>
                        )}

                        {/* Interest Tags */}
                        {partner.interests && partner.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {partner.interests.slice(0, 4).map((interest) => (
                              <span key={interest} className="px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-[10px] font-medium border border-purple-500/20">
                                {interest}
                              </span>
                            ))}
                            {partner.interests.length > 4 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-white/30 text-[10px]">
                                +{partner.interests.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-1 text-xs text-white/30">
                            <Clock className="h-3 w-3" />
                            {partner.isOnline ? 'Online now' : formatTimeAgo(partner.lastSeenAt)}
                          </div>

                          {partner.hasPendingRequest ? (
                            <span className="flex items-center gap-1 text-xs text-yellow-400/70">
                              <Clock className="h-3 w-3" />
                              Pending
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendRequest(partner.userId)}
                              disabled={sendingTo === partner.userId}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {sendingTo === partner.userId ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <UserPlus className="h-3 w-3" />
                              )}
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Requests Tab ─────────────────────────────── */}
            {activeTab === 'requests' && (
              <div>
                {requestsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Received Requests */}
                    <div>
                      <h3 className="text-sm font-medium text-white/70 mb-3 flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-blue-400" />
                        Received Requests
                        {receivedRequests.filter((r) => r.status === 'pending').length > 0 && (
                          <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {receivedRequests.filter((r) => r.status === 'pending').length}
                          </span>
                        )}
                      </h3>
                      {receivedRequests.length === 0 ? (
                        <div className="glass-card p-6 text-center">
                          <p className="text-white/40 text-sm">No requests received yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {receivedRequests.map((req) => (
                            <div key={req.id} className="glass-card p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-white shrink-0">
                                  {req.partner.userName[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium text-sm">{req.partner.userName}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs text-emerald-400">
                                      {LANGUAGES[req.partner.nativeLanguage] || req.partner.nativeLanguage}
                                    </span>
                                    <ArrowRight className="h-2.5 w-2.5 text-white/30" />
                                    <span className="text-xs text-blue-400">
                                      {req.partner.targetLanguages.map((l) => LANGUAGES[l] || l).join(', ')}
                                    </span>
                                  </div>
                                  {req.message && (
                                    <p className="text-white/40 text-xs mt-1">&ldquo;{req.message}&rdquo;</p>
                                  )}
                                </div>
                                <div className="shrink-0">
                                  {req.status === 'pending' ? (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleRequestAction(req.id, 'accept')}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition-all cursor-pointer"
                                      >
                                        <Check className="h-3 w-3" />
                                        Accept
                                      </button>
                                      <button
                                        onClick={() => handleRequestAction(req.id, 'decline')}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
                                      >
                                        <X className="h-3 w-3" />
                                        Decline
                                      </button>
                                    </div>
                                  ) : (
                                    <span className={cn(
                                      'text-xs px-2 py-1 rounded-full',
                                      req.status === 'accepted'
                                        ? 'bg-emerald-500/15 text-emerald-400'
                                        : 'bg-white/5 text-white/30'
                                    )}>
                                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sent Requests */}
                    <div>
                      <h3 className="text-sm font-medium text-white/70 mb-3 flex items-center gap-2">
                        <Send className="h-4 w-4 text-blue-400" />
                        Sent Requests
                      </h3>
                      {sentRequests.length === 0 ? (
                        <div className="glass-card p-6 text-center">
                          <p className="text-white/40 text-sm">You haven&apos;t sent any requests yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {sentRequests.map((req) => (
                            <div key={req.id} className="glass-card p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-white shrink-0">
                                  {req.partner.userName[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium text-sm">{req.partner.userName}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs text-emerald-400">
                                      {LANGUAGES[req.partner.nativeLanguage] || req.partner.nativeLanguage}
                                    </span>
                                    <ArrowRight className="h-2.5 w-2.5 text-white/30" />
                                    <span className="text-xs text-blue-400">
                                      {req.partner.targetLanguages.map((l) => LANGUAGES[l] || l).join(', ')}
                                    </span>
                                  </div>
                                </div>
                                <span className={cn(
                                  'text-xs px-2 py-1 rounded-full',
                                  req.status === 'pending'
                                    ? 'bg-yellow-500/15 text-yellow-400'
                                    : req.status === 'accepted'
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : 'bg-white/5 text-white/30'
                                )}>
                                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── My Partners Tab ──────────────────────────── */}
            {activeTab === 'partners' && (
              <div>
                {conversationsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <MessageCircle className="h-10 w-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/50 text-sm">No conversations yet.</p>
                    <p className="text-white/30 text-xs mt-1">
                      Find a partner and start chatting!
                    </p>
                    <button
                      onClick={() => setActiveTab('discover')}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-500/25 transition-all cursor-pointer"
                    >
                      <Search className="h-3 w-3" />
                      Find Partners
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => router.push(`/community/chat/${conv.id}`)}
                        className="w-full glass-card p-4 hover:border-white/15 transition-all text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-white">
                              {conv.partner.userName[0].toUpperCase()}
                            </div>
                            {conv.partner.isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#0F0A1E]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-white font-medium text-sm">{conv.partner.userName}</p>
                              <span className="text-white/30 text-xs">
                                {conv.lastMessage ? formatTimeAgo(conv.lastMessage.createdAt) : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-emerald-400">
                                {LANGUAGES[conv.partner.nativeLanguage] || conv.partner.nativeLanguage}
                              </span>
                              <ArrowRight className="h-2.5 w-2.5 text-white/30" />
                              <span className="text-xs text-blue-400">
                                {conv.partner.targetLanguages.map((l) => LANGUAGES[l] || l).join(', ')}
                              </span>
                            </div>
                            {conv.lastMessage && (
                              <p className="text-white/40 text-xs mt-1 truncate">
                                {conv.lastMessage.type === 'system'
                                  ? '🤝 ' + conv.lastMessage.content
                                  : conv.lastMessage.content}
                              </p>
                            )}
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-blue-500 text-[10px] font-bold text-white shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
