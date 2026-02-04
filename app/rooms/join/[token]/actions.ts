'use server';

import { db } from '@/lib/db';
import { roomMemberships } from '@/lib/db/schema';

export async function joinRoom(roomId: string, userId: string) {
  try {
    await db.insert(roomMemberships).values({
      roomId,
      userId,
      role: 'member',
    });

    return { success: true };
  } catch (error) {
    console.error('Error joining room:', error);
    throw new Error('Failed to join room');
  }
}
