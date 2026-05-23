import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your TestCEFR account to continue your English proficiency journey. Access your assessments, certificates, and progress dashboard.',
  keywords: [
    'login',
    'sign in',
    'TestCEFR account',
    'English test login',
    'assessment login',
  ],
  openGraph: {
    title: 'Sign In | TestCEFR',
    description:
      'Sign in to your TestCEFR account to access your assessments, certificates, and progress dashboard.',
  },
  alternates: {
    canonical: 'https://testcefr.com/login',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
