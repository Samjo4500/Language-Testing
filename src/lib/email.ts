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

// Use RESEND_FROM_EMAIL env var, or fall back to onboarding@resend.dev
// until testcefr.com domain is verified on Resend dashboard.
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'TestCEFR <onboarding@resend.dev>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@testcefr.com';

/** Escape HTML special characters to prevent XSS in email templates */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendEmail(to: string, subject: string, html: string, type?: string, userId?: string): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn(`Resend not configured — skipping email to ${to}: ${subject}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
    // Log to database if type is provided
    if (type) {
      await db.emailLog.create({
        data: {
          to,
          from: FROM_EMAIL,
          subject,
          type,
          status: 'sent',
          userId: userId || null,
        },
      }).catch(() => {});
    }
  } catch (error) {
    console.error(`Failed to send email (${subject}):`, error);
    // Log failed attempt
    if (type) {
      await db.emailLog.create({
        data: {
          to,
          from: FROM_EMAIL,
          subject,
          type,
          status: 'failed',
          userId: userId || null,
          error: error instanceof Error ? error.message : String(error),
        },
      }).catch(() => {});
    }
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
    .header { background:linear-gradient(135deg,#7c3aed,#3b82f6); padding:32px 40px; text-align:center; }
    .header h1 { margin:0; color:#fff; font-size:22px; font-weight:700; }
    .content { padding:32px 40px; color:#e2e8f0; }
    .content p { margin:0 0 16px; line-height:1.7; font-size:15px; color:#cbd5e1; }
    .greeting { font-size:18px; font-weight:600; color:#f1f5f9; margin-bottom:20px; }
    .btn { display:inline-block; padding:14px 32px; background:linear-gradient(135deg,#7c3aed,#3b82f6); color:#fff !important; text-decoration:none; border-radius:10px; font-weight:600; font-size:15px; margin:8px 0 24px; }
    .badge { display:inline-block; padding:8px 20px; background:linear-gradient(135deg,#7c3aed,#3b82f6); color:#fff; border-radius:8px; font-size:28px; font-weight:700; margin:8px 0 16px; }
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

export async function sendWelcomeEmail(name: string, email: string, userId?: string): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  await sendEmail(email, 'Welcome to TestCEFR!', emailShell('Welcome to TestCEFR!',
    `<div class="content">
      <p class="greeting">Welcome, ${d}!</p>
      <p>Thank you for creating your account on <strong>TestCEFR</strong> — the modern platform for CEFR English proficiency assessment.</p>
      <p>Here is what you can do next:</p>
      <p>Take a free practice assessment, explore our pricing plans, and earn an internationally-recognised CEFR certificate.</p>
      <a href="${APP_URL}/pricing" class="btn">Explore Plans</a>
      <p>If you did not create this account, please ignore this email.</p>
    </div>`), 'welcome', userId);
}

export async function sendEmailVerification(name: string, email: string, verificationLink: string, userId?: string): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  await sendEmail(email, 'Verify your email — TestCEFR', emailShell('Verify your email',
    `<div class="content">
      <p class="greeting">Hi ${d},</p>
      <p>Please verify your email address to activate your TestCEFR account. Click the button below — it expires in 24 hours.</p>
      <a href="${verificationLink}" class="btn">Verify Email Address</a>
      <hr class="divider" />
      <p style="font-size:13px; color:#64748b;">If the button does not work, copy and paste this link: <a href="${verificationLink}" style="color:#a78bfa;">${verificationLink}</a></p>
    </div>`), 'verification', userId);
}

export async function sendPasswordReset(name: string, email: string, resetLink: string): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  await sendEmail(email, 'Reset your password — TestCEFR', emailShell('Reset your password',
    `<div class="content">
      <p class="greeting">Hi ${d},</p>
      <p>We received a request to reset your password. Click below to choose a new one — this link expires in 1 hour.</p>
      <a href="${resetLink}" class="btn">Reset Password</a>
      <hr class="divider" />
      <p style="font-size:13px; color:#64748b;">If the button does not work: <a href="${resetLink}" style="color:#a78bfa;">${resetLink}</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>`), 'password_reset');
}

export async function sendPaymentConfirmation(name: string, email: string, planName: string, amount: number, transactionId: string, userId?: string): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
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
    </div>`), 'payment', userId);
}

