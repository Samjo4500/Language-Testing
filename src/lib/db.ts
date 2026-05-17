import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Fix: Shell env may have a stale SQLite DATABASE_URL that overrides .env.local.
// If the runtime DATABASE_URL is not a PostgreSQL URL, fall back to POSTGRES_PRISMA_URL.
const effectiveUrl = process.env.DATABASE_URL?.startsWith('postgresql://')
  ? process.env.DATABASE_URL
  : process.env.POSTGRES_PRISMA_URL;

// Clear stale cached PrismaClient that may have been created with wrong URL
if (globalForPrisma.prisma) {
  globalForPrisma.prisma = undefined;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    ...(effectiveUrl ? { datasourceUrl: effectiveUrl } : {}),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db