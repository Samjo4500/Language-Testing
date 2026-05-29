import { sendEmail } from '../sender';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface WeeklyProgressTemplateData {
  firstName: string;
  xpEarned: number;
  wordsLearned: number;
  streakDays: number;
  streakActive: boolean;
}

// ─── Subject ──────────────────────────────────────────────────────────────────
export function getSubject(data: WeeklyProgressTemplateData): string {
  if (data.streakActive) {
    return `Your ${data.streakDays}-day streak is alive! Weekly Progress`;
  }
  return 'Keep the momentum going — Weekly Progress';
}

// ─── Helper: Stats card ───────────────────────────────────────────────────────
function statCard(icon: string, value: string, label: string, accentColor: string): string {
  return `
  <td width="32%" valign="top" style="background-color:#0a0a1a; border-radius:12px; border:1px solid rgba(59,130,246,0.1); padding:20px 16px; text-align:center;">
    <p style="margin:0; font-size:28px; line-height:1;">${icon}</p>
    <p style="margin:8px 0 0; font-size:28px; font-weight:800; color:${accentColor}; line-height:1.2;">${value}</p>
    <p style="margin:6px 0 0; font-size:12px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px;">${label}</p>
  </td>`;
}

// ─── HTML Template ────────────────────────────────────────────────────────────
export function getHtml(data: WeeklyProgressTemplateData): string {
  const { firstName, xpEarned, wordsLearned, streakDays, streakActive } = data;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

  // Streak card styling
  const streakBg = streakActive ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)';
  const streakBorder = streakActive ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)';
  const streakIcon = streakActive ? '&#x1F525;' : '&#x26A0;&#xFE0F;';
  const streakTitle = streakActive ? 'Your streak is alive!' : 'Your streak needs attention';
  const streakColor = streakActive ? '#10b981' : '#f59e0b';
  const streakMessage = streakActive
    ? `Amazing work! You have been learning for ${streakDays} day${streakDays !== 1 ? 's' : ''} in a row. Keep it going — consistency is the key to language mastery.`
    : `Your streak has paused at ${streakDays} day${streakDays !== 1 ? 's' : ''}. It only takes a few minutes of practice today to keep your momentum going!`;

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
                Your Weekly Progress
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 40px 0 40px;">
              <p style="margin:0; font-size:16px; color:#9ca3af; line-height:1.7;">
                Hi ${firstName}, here is a snapshot of your learning activity this week. Keep up the great work!
              </p>
            </td>
          </tr>

          <!-- Stats row: XP / Words / Streak -->
          <tr>
            <td style="padding:24px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${statCard('&#x26A1;', String(xpEarned), 'XP Earned', '#3b82f6')}
                  <td width="2%"></td>
                  ${statCard('&#x1F4DA;', String(wordsLearned), 'Words Learned', '#8b5cf6')}
                  <td width="2%"></td>
                  ${statCard('&#x1F525;', String(streakDays), 'Day Streak', streakColor)}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Streak status card -->
          <tr>
            <td style="padding:20px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${streakBg}; border-radius:12px; border:1px solid ${streakBorder};">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <p style="margin:0; font-size:18px; line-height:1;">${streakIcon}</p>
                        </td>
                        <td style="padding-left:12px;">
                          <p style="margin:0; font-size:16px; font-weight:700; color:${streakColor}; line-height:1.3;">
                            ${streakTitle}
                          </p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:12px 0 0; font-size:14px; color:#9ca3af; line-height:1.6;">
                      ${streakMessage}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Continue Learning CTA -->
          <tr>
            <td align="center" style="padding:28px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#3b82f6,#8b5cf6); border-radius:12px;">
                    <a href="${APP_URL}/learn" target="_blank" style="display:inline-block; padding:16px 40px; font-size:16px; font-weight:700; color:#ffffff; text-decoration:none; letter-spacing:0.3px;">
                      Continue Learning
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Motivational tip -->
          <tr>
            <td style="padding:16px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(59,130,246,0.06); border-radius:10px; border:1px solid rgba(59,130,246,0.12);">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0; font-size:14px; color:#3b82f6; font-weight:600; line-height:1.5;">
                      &#x1F4A1; Tip of the week
                    </p>
                    <p style="margin:6px 0 0; font-size:13px; color:#9ca3af; line-height:1.5;">
                      Research shows that just 20 minutes of daily practice is more effective than 2 hours once a week. Short, consistent sessions build stronger neural pathways for language learning.
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
export function getText(data: WeeklyProgressTemplateData): string {
  const { firstName, xpEarned, wordsLearned, streakDays, streakActive } = data;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

  const streakStatus = streakActive
    ? `Your ${streakDays}-day streak is alive! Keep it going — consistency is the key to language mastery.`
    : `Your streak has paused at ${streakDays} day${streakDays !== 1 ? 's' : ''}. It only takes a few minutes of practice today to keep your momentum going!`;

  return `Your Weekly Progress

Hi ${firstName}, here is a snapshot of your learning activity this week:

XP Earned:     ${xpEarned}
Words Learned: ${wordsLearned}
Day Streak:    ${streakDays}

${streakStatus}

Continue learning: ${APP_URL}/learn

Tip of the week: Just 20 minutes of daily practice is more effective than 2 hours once a week. Short, consistent sessions build stronger neural pathways for language learning.

${new Date().getFullYear()} TestCEFR. All rights reserved.
${APP_URL}`;
}

// ─── Convenience Send Function ────────────────────────────────────────────────
export async function send(to: string, data: WeeklyProgressTemplateData): Promise<void> {
  await sendEmail({
    to,
    subject: getSubject(data),
    html: getHtml(data),
    text: getText(data),
  });
}
