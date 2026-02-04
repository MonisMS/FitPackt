# Accountability App - Project Context

## Project Overview

This is a **fitness and habit accountability app** designed for small private groups (2-5 people) to track daily execution through structured logging. The core philosophy emphasizes honesty, consistency, and making missed days visible to all members.

**Key Principles:**
- Logging takes less than 2 minutes
- Logs cannot be edited once submitted
- Missing logs are visible to all room members
- Honesty is prioritized over optimization
- All data persists forever (even after rooms end)

## Tech Stack

### Core Technologies
- **Framework**: Next.js 16.1.6 (App Router with Server Components)
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Node**: 20+

### Authentication & User Management
- **Clerk**: Version 6.37.1 (@clerk/nextjs)
- Handles sign-up, sign-in, user management, and webhooks
- Middleware protects all routes except public paths (sign-in, sign-up, webhooks)

### Database
- **PostgreSQL**: Primary database
- **Drizzle ORM**: Version 0.45.1
  - Type-safe database queries
  - Schema defined in `lib/db/schema.ts`
  - Drizzle Kit 0.31.8 for migrations
- **Connection**: Uses `postgres` package (3.4.8)

### Styling
- **Tailwind CSS**: Version 4 (@tailwindcss/postcss)
- **Design System**: Custom UI components in `components/ui/`
- **Icons**: Lucide React (0.563.0)
- **Utilities**: clsx + tailwind-merge (cn utility)

### Deployment
- **Platform**: Vercel (optimized for Next.js)
- **Database**: PostgreSQL (likely Vercel Postgres or Neon)

## Project Structure

```
fitnnesshit/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with ClerkProvider
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles
│   │
│   ├── onboarding/              # User onboarding flow (6 steps)
│   │   ├── page.tsx
│   │   ├── OnboardingForm.tsx   # Multi-step form
│   │   └── actions.ts           # Server actions
│   │
│   ├── dashboard/               # Main dashboard
│   │   ├── page.tsx
│   │   ├── RoomCard.tsx         # Room display cards
│   │   └── actions.ts
│   │
│   ├── log/                     # Daily logging
│   │   ├── page.tsx
│   │   ├── DailyLogForm.tsx     # Main logging form (<2min)
│   │   └── actions.ts
│   │
│   ├── rooms/                   # Room management
│   │   ├── create/              # Create new room
│   │   │   ├── page.tsx
│   │   │   └── CreateRoomForm.tsx
│   │   ├── join/                # Join via invite
│   │   │   ├── page.tsx
│   │   │   ├── JoinRoomInput.tsx
│   │   │   └── [token]/         # Token-based joining
│   │   │       ├── page.tsx
│   │   │       └── JoinRoomForm.tsx
│   │   └── [roomId]/            # Individual room view
│   │       ├── page.tsx
│   │       ├── RoomFeed.tsx     # Feed with MISSED indicators
│   │       ├── actions.ts
│   │       └── plan/            # Shared room plan
│   │           ├── page.tsx
│   │           ├── PlanForm.tsx
│   │           └── actions.ts
│   │
│   ├── timeline/                # Personal timeline (all logs)
│   │   ├── page.tsx
│   │   ├── TimelineView.tsx
│   │   └── actions.ts
│   │
│   ├── settings/                # User settings
│   │   ├── page.tsx
│   │   ├── SettingsForm.tsx
│   │   └── actions.ts
│   │
│   ├── landing/                 # Marketing pages
│   │   ├── page.tsx
│   │   └── _components/         # Landing page sections
│   │       ├── Hero.tsx
│   │       ├── Features.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── FinalCTA.tsx
│   │       └── Footer.tsx
│   │
│   └── api/                     # API routes
│       ├── webhooks/
│       │   └── clerk/           # Clerk user sync webhook
│       │       └── route.ts
│       └── cron/
│           └── update-room-status/  # Auto-end rooms
│               └── route.ts
│
├── components/
│   └── ui/                      # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Select.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Modal.tsx
│       ├── Alert.tsx
│       ├── Progress.tsx
│       └── index.ts             # Barrel export
│
├── lib/                         # Utility libraries
│   ├── db/
│   │   ├── index.ts             # Database client setup
│   │   └── schema.ts            # Complete database schema
│   ├── utils.ts                 # General utilities (cn, isRoomActive)
│   ├── auth.ts                  # Auth helpers
│   └── room-utils.ts            # Room status management
│
├── public/                      # Static assets
│   └── *.svg                    # Next.js default icons
│
├── drizzle/                     # Generated migrations (git-ignored)
│
├── .env                         # Environment variables
├── .env.local.example           # Example env file
├── middleware.ts                # Clerk authentication middleware
├── drizzle.config.ts            # Drizzle Kit configuration
├── tailwind.config.ts           # Tailwind configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
├── README.md                    # Project documentation
└── MOBILE_UX.md                 # Mobile optimization details
```

