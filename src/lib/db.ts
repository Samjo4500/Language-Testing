import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Resolve the correct PostgreSQL connection URL.
 *
 * Priority:
 * 1. DATABASE_URL if it starts with "postgresql://" (correctly configured)
 * 2. DATABASE_URL_UNPOOLED if DATABASE_URL is missing or non-PostgreSQL (e.g., stale SQLite URL from shell env)
 * 3. Throw a clear error if neither is a valid PostgreSQL URL
 *
 * This prevents the "URL must start with the protocol postgresql://" crash that
 * happens when the shell environment overrides .env with a stale SQLite URL.
 */
function resolveDatabaseUrl(): string | undefined {
  const dbUrl = process.env.DATABASE_URL
  const unpooleddUrl = process.env.DATABASE_URL_UNPOOLED

  // If DATABASE_URL is a valid PostgreSQL URL, use it
  if (dbUrl?.startsWith('postgresql://') || dbUrl?.startsWith('postgres://')) {
    return dbUrl
  }

  // DATABASE_URL is missing or not PostgreSQL — fall back to DATABASE_URL_UNPOOLED
  if (unpooleddUrl?.startsWith('postgresql://') || unpooleddUrl?.startsWith('postgres://')) {
    if (dbUrl && !dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      console.warn(
        `[db] WARNING: DATABASE_URL is not a PostgreSQL URL (${dbUrl.substring(0, 30)}...), ` +
        `falling back to DATABASE_URL_UNPOOLED. Fix your .env file!`
      )
    }
    return unpooleddUrl
  }

  // Neither URL is valid — this will cause Prisma to throw, but log a clear message first
  console.error(
    `[db] FATAL: No valid PostgreSQL URL found! ` +
    `DATABASE_URL=${dbUrl ? `"${dbUrl.substring(0, 30)}..."` : '(unset)'}, ` +
    `DATABASE_URL_UNPOOLED=${unpooleddUrl ? `"${unpooleddUrl.substring(0, 30)}..."` : '(unset)'}. ` +
    `Both must start with "postgresql://". Check your .env file.`
  )
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
