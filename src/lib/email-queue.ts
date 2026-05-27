/**
 * Email Queue — Scheduled email delivery for automation sequences.
 *
 * Instead of setTimeout (dies in serverless) or third-party schedulers,
 * we use a DB-backed queue: rows with a `sendAt` timestamp are picked up
 * by a Vercel cron endpoint running every 5 minutes.
 *
 * Flows:
 *   • Nurture Day 0  — 1 hour after test completion (if user is still on free plan)
 *   • Nurture Days 1-6 — Daily emails with tips, resources, and upgrade nudges
 *   • Cart recovery — 1 hour after creating a PayPal order without completing it
 *   • Ticket reply  — Immediate email when admin responds to a support ticket
 */

import { db } from './db';
import {
  sendNurtureDay0,
  sendNurtureDay1,
  sendNurtureDay2,
  sendNurtureDay3,
  sendNurtureDay4,
  sendNurtureDay5,
  sendNurtureDay6,
  sendCartRecovery,
  sendTicketReply,
} from './email';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NurturePayload {
  name: string;
  email: string;
  cefrLevel: string;
  score: number;
  weakestSkill: string;
  weakestScore: number;
}

export interface CartRecoveryPayload {
  name: string;
  email: string;
  planType: string;
  planName: string;
  price: string;
}

export interface TicketReplyPayload {
  name: string;
  email: string;
  ticketSubject: string;
  adminResponse: string;
  ticketId: string;
}

type AnyPayload = NurturePayload | CartRecoveryPayload | TicketReplyPayload;

// ─── Enqueue ──────────────────────────────────────────────────────────────────

/**
 * Insert a scheduled email into the queue.
 * The cron processor will pick it up when `sendAt` is reached.
 */
export async function enqueueEmail(
  userId: string,
  to: string,
  emailType: string,
  sendAt: Date,
  payload: AnyPayload
): Promise<string> {
  const row = await db.emailQueue.create({
    data: {
      userId,
      to,
      emailType,
      sendAt,
      payload: JSON.stringify(payload),
      status: 'pending',
    },
  });
  return row.id;
}

/**
 * Enqueue the full nurture sequence (Day 0 through Day 6).
 * Day 0 sends 1 hour after test completion.
 * Days 1-6 send on consecutive days.
 */
export async function enqueueNurtureSequence(
  userId: string,
  payload: NurturePayload
): Promise<void> {
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;

  const schedule = [
    { type: 'nurture_day0', offset: HOUR },         // +1 hour
    { type: 'nurture_day1', offset: 1 * DAY + HOUR }, // ~25 hours
    { type: 'nurture_day2', offset: 2 * DAY + HOUR }, // ~49 hours
    { type: 'nurture_day3', offset: 3 * DAY + HOUR }, // ~73 hours
    { type: 'nurture_day4', offset: 4 * DAY + HOUR }, // ~97 hours
    { type: 'nurture_day5', offset: 5 * DAY + HOUR }, // ~121 hours
    { type: 'nurture_day6', offset: 6 * DAY + HOUR }, // ~145 hours
  ];

  // Only enqueue if user doesn't already have a pending nurture sequence
  const existing = await db.emailQueue.findFirst({
    where: {
      userId,
      emailType: { startsWith: 'nurture_' },
      status: 'pending',
    },
  });

  if (existing) {
    console.log(`[email-queue] Nurture sequence already queued for user ${userId}, skipping.`);
    return;
  }

  for (const item of schedule) {
    await enqueueEmail(userId, payload.email, item.type, new Date(now + item.offset), payload);
  }

  console.log(`[email-queue] Enqueued 7 nurture emails for user ${userId} (${payload.cefrLevel}, ${payload.score}/100).`);
}

/**
 * Enqueue a cart recovery email (1 hour after order creation).
 * If the payment is captured within that hour, the cron processor
 * will cancel the email via cancelCartRecovery().
 */
export async function enqueueCartRecovery(
  userId: string,
  paypalOrderId: string,
  payload: CartRecoveryPayload
): Promise<void> {
  // Cancel any existing pending cart recovery for this user
  await cancelCartRecovery(userId);

  const sendAt = new Date(Date.now() + 60 * 60 * 1000); // +1 hour
  await enqueueEmail(userId, payload.email, 'cart_recovery', sendAt, {
    ...payload,
    paypalOrderId,
  } as CartRecoveryPayload & { paypalOrderId: string });

  console.log(`[email-queue] Cart recovery queued for user ${userId}, order ${paypalOrderId}.`);
}

/**
 * Cancel any pending cart recovery emails for a user.
 * Called when a payment is successfully captured.
 */
export async function cancelCartRecovery(userId: string): Promise<number> {
  const result = await db.emailQueue.updateMany({
    where: {
      userId,
      emailType: 'cart_recovery',
      status: 'pending',
    },
    data: { status: 'cancelled' },
  });
  if (result.count > 0) {
    console.log(`[email-queue] Cancelled ${result.count} cart recovery email(s) for user ${userId}.`);
  }
  return result.count;
}

/**
 * Cancel all pending nurture emails for a user.
 * Called when a user upgrades (no need to nurture a paying customer).
 */
export async function cancelNurtureSequence(userId: string): Promise<number> {
  const result = await db.emailQueue.updateMany({
    where: {
      userId,
      emailType: { startsWith: 'nurture_' },
      status: 'pending',
    },
    data: { status: 'cancelled' },
  });
  if (result.count > 0) {
    console.log(`[email-queue] Cancelled ${result.count} nurture email(s) for user ${userId} (upgraded).`);
  }
  return result.count;
}

/**
 * Send a ticket reply email immediately (no queue delay).
 * Uses the queue table for logging/audit purposes.
 */