## Database Schema

### Tables

#### users
- **Primary Key**: `id` (varchar, Clerk user ID)
- **Fields**:
  - `email` (unique, required)
  - `name` (required)
  - Physical stats: `heightCm`, `startingWeightKg`
  - Activity: `activityLevel`, `typicalSleepHours`, `currentWorkoutFrequency`, `fitnessGoal`
  - `onboarded` (boolean, default false)
  - Timestamps: `createdAt`, `updatedAt`
- **Relations**: Has many memberships, logs, and plan updates

#### rooms
- **Primary Key**: `id` (uuid)
- **Fields**:
  - `name` (room name)
  - `durationDays` (30, 60, or 90 - constrained by check)
  - `deadlineTime` (HH:MM:SS in IST timezone)
  - `startDate`, `endDate` (computed: startDate + durationDays)
  - `status` (active, ended, deleted)
  - `inviteToken` (unique, 32 chars - for joining)
  - `createdAt`
- **Relations**: Has many memberships, one plan, many logs
- **Constraints**: durationDays must be 30, 60, or 90

#### roomMemberships
- **Primary Key**: `id` (uuid)
- **Fields**:
  - `roomId` (FK to rooms, cascade delete)
  - `userId` (FK to users, cascade delete)
  - `role` (creator or member)
  - `joinedAt`
- **Constraints**: Unique (roomId, userId) - one membership per user per room
- **Relations**: Belongs to room and user

#### plans
- **Primary Key**: `id` (uuid)
- **Fields**:
  - `roomId` (FK to rooms, cascade delete, unique - one plan per room)
  - `expectations` (text)
  - `strategy` (text)
  - `targets` (text)
  - `minWorkoutDaysPerWeek` (0-7, default 0)
  - `minLoggingDaysPerWeek` (1-7, default 1)
  - `version` (default 1)
  - `lastUpdatedBy` (FK to users)
  - `updatedAt`
- **Constraints**:
  - minWorkoutDaysPerWeek: 0-7
  - minLoggingDaysPerWeek: 1-7
- **Relations**: Belongs to room and user (updatedBy)

#### dailyLogs
- **Primary Key**: `id` (uuid)
- **Fields**:
  - `userId` (FK to users, cascade delete)
  - `logDate` (date only, no time)
  - `roomId` (FK to rooms, set null on delete - logs persist after room ends)
  - `submittedAt` (timestamp)

  - **Food entries** (all optional, 300 char max):
    - `breakfast`, `lunch`, `eveningSnacks`, `dinner`

  - **Workout**:
    - `workoutDone` (boolean, required)
    - `workoutType` (gym, walk, run, rest, other)
    - `workoutDurationMinutes` (integer)
    - `workoutIntensity` (1-5)

  - **Body & Energy**:
    - `sleepHours` (decimal, required)
    - `energyLevel` (1-5, required)
    - `weightKg` (decimal, optional)

  - `note` (optional, 200 char max)

- **Constraints**:
  - Unique (userId, logDate) - one log per user per day
  - energyLevel: 1-5
  - workoutIntensity: 1-5 (nullable)
- **Relations**: Belongs to user and room

### Enums
- `activity_level`: sedentary, lightly_active, moderately_active, very_active, athlete
- `workout_frequency`: never, 1_2_per_week, 3_4_per_week, 5_6_per_week, daily
- `fitness_goal`: lose_weight, build_muscle, maintain, improve_fitness, general_health
- `room_status`: active, ended, deleted
- `member_role`: creator, member
- `workout_type`: gym, walk, run, rest, other

## Key Features & Flows

