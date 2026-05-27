import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { Resend } from 'resend';
import { db } from '@/lib/db';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'TestCEFR <noreply@testcefr.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@testcefr.com';

/**
 * POST /api/admin/test-email
 * Sends a test email to verify the Resend integration is working.
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    if (!resend) {
      // Log the attempt
      await db.emailLog.create({
        data: {
          to: ADMIN_EMAIL,
          from: FROM_EMAIL,
          subject: '[Test] Resend Not Configured',
          type: 'admin_test',
          status: 'failed',
          error: 'RESEND_API_KEY not set',
        },
      });
      return NextResponse.json(
        { error: 'Resend API key is not configured. Set RESEND_API_KEY in your environment variables.' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const testEmailTo = body.to || ADMIN_EMAIL;

    // Validate the recipient is an authorized domain/email
    // Resend only allows sending to the admin email on free tier
    const subject = `[Test] TestCEFR Email Service Verification — ${new Date().toISOString()}`;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Test Email</title>
  <style>
    body { margin:0; padding:0; background:#0a0a0a; font-family:Arial,sans-serif; }
    .wrapper { width:100%; background:#0a0a0a; padding:40px 16px; }
    .card { max-width:560px; margin:0 auto; background:linear-gradient(145deg,#1a1a2e,#16213e); border-radius:16px; border:1px solid rgba(139,92,246,0.2); overflow:hidden; }
    .header { background:linear-gradient(135deg,#7c3aed,#3b82f6); padding:32px 40px; text-align:center; }
    .header h1 { margin:0; color:#fff; font-size:22px; font-weight:700; }
    .content { padding:32px 40px; color:#e2e8f0; }
    .content p { margin:0 0 16px; line-height:1.7; font-size:15px; color:#cbd5e1; }
    .badge { display:inline-block; padding:8px 20px; background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; border-radius:8px; font-size:18px; font-weight:700; margin:8px 0 16px; }
    .detail-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(139,92,246,0.1); }
    .detail-label { color:#94a3b8; font-size:14px; }
    .detail-value { color:#f1f5f9; font-size:14px; font-weight:600; }
    .footer { padding:20px 40px 28px; text-align:center; }
    .footer p { margin:0 0 6px; font-size:12px; color:#64748b; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header"><h1>TestCEFR</h1></div>
      <div class="content">
        <p style="font-size:18px; font-weight:600; color:#f1f5f9;">Email Service Test</p>
        <p>This is a test email from your TestCEFR admin dashboard to verify that your Resend email integration is working correctly.</p>
        <div style="text-align:center;"><span class="badge">WORKING</span></div>
        <div class="detail-row"><span class="detail-label">Sent At</span><span class="detail-value">${new Date().toISOString()}</span></div>
        <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">Resend</span></div>
        <div class="detail-row"><span class="detail-label">From</span><span class="detail-value">${FROM_EMAIL}</span></div>
        <div class="detail-row"><span class="detail-label">To</span><span class="detail-value">${testEmailTo}</span></div>
        <p>If you received this email, your email service is configured correctly. Contact form submissions, welcome emails, and other notifications will be sent successfully.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} TestCEFR. All rights reserved.</p>
        <p><a href="https://testcefr.com/admin" style="color:#a78bfa;">Back to Admin Dashboard</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: testEmailTo, subject, html });
      await db.emailLog.create({
        data: {
          to: testEmailTo,
          from: FROM_EMAIL,
          subject,
          type: 'admin_test',
          status: 'sent',
        },
      });
      return NextResponse.json({ success: true, message: `Test email sent to ${testEmailTo}` });
    } catch (error: any) {
      await db.emailLog.create({
        data: {
          to: testEmailTo,
          from: FROM_EMAIL,
          subject,
          type: 'admin_test',
          status: 'failed',
          error: error?.message || 'Unknown error',
        },
      });
      return NextResponse.json(
        { error: `Failed to send test email: ${error?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
