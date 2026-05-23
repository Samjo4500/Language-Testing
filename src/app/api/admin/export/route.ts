import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * GET /api/admin/export/?type=users|payments|assessments|certificates
 * Export data as CSV for admin download.
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
    const type = searchParams.get('type') || 'users';

    let csv = '';
    let filename = `${type}-export.csv`;

    switch (type) {
      case 'users': {
        const users = await db.user.findMany({
          select: {
            id: true, email: true, name: true, plan: true, role: true,
            isDemo: true, isSuspended: true, emailVerified: true, testCredits: true,
            country: true, createdAt: true, updatedAt: true,
            _count: { select: { assessments: true, certificates: true, payments: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 5000,
        });
        csv = 'ID,Email,Name,Plan,Role,Is Demo,Is Suspended,Email Verified,Test Credits,Country,Assessments,Certificates,Payments,Created,Updated\n';
        for (const u of users) {
          csv += `"${u.id}","${u.email}","${u.name || ''}","${u.plan}","${u.role}",${u.isDemo},${u.isSuspended},${u.emailVerified},${u.testCredits},"${u.country || ''}",${u._count.assessments},${u._count.certificates},${u._count.payments},"${u.createdAt.toISOString()}",${u.updatedAt ? `"${u.updatedAt.toISOString()}"` : '""'}\n`;
        }
        break;
      }
      case 'payments': {
        const payments = await db.payment.findMany({
          select: {
            id: true, amount: true, currency: true, status: true, plan: true,
            paypalOrderId: true, paypalCaptureId: true, createdAt: true,
            user: { select: { email: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 5000,
        });
        csv = 'ID,User Email,User Name,Amount,Currency,Status,Plan,PayPal Order ID,PayPal Capture ID,Created\n';
        for (const p of payments) {
          csv += `"${p.id}","${p.user.email}","${p.user.name || ''}",${p.amount},"${p.currency}","${p.status}","${p.plan || ''}","${p.paypalOrderId || ''}","${p.paypalCaptureId || ''}","${p.createdAt.toISOString()}"\n`;
        }
        break;
      }
      case 'assessments': {
        const assessments = await db.assessment.findMany({
          select: {
            id: true, status: true, cefrLevel: true, score: true,
            startedAt: true, completedAt: true, createdAt: true,
            user: { select: { email: true, name: true } },
            _count: { select: { responses: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 5000,
        });
        csv = 'ID,User Email,User Name,Status,CEFR Level,Score,Responses,Started,Completed,Created\n';
        for (const a of assessments) {
          csv += `"${a.id}","${a.user.email}","${a.user.name || ''}","${a.status}","${a.cefrLevel || ''}",${a.score ?? ''},${a._count.responses},${a.startedAt ? `"${a.startedAt.toISOString()}"` : ''},${a.completedAt ? `"${a.completedAt.toISOString()}"` : ''},"${a.createdAt.toISOString()}"\n`;
        }
        break;
      }
      case 'certificates': {
        const certificates = await db.certificate.findMany({
          select: {
            id: true, verificationId: true, userName: true, cefrLevel: true,
            score: true, issuedAt: true,
            user: { select: { email: true, name: true } },
          },
          orderBy: { issuedAt: 'desc' },
          take: 5000,
        });
        csv = 'ID,Verification ID,User Email,User Name,Certificate Name,CEFR Level,Score,Issued\n';
        for (const c of certificates) {
          csv += `"${c.id}","${c.verificationId}","${c.user.email}","${c.user.name || ''}","${c.userName}","${c.cefrLevel}",${c.score},"${c.issuedAt.toISOString()}"\n`;
        }
        break;
      }
      default:
        return NextResponse.json({ error: 'Invalid export type. Use: users, payments, assessments, certificates' }, { status: 400 });
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export data.' }, { status: 500 });
  }
}
