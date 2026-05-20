'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Award, BarChart3, ArrowRight, BookOpen, Headphones, Mic, PenTool,
  Brain, Sparkles, CheckCircle2, TrendingUp, Target, Lightbulb,
  Zap, RotateCcw, Crown, Download, Shield, QrCode,
  ChevronDown, ChevronUp, Eye, AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useHydrated } from '@/hooks/use-hydrated';

/* ======================================================
   DEMO DATA
   ====================================================== */
const DEMO_CERT = {
  userName: 'John Doe',
  cefrLevel: 'B2',
  score: 82,
  completedAt: '2026-03-04',
  verificationId: 'TCFR-2026-B2-DEMO',
  skills: {
    reading: 84,
    writing: 78,
    listening: 75,
    speaking: 70,
    grammar: 85,
    vocabulary: 88,
  } as Record<string, number>,
};

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
    description: 'You can understand and use familiar everyday expressions and very basic phrases aimed at the satisfaction of needs of a concrete type. You can introduce yourself and others and can ask and answer questions about personal details.',
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
    description: 'You can understand sentences and frequently used expressions related to areas of most immediate relevance. You can communicate in simple and routine tasks requiring a simple and direct exchange of information.',
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
    description: 'You can understand the main points of clear standard input on familiar matters regularly encountered in work, school, and leisure. You can deal with most situations likely to arise while travelling in an area where the language is spoken.',
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
    description: 'You can understand with ease virtually everything heard or read. You can summarize information from different spoken and written sources, reconstructing arguments and accounts in a coherent presentation. You can express yourself spontaneously, very fluently and precisely.',
    canDo: [
      'Understand virtually everything heard or read with ease',
      'Summarize and reconstruct information from various sources',
      'Express yourself spontaneously, fluently, and precisely',
      'Differentiate finer shades of meaning in complex situations',
      'Produce sophisticated texts with native-level command of the language',
    ],
  },
};

const SKILL_ICONS: Record<string, React.ReactNode> = {
  reading: <BookOpen className="h-5 w-5" />,
  writing: <PenTool className="h-5 w-5" />,
  listening: <Headphones className="h-5 w-5" />,
  speaking: <Mic className="h-5 w-5" />,
  grammar: <BarChart3 className="h-5 w-5" />,
  vocabulary: <Brain className="h-5 w-5" />,
};

const SKILL_COLORS: Record<string, string> = {
  reading: 'from-blue-400 to-cyan-500',
  writing: 'from-violet-400 to-purple-500',
  listening: 'from-green-400 to-emerald-500',
  speaking: 'from-orange-400 to-amber-500',
  grammar: 'from-purple-400 to-pink-500',
  vocabulary: 'from-cyan-400 to-blue-500',
};

const SKILL_LABELS: Record<string, string> = {
  reading: 'Reading',
  writing: 'Writing',
  listening: 'Listening',
  speaking: 'Speaking',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
};

