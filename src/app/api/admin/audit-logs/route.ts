import { NextRequest, NextResponse } from 'next/server';
import { requireAdminFromRequest, adminErrorResponse } from '@/lib/admin-auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await requireAdminFromRequest(request);

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || '';
    const targetType = searchParams.get('targetType') || '';
    const adminId = searchParams.get('adminId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (action) {
      where.action = { contains: action, mode: 'insensitive' };
    }

    if (targetType) {
      where.targetType = targetType;
    }

    if (adminId) {
      where.adminId = adminId;
    }

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