export async function sendCertificateReady(name: string, email: string, cefrLevel: string, certificateUrl: string, userId?: string): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  await sendEmail(email, `Your ${cefrLevel} certificate is ready — TestCEFR`, emailShell('Your certificate is ready!',
    `<div class="content">
      <p class="greeting">Congratulations, ${d}!</p>
      <p>Your CEFR proficiency certificate is ready. Here is your awarded level:</p>
      <div style="text-align:center;"><span class="badge">${cefrLevel}</span></div>
      <p>You can view, download, and share your verified certificate from your dashboard.</p>
      <a href="${certificateUrl}" class="btn">View Certificate</a>
    </div>`), 'certificate', userId);
}

export async function sendAssessmentComplete(name: string, email: string, cefrLevel: string, score: number, userId?: string): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  await sendEmail(email, `Assessment completed — Level ${cefrLevel}`, emailShell('Assessment completed',
    `<div class="content">
      <p class="greeting">Well done, ${d}!</p>
      <p>You have completed your CEFR English proficiency assessment. Here are your results:</p>
      <div style="text-align:center;"><span class="badge">${cefrLevel}</span></div>
      <div class="detail-row"><span class="detail-label">Overall Score</span><span class="detail-value">${score}/100</span></div>
      <hr class="divider" />
      <p>Your detailed skill breakdown and certificate are available on your dashboard.</p>
      <a href="${APP_URL}/dashboard" class="btn">View Results</a>
    </div>`), 'assessment', userId);
}

export async function sendContactAutoReply(name: string, email: string, accountType: string): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  const typeLabel = accountType === 'university' ? 'University/College' : accountType === 'business' ? 'Business' : 'Individual';
  await sendEmail(email, 'We received your message — TestCEFR', emailShell('Message received',
    `<div class="content">
      <p class="greeting">Hi ${d},</p>
      <p>Thank you for contacting TestCEFR! We have received your message and will get back to you within 24 hours.</p>
      <p>Account type: <strong>${typeLabel}</strong></p>
      <hr class="divider" />
      <p>In the meantime, feel free to explore our platform or start a free assessment.</p>
      <a href="${APP_URL}/pricing" class="btn">Explore Plans</a>
    </div>`), 'contact_auto_reply');
}

export async function sendAdminNewUser(name: string, email: string, accountType: string, organizationName?: string): Promise<void> {
  const typeLabel = accountType === 'university' ? 'University/College' : accountType === 'business' ? 'Business' : 'Individual';
  const safeName = escapeHtml(name || '—');
  const safeEmail = escapeHtml(email);
  const safeOrg = organizationName ? escapeHtml(organizationName) : '';
  const orgLine = safeOrg
    ? `<div class="detail-row"><span class="detail-label">Organization</span><span class="detail-value">${safeOrg}</span></div>`
    : '';
  await sendAdminEmail(
    `New user registered: ${name || email}`,
    emailShell('New User Registration',
      `<div class="content">
        <p class="greeting">New user signup</p>
        <div class="detail-row"><span class="detail-label">Name</span><span class="detail-value">${safeName}</span></div>
        <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${safeEmail}</span></div>
        <div class="detail-row"><span class="detail-label">Account Type</span><span class="detail-value">${typeLabel}</span></div>
        ${orgLine}
        <hr class="divider" />
        <a href="${APP_URL}/admin" class="btn">View in Admin</a>
      </div>`),
    'admin_new_user'
  );
}

