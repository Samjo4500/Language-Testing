# Fix Login 500 Error - Work Record

## Task ID: fix-login-500

## Problem
The login API at `/api/auth/login` returned a 500 error with message "Internal server error. Please try again later."

## Root Cause
The **shell environment variable** `DATABASE_URL` was set to a SQLite URL (`file:/home/z/my-project/db/custom.db`), which **overrides** the PostgreSQL URL defined in `.env.local`. 

In Next.js, shell environment variables take precedence over `.env` and `.env.local` files. The Prisma schema uses `provider = "postgresql"`, but the runtime `DATABASE_URL` pointed to a SQLite database, causing Prisma to throw:

```
Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`.
```

## Fix Applied

### 1. Updated `.env` file
Changed `.env` from SQLite URL to the correct PostgreSQL URL (matching `.env.local`):
```
DATABASE_URL="postgresql://neondb_owner:...@ep-bitter-math-aprusw9v-pooler.c-7.us-east-1.aws.neon.tech/neondb?..."
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:...@ep-bitter-math-aprusw9v.c-7.us-east-1.aws.neon.tech/neondb?..."
```

### 2. Modified `src/lib/db.ts`
- Added **URL detection logic**: If `DATABASE_URL` doesn't start with `postgresql://`, fall back to `POSTGRES_PRISMA_URL` (which is set in `.env.local` and NOT overridden by the shell)
- Added **cache clearing**: Stale cached PrismaClient instances (created with wrong URL) are cleared from `globalForPrisma.prisma`
- Used `datasourceUrl` option in PrismaClient constructor to explicitly set the correct URL

### 3. Regenerated Prisma Client
Ran `npx prisma db push` and `npx prisma generate` with the corrected `.env` file.

## Verification
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@testcefr.com","password":"Admin@2026!"}'
```

Result: **200 OK**
```json
{
  "user": {
    "userId": "cmp2r0hlg0000mamjglz4qlnf",
    "email": "admin@testcefr.com",
    "name": "Super Admin",
    "plan": "premium",
    "role": "admin"
  },
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

## Files Modified
- `/home/z/my-project/.env` - Updated DATABASE_URL from SQLite to PostgreSQL
- `/home/z/my-project/src/lib/db.ts` - Added URL fallback logic and cache clearing

## Files NOT Modified (as requested)
- `/home/z/my-project/src/app/api/auth/login/route.ts` - No bugs in the login route code
