import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { rooms, roomMemberships } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import Link from 'next/link';
import RoomFeed from './RoomFeed';
import { getRoomFeedData } from './actions';
import { getRoomWithStatus } from '@/lib/room-utils';

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const user = await requireOnboardedUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Get room and update status if needed
  const room = await getRoomWithStatus(roomId);

  if (!room) {
    redirect('/dashboard');
  }

  // Check if user is a member
  const membership = await db.query.roomMemberships.findFirst({
    where: and(
      eq(roomMemberships.roomId, roomId),
      eq(roomMemberships.userId, user.id)
    ),
  });

  if (!membership) {
    redirect('/dashboard');
  }

  // Get all members
  const members = await db.query.roomMemberships.findMany({
    where: eq(roomMemberships.roomId, roomId),
    with: {
      user: true,
    },
  });

  // Get feed data (logs and missed days)
  const feedData = await getRoomFeedData(roomId);

  // Calculate days
  const today = new Date();
  const startDate = new Date(room.startDate);
  const endDate = new Date(room.endDate);
  const totalDays = room.durationDays;
  const daysPassed = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const currentDay = Math.min(daysPassed + 1, totalDays);
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const isActive = room.status === 'active' && endDate >= today;
  const isCreator = membership.role === 'creator';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-black"
            >
              ← Back to Dashboard
            </Link>
            {isCreator && isActive && (
              <Link
                href={`/rooms/${roomId}/settings`}
                className="text-sm text-gray-600 hover:text-black"
              >
                Settings
              </Link>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">{room.name}</h1>
            {isActive ? (
              <p className="text-gray-600">
                Day {currentDay} of {totalDays} • {daysRemaining} days remaining
              </p>
            ) : (
              <p className="text-gray-600">Ended on {endDate.toLocaleDateString()}</p>
            )}
          </div>

          {/* Progress bar */}
          {isActive && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full transition-all"
                  style={{ width: `${(currentDay / totalDays) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="flex gap-3 mt-4">
            <Link
              href={`/rooms/${roomId}/plan`}
              className="px-4 py-2 border-2 border-black rounded-lg font-medium hover:bg-black hover:text-white transition text-sm"
            >
              View Plan
            </Link>
            {isActive && (
              <>
                <Link
                  href={`/log?roomId=${roomId}`}
                  className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition text-sm"
                >
                  Log Today
                </Link>
                {isCreator && (
                  <Link
                    href={`/rooms/${roomId}/invite`}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium hover:border-black transition text-sm"
                  >
                    Invite Link
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Members section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Members ({members.length}/5)</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => {
              const memberStats = feedData.memberStats[member.userId];
              return (
                <div key={member.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{member.user.name}</span>
                    {member.role === 'creator' && (
                      <span className="text-xs bg-black text-white px-2 py-1 rounded">
                        Creator
                      </span>
                    )}
                  </div>
                  {memberStats && (
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between text-gray-600">
                        <span>Current streak</span>
                        <span className="font-medium text-black">
                          {memberStats.currentStreak} days
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Total logged</span>
                        <span className="font-medium text-black">
                          {memberStats.totalLogged} days
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Missed</span>
                        <span className="font-medium text-red-600">
                          {memberStats.missedDays} days
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Feed */}
        <div>
          <h2 className="text-lg font-bold mb-4">Activity Feed</h2>
          <RoomFeed feedItems={feedData.feedItems} members={members} />
        </div>
      </main>
    </div>
  );
}
