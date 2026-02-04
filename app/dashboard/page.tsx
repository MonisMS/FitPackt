import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { getUserRooms, hasLoggedToday, getRoomLogStatus } from './actions';
import RoomCard from './RoomCard';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  if (!user.onboarded) {
    redirect('/onboarding');
  }

  const { activeRooms, endedRooms } = await getUserRooms(user.id);
  const loggedToday = await hasLoggedToday(user.id);

  // Get log status for each active room
  const roomLogStatuses = await Promise.all(
    activeRooms.map(async (room) => ({
      roomId: room.id,
      hasLogged: await getRoomLogStatus(user.id, room.id),
    }))
  );

  const getRoomLogStatus_ = (roomId: string) => {
    return roomLogStatuses.find((s) => s.roomId === roomId)?.hasLogged || false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold hover:text-gray-700">
            Accountability App
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/timeline"
              className="text-sm text-gray-600 hover:text-black font-medium"
            >
              Timeline
            </Link>
            <Link
              href="/settings"
              className="text-sm text-gray-600 hover:text-black font-medium"
            >
              Settings
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-600">Your accountability dashboard</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
          <Link
            href="/rooms/create"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition text-center"
          >
            Create Room
          </Link>
          <Link
            href="/rooms/join"
            className="bg-white text-black border-2 border-black px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition text-center"
          >
            Join Room
          </Link>
          {activeRooms.length > 0 && !loggedToday && (
            <Link
              href="/log"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition text-center"
            >
              Log Today
            </Link>
          )}
        </div>

        {/* Active Rooms */}
        <section className="mb-12">
          <h3 className="text-xl font-bold mb-4">Active Rooms ({activeRooms.length})</h3>
          {activeRooms.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">You're not in any active rooms yet</p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/rooms/create"
                  className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Create a Room
                </Link>
                <Link
                  href="/rooms/join"
                  className="bg-white text-black border-2 border-black px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Join a Room
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  hasLogged={getRoomLogStatus_(room.id)}
                  isActive={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Ended Rooms */}
        {endedRooms.length > 0 && (
          <section>
            <h3 className="text-xl font-bold mb-4">Past Rooms ({endedRooms.length})</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {endedRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  hasLogged={false}
                  isActive={false}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
