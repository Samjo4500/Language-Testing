import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { LazyChatWidget } from "@/components/lazy-chat-widget";
import { PerformanceMonitor } from "@/components/performance-monitor";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = 'https://testcefr.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'TestCEFR — AI-Powered English Certification',
  description:
    'Take a free CEFR assessment and get your English certificate. AI-powered testing for A1-C2 levels with instant results.',
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
    images: ['/og-image.png'],
    title: 'TestCEFR — AI-Powered English Certification',
    description: 'Take a free CEFR assessment and get your English certificate.',
    type: 'website',
    url: siteUrl,
    siteName: 'TestCEFR',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'TestCEFR — AI-Powered English Certification',
    description: 'Take a free CEFR assessment and get your English certificate.',
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '48x48' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />
      </head>
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
            <LazyChatWidget />
            <PerformanceMonitor />
            <CookieConsentBanner />
          </AnalyticsProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