### 1. User Onboarding (6 Steps)
**File**: `app/onboarding/OnboardingForm.tsx`

Collects user information in a multi-step wizard:
1. Physical stats (height, starting weight)
2. Activity level (sedentary to athlete)
3. Sleep hours (5-8+ hours)
4. Current workout frequency
5. Fitness goal

**Design**: Large touch-friendly buttons, progress indicator, smooth animations

### 2. Room Creation
**File**: `app/rooms/create/CreateRoomForm.tsx`

- User creates a room with:
  - Room name
  - Duration (30, 60, or 90 days)
  - Start date
  - Daily deadline time (for logging)
- System generates unique invite token
- Creator becomes first member with "creator" role
- Room status set to "active"

### 3. Room Joining
**Files**: `app/rooms/join/` directory

Two methods:
- **Via token input**: User manually enters invite token
- **Via link**: Direct link with token in URL (`/rooms/join/[token]`)

Validation:
- Room must be active
- Room must not be full (max 5 members)
- User must not already be a member
- User must be onboarded

### 4. Daily Logging (< 2 minutes)
**File**: `app/log/DailyLogForm.tsx`

**Sections**:
1. **Food** (optional but encouraged):
   - 4 textareas: Breakfast, Lunch, Evening/Snacks, Dinner
   - 300 character limit each
   - Character counter below each field

2. **Workout** (required to answer):
   - Yes/No toggle buttons
   - If Yes: Type, Duration, Intensity (1-5 grid)

3. **Body & Energy** (required):
   - Sleep hours (number input)
   - Energy level (1-5 button grid)
   - Weight (optional)

4. **Note** (optional):
   - Personal reflection (200 chars)

**Submission**:
- Confirmation modal warns logs are permanent
- Once submitted, logs CANNOT be edited
- Validation: Must have food entry + sleep + energy

**Mobile Optimization**:
- Single column layout
- Large touch targets (≥44px)
- Minimal typing required
- Quick button selections

### 5. Room Feed
**File**: `app/rooms/[roomId]/RoomFeed.tsx`

**Displays**:
- Member stats cards (streak, total logs)
- Chronological feed of all logs
- **MISSED day indicators** (key feature!)
- Expandable log cards with full details
- Filter by member

**Streak Calculation**:
- Consecutive days with logs
- Resets on missed day
- Visible to all members (accountability)

**Missed Days Logic**:
- If user didn't log on a day within room period
- Shows "MISSED" badge in feed
- Creates social pressure to maintain consistency

### 6. Shared Plan
**File**: `app/rooms/[roomId]/plan/PlanForm.tsx`

Four sections (all optional but encouraged):
1. **Expectations**: What everyone commits to
2. **Strategy**: How to achieve goals
3. **Targets**: Specific metrics
4. **Requirements**:
   - Min workout days per week (0-7)
   - Min logging days per week (1-7)

**Collaborative**:
- Any member can edit
- Shows who last updated
- Version tracking
- All members see same plan

### 7. Personal Timeline
**File**: `app/timeline/TimelineView.tsx`

**Features**:
- All user's logs across all time
- Persists even after rooms end
- Filter by:
  - Specific room
  - Date range
  - Workout done/not done
- Grouped by month
- Expandable cards
- Shows which room each log was for

**Use Case**: Long-term progress tracking, reviewing past performance

### 8. Settings
**File**: `app/settings/SettingsForm.tsx`

User can update:
- Physical stats (height, weight)
- Activity level
- Sleep habits
- Workout frequency
- Fitness goal

Updates profile for future room matching/context.

### 9. Auto Room Status Update
**File**: `app/api/cron/update-room-status/route.ts`

**Background Job**:
- Checks all active rooms
- If `endDate < today`, marks as "ended"
- Rooms transition: active → ended → (optionally) deleted
- Logs remain even after room ends (roomId becomes nullable)

**Trigger**: Likely Vercel Cron job (daily at midnight)

## Authentication & Authorization

### Clerk Integration

**Middleware**: `middleware.ts`
- Protects all routes except:
  - `/sign-in`
  - `/sign-up`
  - `/api/webhooks`
- Uses `clerkMiddleware` with `auth.protect()`

