import type { Metadata } from 'next';

// Force dynamic rendering to avoid prerender issues with client components
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Verify Certificate',
  description:
    'Verify the authenticity of a TestCEFR CEFR certificate. Enter the verification ID or scan the QR code to confirm the certificate holder’s English proficiency level.',
  keywords: [
    'verify certificate',
    'CEFR certificate verification',
    'certificate authenticity',
    'QR code verification',
    'English test verification',
    'certificate check',
  ],
  openGraph: {
    title: 'Verify Certificate | TestCEFR',
    description:
      'Verify the authenticity of a TestCEFR CEFR certificate. Enter the verification ID or scan the QR code to confirm.',
  },
  alternates: {
    canonical: 'https://www.testcefr.com/verify',
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