export async function sendAdminNewPayment(name: string, email: string, planName: string, amount: number, transactionId: string): Promise<void> {
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  const safeName = escapeHtml(name || '—');
  const safeEmail = escapeHtml(email);
  const safePlanName = escapeHtml(planName);
  const safeTxId = escapeHtml(transactionId);
  await sendAdminEmail(
    `New payment: ${formatted} — ${planName} plan`,
    emailShell('New Payment Received',
      `<div class="content">
        <p class="greeting">Payment received!</p>
        <div class="detail-row"><span class="detail-label">Customer</span><span class="detail-value">${safeName}</span></div>
        <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${safeEmail}</span></div>
        <div class="detail-row"><span class="detail-label">Plan</span><span class="detail-value">${safePlanName}</span></div>
        <div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value">${formatted}</span></div>
        <div class="detail-row"><span class="detail-label">Transaction ID</span><span class="detail-value">${safeTxId}</span></div>
        <hr class="divider" />
        <a href="${APP_URL}/admin" class="btn">View in Admin</a>
      </div>`),
    'admin_new_payment'
  );
}

// ═══════════════════════════════════════════════════════════
//  NURTURE SEQUENCE — Post-assessment email automation
// ═══════════════════════════════════════════════════════════

/** Day 0 — "Your weakest skill + how to improve" (1hr after test) */
export async function sendNurtureDay0(
  name: string, email: string, cefrLevel: string, score: number,
  weakestSkill: string, weakestScore: number, userId?: string
): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  const skillLabel = skillDisplayName(weakestSkill);
  const nextLevel = nextCEFRLevel(cefrLevel);
  const subject = 'Your weakest skill: ' + skillLabel + ' - here is how to improve';
  const body = '<div class="content">'
    + '<p class="greeting">Hi ' + d + ',</p>'
    + '<p>You completed your CEFR assessment and scored <strong>' + cefrLevel + '</strong> (' + score + '/100) - great job! But we noticed one area holding you back:</p>'
    + '<div style="text-align:center; margin:16px 0;">'
    + '<span class="badge" style="font-size:20px;">' + skillLabel + ': ' + weakestScore + '%</span>'
    + '</div>'
    + '<p>Your <strong>' + skillLabel + '</strong> score is the weakest link in your profile. Improving it is the fastest way to reach <strong>' + nextLevel + '</strong>.</p>'
    + '<p>Here are 3 things you can do <em>right now</em>:</p>'
    + '<p><strong>1.</strong> Practice with our targeted ' + skillLabel + ' exercises in the <strong>' + cefrLevel + '</strong> course.</p>'
    + '<p><strong>2.</strong> Read the blog: <a href="' + APP_URL + '/blog" style="color:#a78bfa;">How to improve your ' + skillLabel + ' from ' + cefrLevel + ' to ' + nextLevel + '</a>.</p>'
    + '<p><strong>3.</strong> Take a focused re-assessment in 7 days to measure progress.</p>'
    + '<a href="' + APP_URL + '/pricing" class="btn">Upgrade for Full Access</a>'
    + '<p style="font-size:13px; color:#64748b;">You are receiving this because you completed a CEFR assessment on TestCEFR.</p>'
    + '</div>';
  await sendEmail(email, subject, emailShell('Boost your weakest skill', body), 'nurture_day0', userId);
}

/** Day 1 — "How to go from [level] to [next level]" */
export async function sendNurtureDay1(
  name: string, email: string, cefrLevel: string, userId?: string
): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  const nextLevel = nextCEFRLevel(cefrLevel);
  const levelDesc = cefrLevelDescription(cefrLevel);
  const nextDesc = cefrLevelDescription(nextLevel);
  const subject = 'How to go from ' + cefrLevel + ' to ' + nextLevel + ' - a practical roadmap';
  const body = '<div class="content">'
    + '<p class="greeting">Hi ' + d + ',</p>'
    + '<p>Yesterday you learned your CEFR level is <strong>' + cefrLevel + ' (' + levelDesc + ')</strong>. Today let us talk about reaching <strong>' + nextLevel + ' (' + nextDesc + ')</strong>.</p>'
    + '<p>The gap between ' + cefrLevel + ' and ' + nextLevel + ' is smaller than you think. Here is a research-backed roadmap:</p>'
    + '<p><strong>Week 1-2:</strong> Focus on your weakest skill. Spend 20 minutes daily on targeted exercises. Our ' + cefrLevel + ' course has exactly what you need.</p>'
    + '<p><strong>Week 3-4:</strong> Start consuming native-level content. Read news articles, listen to podcasts at the ' + nextLevel + ' difficulty level.</p>'
    + '<p><strong>Week 5-6:</strong> Practice production - write short essays and record yourself speaking. Get AI feedback on TestCEFR.</p>'
    + '<p><strong>Week 7-8:</strong> Take a re-assessment to measure your improvement. Most learners see a 15-25% score increase.</p>'
    + '<a href="' + APP_URL + '/pricing" class="btn">Get Full Access + AI Feedback</a>'
    + '</div>';
  await sendEmail(email, subject, emailShell('Your path to ' + nextLevel, body), 'nurture_day1', userId);
}

