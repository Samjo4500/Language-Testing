import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://testcefr.com';

  const staticPages = [
    '', '/about', '/pricing', '/blog', '/courses', '/community',
    '/test', '/login', '/register', '/contact', '/privacy-policy',
    '/terms', '/cookie-policy',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  // Blog posts — graceful fallback if blogPost table doesn't exist yet
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const posts = await (db as any).blogPost?.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    if (posts) {
      blogUrls = posts.map((post: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch {
    // blogPost table might not exist — skip gracefully
  }

  // Courses
  let courseUrls: MetadataRoute.Sitemap = [];
  try {
    const courses = await db.course.findMany({
      select: { slug: true, updatedAt: true },
    });
    courseUrls = courses.map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // courses table might not exist — skip gracefully
  }

  return [...staticPages, ...blogUrls, ...courseUrls];
}
