import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the TestCEFR Privacy Policy to understand how we collect, use, and protect your personal information. We are fully committed to GDPR compliance and data security.',
  keywords: [
    'privacy policy',
    'data protection',
    'GDPR compliance',
    'TestCEFR privacy',
    'data security',
    'personal information',
  ],
  openGraph: {
    title: 'Privacy Policy | TestCEFR',
    description:
      'Understand how TestCEFR collects, uses, and protects your personal information. Fully GDPR compliant.',
  },
  alternates: {
    canonical: 'https://testcefr.com/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
