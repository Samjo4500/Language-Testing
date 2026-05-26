import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

// CEFR level descriptions
const CEFR_DESCRIPTIONS: Record<string, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced',
  C2: 'Proficient',
};

// CEFR level colors (matching the website gradient system)
const CEFR_COLORS: Record<string, { r: number; g: number; b: number }> = {
  A1: { r: 0.23, g: 0.51, b: 0.96 },  // Blue
  A2: { r: 0.13, g: 0.77, b: 0.37 },  // Green
  B1: { r: 0.92, g: 0.70, b: 0.03 },  // Yellow
  B2: { r: 0.98, g: 0.45, b: 0.09 },  // Orange
  C1: { r: 0.94, g: 0.27, b: 0.27 },  // Red
  C2: { r: 0.66, g: 0.33, b: 0.97 },  // Purple
};

// Skill bar colors (matching the website)
const SKILL_COLORS: Record<string, { r1: number; g1: number; b1: number; r2: number; g2: number; b2: number }> = {
  reading:    { r1: 0.37, g1: 0.58, b1: 0.96, r2: 0.32, g2: 0.77, b2: 0.96 },   // blue to cyan
  writing:    { r1: 0.55, g1: 0.30, b1: 0.96, r2: 0.60, g2: 0.22, b2: 0.96 },   // violet to purple
  listening:  { r1: 0.37, g1: 0.77, b1: 0.45, r2: 0.30, g2: 0.77, b2: 0.45 },   // green to emerald
  speaking:   { r1: 0.98, g1: 0.45, b1: 0.09, r2: 0.96, g2: 0.56, b2: 0.09 },   // orange to amber
  grammar:    { r1: 0.55, g1: 0.30, b1: 0.96, r2: 0.96, g2: 0.22, b2: 0.55 },   // purple to pink
  vocabulary: { r1: 0.32, g1: 0.77, b1: 0.96, r2: 0.37, g2: 0.58, b2: 0.96 },   // cyan to blue
};

interface SkillBreakdown {
  reading?: number;
  writing?: number;
  listening?: number;
  speaking?: number;
  grammar?: number;
  vocabulary?: number;
}

interface CertificateData {
  userName: string;
  cefrLevel: string;
  score: number;
  verificationId: string;
  issuedAt: Date;
  skillBreakdown?: SkillBreakdown;
}

