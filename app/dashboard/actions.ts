'use server';

import { db } from '@/lib/db';
import { rooms, roomMemberships, dailyLogs } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { checkAndUpdateRoomStatus } from '@/lib/room-utils';

export async function getUserRooms(userId: string) {
  // Get all rooms where user is a member
  const memberships = await db.query.roomMemberships.findMany({
    where: eq(roomMemberships.userId, userId),
    with: {
      room: true,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Update room statuses if needed and separate active/ended
  const activeRooms = [];
  const endedRooms = [];

  for (const membership of memberships) {
    const room = membership.room;

    // Check and update room status
    const currentStatus = await checkAndUpdateRoomStatus(room.id);

    const endDate = new Date(room.endDate);
    endDate.setHours(0, 0, 0, 0);

    // Use updated status
    const roomWithStatus = { ...room, status: currentStatus || room.status };

    if (roomWithStatus.status === 'active' && endDate >= today) {
      activeRooms.push(roomWithStatus);
    } else if (roomWithStatus.status !== 'deleted') {
      endedRooms.push(roomWithStatus);
    }
  }

  return { activeRooms, endedRooms };
}

export async function hasLoggedToday(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const log = await db.query.dailyLogs.findFirst({
    where: and(
      eq(dailyLogs.userId, userId),
      gte(dailyLogs.logDate, today)
    ),
  });

  return !!log;
}

export async function getRoomLogStatus(userId: string, roomId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const log = await db.query.dailyLogs.findFirst({
    where: and(
      eq(dailyLogs.userId, userId),
      eq(dailyLogs.roomId, roomId),
      gte(dailyLogs.logDate, today)
    ),
  });

  return !!log;
}
