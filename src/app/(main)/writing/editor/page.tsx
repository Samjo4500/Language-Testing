'use client';

import { useCallback } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import AIWritingEditor, { AnalysisResult } from '@/components/AIWritingEditor';

const MOCK_ANALYSIS: AnalysisResult = {
  overallScore: 72,
  cefrEstimate: 'B1',
  categories: [
    {
      name: 'Grammar',
      score: 70,
      suggestions: [
        { original: 'I goes', suggested: 'I go', reason: 'Subject-verb agreement: first person uses "go"', category: 'Grammar' },
        { original: 'she have', suggested: 'she has', reason: 'Third person singular requires "has"', category: 'Grammar' },
      ],
    },
    {
      name: 'Vocabulary',
      score: 75,
      suggestions: [
        { original: 'very good', suggested: 'excellent', reason: 'More precise vocabulary choice', category: 'Vocabulary' },
        { original: 'big', suggested: 'significant', reason: 'More formal alternative for academic writing', category: 'Vocabulary' },
      ],
    },
    {
      name: 'Coherence',
      score: 68,
      suggestions: [
        { original: 'And then', suggested: 'Furthermore', reason: 'More formal transition for academic writing', category: 'Coherence' },
      ],
    },
  ],
  highlights: [
    { start: 0, end: 6, type: 'grammar', suggestion: 'Check subject-verb agreement' },
    { start: 15, end: 24, type: 'vocabulary', suggestion: 'Consider a more precise word' },
  ],
};

export default function WritingEditorPage() {
  const handleAnalyze = useCallback(async (text: string): Promise<AnalysisResult> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
      ...MOCK_ANALYSIS,
      overallScore: Math.min(100, Math.max(40, MOCK_ANALYSIS.overallScore + Math.floor(Math.random() * 10 - 5))),
    };
  }, []);

  const handleSave = useCallback((text: string) => {
    // In production, save to backend
    console.log('Draft saved:', text.substring(0, 100) + '...');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">AI Writing Editor</h1>
            <p className="text-white/50">Write, refine, and improve your English with AI-powered feedback</p>
          </div>
          <AIWritingEditor onAnalyze={handleAnalyze} onSave={handleSave} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
