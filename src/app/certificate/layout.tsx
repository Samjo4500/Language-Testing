import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CEFR Certificate — TestCEFR',
  description: 'View and verify your CEFR English proficiency certificate. Each certificate includes a unique QR code for instant verification.',
  openGraph: {
    title: 'CEFR Certificate — TestCEFR',
    description: 'View and verify your CEFR English proficiency certificate with QR verification.',
    type: 'profile',
  },
  alternates: {
    canonical: '/certificate',
  },
};

export default function CertificateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
