'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

type UpdateSettingsInput = {
  userId: string;
  name: string;
  heightCm: number | null;
  currentWeightKg: number | null;
  activityLevel: string | null;
  typicalSleepHours: number | null;
  currentWorkoutFrequency: string | null;
  fitnessGoal: string | null;
};

export async function updateUserSettings(input: UpdateSettingsInput) {
  try {
    await db
      .update(users)
      .set({
        name: input.name,
        heightCm: input.heightCm?.toString() || null,
        activityLevel: input.activityLevel as any,
        typicalSleepHours: input.typicalSleepHours?.toString() || null,
        currentWorkoutFrequency: input.currentWorkoutFrequency as any,
        fitnessGoal: input.fitnessGoal as any,
        updatedAt: new Date(),
      })
      .where(eq(users.id, input.userId));

    // Note: currentWeightKg is not stored in users table
    // It would typically be tracked via daily logs or a separate weight tracking table
    // For now, we're ignoring it as per the original schema

    return { success: true };
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw new Error('Failed to update settings');
  }
}
