import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - TestCEFR',
  description:
    'Learn how TestCEFR protects your personal data and privacy. Our policy covers data collection, storage, processing, and your rights under GDPR and international regulations.',
  keywords: [
    'privacy policy',
    'data protection',
    'GDPR',
    'personal data',
    'testcefr privacy',
    'data security',
  ],
  openGraph: {
    title: 'Privacy Policy - TestCEFR',
    description:
      'How TestCEFR protects your personal data and privacy under GDPR',
    url: 'https://www.testcefr.com/privacy',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - TestCEFR',
    description:
      'How TestCEFR protects your personal data and privacy under GDPR',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/privacy',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
