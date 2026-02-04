'use server';

import { db } from '@/lib/db';
import { rooms, roomMemberships } from '@/lib/db/schema';
import crypto from 'crypto';

type CreateRoomInput = {
  name: string;
  durationDays: number;
  deadlineTime: string;
  creatorId: string;
};

function generateInviteToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

export async function createRoom(input: CreateRoomInput) {
  try {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + input.durationDays);

    const inviteToken = generateInviteToken();

    // Create room
    const [room] = await db
      .insert(rooms)
      .values({
        name: input.name,
        durationDays: input.durationDays,
        deadlineTime: input.deadlineTime,
        startDate,
        endDate,
        status: 'active',
        inviteToken,
      })
      .returning();

    // Add creator as member
    await db.insert(roomMemberships).values({
      roomId: room.id,
      userId: input.creatorId,
      role: 'creator',
    });

    return { success: true, roomId: room.id };
  } catch (error) {
    console.error('Error creating room:', error);
    throw new Error('Failed to create room');
  }
}
