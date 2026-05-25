import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Resolve the database connection URL.
 *
 * Supports both SQLite (file:) and PostgreSQL (postgresql:// / postgres://) URLs.
 * Priority:
 * 1. DATABASE_URL if it's a valid database URL
 * 2. DATABASE_URL_UNPOOLED as fallback (PostgreSQL only)
 * 3. Fall back to Prisma schema default if neither is set
 */
function resolveDatabaseUrl(): string | undefined {
  const dbUrl = process.env.DATABASE_URL
  const unpooleddUrl = process.env.DATABASE_URL_UNPOOLED

  // If DATABASE_URL is a valid database URL (SQLite or PostgreSQL), use it
  if (dbUrl?.startsWith('file:') || dbUrl?.startsWith('postgresql://') || dbUrl?.startsWith('postgres://')) {
    return dbUrl
  }

  // DATABASE_URL is missing or not a recognized protocol — fall back to DATABASE_URL_UNPOOLED
  if (unpooleddUrl?.startsWith('postgresql://') || unpooleddUrl?.startsWith('postgres://')) {
    if (dbUrl && !dbUrl.startsWith('file:') && !dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      console.warn(
        `[db] WARNING: DATABASE_URL is not a recognized database URL (${dbUrl.substring(0, 30)}...), ` +
        `falling back to DATABASE_URL_UNPOOLED. Fix your .env file!`
      )
    }
    return unpooleddUrl
  }

  // Neither URL is valid — let Prisma use its schema default
  if (!dbUrl) {
    console.warn('[db] No DATABASE_URL set — using Prisma schema default.')
  } else {
    console.warn(
      `[db] WARNING: DATABASE_URL="${dbUrl.substring(0, 30)}..." is not a recognized protocol. ` +
      `Expected "file:", "postgresql://", or "postgres://". Using Prisma schema default.`
    )
  }
  return undefined
}

const effectiveUrl = resolveDatabaseUrl()

// Clear any stale cached PrismaClient that may have been created with a wrong URL
if (globalForPrisma.prisma && effectiveUrl) {
  // If the cached instance was created with a different URL, discard it
  const currentDatasource = (globalForPrisma.prisma as unknown as { _runtime?: { datasources?: { db?: { url?: string } } } })
  const cachedUrl = currentDatasource?._runtime?.datasources?.db?.url
  if (cachedUrl && cachedUrl !== effectiveUrl) {
    console.warn('[db] Clearing stale PrismaClient cache (URL mismatch)')
    globalForPrisma.prisma = undefined
  }
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    ...(effectiveUrl ? { datasourceUrl: effectiveUrl } : {}),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
