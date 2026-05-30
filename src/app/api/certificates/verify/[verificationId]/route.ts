import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { certificateLimiter } from '@/lib/rate-limit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ verificationId: string }> }
) {
  try {
    // Rate limit certificate verification to prevent scraping
    const limitError = certificateLimiter(request);
    if (limitError) return limitError;

    const { verificationId } = await params;

    const certificate = await db.certificate.findFirst({
      where: { verificationId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Certificate not found. Please check the verification ID and try again.' },
        { status: 404 }
      );
    }

    // Return public certificate info (no sensitive data)
    return NextResponse.json({
      valid: true,
      certificate: {
        verificationId: certificate.verificationId,
        userName: certificate.userName,
        cefrLevel: certificate.cefrLevel,
        score: certificate.score,
        skillBreakdown: JSON.parse(certificate.skillBreakdown || '{}'),
        issuedAt: certificate.issuedAt,
        type: certificate.type,
        courseName: certificate.courseName,
        assessmentId: certificate.assessmentId,
        completedAt: certificate.issuedAt,
      },
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