/** Day 2 — "3 free resources to boost your English" */
export async function sendNurtureDay2(
  name: string, email: string, userId?: string
): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  const subject = '3 free resources to boost your English this week';
  const body = '<div class="content">'
    + '<p class="greeting">Hi ' + d + ',</p>'
    + '<p>You do not need to spend money to improve your English. Here are 3 free resources that genuinely work:</p>'
    + '<p><strong>1. BBC Learning English</strong> - Daily articles with vocabulary highlights, audio, and quizzes. Perfect for B1-B2 learners. Free at bbclearningenglish.com.</p>'
    + '<p><strong>2. TED Talks with interactive transcripts</strong> - Watch talks on topics you love, read along with the transcript, and note new vocabulary. Great for listening + reading combo practice.</p>'
    + '<p><strong>3. TestCEFR Free Practice</strong> - Our free tier includes sample questions at every CEFR level. Take a mini-assessment to track your progress.</p>'
    + '<p>Consistency beats intensity. Just 20 minutes a day with these resources will show results in 2 weeks.</p>'
    + '<a href="' + APP_URL + '/test" class="btn">Try Free Practice Questions</a>'
    + '</div>';
  await sendEmail(email, subject, emailShell('Free resources for you', body), 'nurture_day2', userId);
}

/** Day 3 — "Why certified CEFR scores matter for your career" */
export async function sendNurtureDay3(
  name: string, email: string, cefrLevel: string, userId?: string
): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  const subject = 'Why certified CEFR scores matter for your career';
  const body = '<div class="content">'
    + '<p class="greeting">Hi ' + d + ',</p>'
    + '<p>Did you know that <strong>72% of international employers</strong> require proof of English proficiency? A self-reported level is not enough - they want a verified certificate.</p>'
    + '<p>Here is why a TestCEFR certificate makes a difference:</p>'
    + '<p><strong>Verified, not self-reported.</strong> Our AI-scored assessments evaluate all 6 skills (reading, writing, listening, speaking, grammar, vocabulary). Employers trust objective measurement.</p>'
    + '<p><strong>Shareable and verifiable.</strong> Every certificate has a unique verification ID. Employers can confirm your score at testcefr.com/verify - no fake certificates possible.</p>'
    + '<p><strong>Recognized internationally.</strong> The CEFR framework is the global standard used by universities, immigration authorities, and multinational companies.</p>'
    + '<p>Your current level is <strong>' + cefrLevel + '</strong>. A premium assessment gives you a downloadable PDF certificate you can attach to job applications, university admissions, and LinkedIn.</p>'
    + '<a href="' + APP_URL + '/pricing" class="btn">Get Your Verified Certificate</a>'
    + '</div>';
  await sendEmail(email, subject, emailShell('Your CEFR certificate matters', body), 'nurture_day3', userId);
}

