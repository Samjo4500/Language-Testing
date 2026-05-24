/**
 * Database error classification and health check utilities.
 *
 * Provides structured error handling for database operations so that
 * API routes can return meaningful error messages instead of generic 500s.
 */

import { db } from './db';

export type DBErrorType =
  | 'CONNECTION_REFUSED'
  | 'AUTH_FAILED'
  | 'DATABASE_NOT_FOUND'
  | 'CONNECTION_TIMEOUT'
  | 'SSL_ERROR'
  | 'UNKNOWN';

export class DatabaseError extends Error {
  public readonly type: DBErrorType;
  public readonly originalError: unknown;

  constructor(type: DBErrorType, message: string, originalError: unknown) {
    super(message);
    this.name = 'DatabaseError';
    this.type = type;
    this.originalError = originalError;
  }
}

/**
 * Classify a Prisma/database error into a structured type.
 */
export function classifyDBError(error: unknown): DatabaseError {
  const message = error instanceof Error ? error.message : String(error);
  const prismaCode = (error as any)?.code;
  const prismaMessage = (error as any)?.meta?.message || '';

  // Prisma error codes
  // P1001: Can't reach database server
  // P1002: Connection timeout
  // P1003: Database does not exist
  // P1005: Auth failed
  // P1006: SSL error
  switch (prismaCode) {
    case 'P1001':
      return new DatabaseError('CONNECTION_REFUSED', 'Database server is unreachable.', error);
    case 'P1002':
      return new DatabaseError('CONNECTION_TIMEOUT', 'Database connection timed out.', error);
    case 'P1003':
      return new DatabaseError('DATABASE_NOT_FOUND', 'Database not found.', error);
    case 'P1005':
    case 'P1008':
      return new DatabaseError('AUTH_FAILED', 'Database authentication failed. Check DATABASE_URL credentials.', error);
    case 'P1006':
      return new DatabaseError('SSL_ERROR', 'Database SSL connection failed.', error);
  }

  // Fallback: message-based classification
  const lower = (message + ' ' + prismaMessage).toLowerCase();
  if (lower.includes('password authentication failed') || lower.includes('auth failed')) {
    return new DatabaseError('AUTH_FAILED', 'Database authentication failed. Check DATABASE_URL credentials.', error);
  }
  if (lower.includes("can't reach database") || lower.includes('connection refused') || lower.includes('econnrefused')) {
    return new DatabaseError('CONNECTION_REFUSED', 'Database server is unreachable.', error);
  }
  if (lower.includes('timeout') || lower.includes('timed out')) {
    return new DatabaseError('CONNECTION_TIMEOUT', 'Database connection timed out.', error);
  }
  if (lower.includes('ssl') || lower.includes('tls')) {
    return new DatabaseError('SSL_ERROR', 'Database SSL connection failed.', error);
  }
  if (lower.includes('not found') || lower.includes('does not exist')) {
    return new DatabaseError('DATABASE_NOT_FOUND', 'Database not found.', error);
  }

  return new DatabaseError('UNKNOWN', 'An unexpected database error occurred.', error);
}

/**
 * Check database connectivity by running a simple query.
 * Returns health status information.
 */
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  latencyMs: number;
  error?: string;
  errorType?: DBErrorType;
  url?: string;
}> {
  const url = process.env.DATABASE_URL?.startsWith('postgresql://')
    ? process.env.DATABASE_URL.replace(/:([^@]+)@/, ':****@')
    : process.env.DATABASE_URL_UNPOOLED?.replace(/:([^@]+)@/, ':****@')
    || '(not set)';

  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return {
      healthy: true,
      latencyMs: Date.now() - start,
      url,
    };
  } catch (error) {
    const classified = classifyDBError(error);
    return {
      healthy: false,
      latencyMs: Date.now() - start,
      error: classified.message,
      errorType: classified.type,
      url,
    };
  }
}
