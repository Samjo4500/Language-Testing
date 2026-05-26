import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Up Your Profile | TestCEFR',
  description: 'Complete your profile to get the most out of your TestCEFR experience.',
  robots: { index: false, follow: true },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
