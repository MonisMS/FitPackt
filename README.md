# Accountability App - MVP

Private accountability and execution logging for fitness and habits.

## 🎯 What This Is

A **structured daily execution log** used inside small private rooms (2-5 people), optimized for honesty, consistency, and accountability. Designed to make skipping visible and uncomfortable.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Push database schema
npm run db:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✨ Features

- ✅ User onboarding with physical stats & goals
- ✅ Private rooms (2-5 members, 30/60/90 days)
- ✅ Shared plan (expectations, strategy, targets)
- ✅ Daily logging (food, workout, body stats)
- ✅ Room feed with MISSED day indicators
- ✅ Streak tracking per member
- ✅ Personal timeline (all logs forever)
- ✅ Room auto-end logic
- ✅ Mobile-first design

See full [feature documentation](./MOBILE_UX.md) for details.

## 🛠️ Tech Stack

- Next.js 15 + React 19 + TypeScript
- PostgreSQL + Drizzle ORM
- Clerk Authentication
- Tailwind CSS 4
- Vercel Deployment

## 📦 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server

npm run db:push      # Push schema to database
npm run db:studio    # Open database GUI
npm run db:generate  # Generate migrations
```

## 🔐 Environment Setup

Required variables (see `.env.local.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_*` - Clerk auth keys
- `CLERK_SECRET_KEY` - Clerk secret
- `CLERK_WEBHOOK_SECRET` - For user sync

## 📱 Mobile-First

The app is fully optimized for mobile:
- All forms work smoothly on touch devices
- Daily logging takes < 2 minutes
- Large touch targets (≥ 44px)
- Responsive layouts at all breakpoints

## 🎯 Core Philosophy

- **Logging < 2 minutes**
- **Logs cannot be edited**
- **Missing visible to all**
- **Honesty > optimization**
- **Data persists forever**

---

Built with Claude Code (Sonnet 4.5)
