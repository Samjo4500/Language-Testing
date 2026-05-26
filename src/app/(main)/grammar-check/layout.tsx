import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grammar Checker',
  description:
    'Check your English grammar instantly with AI. Get corrections for grammar, spelling, punctuation, and style errors with detailed explanations and CEFR level assessment of your writing.',
  keywords: [
    'English grammar checker',
    'grammar corrector',
    'AI grammar check',
    'spelling checker',
    'punctuation checker',
    'writing improvement',
    'English grammar AI',
    'grammar correction tool',
  ],
  openGraph: {
    images: ['https://testcefr.com/og-image.png'],
    title: 'Grammar Checker | TestCEFR',
    description:
      'Check your English grammar instantly with AI. Get corrections for grammar, spelling, punctuation, and style errors with detailed explanations.',
  },
  alternates: {
    canonical: 'https://testcefr.com/grammar-check',
  },
};

export default function GrammarCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
