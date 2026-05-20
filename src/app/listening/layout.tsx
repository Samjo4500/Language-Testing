import type { Metadata } from 'next';

// Force dynamic rendering to avoid prerender issues with client components
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'English Listening Test',
  description:
    'Sharpen your English listening comprehension with our AI-powered CEFR-aligned listening assessment. From casual conversations to academic lectures, get an accurate A1–C2 level rating.',
  keywords: [
    'English listening test',
    'CEFR listening assessment',
    'listening comprehension',
    'English listening skills',
    'online listening test',
    'AI listening assessment',
  ],
  openGraph: {
    images: ["https://www.testcefr.com/og-image.png"],
    title: 'English Listening Test | TestCEFR',
    description:
      'Sharpen your English listening comprehension with our AI-powered CEFR-aligned assessment. Get an accurate A1–C2 level rating.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/listening',
  },
};

export default function ListeningLayout({ children }: { children: React.ReactNode }) {
  return children;
}
