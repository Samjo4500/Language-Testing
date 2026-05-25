import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { COURSE_TIERS } from '@/lib/courses';

const SANDBOX_MODE = process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true';

// GET /api/courses/[slug]/ — Get course details with modules (PUBLIC)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    let course;
    try {
      course = await db.course.findUnique({
        where: { slug, isPublished: true },
      include: {
        modules: {
          where: { isPublished: true },
          orderBy: [{ order: 'asc' }, { moduleNumber: 'asc' }],
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: [{ order: 'asc' }, { lessonNumber: 'asc' }],
              select: {
                id: true,
                lessonNumber: true,
                title: true,
                contentType: true,
                estimatedMinutes: true,
                // Do NOT include content, vocabulary, quizData — those are behind auth
              },
            },
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    } catch (dbError) {
      // Database not available — return static fallback
      console.warn('[courses/slug] Database unavailable, returning static fallback');
      course = null;
    }

    if (!course) {
      // Try static fallback from COURSE_TIERS (works even without database)
      const tier = COURSE_TIERS[slug];
      if (tier) {
        return NextResponse.json({
          course: {
            id: `course-${slug}`,
            slug: tier.slug,
            title: tier.title,
            subtitle: tier.subtitle,
            level: tier.level,
            price: tier.price,
            compareAtPrice: tier.compareAtPrice,
            description: '',
            features: JSON.stringify(tier.features),
            modulesCount: tier.modulesCount,
            lessonsCount: tier.lessonsCount,
            estimatedHours: tier.estimatedHours,
            imageUrl: null,
            order: 0,
            isPublished: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            modules: [],
            _count: { enrollments: 0 },
          }
        });
      }
      return NextResponse.json(
        { error: 'Course not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    // Try static fallback regardless of mode — database may be unavailable
    try {
      const errSlug = request.nextUrl.pathname.split('/').filter(Boolean).pop()?.replace(/\/$/, '') || '';
      const tier = COURSE_TIERS[errSlug];
      if (tier) {
          return NextResponse.json({
            course: {
              id: `course-${errSlug}`,
              slug: tier.slug,
              title: tier.title,
              subtitle: tier.subtitle,
              level: tier.level,
              price: tier.price,
              compareAtPrice: tier.compareAtPrice,
              description: '',
              features: JSON.stringify(tier.features),
              modulesCount: tier.modulesCount,
              lessonsCount: tier.lessonsCount,
              estimatedHours: tier.estimatedHours,
              imageUrl: null,
              order: 0,
              isPublished: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              modules: [],
              _count: { enrollments: 0 },
            }
          });
        }
      } catch {}
    return NextResponse.json(
      { error: 'Failed to fetch course.' },
      { status: 500 }
    );
  }
}
