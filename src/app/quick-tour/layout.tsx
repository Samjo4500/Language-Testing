import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works - TestCEFR | 6-Step CEFR Certification Process',
  description:
    'Learn how TestCEFR works in 6 simple steps — from sign-up to receiving your QR-verified CEFR proficiency certificate. Fast, accurate, and internationally recognized.',
  keywords: [
    'CEFR certification process',
    'how to get CEFR certificate',
    'English test steps',
    'CEFR assessment guide',
    'online English certification',
  ],
  openGraph: {
    title: 'How It Works - TestCEFR',
    description:
      '6 simple steps from sign-up to your QR-verified CEFR proficiency certificate',
    url: 'https://www.testcefr.com/quick-tour',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works - TestCEFR',
    description:
      '6 simple steps from sign-up to your QR-verified CEFR proficiency certificate',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/quick-tour',
  },
};

export default function QuickTourLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
