import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));
    const status = searchParams.get('status') || undefined;
    const targetType = searchParams.get('targetType') || undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (targetType) where.targetType = targetType;

    const [reports, total] = await Promise.all([
      db.report.findMany({
        where,
        select: {
          id: true,
          reporterId: true,
          targetId: true,
          targetType: true,
          reason: true,
          description: true,
          status: true,
          reviewNote: true,
          createdAt: true,
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.report.count({ where }),
    ]);

    // Fetch the reported content based on targetType
    const formattedReports = await Promise.all(
      reports.map(async (r) => {
        let content = '';
        let messageId = '';

        if (r.targetType === 'message') {
          messageId = r.targetId;
          try {
            const msg = await db.chatRoomMessage.findUnique({
              where: { id: r.targetId },
              select: { content: true },
            });
            content = msg?.content || '[Message deleted or not found]';
          } catch {
            content = '[Message not found]';
          }
        } else if (r.targetType === 'moment') {
          try {
            const moment = await db.moment.findUnique({
              where: { id: r.targetId },
              select: { content: true },
            });
            content = moment?.content || '[Moment deleted or not found]';
          } catch {
            content = '[Moment not found]';
          }
        } else if (r.targetType === 'comment') {
          try {
            const comment = await db.momentComment.findUnique({
              where: { id: r.targetId },
              select: { content: true },
            });
            content = comment?.content || '[Comment deleted or not found]';
          } catch {
            content = '[Comment not found]';
          }
        } else {
          content = r.description || '[No content]';
        }

        return {
          id: r.id,
          messageId,
          targetId: r.targetId,
          targetType: r.targetType,
          content,
          reporterName: r.reporter?.name || 'Unknown',
          reporterEmail: r.reporter?.email || '',
          reason: r.reason,
          description: r.description || '',
          status: r.status,
          reviewNote: r.reviewNote || null,
          createdAt: r.createdAt.toISOString(),
        };
      })
    );

    return NextResponse.json({
      reports: formattedReports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Community Reports API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