/** Day 4 — "What other learners achieved this week" */
export async function sendNurtureDay4(
  name: string, email: string, userId?: string
): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  const subject = 'See what other learners achieved this week';
  const body = '<div class="content">'
    + '<p class="greeting">Hi ' + d + ',</p>'
    + '<p>Sometimes the best motivation is seeing others succeed. Here is what TestCEFR learners achieved this week:</p>'
    + '<p><strong>Maria, Spain</strong> - Improved from B1 to B2 in 6 weeks by following our structured course. She just landed a remote job at a UK startup that required "B2 English minimum."</p>'
    + '<p><strong>Kenji, Japan</strong> - Went from A2 to B1 by practicing 30 minutes daily. His company promoted him to a client-facing role that needed English communication.</p>'
    + '<p><strong>Amara, Nigeria</strong> - Used her TestCEFR certificate to meet the English requirement for her Canadian immigration application. She got her visa last month.</p>'
    + '<p>What do they have in common? They measured their level, identified weak spots, and practiced consistently. You have already taken the first step by assessing your level.</p>'
    + '<a href="' + APP_URL + '/pricing" class="btn">Start Your Improvement Journey</a>'
    + '</div>';
  await sendEmail(email, subject, emailShell('Learner success stories', body), 'nurture_day4', userId);
}

/** Day 5 — Limited time discount offer */
export async function sendNurtureDay5(
  name: string, email: string, userId?: string
): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  const subject = 'Special offer: upgrade your plan at a discount';
  const body = '<div class="content">'
    + '<p class="greeting">Hi ' + d + ',</p>'
    + '<p>You have been on your English journey for 5 days now, and we want to help you go further.</p>'
    + '<p>For a limited time, get <strong>20 percent off</strong> any premium plan. Use code <strong style="color:#a78bfa; font-size:18px;">LEVELUP20</strong> at checkout.</p>'
    + '<div style="text-align:center; margin:20px 0; padding:16px; background:rgba(139,92,246,0.1); border-radius:10px; border:1px dashed rgba(139,92,246,0.3);">'
    + '<p style="margin:0; font-size:15px; color:#cbd5e1;">Promo Code</p>'
    + '<p style="margin:4px 0 0; font-size:24px; font-weight:700; color:#a78bfa; letter-spacing:2px;">LEVELUP20</p>'
    + '</div>'
    + '<p>What you get with Premium:</p>'
    + '<p>3 full assessments with detailed skill breakdowns, downloadable PDF certificates, AI-powered feedback on writing and speaking, and priority support.</p>'
    + '<p>This offer is exclusive to new learners and expires in 48 hours.</p>'
    + '<a href="' + APP_URL + '/pricing" class="btn">Claim Your Discount Now</a>'
    + '</div>';
  await sendEmail(email, subject, emailShell('Special Discount', body), 'nurture_day5', userId);
}

/** Day 6 — "Last chance: upgrade before your results expire" */
export async function sendNurtureDay6(
  name: string, email: string, cefrLevel: string, userId?: string
): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  const nextLevel = nextCEFRLevel(cefrLevel);
  const subject = 'Your ' + cefrLevel + ' results - do not lose your progress';
  const body = '<div class="content">'
    + '<p class="greeting">Hi ' + d + ',</p>'
    + '<p>This is the last email in our series. You know your level (' + cefrLevel + '), you have seen the roadmap, and you have heard from learners who succeeded.</p>'
    + '<p>Here is the truth: <strong>without consistent practice, language skills degrade.</strong> Studies show that without active use, English proficiency can drop a full CEFR level in 6 months.</p>'
    + '<p>Do not let that happen. Your assessment showed you are close to <strong>' + nextLevel + '</strong>. With focused practice, you could reach it in 6-8 weeks.</p>'
    + '<p>The Premium plan gives you everything you need:</p>'
    + '<p>3 assessments to track progress, structured courses from ' + cefrLevel + ' to ' + nextLevel + ', AI tutor feedback, and verified certificates for your resume.</p>'
    + '<p>Remember: use code <strong style="color:#a78bfa;">LEVELUP20</strong> for 20 percent off - expires in 24 hours.</p>'
    + '<a href="' + APP_URL + '/pricing" class="btn">Upgrade Before It Is Too Late</a>'
    + '</div>';
  await sendEmail(email, subject, emailShell('Do not lose your progress', body), 'nurture_day6', userId);
}

// ═══════════════════════════════════════════════════════════
//  CART RECOVERY — Checkout abandonment follow-up
// ═══════════════════════════════════════════════════════════

