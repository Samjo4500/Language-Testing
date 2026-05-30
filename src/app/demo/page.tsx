'use client';

import React from 'react';
import { Navbar } from '@/components/navbar';
import GamificationDashboard from '@/components/GamificationDashboard';
import { LexiMemoryProvider, useLexiMemory } from '@/components/LexiMemoryProvider';
import SRSVocabularyReview, { DEMO_SRS_CARDS } from '@/components/SRSVocabularyReview';
import type { ReviewResult } from '@/components/SRSVocabularyReview';
import Phase3Page from '@/components/Phase3Page';
import Phase2Showcase from '@/components/Phase2Showcase';
import {
  Sparkles, Brain, BookOpen, Target,
  ChevronRight, MessageSquare, BarChart3, Zap,
  Volume2
} from 'lucide-react';

/* ============================================================
   LEXI MEMORY DEMO SECTION — must be inside provider
   ============================================================ */
function LexiMemoryDemo() {
  const {
    addConversation,
    updateWeakArea,
    getPersonalizedGreeting,
    getSuggestedPractice,
    getConversationContext,
    conversations,
    weakAreas,
    preferences,
  } = useLexiMemory();

  const greeting = getPersonalizedGreeting();
  const suggestions = getSuggestedPractice();
  const contextPreview = getConversationContext().split('\n').slice(0, 3).join('\n');

  const handleDemoConversation = () => {
    const topics = ['Grammar', 'Vocabulary', 'Pronunciation', 'Reading', 'Writing'];
    const sentiments: Array<'positive' | 'neutral' | 'negative' | 'frustrated'> = ['positive', 'neutral', 'negative', 'frustrated'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    const userMessages: Record<string, string> = {
      Grammar: 'I keep mixing up past simple and present perfect',
      Vocabulary: 'Can you help me learn more academic words?',
      Pronunciation: 'How do I pronounce "thorough" correctly?',
      Reading: 'I struggle with long texts in English',
      Writing: 'My essays always feel disorganized',
    };

    const lexiResponses: Record<string, string> = {
      Grammar: "Let's work on that! Past simple is for completed actions, while present perfect connects past to present. Try: 'I went to Paris' vs 'I have been to Paris'.",
      Vocabulary: "Great goal! Let's start with academic vocabulary groups. I'll introduce words in context so they stick better.",
      Pronunciation: "'Thorough' is pronounced /ˈθʌr.ə/ — think 'thur-uh'. The key is the 'th' sound with your tongue between your teeth.",
      Reading: "Let's try skimming techniques. First read the first and last sentence of each paragraph — they usually contain the main idea.",
      Writing: "A strong essay needs a clear structure: intro with thesis, 2-3 body paragraphs with topic sentences, and a conclusion. Let me show you a template.",
    };

    addConversation(
      userMessages[topic],
      lexiResponses[topic],
      topic,
      sentiment
    );
  };

  const handleDemoWeakArea = () => {
    const skills = ['Reading', 'Writing', 'Listening', 'Speaking', 'Grammar', 'Vocabulary'];
    const topics: Record<string, string[]> = {
      Reading: ['Inference', 'Skimming', 'Detail comprehension'],
      Writing: ['Coherence', 'Lexical resource', 'Task achievement'],
      Listening: ['Note completion', 'Multiple choice', 'Short answers'],
      Speaking: ['Fluency', 'Pronunciation', 'Interactive communication'],
      Grammar: ['Tenses', 'Conditionals', 'Articles'],
      Vocabulary: ['Collocations', 'Phrasal verbs', 'Academic words'],
    };

    const skill = skills[Math.floor(Math.random() * skills.length)];
    const topicList = topics[skill];
    const topic = topicList[Math.floor(Math.random() * topicList.length)];
    const score = Math.round((Math.random() * 0.5 + 0.2) * 100) / 100;

    updateWeakArea(skill, topic, score);
  };

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div className="glass-card p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Lexi says:</p>
            <p className="text-sm text-white/60 mt-1 leading-relaxed">{greeting}</p>
          </div>
        </div>
      </div>

      {/* Suggested Practice */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Suggested Practice</h3>
        </div>
        <div className="space-y-2">
          {suggestions.slice(0, 4).map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 text-[10px] font-bold">
                {s.skill.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/70">{s.skill} — {s.topic}</p>
                <p className="text-[10px] text-white/30 truncate">{s.reason}</p>
              </div>
              <ChevronRight className="h-3 w-3 text-white/20 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <MessageSquare className="h-4 w-4 text-blue-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{conversations.length}</p>
          <p className="text-[10px] text-white/30">Conversations</p>
        </div>
        <div className="glass-card p-4 text-center">
          <BarChart3 className="h-4 w-4 text-purple-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{weakAreas.length}</p>
          <p className="text-[10px] text-white/30">Weak Areas</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Sparkles className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{preferences.cefrLevel}</p>
          <p className="text-[10px] text-white/30">CEFR Level</p>
        </div>
      </div>

      {/* Demo Actions */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-3.5 w-3.5 text-violet-400" />
          <h3 className="text-xs font-semibold text-white">Demo Actions</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDemoConversation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/70 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:text-white transition-all duration-200 cursor-pointer"
          >
            <MessageSquare className="h-3 w-3" />
            Add Conversation
          </button>
          <button
            onClick={handleDemoWeakArea}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/70 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:text-white transition-all duration-200 cursor-pointer"
          >
            <BarChart3 className="h-3 w-3" />
            Add Weak Area
          </button>
        </div>
      </div>

      {/* Context Preview */}
      {contextPreview && contextPreview !== 'No previous conversation history.' && (
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="h-3.5 w-3.5 text-blue-400" />
            <h3 className="text-xs font-semibold text-white">Recent Context</h3>
          </div>
          <pre className="text-[10px] text-white/30 whitespace-pre-wrap leading-relaxed font-mono max-h-24 overflow-y-auto custom-scrollbar">
            {contextPreview}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DEMO PAGE — Component Showcase (accessible at /demo)
   ============================================================ */
export default function DemoPage() {
  const handleReviewComplete = (results: ReviewResult[]) => {
    console.log('SRS Review complete:', results);
  };

  return (
    <LexiMemoryProvider userId="demo-user">
      <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
        <Navbar />

        <main className="flex-1 pt-24 pb-16">
          {/* ===== HERO ===== */}
          <section className="relative py-12 md:py-20 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="orb orb-cyan w-[400px] h-[400px] top-0 left-0 animate-float-slow" />
              <div className="orb orb-blue w-[300px] h-[300px] bottom-0 right-0 animate-float-reverse" />
            </div>

            <div className="container relative mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-4 py-1.5 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-xs font-medium uppercase tracking-wider">Component Showcase</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Developer
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Demo Lab
                </span>
              </h1>
              <p className="mt-4 text-white/40 max-w-xl mx-auto text-base leading-relaxed">
                Interactive component demos for testing gamification, AI memory, and spaced repetition features.
              </p>
            </div>
          </section>

          {/* ===== GAMIFICATION DASHBOARD ===== */}
          <section className="relative py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                  <Zap className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-white">Gamification Dashboard</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
              </div>
              <GamificationDashboard />
            </div>
          </section>

          {/* ===== TWO-COLUMN: Lexi Memory + SRS Review ===== */}
          <section className="relative py-8 md:py-12 dark-section-alt hero-pattern noise-overlay">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Lexi Memory */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      <Brain className="h-4 w-4" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Lexi&apos;s Memory</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                  </div>
                  <LexiMemoryDemo />
                </div>

                {/* SRS Vocabulary Review */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <h2 className="text-xl font-bold text-white">SRS Vocabulary Review</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                  </div>
                  <SRSVocabularyReview cards={DEMO_SRS_CARDS} onComplete={handleReviewComplete} />
                </div>
              </div>
            </div>
          </section>
          {/* ===== PHASE 3 & 4: Advanced Features ===== */}
          <Phase3Page />

          {/* ===== PHASE 2: Adaptive Learning, Speech Analytics, AI Writing ===== */}
          <Phase2Showcase />
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-white/[0.04] py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} TestCEFR — AI-Powered English Assessment
            </p>
          </div>
        </footer>
      </div>
    </LexiMemoryProvider>
  );
}
