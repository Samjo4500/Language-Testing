import type { Metadata } from 'next';

// Force dynamic rendering to avoid prerender issues with client components
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the TestCEFR team. Have questions about our AI-powered English assessment, CEFR certification, or anything else? We’re here to help.',
  keywords: [
    'contact TestCEFR',
    'English test support',
    'CEFR assessment help',
    'customer support',
    'English proficiency inquiry',
  ],
  openGraph: {
    title: 'Contact Us | TestCEFR',
    description:
      'Get in touch with the TestCEFR team. Have questions about our AI-powered English assessment? We’re here to help.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
