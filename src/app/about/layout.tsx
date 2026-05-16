import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About TestCEFR — AI-Powered English Assessment',
  description:
    'Learn about TestCEFR, the AI-powered English proficiency assessment platform aligned with the CEFR framework.',
  openGraph: {
    title: 'About TestCEFR — AI-Powered English Assessment',
    description:
      'Learn about TestCEFR, the AI-powered English proficiency assessment platform aligned with the CEFR framework.',
    url: 'https://www.testcefr.com/about',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About TestCEFR — AI-Powered English Assessment',
    description:
      'Learn about TestCEFR, the AI-powered English proficiency assessment platform aligned with the CEFR framework.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
