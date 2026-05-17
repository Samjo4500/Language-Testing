import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

/**
 * GET /api/admin/assessments
 * List assessments with filtering and pagination.
 * Query params: page, limit, status, cefrLevel
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const status = searchParams.get('status')?.trim() || undefined;
    const cefrLevel = searchParams.get('cefrLevel')?.trim() || undefined;

    const validStatuses = ['not_started', 'in_progress', 'completed'];
    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    const where: Record<string, unknown> = {};
    if (status && validStatuses.includes(status)) {
      where.status = status;
    }
    if (cefrLevel && validLevels.includes(cefrLevel)) {
      where.cefrLevel = cefrLevel;
    }

    const [assessments, total] = await Promise.all([
      db.assessment.findMany({
        where,
        select: {
          id: true,
          userId: true,
          status: true,
          cefrLevel: true,
          score: true,
          startedAt: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          _count: {
            select: { responses: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.assessment.count({ where }),
    ]);

    return NextResponse.json({
      assessments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List assessments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments.' },
      { status: 500 }
    );
  }
}
