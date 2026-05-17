import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - TestCEFR',
  description:
    'Read the TestCEFR terms of service including usage policies, payment terms, certificate validity, and user responsibilities for our English proficiency assessment platform.',
  keywords: [
    'terms of service',
    'terms and conditions',
    'testcefr terms',
    'usage policy',
    'assessment terms',
  ],
  openGraph: {
    title: 'Terms of Service - TestCEFR',
    description:
      'TestCEFR terms of service — usage policies, payment terms, and user responsibilities',
    url: 'https://www.testcefr.com/terms',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - TestCEFR',
    description:
      'TestCEFR terms of service — usage policies, payment terms, and user responsibilities',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/terms',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
