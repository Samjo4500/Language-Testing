import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About TestCEFR',
  description:
    'Learn about TestCEFR — democratizing English proficiency assessment through AI technology. Our mission is to make accurate, affordable CEFR certification accessible to everyone worldwide.',
  keywords: [
    'about TestCEFR',
    'CEFR assessment platform',
    'AI English test',
    'English proficiency assessment',
    'language testing technology',
    'online English certification',
  ],
  openGraph: {
    images: ["https://www.testcefr.com/og-image.png"],
    title: 'About TestCEFR',
    description:
      'Democratizing English proficiency assessment through AI technology. Make accurate, affordable CEFR certification accessible worldwide.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
