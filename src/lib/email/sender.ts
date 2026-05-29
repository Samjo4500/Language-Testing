import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@testcefr.com';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'TestCEFR';

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured — email not sent');
    return null;
  }
  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [to],
    subject,
    html,
    text,
  });
  if (error) {
    console.error('Email send failed:', error);
    throw error;
  }
  return data;
}