**Webhook**: `app/api/webhooks/clerk/route.ts`
- **Events handled**:
  - `user.created`: Creates user in database
  - `user.updated`: Updates user email/name
  - `user.deleted`: Deletes user from database
- **Security**: Verifies webhook signature with Svix
- **Sync**: Keeps Clerk auth in sync with app database

**User Flow**:
1. User signs up via Clerk → `user.created` webhook → DB record created
2. User redirected to onboarding
3. After onboarding: `onboarded = true`
4. Protected routes check `onboarded` status

## State Management

**Approach**: Server-first with minimal client state

- **Server Components**: Default for all pages
- **Server Actions**: All data mutations (in `actions.ts` files)
- **Client Components**: Only forms and interactive UI
  - Marked with `'use client'` directive
  - Use React hooks (useState, useRouter)
- **Data Fetching**: Direct database queries in Server Components
- **No Global State**: No Redux, Zustand, or Context API needed

**Pattern**:
```typescript
// Server Component (page.tsx)
async function Page() {
  const data = await db.query... // Direct DB query
  return <ClientForm data={data} />;
}

// Client Component (Form.tsx)
'use client';
function Form({ data }) {
  const [state, setState] = useState(data);
  const handleSubmit = async () => {
    await serverAction(state); // Calls server action
    router.push('/...');
  };
}

// Server Action (actions.ts)
'use server';
async function serverAction(data) {
  await db.insert(...).values(data);
}
```

## Database Patterns

### Query Patterns

**File**: Uses Drizzle ORM for type-safe queries

```typescript
// Find with relations
const room = await db.query.rooms.findFirst({
  where: eq(rooms.id, roomId),
  with: {
    memberships: {
      with: { user: true }
    },
    plan: true
  }
});

// Insert
await db.insert(dailyLogs).values({
  userId,
  logDate: new Date(),
  // ...
});

// Update
await db.update(users)
  .set({ onboarded: true })
  .where(eq(users.id, userId));

// Delete (with cascade)
await db.delete(rooms).where(eq(rooms.id, roomId));
```

### Cascade Behavior

- **rooms deleted** → memberships deleted, logs set roomId=null, plan deleted
- **users deleted** → memberships deleted, logs deleted
- This ensures data integrity while preserving historical logs

## Mobile-First Design

**File**: See `MOBILE_UX.md` for complete details

### Key Optimizations

1. **Viewport**: Locked at initial-scale=1, maximum-scale=1
2. **Touch Targets**: All buttons ≥44px height
3. **Typography**: Responsive sizes (text-sm to text-3xl)
4. **Layout**:
   - Mobile: Single column, px-4 padding
   - Tablet: md:grid-cols-2
   - Desktop: lg:grid-cols-3
5. **Forms**:
   - Textareas with rows="2" for compact input
   - Large button grids for 1-5 selections
   - Full-width submit buttons
6. **Navigation**: Large back buttons, clear hierarchy
7. **No hover dependencies**: All interactions work on touch

### Performance
- Minimal JavaScript (mostly Server Components)
- No large images
- Fast page loads
- Lighthouse mobile score optimized

## Environment Variables

**Required** (see `.env.local.example`):

```bash
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Clerk URLs (auto-configured by Clerk)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/onboarding"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"
```

## Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema to database (no migrations)
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio (DB GUI)
```

**Common Workflow**:
1. Modify `lib/db/schema.ts`
2. Run `npm run db:push` (instant schema sync)
3. For production: Use `db:generate` + `db:migrate`

## File Naming Conventions

- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx`
- **Components**: PascalCase (`OnboardingForm.tsx`)
- **Actions**: `actions.ts` (server actions)
- **Utils**: kebab-case (`room-utils.ts`)
- **UI Components**: PascalCase in `components/ui/`

## Code Patterns & Conventions

### Server Actions

All in `actions.ts` files:
```typescript
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function myAction(data: FormData) {
  const result = await db.insert(...).values(...);
  revalidatePath('/path'); // Refresh page data
  return result;
}
```

### Form Submissions

Pattern used throughout:
1. Client form with local state
2. Validation before submission
3. Confirmation modal for destructive actions
4. Server action call
5. Router navigation on success
6. Error handling with user feedback

### Utility Functions

**File**: `lib/utils.ts`

- `cn()`: Merge Tailwind classes with proper precedence
- `isRoomActive()`: Check if room is still active

