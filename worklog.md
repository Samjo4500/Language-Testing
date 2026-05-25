---
Task ID: 1
Agent: Main
Task: Fix database, seed courses, bypass PayPal for course access

Work Log:
- Found Prisma schema was set to PostgreSQL but actual database was SQLite (custom.db)
- Changed prisma/schema.prisma provider from "postgresql" to "sqlite", removed directUrl
- Ran prisma validate, generate, db push - all successful
- Fixed TypeScript error: removed skipDuplicates from createMany (not supported in SQLite)
- Ran production build (next build) - compiled successfully
- Ran seed-courses.ts: created 3 courses (Beginner, Intermediate, Advanced) with 28 modules and 146 lessons
- Ran seed-demo-users.ts: created 10 demo users with various plans
- Enrolled all 10 demo users in all 3 courses with status "active" and paymentId "sandbox-bypass"
- Started production server via PM2 (next start -p 3000)
- Verified API endpoints return correct course data
- Verified course detail pages render correctly via Caddy proxy (port 81)

Stage Summary:
- Database is now populated with courses, modules, lessons, and demo users
- All demo users have active enrollments in all courses - no PayPal needed to view content
- Server running stably on PM2 (production build)
- Demo login credentials: demo01@testcefr.com through demo10@testcefr.com, password: Demo@2026!

---
Task ID: 2
Agent: Main
Task: Fix login/enrollment flow so user can see course content without PayPal

Work Log:
- Discovered login API was returning 500 Internal Server Error
- Found root cause: src/lib/db.ts had a resolveDatabaseUrl() function that ONLY accepted PostgreSQL URLs and rejected SQLite file: URLs
- The database is SQLite (custom.db) but db.ts was rejecting the file: protocol, returning undefined, causing Prisma to fail
- Also found JWT_SECRET was not set in .env, causing auth to crash
- Fixed db.ts: Updated resolveDatabaseUrl() to accept file: (SQLite) URLs in addition to postgresql:// URLs
- Added JWT_SECRET and PAYPAL_MODE=sandbox to .env
- Rebuilt the app and restarted PM2
- Tested login API: now returns 200 with valid JWT tokens
- Tested /api/courses/my-courses/: returns enrollments with active status for all 3 courses
- Tested /api/courses/lesson/[id]: returns full lesson content with HTML, vocabulary, quiz data
- All APIs working correctly via Caddy proxy on port 81

Stage Summary:
- Login now works (demo05@testcefr.com / Demo@2026!)
- Enrollment check works: API returns active enrollments for all 3 courses
- Course detail page should now show "Continue Learning" instead of PayPal button for logged-in enrolled users
- Lesson content API returns full lesson data including HTML content, vocabulary, quizzes, audio scripts
