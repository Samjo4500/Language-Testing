import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find by verificationId (the public-facing ID used in QR codes)
    const certificate = await db.certificate.findFirst({
      where: { verificationId: id },
      include: {
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        {
          certificate: null,
          status: "not_found",
        },
        { status: 404 }
      );
    }

    // Parse skill breakdown from JSON
    const skillBreakdown = JSON.parse(certificate.skillBreakdown || "{}");
    const skillNames: Record<string, string> = {
      grammar: "Grammar",
      vocabulary: "Vocabulary",
      reading: "Reading",
      listening: "Listening",
      speaking: "Speaking",
      writing: "Writing",
    };

    // Determine CEFR level for each skill based on score
    const getLevel = (score: number): string => {
      if (score >= 90) return "C1";
      if (score >= 75) return "B2";
      if (score >= 60) return "B1";
      if (score >= 40) return "A2";
      return "A1";
    };

    const skillsAssessed = Object.entries(skillBreakdown).map(
      ([key, score]) => ({
        name: skillNames[key] || key,
        score: score as number,
        level: getLevel(score as number),
      })
    );

    // Check expiry (2 years from issue)
    const issueDate = new Date(certificate.issuedAt);
    const expiryDate = new Date(issueDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
    const isExpired = new Date() > expiryDate;

    return NextResponse.json({
      certificate: {
        certificateId: certificate.verificationId,
        userName: certificate.userName,
        courseName: certificate.courseName || `${certificate.cefrLevel} English Assessment`,
        courseLevel: certificate.cefrLevel,
        cefrLevel: certificate.cefrLevel,
        completionDate: certificate.issuedAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        issueDate: certificate.issuedAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        expiryDate: expiryDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        score: certificate.score,
        skillsAssessed,
        verificationStatus: isExpired ? "expired" : "valid",
        verifiedBy: "TestCEFR AI Assessment Engine",
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify certificate" },
      { status: 500 }
    );
  }
}
