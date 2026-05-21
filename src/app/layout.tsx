import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { ChatWidget } from "@/components/chat-widget";
import { AnalyticsProvider } from "@/components/analytics-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = 'https://www.testcefr.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TestCEFR | AI-Powered English Proficiency Assessment',
    template: '%s | TestCEFR',
  },
  description:
    'Assess your English language proficiency with our AI-powered CEFR-aligned test. Get an accurate A1–C2 level rating with QR-verified certificates recognized internationally.',
  keywords: [
    'CEFR',
    'English test',
    'language proficiency',
    'A1',
    'A2',
    'B1',
    'B2',
    'C1',
    'C2',
    'English assessment',
    'English proficiency test',
    'online English test',
    'CEFR certification',
    'AI English test',
  ],
  authors: [{ name: 'TestCEFR', url: siteUrl }],
  creator: 'TestCEFR',
  publisher: 'TestCEFR',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'TestCEFR',
    title: 'TestCEFR | AI-Powered English Proficiency Assessment',
    description:
      'Assess your English proficiency with our AI-powered CEFR-aligned test. Get accurate A1–C2 ratings with QR-verified certificates.',
    images: [
      {
        url: '/og-image.png',
        width: 1344,
        height: 768,
        alt: 'TestCEFR — AI-Powered English Proficiency Assessment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TestCEFR | AI-Powered English Proficiency Assessment',
    description:
      'Assess your English proficiency with our AI-powered CEFR-aligned test. Get accurate A1–C2 ratings with QR-verified certificates.',
    creator: '@testcefr',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.png', sizes: '1024x1024', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'TestCEFR',
  url: siteUrl,
  description:
    'AI-powered English proficiency assessment platform aligned with the CEFR framework. Get accurate A1–C2 level ratings with QR-verified certificates.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    description: 'CEFR English proficiency assessment',
    priceCurrency: 'USD',
  price: '0',
  availability: 'https://schema.org/InStock',
  },
  provider: {
    '@type': 'Organization',
    name: 'TestCEFR',
    url: siteUrl,
  },
  featureList: [
    'AI-powered listening assessment',
    'AI-powered speaking assessment with speech recognition',
    'AI-powered writing evaluation',
    'CEFR-aligned proficiency rating (A1–C2)',
    'QR-verified digital certificates',
    'Internationally recognized results',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <AnalyticsProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
            <ChatWidget />
          </AnalyticsProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
