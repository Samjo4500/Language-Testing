import { NextRequest, NextResponse } from 'next/server';
import { generateCertificatePDF } from '@/lib/certificate/pdf-generator';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ verificationId: string }> }
) {
  try {
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

    const pdfBuffer = await generateCertificatePDF({
      userName: certificate.userName,
      cefrLevel: certificate.cefrLevel,
      score: certificate.score,
      verificationId: certificate.verificationId,
      issuedAt: certificate.issuedAt,
      skillBreakdown,
    });

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="TestCEFR-Certificate-${certificate.cefrLevel}-${certificate.verificationId}.pdf"`,
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
