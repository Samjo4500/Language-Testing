import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ verificationId: string }>;
}): Promise<Metadata> {
  const { verificationId } = await params;

  return {
    title: 'CEFR Assessment Report',
    description: `View detailed CEFR English proficiency assessment report. Includes skill breakdown, improvement recommendations, and verified certificate.`,
    robots: { index: true, follow: true },
    alternates: { canonical: `https://www.testcefr.com/report/${verificationId}` },
    openGraph: {
      title: 'CEFR Assessment Report — TestCEFR',
      description: 'Detailed English proficiency assessment report with AI-powered skill analysis and improvement recommendations.',
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CEFR Assessment Report — TestCEFR',
      description: 'Detailed English proficiency assessment report with AI-powered skill analysis.',
      images: ['/og-image.png'],
    },
  };
}

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