**File**: `lib/room-utils.ts`

- `checkAndUpdateRoomStatus()`: Auto-update room status based on endDate
- `getRoomWithStatus()`: Get room with current status check

## Design System

### Colors
- **Primary**: Neutral 950 (near-black)
- **Secondary**: Neutral 300-600
- **Accents**: Green (success), Red (destructive), Yellow (warning)
- **Background**: White, Neutral 50/100

### Components

All in `components/ui/`:

- **Button**: Primary, secondary, destructive variants
- **Input**: Text, number, date inputs with labels
- **Textarea**: With character counter option
- **Select**: Dropdown with options
- **Card**: Container with shadow
- **Badge**: Status indicators (streak, missed, etc.)
- **Modal**: Dialog with header, body, footer
- **Alert**: Notifications
- **Progress**: Bar for onboarding steps

### Icons
**Lucide React** used throughout:
- Utensils (food)
- Dumbbell (workout)
- Moon (sleep)
- Brain (notes)
- Target (goals)
- CheckCircle (success)
- Lock (permanent submission)
- And more...

## Deployment & Infrastructure

### Vercel Deployment

1. **Build Command**: `npm run build`
2. **Output Directory**: `.next`
3. **Install Command**: `npm install`
4. **Framework**: Next.js (auto-detected)

### Database Hosting

Likely using:
- Vercel Postgres (integrated)
- Neon (serverless Postgres)
- Supabase
- Railway

Connection via `DATABASE_URL` environment variable.

### Cron Jobs

**File**: `app/api/cron/update-room-status/route.ts`

Set up in Vercel:
```json
{
  "crons": [{
    "path": "/api/cron/update-room-status",
    "schedule": "0 0 * * *"  // Daily at midnight
  }]
}
```

## Core Philosophy & Product Decisions

