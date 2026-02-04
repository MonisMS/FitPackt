import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { rooms, roomMemberships } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import Link from 'next/link';
import CopyInviteLink from './CopyInviteLink';

export default async function InvitePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const user = await requireOnboardedUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Get room
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
  });

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

  // Get member count
  const members = await db.query.roomMemberships.findMany({
    where: eq(roomMemberships.roomId, roomId),
    with: {
      user: true,
    },
  });

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/rooms/join/${room.inviteToken}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Room Created!</h1>
            <p className="text-gray-600">
              Invite your friends to join <span className="font-semibold">{room.name}</span>
            </p>
          </div>

          {/* Room Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{room.durationDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Deadline</span>
                <span className="font-medium">{room.deadlineTime.slice(0, 5)} IST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Members</span>
                <span className="font-medium">{members.length} / 5</span>
              </div>
            </div>
          </div>

          {/* Invite Link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share this invite link
            </label>
            <CopyInviteLink inviteUrl={inviteUrl} />
            <p className="text-sm text-gray-500 mt-2">
              Anyone with this link can join (up to 5 people total)
            </p>
          </div>

          {/* Current Members */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Current Members ({members.length})
            </h3>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                >
                  <span className="font-medium">{member.user.name}</span>
                  {member.role === 'creator' && (
                    <span className="text-xs bg-black text-white px-2 py-1 rounded">
                      Creator
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/rooms/${roomId}`}
              className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition text-center"
            >
              Go to Room
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
