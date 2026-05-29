import { sendEmail } from '../sender';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PasswordResetTemplateData {
  firstName: string;
  resetUrl: string;
}

// ─── Subject ──────────────────────────────────────────────────────────────────
export const subject = 'Reset your TestCEFR password';

// ─── HTML Template ────────────────────────────────────────────────────────────
export function getHtml(data: PasswordResetTemplateData): string {
  const { firstName, resetUrl } = data;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${subject}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#06060f; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; -webkit-font-smoothing:antialiased;">
  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#06060f;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Main card 600px -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#131328; border-radius:16px; border:1px solid rgba(245,158,11,0.15); overflow:hidden;">

          <!-- Logo header -->
          <tr>
            <td align="center" style="padding:40px 40px 20px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:28px; font-weight:800; color:#ffffff; letter-spacing:-0.5px;">
                    Test<span style="background:linear-gradient(135deg,#3b82f6,#8b5cf6); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">CEFR</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Warning icon -->
          <tr>
            <td align="center" style="padding:10px 40px 0 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="width:64px; height:64px; background-color:rgba(245,158,11,0.12); border-radius:50%; text-align:center; vertical-align:middle;">
                    <span style="font-size:32px; line-height:64px; display:block;">&#x26A0;&#xFE0F;</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding:16px 40px 0 40px;">
              <h1 style="margin:0; font-size:24px; font-weight:700; color:#ffffff; line-height:1.3;">
                Password Reset Request
              </h1>
            </td>
          </tr>

          <!-- Body text -->
          <tr>
            <td style="padding:16px 40px 0 40px;">
              <p style="margin:0; font-size:16px; color:#9ca3af; line-height:1.7;">
                Hi ${firstName}, we received a request to reset your TestCEFR account password. Click the button below to choose a new one.
              </p>
            </td>
          </tr>

          <!-- CTA Button — amber to red gradient -->
          <tr>
            <td align="center" style="padding:28px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#f59e0b,#ef4444); border-radius:12px;">
                    <a href="${resetUrl}" target="_blank" style="display:inline-block; padding:16px 40px; font-size:16px; font-weight:700; color:#ffffff; text-decoration:none; letter-spacing:0.3px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td align="center" style="padding:12px 40px 0 40px;">
              <p style="margin:0; font-size:13px; color:#6b7280; line-height:1.5;">
                If the button does not work, copy and paste this link into your browser:
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:6px 40px 0 40px;">
              <p style="margin:0; font-size:13px; word-break:break-all;">
                <a href="${resetUrl}" target="_blank" style="color:#3b82f6; text-decoration:none;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- 1-hour expiry notice -->
          <tr>
            <td style="padding:24px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(245,158,11,0.08); border-radius:10px; border:1px solid rgba(245,158,11,0.2);">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0; font-size:14px; color:#f59e0b; font-weight:600; line-height:1.5;">
                      &#x23F0; This link expires in 1 hour
                    </p>
                    <p style="margin:6px 0 0; font-size:13px; color:#9ca3af; line-height:1.5;">
                      For security reasons, this password reset link is only valid for 60 minutes. If it has expired, you can request a new one from the forgot password page.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security tip box -->
          <tr>
            <td style="padding:16px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(59,130,246,0.06); border-radius:10px; border:1px solid rgba(59,130,246,0.12);">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0; font-size:14px; color:#3b82f6; font-weight:600; line-height:1.5;">
                      &#x1F512; Security tip
                    </p>
                    <p style="margin:6px 0 0; font-size:13px; color:#9ca3af; line-height:1.5;">
                      If you did not request a password reset, you can safely ignore this email. Your password will not be changed. We recommend enabling two-factor authentication for extra security.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px 36px 40px; text-align:center;">
              <p style="margin:0 0 6px; font-size:12px; color:#6b7280;">
                &copy; ${new Date().getFullYear()} TestCEFR. All rights reserved.
              </p>
              <p style="margin:0; font-size:12px;">
                <a href="${APP_URL}" target="_blank" style="color:#3b82f6; text-decoration:none;">testcefr.com</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- End main card -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Plain Text Fallback ──────────────────────────────────────────────────────
export function getText(data: PasswordResetTemplateData): string {
  const { firstName, resetUrl } = data;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

  return `Password Reset Request

Hi ${firstName},

We received a request to reset your TestCEFR account password. Click the link below to choose a new one:

${resetUrl}

IMPORTANT: This link expires in 1 hour. For security reasons, this password reset link is only valid for 60 minutes. If it has expired, you can request a new one from the forgot password page.

Security tip: If you did not request a password reset, you can safely ignore this email. Your password will not be changed. We recommend enabling two-factor authentication for extra security.

${new Date().getFullYear()} TestCEFR. All rights reserved.
${APP_URL}`;
}

// ─── Convenience Send Function ────────────────────────────────────────────────
export async function send(to: string, data: PasswordResetTemplateData): Promise<void> {
  await sendEmail({
    to,
    subject,
    html: getHtml(data),
    text: getText(data),
  });
}
