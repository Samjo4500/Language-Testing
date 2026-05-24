import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/courses/[slug]/ — Get course details with modules (PUBLIC)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const course = await db.course.findUnique({
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

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course.' },
      { status: 500 }
    );
  }
}
