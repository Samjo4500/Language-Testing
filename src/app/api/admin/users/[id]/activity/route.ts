import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

interface ActivityEvent {
  type: string;
  description: string;
  date: string;
  metadata?: Record<string, unknown>;
}

/**
 * GET /api/admin/users/[id]/activity/
 * Return a timeline of user activity combining assessments, payments, certificates, emails, and page views.
 * Sorted by date descending, limited to 100 events.
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

    // Check user exists
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Fetch all activity sources in parallel
    const [assessments, payments, certificates, emailLogs, pageViews] = await Promise.all([
      // Assessments
      db.assessment.findMany({
        where: { userId: id },
        select: {
          id: true,
          status: true,
          cefrLevel: true,
          score: true,
          createdAt: true,
          completedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),

      // Payments
      db.payment.findMany({
        where: { userId: id },
        select: {
          id: true,
          amount: true,
          status: true,
          plan: true,
          currency: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),

      // Certificates
      db.certificate.findMany({
        where: { userId: id },
        select: {
          id: true,
          verificationId: true,
          cefrLevel: true,
          score: true,
          issuedAt: true,
        },
        orderBy: { issuedAt: 'desc' },
        take: 20,
      }),

      // Email logs
      db.emailLog.findMany({
        where: { userId: id },
        select: {
          id: true,
          type: true,
          status: true,
          subject: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),

      // Page views (most recent 20)
      db.pageView.findMany({
        where: { userId: id },
        select: {
          id: true,
          path: true,
          referrer: true,
          country: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    // Build timeline events
    const events: ActivityEvent[] = [];

    // Assessment events
    for (const a of assessments) {
      // Assessment created
      events.push({
        type: 'assessment_created',
        description: `Assessment started`,
        date: a.createdAt.toISOString(),
        metadata: {
          assessmentId: a.id,
          status: a.status,
        },
      });

      // Assessment completed
      if (a.status === 'completed' && a.completedAt) {
        events.push({
          type: 'assessment_completed',
          description: `Assessment completed — CEFR ${a.cefrLevel || 'N/A'}, score ${a.score ?? 'N/A'}`,
          date: a.completedAt.toISOString(),
          metadata: {
            assessmentId: a.id,
            cefrLevel: a.cefrLevel,
            score: a.score,
          },
        });
      }
    }

    // Payment events
    for (const p of payments) {
      let description = '';
      switch (p.status) {
        case 'completed':
          description = `Payment completed — ${p.currency.toUpperCase()} ${p.amount} for ${p.plan} plan`;
          break;
        case 'failed':
          description = `Payment failed — ${p.currency.toUpperCase()} ${p.amount} for ${p.plan} plan`;
          break;
        case 'refunded':
          description = `Payment refunded — ${p.currency.toUpperCase()} ${p.amount} for ${p.plan} plan`;
          break;
        default:
          description = `Payment ${p.status} — ${p.currency.toUpperCase()} ${p.amount}`;
      }

      events.push({
        type: `payment_${p.status}`,
        description,
        date: p.createdAt.toISOString(),
        metadata: {
          paymentId: p.id,
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          plan: p.plan,
        },
      });
    }

    // Certificate events
    for (const c of certificates) {
      events.push({
        type: 'certificate_issued',
        description: `Certificate issued — CEFR ${c.cefrLevel}, score ${c.score}`,
        date: c.issuedAt.toISOString(),
        metadata: {
          certificateId: c.id,
          verificationId: c.verificationId,
          cefrLevel: c.cefrLevel,
          score: c.score,
        },
      });
    }

    // Email events
    for (const e of emailLogs) {
      events.push({
        type: `email_${e.status}`,
        description: `Email ${e.status}: ${formatEmailType(e.type)}${e.subject ? ` — ${e.subject}` : ''}`,
        date: e.createdAt.toISOString(),
        metadata: {
          emailLogId: e.id,
          emailType: e.type,
          status: e.status,
        },
      });
    }

    // Page view events
    for (const pv of pageViews) {
      events.push({
        type: 'page_view',
        description: `Visited ${pv.path}${pv.referrer ? ` from ${pv.referrer}` : ''}`,
        date: pv.createdAt.toISOString(),
        metadata: {
          pageViewId: pv.id,
          path: pv.path,
          referrer: pv.referrer,
          country: pv.country,
        },
      });
    }

    // Sort all events by date descending and limit to 100
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const limitedEvents = events.slice(0, 100);

    return NextResponse.json({
      userId: id,
      email: user.email,
      name: user.name,
      events: limitedEvents,
      total: limitedEvents.length,
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user activity.' },
      { status: 500 }
    );
  }
}

/**
 * Convert email type to a human-readable label.
 */
function formatEmailType(type: string): string {
  const labels: Record<string, string> = {
    welcome: 'Welcome email',
    verification: 'Email verification',
    password_reset: 'Password reset',
    payment: 'Payment confirmation',
    certificate: 'Certificate notification',
    assessment: 'Assessment notification',
    contact_auto_reply: 'Contact auto-reply',
    contact_notification: 'Contact notification',
    b2b_auto_reply: 'B2B auto-reply',
    b2b_notification: 'B2B notification',
    admin_new_user: 'Admin: New user alert',
    admin_new_payment: 'Admin: New payment alert',
    admin_certificate: 'Admin: Certificate alert',
    general: 'General email',
  };
  return labels[type] || type;
}
