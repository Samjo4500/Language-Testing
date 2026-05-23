import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description:
    'Create your free TestCEFR account and start your English proficiency journey. Get AI-powered CEFR assessments with QR-verified certificates recognized worldwide.',
  keywords: [
    'register',
    'create account',
    'sign up',
    'free English test account',
    'CEFR test registration',
    'English assessment sign up',
  ],
  openGraph: {
    title: 'Create Account | TestCEFR',
    description:
      'Create your free TestCEFR account and start your English proficiency journey with AI-powered CEFR assessments.',
  },
  alternates: {
    canonical: 'https://testcefr.com/register',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