const SKILL_TIPS: Record<string, { tips: string[]; resources: string[] }> = {
  reading: {
    tips: [
      'Expand to newspaper articles, blog posts, and short stories to encounter richer vocabulary.',
      'Practice skimming for main ideas first, then scanning for specific details.',
      'Read opinion pieces and editorials to develop understanding of implied meaning and tone.',
      'Summarize each paragraph in your own words to check comprehension.',
    ],
    resources: ['Oxford Bookworms graded readers', 'BBC Learning English', 'News in Levels', 'Project Gutenberg free ebooks'],
  },
  writing: {
    tips: [
      'Write opinion paragraphs using the structure: claim, evidence, explanation, and conclusion.',
      'Practice linking ideas with transition words (however, furthermore, in contrast).',
      'Write both formal and informal versions of the same message to develop register awareness.',
      'Get feedback on your writing from native speakers or language exchange partners.',
    ],
    resources: ['Grammarly for grammar checking', 'Hemingway Editor for clarity', 'Write & Improve', 'Purdue OWL writing resources'],
  },
  listening: {
    tips: [
      'Move to authentic content: TED Talks, news broadcasts, and interviews with varied accents.',
      'Practice listening for main ideas first, then details.',
      'Try dictation exercises: write down exactly what you hear, then check against the transcript.',
      'Listen to conversations between multiple speakers to practice following different voices.',
    ],
    resources: ['BBC 6 Minute English', 'TED Talks', 'ESL Pod', 'BBC Learning English podcasts'],
  },
  speaking: {
    tips: [
      'Practice giving 1-2 minute impromptu speeches on random topics to build fluency.',
      'Record yourself describing a process or telling a story, then analyze your pauses and filler words.',
      'Practice using intonation to express different emotions and attitudes in your speech.',
      'Join conversation groups or language exchange sessions to practice real-time interaction.',
    ],
    resources: ['Elsa Speak for pronunciation', 'iTalki for conversation practice', 'Shadowing technique videos', 'Recording and self-review'],
  },
  grammar: {
    tips: [
      'Study conditionals (zero, first, second, third) and practice using them in context.',
      'Learn the difference between definite and indefinite articles and when to omit them.',
      'Practice passive voice, reported speech, and relative clauses in your writing.',
      'Study modal verbs of deduction, obligation, and advice for more nuanced expression.',
    ],
    resources: ['English Grammar in Use (Murphy)', 'Grammarly for real-time feedback', 'Perfect English Grammar website', 'Cambridge Grammar reference books'],
  },
  vocabulary: {
    tips: [
      'Expand from high-frequency words to the 3,000-5,000 word range needed for B2 level.',
      'Study word families: if you learn "decide," also learn decision, decisive, decisively.',
      'Practice collocations — learn which words naturally go together.',
      'Start using a monolingual English dictionary to understand nuance and usage.',
    ],
    resources: ['Anki flashcard app', 'Quizlet vocabulary sets', 'Vocabulary.com', 'Oxford 3000/5000 word lists'],
  },
};

