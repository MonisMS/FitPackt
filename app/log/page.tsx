import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dailyLogs } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import Link from 'next/link';
import { CheckCircle, ChevronLeft } from 'lucide-react';
import DailyLogForm from './DailyLogForm';

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ roomId?: string }>;
}) {
  const { roomId } = await searchParams;
  const user = await requireOnboardedUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Check if already logged today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingLog = await db.query.dailyLogs.findFirst({
    where: and(
      eq(dailyLogs.userId, user.id),
      gte(dailyLogs.logDate, today)
    ),
  });

  if (existingLog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-neutral-900/50 border border-neutral-800 rounded-xl shadow-xl p-8 text-center backdrop-blur-sm">
          <div className="w-20 h-20 bg-green-600/20 border-2 border-green-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Already Logged Today ✓</h1>
          <p className="text-neutral-400 mb-8">
            You've already submitted your log for today. Logs cannot be edited after submission.
          </p>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition text-center"
            >
              Dashboard
            </Link>
            <Link
              href="/timeline"
              className="flex-1 bg-neutral-800 border border-neutral-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-700 transition text-center"
            >
              Timeline
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-8 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Log Today 📝</h1>
          <p className="text-lg text-neutral-400">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Form */}
        <DailyLogForm userId={user.id} roomId={roomId} />
      </div>
    </div>
  );
}
