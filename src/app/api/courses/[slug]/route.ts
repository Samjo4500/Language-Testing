import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildStaticCourseDetail } from '@/lib/generate-lesson-content';

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
      console.warn('[courses/slug] Database unavailable, using static fallback');
      course = null;
    }

    if (course) {
      return NextResponse.json({ course });
    }

    // Static fallback — returns full course with modules and lessons
    const staticCourse = buildStaticCourseDetail(slug);
    if (staticCourse) {
      return NextResponse.json({ course: staticCourse });
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
