CREATE TYPE "public"."activity_level" AS ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'athlete');--> statement-breakpoint
CREATE TYPE "public"."ai_summary_type" AS ENUM('onboarding', 'progress_check', 'goal_adjustment', 'weekly_review');--> statement-breakpoint
CREATE TYPE "public"."fitness_goal" AS ENUM('lose_weight', 'build_muscle', 'maintain', 'improve_fitness', 'general_health');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('creator', 'member');--> statement-breakpoint
CREATE TYPE "public"."room_status" AS ENUM('active', 'ended', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."workout_frequency" AS ENUM('never', '1_2_per_week', '3_4_per_week', '5_6_per_week', 'daily');--> statement-breakpoint
CREATE TYPE "public"."workout_type" AS ENUM('gym', 'walk', 'run', 'rest', 'other');--> statement-breakpoint
CREATE TABLE "ai_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"summary_type" "ai_summary_type" NOT NULL,
	"prompt" text NOT NULL,
	"response" text NOT NULL,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"log_date" timestamp NOT NULL,
	"room_id" uuid,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"breakfast" varchar(300),
	"lunch" varchar(300),
	"evening_snacks" varchar(300),
	"dinner" varchar(300),
	"workout_done" boolean NOT NULL,
	"workout_type" "workout_type",
	"workout_duration_minutes" integer,
	"workout_intensity" integer,
	"sleep_hours" numeric(3, 1) NOT NULL,
	"energy_level" integer NOT NULL,
	"weight_kg" numeric(5, 2),
	"note" varchar(200),
	CONSTRAINT "daily_logs_user_id_log_date_unique" UNIQUE("user_id","log_date"),
	CONSTRAINT "valid_energy" CHECK (energy_level >= 1 AND energy_level <= 5),
	CONSTRAINT "valid_intensity" CHECK (workout_intensity IS NULL OR (workout_intensity >= 1 AND workout_intensity <= 5))
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"expectations" text,
	"strategy" text,
	"targets" text,
	"min_workout_days_per_week" integer DEFAULT 0,
	"min_logging_days_per_week" integer DEFAULT 1,
	"version" integer DEFAULT 1 NOT NULL,
	"last_updated_by" varchar(255),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plans_room_id_unique" UNIQUE("room_id"),
	CONSTRAINT "valid_workout_days" CHECK (min_workout_days_per_week >= 0 AND min_workout_days_per_week <= 7),
	CONSTRAINT "valid_logging_days" CHECK (min_logging_days_per_week >= 1 AND min_logging_days_per_week <= 7)
);
--> statement-breakpoint
CREATE TABLE "room_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role" "member_role" DEFAULT 'member' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "room_memberships_room_id_user_id_unique" UNIQUE("room_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"duration_days" integer NOT NULL,
	"deadline_time" varchar(8) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" "room_status" DEFAULT 'active' NOT NULL,
	"invite_token" varchar(32) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rooms_invite_token_unique" UNIQUE("invite_token"),
	CONSTRAINT "valid_duration" CHECK (duration_days IN (30, 60, 90))
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"height_cm" numeric(5, 2),
	"starting_weight_kg" numeric(5, 2),
	"activity_level" "activity_level",
	"typical_sleep_hours" numeric(3, 1),
	"current_workout_frequency" "workout_frequency",
	"fitness_goal" "fitness_goal",
	"onboarded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ai_summaries" ADD CONSTRAINT "ai_summaries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_last_updated_by_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_memberships" ADD CONSTRAINT "room_memberships_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_memberships" ADD CONSTRAINT "room_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;