import { NextRequest, NextResponse } from 'next/server';
import { requireAdminFromRequest, adminErrorResponse } from '@/lib/admin-auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await requireAdminFromRequest(request);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const plan = searchParams.get('plan') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (plan) {
      where.plan = plan;
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          plan: true,
          status: true,
          isSuspended: true,
          emailVerified: true,
          englishLevel: true,
          country: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              assessments: true,
              certificates: true,
              payments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
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
    const { userId, action, data } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action are required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from modifying themselves
    if (userId === admin.userId) {
      return NextResponse.json({ error: 'Cannot modify your own account' }, { status: 400 });
    }

    let updateData: Record<string, unknown> = {};

    switch (action) {
      case 'suspend':
        updateData = { isSuspended: true, status: 'suspended' };
        break;
      case 'unsuspend':
        updateData = { isSuspended: false, status: 'active' };
        break;
      case 'ban':
        updateData = { status: 'banned', isSuspended: true };
        break;
      case 'unban':
        updateData = { status: 'active', isSuspended: false };
        break;
      case 'update_plan':
        if (!data?.plan) return NextResponse.json({ error: 'plan is required' }, { status: 400 });
        updateData = { plan: data.plan };
        break;
      case 'update_role':
        if (!data?.role) return NextResponse.json({ error: 'role is required' }, { status: 400 });
        updateData = { role: data.role };
        break;
      case 'update_status':
        if (!data?.status) return NextResponse.json({ error: 'status is required' }, { status: 400 });
        updateData = { status: data.status };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        status: true,
        isSuspended: true,
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        adminId: admin.userId,
        action: `user_${action}`,
        targetType: 'user',
        targetId: userId,
        details: JSON.stringify({ before: { status: user.status, plan: user.plan, role: user.role }, after: updateData }),
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
