import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Writing Assessment - TestCEFR | AI-Powered English Writing Test',
  description:
    'Evaluate your English writing skills with AI-powered assessment. Get detailed feedback on grammar, coherence, vocabulary usage, and overall writing proficiency aligned with CEFR levels.',
  keywords: [
    'English writing test',
    'CEFR writing assessment',
    'writing evaluation',
    'grammar check',
    'writing proficiency',
    'English writing skills',
  ],
  openGraph: {
    title: 'Writing Assessment - TestCEFR',
    description:
      'AI-powered English writing evaluation with grammar checking and coherence analysis',
    url: 'https://www.testcefr.com/writing',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing Assessment - TestCEFR',
    description:
      'AI-powered English writing evaluation with grammar checking and coherence analysis',
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