### Why Logs Can't Be Edited
- Prevents gaming the system
- Ensures honesty
- Creates real accountability
- Mirrors real life (you can't undo missed days)

### Why < 2 Minutes Logging
- Removes friction
- Ensures consistency
- Focus on execution, not perfection
- Sustainable long-term

### Why Small Groups (2-5)
- High visibility per person
- Strong social pressure
- Manageable group dynamics
- Personal accountability

### Why Missed Days Are Visible
- Core accountability mechanism
- Creates social pressure
- Honest feedback loop
- Prevents ghosting

### Why Logs Persist Forever
- Long-term progress tracking
- Historical context
- Honest record
- Learning from past patterns

## Common Workflows

### Creating and Running a Room

1. **Create Room**: User sets name, duration, start date, deadline
2. **Share Invite**: Copy invite link or token
3. **Members Join**: Others join via link (max 5 total)
4. **Set Plan**: Group collaboratively defines expectations/strategy
5. **Daily Logging**: Each member logs before deadline
6. **View Feed**: Check room feed for accountability
7. **Auto-End**: Room automatically ends after duration

### Typical User Session

1. User logs in → Dashboard
2. Sees active rooms with member stats
3. Quick action: "Log Today" → Daily log form
4. Fills form (< 2 min) → Submits
5. Redirects to dashboard
6. Can view room feed to see others' progress

### Onboarding New User

1. Sign up via Clerk
2. Webhook creates DB record
3. Redirect to `/onboarding`
4. Complete 6-step wizard
5. `onboarded = true`
6. Redirect to dashboard (empty state)
7. Create first room or join via invite

## Testing Considerations

### Key Flows to Test

1. **Authentication**:
   - Sign up → webhook → DB sync
   - Sign in → redirect based on onboarded status

2. **Onboarding**:
   - All 6 steps complete successfully
   - Can go back/forward
   - Data persists on submit

3. **Room Management**:
   - Create room → generates token
   - Join via token (validation checks)
   - Can't join if full/ended
   - Room auto-ends on endDate

4. **Daily Logging**:
   - Submit log successfully
   - Can't submit duplicate for same day
   - Validation works (required fields)
   - Confirmation modal appears

5. **Room Feed**:
   - Logs appear correctly
   - Missed days calculated properly
   - Streaks calculated correctly
   - Filter works

6. **Timeline**:
   - Shows all user logs
   - Filters work
   - Logs persist after room ends

### Edge Cases

- User not onboarded → redirected
- Room full → can't join
- Room ended → no logging
- Duplicate log same day → error
- Token invalid → error
- Webhook fails → retry logic

## Future Enhancement Ideas

Based on current structure:

1. **Notifications**: Email/push for missed logs, room ending soon
2. **Analytics**: Personal insights, trends, correlations
3. **Challenges**: Group challenges, bonus goals
4. **Social**: Comments on logs, reactions, support
5. **Photos**: Attach progress photos to logs
6. **Reminders**: Custom reminder times
7. **Templates**: Pre-filled meal templates
8. **Integrations**: Fitness trackers, calendar sync
9. **Gamification**: Badges, achievements, leaderboards
10. **Export**: Download all data as CSV/JSON

## Troubleshooting

### Common Issues

**Problem**: Clerk webhook not syncing users
- **Solution**: Check `CLERK_WEBHOOK_SECRET` in env
- Verify webhook URL in Clerk dashboard
- Check webhook logs in Clerk

**Problem**: Database connection fails
- **Solution**: Verify `DATABASE_URL` format
- Check database is running
- Ensure SSL mode if required

**Problem**: TypeScript errors after schema change
- **Solution**: Run `npm run db:push` to sync
- Restart TypeScript server
- Check Drizzle codegen

**Problem**: Room not auto-ending
- **Solution**: Check cron job is configured in Vercel
- Verify `/api/cron/update-room-status` route exists
- Check cron logs in Vercel dashboard

## Key Metrics & Analytics

**User Engagement**:
- Daily active users (DAU)
- Logging frequency (logs per user per week)
- Room completion rate (active rooms → ended)
- Average streak length

**Accountability**:
- Missed day rate
- Logs per room member
- Room activity level (% members logging)

**Growth**:
- New user signups
- Rooms created per week
- Average room size
- Invite conversion rate (joins per invite)

## Security Considerations

### Authentication
- Clerk handles all auth
- Session tokens managed by Clerk
- Protected routes via middleware
- Webhook signature verification

### Data Privacy
- Users only see logs within their rooms
- Personal timeline is private
- No public profiles
- Invite tokens are unique and secret

### Database
- Prepared statements (Drizzle ORM)
- SQL injection protected
- Cascade deletes properly configured
- Constraints enforce data integrity

## Git History

**Current Branch**: `main`

**Recent Commits**:
- `38eee3e` - revamped ui
- `ab489cd` - Initial commit

**Current Changes** (uncommitted):
- Modified forms (RoomFeed, PlanForm, CreateRoomForm, JoinRoomInput, JoinRoomForm, SettingsForm, TimelineView)

## Development Tips

### Adding New Features

1. **Database First**: Update `lib/db/schema.ts`
2. **Push Schema**: Run `npm run db:push`
3. **Create Page**: Add to `app/` directory
4. **Create Actions**: Add `actions.ts` for data mutations
5. **Build UI**: Create form/view components
6. **Test Flow**: Test complete user journey

### Debugging

- **Server Logs**: Check terminal running `npm run dev`
- **Network**: Use browser DevTools Network tab
- **Database**: Use `npm run db:studio` for visual DB inspection
- **Clerk**: Check Clerk dashboard for auth logs

### Performance

- Prefer Server Components (faster initial load)
- Use Client Components only when needed (forms, interactivity)
- Optimize images (use Next.js Image component)
- Lazy load heavy components
- Database indexes on frequently queried columns

---

## Quick Reference

**Start Development**:
```bash
npm install
npm run db:push
npm run dev
```

**Deploy**:
```bash
git push origin main  # Auto-deploys on Vercel
```

**View Database**:
```bash
npm run db:studio  # Opens Drizzle Studio
```

**Key Paths**:
- Dashboard: `/dashboard`
- Log Today: `/log`
- Create Room: `/rooms/create`
- Join Room: `/rooms/join`
- Timeline: `/timeline`
- Settings: `/settings`

**Key Files**:
- Schema: `lib/db/schema.ts`
- DB Client: `lib/db/index.ts`
- Auth Middleware: `middleware.ts`
- UI Components: `components/ui/`

---

**Last Updated**: 2026-02-04
**Built With**: Claude Code (Sonnet 4.5)
