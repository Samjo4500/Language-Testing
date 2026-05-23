# Task ID: 4 - Admin API Routes Developer

## Summary
Created 4 new admin API routes for the enhanced admin panel with consistent auth patterns and error handling.

## Files Created
1. `src/app/api/admin/users/create/route.ts` — POST: Create user manually (validation, bcrypt hashing, email uniqueness check)
2. `src/app/api/admin/users/[id]/route.ts` — GET/PATCH/DELETE: Detailed user management with related records, computed stats, self-demotion prevention
3. `src/app/api/admin/users/[id]/activity/route.ts` — GET: User activity timeline combining 5 data sources (assessments, payments, certificates, emails, page views)
4. `src/app/api/admin/audit-log/route.ts` — GET: Admin audit trail derived from EmailLog entries, admin users, and password resets

## Key Design Decisions
- Auth pattern: `getAuthUser(request)` → `requireAdmin(user)` → `adminLimiter(request)` on every route
- `tokenVersion` incremented on role/plan changes to invalidate old JWTs
- DELETE on user returns 405 (no soft-delete field in schema, prevents accidental data loss)
- Audit log derived from existing data (no Prisma schema changes needed)
- Password hashing uses existing `hashPassword` from `@/lib/auth`
- Test credits default: 0 for free plan, 999 for premium/pro

## Verification
- `npx next build` compiles successfully
- ESLint passes with zero errors on all new files
