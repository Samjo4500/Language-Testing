import { NextRequest, NextResponse } from 'next/server';
import { requireAdminFromRequest, adminErrorResponse } from '@/lib/admin-auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await requireAdminFromRequest(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const [tickets, total] = await Promise.all([
      db.supportTicket.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.supportTicket.count({ where }),
    ]);

    return NextResponse.json({
      tickets,
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

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdminFromRequest(request);

    const body = await request.json();
    const { ticketId, action, data } = body;

    if (!ticketId || !action) {
      return NextResponse.json({ error: 'ticketId and action are required' }, { status: 400 });
    }

    const ticket = await db.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    let updateData: Record<string, unknown> = {};

    switch (action) {
      case 'respond':
        if (!data?.response) return NextResponse.json({ error: 'response is required' }, { status: 400 });
        updateData = {
          response: data.response,
          respondedAt: new Date(),
          status: 'resolved',
          assignedTo: admin.userId,
        };
        break;
      case 'update_status':
        if (!data?.status) return NextResponse.json({ error: 'status is required' }, { status: 400 });
        updateData = { status: data.status };
        break;
      case 'update_priority':
        if (!data?.priority) return NextResponse.json({ error: 'priority is required' }, { status: 400 });
        updateData = { priority: data.priority };
        break;
      case 'assign':
        updateData = { assignedTo: admin.userId, status: 'in_progress' };
        break;
      case 'close':
        updateData = { status: 'closed' };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updatedTicket = await db.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        adminId: admin.userId,
        action: `ticket_${action}`,
        targetType: 'ticket',
        targetId: ticketId,
        details: JSON.stringify({ before: { status: ticket.status, priority: ticket.priority }, after: updateData }),
      },
    });

    return NextResponse.json({ ticket: updatedTicket });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
