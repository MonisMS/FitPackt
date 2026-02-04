'use server';

import { db } from '@/lib/db';
import { rooms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Check if a room has ended and update its status if needed
 * Returns the updated room status
 */
export async function checkAndUpdateRoomStatus(roomId: string) {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
  });

  if (!room) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(room.endDate);
  endDate.setHours(0, 0, 0, 0);

  // If room is active but end date has passed, mark as ended
  if (room.status === 'active' && endDate < today) {
    await db
      .update(rooms)
      .set({ status: 'ended' })
      .where(eq(rooms.id, roomId));

    return 'ended';
  }

  return room.status;
}

/**
 * Get room status with auto-update
 */
export async function getRoomWithStatus(roomId: string) {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
  });

  if (!room) {
    return null;
  }

  // Check and update status if needed
  const currentStatus = await checkAndUpdateRoomStatus(roomId);

  return {
    ...room,
    status: currentStatus || room.status,
  };
}
