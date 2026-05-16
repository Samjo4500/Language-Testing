import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — TestCEFR',
  description:
    'Review the terms of service for using the TestCEFR English proficiency assessment platform.',
  openGraph: {
    title: 'Terms of Service — TestCEFR',
    description:
      'Review the terms of service for using the TestCEFR English proficiency assessment platform.',
    url: 'https://www.testcefr.com/terms',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service — TestCEFR',
    description:
      'Review the terms of service for using the TestCEFR English proficiency assessment platform.',
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
