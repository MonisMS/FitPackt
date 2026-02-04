import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { rooms, roomMemberships } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import JoinRoomForm from './JoinRoomForm';

export default async function JoinRoomPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await requireOnboardedUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Find room by invite token
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.inviteToken, token),
  });

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Invite Link</h1>
          <p className="text-gray-600 mb-6">
            This invite link is invalid or has expired.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Check if room is active
  if (room.status !== 'active') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Room Not Active</h1>
          <p className="text-gray-600 mb-6">
            This room has ended and is no longer accepting new members.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Check if user is already a member
  const existingMembership = await db.query.roomMemberships.findFirst({
    where: and(
      eq(roomMemberships.roomId, room.id),
      eq(roomMemberships.userId, user.id)
    ),
  });

  if (existingMembership) {
    redirect(`/rooms/${room.id}`);
  }

  // Check member count
  const memberCount = await db.query.roomMemberships.findMany({
    where: eq(roomMemberships.roomId, room.id),
  });

  if (memberCount.length >= 5) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Room Full</h1>
          <p className="text-gray-600 mb-6">
            This room already has 5 members and cannot accept more.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <JoinRoomForm room={room} userId={user.id} memberCount={memberCount.length} />
      </div>
    </div>
  );
}
