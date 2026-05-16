import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';

// CEFR level descriptions for the certificate
const CEFR_DESCRIPTIONS: Record<string, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced',
  C2: 'Proficient',
};

// Colorized level colors (matching the website)
const CEFR_COLORS: Record<string, { r: number; g: number; b: number; hex: string }> = {
  A1: { r: 0.23, g: 0.51, b: 0.96, hex: '#3b82f6' },  // Blue
  A2: { r: 0.13, g: 0.77, b: 0.37, hex: '#22c55e' },  // Green
  B1: { r: 0.92, g: 0.70, b: 0.03, hex: '#eab308' },  // Yellow
  B2: { r: 0.98, g: 0.45, b: 0.09, hex: '#f97316' },  // Orange
  C1: { r: 0.94, g: 0.27, b: 0.27, hex: '#ef4444' },  // Red
  C2: { r: 0.66, g: 0.33, b: 0.97, hex: '#a855f7' },  // Purple
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

// Teal-to-navy gradient colors
const TEAL  = rgb(0.17, 0.62, 0.56);   // #2A9D8F
const NAVY  = rgb(0.15, 0.27, 0.33);   // #264653
const ORANGE_ACCENT = rgb(0.96, 0.64, 0.38); // #F4A261
const BURNT_ORANGE  = rgb(0.91, 0.44, 0.32); // #E76F51
const WHITE = rgb(1, 1, 1);
const SEMI_WHITE = rgb(1, 1, 1);  // for text
const FAINT_WHITE = rgb(1, 1, 1); // for muted text

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape

  const width = page.getWidth();
  const height = page.getHeight();
  const centerX = width / 2;

  const levelColor = CEFR_COLORS[data.cefrLevel] || CEFR_COLORS.B1;
  const levelAccent = rgb(levelColor.r, levelColor.g, levelColor.b);

  // Embed standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // ── Background: teal-to-navy gradient simulation (horizontal bands) ──
  const gradientSteps = 40;
  for (let i = 0; i < gradientSteps; i++) {
    const t = i / gradientSteps;
    const r = TEAL.red * (1 - t) + NAVY.red * t;
    const g = TEAL.green * (1 - t) + NAVY.green * t;
    const b = TEAL.blue * (1 - t) + NAVY.blue * t;
    const bandHeight = height / gradientSteps;
    page.drawRectangle({
      x: 0,
      y: height - (i + 1) * bandHeight,
      width: width,
      height: bandHeight + 1,
      color: rgb(r, g, b),
    });
  }

  // ── Top accent line (orange gradient) ──
  page.drawRectangle({
    x: 0,
    y: height - 4,
    width: width,
    height: 4,
    color: ORANGE_ACCENT,
  });

  // ── Bottom accent line (orange gradient) ──
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 4,
    color: ORANGE_ACCENT,
  });

  // ── Header Row ──
  // Logo square
  const logoX = 50;
  const logoY = height - 52;
  page.drawRectangle({
    x: logoX,
    y: logoY,
    width: 32,
    height: 32,
    color: rgb(1, 1, 1),
    opacity: 0.2,
  });
  page.drawText('C', {
    x: logoX + 9,
    y: logoY + 9,
    size: 16,
    font: fontBold,
    color: WHITE,
  });

  // "CEFR Test"
  page.drawText('CEFR Test', {
    x: logoX + 40,
    y: logoY + 20,
    size: 16,
    font: fontBold,
    color: WHITE,
  });

  // "testcefr.com"
  page.drawText('testcefr.com', {
    x: logoX + 40,
    y: logoY + 4,
    size: 8,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.6,
  });

  // Right: "CERTIFICATE OF ACHIEVEMENT"
  const certTitle = 'CERTIFICATE OF ACHIEVEMENT';
  const certTitleWidth = fontRegular.widthOfTextAtSize(certTitle, 8);
  page.drawText(certTitle, {
    x: width - 50 - certTitleWidth,
    y: logoY + 20,
    size: 8,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.6,
    characterSpacing: 2,
  });

  // Certificate ID
  const idText = `ID: ${data.verificationId}`;
  const idWidth = fontRegular.widthOfTextAtSize(idText, 7);
  page.drawText(idText, {
    x: width - 50 - idWidth,
    y: logoY + 6,
    size: 7,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  // ── "THIS CERTIFIES THAT" ──
  const certifiesText = 'THIS CERTIFIES THAT';
  const certifiesWidth = fontRegular.widthOfTextAtSize(certifiesText, 9);
  page.drawText(certifiesText, {
    x: centerX - certifiesWidth / 2,
    y: height - 85,
    size: 9,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.6,
    characterSpacing: 2,
  });

  // ── User Name ──
  const nameSize = 28;
  const nameWidth = fontBold.widthOfTextAtSize(data.userName, nameSize);
  page.drawText(data.userName, {
    x: centerX - nameWidth / 2,
    y: height - 125,
    size: nameSize,
    font: fontBold,
    color: WHITE,
  });

  // ── "has demonstrated English language proficiency at" ──
  const demonText = 'has demonstrated English language proficiency at';
  const demonWidth = fontRegular.widthOfTextAtSize(demonText, 10);
  page.drawText(demonText, {
    x: centerX - demonWidth / 2,
    y: height - 150,
    size: 10,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.7,
  });

  // ── CEFR Level Circle ──
  const circleRadius = 38;
  const circleCenterX = centerX - 40;
  const circleCenterY = height - 215;

  // Circle background (level color with transparency)
  page.drawCircle({
    x: circleCenterX,
    y: circleCenterY,
    radius: circleRadius,
    color: levelAccent,
    opacity: 0.15,
  });
  // Circle border
  page.drawCircle({
    x: circleCenterX,
    y: circleCenterY,
    radius: circleRadius,
    borderColor: levelAccent,
    borderWidth: 2,
  });
  // Level text in circle
  const levelTextSize = 28;
  const levelWidth = fontBold.widthOfTextAtSize(data.cefrLevel, levelTextSize);
  page.drawText(data.cefrLevel, {
    x: circleCenterX - levelWidth / 2,
    y: circleCenterY - 10,
    size: levelTextSize,
    font: fontBold,
    color: levelAccent,
  });

  // Level + Title to the right
  const labelX = circleCenterX + circleRadius + 16;
  page.drawText(data.cefrLevel, {
    x: labelX,
    y: circleCenterY + 8,
    size: 24,
    font: fontBold,
    color: levelAccent,
  });
  page.drawText(CEFR_DESCRIPTIONS[data.cefrLevel] || '', {
    x: labelX,
    y: circleCenterY - 12,
    size: 10,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.7,
  });

  // ── Score + Dates Row ──
  const rowY = height - 295;
  const rowHeight = 50;
  const rowPadding = 60;
  const rowWidth = width - 2 * rowPadding;

  // Row background
  page.drawRectangle({
    x: rowPadding,
    y: rowY,
    width: rowWidth,
    height: rowHeight,
    color: WHITE,
    opacity: 0.08,
  });

  // Score
  const scoreText = `${data.score}%`;
  const scoreWidth = fontBold.widthOfTextAtSize(scoreText, 28);
  page.drawText(scoreText, {
    x: rowPadding + rowWidth / 6 - scoreWidth / 2,
    y: rowY + 18,
    size: 28,
    font: fontBold,
    color: levelAccent,
  });
  const scoreLabel = 'SCORE';
  const scoreLabelWidth = fontRegular.widthOfTextAtSize(scoreLabel, 7);
  page.drawText(scoreLabel, {
    x: rowPadding + rowWidth / 6 - scoreLabelWidth / 2,
    y: rowY + 6,
    size: 7,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.5,
    characterSpacing: 1,
  });

  // Completed date
  const dateStr = data.issuedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const dateWidth = fontRegular.widthOfTextAtSize(dateStr, 11);
  page.drawText(dateStr, {
    x: rowPadding + rowWidth / 2 - dateWidth / 2,
    y: rowY + 25,
    size: 11,
    font: fontRegular,
    color: WHITE,
  });
  const completedLabel = 'COMPLETED';
  const completedLabelWidth = fontRegular.widthOfTextAtSize(completedLabel, 7);
  page.drawText(completedLabel, {
    x: rowPadding + rowWidth / 2 - completedLabelWidth / 2,
    y: rowY + 6,
    size: 7,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.5,
    characterSpacing: 1,
  });

  // Issued date
  const issuedWidth = fontRegular.widthOfTextAtSize(dateStr, 11);
  page.drawText(dateStr, {
    x: rowPadding + rowWidth * 5 / 6 - issuedWidth / 2,
    y: rowY + 25,
    size: 11,
    font: fontRegular,
    color: WHITE,
  });
  const issuedLabel = 'ISSUED';
  const issuedLabelWidth = fontRegular.widthOfTextAtSize(issuedLabel, 7);
  page.drawText(issuedLabel, {
    x: rowPadding + rowWidth * 5 / 6 - issuedLabelWidth / 2,
    y: rowY + 6,
    size: 7,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.5,
    characterSpacing: 1,
  });

  // ── Skill Breakdown ──
  const skills = data.skillBreakdown || {};
  const skillEntries = Object.entries(skills).filter(([_, v]) => v !== undefined && v !== null);

  if (skillEntries.length > 0) {
    const skillLabel = 'SKILL BREAKDOWN';
    const skillLabelWidth = fontRegular.widthOfTextAtSize(skillLabel, 8);
    page.drawText(skillLabel, {
      x: centerX - skillLabelWidth / 2,
      y: rowY - 25,
      size: 8,
      font: fontRegular,
      color: rgb(1, 1, 1),
      opacity: 0.6,
      characterSpacing: 2,
    });

    const skillLabels: Record<string, string> = {
      reading: 'Reading',
      writing: 'Writing',
      listening: 'Listening',
      speaking: 'Speaking',
      grammar: 'Grammar',
      vocabulary: 'Vocabulary',
    };

    const skillStartY = rowY - 45;
    const skillCardHeight = 40;
    const skillGap = 10;
    const cols = 3;
    const cardPadding = 60;
    const cardWidth = (width - 2 * cardPadding - (cols - 1) * skillGap) / cols;

    skillEntries.forEach(([skill, value], index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = cardPadding + col * (cardWidth + skillGap);
      const y = skillStartY - row * (skillCardHeight + skillGap);

      // Card background
      page.drawRectangle({
        x,
        y,
        width: cardWidth,
        height: skillCardHeight,
        color: WHITE,
        opacity: 0.08,
      });

      // Skill name
      page.drawText(skillLabels[skill] || skill, {
        x: x + 10,
        y: y + 26,
        size: 9,
        font: fontRegular,
        color: WHITE,
      });

      // Skill percentage
      const pctText = `${value}%`;
      const pctWidth = fontBold.widthOfTextAtSize(pctText, 9);
      page.drawText(pctText, {
        x: x + cardWidth - 10 - pctWidth,
        y: y + 26,
        size: 9,
        font: fontBold,
        color: levelAccent,
      });

      // Progress bar background
      const barX = x + 10;
      const barY = y + 10;
      const barWidth = cardWidth - 20;
      const barHeight = 5;

      page.drawRectangle({
        x: barX,
        y: barY,
        width: barWidth,
        height: barHeight,
        color: WHITE,
        opacity: 0.1,
      });

      // Progress bar fill
      const fillWidth = barWidth * (value / 100);
      page.drawRectangle({
        x: barX,
        y: barY,
        width: fillWidth,
        height: barHeight,
        color: levelAccent,
      });
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
      dark: '#264653',
      light: '#ffffff',
    },
  });
  const qrBase64 = qrDataUrl.split(',')[1];
  const qrImage = await pdfDoc.embedPng(Buffer.from(qrBase64, 'base64'));
  const qrSize = 65;
  const qrX = width - 50 - qrSize;
  const qrY = footerY + 15;

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // "Scan to verify" label
  const scanLabel = 'Scan to verify';
  const scanLabelWidth = fontRegular.widthOfTextAtSize(scanLabel, 7);
  page.drawText(scanLabel, {
    x: qrX + (qrSize - scanLabelWidth) / 2,
    y: qrY - 10,
    size: 7,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  // Footer text (left side)
  // AI-Verified Assessment
  page.drawText('AI-Verified Assessment', {
    x: 50,
    y: footerY + 55,
    size: 8,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.7,
  });

  // CEFR Test - testcefr.com
  page.drawText('CEFR Test — testcefr.com', {
    x: 50,
    y: footerY + 40,
    size: 8,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.7,
  });

  // CEFR alignment text
  const alignText = 'Aligned with the Common European Framework of Reference for Languages';
  page.drawText(alignText, {
    x: 50,
    y: footerY + 22,
    size: 6,
    font: fontRegular,
    color: rgb(1, 1, 1),
    opacity: 0.4,
  });

  // ── Save ──
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
