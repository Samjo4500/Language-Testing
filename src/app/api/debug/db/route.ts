import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Diagnostic endpoint to check database schema drift.
 * This will be removed after the schema is synced.
 */
export async function GET() {
  const results: Record<string, any> = {};

  // 1. Check User table columns
  try {
    const userColumns = await db.$queryRaw`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'User'
      ORDER BY ordinal_position
    `;
    results.userColumns = userColumns;
  } catch (e: any) {
    results.userColumnsError = e.message;
  }

  // 2. Check if Course table exists
  try {
    const courseExists = await db.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'Course'
      ) as exists
    `;
    results.courseTableExists = courseExists;
  } catch (e: any) {
    results.courseExistsError = e.message;
  }

  // 3. Check if CourseModule table exists
  try {
    const moduleExists = await db.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'CourseModule'
      ) as exists
    `;
    results.courseModuleTableExists = moduleExists;
  } catch (e: any) {
    results.courseModuleExistsError = e.message;
  }

  // 4. Check if CourseLesson table exists
  try {
    const lessonExists = await db.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'CourseLesson'
      ) as exists
    `;
    results.courseLessonTableExists = lessonExists;
  } catch (e: any) {
    results.courseLessonExistsError = e.message;
  }

  // 5. Check if CourseEnrollment table exists
  try {
    const enrollmentExists = await db.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'CourseEnrollment'
      ) as exists
    `;
    results.courseEnrollmentTableExists = enrollmentExists;
  } catch (e: any) {
    results.courseEnrollmentExistsError = e.message;
  }

  // 6. Check if LessonProgress table exists
  try {
    const progressExists = await db.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'LessonProgress'
      ) as exists
    `;
    results.lessonProgressTableExists = progressExists;
  } catch (e: any) {
    results.lessonProgressExistsError = e.message;
  }

  // 7. Try a simple User query
  try {
    const user = await db.user.findUnique({ where: { email: 'admin@testcefr.com' } });
    results.userQueryWorks = true;
    results.adminUser = user ? { id: user.id, email: user.email, role: user.role } : null;
  } catch (e: any) {
    results.userQueryWorks = false;
    results.userQueryError = { message: e.message, code: e.code, meta: e.meta };
  }

  return NextResponse.json(results, { status: 200 });
}
