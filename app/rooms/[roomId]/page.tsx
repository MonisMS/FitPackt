import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { rooms, roomMemberships } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { ChevronLeft, Settings, FileText, UserPlus, Edit3 } from 'lucide-react';
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
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
            >
              <ChevronLeft size={18} />
              Back to Dashboard
            </Link>
            {isCreator && isActive && (
              <Link
                href={`/rooms/${roomId}/settings`}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
              >
                <Settings size={18} />
                Settings
              </Link>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{room.name}</h1>
            {isActive ? (
              <p className="text-neutral-400">
                Day {currentDay} of {totalDays} • {daysRemaining} days remaining
              </p>
            ) : (
              <p className="text-neutral-400">Ended on {endDate.toLocaleDateString()}</p>
            )}
          </div>

          {/* Progress bar */}
          {isActive && (
            <div className="mt-4">
              <div className="w-full bg-neutral-800 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-red-600 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(currentDay / totalDays) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <Link
              href={`/rooms/${roomId}/plan`}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg font-medium hover:bg-neutral-700 hover:border-neutral-600 transition text-white text-sm"
            >
              <FileText size={16} />
              View Plan
            </Link>
            {isActive && (
              <>
                <Link
                  href={`/log?roomId=${roomId}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 rounded-lg font-semibold transition text-white text-sm"
                >
                  <Edit3 size={16} />
                  Log Today
                </Link>
                {isCreator && (
                  <Link
                    href={`/rooms/${roomId}/invite`}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg font-medium hover:bg-neutral-700 hover:border-neutral-600 transition text-white text-sm"
                  >
                    <UserPlus size={16} />
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
          <h2 className="text-2xl font-bold text-white mb-4">Members ({members.length}/5)</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => {
              const memberStats = feedData.memberStats[member.userId];
              return (
                <div key={member.id} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 backdrop-blur-sm hover:border-neutral-700 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-white text-lg">{member.user.name}</span>
                    {member.role === 'creator' && (
                      <span className="text-xs bg-gradient-to-r from-red-600 to-orange-500 text-white px-2 py-1 rounded-full font-medium">
                        Creator
                      </span>
                    )}
                  </div>
                  {memberStats && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-400">Current streak</span>
                        <span className="font-semibold text-white">
                          🔥 {memberStats.currentStreak} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-400">Total logged</span>
                        <span className="font-semibold text-green-400">
                          ✓ {memberStats.totalLogged} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-400">Missed</span>
                        <span className="font-semibold text-red-400">
                          ✗ {memberStats.missedDays} days
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
          <h2 className="text-2xl font-bold text-white mb-4">Activity Feed</h2>
          <RoomFeed feedItems={feedData.feedItems} members={members} />
        </div>
      </main>
    </div>
  );
}
