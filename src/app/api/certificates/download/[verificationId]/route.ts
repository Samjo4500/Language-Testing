import { NextRequest, NextResponse } from 'next/server';
import { generateCertificatePDF, generateCourseCertificatePDF } from '@/lib/certificate/pdf-generator';
import { db } from '@/lib/db';
import { certificateLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ verificationId: string }> }
) {
  try {
    // Rate limit certificate downloads to prevent abuse/scraping
    const limitError = certificateLimiter(request);
    if (limitError) return limitError;

    const { verificationId } = await params;

    // Find the certificate
    const certificate = await db.certificate.findFirst({
      where: { verificationId },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Certificate not found.' },
        { status: 404 }
      );
    }

    // Generate the PDF
    let skillBreakdown = {};
    try {
      skillBreakdown = JSON.parse(certificate.skillBreakdown || '{}');
    } catch {
      // If skillBreakdown contains malformed JSON, use empty object
      console.warn(`Malformed skillBreakdown for certificate ${verificationId}`);
    }

    let pdfBuffer: Buffer;

    if (certificate.type === 'course_completion') {
      // Course completion certificate
      pdfBuffer = await generateCourseCertificatePDF({
        userName: certificate.userName,
        cefrLevel: certificate.cefrLevel,
        courseName: certificate.courseName || 'English Course',
        score: certificate.score,
        verificationId: certificate.verificationId,
        issuedAt: certificate.issuedAt,
        skillBreakdown,
      });
    } else {
      // Assessment certificate (default)
      pdfBuffer = await generateCertificatePDF({
        userName: certificate.userName,
        cefrLevel: certificate.cefrLevel,
        score: certificate.score,
        verificationId: certificate.verificationId,
        issuedAt: certificate.issuedAt,
        skillBreakdown,
      });
    }

    // Return PDF as download
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="TestCEFR-${certificate.type === 'course_completion' ? 'Course' : 'Assessment'}-Certificate-${certificate.cefrLevel}-${certificate.verificationId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Certificate download error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
