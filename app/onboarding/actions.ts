'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

type OnboardingInput = {
  name: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  sleepHours: number;
  workoutFrequency: string;
  fitnessGoal: string;
};

export async function completeOnboarding(userId: string, data: OnboardingInput) {
  try {
    await db
      .update(users)
      .set({
        name: data.name,
        heightCm: data.heightCm.toString(),
        startingWeightKg: data.weightKg.toString(),
        activityLevel: data.activityLevel as any,
        typicalSleepHours: data.sleepHours.toString(),
        currentWorkoutFrequency: data.workoutFrequency as any,
        fitnessGoal: data.fitnessGoal as any,
        onboarded: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw new Error('Failed to complete onboarding');
  }
}
