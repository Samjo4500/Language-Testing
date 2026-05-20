/**
 * Send all email templates as a single combined email to samjo4500@gmail.com
 * Using Resend's default onboarding sender since testcefr.com domain isn't verified yet.
 */
const { Resend } = require('resend');

const RESEND_API_KEY = 're_LZTDkM5t_7zU8QXwNG9EkS3qzMjKXUMEX';
const TO_EMAIL = 'samjo4500@gmail.com';
const APP_URL = 'https://testcefr.com';

const resend = new Resend(RESEND_API_KEY);

function templateBlock(title, subject, bodyHtml) {
  return `
  <div style="margin-bottom:40px; border:2px solid rgba(139,92,246,0.3); border-radius:16px; overflow:hidden;">
    <div style="background:linear-gradient(135deg,#7c3aed,#db2777); padding:12px 24px; display:flex; align-items:center; justify-content:space-between;">
      <span style="color:#fff; font-weight:700; font-size:14px;">${title}</span>
      <span style="background:#f59e0b; color:#000; padding:3px 10px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">TEMPLATE PREVIEW</span>
    </div>
    <div style="background:linear-gradient(145deg,#1a1a2e,#16213e); padding:24px;">
      <p style="margin:0 0 8px; color:#94a3b8; font-size:12px; font-family:Arial,sans-serif;">Subject: <strong style="color:#e2e8f0;">${subject}</strong></p>
      <hr style="border:none; border-top:1px solid rgba(139,92,246,0.2); margin:12px 0;" />
      ${bodyHtml}
    </div>
  </div>`;
}

const cardStyle = `max-width:560px; margin:0 auto; font-family:Arial,sans-serif;`;
const greetingStyle = `font-size:18px; font-weight:600; color:#f1f5f9; margin-bottom:20px;`;
const pStyle = `margin:0 0 16px; line-height:1.7; font-size:15px; color:#cbd5e1;`;
const btnStyle = `display:inline-block; padding:14px 32px; background:linear-gradient(135deg,#7c3aed,#db2777); color:#fff; text-decoration:none; border-radius:10px; font-weight:600; font-size:15px; margin:8px 0 24px;`;
const badgeStyle = `display:inline-block; padding:8px 20px; background:linear-gradient(135deg,#7c3aed,#db2777); color:#fff; border-radius:8px; font-size:28px; font-weight:700; margin:8px 0 16px;`;
const dividerStyle = `border:none; border-top:1px solid rgba(139,92,246,0.15); margin:24px 0;`;
const detailRowStyle = `display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(139,92,246,0.1);`;

