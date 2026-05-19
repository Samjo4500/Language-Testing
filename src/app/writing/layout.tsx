import type { Metadata } from 'next';

// Force dynamic rendering to avoid prerender issues with client components
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'English Writing Test',
  description:
    'Excel in English writing with our AI-powered CEFR-aligned assessment. Evaluate coherence, grammar, vocabulary, and structure — get a precise A1–C2 rating with actionable feedback.',
  keywords: [
    'English writing test',
    'CEFR writing assessment',
    'writing skills',
    'English writing evaluation',
    'grammar check',
    'AI writing assessment',
    'English essay test',
  ],
  openGraph: {
    title: 'English Writing Test | TestCEFR',
    description:
      'Excel in English writing with our AI-powered CEFR-aligned assessment. Evaluate coherence, grammar, vocabulary, and structure for an accurate A1–C2 rating.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/writing',
  },
};

export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
