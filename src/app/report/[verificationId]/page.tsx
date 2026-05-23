'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft, Download, Share2, Shield, CheckCircle2,
  BookOpen, Headphones, Mic, PenTool, BarChart3,
  Brain, Sparkles, RotateCcw, CreditCard, ArrowRight,
  TrendingUp, Target, Lightbulb, Award, QrCode,
  ChevronDown, ChevronUp, AlertCircle, Zap, Crown,
} from 'lucide-react';
import Link from 'next/link';

/* ======================================================
   TYPES
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
  gradient: string;
  textColor: string;
  barColor: string;
  description: string;
  canDo: string[];
}> = {
  A1: {
    title: 'Beginner',
    gradient: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-400',
    barColor: 'from-blue-400 to-cyan-500',
    description: 'You can understand and use familiar everyday expressions and very basic phrases aimed at the satisfaction of needs of a concrete type. You can introduce yourself and others and can ask and answer questions about personal details such as where you live, people you know, and things you have.',
    canDo: [
      'Understand simple greetings and introductions',
      'Ask and answer basic personal questions',
      'Interact in a simple way if the other person talks slowly',
      'Read very short, simple texts with familiar vocabulary',
      'Write short, simple postcards and fill in forms',
    ],
  },
  A2: {
    title: 'Elementary',
    gradient: 'from-green-500 to-green-600',
    textColor: 'text-green-400',
    barColor: 'from-green-400 to-emerald-500',
    description: 'You can understand sentences and frequently used expressions related to areas of most immediate relevance (e.g., personal and family information, shopping, local geography, employment). You can communicate in simple and routine tasks requiring a simple and direct exchange of information.',
    canDo: [
      'Understand frequently used expressions about personal life',
      'Communicate in simple, routine situations',
      'Describe your background, immediate environment, and needs',
      'Read short, simple texts and find specific information',
      'Write short, simple notes and messages about everyday matters',
    ],
  },
  B1: {
    title: 'Intermediate',
    gradient: 'from-yellow-500 to-yellow-600',
    textColor: 'text-yellow-400',
    barColor: 'from-yellow-400 to-amber-500',
    description: 'You can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc. You can deal with most situations likely to arise while travelling in an area where the language is spoken. You can produce simple connected text on topics that are familiar or of personal interest.',
    canDo: [
      'Understand the main points of clear standard speech on familiar topics',
      'Deal with most travel situations in English-speaking areas',
      'Produce simple connected text on familiar or personal topics',
      'Describe experiences, events, dreams, and ambitions',
      'Briefly give reasons and explanations for opinions and plans',
    ],
  },
  B2: {
    title: 'Upper Intermediate',
    gradient: 'from-orange-500 to-orange-600',
    textColor: 'text-orange-400',
    barColor: 'from-orange-400 to-amber-500',
    description: 'You can understand the main ideas of complex text on both concrete and abstract topics, including technical discussions in your field of specialization. You can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible without strain for either party.',
    canDo: [
      'Understand the main ideas of complex text on various topics',
      'Interact with fluency and spontaneity with native speakers',
      'Produce clear, detailed text on a wide range of subjects',
      'Explain a viewpoint on a topical issue with pros and cons',
      'Follow news broadcasts and films in standard English',
    ],
  },
  C1: {
    title: 'Advanced',
    gradient: 'from-red-500 to-red-600',
    textColor: 'text-red-400',
    barColor: 'from-red-400 to-rose-500',
    description: 'You can understand a wide range of demanding, longer texts, and recognize implicit meaning. You can express ideas fluently and spontaneously without much obvious searching for expressions. You can use language flexibly and effectively for social, academic, and professional purposes.',
    canDo: [
      'Understand demanding texts and recognize implicit meaning',
      'Express ideas fluently and spontaneously without hesitation',
      'Use language flexibly for social, academic, and professional purposes',
      'Produce clear, well-structured, detailed text on complex subjects',
      'Understand virtually all TV programs and films in English',
    ],
  },
  C2: {
    title: 'Proficient',
    gradient: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-400',
    barColor: 'from-purple-400 to-pink-500',
    description: 'You can understand with ease virtually everything heard or read. You can summarize information from different spoken and written sources, reconstructing arguments and accounts in a coherent presentation. You can express yourself spontaneously, very fluently and precisely, differentiating finer shades of meaning even in more complex situations.',
    canDo: [
      'Understand virtually everything heard or read with ease',
      'Summarize and reconstruct information from various sources',
      'Express yourself spontaneously, fluently, and precisely',
      'Differentiate finer shades of meaning in complex situations',
      'Produce sophisticated texts with native-level command of the language',
    ],
  },
};

/* ======================================================
   SKILL-SPECIFIC RECOMMENDATIONS
   ====================================================== */
