'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft, BarChart3, BookOpen, Headphones, Mic, PenTool,
  Award, ChevronDown, ChevronUp, Download, Share2, Shield,
  Sparkles, Star, TrendingUp, Target, Clock, RefreshCw,
  Lock, Crown, CheckCircle2, AlertCircle, Zap, ArrowRight,
  MessageSquare, Lightbulb, Rocket
} from 'lucide-react';

/* ======================================================
   DATA STRUCTURES
   ====================================================== */
interface SkillBreakdown {
  reading?: number;
  writing?: number;
  listening?: number;
  speaking?: number;
  grammar?: number;
  vocabulary?: number;
}

interface CertificateInfo {
  id: string;
  verificationId: string;
  userName: string;
  cefrLevel: string;
  score: number;
  skillBreakdown: SkillBreakdown;
  issuedAt: string;
  assessmentId: string;
  completedAt: string;
}

/* ======================================================
   CEFR LEVEL DATA
   ====================================================== */
const CEFR_LEVELS: Record<string, {
  title: string;
  color: string;
  bgColor: string;
  accent: string;
  gradient: string;
  description: string;
  canDo: string[];
  nextLevel?: string;
  estimatedWeeksToNext: number;
}> = {
  A1: {
    title: 'Beginner',
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.15)',
    accent: '#60a5fa',
    gradient: 'from-blue-400 to-blue-600',
    description: 'At the A1 level, you can understand and use familiar everyday expressions and very basic phrases aimed at the satisfaction of needs of a concrete type. You can introduce yourself and others, and can ask and answer questions about personal details such as where you live, people you know, and things you own. You can interact in a simple way provided the other person talks slowly and clearly and is prepared to help.',
    canDo: [
      'Understand and use basic everyday expressions',
      'Introduce yourself and ask simple questions',
      'Interact in a simple way if the other person speaks slowly',
      'Fill in simple forms with personal details',
    ],
    nextLevel: 'A2',
    estimatedWeeksToNext: 12,
  },
  A2: {
    title: 'Elementary',
    color: '#22c55e',
    bgColor: 'rgba(34,197,94,0.15)',
    accent: '#4ade80',
    gradient: 'from-green-400 to-green-600',
    description: 'At the A2 level, you can understand sentences and frequently used expressions related to areas of most immediate relevance such as personal and family information, shopping, local geography, and employment. You can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar and routine matters. You can describe in simple terms aspects of your background, immediate environment, and matters in areas of immediate need.',
    canDo: [
      'Understand frequently used expressions about everyday life',
      'Communicate in simple, routine situations',
      'Describe your background and immediate environment',
      'Handle short social exchanges on familiar topics',
    ],
    nextLevel: 'B1',
    estimatedWeeksToNext: 16,
  },
  B1: {
    title: 'Intermediate',
    color: '#eab308',
    bgColor: 'rgba(234,179,8,0.15)',
    accent: '#facc15',
    gradient: 'from-yellow-400 to-yellow-600',
    description: 'At the B1 level, you can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, and similar contexts. You can deal with most situations likely to arise while travelling in an area where the language is spoken. You can produce simple connected text on topics which are familiar or of personal interest, and can describe experiences and events, dreams, hopes, and ambitions, briefly giving reasons and explanations for opinions and plans.',
    canDo: [
      'Understand the main points of clear standard speech',
      'Deal with most travel situations in English-speaking areas',
      'Produce simple connected text on familiar topics',
      'Describe experiences, events, and express opinions briefly',
    ],
    nextLevel: 'B2',
    estimatedWeeksToNext: 20,
  },
  B2: {
    title: 'Upper Intermediate',
    color: '#f97316',
    bgColor: 'rgba(249,115,22,0.15)',
    accent: '#fb923c',
    gradient: 'from-orange-400 to-orange-600',
    description: 'At the B2 level, you can understand the main ideas of complex text on both concrete and abstract topics, including technical discussions in your field of specialization. You can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible without strain for either party. You can produce clear, detailed text on a wide range of subjects and explain a viewpoint on a topical issue giving the advantages and disadvantages of various options.',
    canDo: [
      'Understand main ideas of complex text on various topics',
      'Interact fluently and spontaneously with native speakers',
      'Produce clear, detailed text on a wide range of subjects',
      'Explain viewpoints with advantages and disadvantages',
    ],
    nextLevel: 'C1',
    estimatedWeeksToNext: 24,
  },
  C1: {
    title: 'Advanced',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    accent: '#f87171',
    gradient: 'from-red-400 to-red-600',
    description: 'At the C1 level, you can understand a wide range of demanding, longer texts, and recognize implicit meaning. You can express ideas fluently and spontaneously without much obvious searching for expressions. You can use language flexibly and effectively for social, academic, and professional purposes. You can produce clear, well-structured, detailed text on complex subjects, showing controlled use of organizational patterns, connectors, and cohesive devices.',
    canDo: [
      'Understand demanding, longer texts with implicit meaning',
      'Express ideas fluently without searching for expressions',
      'Use language flexibly for social, academic, and professional purposes',
      'Produce well-structured, detailed text on complex subjects',
    ],
    nextLevel: 'C2',
    estimatedWeeksToNext: 30,
  },
  C2: {
    title: 'Proficient',
    color: '#a855f7',
    bgColor: 'rgba(168,85,247,0.15)',
    accent: '#c084fc',
    gradient: 'from-purple-400 to-purple-600',
    description: 'At the C2 level, you can understand with ease virtually everything heard or read. You can summarize information from different spoken and written sources, reconstructing arguments and accounts in a coherent presentation. You can express yourself spontaneously, very fluently, and precisely, differentiating finer shades of meaning even in more complex situations. This represents the pinnacle of English language proficiency.',
    canDo: [
      'Understand virtually everything heard or read with ease',
      'Summarize information from diverse sources coherently',
      'Express yourself spontaneously and precisely',
      'Differentiate finer shades of meaning in complex situations',
    ],
    estimatedWeeksToNext: 0,
  },
};

