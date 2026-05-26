import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'English Level Test',
  description:
    'Take the comprehensive CEFR English proficiency assessment covering reading, writing, listening, speaking, grammar, and vocabulary. Get your accurate A1–C2 score with AI-powered evaluation.',
  keywords: [
    'CEFR English test',
    'English level test',
    'English proficiency assessment',
    'online English test',
    'CEFR assessment',
    'English skills test',
    'A1 C2 English test',
  ],
  openGraph: {
    title: 'English Level Test | TestCEFR',
    description:
      'Take the comprehensive CEFR English proficiency assessment. Get your accurate A1–C2 score with AI-powered evaluation.',
  },
  robots: { index: false, follow: false },
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
