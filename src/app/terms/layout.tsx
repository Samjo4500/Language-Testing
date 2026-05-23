import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the TestCEFR Terms of Service to understand your rights and responsibilities when using our AI-powered English proficiency assessment platform.',
  keywords: [
    'terms of service',
    'terms and conditions',
    'user agreement',
    'TestCEFR terms',
    'legal terms',
    'platform usage',
  ],
  openGraph: {
    title: 'Terms of Service | TestCEFR',
    description:
      'Understand your rights and responsibilities when using the TestCEFR AI-powered English proficiency assessment platform.',
  },
  alternates: {
    canonical: 'https://testcefr.com/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
