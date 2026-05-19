import { Resend } from 'resend';

async function main() {
  const resend = new Resend('re_LZTDkM5t_7zU8QXwNG9EkS3qzMjKXUMEX');
  
  const { data, error } = await resend.emails.send({
    from: 'TestCEFR <noreply@testcefr.com>',
    to: 'samjo4500@gmail.com',
    subject: '✅ testcefr.com is now verified on Resend!',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin:0; padding:0; background:#0a0a0a; font-family:Arial,sans-serif; }
    .wrapper { width:100%; background:#0a0a0a; padding:40px 16px; }
    .card { max-width:560px; margin:0 auto; background:linear-gradient(145deg,#1a1a2e,#16213e); border-radius:16px; border:1px solid rgba(139,92,246,0.2); overflow:hidden; }
    .header { background:linear-gradient(135deg,#7c3aed,#db2777); padding:32px 40px; text-align:center; }
    .header h1 { margin:0; color:#fff; font-size:22px; font-weight:700; }
    .content { padding:32px 40px; color:#e2e8f0; }
    .content p { margin:0 0 16px; line-height:1.7; font-size:15px; color:#cbd5e1; }
    .badge { display:inline-block; padding:12px 24px; background:linear-gradient(135deg,#7c3aed,#db2777); color:#fff; border-radius:8px; font-size:20px; font-weight:700; margin:8px 0 16px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header"><h1>TestCEFR</h1></div>
      <div class="content">
        <p style="font-size:18px; font-weight:600; color:#f1f5f9;">Domain Verified!</p>
        <p>Your domain <strong>testcefr.com</strong> is now verified on Resend. All future emails will be sent from <strong>noreply@testcefr.com</strong> instead of the sandbox address.</p>
        <div style="text-align:center;"><span class="badge">noreply@testcefr.com</span></div>
        <p>This means emails will no longer be rejected and will appear professional in your users' inboxes.</p>
      </div>
    </div>
  </div>
</body>
</html>`
  });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Email sent successfully! ID:', data?.id);
  }
}

main();
