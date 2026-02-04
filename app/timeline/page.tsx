import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import Link from 'next/link';
import { getUserTimeline } from './actions';
import TimelineView from './TimelineView';

export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<{ roomId?: string; from?: string; to?: string }>;
}) {
  const { roomId, from, to } = await searchParams;
  const user = await requireOnboardedUser();

  if (!user) {
    redirect('/sign-in');
  }

  const timelineData = await getUserTimeline(user.id, roomId, from, to);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-black mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold mb-2">Your Timeline</h1>
          <p className="text-gray-600">
            All your logs across all rooms
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Logs</h3>
            <p className="text-3xl font-bold">{timelineData.stats.totalLogs}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Current Streak</h3>
            <p className="text-3xl font-bold">{timelineData.stats.currentStreak} days</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Workout Days</h3>
            <p className="text-3xl font-bold">{timelineData.stats.workoutDays}</p>
          </div>
        </div>

        {/* Timeline */}
        <TimelineView
          logs={timelineData.logs}
          rooms={timelineData.rooms}
          filters={{ roomId, from, to }}
        />
      </main>
    </div>
  );
}