export async function sendTicketReplyImmediate(
  userId: string,
  payload: TicketReplyPayload
): Promise<void> {
  try {
    await sendTicketReply(
      payload.name,
      payload.email,
      payload.ticketSubject,
      payload.adminResponse,
      payload.ticketId,
      userId
    );
    // Log in queue as sent
    await db.emailQueue.create({
      data: {
        userId,
        to: payload.email,
        emailType: 'ticket_reply',
        status: 'sent',
        sendAt: new Date(),
        sentAt: new Date(),
        payload: JSON.stringify(payload),
      },
    });
  } catch (err) {
    console.error('[email-queue] Failed to send ticket reply email:', err);
    await db.emailQueue.create({
      data: {
        userId,
        to: payload.email,
        emailType: 'ticket_reply',
        status: 'failed',
        sendAt: new Date(),
        payload: JSON.stringify(payload),
        error: err instanceof Error ? err.message : String(err),
      },
    });
  }
}

// ─── Process Queue ────────────────────────────────────────────────────────────

/**
 * Process all due emails in the queue.
 * Called by the cron endpoint every 5 minutes.
 *
 * For nurture emails, checks if the user has upgraded since the email
 * was queued — if so, cancels the remaining sequence.
 */
export async function processEmailQueue(): Promise<{
  processed: number;
  sent: number;
  cancelled: number;
  failed: number;
}> {
  const now = new Date();
  let processed = 0;
  let sent = 0;
  let cancelled = 0;
  let failed = 0;

  // Fetch pending emails that are due
  const dueEmails = await db.emailQueue.findMany({
    where: {
      status: 'pending',
      sendAt: { lte: now },
    },
    orderBy: { sendAt: 'asc' },
    take: 100, // Process max 100 per run to avoid timeouts
  });

  for (const email of dueEmails) {
    processed++;

    // For nurture emails: check if user upgraded since queue was created
    if (email.emailType.startsWith('nurture_')) {
      const user = await db.user.findUnique({
        where: { id: email.userId },
        select: { plan: true },
      });

      if (user && user.plan !== 'free') {
        // User upgraded — cancel this and all remaining nurture emails
        await db.emailQueue.updateMany({
          where: {
            userId: email.userId,
            emailType: { startsWith: 'nurture_' },
            status: 'pending',
          },
          data: { status: 'cancelled' },
        });
        cancelled++;
        console.log(`[email-queue] Cancelled nurture for user ${email.userId} (upgraded to ${user.plan}).`);
        continue;
      }
    }

    // For cart recovery: check if payment was completed
    if (email.emailType === 'cart_recovery') {
      const user = await db.user.findUnique({
        where: { id: email.userId },
        select: { plan: true },
      });

      if (user && user.plan !== 'free') {
        await db.emailQueue.update({
          where: { id: email.id },
          data: { status: 'cancelled', updatedAt: new Date() },
        });
        cancelled++;
        continue;
      }
    }

    // Parse payload and send
    try {
      const payload = email.payload ? JSON.parse(email.payload) : {};
      await dispatchEmail(email.emailType, email.to, payload, email.userId);

      await db.emailQueue.update({
        where: { id: email.id },
        data: { status: 'sent', sentAt: new Date(), updatedAt: new Date() },
      });
      sent++;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[email-queue] Failed to send ${email.emailType} to ${email.to}:`, errorMsg);

      await db.emailQueue.update({
        where: { id: email.id },
        data: { status: 'failed', error: errorMsg, updatedAt: new Date() },
      });
      failed++;
    }
  }

  console.log(`[email-queue] Processed: ${processed}, Sent: ${sent}, Cancelled: ${cancelled}, Failed: ${failed}`);
  return { processed, sent, cancelled, failed };
}

/**
 * Dispatch the correct email template based on type.
 */
async function dispatchEmail(
  type: string,
  to: string,
  payload: Record<string, unknown>,
  userId: string
): Promise<void> {
  const p = payload as unknown as AnyPayload & { paypalOrderId?: string };

  switch (type) {
    case 'nurture_day0':
      await sendNurtureDay0(
        (p as NurturePayload).name,
        to,
        (p as NurturePayload).cefrLevel,
        (p as NurturePayload).score,
        (p as NurturePayload).weakestSkill,
        (p as NurturePayload).weakestScore,
        userId
      );
      break;
    case 'nurture_day1':
      await sendNurtureDay1((p as NurturePayload).name, to, (p as NurturePayload).cefrLevel, userId);
      break;
    case 'nurture_day2':
      await sendNurtureDay2((p as NurturePayload).name, to, userId);
      break;
    case 'nurture_day3':
      await sendNurtureDay3((p as NurturePayload).name, to, (p as NurturePayload).cefrLevel, userId);
      break;
    case 'nurture_day4':
      await sendNurtureDay4((p as NurturePayload).name, to, userId);
      break;
    case 'nurture_day5':
      await sendNurtureDay5((p as NurturePayload).name, to, userId);
      break;
    case 'nurture_day6':
      await sendNurtureDay6((p as NurturePayload).name, to, (p as NurturePayload).cefrLevel, userId);
      break;
    case 'cart_recovery':
      await sendCartRecovery(
        (p as CartRecoveryPayload).name,
        to,
        (p as CartRecoveryPayload).planType,
        (p as CartRecoveryPayload).planName,
        (p as CartRecoveryPayload).price,
        userId
      );
      break;
    case 'ticket_reply':
      await sendTicketReply(
        (p as TicketReplyPayload).name,
        to,
        (p as TicketReplyPayload).ticketSubject,
        (p as TicketReplyPayload).adminResponse,
        (p as TicketReplyPayload).ticketId,
        userId
      );
      break;
    default:
      console.warn(`[email-queue] Unknown email type: ${type}`);
  }
}
