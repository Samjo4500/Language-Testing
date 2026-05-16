import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speaking Assessment - TestCEFR | AI-Powered English Speaking Test',
  description:
    'Assess your English speaking skills with AI-powered speech recognition and pronunciation scoring. Get detailed fluency analysis and CEFR-aligned proficiency ratings.',
  keywords: [
    'English speaking test',
    'CEFR speaking assessment',
    'pronunciation test',
    'English fluency',
    'speaking evaluation',
    'oral proficiency test',
  ],
  openGraph: {
    title: 'Speaking Assessment - TestCEFR',
    description:
      'AI-powered English speaking assessment with speech recognition and pronunciation scoring',
    url: 'https://www.testcefr.com/speaking',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speaking Assessment - TestCEFR',
    description:
      'AI-powered English speaking assessment with speech recognition and pronunciation scoring',
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
