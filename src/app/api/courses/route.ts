import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { STATIC_COURSES } from '@/lib/static-course-data';

// GET /api/courses/ — List all published courses (PUBLIC)
export async function GET() {
  try {
    const courses = await db.course.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        level: true,
        price: true,
        compareAtPrice: true,
        description: true,
        features: true,
        modulesCount: true,
        lessonsCount: true,
        estimatedHours: true,
        imageUrl: true,
        order: true,
        createdAt: true,
        _count: {
          select: { modules: true, enrollments: true },
        },
      },
    });

    if (courses.length > 0) {
      return NextResponse.json({ courses });
    }
  } catch (error) {
    console.error('[courses] Database unavailable, using static fallback:', error);
  }

  // Static fallback — always available even without database
  const courses = STATIC_COURSES.map(c => ({
    ...c,
    isPublished: true,
    createdAt: new Date().toISOString(),
    _count: { modules: 0, enrollments: 0 },
  }));

  return NextResponse.json({ courses });
}
