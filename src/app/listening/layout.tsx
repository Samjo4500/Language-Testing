import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Listening Assessment — TestCEFR',
  description:
    'Assess your English listening comprehension with our AI-powered test. Understand conversations, lectures, and natural speech.',
  openGraph: {
    title: 'Listening Assessment — TestCEFR',
    description:
      'Assess your English listening comprehension with our AI-powered test. Understand conversations, lectures, and natural speech.',
    url: 'https://www.testcefr.com/listening',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Listening Assessment — TestCEFR',
    description:
      'Assess your English listening comprehension with our AI-powered test. Understand conversations, lectures, and natural speech.',
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