/* ======================================================
   SKILL RECOMMENDATIONS DATA
   ====================================================== */
const SKILL_RECOMMENDATIONS: Record<string, {
  icon: React.ReactNode;
  label: string;
  color: string;
  barColor: string;
  tips: {
    low: string[];
    mid: string[];
    high: string[];
  };
  resources: { name: string; desc: string }[];
}> = {
  reading: {
    icon: <BookOpen className="h-5 w-5" />,
    label: 'Reading',
    color: 'from-blue-500 to-cyan-500',
    barColor: '#3b82f6',
    tips: {
      low: [
        'Start with graded readers at A1-A2 level and read for 20 minutes daily to build foundational comprehension habits.',
        'Focus on identifying the main idea and key details before attempting inference or analysis questions.',
        'Use a dictionary app to look up unknown words, but try to guess meaning from context first before checking.',
        'Practice reading headlines, signs, and simple instructions to build everyday reading confidence.',
      ],
      mid: [
        'Expand to news articles and opinion pieces from sources like BBC Learning English or The Guardian.',
        'Practice identifying the author\'s tone, purpose, and implied meaning beyond the literal text.',
        'Try speed-reading exercises to improve your reading rate while maintaining comprehension accuracy.',
        'Summarize each paragraph in one sentence to practice extracting core ideas efficiently.',
      ],
      high: [
        'Challenge yourself with academic papers, literary analysis, and technical documentation in your field.',
        'Practice critical reading by evaluating arguments, identifying logical fallacies, and comparing perspectives.',
        'Read across diverse genres and disciplines to build broad vocabulary and cultural knowledge.',
        'Time yourself on complex texts and aim to maintain 90%+ comprehension at increasing speeds.',
      ],
    },
    resources: [
      { name: 'BBC Learning English', desc: 'Graded news articles with vocabulary support and comprehension exercises' },
      { name: 'News in Levels', desc: 'Current news stories adapted to three difficulty levels for progressive learning' },
    ],
  },
  writing: {
    icon: <PenTool className="h-5 w-5" />,
    label: 'Writing',
    color: 'from-violet-500 to-purple-500',
    barColor: '#8b5cf6',
    tips: {
      low: [
        'Practice writing simple sentences about your daily routine, hobbies, and personal experiences every day.',
        'Learn and practice basic sentence structures: subject-verb-object, and common conjunctions like "and", "but", "because".',
        'Keep a simple journal where you write 3-5 sentences about your day using vocabulary you already know.',
        'Study paragraph structure: topic sentence, supporting details, and concluding sentence.',
      ],
      mid: [
        'Write opinion essays on familiar topics using proper introduction, body, and conclusion structure.',
        'Practice using transition words (however, furthermore, nevertheless) to improve coherence and flow.',
        'Ask a language partner or tutor to review your writing and highlight recurring error patterns.',
        'Study different writing formats: formal emails, essays, reports, and reviews to broaden your range.',
      ],
      high: [
        'Practice writing persuasive and analytical essays with nuanced arguments and counterarguments.',
        'Refine your style by varying sentence length, using rhetorical devices, and developing a personal voice.',
        'Write for real audiences: blog posts, letters to editors, or professional reports to practice purposeful writing.',
        'Study advanced punctuation, cohesive devices, and register shifts between formal and informal contexts.',
      ],
    },
    resources: [
      { name: 'Grammarly', desc: 'AI writing assistant that checks grammar, style, and clarity in real time' },
      { name: 'Write & Improve (Cambridge)', desc: 'Free tool that grades your writing against CEFR levels with targeted feedback' },
    ],
  },
  listening: {
    icon: <Headphones className="h-5 w-5" />,
    label: 'Listening',
    color: 'from-green-500 to-emerald-500',
    barColor: '#22c55e',
    tips: {
      low: [
        'Start with slow, clear audio content designed for learners such as ESL podcasts and graded listening materials.',
        'Listen to the same audio multiple times: first for the general idea, then for specific details and words.',
        'Use subtitles when watching videos, but try to look away and listen first before reading along.',
        'Practice distinguishing similar-sounding words and minimal pairs (e.g., ship/sheep, bit/bet).',
      ],
      mid: [
        'Listen to English news broadcasts and TED Talks with varied accents to build real-world comprehension.',
        'Practice note-taking while listening to improve retention and identify key information under time pressure.',
        'Try dictation exercises: listen to a short clip and write down what you hear verbatim, then check accuracy.',
        'Watch English TV series without subtitles and see how much dialogue you can follow naturally.',
      ],
      high: [
        'Listen to academic lectures, debate podcasts, and panel discussions to follow complex extended arguments.',
        'Practice identifying speaker attitude, irony, sarcasm, and implied meaning in natural conversation.',
        'Challenge yourself with fast-paced, unscripted content like comedy shows and live interviews.',
        'Train with multiple accent varieties (British, American, Australian, Irish) to build flexible comprehension.',
      ],
    },
    resources: [
      { name: 'TED Talks', desc: 'Diverse topics with transcripts, ideal for intermediate to advanced listening practice' },
      { name: 'BBC 6 Minute English', desc: 'Short, engaging episodes on interesting topics with vocabulary highlights' },
    ],
  },
  speaking: {
    icon: <Mic className="h-5 w-5" />,
    label: 'Speaking',
    color: 'from-orange-500 to-amber-500',
    barColor: '#f97316',
    tips: {
      low: [
        'Practice saying common phrases and greetings aloud until they feel natural and automatic.',
        'Record yourself reading simple texts aloud and compare your pronunciation with native speaker recordings.',
        'Learn the sounds that do not exist in your native language and practice them with minimal pair exercises.',
        'Use language exchange apps to have short, structured conversations with patient native speakers.',
      ],
      mid: [
        'Practice giving 1-2 minute impromptu talks on random topics to build fluency and reduce hesitation.',
        'Focus on intonation patterns: practice rising and falling tones to convey questions, statements, and emphasis.',
        'Work on connected speech: linking words naturally (e.g., "want to" becomes "wanna" in casual speech).',
        'Join online conversation groups or language cafes to practice real-time dialogue with multiple speakers.',
      ],
      high: [
        'Practice presenting complex topics and defending your viewpoint with structured, persuasive arguments.',
        'Refine your pronunciation of tricky sounds and work on eliminating fossilized errors from your native language.',
        'Practice adjusting register and formality level smoothly depending on the social context and audience.',
        'Record yourself in free conversation and analyze for filler words, hesitations, and unnatural pauses.',
      ],
    },
    resources: [
      { name: 'ELSA Speak', desc: 'AI-powered pronunciation coach with detailed feedback on individual sounds' },
      { name: 'iTalki / Preply', desc: 'Connect with native tutors for structured conversation practice and feedback' },
    ],
  },
  grammar: {
    icon: <BarChart3 className="h-5 w-5" />,
    label: 'Grammar',
    color: 'from-purple-500 to-pink-500',
    barColor: '#a855f7',
    tips: {
      low: [
        'Master the basics first: present simple, present continuous, past simple, and future with "will" and "going to".',
        'Study articles (a/an/the) and prepositions systematically, as these are the most common error areas for learners.',
        'Use grammar workbooks designed for A1-A2 learners and complete exercises daily, even just 10-15 minutes.',
        'When you make a grammar mistake, write it down in a "mistake journal" with the corrected version for review.',
      ],
      mid: [
        'Focus on perfect tenses, conditionals, and reported speech, which are common weak spots at B1-B2 level.',
        'Study the differences between similar structures: "have been" vs "had been", "will" vs "going to" for predictions.',
        'Practice grammar in context by writing and speaking rather than just doing fill-in-the-blank exercises.',
        'Read extensively and notice grammar patterns in authentic text rather than studying rules in isolation.',
      ],
      high: [
        'Study advanced structures: inversion, cleft sentences, subjunctive mood, and mixed conditionals.',
        'Analyze how skilled writers manipulate grammar for rhetorical effect, emphasis, and style.',
        'Practice editing exercises where you identify and correct subtle grammatical errors in complex text.',
        'Learn the grammar of academic and professional registers, including hedging and nominalization.',
      ],
    },
    resources: [
      { name: 'English Grammar in Use (Murphy)', desc: 'The gold standard reference and practice book for intermediate to advanced grammar' },
      { name: 'Perfect English Grammar', desc: 'Clear explanations and practice exercises for all grammar topics, free online' },
    ],
  },
  vocabulary: {
    icon: <Award className="h-5 w-5" />,
    label: 'Vocabulary',
    color: 'from-cyan-500 to-blue-500',
    barColor: '#06b6d4',
    tips: {
      low: [
        'Learn the 1,000 most common English words first, as they cover about 85% of everyday spoken English.',
        'Use flashcard apps like Anki or Quizlet with spaced repetition to review vocabulary systematically.',
        'Learn words in phrases and collocations, not in isolation: "make a decision", not just "decision".',
        'Group vocabulary by topic (food, travel, work) and learn related words together for better retention.',
      ],
      mid: [
        'Expand to the 3,000-5,000 word range by reading widely and noting unfamiliar words for review.',
        'Study word formation: prefixes, suffixes, and roots to help you guess the meaning of new words.',
        'Learn synonyms and antonyms for common words to add precision and variety to your expression.',
        'Practice using new vocabulary in sentences immediately after learning to strengthen the memory connection.',
      ],
      high: [
        'Study academic and professional vocabulary lists (AWL, phrasal verbs, idiomatic expressions).',
        'Learn nuanced differences between near-synonyms: "attempt" vs "endeavor", "small" vs "minute".',
        'Read literature, academic papers, and sophisticated journalism to encounter vocabulary in rich context.',
        'Practice using vocabulary precisely: the right word in the right context rather than approximately correct words.',
      ],
    },
    resources: [
      { name: 'Vocabulary.com', desc: 'Adaptive vocabulary learning with real-world examples and spaced repetition' },
      { name: 'Anki', desc: 'Powerful flashcard app with spaced repetition algorithm for long-term vocabulary retention' },
    ],
  },
};

