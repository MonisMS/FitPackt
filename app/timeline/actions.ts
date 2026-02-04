'use server';

import { db } from '@/lib/db';
import { dailyLogs, roomMemberships } from '@/lib/db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

export async function getUserTimeline(
  userId: string,
  roomId?: string,
  from?: string,
  to?: string
) {
  // Build query conditions
  const conditions = [eq(dailyLogs.userId, userId)];

  if (roomId) {
    conditions.push(eq(dailyLogs.roomId, roomId));
  }

  if (from) {
    const fromDate = new Date(from);
    conditions.push(gte(dailyLogs.logDate, fromDate));
  }

  if (to) {
    const toDate = new Date(to);
    conditions.push(lte(dailyLogs.logDate, toDate));
  }

  // Get logs
  const logs = await db.query.dailyLogs.findMany({
    where: and(...conditions),
    with: {
      room: true,
    },
    orderBy: [desc(dailyLogs.logDate)],
  });

  // Get all rooms user is/was in
  const memberships = await db.query.roomMemberships.findMany({
    where: eq(roomMemberships.userId, userId),
    with: {
      room: true,
    },
  });

  const rooms = memberships.map((m) => m.room);

  // Calculate stats
  const totalLogs = logs.length;
  const workoutDays = logs.filter((l) => l.workoutDone).length;

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if logged today
  const loggedToday = logs.some((l) => {
    const logDate = new Date(l.logDate);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime();
  });

  // Start counting from yesterday (or today if logged today)
  const checkDate = new Date(today);
  if (!loggedToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const hasLog = logs.some((l) => {
      const logDate = new Date(l.logDate);
      return logDate.toISOString().split('T')[0] === dateStr;
    });

    if (hasLog) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }

    // Safety limit
    if (currentStreak > 365) break;
  }

  return {
    logs,
    rooms,
    stats: {
      totalLogs,
      currentStreak,
      workoutDays,
    },
  };
}
