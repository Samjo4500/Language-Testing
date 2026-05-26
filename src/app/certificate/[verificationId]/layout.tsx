import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ verificationId: string }>;
}): Promise<Metadata> {
  const { verificationId } = await params;

  return {
    title: 'CEFR Certificate Verification',
    description: `Verify an official CEFR English proficiency certificate. QR-verified and internationally aligned with the Common European Framework of Reference.`,
    robots: { index: true, follow: true },
    alternates: { canonical: `https://www.testcefr.com/certificate/${verificationId}` },
    openGraph: {
      title: 'CEFR Certificate — TestCEFR',
      description: 'Official CEFR English proficiency certificate with QR verification. Aligned with the Common European Framework of Reference.',
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CEFR Certificate — TestCEFR',
      description: 'Official CEFR English proficiency certificate with QR verification.',
      images: ['/og-image.png'],
    },
  };
}

export default function CertificateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