/* ======================================================
   SCROLL ANIMATION HOOK
   ====================================================== */
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} className={`scroll-animate ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ======================================================
   SKILL DETAIL SECTION (expandable)
   ====================================================== */
function SkillDetailSection({
  skillKey,
  value,
  isPremium,
}: {
  skillKey: string;
  value: number;
  isPremium: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const rec = SKILL_RECOMMENDATIONS[skillKey];
  if (!rec) return null;

  const tier: 'low' | 'mid' | 'high' = value < 40 ? 'low' : value < 70 ? 'mid' : 'high';
  const tips = rec.tips[tier];

  return (
    <div className="glass-card overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${rec.color} text-white shadow-lg`}>
            {rec.icon}
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-white text-sm">{rec.label}</h4>
            <p className="text-xs text-white/40">
              {tier === 'low' ? 'Needs Improvement' : tier === 'mid' ? 'Developing' : 'Strong'} &middot; {value}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 w-32">
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${value}%`, backgroundColor: rec.barColor }}
              />
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-white/40" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/40" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 animate-slide-down">
          {/* Tips */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <h5 className="text-sm font-medium text-white">
                {tier === 'low'
                  ? 'Foundational Tips to Build Your Skills'
                  : tier === 'mid'
                  ? 'Strategies to Strengthen Your Performance'
                  : 'Advanced Techniques to Push Further'}
              </h5>
            </div>
            {isPremium ? (
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
                    <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-white/5 text-[10px] font-bold text-white/40 mt-0.5">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-3">
                <ul className="space-y-2">
                  {tips.slice(0, 2).map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
                      <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-white/5 text-[10px] font-bold text-white/40 mt-0.5">
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
                {/* Premium upsell for hidden tips */}
                <div className="relative rounded-xl p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">Premium</span>
                  </div>
                  <p className="text-sm text-white/50 mb-3">
                    Unlock all {tips.length} personalized tips and detailed resources for your {rec.label.toLowerCase()} skills.
                  </p>
                  <Link href="/pricing">
                    <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-pink-400 transition-all duration-300 cursor-pointer">
                      <Crown className="h-3.5 w-3.5" />
                      Upgrade for Full Report
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Resources (premium only) */}
          {isPremium && rec.resources.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <h5 className="text-sm font-medium text-white">Recommended Resources</h5>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {rec.resources.map((res, i) => (
                  <div key={i} className="rounded-lg p-3 bg-white/5 border border-white/5">
                    <p className="text-xs font-medium text-white">{res.name}</p>
                    <p className="text-[11px] text-white/40 mt-0.5">{res.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ======================================================
   MAIN REPORT PAGE
   ====================================================== */
export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const verificationId = params.verificationId as string;
  const { isAuthenticated, isLoading: authIsLoading, user } = useAuthStore();

  const [certificate, setCertificate] = useState<CertificateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/certificates/verify/${verificationId}`);
        if (!response.ok) {
          setError('Report not found. The certificate may have been removed or the link is incorrect.');
          return;
        }
        const data = await response.json();
        setCertificate(data.certificate);
      } catch {
        setError('Failed to load report. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [verificationId]);

  const isPremium = user?.plan === 'premium' || user?.plan === 'pro';

  const handleShare = async () => {
    const url = `${window.location.origin}/report/${verificationId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CEFR Report - ${certificate?.cefrLevel}`,
          text: `${certificate?.userName}'s detailed CEFR proficiency report on TestCEFR.com`,
          url,
        });
      } catch {
        await navigator.clipboard.writeText(url);
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48 bg-white/5" />
            <Skeleton className="h-64 w-full bg-white/5" />
            <Skeleton className="h-48 w-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error || !certificate) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="glass-card p-8 max-w-md text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Report Not Found</h2>
            <p className="text-sm text-white/50 mb-6">{error || 'The requested report could not be found.'}</p>
            <Link href="/dashboard">
              <button className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 glass-button text-white font-medium text-sm cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Computed Data ── */
  const levelInfo = CEFR_LEVELS[certificate.cefrLevel] || CEFR_LEVELS.B1;
  const skills = certificate.skillBreakdown || {};
  const skillEntries = Object.entries(skills).filter(([_, v]) => v !== undefined) as [string, number][];

  // Find strongest and weakest skills
  const sortedSkills = [...skillEntries].sort((a, b) => b[1] - a[1]);
  const strongest = sortedSkills[0];
  const weakest = sortedSkills[sortedSkills.length - 1];

  // Calculate average of skills for display
  const skillAvg = skillEntries.length > 0
    ? Math.round(skillEntries.reduce((sum, [_, v]) => sum + v, 0) / skillEntries.length)
    : certificate.score;

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <div className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-6">

          {/* ── Back Button ── */}
          <Button
            variant="ghost"
            className="gap-2 text-white/60 hover:text-white"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          {/* ══════════════════════════════════════
              REPORT HEADER
              ══════════════════════════════════════ */}
          <AnimatedSection>
            <div className="glass-card-neon p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 shadow-lg"
                    style={{
                      borderColor: levelInfo.accent,
                      backgroundColor: levelInfo.bgColor,
                    }}
                  >
                    <span className="text-2xl font-bold" style={{ color: levelInfo.accent }}>
                      {certificate.cefrLevel}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-white">Proficiency Report</h1>
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border"
                        style={{
                          color: levelInfo.accent,
                          backgroundColor: levelInfo.bgColor,
                          borderColor: `${levelInfo.accent}33`,
                        }}
                      >
                        {levelInfo.title}
                      </span>
                    </div>
                    <p className="text-sm text-white/50">
                      {certificate.userName} &middot; {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      ID: {certificate.verificationId}
                    </p>
                  </div>
                </div>

                {/* Overall Score Circle */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div
                      className="relative h-24 w-24 rounded-full flex items-center justify-center border-2"
                      style={{
                        borderColor: levelInfo.accent,
                        backgroundColor: levelInfo.bgColor,
                      }}
                    >
                      <div>
                        <p className="text-2xl font-bold" style={{ color: levelInfo.accent }}>
                          {certificate.score}%
                        </p>
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: `${levelInfo.accent}99` }}>
                          Overall
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-white/50">
                      <Target className="h-3.5 w-3.5" />
                      <span>Skill Average: <strong className="text-white">{skillAvg}%</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <Star className="h-3.5 w-3.5" />
                      <span>Strongest: <strong className="text-white">{SKILL_RECOMMENDATIONS[strongest?.[0]]?.label || 'N/A'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>Focus Area: <strong className="text-white">{SKILL_RECOMMENDATIONS[weakest?.[0]]?.label || 'N/A'}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* ══════════════════════════════════════
              CEFR LEVEL DESCRIPTION
              ══════════════════════════════════════ */}
          <AnimatedSection delay={100}>
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Award className="h-5 w-5" style={{ color: levelInfo.accent }} />
                Your CEFR Level: {certificate.cefrLevel} — {levelInfo.title}
              </h2>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                {levelInfo.description}
              </p>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2">What you can do at this level</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {levelInfo.canDo.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-white/50">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: levelInfo.accent }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* ══════════════════════════════════════
              SKILL BREAKDOWN OVERVIEW
              ══════════════════════════════════════ */}
          <AnimatedSection delay={200}>
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-400" />
                Skill Breakdown
              </h2>
              {skillEntries.length > 0 ? (
                <div className="space-y-4">
                  {skillEntries.map(([skill, value]) => {
                    const rec = SKILL_RECOMMENDATIONS[skill];
                    if (!rec) return null;
                    return (
                      <div key={skill} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-white/60 text-sm`}>{rec.label}</span>
                            {skill === weakest?.[0] && (
                              <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded-full border border-orange-500/20">Focus Area</span>
                            )}
                            {skill === strongest?.[0] && (
                              <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded-full border border-green-500/20">Strongest</span>
                            )}
                          </div>
                          <span className="text-sm font-bold" style={{ color: rec.barColor }}>{value}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${rec.color} transition-all duration-1000`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-white/40">No skill breakdown available for this assessment.</p>
              )}
            </div>
          </AnimatedSection>

          {/* ══════════════════════════════════════
              DETAILED IMPROVEMENT PLAN
              ══════════════════════════════════════ */}
          <AnimatedSection delay={300}>
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Detailed Improvement Plan</h2>
              </div>
              <p className="text-sm text-white/40 px-1">
                Tap each skill to see personalized recommendations tailored to your current level. {isPremium ? 'You have full access to all tips and resources as a Premium member.' : 'Upgrade to Premium for the complete plan with all tips and resources.'}
              </p>

              {skillEntries.length > 0 ? (
                <div className="space-y-2">
                  {/* Sort: weakest first */}
                  {[...skillEntries]
                    .sort((a, b) => a[1] - b[1])
                    .map(([skill, value]) => (
                      <SkillDetailSection
                        key={skill}
                        skillKey={skill}
                        value={value}
                        isPremium={isPremium}
                      />
                    ))}
                </div>
              ) : (
                <div className="glass-card p-6 text-center">
                  <p className="text-sm text-white/40">No detailed skill data available. Take a premium assessment for a full breakdown.</p>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* ══════════════════════════════════════
              PATH TO NEXT LEVEL
              ══════════════════════════════════════ */}
          {levelInfo.nextLevel && (
            <AnimatedSection delay={400}>
              <div className="glass-card-neon p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Your Path to {levelInfo.nextLevel}</h2>
                </div>
                <p className="text-sm text-white/50 leading-relaxed mb-4">
                  To reach the next level ({levelInfo.nextLevel} — {CEFR_LEVELS[levelInfo.nextLevel]?.title}), focus on your weakest skills and consistently practice. On average, dedicated learners can bridge this gap in approximately <strong className="text-white">{levelInfo.estimatedWeeksToNext} weeks</strong> of regular study.
                </p>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
                    What you need to do at {levelInfo.nextLevel} level
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {CEFR_LEVELS[levelInfo.nextLevel]?.canDo.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-white/50">
                        <TrendingUp className="h-4 w-4 mt-0.5 shrink-0 text-purple-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* ══════════════════════════════════════
              RETEST RECOMMENDATION
              ══════════════════════════════════════ */}
          <AnimatedSection delay={500}>
            <div className="glass-card p-6 border-l-4 border-l-amber-500">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/20">
                  <RefreshCw className="h-6 w-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white mb-2">Ready for a Retest?</h2>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    Language proficiency is dynamic and can change significantly with practice. We recommend retaking the assessment every 4 to 8 weeks to track your improvement and identify new focus areas. Each retest uses fresh questions, so you will always face a new and challenging evaluation that accurately measures your current level.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {isAuthenticated ? (
                      isPremium ? (
                        <Link href="/test">
                          <button className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-pink-400 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                            <RefreshCw className="h-4 w-4" />
                            Retake Test Now
                          </button>
                        </Link>
                      ) : (
                        <Link href="/pricing">
                          <button className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-pink-400 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                            <Crown className="h-4 w-4" />
                            Upgrade to Retest
                          </button>
                        </Link>
                      )
                    ) : (
                      <Link href="/login">
                        <button className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-pink-400 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                          Sign In to Retest
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* ══════════════════════════════════════
              PREMIUM UPGRADE CTA (always visible for free users)
              ══════════════════════════════════════ */}
          {!isPremium && (
            <AnimatedSection delay={600}>
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-purple-500/20 animate-pulse-glow" />
                <div className="relative glass-card p-6 md:p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
                      <Crown className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Unlock Your Full Report
                  </h2>
                  <p className="text-sm text-white/50 max-w-lg mx-auto mb-6">
                    You are seeing a preview of your report. Upgrade to Premium to unlock all personalized improvement tips, recommended resources, detailed skill analysis, and unlimited retests with full analytics.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3 max-w-md mx-auto mb-6">
                    {[
                      { icon: <Lightbulb className="h-4 w-4" />, text: 'All personalized tips' },
                      { icon: <BookOpen className="h-4 w-4" />, text: 'Curated resources' },
                      { icon: <RefreshCw className="h-4 w-4" />, text: 'Unlimited retests' },
                      { icon: <BarChart3 className="h-4 w-4" />, text: 'Full analytics suite' },
                      { icon: <Award className="h-4 w-4" />, text: 'Unlimited certificates' },
                      { icon: <Zap className="h-4 w-4" />, text: 'Priority AI analysis' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                        <span className="text-purple-400">{item.icon}</span>
                        {item.text}
                      </div>
                    ))}
                  </div>
                  <Link href="/pricing">
                    <button className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-base shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <Crown className="h-5 w-5" />
                      Upgrade to Premium
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                  <p className="text-xs text-white/30 mt-3">Starting at $12.99 &middot; Secure payment via PayPal</p>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* ══════════════════════════════════════
              QUICK ACTIONS
              ══════════════════════════════════════ */}
          <AnimatedSection delay={700}>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/certificate/${verificationId}`}>
                <button className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 glass-button text-white font-medium text-sm cursor-pointer">
                  <Award className="h-4 w-4" />
                  View Certificate
                </button>
              </Link>
              <a href={`/api/certificates/download/${verificationId}`} target="_blank" rel="noopener noreferrer">
                <button className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium text-sm shadow-lg shadow-purple-500/25 cursor-pointer">
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </a>
              <button
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 glass-button text-white font-medium text-sm cursor-pointer"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share Report
              </button>
              <Link href={`/verify/${verificationId}`} target="_blank">
                <button className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 glass-button text-white font-medium text-sm cursor-pointer">
                  <Shield className="h-4 w-4" />
                  Verification Page
                </button>
              </Link>
            </div>
          </AnimatedSection>

        </div>
      </div>

      <Footer />
    </div>
  );
}