export async function sendCartRecovery(
  name: string, email: string, planType: string, planName: string, price: string, userId?: string
): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  const safePlanName = escapeHtml(planName);
  const safePrice = escapeHtml(price);
  const subject = 'You are one step away from your ' + safePlanName + ' plan';
  const body = '<div class="content">'
    + '<p class="greeting">Hi ' + d + ',</p>'
    + '<p>You were about to upgrade to the <strong>' + safePlanName + '</strong> plan (' + safePrice + ') but did not complete your purchase. We wanted to check - did something go wrong?</p>'
    + '<p>If you had a technical issue, try again - our checkout is fast and secure via PayPal.</p>'
    + '<p>Here is what you are missing without premium:</p>'
    + '<p>Detailed skill breakdowns across all 6 areas, downloadable verified certificates, AI-powered feedback on speaking and writing, and progress tracking to measure improvement.</p>'
    + '<a href="' + APP_URL + '/pricing" class="btn">Complete Your Upgrade</a>'
    + '<p style="font-size:13px; color:#64748b;">Questions? Reply to this email or <a href="' + APP_URL + '/contact" style="color:#a78bfa;">contact support</a>.</p>'
    + '</div>';
  await sendEmail(email, subject, emailShell('Complete your purchase', body), 'cart_recovery', userId);
}

// ═══════════════════════════════════════════════════════════
//  TICKET REPLY — Admin support ticket response
// ═══════════════════════════════════════════════════════════

export async function sendTicketReply(
  name: string, email: string, ticketSubject: string, adminResponse: string,
  ticketId: string, userId?: string
): Promise<void> {
  const d = escapeHtml(name || email.split('@')[0]);
  const safeSubject = escapeHtml(ticketSubject);
  const safeResponse = escapeHtml(adminResponse);
  const subject = 'Re: ' + safeSubject + ' - TestCEFR Support';
  const body = '<div class="content">'
    + '<p class="greeting">Hi ' + d + ',</p>'
    + '<p>We have responded to your support ticket:</p>'
    + '<div style="background:rgba(59,130,246,0.08); border-left:3px solid #3b82f6; padding:16px; border-radius:0 8px 8px 0; margin:16px 0;">'
    + '<p style="margin:0 0 8px; font-size:14px; color:#94a3b8;"><strong>Subject:</strong> ' + safeSubject + '</p>'
    + '<p style="margin:0; font-size:14px; color:#e2e8f0; line-height:1.6;">' + safeResponse + '</p>'
    + '</div>'
    + '<p>If you need further assistance, just reply to this email or submit a new ticket from your dashboard.</p>'
    + '<a href="' + APP_URL + '/dashboard" class="btn">Go to Dashboard</a>'
    + '</div>';
  await sendEmail(email, subject, emailShell('Support update', body), 'ticket_reply', userId);
}

// ═══════════════════════════════════════════════════════════
//  HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

/** Map internal skill key to display name */
function skillDisplayName(skill: string): string {
  const map: Record<string, string> = {
    reading: 'Reading',
    writing: 'Writing',
    listening: 'Listening',
    speaking: 'Speaking',
    grammar: 'Grammar',
    vocabulary: 'Vocabulary',
  };
  return map[skill] || skill;
}

/** Get the next CEFR level up */
function nextCEFRLevel(level: string): string {
  const order = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const idx = order.indexOf(level);
  return idx < order.length - 1 ? order[idx + 1] : 'C2+';
}

/** Get human-readable CEFR description */
function cefrLevelDescription(level: string): string {
  const map: Record<string, string> = {
    A1: 'Beginner',
    A2: 'Elementary',
    B1: 'Intermediate',
    B2: 'Upper Intermediate',
    C1: 'Advanced',
    C2: 'Proficient',
  };
  return map[level] || level;
}

export async function sendAdminEmail(subject: string, html: string, type: string): Promise<void> {
  await sendEmail(ADMIN_EMAIL, subject, html);
  // Log to database
  try {
    await db.emailLog.create({
      data: {
        to: ADMIN_EMAIL,
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
