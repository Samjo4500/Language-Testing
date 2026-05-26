import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to view certificates.' },
        { status: 401 }
      );
    }

    const certificates = await db.certificate.findMany({
      where: { userId: authResult.userId },
      orderBy: { issuedAt: 'desc' },
      include: {
        assessment: {
          select: {
            id: true,
            completedAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      certificates: certificates.map((cert) => ({
        id: cert.id,
        verificationId: cert.verificationId,
        userName: cert.userName,
        cefrLevel: cert.cefrLevel,
        score: cert.score,
        type: cert.type,
        courseName: cert.courseName,
        issuedAt: cert.issuedAt,
        assessmentId: cert.assessmentId,
        completedAt: cert.assessment?.completedAt || null,
      })),
    });
  } catch (error) {
    console.error('List certificates error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
