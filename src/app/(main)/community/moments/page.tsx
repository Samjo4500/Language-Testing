'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuthStore } from '@/lib/auth-store';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';
import {
  Heart,
  MessageCircle,
  Languages,
  Globe,
  Clock,
  Loader2,
  Send,
  ImagePlus,
  X,
  ChevronDown,
  ChevronUp,
  Trash2,
  Sparkles,
  CheckCircle2,
  Mail,
  Trophy,
  GraduationCap,
  MessageSquare,
  PenLine,
} from 'lucide-react';

// ─── Constants ─────────────────────────────────────────────
const LANGUAGES: Record<string, string> = {
  en: 'English', es: 'Spanish', fr: 'French', zh: 'Chinese',
  ja: 'Japanese', ko: 'Korean', de: 'German', pt: 'Portuguese',
  ar: 'Arabic', ru: 'Russian', it: 'Italian', hi: 'Hindi',
  tr: 'Turkish', nl: 'Dutch', sv: 'Swedish',
};

const MOMENT_TAGS = [
  { value: 'grammar', label: 'Grammar', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'vocabulary', label: 'Vocabulary', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { value: 'culture', label: 'Culture', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'pronunciation', label: 'Pronunciation', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { value: 'idioms', label: 'Idioms', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { value: 'tips', label: 'Tips', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { value: 'question', label: 'Question', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'progress', label: 'Progress', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
];

// ─── Types ─────────────────────────────────────────────────
interface MomentUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  englishLevel: string | null;
  interests: string[];
  isVerified: boolean;
  emailVerified: boolean;
  isProfileComplete: boolean;
}

interface CommentData {
  id: string;
  content: string;
  isCorrection: boolean;
  correctedText: string | null;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null };
}

interface MomentData {
  id: string;
  userId: string;
  content: string;
  imageUrl: string | null;
  audioUrl: string | null;
  language: string | null;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  createdAt: string;
  user: MomentUser;
  comments: CommentData[];
  translation?: string;
  translating?: boolean;
}

// ─── Verification Badges Component ─────────────────────────
function VerificationBadges({ user, size = 'sm' }: { user: MomentUser; size?: 'sm' | 'md' }) {
  const badges: { icon: React.ReactNode; label: string; color: string }[] = [];

  if (user.emailVerified) {
    badges.push({
      icon: <Mail className={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} />,
      label: 'Email Verified',
      color: 'bg-blue-500/20 text-blue-400',
    });
  }
  if (user.isProfileComplete) {
    badges.push({
      icon: <CheckCircle2 className={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} />,
      label: 'Profile Complete',
      color: 'bg-emerald-500/20 text-emerald-400',
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {badges.map((badge, i) => (
        <span
          key={i}
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5',
            size === 'sm' ? 'text-[9px]' : 'text-[10px]',
            badge.color
          )}
          title={badge.label}
        >
          {badge.icon}
        </span>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function MomentsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const mounted = useHydrated();
  const router = useRouter();
  const isAuth = mounted && isAuthenticated;

  const [moments, setMoments] = useState<MomentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Create form
  const [newContent, setNewContent] = useState('');
  const [newLanguage, setNewLanguage] = useState('en');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Comment state per moment
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [correctionMode, setCorrectionMode] = useState<Record<string, boolean>>({});
  const [correctionText, setCorrectionText] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);

  // Translate state
  const [translating, setTranslating] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Fetch moments
  const fetchMoments = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(`/api/community/moments?page=${pageNum}&limit=20`, { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        const newMoments = data.moments || [];
        if (append) {
          setMoments((prev) => [...prev, ...newMoments]);
        } else {
          setMoments(newMoments);
        }
        setHasMore(pageNum < data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Fetch moments error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (isAuth) fetchMoments(1);
    else setLoading(false);
  }, [isAuth, fetchMoments]);

  // Create moment
  const handleCreate = async () => {
    if (!newContent.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/community/moments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          content: newContent,
          language: newLanguage,
          tags: newTags,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMoments((prev) => [data.moment, ...prev]);
        setNewContent('');
        setNewTags([]);
        setShowCreateForm(false);
      }
    } catch (err) {
      console.error('Create moment error:', err);
    } finally {
      setCreating(false);
    }
  };

  // Toggle like
  const handleLike = async (momentId: string) => {
    try {
      const res = await fetch(`/api/community/moments/${momentId}/like`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (res.ok) {
        const data = await res.json();
        setMoments((prev) =>
          prev.map((m) =>
            m.id === momentId
              ? { ...m, isLikedByMe: data.liked, likesCount: data.likesCount }
              : m
          )
        );
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // Delete moment
  const handleDelete = async (momentId: string) => {
    try {
      const res = await fetch(`/api/community/moments/${momentId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        setMoments((prev) => prev.filter((m) => m.id !== momentId));
      }
    } catch (err) {
      console.error('Delete moment error:', err);
    }
  };

  // Toggle comments
  const toggleComments = (momentId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(momentId)) next.delete(momentId);
      else next.add(momentId);
      return next;
    });
  };

  // Submit comment
  const handleComment = async (momentId: string) => {
    const content = commentInputs[momentId]?.trim();
    if (!content) return;
    setSubmittingComment(momentId);

    try {
      const isCorrection = correctionMode[momentId] || false;
      const body: Record<string, unknown> = { content };
      if (isCorrection) {
        body.isCorrection = true;
        body.correctedText = correctionText[momentId] || '';
      }

      const res = await fetch(`/api/community/moments/${momentId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setMoments((prev) =>
          prev.map((m) =>
            m.id === momentId
              ? {
                  ...m,
                  commentsCount: m.commentsCount + 1,
                  comments: [...m.comments, data.comment],
                }
              : m
          )
        );
        setCommentInputs((prev) => ({ ...prev, [momentId]: '' }));
        setCorrectionMode((prev) => ({ ...prev, [momentId]: false }));
        setCorrectionText((prev) => ({ ...prev, [momentId]: '' }));
      }
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmittingComment(null);
    }
  };

  // Translate
  const handleTranslate = async (momentId: string) => {
    if (translations[momentId]) {
      setTranslations((prev) => {
        const next = { ...prev };
        delete next[momentId];
        return next;
      });
      return;
    }

    setTranslating(momentId);
    try {
      const res = await fetch(`/api/community/moments/${momentId}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ targetLanguage: 'en' }),
      });
      if (res.ok) {
        const data = await res.json();
        setTranslations((prev) => ({ ...prev, [momentId]: data.translatedText }));
      }
    } catch (err) {
      console.error('Translate error:', err);
    } finally {
      setTranslating(null);
    }
  };

  // Toggle tag
  const toggleTag = (tag: string) => {
    setNewTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
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
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
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
            <p className="text-white/50 text-sm mb-6">Sign in to share your language journey.</p>
            <a href="/login">
              <button className="w-full rounded-xl py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium text-sm cursor-pointer">
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

        <div className="container relative mx-auto px-4 py-8 md:py-12 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full glass-light px-5 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">Moments</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Share Your <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Language Journey</span>
            </h1>
            <p className="mt-3 text-white/50 text-sm max-w-xl mx-auto">
              Post tips, ask questions, share cultural insights, and connect with fellow learners.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <a href="/community" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/25 transition-all">
                <Globe className="h-4 w-4" />
                Find Partners
              </a>
              <a href="/community/chatroom" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 transition-all">
                <MessageSquare className="h-4 w-4" />
                Chatroom
              </a>
            </div>
          </div>

          {/* Create Post */}
          <div className="glass-card p-4 mb-6">
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full text-left px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/30 text-sm hover:bg-white/8 hover:text-white/50 transition-all cursor-pointer"
              >
                Share a language moment...
              </button>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value.slice(0, 1000))}
                  placeholder="What's on your mind? Share a grammar tip, cultural insight, or ask a question..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 placeholder:text-white/30 resize-none"
                  autoFocus
                />
                <p className="text-white/30 text-xs">{newContent.length}/1000</p>

                {/* Language Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-white/50">Language:</label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500/50"
                  >
                    {Object.entries(LANGUAGES).map(([code, name]) => (
                      <option key={code} value={code} className="bg-[#1a1f36]">{name}</option>
                    ))}
                  </select>
                </div>

                {/* Tag Selector */}
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Tags:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {MOMENT_TAGS.map((tag) => (
                      <button
                        key={tag.value}
                        onClick={() => toggleTag(tag.value)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border',
                          newTags.includes(tag.value)
                            ? tag.color
                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'
                        )}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs hover:bg-white/10 transition-all cursor-pointer">
                      <ImagePlus className="h-3.5 w-3.5" />
                      Photo
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewContent('');
                        setNewTags([]);
                      }}
                      className="px-3 py-1.5 rounded-lg text-white/40 text-xs hover:text-white/60 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreate}
                      disabled={creating || !newContent.trim()}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-medium hover:from-purple-500 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feed */}
          {moments.length === 0 && !loading ? (
            <div className="glass-card p-12 text-center">
              <Sparkles className="h-10 w-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm">No moments yet.</p>
              <p className="text-white/30 text-xs mt-1">Be the first to share your language journey!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {moments.map((moment) => (
                <div key={moment.id} className="glass-card p-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      {moment.user.avatarUrl ? (
                        <img
                          src={moment.user.avatarUrl}
                          alt={moment.user.name}
                          className="h-10 w-10 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-sm font-bold text-white">
                          {moment.user.name[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium text-sm truncate">{moment.user.name}</p>
                        {moment.user.englishLevel && (
                          <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                            {moment.user.englishLevel}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <VerificationBadges user={moment.user} />
                        <span className="text-white/30 text-xs flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatTimeAgo(moment.createdAt)}
                        </span>
                      </div>
                    </div>
                    {user?.userId === moment.userId && (
                      <button
                        onClick={() => handleDelete(moment.id)}
                        className="text-white/20 hover:text-red-400 transition-colors cursor-pointer p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mt-3">
                    <p className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{moment.content}</p>
                  </div>

                  {/* Translation */}
                  {translations[moment.id] && (
                    <div className="mt-2 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <p className="text-xs text-cyan-400/70 mb-1 flex items-center gap-1">
                        <Languages className="h-3 w-3" />
                        Translation
                      </p>
                      <p className="text-white/60 text-sm">{translations[moment.id]}</p>
                    </div>
                  )}

                  {/* Image */}
                  {moment.imageUrl && (
                    <div className="mt-3">
                      <img src={moment.imageUrl} alt="Moment" className="rounded-xl max-h-64 w-full object-cover" />
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {moment.language && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-medium border border-purple-500/20">
                        {LANGUAGES[moment.language] || moment.language}
                      </span>
                    )}
                    {moment.tags.map((tag) => {
                      const tagDef = MOMENT_TAGS.find((t) => t.value === tag);
                      return (
                        <span
                          key={tag}
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-medium border',
                            tagDef ? tagDef.color : 'bg-white/5 text-white/40 border-white/10'
                          )}
                        >
                          {tagDef?.label || tag}
                        </span>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleLike(moment.id)}
                      className={cn(
                        'flex items-center gap-1.5 text-xs transition-all cursor-pointer',
                        moment.isLikedByMe ? 'text-red-400' : 'text-white/40 hover:text-red-400'
                      )}
                    >
                      <Heart className={cn('h-4 w-4', moment.isLikedByMe && 'fill-current')} />
                      {moment.likesCount > 0 && <span>{moment.likesCount}</span>}
                    </button>
                    <button
                      onClick={() => toggleComments(moment.id)}
                      className="flex items-center gap-1.5 text-xs text-white/40 hover:text-blue-400 transition-all cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {moment.commentsCount > 0 && <span>{moment.commentsCount}</span>}
                    </button>
                    <button
                      onClick={() => handleTranslate(moment.id)}
                      disabled={translating === moment.id}
                      className="flex items-center gap-1.5 text-xs text-white/40 hover:text-cyan-400 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {translating === moment.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Languages className="h-3.5 w-3.5" />
                      )}
                      {translations[moment.id] ? 'Hide' : 'Translate'}
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments.has(moment.id) && (
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
                      {/* Existing comments */}
                      {moment.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {comment.user.name[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/70">
                              <span className="font-medium text-white/90">{comment.user.name}</span>
                              {' '}
                              {comment.isCorrection ? (
                                <span>
                                  <span className="line-through text-red-400/70">{comment.correctedText}</span>
                                  {' → '}
                                  <span className="text-emerald-400">{comment.content}</span>
                                </span>
                              ) : (
                                comment.content
                              )}
                            </p>
                            <span className="text-white/20 text-[10px]">{formatTimeAgo(comment.createdAt)}</span>
                          </div>
                        </div>
                      ))}

                      {/* View all comments */}
                      {moment.commentsCount > 3 && (
                        <button className="text-xs text-white/30 hover:text-white/50 transition-colors cursor-pointer">
                          View all {moment.commentsCount} comments
                        </button>
                      )}

                      {/* Comment Input */}
                      <div className="flex items-start gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {(user?.name || 'U')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <input
                            value={commentInputs[moment.id] || ''}
                            onChange={(e) => setCommentInputs((prev) => ({ ...prev, [moment.id]: e.target.value }))}
                            placeholder={correctionMode[moment.id] ? 'Type the corrected version...' : 'Write a comment...'}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500/50 placeholder:text-white/30"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleComment(moment.id);
                              }
                            }}
                          />
                          {correctionMode[moment.id] && (
                            <input
                              value={correctionText[moment.id] || ''}
                              onChange={(e) => setCorrectionText((prev) => ({ ...prev, [moment.id]: e.target.value }))}
                              placeholder="Original text being corrected..."
                              className="w-full bg-red-500/5 border border-red-500/20 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-red-500/50 placeholder:text-white/30"
                            />
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCorrectionMode((prev) => ({ ...prev, [moment.id]: !prev[moment.id] }))}
                              className={cn(
                                'text-[10px] px-2 py-0.5 rounded transition-all cursor-pointer',
                                correctionMode[moment.id]
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'text-white/30 hover:text-white/50'
                              )}
                            >
                              <PenLine className="h-2.5 w-2.5 inline mr-0.5" />
                              Correction
                            </button>
                            <button
                              onClick={() => handleComment(moment.id)}
                              disabled={submittingComment === moment.id || !commentInputs[moment.id]?.trim()}
                              className="ml-auto text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submittingComment === moment.id ? <Loader2 className="h-2.5 w-2.5 animate-spin inline" /> : 'Send'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="text-center py-4">
                  <button
                    onClick={() => {
                      const nextPage = page + 1;
                      setPage(nextPage);
                      fetchMoments(nextPage, true);
                    }}
                    disabled={loadingMore}
                    className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 hover:text-white/70 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingMore ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
