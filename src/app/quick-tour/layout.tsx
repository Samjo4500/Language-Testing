import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Tour — How It Works',
  description:
    'Discover how TestCEFR works in 6 simple steps — from creating your free account to downloading a QR-verified CEFR certificate. Start your English proficiency journey today.',
  keywords: [
    'CEFR test guide',
    'how TestCEFR works',
    'English test process',
    'CEFR certification steps',
    'quick tour',
    'English proficiency test guide',
  ],
  openGraph: {
    title: 'Quick Tour — How It Works | TestCEFR',
    description:
      'Discover how TestCEFR works in 6 simple steps — from creating your account to downloading a QR-verified CEFR certificate.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/quick-tour',
  },
};

export default function QuickTourLayout({ children }: { children: React.ReactNode }) {
  return children;
}
