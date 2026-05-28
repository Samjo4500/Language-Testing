import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    // Cohort analysis: group users by registration month and track their activity
    const users = await db.user.findMany({
      select: {
        id: true,
        createdAt: true,
        assessments: {
          select: { id: true, createdAt: true, status: true },
        },
        payments: {
          select: { id: true, createdAt: true, status: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group users by cohort month
    const cohortMap = new Map<string, {
      cohortMonth: string;
      users: number;
      activeWeek1: number;
      activeWeek2: number;
      activeWeek4: number;
      convertedWeek1: number;
      convertedWeek4: number;
      retained: number;
    }>();

    for (const user of users) {
      const cohortMonth = user.createdAt.toISOString().slice(0, 7); // "2025-01"
      const cohort = cohortMap.get(cohortMonth) || {
        cohortMonth,
        users: 0,
        activeWeek1: 0,
        activeWeek2: 0,
        activeWeek4: 0,
        convertedWeek1: 0,
        convertedWeek4: 0,
        retained: 0,
      };

      cohort.users += 1;

      const registrationDate = new Date(user.createdAt);
      const week1End = new Date(registrationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const week2End = new Date(registrationDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      const week4End = new Date(registrationDate.getTime() + 28 * 24 * 60 * 60 * 1000);

      // Check activity in each period
      const hasAssessmentWeek1 = user.assessments.some(a => new Date(a.createdAt) <= week1End);
      const hasAssessmentWeek2 = user.assessments.some(a => new Date(a.createdAt) <= week2End);
      const hasAssessmentWeek4 = user.assessments.some(a => new Date(a.createdAt) <= week4End);

      if (hasAssessmentWeek1) cohort.activeWeek1 += 1;
      if (hasAssessmentWeek2) cohort.activeWeek2 += 1;
      if (hasAssessmentWeek4) cohort.activeWeek4 += 1;

      // Check conversions (payments)
      const hasPaymentWeek1 = user.payments.some(
        p => p.status === 'completed' && new Date(p.createdAt) <= week1End
      );
      const hasPaymentWeek4 = user.payments.some(
        p => p.status === 'completed' && new Date(p.createdAt) <= week4End
      );

      if (hasPaymentWeek1) cohort.convertedWeek1 += 1;
      if (hasPaymentWeek4) cohort.convertedWeek4 += 1;

      // Retained = had activity after week 1
      const hasActivityAfterWeek1 = user.assessments.some(
        a => new Date(a.createdAt) > week1End
      );
      if (hasActivityAfterWeek1) cohort.retained += 1;

      cohortMap.set(cohortMonth, cohort);
    }

    const cohorts = Array.from(cohortMap.values())
      .map((c) => ({
        cohortMonth: c.cohortMonth,
        users: c.users,
        activeWeek1: c.activeWeek1,
        activeWeek2: c.activeWeek2,
        activeWeek4: c.activeWeek4,
        convertedWeek1: c.convertedWeek1,
        convertedWeek4: c.convertedWeek4,
        retained: c.retained,
        retentionRateWeek1: c.users > 0 ? Math.round((c.activeWeek1 / c.users) * 100) : 0,
        retentionRateWeek2: c.users > 0 ? Math.round((c.activeWeek2 / c.users) * 100) : 0,
        retentionRateWeek4: c.users > 0 ? Math.round((c.activeWeek4 / c.users) * 100) : 0,
        conversionRateWeek1: c.users > 0 ? Math.round((c.convertedWeek1 / c.users) * 10000) / 100 : 0,
        conversionRateWeek4: c.users > 0 ? Math.round((c.convertedWeek4 / c.users) * 10000) / 100 : 0,
        overallRetention: c.users > 0 ? Math.round((c.retained / c.users) * 100) : 0,
      }))
      .sort((a, b) => a.cohortMonth.localeCompare(b.cohortMonth));

    return NextResponse.json({
      cohorts,
      summary: {
        totalCohorts: cohorts.length,
        avgRetentionWeek1: cohorts.length > 0
          ? Math.round(cohorts.reduce((s, c) => s + c.retentionRateWeek1, 0) / cohorts.length)
          : 0,
        avgRetentionWeek4: cohorts.length > 0
          ? Math.round(cohorts.reduce((s, c) => s + c.retentionRateWeek4, 0) / cohorts.length)
          : 0,
        avgConversionWeek4: cohorts.length > 0
          ? Math.round(cohorts.reduce((s, c) => s + c.conversionRateWeek4, 0) / cohorts.length * 100) / 100
          : 0,
      },
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Analytics Cohorts API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
