import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Writing Assessment — TestCEFR',
  description:
    'Test your English writing skills with AI evaluation. Receive detailed feedback on grammar, coherence, and vocabulary usage.',
  openGraph: {
    title: 'Writing Assessment — TestCEFR',
    description:
      'Test your English writing skills with AI evaluation. Receive detailed feedback on grammar, coherence, and vocabulary usage.',
    url: 'https://www.testcefr.com/writing',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing Assessment — TestCEFR',
    description:
      'Test your English writing skills with AI evaluation. Receive detailed feedback on grammar, coherence, and vocabulary usage.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/writing',
  },
};

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
