import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/test',
          '/admin',
          '/profile',
          '/verify-email',
          '/reset-password',
          '/forgot-password',
          '/onboarding',
        ],
      },
    ],
    sitemap: 'https://testcefr.com/sitemap.xml',
  };
}