// Color constants matching the website
const DARK_BG      = rgb(0.06, 0.04, 0.12);   // #0F0A1E
const PURPLE_START = rgb(0.55, 0.36, 0.96);   // #8B5CF6 purple-500
const PINK_END     = rgb(0.93, 0.28, 0.60);   // #EC4899 pink-500
const WHITE        = rgb(1, 1, 1);

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape

  const width = page.getWidth();
  const height = page.getHeight();
  const centerX = width / 2;

  const levelColor = CEFR_COLORS[data.cefrLevel] || CEFR_COLORS.B2;
  const levelAccent = rgb(levelColor.r, levelColor.g, levelColor.b);

  // Embed standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ── Background: dark (#0F0A1E) ──
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: DARK_BG,
  });

  // ── Gradient border frame (purple-to-pink gradient, 2px wide) ──
  const borderW = 2;
  const gradientSteps = 30;
  for (let i = 0; i < gradientSteps; i++) {
    const t = i / gradientSteps;
    const r = PURPLE_START.red * (1 - t) + PINK_END.red * t;
    const g = PURPLE_START.green * (1 - t) + PINK_END.green * t;
    const b = PURPLE_START.blue * (1 - t) + PINK_END.blue * t;
    const segW = width / gradientSteps;
    page.drawRectangle({ x: i * segW, y: height - borderW, width: segW + 1, height: borderW, color: rgb(r, g, b) });
    page.drawRectangle({ x: i * segW, y: 0, width: segW + 1, height: borderW, color: rgb(r, g, b) });
  }
  // Left border (purple)
  page.drawRectangle({ x: 0, y: 0, width: borderW, height, color: PURPLE_START });
  // Right border (pink)
  page.drawRectangle({ x: width - borderW, y: 0, width: borderW, height, color: PINK_END });

  const marginX = 50;
  const contentWidth = width - 2 * marginX;

  // ── Vertical layout positions (top-down, with proper spacing to prevent overlap) ──
  // We use a cursor that moves down the page
  let cursorY = height - 35;

  // ── "CERTIFICATE OF PROFICIENCY" ──
  const certTitle = 'CERTIFICATE OF PROFICIENCY';
  const certTitleWidth = fontRegular.widthOfTextAtSize(certTitle, 10);
  page.drawText(certTitle, {
    x: centerX - certTitleWidth / 2,
    y: cursorY,
    size: 10,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.6,
  });

  cursorY -= 30;

  // ── Logo area ──
  const logoX = centerX - 60;
  // Logo square
  page.drawRectangle({
    x: logoX,
    y: cursorY - 24,
    width: 24,
    height: 24,
    color: rgb(0.58, 0.22, 0.96),
  });
  page.drawText('CE', {
    x: logoX + 4,
    y: cursorY - 17,
    size: 10,
    font: fontBold,
    color: WHITE,
  });
  // Brand text
  page.drawText('testcefr.com', {
    x: logoX + 30,
    y: cursorY - 10,
    size: 13,
    font: fontBold,
    color: WHITE,
  });
  page.drawText('ENGLISH ASSESSMENT', {
    x: logoX + 30,
    y: cursorY - 22,
    size: 6,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  cursorY -= 40;

  // ── Divider line 1 ──
  for (let i = 0; i < gradientSteps; i++) {
    const t = i / gradientSteps;
    const opacity = t < 0.5 ? t * 2 * 0.15 : (1 - t) * 2 * 0.15;
    const segW = contentWidth / gradientSteps;
    page.drawRectangle({
      x: marginX + i * segW,
      y: cursorY,
      width: segW + 1,
      height: 0.5,
      color: WHITE,
      opacity,
    });
  }

  cursorY -= 30;

  // ── "This is to certify that" ──
  const certifyText = 'This is to certify that';
  const certifyWidth = fontRegular.widthOfTextAtSize(certifyText, 11);
  page.drawText(certifyText, {
    x: centerX - certifyWidth / 2,
    y: cursorY,
    size: 11,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.5,
  });

  cursorY -= 42;

  // ── User Name (dynamic width, with truncation if too long) ──
  let nameSize = 30;
  let nameText = data.userName;
  let nameWidth = fontBold.widthOfTextAtSize(nameText, nameSize);
  // Truncate if name is too wide (max 90% of content width)
  const maxNameWidth = contentWidth * 0.9;
  while (nameWidth > maxNameWidth && nameSize > 16) {
    nameSize -= 2;
    nameWidth = fontBold.widthOfTextAtSize(nameText, nameSize);
  }
  if (nameWidth > maxNameWidth) {
    nameText = nameText.substring(0, 20) + '...';
    nameWidth = fontBold.widthOfTextAtSize(nameText, nameSize);
  }
  page.drawText(nameText, {
    x: centerX - nameWidth / 2,
    y: cursorY,
    size: nameSize,
    font: fontBold,
    color: WHITE,
  });

  cursorY -= 28;

  // ── "has achieved CEFR Level" ──
  const achievedText = 'has achieved CEFR Level';
  const achievedWidth = fontRegular.widthOfTextAtSize(achievedText, 11);
  page.drawText(achievedText, {
    x: centerX - achievedWidth / 2,
    y: cursorY,
    size: 11,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.5,
  });

  cursorY -= 48;

  // ── CEFR Level Circle ──
  const circleRadius = 30;
  // Circle background (level color with opacity)
  page.drawCircle({
    x: centerX,
    y: cursorY,
    size: circleRadius,
    color: levelAccent,
    opacity: 0.2,
  });
  // Circle border
  page.drawCircle({
    x: centerX,
    y: cursorY,
    size: circleRadius,
    borderColor: levelAccent,
    borderWidth: 1.5,
  });
  // Level text
  const lvlSize = 22;
  const lvlWidth = fontBold.widthOfTextAtSize(data.cefrLevel, lvlSize);
  page.drawText(data.cefrLevel, {
    x: centerX - lvlWidth / 2,
    y: cursorY - 8,
    size: lvlSize,
    font: fontBold,
    color: levelAccent,
  });

  cursorY -= circleRadius + 18;

  // Level description
  const levelDesc = CEFR_DESCRIPTIONS[data.cefrLevel] || '';
  const levelDescWidth = fontRegular.widthOfTextAtSize(levelDesc, 10);
  page.drawText(levelDesc, {
    x: centerX - levelDescWidth / 2,
    y: cursorY,
    size: 10,
    font: fontRegular,
    color: levelAccent,
    opacity: 0.8,
  });

  cursorY -= 18;

  // ── Divider line 2 ──
  for (let i = 0; i < gradientSteps; i++) {
    const t = i / gradientSteps;
    const opacity = t < 0.5 ? t * 2 * 0.15 : (1 - t) * 2 * 0.15;
    const segW = contentWidth / gradientSteps;
    page.drawRectangle({
      x: marginX + i * segW,
      y: cursorY,
      width: segW + 1,
      height: 0.5,
      color: WHITE,
      opacity,
    });
  }

  cursorY -= 18;

  // ── Score + Dates Row ──
  const rowHeight = 40;
  page.drawRectangle({
    x: marginX,
    y: cursorY - rowHeight,
    width: contentWidth,
    height: rowHeight,
    color: WHITE,
    opacity: 0.05,
  });
  page.drawRectangle({
    x: marginX,
    y: cursorY - rowHeight,
    width: contentWidth,
    height: rowHeight,
    borderColor: WHITE,
    borderWidth: 0.5,
    opacity: 0.1,
  });

  const rowCenterY = cursorY - rowHeight / 2;

  // Score (left third)
  const scoreText = `${data.score}%`;
  const scoreWidth = fontBold.widthOfTextAtSize(scoreText, 22);
  page.drawText(scoreText, {
    x: marginX + contentWidth / 6 - scoreWidth / 2,
    y: rowCenterY + 2,
    size: 22,
    font: fontBold,
    color: levelAccent,
  });
  const scoreLabel = 'SCORE';
  const scoreLabelWidth = fontRegular.widthOfTextAtSize(scoreLabel, 6);
  page.drawText(scoreLabel, {
    x: marginX + contentWidth / 6 - scoreLabelWidth / 2,
    y: rowCenterY - 14,
    size: 6,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  // Completed date (center)
  const completedStr = data.issuedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const completedWidth = fontRegular.widthOfTextAtSize(completedStr, 9);
  page.drawText(completedStr, {
    x: marginX + contentWidth / 2 - completedWidth / 2,
    y: rowCenterY + 1,
    size: 9,
    font: fontRegular,
    color: WHITE,
  });
  const completedLabel = 'COMPLETED';
  const completedLabelWidth = fontRegular.widthOfTextAtSize(completedLabel, 6);
  page.drawText(completedLabel, {
    x: marginX + contentWidth / 2 - completedLabelWidth / 2,
    y: rowCenterY - 14,
    size: 6,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  // Issued date (right third)
  const issuedWidth = fontRegular.widthOfTextAtSize(completedStr, 9);
  page.drawText(completedStr, {
    x: marginX + contentWidth * 5 / 6 - issuedWidth / 2,
    y: rowCenterY + 1,
    size: 9,
    font: fontRegular,
    color: WHITE,
  });
  const issuedLabel = 'ISSUED';
  const issuedLabelWidth = fontRegular.widthOfTextAtSize(issuedLabel, 6);
  page.drawText(issuedLabel, {
    x: marginX + contentWidth * 5 / 6 - issuedLabelWidth / 2,
    y: rowCenterY - 14,
    size: 6,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  cursorY -= rowHeight + 20;

  // ── Skill Breakdown ──
  const skills = data.skillBreakdown || {};
  const skillEntries = Object.entries(skills).filter(([_, v]) => v !== undefined && v !== null);

  if (skillEntries.length > 0) {
    const skillLabel = 'SKILL BREAKDOWN';
    const skillLabelWidth = fontRegular.widthOfTextAtSize(skillLabel, 7);
    page.drawText(skillLabel, {
      x: centerX - skillLabelWidth / 2,
      y: cursorY,
      size: 7,
      font: fontRegular,
      color: rgb(1, 1, 1),
      opacity: 0.4,
    });

    cursorY -= 15;

    const skillLabels: Record<string, string> = {
      reading: 'Reading',
      writing: 'Writing',
      listening: 'Listening',
      speaking: 'Speaking',
      grammar: 'Grammar',
      vocabulary: 'Vocabulary',
    };

    const barHeight = 6;
    const barGap = 16;
    const labelWidth = 70;
    const barStartX = marginX + labelWidth;
    const barMaxWidth = contentWidth - labelWidth - 40;

    skillEntries.forEach(([skill, value], index) => {
      const y = cursorY - index * barGap;

      // Skill name
      page.drawText(skillLabels[skill] || skill, {
        x: marginX,
        y: y,
        size: 8,
        font: fontRegular,
        color: rgb(1, 1, 1),
        opacity: 0.6,
      });

      // Bar background
      page.drawRectangle({
        x: barStartX,
        y: y - 1,
        width: barMaxWidth,
        height: barHeight,
        color: WHITE,
        opacity: 0.1,
      });

      // Bar fill with skill-specific color
      const fillWidth = barMaxWidth * (value / 100);
      const skillColor = SKILL_COLORS[skill] || { r1: levelColor.r, g1: levelColor.g, b1: levelColor.b, r2: levelColor.r, g2: levelColor.g, b2: levelColor.b };
      const barSteps = 10;
      for (let i = 0; i < barSteps; i++) {
        const t = i / barSteps;
        const r = skillColor.r1 * (1 - t) + skillColor.r2 * t;
        const g = skillColor.g1 * (1 - t) + skillColor.g2 * t;
        const b = skillColor.b1 * (1 - t) + skillColor.b2 * t;
        const segWidth = fillWidth / barSteps;
        page.drawRectangle({
          x: barStartX + i * segWidth,
          y: y - 1,
          width: segWidth + 1,
          height: barHeight,
          color: rgb(r, g, b),
        });
      }

      // Percentage text
      const pctText = `${value}%`;
      const pctWidth = fontBold.widthOfTextAtSize(pctText, 8);
      page.drawText(pctText, {
        x: barStartX + barMaxWidth + 5,
        y: y,
        size: 8,
        font: fontBold,
        color: rgb(1, 1, 1),
        opacity: 0.8,
      });
    });

    cursorY -= skillEntries.length * barGap + 10;
  }

  // ── Divider line 3 ──
  for (let i = 0; i < gradientSteps; i++) {
    const t = i / gradientSteps;
    const opacity = t < 0.5 ? t * 2 * 0.15 : (1 - t) * 2 * 0.15;
    const segW = contentWidth / gradientSteps;
    page.drawRectangle({
      x: marginX + i * segW,
      y: cursorY,
      width: segW + 1,
      height: 0.5,
      color: WHITE,
      opacity,
    });
  }

  // ── Footer: QR Code + Verification ──
  const footerY = 20;

  // QR Code
  const verifyUrl = `${APP_URL}/verify/${data.verificationId}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 200,
    margin: 1,
    color: {
      dark: '#a855f7',  // purple-500 matching site
      light: '#0F0A1E', // dark bg
    },
  });
  const qrBase64 = qrDataUrl.split(',')[1];
  const qrImage = await pdfDoc.embedPng(Buffer.from(qrBase64, 'base64'));
  const qrSize = 55;
  const qrX = width - marginX - qrSize;
  const qrY = footerY + 20;

  // QR background
  page.drawRectangle({
    x: qrX - 4,
    y: qrY - 4,
    width: qrSize + 8,
    height: qrSize + 8,
    color: WHITE,
    opacity: 0.1,
    borderColor: WHITE,
    borderWidth: 0.5,
  });

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // "Scan to verify"
  const scanLabel = 'Scan to verify';
  const scanLabelWidth = fontRegular.widthOfTextAtSize(scanLabel, 6);
  page.drawText(scanLabel, {
    x: qrX + (qrSize - scanLabelWidth) / 2,
    y: qrY - 10,
    size: 6,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  // Verified badge
  page.drawText('AI-Verified Assessment', {
    x: marginX,
    y: footerY + 52,
    size: 7,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.6,
  });

  // CEFR Test - testcefr.com
  page.drawText('CEFR Test — testcefr.com', {
    x: marginX,
    y: footerY + 38,
    size: 7,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.6,
  });

  // CEFR alignment text
  const alignText = 'Aligned with the Common European Framework of Reference for Languages';
  page.drawText(alignText, {
    x: marginX,
    y: footerY + 22,
    size: 5,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.3,
  });

  // ── Save ──
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// ── Course Completion Certificate ──

// CEFR level range descriptions for course certificates
const CEFR_RANGE_DESCRIPTIONS: Record<string, string> = {
  'A1-A2': 'Foundation Level',
  'B1-B2': 'Independent Level',
  'C1-C2': 'Proficient Level',
};

// Map a level range to the first level for color picking
function getLevelFromRange(levelRange: string): string {
  if (CEFR_COLORS[levelRange]) return levelRange;
  // For ranges like "A1-A2", use the first level's color
  const firstLevel = levelRange.split('-')[0];
  return CEFR_COLORS[firstLevel] ? firstLevel : 'B2';
}

interface CourseCertificateData {
  userName: string;
  cefrLevel: string; // "A1-A2", "B1-B2", "C1-C2"
  courseName: string;
  score: number;
  verificationId: string;
  issuedAt: Date;
  skillBreakdown?: SkillBreakdown;
}

export async function generateCourseCertificatePDF(data: CourseCertificateData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape

  const width = page.getWidth();
  const height = page.getHeight();
  const centerX = width / 2;

  const colorKey = getLevelFromRange(data.cefrLevel);
  const levelColor = CEFR_COLORS[colorKey] || CEFR_COLORS.B2;
  const levelAccent = rgb(levelColor.r, levelColor.g, levelColor.b);

  // Embed standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ── Background: dark (#0F0A1E) ──
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: DARK_BG,
  });

  // ── Gradient border frame (purple-to-pink gradient, 2px wide) ──
  const borderW = 2;
  const gradientSteps = 30;
  for (let i = 0; i < gradientSteps; i++) {
    const t = i / gradientSteps;
    const r = PURPLE_START.red * (1 - t) + PINK_END.red * t;
    const g = PURPLE_START.green * (1 - t) + PINK_END.green * t;
    const b = PURPLE_START.blue * (1 - t) + PINK_END.blue * t;
    const segW = width / gradientSteps;
    page.drawRectangle({ x: i * segW, y: height - borderW, width: segW + 1, height: borderW, color: rgb(r, g, b) });
    page.drawRectangle({ x: i * segW, y: 0, width: segW + 1, height: borderW, color: rgb(r, g, b) });
  }
  // Left border (purple)
  page.drawRectangle({ x: 0, y: 0, width: borderW, height, color: PURPLE_START });
  // Right border (pink)
  page.drawRectangle({ x: width - borderW, y: 0, width: borderW, height, color: PINK_END });

  const marginX = 50;
  const contentWidth = width - 2 * marginX;

  // ── Vertical layout positions ──
  let cursorY = height - 35;

  // ── "CERTIFICATE OF COMPLETION" ──
  const certTitle = 'CERTIFICATE OF COMPLETION';
  const certTitleWidth = fontRegular.widthOfTextAtSize(certTitle, 10);
  page.drawText(certTitle, {
    x: centerX - certTitleWidth / 2,
    y: cursorY,
    size: 10,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.6,
  });

  cursorY -= 30;

  // ── Logo area ──
  const logoX = centerX - 60;
  page.drawRectangle({
    x: logoX,
    y: cursorY - 24,
    width: 24,
    height: 24,
    color: rgb(0.58, 0.22, 0.96),
  });
  page.drawText('CE', {
    x: logoX + 4,
    y: cursorY - 17,
    size: 10,
    font: fontBold,
    color: WHITE,
  });
  page.drawText('testcefr.com', {
    x: logoX + 30,
    y: cursorY - 10,
    size: 13,
    font: fontBold,
    color: WHITE,
  });
  page.drawText('ENGLISH COURSE', {
    x: logoX + 30,
    y: cursorY - 22,
    size: 6,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  cursorY -= 40;

  // ── Divider line 1 ──
  for (let i = 0; i < gradientSteps; i++) {
    const t = i / gradientSteps;
    const opacity = t < 0.5 ? t * 2 * 0.15 : (1 - t) * 2 * 0.15;
    const segW = contentWidth / gradientSteps;
    page.drawRectangle({
      x: marginX + i * segW,
      y: cursorY,
      width: segW + 1,
      height: 0.5,
      color: WHITE,
      opacity,
    });
  }

  cursorY -= 30;

  // ── "This is to certify that" ──
  const certifyText = 'This is to certify that';
  const certifyWidth = fontRegular.widthOfTextAtSize(certifyText, 11);
  page.drawText(certifyText, {
    x: centerX - certifyWidth / 2,
    y: cursorY,
    size: 11,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.5,
  });

  cursorY -= 42;

  // ── User Name ──
  let nameSize = 30;
  let nameText = data.userName;
  let nameWidth = fontBold.widthOfTextAtSize(nameText, nameSize);
  const maxNameWidth = contentWidth * 0.9;
  while (nameWidth > maxNameWidth && nameSize > 16) {
    nameSize -= 2;
    nameWidth = fontBold.widthOfTextAtSize(nameText, nameSize);
  }
  if (nameWidth > maxNameWidth) {
    nameText = nameText.substring(0, 20) + '...';
    nameWidth = fontBold.widthOfTextAtSize(nameText, nameSize);
  }
  page.drawText(nameText, {
    x: centerX - nameWidth / 2,
    y: cursorY,
    size: nameSize,
    font: fontBold,
    color: WHITE,
  });

  cursorY -= 28;

  // ── "has successfully completed the" ──
  const completedText = 'has successfully completed the';
  const completedTextWidth = fontRegular.widthOfTextAtSize(completedText, 11);
  page.drawText(completedText, {
    x: centerX - completedTextWidth / 2,
    y: cursorY,
    size: 11,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.5,
  });

  cursorY -= 28;

  // ── Course Name ──
  let courseNameSize = 20;
  let courseNameText = data.courseName;
  let courseNameWidth = fontBold.widthOfTextAtSize(courseNameText, courseNameSize);
  while (courseNameWidth > maxNameWidth && courseNameSize > 12) {
    courseNameSize -= 2;
    courseNameWidth = fontBold.widthOfTextAtSize(courseNameText, courseNameSize);
  }
  if (courseNameWidth > maxNameWidth) {
    courseNameText = courseNameText.substring(0, 30) + '...';
    courseNameWidth = fontBold.widthOfTextAtSize(courseNameText, courseNameSize);
  }
  page.drawText(courseNameText, {
    x: centerX - courseNameWidth / 2,
    y: cursorY,
    size: courseNameSize,
    font: fontBold,
    color: levelAccent,
  });

  cursorY -= 36;

  // ── CEFR Level Circle ──
  const circleRadius = 28;
  page.drawCircle({
    x: centerX,
    y: cursorY,
    size: circleRadius,
    color: levelAccent,
    opacity: 0.2,
  });
  page.drawCircle({
    x: centerX,
    y: cursorY,
    size: circleRadius,
    borderColor: levelAccent,
    borderWidth: 1.5,
  });
  // Level range text (e.g., "A1-A2")
  const lvlSize = 18;
  const lvlWidth = fontBold.widthOfTextAtSize(data.cefrLevel, lvlSize);
  page.drawText(data.cefrLevel, {
    x: centerX - lvlWidth / 2,
    y: cursorY - 7,
    size: lvlSize,
    font: fontBold,
    color: levelAccent,
  });

  cursorY -= circleRadius + 14;

  // Level range description
  const rangeDesc = CEFR_RANGE_DESCRIPTIONS[data.cefrLevel] || '';
  if (rangeDesc) {
    const rangeDescWidth = fontRegular.widthOfTextAtSize(rangeDesc, 10);
    page.drawText(rangeDesc, {
      x: centerX - rangeDescWidth / 2,
      y: cursorY,
      size: 10,
      font: fontRegular,
      color: levelAccent,
      opacity: 0.8,
    });
  }

  cursorY -= 18;

  // ── Divider line 2 ──
  for (let i = 0; i < gradientSteps; i++) {
    const t = i / gradientSteps;
    const opacity = t < 0.5 ? t * 2 * 0.15 : (1 - t) * 2 * 0.15;
    const segW = contentWidth / gradientSteps;
    page.drawRectangle({
      x: marginX + i * segW,
      y: cursorY,
      width: segW + 1,
      height: 0.5,
      color: WHITE,
      opacity,
    });
  }

  cursorY -= 18;

  // ── Score + Dates Row ──
  const rowHeight = 40;
  page.drawRectangle({
    x: marginX,
    y: cursorY - rowHeight,
    width: contentWidth,
    height: rowHeight,
    color: WHITE,
    opacity: 0.05,
  });
  page.drawRectangle({
    x: marginX,
    y: cursorY - rowHeight,
    width: contentWidth,
    height: rowHeight,
    borderColor: WHITE,
    borderWidth: 0.5,
    opacity: 0.1,
  });

  const rowCenterY = cursorY - rowHeight / 2;

  // Completion Score (left third)
  const scoreText = `${data.score}%`;
  const scoreWidth = fontBold.widthOfTextAtSize(scoreText, 22);
  page.drawText(scoreText, {
    x: marginX + contentWidth / 6 - scoreWidth / 2,
    y: rowCenterY + 2,
    size: 22,
    font: fontBold,
    color: levelAccent,
  });
  const scoreLabel = 'COMPLETION SCORE';
  const scoreLabelWidth = fontRegular.widthOfTextAtSize(scoreLabel, 5.5);
  page.drawText(scoreLabel, {
    x: marginX + contentWidth / 6 - scoreLabelWidth / 2,
    y: rowCenterY - 14,
    size: 5.5,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  // Completed date (center)
  const completedStr = data.issuedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const completedDateWidth = fontRegular.widthOfTextAtSize(completedStr, 9);
  page.drawText(completedStr, {
    x: marginX + contentWidth / 2 - completedDateWidth / 2,
    y: rowCenterY + 1,
    size: 9,
    font: fontRegular,
    color: WHITE,
  });
  const completedLabel = 'COMPLETED';
  const completedLabelWidth = fontRegular.widthOfTextAtSize(completedLabel, 6);
  page.drawText(completedLabel, {
    x: marginX + contentWidth / 2 - completedLabelWidth / 2,
    y: rowCenterY - 14,
    size: 6,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  // Issued date (right third)
  const issuedWidth = fontRegular.widthOfTextAtSize(completedStr, 9);
  page.drawText(completedStr, {
    x: marginX + contentWidth * 5 / 6 - issuedWidth / 2,
    y: rowCenterY + 1,
    size: 9,
    font: fontRegular,
    color: WHITE,
  });
  const issuedLabel = 'ISSUED';
  const issuedLabelWidth = fontRegular.widthOfTextAtSize(issuedLabel, 6);
  page.drawText(issuedLabel, {
    x: marginX + contentWidth * 5 / 6 - issuedLabelWidth / 2,
    y: rowCenterY - 14,
    size: 6,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  cursorY -= rowHeight + 20;

  // ── Skill Breakdown ──
  const skills = data.skillBreakdown || {};
  const skillEntries = Object.entries(skills).filter(([_, v]) => v !== undefined && v !== null);

  if (skillEntries.length > 0) {
    const skillLabel = 'SKILL BREAKDOWN';
    const skillLabelWidth = fontRegular.widthOfTextAtSize(skillLabel, 7);
    page.drawText(skillLabel, {
      x: centerX - skillLabelWidth / 2,
      y: cursorY,
      size: 7,
      font: fontRegular,
      color: rgb(1, 1, 1),
      opacity: 0.4,
    });

    cursorY -= 15;

    const skillLabels: Record<string, string> = {
      reading: 'Reading',
      writing: 'Writing',
      listening: 'Listening',
      speaking: 'Speaking',
      grammar: 'Grammar',
      vocabulary: 'Vocabulary',
      quiz: 'Quiz',
    };

    const barHeight = 6;
    const barGap = 16;
    const labelWidth = 70;
    const barStartX = marginX + labelWidth;
    const barMaxWidth = contentWidth - labelWidth - 40;

    skillEntries.forEach(([skill, value], index) => {
      const y = cursorY - index * barGap;

      // Skill name
      page.drawText(skillLabels[skill] || skill, {
        x: marginX,
        y: y,
        size: 8,
        font: fontRegular,
        color: rgb(1, 1, 1),
        opacity: 0.6,
      });

      // Bar background
      page.drawRectangle({
        x: barStartX,
        y: y - 1,
        width: barMaxWidth,
        height: barHeight,
        color: WHITE,
        opacity: 0.1,
      });

      // Bar fill with skill-specific color
      const fillWidth = barMaxWidth * (value / 100);
      const skillColor = SKILL_COLORS[skill] || { r1: levelColor.r, g1: levelColor.g, b1: levelColor.b, r2: levelColor.r, g2: levelColor.g, b2: levelColor.b };
      const barSteps = 10;
      for (let i = 0; i < barSteps; i++) {
        const t = i / barSteps;
        const r = skillColor.r1 * (1 - t) + skillColor.r2 * t;
        const g = skillColor.g1 * (1 - t) + skillColor.g2 * t;
        const b = skillColor.b1 * (1 - t) + skillColor.b2 * t;
        const segWidth = fillWidth / barSteps;
        page.drawRectangle({
          x: barStartX + i * segWidth,
          y: y - 1,
          width: segWidth + 1,
          height: barHeight,
          color: rgb(r, g, b),
        });
      }

      // Percentage text
      const pctText = `${value}%`;
      const pctWidth = fontBold.widthOfTextAtSize(pctText, 8);
      page.drawText(pctText, {
        x: barStartX + barMaxWidth + 5,
        y: y,
        size: 8,
        font: fontBold,
        color: rgb(1, 1, 1),
        opacity: 0.8,
      });
    });

    cursorY -= skillEntries.length * barGap + 10;
  }

  // ── Divider line 3 ──
  for (let i = 0; i < gradientSteps; i++) {
    const t = i / gradientSteps;
    const opacity = t < 0.5 ? t * 2 * 0.15 : (1 - t) * 2 * 0.15;
    const segW = contentWidth / gradientSteps;
    page.drawRectangle({
      x: marginX + i * segW,
      y: cursorY,
      width: segW + 1,
      height: 0.5,
      color: WHITE,
      opacity,
    });
  }

  // ── Footer: QR Code + Verification ──
  const footerY = 20;

  // QR Code
  const verifyUrl = `${APP_URL}/verify/${data.verificationId}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 200,
    margin: 1,
    color: {
      dark: '#a855f7',  // purple-500 matching site
      light: '#0F0A1E', // dark bg
    },
  });
  const qrBase64 = qrDataUrl.split(',')[1];
  const qrImage = await pdfDoc.embedPng(Buffer.from(qrBase64, 'base64'));
  const qrSize = 55;
  const qrX = width - marginX - qrSize;
  const qrY = footerY + 20;

  // QR background
  page.drawRectangle({
    x: qrX - 4,
    y: qrY - 4,
    width: qrSize + 8,
    height: qrSize + 8,
    color: WHITE,
    opacity: 0.1,
    borderColor: WHITE,
    borderWidth: 0.5,
  });

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // "Scan to verify"
  const scanLabel = 'Scan to verify';
  const scanLabelWidth = fontRegular.widthOfTextAtSize(scanLabel, 6);
  page.drawText(scanLabel, {
    x: qrX + (qrSize - scanLabelWidth) / 2,
    y: qrY - 10,
    size: 6,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  // Course completion badge text
  page.drawText('Course Completion Certificate', {
    x: marginX,
    y: footerY + 52,
    size: 7,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.6,
  });

  // CEFR Test - testcefr.com
  page.drawText('CEFR Test — testcefr.com', {
    x: marginX,
    y: footerY + 38,
    size: 7,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.6,
  });

  // CEFR alignment text
  const alignText = 'Aligned with the Common European Framework of Reference for Languages';
  page.drawText(alignText, {
    x: marginX,
    y: footerY + 22,
    size: 5,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.3,
  });

  // ── Save ──
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
