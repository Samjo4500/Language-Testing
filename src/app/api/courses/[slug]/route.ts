import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildStaticCourseDetail } from '@/lib/generate-lesson-content';
import { STATIC_COURSES } from '@/lib/static-course-data';

// GET /api/courses/[slug]/ — Get course details with modules (PUBLIC)
// Supports both slug (e.g., "beginner") and course ID (e.g., "cmpkmzr4g0000...")
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: slugOrId } = await params;

    let course;
    try {
      // Try slug first, then ID
      course = await db.course.findUnique({
        where: { slug: slugOrId, isPublished: true },
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
                  videoUrl: true,
                },
              },
            },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      });

      // If not found by slug, try by ID
      if (!course) {
        course = await db.course.findUnique({
          where: { id: slugOrId },
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
                  },
                },
              },
            },
            _count: {
              select: { enrollments: true },
            },
          },
        });
      }
    } catch (dbError) {
      console.warn('[courses/slug] Database unavailable, using static fallback');
      course = null;
    }

    if (course) {
      return NextResponse.json({ course });
    }

    // Static fallback — try slug first, then search by ID
    const staticCourse = buildStaticCourseDetail(slugOrId);
    if (staticCourse) {
      return NextResponse.json({ course: staticCourse });
    }

    // Try to find by course ID in static data
    const foundById = STATIC_COURSES.find(c => c.id === slugOrId);
    if (foundById) {
      const courseBySlug = buildStaticCourseDetail(foundById.slug);
      if (courseBySlug) {
        return NextResponse.json({ course: courseBySlug });
      }
    }

    return NextResponse.json(
      { error: 'Course not found.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Get course error:', error);

    // Try static fallback even on unexpected errors
    try {
      const errSlug = request.nextUrl.pathname.split('/').filter(Boolean).pop()?.replace(/\/$/, '') || '';
      const staticCourse = buildStaticCourseDetail(errSlug);
      if (staticCourse) {
        return NextResponse.json({ course: staticCourse });
      }
    } catch {}

    return NextResponse.json(
      { error: 'Failed to fetch course.' },
      { status: 500 }
    );
  }
}
