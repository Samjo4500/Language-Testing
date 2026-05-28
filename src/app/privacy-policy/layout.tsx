import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | TestCEFR',
  description:
    'Read the TestCEFR Privacy Policy to understand how we collect, use, and protect your personal data.',
  alternates: {
    canonical: 'https://testcefr.com/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | TestCEFR',
    description:
      'Read the TestCEFR Privacy Policy to understand how we collect, use, and protect your personal data.',
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
