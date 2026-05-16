import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — TestCEFR',
  description:
    'Sign in to your TestCEFR account to access your assessments and certificates.',
  openGraph: {
    title: 'Login — TestCEFR',
    description:
      'Sign in to your TestCEFR account to access your assessments and certificates.',
    url: 'https://www.testcefr.com/login',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login — TestCEFR',
    description:
      'Sign in to your TestCEFR account to access your assessments and certificates.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
