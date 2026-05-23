import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

interface AuditEntry {
  id: string;
  type: string;
  description: string;
  date: string;
  adminEmail?: string;
  adminName?: string;
  targetEmail?: string;
  targetName?: string;
  metadata?: Record<string, unknown>;
}

/**
 * GET /api/admin/audit-log/
 * Return recent admin actions derived from EmailLog entries with admin-related types,
 * recent admin users, and recent password resets.
 *
 * Query params: page, limit, adminId, action
 */
export async function GET(request: NextRequest) {
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

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
    const adminId = searchParams.get('adminId')?.trim() || '';
    const action = searchParams.get('action')?.trim() || '';

    const skip = (page - 1) * limit;

    // Build where clause for admin email logs
    const adminEmailTypes = ['admin_new_user', 'admin_new_payment', 'admin_certificate'];
    const emailWhere: Record<string, unknown> = {
      type: action && adminEmailTypes.includes(action) ? action : { in: adminEmailTypes },
    };

    // Build where clause for recent user changes
    const userWhere: Record<string, unknown> = {};
    if (adminId) {
      userWhere.id = adminId;
    }

    // Fetch data sources in parallel
    const [
      adminEmailLogs,
      adminUsers,
      recentPasswordResets,
      totalEmailLogs,
      totalAdminUsers,
      totalPasswordResets,
    ] = await Promise.all([
      // 1. Admin notification emails (sent to admins about new users, payments, certificates)
      db.emailLog.findMany({
        where: emailWhere,
        select: {
          id: true,
          type: true,
          status: true,
          to: true,
          from: true,
          subject: true,
          createdAt: true,
          userId: true,
          user: {
            select: { id: true, email: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),

      // 2. Current admin users
      db.user.findMany({
        where: { role: 'admin', ...userWhere },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      }),

      // 3. Recent password resets (admin action indicator)
      db.user.findMany({
        where: {
          passwordResetAt: { not: null },
          ...userWhere,
        },
        select: {
          id: true,
          email: true,
          name: true,
          passwordResetAt: true,
          updatedAt: true,
        },
        orderBy: { passwordResetAt: 'desc' },
        skip,
        take: limit,
      }),

      // Counts
      db.emailLog.count({ where: emailWhere }),
      db.user.count({ where: { role: 'admin' } }),
      db.user.count({ where: { passwordResetAt: { not: null } } }),
    ]);

    // Build audit entries
    const entries: AuditEntry[] = [];

    // From admin email logs
    for (const log of adminEmailLogs) {
      let description = '';
      let targetEmail: string | undefined;
      let targetName: string | undefined;

      switch (log.type) {
        case 'admin_new_user':
          description = `New user registration notification — ${log.subject}`;
          targetEmail = log.user?.email;
          targetName = log.user?.name || undefined;
          break;
        case 'admin_new_payment':
          description = `New payment notification — ${log.subject}`;
          targetEmail = log.user?.email;
          targetName = log.user?.name || undefined;
          break;
        case 'admin_certificate':
          description = `Certificate issued notification — ${log.subject}`;
          targetEmail = log.user?.email;
          targetName = log.user?.name || undefined;
          break;
        default:
          description = `Admin notification: ${log.type}`;
      }

      entries.push({
        id: log.id,
        type: log.type,
        description,
        date: log.createdAt.toISOString(),
        adminEmail: log.to,
        targetEmail,
        targetName,
        metadata: {
          emailStatus: log.status,
          subject: log.subject,
        },
      });
    }

    // From admin users (recent role changes inferred from updatedAt)
    for (const admin of adminUsers) {
      entries.push({
        id: `admin_${admin.id}`,
        type: 'admin_user',
        description: `Admin user: ${admin.name || admin.email}`,
        date: admin.updatedAt.toISOString(),
        adminEmail: admin.email,
        adminName: admin.name || undefined,
        metadata: {
          adminId: admin.id,
          createdAt: admin.createdAt,
        },
      });
    }

    // From recent password resets
    for (const user of recentPasswordResets) {
      if (user.passwordResetAt) {
        entries.push({
          id: `pwreset_${user.id}`,
          type: 'password_reset',
          description: `Password reset for ${user.name || user.email}`,
          date: user.passwordResetAt.toISOString(),
          targetEmail: user.email,
          targetName: user.name || undefined,
          metadata: {
            userId: user.id,
          },
        });
      }
    }

    // Sort by date descending
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply action filter if specified
    const filteredEntries = action
      ? entries.filter(e => e.type === action)
      : entries;

    // Paginate from the combined result
    const paginatedEntries = filteredEntries.slice(0, limit);

    const totalCount = totalEmailLogs + totalAdminUsers + totalPasswordResets;

    return NextResponse.json({
      entries: paginatedEntries,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      adminUsers: adminUsers.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        updatedAt: u.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get audit log error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit log.' },
      { status: 500 }
    );
  }
}
