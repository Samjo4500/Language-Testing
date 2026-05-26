import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vocabulary Trainer',
  description:
    'Build your English vocabulary with AI-powered spaced repetition flashcards. Learn words by CEFR level (A1–C2), track progress with smart review scheduling, and master new words faster.',
  keywords: [
    'English vocabulary trainer',
    'spaced repetition',
    'vocabulary flashcards',
    'learn English words',
    'CEFR vocabulary',
    'English word practice',
    'vocabulary builder',
    'language learning app',
  ],
  openGraph: {
    images: ['https://testcefr.com/og-image.png'],
    title: 'Vocabulary Trainer | TestCEFR',
    description:
      'Build your English vocabulary with AI-powered spaced repetition flashcards. Learn words by CEFR level and master new words faster.',
  },
  alternates: {
    canonical: 'https://testcefr.com/vocabulary',
  },
};

export default function VocabularyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
