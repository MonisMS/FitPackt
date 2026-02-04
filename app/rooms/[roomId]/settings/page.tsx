import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { rooms, roomMemberships } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import Link from 'next/link';
import DeleteRoomButton from './DeleteRoomButton';

export default async function RoomSettingsPage({
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

  // Check if user is the creator
  const membership = await db.query.roomMemberships.findFirst({
    where: and(
      eq(roomMemberships.roomId, roomId),
      eq(roomMemberships.userId, user.id)
    ),
  });

  if (!membership || membership.role !== 'creator') {
    redirect(`/rooms/${roomId}`);
  }

  // Get member count
  const members = await db.query.roomMemberships.findMany({
    where: eq(roomMemberships.roomId, roomId),
    with: {
      user: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/rooms/${roomId}`}
            className="text-sm text-gray-600 hover:text-black mb-4 inline-block"
          >
            ← Back to Room
          </Link>
          <h1 className="text-3xl font-bold mb-2">Room Settings</h1>
          <p className="text-gray-600">{room.name}</p>
        </div>

        {/* Room Info */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Room Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Room Name</span>
              <span className="font-medium">{room.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{room.durationDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Deadline</span>
              <span className="font-medium">{room.deadlineTime.slice(0, 5)} IST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date</span>
              <span className="font-medium">
                {new Date(room.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">End Date</span>
              <span className="font-medium">
                {new Date(room.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Members</span>
              <span className="font-medium">{members.length} / 5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium ${
                room.status === 'active' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </span>
            </div>
          </div>
        </section>

        {/* Members List */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Members</h2>
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
              >
                <span className="font-medium">{member.user.name}</span>
                {member.role === 'creator' && (
                  <span className="text-xs bg-black text-white px-2 py-1 rounded">
                    Creator (You)
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-lg shadow border-2 border-red-200 p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-red-900 mb-2">Delete this room</h3>
            <p className="text-sm text-red-800 mb-3">
              Once you delete a room, there is no going back. This will:
            </p>
            <ul className="text-sm text-red-800 space-y-1 mb-3">
              <li>• Remove the room from all members' dashboards</li>
              <li>• End all accountability tracking</li>
              <li>• Make the room feed inaccessible</li>
              <li>• <strong>Keep all logs in members' personal timelines</strong></li>
            </ul>
            <p className="text-sm text-red-800 font-medium">
              Member data is never deleted - only the room container is removed.
            </p>
          </div>

          <DeleteRoomButton roomId={roomId} roomName={room.name} />
        </section>
      </div>
    </div>
  );
}
