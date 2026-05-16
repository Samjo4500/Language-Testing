import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speaking Assessment — TestCEFR',
  description:
    'Evaluate your English speaking skills with AI-powered assessment. Get feedback on fluency, pronunciation, and coherence.',
  openGraph: {
    title: 'Speaking Assessment — TestCEFR',
    description:
      'Evaluate your English speaking skills with AI-powered assessment. Get feedback on fluency, pronunciation, and coherence.',
    url: 'https://www.testcefr.com/speaking',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speaking Assessment — TestCEFR',
    description:
      'Evaluate your English speaking skills with AI-powered assessment. Get feedback on fluency, pronunciation, and coherence.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/speaking',
  },
};

export default function SpeakingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
