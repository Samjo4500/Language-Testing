import { sendEmail } from '../sender';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TestResultsTemplateData {
  firstName: string;
  cefrLevel: string;
  grammarScore: number;
  vocabScore: number;
  readingScore: number;
  listeningScore: number;
}

// ─── Subject ──────────────────────────────────────────────────────────────────
export function getSubject(data: TestResultsTemplateData): string {
  return `Your CEFR Results Are In — Level ${data.cefrLevel}`;
}

// ─── Helper: Score bar ────────────────────────────────────────────────────────
function scoreBar(label: string, score: number, color: string): string {
  const width = Math.max(0, Math.min(100, score));
  return `
  <tr>
    <td style="padding:12px 0 0 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:0 0 6px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-size:14px; color:#ffffff; font-weight:600;">${label}</td>
                <td align="right" style="font-size:14px; color:${color}; font-weight:700;">${score}%</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background-color:rgba(255,255,255,0.06); border-radius:6px; height:10px; font-size:1px; line-height:1px;">
            <!--[if mso]>
            <v:rect style="width:${width * 3.9}pt;height:10pt" fillcolor="${color}" stroked="f" />
            <![endif]-->
            <!--[if !mso]><!-->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:${width}%; height:10px;">
              <tr>
                <td style="background-color:${color}; border-radius:6px; height:10px; font-size:1px; line-height:1px;">&nbsp;</td>
              </tr>
            </table>
            <!--<![endif]-->
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

// ─── HTML Template ────────────────────────────────────────────────────────────
export function getHtml(data: TestResultsTemplateData): string {
  const { firstName, cefrLevel, grammarScore, vocabScore, readingScore, listeningScore } = data;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

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
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#131328; border-radius:16px; border:1px solid rgba(59,130,246,0.15); overflow:hidden;">

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

          <!-- Title -->
          <tr>
            <td align="center" style="padding:10px 40px 0 40px;">
              <h1 style="margin:0; font-size:24px; font-weight:700; color:#ffffff; line-height:1.3;">
                Your CEFR Results Are In!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 40px 0 40px;">
              <p style="margin:0; font-size:16px; color:#9ca3af; line-height:1.7;">
                Great work, ${firstName}! You have completed your English proficiency assessment. Here is your overall level:
              </p>
            </td>
          </tr>

          <!-- CEFR Level Badge -->
          <tr>
            <td align="center" style="padding:24px 40px 0 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#3b82f6,#8b5cf6); border-radius:16px; padding:20px 48px;">
                    <p style="margin:0; font-size:48px; font-weight:800; color:#ffffff; letter-spacing:2px; line-height:1;">${cefrLevel}</p>
                    <p style="margin:8px 0 0; font-size:14px; color:rgba(255,255,255,0.8); text-transform:uppercase; letter-spacing:1px;">Your CEFR Level</p>
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

          <!-- Score Breakdown -->
          <tr>
            <td style="padding:20px 40px 0 40px;">
              <p style="margin:0; font-size:14px; font-weight:600; color:#ffffff; text-transform:uppercase; letter-spacing:1px;">
                Score Breakdown
              </p>
            </td>
          </tr>

          <!-- Grammar -->
          ${scoreBar('Grammar', grammarScore, '#3b82f6')}
          <!-- Vocabulary -->
          ${scoreBar('Vocabulary', vocabScore, '#8b5cf6')}
          <!-- Reading -->
          ${scoreBar('Reading', readingScore, '#10b981')}
          <!-- Listening -->
          ${scoreBar('Listening', listeningScore, '#f59e0b')}

          <!-- View Full Results CTA -->
          <tr>
            <td align="center" style="padding:28px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#3b82f6,#8b5cf6); border-radius:12px;">
                    <a href="${APP_URL}/dashboard" target="_blank" style="display:inline-block; padding:16px 40px; font-size:16px; font-weight:700; color:#ffffff; text-decoration:none; letter-spacing:0.3px;">
                      View Full Results
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Certificate Upsell Card -->
          <tr>
            <td style="padding:24px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a1a; border-radius:12px; border:1px solid rgba(139,92,246,0.2);">
                <tr>
                  <td style="padding:24px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <p style="margin:0; font-size:16px; font-weight:700; color:#ffffff;">
                            &#x1F4DC; Get Your Verified Certificate
                          </p>
                        </td>
                        <td align="right" valign="middle">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6); border-radius:8px; padding:6px 14px;">
                                <p style="margin:0; font-size:18px; font-weight:800; color:#ffffff;">$19</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:10px;">
                          <p style="margin:0; font-size:13px; color:#9ca3af; line-height:1.6;">
                            Upgrade to get a downloadable, verifiable PDF certificate you can share with employers, universities, and on LinkedIn. Includes a unique verification ID.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:14px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background-color:rgba(59,130,246,0.15); border-radius:8px;">
                                <a href="${APP_URL}/pricing" target="_blank" style="display:inline-block; padding:10px 24px; font-size:14px; font-weight:600; color:#3b82f6; text-decoration:none;">
                                  Get Certificate &rarr;
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
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
export function getText(data: TestResultsTemplateData): string {
  const { firstName, cefrLevel, grammarScore, vocabScore, readingScore, listeningScore } = data;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

  return `Your CEFR Results Are In — Level ${cefrLevel}

Great work, ${firstName}! You have completed your English proficiency assessment.

Your CEFR Level: ${cefrLevel}

Score Breakdown:
- Grammar: ${grammarScore}%
- Vocabulary: ${vocabScore}%
- Reading: ${readingScore}%
- Listening: ${listeningScore}%

View your full results: ${APP_URL}/dashboard

Get your verified certificate for $19 — a downloadable, verifiable PDF you can share with employers, universities, and on LinkedIn.
Upgrade now: ${APP_URL}/pricing

${new Date().getFullYear()} TestCEFR. All rights reserved.
${APP_URL}`;
}

// ─── Convenience Send Function ────────────────────────────────────────────────
export async function send(to: string, data: TestResultsTemplateData): Promise<void> {
  await sendEmail({
    to,
    subject: getSubject(data),
    html: getHtml(data),
    text: getText(data),
  });
}
