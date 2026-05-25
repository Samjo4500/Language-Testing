import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('List courses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses.' },
      { status: 500 }
    );
  }
}
