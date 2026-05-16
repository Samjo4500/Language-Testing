import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account — TestCEFR',
  description:
    'Create a free TestCEFR account and start your AI-powered English proficiency assessment.',
  openGraph: {
    title: 'Create Account — TestCEFR',
    description:
      'Create a free TestCEFR account and start your AI-powered English proficiency assessment.',
    url: 'https://www.testcefr.com/register',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Account — TestCEFR',
    description:
      'Create a free TestCEFR account and start your AI-powered English proficiency assessment.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/register',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
