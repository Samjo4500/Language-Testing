import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Listening Assessment - TestCEFR | AI-Powered English Listening Test',
  description:
    'Test your English listening comprehension with our AI-powered CEFR assessment. Evaluate your ability to understand spoken English across various accents and scenarios.',
  keywords: [
    'English listening test',
    'CEFR listening assessment',
    'listening comprehension',
    'English proficiency',
    'online listening test',
  ],
  openGraph: {
    title: 'Listening Assessment - TestCEFR',
    description:
      'AI-powered English listening comprehension test aligned with CEFR framework',
    url: 'https://www.testcefr.com/listening',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Listening Assessment - TestCEFR',
    description:
      'AI-powered English listening comprehension test aligned with CEFR framework',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/listening',
  },
};

export default function ListeningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
