import { db } from '@/lib/db';

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  actionUrl?: string
) {
  return db.notification.create({
    data: { userId, type, title, message, actionUrl },
  });
}