/* Expandable skill section */
function SkillDetailSection({ skill, score }: { skill: string; score: number }) {
  const [expanded, setExpanded] = useState(false);
  const tips = SKILL_TIPS[skill];
  if (!tips) return null;

  const tier = score < 40 ? 'Foundation' : score < 70 ? 'Development' : 'Refinement';

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 cursor-pointer group gap-3 sm:gap-0"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br ${SKILL_COLORS[skill] || 'from-gray-400 to-gray-500'} text-white shadow-lg`}>
            {SKILL_ICONS[skill] || <BarChart3 className="h-5 w-5" />}
          </div>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-semibold text-white">{SKILL_LABELS[skill] || skill}</h3>
            <p className="text-xs text-white/40 mt-0.5">{tier} level recommendations</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 ml-13 sm:ml-0">
          <div className="flex items-center gap-2">
            <div className="w-16 sm:w-24 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${SKILL_COLORS[skill] || 'from-gray-400 to-gray-500'} transition-all duration-700`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className={`text-xs sm:text-sm font-bold ${score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
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

      {expanded && (
        <div className="px-5 pb-5 animate-slide-down">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Improvement Tips</h4>
            </div>
            <div className="space-y-2.5">
              {tips.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/40 text-[10px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-white/60 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-purple-400" />
              <h4 className="text-sm font-semibold text-white">Recommended Resources</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {tips.resources.map((resource, i) => (
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

export default function SampleReportPage() {
  const mounted = useHydrated();

  const levelInfo = CEFR_LEVELS[DEMO_CERT.cefrLevel];
  const skills = DEMO_CERT.skills;
  const skillEntries = Object.entries(skills);

  const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const currentIdx = levelOrder.indexOf(DEMO_CERT.cefrLevel);
  const nextLevel = currentIdx < levelOrder.length - 1 ? levelOrder[currentIdx + 1] : null;
  const nextLevelInfo = nextLevel ? CEFR_LEVELS[nextLevel] : null;

  const sortedSkills = [...skillEntries].sort(([_, a], [__, b]) => a - b);
  const weakestSkill = sortedSkills[0];
  const strongestSkill = sortedSkills[sortedSkills.length - 1];

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />

      {/* ── Sample Banner ── */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <Eye className="h-4 w-4 text-purple-300" />
          <span className="text-xs sm:text-sm text-purple-200 font-medium">Sample Report Preview</span>
          <span className="text-purple-300/50 mx-1 hidden sm:inline">&mdash;</span>
          <span className="text-xs sm:text-sm text-white/50">This is a demo. <Link href="/register" className="text-purple-300 hover:text-purple-200 underline underline-offset-2">Create an account</Link> to get your own.</span>
        </div>
      </div>

      <div className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">

          {/* ── REPORT HEADER ── */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${levelInfo.gradient} flex items-center justify-center shadow-lg shadow-purple-500/30`}>
                  <span className="text-white text-2xl font-bold">{DEMO_CERT.cefrLevel}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">CEFR Assessment Report</h1>
                  </div>
                  <p className="text-white/50 text-sm">
                    {DEMO_CERT.userName} &middot; March 4, 2026
                  </p>
                  <p className="text-white/30 text-xs mt-0.5 font-mono">
                    Verification ID: {DEMO_CERT.verificationId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-center">
                  <p className={`text-2xl sm:text-3xl font-bold ${levelInfo.textColor}`}>{DEMO_CERT.score}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Overall Score</p>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{DEMO_CERT.cefrLevel}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">CEFR Level</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── LEVEL DESCRIPTION ── */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-purple-400" />
              <h2 className="text-base sm:text-lg font-semibold text-white">Your Level: {DEMO_CERT.cefrLevel} — {levelInfo.title}</h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {levelInfo.description}
            </p>

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

          {/* ── SKILL BREAKDOWN ── */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Skill Breakdown</h2>
            </div>

            <div className="space-y-4">
              {skillEntries.map(([skill, value]) => {
                const color = SKILL_COLORS[skill] || 'from-gray-400 to-gray-500';
                const icon = SKILL_ICONS[skill] || <BarChart3 className="h-5 w-5" />;
                return (
                  <div key={skill} className="flex items-center gap-4">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white shadow-lg`}>
                      {icon}
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
                          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
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
                <SkillDetailSection key={skill} skill={skill} score={value} />
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
                To advance from <span className="text-white font-medium">{DEMO_CERT.cefrLevel}</span> to{' '}
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
              <Link href="/register">
                <button className="flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer">
                  <RotateCcw className="h-4 w-4" />
                  Start Your Assessment
                </button>
              </Link>
              <Link href="/sample-certificate">
                <button className="flex items-center gap-2 rounded-xl px-6 py-3 glass-button text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                  <Award className="h-4 w-4" />
                  View Sample Certificate
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
                  Track your journey from {DEMO_CERT.cefrLevel} to {nextLevel || 'C2'} with data-driven insights.
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
                  <button className="flex items-center gap-2 rounded-xl px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap">
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
            <Link href="/sample-certificate">
              <div className="glass-card p-5 cursor-pointer group text-center">
                <Download className="h-6 w-6 text-white/40 mx-auto mb-2 group-hover:text-purple-400 transition-colors" />
                <p className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">View Sample Certificate</p>
              </div>
            </Link>
            <Link href="/verify/DEMO">
              <div className="glass-card p-5 cursor-pointer group text-center">
                <Shield className="h-6 w-6 text-white/40 mx-auto mb-2 group-hover:text-purple-400 transition-colors" />
                <p className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">Certificate Verification</p>
              </div>
            </Link>
            <Link href="/quick-tour">
              <div className="glass-card p-5 cursor-pointer group text-center">
                <QrCode className="h-6 w-6 text-white/40 mx-auto mb-2 group-hover:text-purple-400 transition-colors" />
                <p className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">Quick Tour</p>
              </div>
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
