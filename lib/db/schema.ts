import { pgTable, uuid, varchar, text, timestamp, boolean, decimal, integer, pgEnum, unique, check } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// Enums
export const activityLevelEnum = pgEnum('activity_level', [
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'athlete'
]);

export const workoutFrequencyEnum = pgEnum('workout_frequency', [
  'never',
  '1_2_per_week',
  '3_4_per_week',
  '5_6_per_week',
  'daily'
]);

export const fitnessGoalEnum = pgEnum('fitness_goal', [
  'lose_weight',
  'build_muscle',
  'maintain',
  'improve_fitness',
  'general_health'
]);

export const roomStatusEnum = pgEnum('room_status', [
  'active',
  'ended',
  'deleted'
]);

export const memberRoleEnum = pgEnum('member_role', [
  'creator',
  'member'
]);

export const workoutTypeEnum = pgEnum('workout_type', [
  'gym',
  'walk',
  'run',
  'rest',
  'other'
]);

export const aiSummaryTypeEnum = pgEnum('ai_summary_type', [
  'onboarding',
  'progress_check',
  'goal_adjustment',
  'weekly_review'
]);

// Users table
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(), // Clerk user ID
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),

  // Physical stats
  heightCm: decimal('height_cm', { precision: 5, scale: 2 }),
  startingWeightKg: decimal('starting_weight_kg', { precision: 5, scale: 2 }),

  // Activity & habits
  activityLevel: activityLevelEnum('activity_level'),
  typicalSleepHours: decimal('typical_sleep_hours', { precision: 3, scale: 1 }),
  currentWorkoutFrequency: workoutFrequencyEnum('current_workout_frequency'),
  fitnessGoal: fitnessGoalEnum('fitness_goal'),

  onboarded: boolean('onboarded').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Rooms table
export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  durationDays: integer('duration_days').notNull(), // 30, 60, or 90
  deadlineTime: varchar('deadline_time', { length: 8 }).notNull(), // HH:MM:SS in IST
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }).notNull(), // computed: startDate + durationDays
  status: roomStatusEnum('status').default('active').notNull(),
  inviteToken: varchar('invite_token', { length: 32 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  checkDuration: check('valid_duration', sql`duration_days IN (30, 60, 90)`)
}));

// Room memberships table
export const roomMemberships = pgTable('room_memberships', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: memberRoleEnum('role').default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull()
}, (table) => ({
  uniqueMembership: unique().on(table.roomId, table.userId)
}));

// Plans table (one per room)
export const plans = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }).unique(),

  expectations: text('expectations'),
  strategy: text('strategy'),
  targets: text('targets'),
  minWorkoutDaysPerWeek: integer('min_workout_days_per_week').default(0),
  minLoggingDaysPerWeek: integer('min_logging_days_per_week').default(1),

  version: integer('version').default(1).notNull(),
  lastUpdatedBy: varchar('last_updated_by', { length: 255 }).references(() => users.id),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  checkWorkoutDays: check('valid_workout_days', sql`min_workout_days_per_week >= 0 AND min_workout_days_per_week <= 7`),
  checkLoggingDays: check('valid_logging_days', sql`min_logging_days_per_week >= 1 AND min_logging_days_per_week <= 7`)
}));

// AI Summaries table (for future AI integration)
export const aiSummaries = pgTable('ai_summaries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  summaryType: aiSummaryTypeEnum('summary_type').notNull(),
  prompt: text('prompt').notNull(), // What we asked the AI
  response: text('response').notNull(), // AI's response
  metadata: text('metadata'), // JSON string with extracted key details for context
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Daily logs table
export const dailyLogs = pgTable('daily_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  logDate: timestamp('log_date', { mode: 'date' }).notNull(),
  roomId: uuid('room_id').references(() => rooms.id, { onDelete: 'set null' }), // nullable after room ends
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),

  // Food entries (time-based, not calories)
  breakfast: varchar('breakfast', { length: 300 }),
  lunch: varchar('lunch', { length: 300 }),
  eveningSnacks: varchar('evening_snacks', { length: 300 }),
  dinner: varchar('dinner', { length: 300 }),

  // Workout
  workoutDone: boolean('workout_done').notNull(),
  workoutType: workoutTypeEnum('workout_type'),
  workoutDurationMinutes: integer('workout_duration_minutes'),
  workoutIntensity: integer('workout_intensity'), // 1-5

  // Body & energy
  sleepHours: decimal('sleep_hours', { precision: 3, scale: 1 }).notNull(),
  energyLevel: integer('energy_level').notNull(), // 1-5
  weightKg: decimal('weight_kg', { precision: 5, scale: 2 }),

  // Note
  note: varchar('note', { length: 200 })
}, (table) => ({
  uniqueUserDateLog: unique().on(table.userId, table.logDate),
  checkEnergyLevel: check('valid_energy', sql`energy_level >= 1 AND energy_level <= 5`),
  checkIntensity: check('valid_intensity', sql`workout_intensity IS NULL OR (workout_intensity >= 1 AND workout_intensity <= 5)`)
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(roomMemberships),
  logs: many(dailyLogs),
  planUpdates: many(plans),
  aiSummaries: many(aiSummaries)
}));

export const aiSummariesRelations = relations(aiSummaries, ({ one }) => ({
  user: one(users, {
    fields: [aiSummaries.userId],
    references: [users.id]
  })
}));

export const roomsRelations = relations(rooms, ({ many, one }) => ({
  memberships: many(roomMemberships),
  plan: one(plans, {
    fields: [rooms.id],
    references: [plans.roomId]
  }),
  logs: many(dailyLogs)
}));

export const roomMembershipsRelations = relations(roomMemberships, ({ one }) => ({
  room: one(rooms, {
    fields: [roomMemberships.roomId],
    references: [rooms.id]
  }),
  user: one(users, {
    fields: [roomMemberships.userId],
    references: [users.id]
  })
}));

export const plansRelations = relations(plans, ({ one }) => ({
  room: one(rooms, {
    fields: [plans.roomId],
    references: [rooms.id]
  }),
  updatedBy: one(users, {
    fields: [plans.lastUpdatedBy],
    references: [users.id]
  })
}));

export const dailyLogsRelations = relations(dailyLogs, ({ one }) => ({
  user: one(users, {
    fields: [dailyLogs.userId],
    references: [users.id]
  }),
  room: one(rooms, {
    fields: [dailyLogs.roomId],
    references: [rooms.id]
  })
}));
