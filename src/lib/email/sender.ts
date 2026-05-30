import { Resend } from 'resend';
import { db } from '@/lib/db';

// Lazy-init Resend (same pattern as email.ts)
let _resend: Resend | null | undefined = undefined;
function getResend(): Resend | null {
  if (_resend !== undefined) return _resend;
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) { _resend = null; return null; }
  try { _resend = new Resend(key); } catch { _resend = null; }
  return _resend;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@testcefr.com';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'TestCEFR';

export async function sendEmail({
  to,
  subject,
  html,
  text,
  type,
  userId,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  type?: string;
  userId?: string;
}) {
  const resend = getResend();
  const from = `${FROM_NAME} <${FROM_EMAIL}>`;

  if (!resend) {
    console.warn('RESEND_API_KEY not configured — email not sent');
    // Still log to database so emails appear in the dashboard
    if (type) {
      await db.emailLog.create({
        data: {
          to,
          from,
          subject,
          type,
          status: 'skipped',
          userId: userId || null,
          error: 'RESEND_API_KEY not configured',
        },
      }).catch(() => {});
    }
    return null;
  }

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
    text,
  });

  if (error) {
    console.error('Email send failed:', error);
    // Log failed attempt
    if (type) {
      await db.emailLog.create({
        data: {
          to,
          from,
          subject,
          type,
          status: 'failed',
          userId: userId || null,
          error: error.message || String(error),
        },
      }).catch(() => {});
    }
    throw error;
  }

  // Log successful send
  if (type) {
    await db.emailLog.create({
      data: {
        to,
        from,
        subject,
        type,
        status: 'sent',
        userId: userId || null,
      },
    }).catch(() => {});
  }

  return data;
}