const SKILL_RECOMMENDATIONS: Record<string, {
  icon: React.ReactNode;
  color: string;
  barColor: string;
  tips: { low: string[]; mid: string[]; high: string[] };
  resources: string[];
}> = {
  reading: {
    icon: <BookOpen className="h-5 w-5" />,
    color: 'from-blue-400 to-cyan-500',
    barColor: 'from-blue-400 to-cyan-500',
    tips: {
      low: [
        'Start with graded readers at A1-A2 level to build confidence and vocabulary gradually.',
        'Practice reading short news headlines and simple signs daily — even 5 minutes helps.',
        'Use a dictionary app to look up unfamiliar words, but limit yourself to 3-5 new words per session.',
        'Try reading children\'s books or simplified English texts to build a strong foundation.',
      ],
      mid: [
        'Expand to newspaper articles, blog posts, and short stories to encounter richer vocabulary.',
        'Practice skimming for main ideas first, then scanning for specific details — both are essential skills.',
        'Read opinion pieces and editorials to develop understanding of implied meaning and tone.',
        'Summarize each paragraph in your own words to check comprehension.',
      ],
      high: [
        'Challenge yourself with academic papers, literary criticism, and technical documentation.',
        'Practice reading between the lines — identify the author\'s unstated assumptions and biases.',
        'Compare multiple sources on the same topic to evaluate credibility and perspective.',
        'Time your reading to build speed without sacrificing comprehension accuracy.',
      ],
    },
    resources: ['Graded readers (Oxford Bookworms, Penguin Readers)', 'BBC Learning English', 'News in Levels (newsinlevels.com)', 'Project Gutenberg free ebooks'],
  },
  writing: {
    icon: <PenTool className="h-5 w-5" />,
    color: 'from-violet-400 to-purple-500',
    barColor: 'from-violet-400 to-purple-500',
    tips: {
      low: [
        'Start with simple journal entries — write 3-5 sentences about your day using basic grammar.',
        'Practice forming complete sentences with subject-verb-object structure before adding complexity.',
        'Write short emails or messages to practice everyday communication.',
        'Use sentence starters and templates to build confidence with common writing patterns.',
      ],
      mid: [
        'Write opinion paragraphs using the structure: claim, evidence, explanation, and conclusion.',
        'Practice linking ideas with transition words (however, furthermore, in contrast, consequently).',
        'Write both formal and informal versions of the same message to develop register awareness.',
        'Get feedback on your writing from native speakers or language exchange partners.',
      ],
      high: [
        'Write analytical essays that compare multiple perspectives on complex issues.',
        'Practice varying your sentence structure for rhythm and emphasis — use periodic sentences, parallel structure.',
        'Develop a disciplined editing process: revise for content first, then clarity, then grammar.',
        'Study the writing styles of published authors and academic writers you admire.',
      ],
    },
    resources: ['Grammarly for grammar checking', 'Hemingway Editor for clarity', 'Write & Improve (writeandimprove.com)', 'Purdue OWL writing resources'],
  },
  listening: {
    icon: <Headphones className="h-5 w-5" />,
    color: 'from-green-400 to-emerald-500',
    barColor: 'from-green-400 to-emerald-500',
    tips: {
      low: [
        'Listen to slow English podcasts designed for learners, such as ESL Pod or 6 Minute English.',
        'Watch videos with English subtitles first, then re-watch without subtitles to test comprehension.',
        'Practice identifying individual words in spoken sentences before trying to understand full passages.',
        'Listen to the same clip multiple times — comprehension improves with each repetition.',
      ],
      mid: [
        'Move to authentic content: TED Talks, news broadcasts, and interviews with varied accents.',
        'Practice listening for main ideas first, then details — train your ear to distinguish key from supporting info.',
        'Try dictation exercises: write down exactly what you hear, then check against the transcript.',
        'Listen to conversations between multiple speakers to practice following different voices and perspectives.',
      ],
      high: [
        'Challenge yourself with fast-paced debates, academic lectures, and films with regional accents.',
        'Practice understanding implied meaning, sarcasm, and cultural references in spoken English.',
        'Listen to content outside your comfort zone — technical talks, legal proceedings, or parliamentary debates.',
        'Train your ear to understand speech at natural speed (1.5x or faster) without losing comprehension.',
      ],
    },
    resources: ['BBC 6 Minute English', 'TED Talks', 'ESL Pod', 'BBC Learning English podcasts'],
  },
  speaking: {
    icon: <Mic className="h-5 w-5" />,
    color: 'from-orange-400 to-amber-500',
    barColor: 'from-orange-400 to-amber-500',
    tips: {
      low: [
        'Practice reading aloud for 5-10 minutes daily to build mouth muscle memory for English sounds.',
        'Record yourself speaking and listen back — compare with native speaker pronunciation.',
        'Learn and practice the most common English sounds that are difficult for your native language.',
        'Use shadowing: repeat immediately after a native speaker, matching their rhythm and intonation.',
      ],
      mid: [
        'Practice giving 1-2 minute impromptu speeches on random topics to build fluency.',
        'Record yourself describing a process or telling a story, then analyze your pauses and filler words.',
        'Practice using intonation to express different emotions and attitudes in your speech.',
        'Join conversation groups or language exchange sessions to practice real-time interaction.',
      ],
      high: [
        'Practice formal presentations and persuasive speeches with complex argumentation.',
        'Develop the ability to speak spontaneously on abstract and unfamiliar topics with precision.',
        'Work on subtle aspects of pronunciation: stress patterns, connected speech, and weak forms.',
        'Practice switching between formal and informal register depending on the audience.',
      ],
    },
    resources: ['Elsa Speak for pronunciation', 'iTalki for conversation practice', 'Shadowing technique videos', 'Recording and self-review'],
  },
  grammar: {
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'from-purple-400 to-pink-500',
    barColor: 'from-purple-400 to-pink-500',
    tips: {
      low: [
        'Master the basic tenses first: present simple, present continuous, past simple, and future with "will" and "going to."',
        'Learn the most common irregular verbs by heart — they appear constantly in everyday English.',
        'Practice forming simple, compound, and basic complex sentences before moving to advanced structures.',
        'Focus on getting subject-verb agreement right in every sentence you write or speak.',
      ],
      mid: [
        'Study conditionals (zero, first, second, third) and practice using them in context.',
        'Learn the difference between definite and indefinite articles and when to omit them entirely.',
        'Practice passive voice, reported speech, and relative clauses in your writing.',
        'Study modal verbs of deduction, obligation, and advice for more nuanced expression.',
      ],
      high: [
        'Master advanced structures: inversion, cleft sentences, subjunctive mood, and mixed conditionals.',
        'Study the grammar of academic and professional writing: nominalization, hedging, and metadiscourse.',
        'Analyze the grammatical choices that published writers make and understand why they made them.',
        'Focus on eliminating persistent fossilized errors that have become automatic.',
      ],
    },
    resources: ['English Grammar in Use (Murphy)', 'Grammarly for real-time feedback', 'Perfect English Grammar website', 'Cambridge Grammar reference books'],
  },
  vocabulary: {
    icon: <Brain className="h-5 w-5" />,
    color: 'from-cyan-400 to-blue-500',
    barColor: 'from-cyan-400 to-blue-500',
    tips: {
      low: [
        'Learn the 1,000 most common English words first — they cover about 85% of everyday conversation.',
        'Group new words by topic (food, travel, work) rather than learning random lists.',
        'Use flashcard apps with spaced repetition (Anki, Quizlet) to review vocabulary efficiently.',
        'Learn words in context — always write a full sentence using each new word.',
      ],
      mid: [
        'Expand from high-frequency words to the 3,000-5,000 word range needed for B2 level.',
        'Study word families: if you learn "decide," also learn decision, decisive, decisively, indecisive.',
        'Practice collocations — learn which words naturally go together (make a decision, not do a decision).',
        'Start using a monolingual English dictionary to understand nuance and usage.',
      ],
      high: [
        'Study academic word lists and domain-specific vocabulary for your field of interest.',
        'Learn idiomatic expressions, phrasal verbs, and figurative language that native speakers use.',
        'Practice using words with precision — understand the subtle differences between near-synonyms.',
        'Read widely across genres to encounter vocabulary in its natural context.',
      ],
    },
    resources: ['Anki flashcard app', 'Quizlet vocabulary sets', 'Vocabulary.com', 'Oxford 3000/5000 word lists'],
  },
};

