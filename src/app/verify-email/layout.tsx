import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email — TestCEFR',
  description: 'Verify your email address to activate your TestCEFR account.',
  robots: { index: false, follow: true },
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
