'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import AIWritingEditor, { AnalysisResult } from '@/components/AIWritingEditor';

const MOCK_ANALYZE = async (text: string): Promise<AnalysisResult> => {
  // Simulate a brief delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const wordCount = text.trim().split(/\s+/).length;

  // Derive a rough CEFR estimate from word count and text length
  let cefrEstimate = 'A2';
  if (wordCount > 200) cefrEstimate = 'C1';
  else if (wordCount > 120) cefrEstimate = 'B2';
  else if (wordCount > 60) cefrEstimate = 'B1';
  else if (wordCount > 25) cefrEstimate = 'A2';
  else cefrEstimate = 'A1';

  const grammarScore = Math.min(95, 50 + wordCount);
  const vocabScore = Math.min(90, 45 + wordCount);
  const coherenceScore = Math.min(88, 40 + wordCount);
  const styleScore = Math.min(85, 38 + wordCount);
  const overallScore = Math.round((grammarScore + vocabScore + coherenceScore + styleScore) / 4);

  // Find some simple patterns to highlight
  const highlights: AnalysisResult['highlights'] = [];
  const simpleWords = ['good', 'bad', 'nice', 'big', 'small', 'very', 'really'];
  simpleWords.forEach((word) => {
    const idx = text.toLowerCase().indexOf(word);
    if (idx !== -1) {
      highlights.push({
        start: idx,
        end: idx + word.length,
        type: 'Vocabulary',
        suggestion: `Consider a more precise alternative to "${word}"`,
      });
    }
  });

  return {
    overallScore,
    cefrEstimate,
    categories: [
      {
        name: 'Grammar',
        score: grammarScore,
        suggestions: grammarScore < 80
          ? [{ original: 'I has went', suggested: 'I have gone', reason: 'Present perfect requires the past participle "gone" with "have"', category: 'Grammar' }]
          : [],
      },
      {
        name: 'Vocabulary',
        score: vocabScore,
        suggestions: highlights.length > 0
          ? highlights.slice(0, 2).map((h) => ({
              original: text.slice(h.start, h.end),
              suggested: 'more precise term',
              reason: h.suggestion,
              category: 'Vocabulary',
            }))
          : [],
      },
      {
        name: 'Coherence',
        score: coherenceScore,
        suggestions: coherenceScore < 75
          ? [{ original: 'And then', suggested: 'Furthermore', reason: 'Use formal transition words to improve coherence between ideas', category: 'Coherence' }]
          : [],
      },
      {
        name: 'Style',
        score: styleScore,
        suggestions: [],
      },
    ],
    highlights,
  };
};

const INITIAL_TEXT = `Technology has transformed the way we learn languages. With AI-powered tools, students can now practice speaking, writing, and listening at any time. These tools provide instant feedback and personalized learning paths.

However, it is important to remember that technology is just a tool. The most effective language learning still requires dedication, consistency, and real-world practice. Combining AI assistance with human interaction creates the best results.`;

export default function WritingEditorPage() {
  const handleSave = (text: string) => {
    // In a real app this would persist to a backend
    console.log('Saved text:', text.length, 'chars');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">AI Writing Editor</h1>
            <p className="text-white/50">Write, analyze, and improve your English with AI-powered feedback</p>
          </div>
          <AIWritingEditor
            initialText={INITIAL_TEXT}
            onAnalyze={MOCK_ANALYZE}
            onSave={handleSave}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
