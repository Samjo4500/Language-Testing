import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requirePremium } from '@/lib/auth-middleware';
import { v4 as uuidv4 } from 'uuid';
import { sendCertificateReady } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify authentication
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to generate a certificate.' },
        { status: 401 }
      );
    }

    // Step 2: Check premium plan
    const premiumCheck = requirePremium(authResult);
    if (premiumCheck) {
      return premiumCheck;
    }

    // Step 3: Get the request body
    const body = await request.json();
    const { assessmentId } = body;

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Assessment ID is required.' },
        { status: 400 }
      );
    }

    // Step 4: Find the assessment
    const assessment = await db.assessment.findFirst({
      where: {
        id: assessmentId,
        userId: authResult.userId,
        status: 'completed',
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Not Found', message: 'No completed assessment found with this ID.' },
        { status: 404 }
      );
    }

    if (!assessment.cefrLevel || assessment.score === null) {
      return NextResponse.json(
        { error: 'Invalid Assessment', message: 'The assessment does not have valid results.' },
        { status: 400 }
      );
    }

    // Step 5: Check if certificate already exists for this assessment
    const existingCert = await db.certificate.findFirst({
      where: { assessmentId: assessment.id },
    });

    if (existingCert) {
      return NextResponse.json({
        certificate: {
          id: existingCert.id,
          verificationId: existingCert.verificationId,
          cefrLevel: existingCert.cefrLevel,
          score: existingCert.score,
          userName: existingCert.userName,
          issuedAt: existingCert.issuedAt,
        },
        message: 'Certificate already exists for this assessment.',
      });
    }

    // Step 6: Get user info for certificate
    const user = await db.user.findUnique({
      where: { id: authResult.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Not Found', message: 'User not found.' },
        { status: 404 }
      );
    }

    // Step 7: Generate a unique verification ID
    const verificationId = `TC-${uuidv4().split('-')[0].toUpperCase()}-${uuidv4().split('-')[1].toUpperCase()}`;

    // Step 8: Create the certificate
    const certificate = await db.certificate.create({
      data: {
        verificationId,
        userId: authResult.userId,
        assessmentId: assessment.id,
        userName: user.name || user.email.split('@')[0],
        cefrLevel: assessment.cefrLevel,
        score: assessment.score,
      },
    });

    // Send certificate ready email (fire-and-forget)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://testcefr.com';
    const certificateUrl = `${appUrl}/certificate/${certificate.verificationId}`;
    sendCertificateReady(
      user.name || user.email.split('@')[0],
      user.email,
      certificate.cefrLevel,
      certificateUrl,
      user.id
    ).catch((err) => console.error('Certificate ready email error:', err));

    return NextResponse.json({
      certificate: {
        id: certificate.id,
        verificationId: certificate.verificationId,
        cefrLevel: certificate.cefrLevel,
        score: certificate.score,
        userName: certificate.userName,
        issuedAt: certificate.issuedAt,
      },
      message: 'Certificate generated successfully.',
    }, { status: 201 });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
