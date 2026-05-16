import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About TestCEFR | AI-Powered English Proficiency Assessment',
  description:
    'Learn about TestCEFR — our mission to make English proficiency assessment accessible, accurate, and affordable through cutting-edge AI technology and the CEFR framework.',
  keywords: [
    'about testcefr',
    'English assessment platform',
    'AI English test',
    'CEFR assessment technology',
    'language proficiency platform',
  ],
  openGraph: {
    title: 'About TestCEFR',
    description:
      'Our mission: accessible, accurate English proficiency assessment powered by AI',
    url: 'https://www.testcefr.com/about',
    siteName: 'TestCEFR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About TestCEFR',
    description:
      'Our mission: accessible, accurate English proficiency assessment powered by AI',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
