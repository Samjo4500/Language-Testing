import { sendEmail } from '../sender';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface WelcomeTemplateData {
  firstName: string;
}

// ─── Subject ──────────────────────────────────────────────────────────────────
export const subject = 'Welcome to TestCEFR — Your English Journey Starts Here';

// ─── HTML Template ────────────────────────────────────────────────────────────
export function getHtml(data: WelcomeTemplateData): string {
  const { firstName } = data;
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
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#131328; border-radius:16px; border:1px solid rgba(59,130,246,0.15); overflow:hidden;">

          <!-- Logo header -->
          <tr>
            <td align="center" style="padding:40px 40px 20px 40px; background:linear-gradient(135deg,#0a0a1a 0%,#131328 100%);">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:28px; font-weight:800; color:#ffffff; letter-spacing:-0.5px;">
                    Test<span style="background:linear-gradient(135deg,#3b82f6,#8b5cf6); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">CEFR</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Welcome message -->
          <tr>
            <td style="padding:10px 40px 0 40px;">
              <h1 style="margin:0; font-size:26px; font-weight:700; color:#ffffff; line-height:1.3;">
                Welcome, ${firstName}!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px 0 40px;">
              <p style="margin:0; font-size:16px; color:#9ca3af; line-height:1.7;">
                Your account is ready. You are one step away from discovering your true English proficiency level with our internationally recognised CEFR assessment.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding:28px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#3b82f6,#8b5cf6); border-radius:12px;">
                    <a href="${APP_URL}/test" target="_blank" style="display:inline-block; padding:16px 40px; font-size:16px; font-weight:700; color:#ffffff; text-decoration:none; letter-spacing:0.3px;">
                      Take Free Test
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Subtitle -->
          <tr>
            <td style="padding:24px 40px 0 40px;">
              <p style="margin:0; font-size:14px; font-weight:600; color:#ffffff; text-transform:uppercase; letter-spacing:1px;">
                What you get with TestCEFR
              </p>
            </td>
          </tr>

          <!-- Feature cards row 1 -->
          <tr>
            <td style="padding:16px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Card 1: CEFR Assessment -->
                  <td width="48%" valign="top" style="background-color:#0a0a1a; border-radius:12px; border:1px solid rgba(59,130,246,0.1); padding:24px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:32px; line-height:1;">&#x1F3AF;</td>
                      </tr>
                      <tr>
                        <td style="padding-top:12px; font-size:15px; font-weight:700; color:#ffffff;">
                          CEFR Assessment
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:6px; font-size:13px; color:#9ca3af; line-height:1.5;">
                          6 skills tested: grammar, vocabulary, reading, listening, writing, and speaking.
                        </td>
                      </tr>
                    </table>
                  </td>
                  <!-- Spacer -->
                  <td width="4%"></td>
                  <!-- Card 2: Certificate -->
                  <td width="48%" valign="top" style="background-color:#0a0a1a; border-radius:12px; border:1px solid rgba(59,130,246,0.1); padding:24px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:32px; line-height:1;">&#x1F4DC;</td>
                      </tr>
                      <tr>
                        <td style="padding-top:12px; font-size:15px; font-weight:700; color:#ffffff;">
                          Certificate
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:6px; font-size:13px; color:#9ca3af; line-height:1.5;">
                          Verified PDF certificate shareable with employers and universities.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Feature cards row 2 -->
          <tr>
            <td style="padding:12px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Card 3: AI Tutor -->
                  <td width="48%" valign="top" style="background-color:#0a0a1a; border-radius:12px; border:1px solid rgba(59,130,246,0.1); padding:24px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:32px; line-height:1;">&#x1F916;</td>
                      </tr>
                      <tr>
                        <td style="padding-top:12px; font-size:15px; font-weight:700; color:#ffffff;">
                          AI Tutor
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:6px; font-size:13px; color:#9ca3af; line-height:1.5;">
                          Personalised feedback on writing and speaking from our AI.
                        </td>
                      </tr>
                    </table>
                  </td>
                  <!-- Spacer -->
                  <td width="4%"></td>
                  <!-- Card 4: Community -->
                  <td width="48%" valign="top" style="background-color:#0a0a1a; border-radius:12px; border:1px solid rgba(59,130,246,0.1); padding:24px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:32px; line-height:1;">&#x1F310;</td>
                      </tr>
                      <tr>
                        <td style="padding-top:12px; font-size:15px; font-weight:700; color:#ffffff;">
                          Community
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:6px; font-size:13px; color:#9ca3af; line-height:1.5;">
                          Connect with learners worldwide. Share moments and practice together.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:28px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid rgba(59,130,246,0.12); font-size:1px; line-height:1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Closing message -->
          <tr>
            <td style="padding:20px 40px 0 40px;">
              <p style="margin:0; font-size:14px; color:#9ca3af; line-height:1.6;">
                If you did not create this account, you can safely ignore this email. No action will be taken.
              </p>
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
export function getText(data: WelcomeTemplateData): string {
  const { firstName } = data;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

  return `Welcome to TestCEFR, ${firstName}!

Your account is ready. You are one step away from discovering your true English proficiency level with our internationally recognised CEFR assessment.

Take your free test now: ${APP_URL}/test

What you get with TestCEFR:

- CEFR Assessment: 6 skills tested — grammar, vocabulary, reading, listening, writing, and speaking.
- Certificate: Verified PDF certificate shareable with employers and universities.
- AI Tutor: Personalised feedback on writing and speaking from our AI.
- Community: Connect with learners worldwide. Share moments and practice together.

If you did not create this account, you can safely ignore this email.

${new Date().getFullYear()} TestCEFR. All rights reserved.
${APP_URL}`;
}

// ─── Convenience Send Function ────────────────────────────────────────────────
export async function send(to: string, data: WelcomeTemplateData): Promise<void> {
  await sendEmail({
    to,
    subject,
    html: getHtml(data),
    text: getText(data),
  });
}
