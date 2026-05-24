import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * One-time endpoint to sync database schema.
 * Adds missing columns and tables that are defined in the Prisma schema
 * but don't exist in the database yet.
 */
export async function POST() {
  const results: { step: string; status: string; error?: string }[] = [];

  // Step 1: Add isSuspended column to User table
  try {
    await db.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isSuspended" BOOLEAN NOT NULL DEFAULT false`;
    results.push({ step: 'Add User.isSuspended', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'Add User.isSuspended', status: 'error', error: e.message });
  }

  // Step 2: Create Course table
  try {
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Course" (
        "id" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "subtitle" TEXT NOT NULL,
        "level" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "compareAtPrice" DOUBLE PRECISION,
        "description" TEXT NOT NULL,
        "features" TEXT NOT NULL,
        "modulesCount" INTEGER NOT NULL,
        "lessonsCount" INTEGER NOT NULL,
        "estimatedHours" INTEGER NOT NULL,
        "imageUrl" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isPublished" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL,
        CONSTRAINT "Course_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Course_slug_key" UNIQUE ("slug")
      )
    `;
    results.push({ step: 'Create Course table', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'Create Course table', status: 'error', error: e.message });
  }

  // Create Course indexes
  try {
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "Course_slug_idx" ON "Course"("slug")`;
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "Course_order_idx" ON "Course"("order")`;
    results.push({ step: 'Course indexes', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'Course indexes', status: 'error', error: e.message });
  }

  // Step 3: Create CourseModule table
  try {
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CourseModule" (
        "id" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "moduleNumber" INTEGER NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "icon" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isPublished" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "CourseModule_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "CourseModule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "CourseModule_courseId_moduleNumber_key" UNIQUE ("courseId", "moduleNumber")
      )
    `;
    results.push({ step: 'Create CourseModule table', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'Create CourseModule table', status: 'error', error: e.message });
  }

  try {
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "CourseModule_courseId_idx" ON "CourseModule"("courseId")`;
    results.push({ step: 'CourseModule indexes', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'CourseModule indexes', status: 'error', error: e.message });
  }

  // Step 4: Create CourseLesson table
  try {
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CourseLesson" (
        "id" TEXT NOT NULL,
        "moduleId" TEXT NOT NULL,
        "lessonNumber" INTEGER NOT NULL,
        "title" TEXT NOT NULL,
        "contentType" TEXT NOT NULL DEFAULT 'reading',
        "content" TEXT NOT NULL,
        "vocabulary" TEXT,
        "quizData" TEXT,
        "audioScript" TEXT,
        "estimatedMinutes" INTEGER NOT NULL DEFAULT 15,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isPublished" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "CourseLesson_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "CourseLesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CourseModule"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "CourseLesson_moduleId_lessonNumber_key" UNIQUE ("moduleId", "lessonNumber")
      )
    `;
    results.push({ step: 'Create CourseLesson table', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'Create CourseLesson table', status: 'error', error: e.message });
  }

  try {
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "CourseLesson_moduleId_idx" ON "CourseLesson"("moduleId")`;
    results.push({ step: 'CourseLesson indexes', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'CourseLesson indexes', status: 'error', error: e.message });
  }

  // Step 5: Create CourseEnrollment table
  try {
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CourseEnrollment" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'active',
        "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "currentModuleId" TEXT,
        "currentLessonId" TEXT,
        "paymentId" TEXT,
        "enrolledAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "completedAt" TIMESTAMP,
        "lastAccessedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "certificateId" TEXT,
        CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "CourseEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "CourseEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "CourseEnrollment_userId_courseId_key" UNIQUE ("userId", "courseId")
      )
    `;
    results.push({ step: 'Create CourseEnrollment table', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'Create CourseEnrollment table', status: 'error', error: e.message });
  }

  try {
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "CourseEnrollment_userId_idx" ON "CourseEnrollment"("userId")`;
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "CourseEnrollment_courseId_idx" ON "CourseEnrollment"("courseId")`;
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "CourseEnrollment_status_idx" ON "CourseEnrollment"("status")`;
    results.push({ step: 'CourseEnrollment indexes', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'CourseEnrollment indexes', status: 'error', error: e.message });
  }

  // Step 6: Create LessonProgress table
  try {
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "LessonProgress" (
        "id" TEXT NOT NULL,
        "enrollmentId" TEXT NOT NULL,
        "lessonId" TEXT NOT NULL,
        "completed" BOOLEAN NOT NULL DEFAULT false,
        "quizScore" DOUBLE PRECISION,
        "quizPassed" BOOLEAN NOT NULL DEFAULT false,
        "timeSpentSeconds" INTEGER NOT NULL DEFAULT 0,
        "completedAt" TIMESTAMP,
        CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "LessonProgress_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "CourseEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "CourseLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "LessonProgress_enrollmentId_lessonId_key" UNIQUE ("enrollmentId", "lessonId")
      )
    `;
    results.push({ step: 'Create LessonProgress table', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'Create LessonProgress table', status: 'error', error: e.message });
  }

  try {
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "LessonProgress_enrollmentId_idx" ON "LessonProgress"("enrollmentId")`;
    results.push({ step: 'LessonProgress indexes', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'LessonProgress indexes', status: 'error', error: e.message });
  }

  // Step 7: Add index for User.isSuspended
  try {
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "User_isSuspended_idx" ON "User"("isSuspended")`;
    results.push({ step: 'User.isSuspended index', status: 'ok' });
  } catch (e: any) {
    results.push({ step: 'User.isSuspended index', status: 'error', error: e.message });
  }

  // Step 8: Verify the fix by trying a User query
  try {
    const user = await db.user.findUnique({ where: { email: 'admin@testcefr.com' } });
    results.push({ step: 'Verify User query', status: user ? 'ok' : 'user_not_found' });
  } catch (e: any) {
    results.push({ step: 'Verify User query', status: 'error', error: e.message });
  }

  return NextResponse.json({ results });
}
