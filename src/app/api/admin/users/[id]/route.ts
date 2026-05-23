import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * GET /api/admin/users/[id]/
 * Return detailed user info including related records and computed stats.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        accountType: true,
        organizationName: true,
        organizationId: true,
        isDemo: true,
        emailVerified: true,
        testCredits: true,
        country: true,
        tokenVersion: true,
        planExpiresAt: true,
        passwordResetAt: true,
        createdAt: true,
        updatedAt: true,
        assessments: {
          select: {
            id: true,
            status: true,
            cefrLevel: true,
            score: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        certificates: {
          select: {
            id: true,
            verificationId: true,
            cefrLevel: true,
            score: true,
            issuedAt: true,
          },
          orderBy: { issuedAt: 'desc' },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            plan: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        emailLogs: {
          select: {
            id: true,
            type: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Compute stats
    const totalAssessments = user.assessments.length;
    const completedAssessments = user.assessments.filter(a => a.status === 'completed').length;
    const totalCertificates = user.certificates.length;
    const totalPayments = user.payments.length;
    const totalSpent = user.payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    // Last activity: latest from assessments or payments
    const allActivityDates = [
      ...user.assessments.map(a => a.createdAt),
      ...user.payments.map(p => p.createdAt),
    ];
    const lastActivityAt = allActivityDates.length > 0
      ? new Date(Math.max(...allActivityDates.map(d => d.getTime())))
      : null;

    // Account age in days
    const accountAgeDays = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        role: user.role,
        accountType: user.accountType,
        organizationName: user.organizationName,
        organizationId: user.organizationId,
        isDemo: user.isDemo,
        emailVerified: user.emailVerified,
        testCredits: user.testCredits,
        country: user.country,
        tokenVersion: user.tokenVersion,
        planExpiresAt: user.planExpiresAt,
        passwordResetAt: user.passwordResetAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      assessments: user.assessments,
      certificates: user.certificates,
      payments: user.payments,
      emailLogs: user.emailLogs,
      stats: {
        totalAssessments,
        completedAssessments,
        totalCertificates,
        totalPayments,
        totalSpent: Math.round(totalSpent * 100) / 100,
        lastActivityAt,
        accountAgeDays,
      },
    });
  } catch (error) {
    console.error('Get user detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users/[id]/
 * Update user fields. Increments tokenVersion when role/plan changes.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const { id } = await params;
    const body = await request.json();

    // Check user exists
    const existingUser = await db.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    let needsTokenInvalidation = false;

    // Validate and set each updatable field
    if (body.name !== undefined) {
      updateData.name = body.name || null;
    }

    if (body.plan !== undefined) {
      if (!['free', 'premium', 'pro'].includes(body.plan)) {
        return NextResponse.json(
          { error: 'Invalid plan. Must be "free", "premium", or "pro".' },
          { status: 400 }
        );
      }
      updateData.plan = body.plan;
      needsTokenInvalidation = true;
    }

    if (body.role !== undefined) {
      if (!['user', 'admin'].includes(body.role)) {
        return NextResponse.json(
          { error: 'Invalid role. Must be "user" or "admin".' },
          { status: 400 }
        );
      }
      updateData.role = body.role;
      needsTokenInvalidation = true;
    }

    if (body.country !== undefined) {
      updateData.country = body.country || null;
    }

    if (body.testCredits !== undefined) {
      const credits = Number(body.testCredits);
      if (isNaN(credits) || credits < -1) {
        return NextResponse.json(
          { error: 'Invalid testCredits value.' },
          { status: 400 }
        );
      }
      updateData.testCredits = credits;
    }

    if (body.emailVerified !== undefined) {
      updateData.emailVerified = Boolean(body.emailVerified);
    }

    if (body.isDemo !== undefined) {
      updateData.isDemo = Boolean(body.isDemo);
    }

    if (body.planExpiresAt !== undefined) {
      // Allow null to clear the date, or a valid date string
      if (body.planExpiresAt === null) {
        updateData.planExpiresAt = null;
      } else {
        const date = new Date(body.planExpiresAt);
        if (isNaN(date.getTime())) {
          return NextResponse.json(
            { error: 'Invalid planExpiresAt date.' },
            { status: 400 }
          );
        }
        updateData.planExpiresAt = date;
      }
    }

    // Prevent self-demotion (admin can't remove their own admin role)
    if (body.role === 'user' && id === authResult.userId) {
      return NextResponse.json(
        { error: 'You cannot remove your own admin role.' },
        { status: 400 }
      );
    }

    // Invalidate sessions if role or plan changed
    if (needsTokenInvalidation) {
      updateData.tokenVersion = { increment: 1 };
    }

    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update.' },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        accountType: true,
        organizationName: true,
        organizationId: true,
        isDemo: true,
        emailVerified: true,
        testCredits: true,
        country: true,
        tokenVersion: true,
        planExpiresAt: true,
        passwordResetAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: 'User updated successfully.',
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]/
 * User deletion is not supported — return 405 to prevent accidental data loss.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    // User deletion not supported — use PATCH to suspend or modify access instead
    return NextResponse.json(
      {
        error: 'User deletion not supported. Use PATCH to suspend or modify access.',
        suggestion: 'Set testCredits to 0, role to "user", and emailVerified to false to effectively suspend the account.',
      },
      { status: 405 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to process delete request.' },
      { status: 500 }
    );
  }
}
