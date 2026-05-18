import { Resend } from 'resend';
import { db } from './db';

// Lazy-initialize Resend to avoid running during build (Vercel build step)
// The Resend SDK validates the API key as an HTTP header on construction,
// which fails during Next.js static page data collection.
let _resend: Resend | null | undefined = undefined;
function getResend(): Resend | null {
  if (_resend !== undefined) return _resend;
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) { _resend = null; return null; }
  try { _resend = new Resend(key); } catch { _resend = null; }
  return _resend;
}

const FROM_EMAIL = 'TestCEFR <noreply@testcefr.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn(`Resend not configured — skipping email to ${to}: ${subject}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  } catch (error) {
    console.error(`Failed to send email (${subject}):`, error);
  }
}

export function emailShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin:0; padding:0; background:#0a0a0a; font-family:Arial,sans-serif; }
    .wrapper { width:100%; background:#0a0a0a; padding:40px 16px; }
    .card { max-width:560px; margin:0 auto; background:linear-gradient(145deg,#1a1a2e,#16213e); border-radius:16px; border:1px solid rgba(139,92,246,0.2); overflow:hidden; }
    .header { background:linear-gradient(135deg,#7c3aed,#db2777); padding:32px 40px; text-align:center; }
    .header h1 { margin:0; color:#fff; font-size:22px; font-weight:700; }
    .content { padding:32px 40px; color:#e2e8f0; }
    .content p { margin:0 0 16px; line-height:1.7; font-size:15px; color:#cbd5e1; }
    .greeting { font-size:18px; font-weight:600; color:#f1f5f9; margin-bottom:20px; }
    .btn { display:inline-block; padding:14px 32px; background:linear-gradient(135deg,#7c3aed,#db2777); color:#fff !important; text-decoration:none; border-radius:10px; font-weight:600; font-size:15px; margin:8px 0 24px; }
    .badge { display:inline-block; padding:8px 20px; background:linear-gradient(135deg,#7c3aed,#db2777); color:#fff; border-radius:8px; font-size:28px; font-weight:700; margin:8px 0 16px; }
    .divider { border:none; border-top:1px solid rgba(139,92,246,0.15); margin:24px 0; }
    .footer { padding:20px 40px 28px; text-align:center; }
    .footer p { margin:0 0 6px; font-size:12px; color:#64748b; }
    .detail-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(139,92,246,0.1); }
    .detail-label { color:#94a3b8; font-size:14px; }
    .detail-value { color:#f1f5f9; font-size:14px; font-weight:600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header"><h1>TestCEFR</h1></div>
      ${bodyHtml}
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} TestCEFR. All rights reserved.</p>
        <p><a href="${APP_URL}" style="color:#a78bfa;">testcefr.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function sendWelcomeEmail(name: string, email: string): Promise<void> {
  const d = name || email.split('@')[0];
  await sendEmail(email, 'Welcome to TestCEFR!', emailShell('Welcome to TestCEFR!',
    `<div class="content">
      <p class="greeting">Welcome, ${d}!</p>
      <p>Thank you for creating your account on <strong>TestCEFR</strong> — the modern platform for CEFR English proficiency assessment.</p>
      <p>Here is what you can do next:</p>
      <p>Take a free practice assessment, explore our pricing plans, and earn an internationally-recognised CEFR certificate.</p>
      <a href="${APP_URL}/pricing" class="btn">Explore Plans</a>
      <p>If you did not create this account, please ignore this email.</p>
    </div>`));
}

export async function sendEmailVerification(name: string, email: string, verificationLink: string): Promise<void> {
  const d = name || email.split('@')[0];
  await sendEmail(email, 'Verify your email — TestCEFR', emailShell('Verify your email',
    `<div class="content">
      <p class="greeting">Hi ${d},</p>
      <p>Please verify your email address to activate your TestCEFR account. Click the button below — it expires in 24 hours.</p>
      <a href="${verificationLink}" class="btn">Verify Email Address</a>
      <hr class="divider" />
      <p style="font-size:13px; color:#64748b;">If the button does not work, copy and paste this link: <a href="${verificationLink}" style="color:#a78bfa;">${verificationLink}</a></p>
    </div>`));
}

export async function sendPasswordReset(name: string, email: string, resetLink: string): Promise<void> {
  const d = name || email.split('@')[0];
  await sendEmail(email, 'Reset your password — TestCEFR', emailShell('Reset your password',
    `<div class="content">
      <p class="greeting">Hi ${d},</p>
      <p>We received a request to reset your password. Click below to choose a new one — this link expires in 1 hour.</p>
      <a href="${resetLink}" class="btn">Reset Password</a>
      <hr class="divider" />
      <p style="font-size:13px; color:#64748b;">If the button does not work: <a href="${resetLink}" style="color:#a78bfa;">${resetLink}</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>`));
}

export async function sendPaymentConfirmation(name: string, email: string, planName: string, amount: number, transactionId: string): Promise<void> {
  const d = name || email.split('@')[0];
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  await sendEmail(email, `Payment confirmed — ${planName} plan`, emailShell('Payment confirmed',
    `<div class="content">
      <p class="greeting">Hi ${d},</p>
      <p>Your payment has been successfully processed. Thank you for choosing TestCEFR!</p>
      <hr class="divider" />
      <div class="detail-row"><span class="detail-label">Plan</span><span class="detail-value">${planName}</span></div>
      <div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value">${formatted}</span></div>
      <div class="detail-row"><span class="detail-label">Transaction ID</span><span class="detail-value">${transactionId}</span></div>
      <hr class="divider" />
      <a href="${APP_URL}/test" class="btn">Start Your Assessment</a>
    </div>`));
}

export async function sendCertificateReady(name: string, email: string, cefrLevel: string, certificateUrl: string): Promise<void> {
  const d = name || email.split('@')[0];
  await sendEmail(email, `Your ${cefrLevel} certificate is ready — TestCEFR`, emailShell('Your certificate is ready!',
    `<div class="content">
      <p class="greeting">Congratulations, ${d}!</p>
      <p>Your CEFR proficiency certificate is ready. Here is your awarded level:</p>
      <div style="text-align:center;"><span class="badge">${cefrLevel}</span></div>
      <p>You can view, download, and share your verified certificate from your dashboard.</p>
      <a href="${certificateUrl}" class="btn">View Certificate</a>
    </div>`));
}

export async function sendAssessmentComplete(name: string, email: string, cefrLevel: string, score: number): Promise<void> {
  const d = name || email.split('@')[0];
  await sendEmail(email, `Assessment completed — Level ${cefrLevel}`, emailShell('Assessment completed',
    `<div class="content">
      <p class="greeting">Well done, ${d}!</p>
      <p>You have completed your CEFR English proficiency assessment. Here are your results:</p>
      <div style="text-align:center;"><span class="badge">${cefrLevel}</span></div>
      <div class="detail-row"><span class="detail-label">Overall Score</span><span class="detail-value">${score}/100</span></div>
      <hr class="divider" />
      <p>Your detailed skill breakdown and certificate are available on your dashboard.</p>
      <a href="${APP_URL}/dashboard" class="btn">View Results</a>
    </div>`));
}

export async function sendContactAutoReply(name: string, email: string, accountType: string): Promise<void> {
  const d = name || email.split('@')[0];
  const typeLabel = accountType === 'university' ? 'University/College' : accountType === 'business' ? 'Business' : 'Individual';
  await sendEmail(email, 'We received your message — TestCEFR', emailShell('Message received',
    `<div class="content">
      <p class="greeting">Hi ${d},</p>
      <p>Thank you for contacting TestCEFR! We have received your message and will get back to you within 24 hours.</p>
      <p>Account type: <strong>${typeLabel}</strong></p>
      <hr class="divider" />
      <p>In the meantime, feel free to explore our platform or start a free assessment.</p>
      <a href="${APP_URL}/pricing" class="btn">Explore Plans</a>
    </div>`));
}

export async function sendAdminEmail(subject: string, html: string, type: string): Promise<void> {
  const adminEmail = 'admin@testcefr.com';
  await sendEmail(adminEmail, subject, html);
  // Log to database
  try {
    await db.emailLog.create({
      data: {
        to: adminEmail,
        from: FROM_EMAIL,
        subject,
        type,
        status: 'sent',
      },
    });
  } catch (err) {
    console.error('Failed to log admin email:', err);
  }
}
