'use server';

import { db } from '@/lib/db';
import { plans } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

type SavePlanInput = {
  roomId: string;
  userId: string;
  expectations: string | null;
  strategy: string | null;
  targets: string | null;
  minWorkoutDaysPerWeek: number;
  minLoggingDaysPerWeek: number;
};

export async function savePlan(input: SavePlanInput) {
  try {
    // Check if plan exists
    const existingPlan = await db.query.plans.findFirst({
      where: eq(plans.roomId, input.roomId),
    });

    if (existingPlan) {
      // Update existing plan
      await db
        .update(plans)
        .set({
          expectations: input.expectations,
          strategy: input.strategy,
          targets: input.targets,
          minWorkoutDaysPerWeek: input.minWorkoutDaysPerWeek,
          minLoggingDaysPerWeek: input.minLoggingDaysPerWeek,
          version: existingPlan.version + 1,
          lastUpdatedBy: input.userId,
          updatedAt: new Date(),
        })
        .where(eq(plans.id, existingPlan.id));
    } else {
      // Create new plan
      await db.insert(plans).values({
        roomId: input.roomId,
        expectations: input.expectations,
        strategy: input.strategy,
        targets: input.targets,
        minWorkoutDaysPerWeek: input.minWorkoutDaysPerWeek,
        minLoggingDaysPerWeek: input.minLoggingDaysPerWeek,
        version: 1,
        lastUpdatedBy: input.userId,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving plan:', error);
    throw new Error('Failed to save plan');
  }
}
