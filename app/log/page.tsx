import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dailyLogs } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Already Logged Today</h1>
          <p className="text-gray-600 mb-6">
            You've already submitted your log for today. Logs cannot be edited after submission.
          </p>
          <div className="flex gap-3">
            <a
              href="/dashboard"
              className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition text-center"
            >
              Back to Dashboard
            </a>
            <a
              href="/timeline"
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition text-center"
            >
              View Timeline
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Log Today</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <DailyLogForm userId={user.id} roomId={roomId} />
      </div>
    </div>
  );
}
