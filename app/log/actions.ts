'use server';

import { db } from '@/lib/db';
import { dailyLogs } from '@/lib/db/schema';

type SubmitLogInput = {
  userId: string;
  roomId: string | null;
  breakfast: string | null;
  lunch: string | null;
  eveningSnacks: string | null;
  dinner: string | null;
  workoutDone: boolean;
  workoutType: string | null;
  workoutDurationMinutes: number | null;
  workoutIntensity: number | null;
  sleepHours: number;
  energyLevel: number;
  weightKg: number | null;
  note: string | null;
};

export async function submitDailyLog(input: SubmitLogInput) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await db.insert(dailyLogs).values({
      userId: input.userId,
      logDate: today,
      roomId: input.roomId,
      breakfast: input.breakfast,
      lunch: input.lunch,
      eveningSnacks: input.eveningSnacks,
      dinner: input.dinner,
      workoutDone: input.workoutDone,
      workoutType: input.workoutType as any,
      workoutDurationMinutes: input.workoutDurationMinutes,
      workoutIntensity: input.workoutIntensity,
      sleepHours: input.sleepHours.toString(),
      energyLevel: input.energyLevel,
      weightKg: input.weightKg?.toString() || null,
      note: input.note,
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting daily log:', error);
    throw new Error('Failed to submit log');
  }
}
