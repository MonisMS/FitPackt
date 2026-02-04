'use server';

import { db } from '@/lib/db';
import { rooms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function deleteRoom(roomId: string) {
  try {
    // Mark room as deleted (don't actually delete to preserve logs)
    await db
      .update(rooms)
      .set({
        status: 'deleted',
      })
      .where(eq(rooms.id, roomId));

    return { success: true };
  } catch (error) {
    console.error('Error deleting room:', error);
    throw new Error('Failed to delete room');
  }
}
