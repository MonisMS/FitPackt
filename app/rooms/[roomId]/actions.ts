'use server';

import { db } from '@/lib/db';
import { rooms, roomMemberships, dailyLogs } from '@/lib/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

type FeedItem = {
  type: 'log' | 'missed';
  date: Date;
  userId: string;
  userName: string;
  log?: any;
};

type MemberStats = {
  currentStreak: number;
  totalLogged: number;
  missedDays: number;
};

export async function getRoomFeedData(roomId: string) {
  // Get room
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
  });

  if (!room) {
    throw new Error('Room not found');
  }

  // Get members
  const memberships = await db.query.roomMemberships.findMany({
    where: eq(roomMemberships.roomId, roomId),
    with: {
      user: true,
    },
  });

  // Get all logs for this room
  const logs = await db.query.dailyLogs.findMany({
    where: eq(dailyLogs.roomId, roomId),
    with: {
      user: true,
    },
  });

  // Generate feed items (logs + missed days)
  const feedItems: FeedItem[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(room.startDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(room.endDate);
  endDate.setHours(0, 0, 0, 0);

  const lastDate = today < endDate ? today : endDate;

  // For each member, check each day
  for (const member of memberships) {
    const currentDate = new Date(startDate);

    while (currentDate <= lastDate) {
      const dateStr = currentDate.toISOString().split('T')[0];

      // Check if member has log for this date
      const log = logs.find(
        (l) =>
          l.userId === member.userId &&
          new Date(l.logDate).toISOString().split('T')[0] === dateStr
      );

      if (log) {
        feedItems.push({
          type: 'log',
          date: new Date(currentDate),
          userId: member.userId,
          userName: member.user.name,
          log,
        });
      } else if (currentDate < today) {
        // Only mark as missed if date has passed
        feedItems.push({
          type: 'missed',
          date: new Date(currentDate),
          userId: member.userId,
          userName: member.user.name,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Sort by date descending (newest first)
  feedItems.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Calculate member stats
  const memberStats: Record<string, MemberStats> = {};

  for (const member of memberships) {
    const memberLogs = logs
      .filter((l) => l.userId === member.userId)
      .sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime());

    // Calculate current streak
    let currentStreak = 0;
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday

    while (checkDate >= startDate) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasLog = memberLogs.some(
        (l) => new Date(l.logDate).toISOString().split('T')[0] === dateStr
      );

      if (hasLog) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate total logged and missed
    const totalDaysSoFar = Math.floor(
      (Math.min(today.getTime(), endDate.getTime()) - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const totalLogged = memberLogs.length;
    const missedDays = Math.max(0, totalDaysSoFar - totalLogged);

    memberStats[member.userId] = {
      currentStreak,
      totalLogged,
      missedDays,
    };
  }

  return {
    feedItems,
    memberStats,
  };
}
