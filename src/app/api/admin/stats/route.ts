import { NextRequest, NextResponse } from 'next/server';
import { requireAdminFromRequest, adminErrorResponse } from '@/lib/admin-auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdminFromRequest(request);

    // Get total users count
    const totalUsers = await db.user.count();
    const activeUsers = await db.user.count({ where: { status: 'active' } });
    const suspendedUsers = await db.user.count({ where: { status: 'suspended' } });
    const bannedUsers = await db.user.count({ where: { status: 'banned' } });

    // Get new users this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = await db.user.count({
      where: { createdAt: { gte: startOfMonth } },
    });

    // Get tests completed
    const completedAssessments = await db.assessment.count({
      where: { status: 'completed' },
    });

    // Get open reports
    const openReports = await db.report.count({
      where: { status: 'pending' },
    });

    // Get open tickets
    const openTickets = await db.supportTicket.count({
      where: { status: { in: ['open', 'in_progress'] } },
    });

    // Get revenue stats (completed payments)
    const completedPayments = await db.payment.findMany({
      where: { status: 'completed' },
      select: { amount: true, currency: true, createdAt: true },
    });
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

    // Revenue this month
    const revenueThisMonth = completedPayments
      .filter(p => p.createdAt >= startOfMonth)
      .reduce((sum, p) => sum + p.amount, 0);

    // Users by plan
    const usersByPlan = {
      free: await db.user.count({ where: { plan: 'free' } }),
      premium: await db.user.count({ where: { plan: 'premium' } }),
      pro: await db.user.count({ where: { plan: 'pro' } }),
    };

    // Assessments by level
    const assessments = await db.assessment.findMany({
      where: { status: 'completed', cefrLevel: { not: null } },
      select: { cefrLevel: true },
    });
    const assessmentsByLevel: Record<string, number> = {};
    for (const a of assessments) {
      if (a.cefrLevel) {
        assessmentsByLevel[a.cefrLevel] = (assessmentsByLevel[a.cefrLevel] || 0) + 1;
      }
    }

    // Get recent signups (last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentSignups = await db.user.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { id: true, name: true, email: true, createdAt: true, plan: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Certificates issued
    const totalCertificates = await db.certificate.count();

    return NextResponse.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        banned: bannedUsers,
        newThisMonth: newUsersThisMonth,
        byPlan: usersByPlan,
        recentSignups,
      },
      assessments: {
        completed: completedAssessments,
        byLevel: assessmentsByLevel,
      },
      reports: {
        open: openReports,
      },
      tickets: {
        open: openTickets,
      },
      revenue: {
        total: totalRevenue,
        thisMonth: revenueThisMonth,
        currency: 'USD',
      },
      certificates: {
        total: totalCertificates,
      },
      _admin: admin,
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