const SKILL_LABELS: Record<string, string> = {
  reading: 'Reading',
  writing: 'Writing',
  listening: 'Listening',
  speaking: 'Speaking',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
};

/* ======================================================
   EXPANDABLE SKILL SECTION
   ====================================================== */
function SkillDetailSection({
  skill,
  score,
  level,
}: {
  skill: string;
  score: number;
  level: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const rec = SKILL_RECOMMENDATIONS[skill];
  if (!rec) return null;

  // Pick the right tier of tips
  const tier = score < 40 ? 'low' : score < 70 ? 'mid' : 'high';
  const tips = rec.tips[tier];
  const levelLabel = tier === 'low' ? 'Foundation' : tier === 'mid' ? 'Development' : 'Refinement';

  return (
    <div className="glass-card overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${rec.color} text-white shadow-lg`}>
            {rec.icon}
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-white">{SKILL_LABELS[skill]}</h3>
            <p className="text-xs text-white/40 mt-0.5">{levelLabel} level recommendations</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${rec.barColor} transition-all duration-700`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {score}%
            </span>
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
        <div className="px-5 pb-5 animate-slide-down">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

          {/* Tips */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Improvement Tips</h4>
            </div>
            <div className="space-y-2.5">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/40 text-[10px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-white/60 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-purple-400" />
              <h4 className="text-sm font-semibold text-white">Recommended Resources</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {rec.resources.map((resource, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-white/5 border border-white/5 text-xs text-white/50">
                  {resource}
                </span>
              ))}
            </div>
          </div>
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
  const { isAuthenticated, user } = useAuthStore();

  const [certificate, setCertificate] = useState<CertificateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/certificates/verify/${verificationId}/`);
        if (!response.ok) {
          setError('Report not found. The certificate may not exist or has been removed.');
          return;
        }
        const data = await response.json();
        setCertificate(data.certificate);
      } catch {
        setError('Failed to load report. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [verificationId]);

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
        <Footer />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/20 text-red-400 mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Report Not Found</h1>
              <p className="text-sm text-white/50 mb-6">{error}</p>
              <Link href="/dashboard">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer">
                  Return to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const levelInfo = CEFR_LEVELS[certificate.cefrLevel] || CEFR_LEVELS.B1;
  const skills = certificate.skillBreakdown || {};
  const skillEntries = Object.entries(skills).filter(([_, v]) => v !== undefined);
  const overallScore = certificate.score;

  // Determine next level and what it takes
  const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const currentIdx = levelOrder.indexOf(certificate.cefrLevel);
  const nextLevel = currentIdx < levelOrder.length - 1 ? levelOrder[currentIdx + 1] : null;
  const nextLevelInfo = nextLevel ? CEFR_LEVELS[nextLevel] : null;

  // Find weakest and strongest skills
  const sortedSkills = [...skillEntries].sort(([_, a], [__, b]) => (a || 0) - (b || 0));
  const weakestSkill = sortedSkills[0];
  const strongestSkill = sortedSkills[sortedSkills.length - 1];

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      <div className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">

          {/* Back button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          {/* ── REPORT HEADER ── */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${levelInfo.gradient} flex items-center justify-center shadow-lg shadow-purple-500/30`}>
                  <span className="text-white text-2xl font-bold">{certificate.cefrLevel}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-white">CEFR Assessment Report</h1>
                  </div>
                  <p className="text-white/50 text-sm">
                    {certificate.userName} &middot; {new Date(certificate.completedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5 font-mono">
                    Verification ID: {certificate.verificationId}
                  </p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className={`text-3xl font-bold ${levelInfo.textColor}`}>{overallScore}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Overall Score</p>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{certificate.cefrLevel}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">CEFR Level</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── LEVEL DESCRIPTION ── */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Your Level: {certificate.cefrLevel} — {levelInfo.title}</h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {levelInfo.description}
            </p>

            {/* Can-do statements */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 font-medium mb-3">
                What you can do at this level
              </p>
              <div className="space-y-2">
                {levelInfo.canDo.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-white/60">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SKILL BREAKDOWN OVERVIEW ── */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Skill Breakdown</h2>
            </div>

            <div className="space-y-4">
              {skillEntries.map(([skill, value]) => {
                const rec = SKILL_RECOMMENDATIONS[skill];
                return (
                  <div key={skill} className="flex items-center gap-4">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${rec?.color || 'from-gray-400 to-gray-500'} text-white shadow-lg`}>
                      {rec?.icon || <Brain className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-white/70">{SKILL_LABELS[skill] || skill}</span>
                        <span className={`text-sm font-bold ${value >= 70 ? 'text-green-400' : value >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {value}%
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${rec?.barColor || 'from-gray-400 to-gray-500'} transition-all duration-1000`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weakest / Strongest */}
            {weakestSkill && strongestSkill && (
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl p-4 bg-orange-500/5 border border-orange-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Focus Area</span>
                  </div>
                  <p className="text-sm text-white/60">
                    <span className="text-white font-medium">{SKILL_LABELS[weakestSkill[0]]}</span> is your lowest skill at {weakestSkill[1]}%. Focus your study here for the biggest improvement.
                  </p>
                </div>
                <div className="rounded-xl p-4 bg-green-500/5 border border-green-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Your Strength</span>
                  </div>
                  <p className="text-sm text-white/60">
                    <span className="text-white font-medium">{SKILL_LABELS[strongestSkill[0]]}</span> is your strongest skill at {strongestSkill[1]}%. Build on this foundation.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── DETAILED IMPROVEMENT RECOMMENDATIONS ── */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Detailed Improvement Plan</h2>
            </div>
            <p className="text-white/50 text-sm mb-5">
              Expand each skill below for personalized recommendations and resources tailored to your current performance level.
            </p>

            <div className="space-y-3">
              {skillEntries.map(([skill, value]) => (
                <SkillDetailSection
                  key={skill}
                  skill={skill}
                  score={value}
                  level={certificate.cefrLevel}
                />
              ))}
            </div>
          </div>

          {/* ── PATH TO NEXT LEVEL ── */}
          {nextLevel && nextLevelInfo && (
            <div className="glass-card-neon p-6 md:p-8 light-streak">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Path to {nextLevel} — {nextLevelInfo.title}</h2>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                To advance from <span className="text-white font-medium">{certificate.cefrLevel}</span> to{' '}
                <span className={`font-medium ${nextLevelInfo.textColor}`}>{nextLevel}</span>, focus on the areas below.
                At your current trajectory, consistent daily practice of 30-60 minutes could help you reach the next level
                within 2-3 months.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {nextLevelInfo.canDo.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm rounded-lg p-3 bg-white/5">
                    <ArrowRight className="h-3.5 w-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-white/60">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RETEST RECOMMENDATION ── */}
          <div className="glass-card p-6 md:p-8 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Retake the Test to Track Your Progress</h2>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Language proficiency is not static — it improves with practice. We recommend retaking the CEFR assessment
              every 4-6 weeks to track your improvement over time. Each retake provides fresh questions and updated
              AI analysis, giving you an accurate picture of your growing skills.
            </p>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Your current scores establish a baseline. With focused practice on the areas identified above,
              your next assessment could show measurable improvement across all six skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/test">
                <button className="flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer">
                  <RotateCcw className="h-4 w-4" />
                  Retake Assessment
                </button>
              </Link>
              <Link href={`/certificate/${verificationId}`}>
                <button className="flex items-center gap-2 rounded-xl px-6 py-3 glass-button text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                  <Award className="h-4 w-4" />
                  View Certificate
                </button>
              </Link>
            </div>
          </div>

          {/* ── PREMIUM UPGRADE CTA ── */}
          <div className="glass-card-neon p-6 md:p-8 light-streak">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="h-5 w-5 text-amber-400" />
                  <h2 className="text-lg font-semibold text-white">Unlock Your Full Potential with Premium</h2>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Your free report gives you an overview. Upgrade to <span className="text-purple-400 font-medium">Premium</span> for
                  unlimited assessments, detailed progress tracking over time, priority AI analysis, and peer comparisons.
                  Track your journey from {certificate.cefrLevel} to {nextLevel || 'C2'} with data-driven insights.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {[
                    '3 full assessments',
                    'Progress tracking dashboard',
                    'Priority AI analysis',
                    'Unlimited certificate downloads',
                    'Peer comparison',
                    'Full analytics suite',
                  ].map((feature) => (
                    <span key={feature} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                      <CheckCircle2 className="h-3 w-3" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0">
                <Link href="/pricing">
                  <button className="flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap">
                    <Sparkles className="h-4 w-4" />
                    Upgrade to Premium
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href={`/api/certificates/download/${verificationId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="glass-card p-5 cursor-pointer group text-center">
                <Download className="h-6 w-6 text-white/40 mx-auto mb-2 group-hover:text-purple-400 transition-colors" />
                <p className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">Download Certificate PDF</p>
              </div>
            </a>
            <Link href={`/certificate/${verificationId}`}>
              <div className="glass-card p-5 cursor-pointer group text-center">
                <Award className="h-6 w-6 text-white/40 mx-auto mb-2 group-hover:text-purple-400 transition-colors" />
                <p className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">View Certificate</p>
              </div>
            </Link>
            <Link href={`/verify/${verificationId}`} target="_blank">
              <div className="glass-card p-5 cursor-pointer group text-center">
                <Shield className="h-6 w-6 text-white/40 mx-auto mb-2 group-hover:text-purple-400 transition-colors" />
                <p className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">Verification Page</p>
              </div>
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