const templates = [
  templateBlock('1. Welcome Email', 'Welcome to TestCEFR!',
    `<p style="${greetingStyle}">Welcome, John!</p>
     <p style="${pStyle}">Thank you for creating your account on <strong>TestCEFR</strong> — the modern platform for CEFR English proficiency assessment.</p>
     <p style="${pStyle}">Here is what you can do next:</p>
     <p style="${pStyle}">Take a free practice assessment, explore our pricing plans, and earn an internationally-recognised CEFR certificate.</p>
     <a href="${APP_URL}/pricing" style="${btnStyle}">Explore Plans</a>
     <p style="${pStyle}">If you did not create this account, please ignore this email.</p>`),

  templateBlock('2. Email Verification', 'Verify your email — TestCEFR',
    `<p style="${greetingStyle}">Hi John,</p>
     <p style="${pStyle}">Please verify your email address to activate your TestCEFR account. Click the button below — it expires in 24 hours.</p>
     <a href="${APP_URL}/verify-email?token=preview-token" style="${btnStyle}">Verify Email Address</a>
     <hr style="${dividerStyle}" />
     <p style="font-size:13px; color:#64748b;">If the button does not work, copy and paste this link: <a href="${APP_URL}/verify-email?token=preview-token" style="color:#a78bfa;">${APP_URL}/verify-email?token=preview-token</a></p>`),

  templateBlock('3. Forgot Password / Reset', 'Reset your password — TestCEFR',
    `<p style="${greetingStyle}">Hi John,</p>
     <p style="${pStyle}">We received a request to reset your password. Click below to choose a new one — this link expires in 1 hour.</p>
     <a href="${APP_URL}/reset-password?token=preview-token" style="${btnStyle}">Reset Password</a>
     <hr style="${dividerStyle}" />
     <p style="font-size:13px; color:#64748b;">If the button does not work: <a href="${APP_URL}/reset-password?token=preview-token" style="color:#a78bfa;">${APP_URL}/reset-password?token=preview-token</a></p>
     <p style="${pStyle}">If you did not request this, you can safely ignore this email.</p>`),

  templateBlock('4. Payment Confirmation', 'Payment confirmed — Premium plan',
    `<p style="${greetingStyle}">Hi John,</p>
     <p style="${pStyle}">Your payment has been successfully processed. Thank you for choosing TestCEFR!</p>
     <hr style="${dividerStyle}" />
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Plan</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">Premium</span></div>
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Amount</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">$29.99</span></div>
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Transaction ID</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">PAYPAL-PREVIEW-TXN-001</span></div>
     <hr style="${dividerStyle}" />
     <a href="${APP_URL}/test" style="${btnStyle}">Start Your Assessment</a>`),

  templateBlock('5. Certificate Ready', 'Your B2 certificate is ready — TestCEFR',
    `<p style="${greetingStyle}">Congratulations, John!</p>
     <p style="${pStyle}">Your CEFR proficiency certificate is ready. Here is your awarded level:</p>
     <div style="text-align:center;"><span style="${badgeStyle}">B2</span></div>
     <p style="${pStyle}">You can view, download, and share your verified certificate from your dashboard.</p>
     <a href="${APP_URL}/dashboard" style="${btnStyle}">View Certificate</a>`),

  templateBlock('6. Assessment Complete / Test Results', 'Assessment completed — Level B2',
    `<p style="${greetingStyle}">Well done, John!</p>
     <p style="${pStyle}">You have completed your CEFR English proficiency assessment. Here are your results:</p>
     <div style="text-align:center;"><span style="${badgeStyle}">B2</span></div>
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Overall Score</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">78/100</span></div>
     <hr style="${dividerStyle}" />
     <p style="${pStyle}">Your detailed skill breakdown and certificate are available on your dashboard.</p>
     <a href="${APP_URL}/dashboard" style="${btnStyle}">View Results</a>`),

  templateBlock('7. Contact Auto-Reply', 'We received your message — TestCEFR',
    `<p style="${greetingStyle}">Hi John,</p>
     <p style="${pStyle}">Thank you for contacting TestCEFR! We have received your message and will get back to you within 24 hours.</p>
     <p style="${pStyle}">Account type: <strong>Individual</strong></p>
     <hr style="${dividerStyle}" />
     <p style="${pStyle}">In the meantime, feel free to explore our platform or start a free assessment.</p>
     <a href="${APP_URL}/pricing" style="${btnStyle}">Explore Plans</a>`),

  templateBlock('8. Admin — New User Registration', 'New user registered: John Doe',
    `<p style="${greetingStyle}">New user signup</p>
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Name</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">John Doe</span></div>
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Email</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">john@example.com</span></div>
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Account Type</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">Individual</span></div>
     <hr style="${dividerStyle}" />
     <a href="${APP_URL}/admin" style="${btnStyle}">View in Admin</a>`),

  templateBlock('9. Admin — New Payment', 'New payment: $29.99 — Premium plan',
    `<p style="${greetingStyle}">Payment received!</p>
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Customer</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">John Doe</span></div>
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Email</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">john@example.com</span></div>
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Plan</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">Premium</span></div>
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Amount</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">$29.99</span></div>
     <div style="${detailRowStyle}"><span style="color:#94a3b8; font-size:14px;">Transaction ID</span><span style="color:#f1f5f9; font-size:14px; font-weight:600;">PAYPAL-PREVIEW-TXN-002</span></div>
     <hr style="${dividerStyle}" />
     <a href="${APP_URL}/admin" style="${btnStyle}">View in Admin</a>`)
];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>All TestCEFR Email Templates</title>
</head>
<body style="margin:0; padding:0; background:#0a0a0a; font-family:Arial,sans-serif;">
  <div style="width:100%; background:#0a0a0a; padding:40px 16px;">
    <div style="${cardStyle}">
      <!-- Master header -->
      <div style="background:linear-gradient(135deg,#7c3aed,#db2777); padding:32px 40px; text-align:center; border-radius:16px 16px 0 0;">
        <h1 style="margin:0; color:#fff; font-size:24px; font-weight:700;">TestCEFR — All Email Templates</h1>
        <p style="margin:8px 0 0; color:rgba(255,255,255,0.7); font-size:14px;">9 email templates used by the platform</p>
      </div>

      <!-- Templates -->
      <div style="padding:32px 24px;">
        ${templates.join('\n')}
      </div>

      <!-- Footer -->
      <div style="padding:20px 40px 28px; text-align:center; border-top:1px solid rgba(139,92,246,0.15);">
        <p style="margin:0 0 6px; font-size:12px; color:#64748b;">&copy; 2026 TestCEFR. All rights reserved.</p>
        <p style="margin:0; font-size:12px;"><a href="${APP_URL}" style="color:#a78bfa;">testcefr.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;

async function main() {
  console.log('Sending all 9 email templates in one email to', TO_EMAIL);
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: TO_EMAIL,
      subject: 'TestCEFR — All 9 Email Templates Preview',
      html,
    });
    console.log('✓ Sent successfully! ID:', result.data?.id || result);
  } catch (err) {
    console.error('✗ Failed:', err.message || err);
  }
}

main();
