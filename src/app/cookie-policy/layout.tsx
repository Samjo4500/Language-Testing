import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | TestCEFR',
  description:
    'Learn how TestCEFR uses cookies and similar technologies. We explain what cookies we set, why we use them, and how you can control your preferences.',
  alternates: {
    canonical: 'https://testcefr.com/cookie-policy',
  },
  openGraph: {
    title: 'Cookie Policy | TestCEFR',
    description:
      'Learn how TestCEFR uses cookies and similar technologies. We explain what cookies we set, why we use them, and how you can control your preferences.',
  },
};

export default function CookiePolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
