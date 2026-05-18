import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'English Reading Test',
  description:
    'Improve your English reading comprehension with our AI-powered CEFR-aligned reading assessment. From short messages to academic texts, get an accurate A1–C2 level rating.',
  keywords: [
    'English reading test',
    'CEFR reading assessment',
    'reading comprehension',
    'English reading skills',
    'online reading test',
    'AI reading assessment',
  ],
  openGraph: {
    title: 'English Reading Test | TestCEFR',
    description:
      'Improve your English reading comprehension with our AI-powered CEFR-aligned assessment. Get an accurate A1–C2 level rating.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/reading',
  },
};

export default function ReadingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
