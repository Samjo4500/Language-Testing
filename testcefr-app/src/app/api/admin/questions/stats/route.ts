import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const SKILLS = ['grammar', 'vocabulary', 'reading', 'listening'];

    // Get counts for each level × skill combination
    const stats: Record<string, Record<string, number>> = {};
    let total = 0;

    for (const level of CEFR_LEVELS) {
      stats[level] = {};
      for (const skill of SKILLS) {
        const count = await db.question.count({
          where: { level, category: skill },
        });
        stats[level][skill] = count;
        total += count;
      }
    }

    return NextResponse.json({
      stats,
      total,
      levels: CEFR_LEVELS,
      skills: SKILLS,
    });
  } catch (error) {
    console.error('Question stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
