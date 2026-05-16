import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

/**
 * GET /api/admin/certificates
 * List certificates with CEFR level distribution stats and pagination.
 * Query params: page, limit, cefrLevel
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
    const cefrLevel = searchParams.get('cefrLevel')?.trim() || undefined;

    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    const where: Record<string, unknown> = {};
    if (cefrLevel && validLevels.includes(cefrLevel)) {
      where.cefrLevel = cefrLevel;
    }

    const [certificates, total, cefrDistributionRaw] = await Promise.all([
      db.certificate.findMany({
        where,
        select: {
          id: true,
          verificationId: true,
          userId: true,
          assessmentId: true,
          userName: true,
          cefrLevel: true,
          score: true,
          skillBreakdown: true,
          issuedAt: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.certificate.count({ where }),
      // CEFR level distribution across all certificates (not filtered)
      db.certificate.groupBy({
        by: ['cefrLevel'],
        _count: { cefrLevel: true },
      }),
    ]);

    const cefrDistribution: Record<string, number> = {};
    for (const level of validLevels) {
      cefrDistribution[level] = 0;
    }
    for (const row of cefrDistributionRaw) {
      if (row.cefrLevel && row.cefrLevel in cefrDistribution) {
        cefrDistribution[row.cefrLevel] = row._count.cefrLevel;
      }
    }

    return NextResponse.json({
      certificates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      cefrDistribution,
    });
  } catch (error) {
    console.error('List certificates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates.' },
      { status: 500 }
    );
  }
}
