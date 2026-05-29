import { sendEmail } from '../sender';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PaymentConfirmTemplateData {
  firstName: string;
  amount: string;
  planName: string;
  transactionId: string;
  paymentDate: string;
  isCertificate: boolean;
}

// ─── Subject ──────────────────────────────────────────────────────────────────
export function getSubject(data: PaymentConfirmTemplateData): string {
  return `Payment Confirmed — ${data.planName}`;
}

// ─── HTML Template ────────────────────────────────────────────────────────────
export function getHtml(data: PaymentConfirmTemplateData): string {
  const { firstName, amount, planName, transactionId, paymentDate, isCertificate } = data;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

  // Conditional CTA
  const ctaLink = isCertificate ? `${APP_URL}/dashboard` : `${APP_URL}/dashboard`;
  const ctaLabel = isCertificate ? 'Download Certificate' : 'Go to Dashboard';
  const ctaSubtext = isCertificate
    ? 'Your verified certificate is ready to download and share.'
    : 'Start exploring your premium features now.';

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${getSubject(data)}</title>
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
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#131328; border-radius:16px; border:1px solid rgba(16,185,129,0.15); overflow:hidden;">

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

          <!-- Green checkmark -->
          <tr>
            <td align="center" style="padding:10px 40px 0 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="width:72px; height:72px; background-color:rgba(16,185,129,0.12); border-radius:50%; text-align:center; vertical-align:middle;">
                    <span style="font-size:36px; line-height:72px; display:block;">&#x2705;</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding:16px 40px 0 40px;">
              <h1 style="margin:0; font-size:24px; font-weight:700; color:#ffffff; line-height:1.3;">
                Payment Confirmed!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 40px 0 40px;">
              <p style="margin:0; font-size:16px; color:#9ca3af; line-height:1.7;">
                Hi ${firstName}, your payment has been successfully processed. Thank you for choosing TestCEFR!
              </p>
            </td>
          </tr>

          <!-- Receipt table -->
          <tr>
            <td style="padding:24px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a1a; border-radius:12px; border:1px solid rgba(16,185,129,0.1);">
                <!-- Receipt header -->
                <tr>
                  <td style="padding:16px 24px 12px 24px; border-bottom:1px solid rgba(255,255,255,0.06);">
                    <p style="margin:0; font-size:12px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">
                      Receipt
                    </p>
                  </td>
                </tr>
                <!-- Plan -->
                <tr>
                  <td style="padding:12px 24px 0 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:14px; color:#9ca3af;">Plan</td>
                        <td align="right" style="font-size:14px; color:#ffffff; font-weight:600;">${planName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Amount -->
                <tr>
                  <td style="padding:10px 24px 0 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:14px; color:#9ca3af;">Amount</td>
                        <td align="right" style="font-size:14px; color:#10b981; font-weight:700;">${amount}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Transaction ID -->
                <tr>
                  <td style="padding:10px 24px 0 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:14px; color:#9ca3af;">Transaction ID</td>
                        <td align="right" style="font-size:14px; color:#ffffff; font-weight:600; font-family:'Courier New',monospace;">${transactionId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Payment Date -->
                <tr>
                  <td style="padding:10px 24px 16px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:14px; color:#9ca3af;">Date</td>
                        <td align="right" style="font-size:14px; color:#ffffff; font-weight:600;">${paymentDate}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conditional CTA -->
          <tr>
            <td align="center" style="padding:24px 40px 4px 40px;">
              <p style="margin:0; font-size:14px; color:#9ca3af; line-height:1.5;">
                ${ctaSubtext}
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:12px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#10b981,#059669); border-radius:12px;">
                    <a href="${ctaLink}" target="_blank" style="display:inline-block; padding:16px 40px; font-size:16px; font-weight:700; color:#ffffff; text-decoration:none; letter-spacing:0.3px;">
                      ${ctaLabel}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support box -->
          <tr>
            <td style="padding:20px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(59,130,246,0.06); border-radius:10px; border:1px solid rgba(59,130,246,0.12);">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0; font-size:14px; color:#3b82f6; font-weight:600; line-height:1.5;">
                      &#x1F4AC; Need help?
                    </p>
                    <p style="margin:6px 0 0; font-size:13px; color:#9ca3af; line-height:1.5;">
                      If you have any questions about your payment or need assistance, reply to this email or visit our <a href="${APP_URL}/contact" target="_blank" style="color:#3b82f6; text-decoration:none;">support page</a>. We typically respond within 24 hours.
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
export function getText(data: PaymentConfirmTemplateData): string {
  const { firstName, amount, planName, transactionId, paymentDate, isCertificate } = data;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

  const ctaLabel = isCertificate ? 'Download your certificate' : 'Go to your dashboard';
  const ctaLink = isCertificate ? `${APP_URL}/dashboard` : `${APP_URL}/dashboard`;

  return `Payment Confirmed — ${planName}

Hi ${firstName},

Your payment has been successfully processed. Thank you for choosing TestCEFR!

RECEIPT
-------
Plan:           ${planName}
Amount:         ${amount}
Transaction ID: ${transactionId}
Date:           ${paymentDate}

${ctaLabel}: ${ctaLink}

Need help? Reply to this email or visit ${APP_URL}/contact. We typically respond within 24 hours.

${new Date().getFullYear()} TestCEFR. All rights reserved.
${APP_URL}`;
}

// ─── Convenience Send Function ────────────────────────────────────────────────
export async function send(to: string, data: PaymentConfirmTemplateData): Promise<void> {
  await sendEmail({
    to,
    subject: getSubject(data),
    html: getHtml(data),
    text: getText(data),
  });
}
