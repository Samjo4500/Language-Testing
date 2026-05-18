import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// On Vercel/production, DATABASE_URL should be set correctly.
// Locally, the shell may have a stale SQLite DATABASE_URL that overrides .env.
// If the runtime DATABASE_URL is not a PostgreSQL URL, fall back to DATABASE_URL_UNPOOLED.
const effectiveUrl = process.env.DATABASE_URL?.startsWith('postgresql://')
  ? process.env.DATABASE_URL
  : process.env.DATABASE_URL_UNPOOLED;

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    ...(effectiveUrl ? { datasourceUrl: effectiveUrl } : {}),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db