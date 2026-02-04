import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { getUserRooms, hasLoggedToday, getRoomLogStatus } from './actions';
import RoomCard from './RoomCard';
import { Button } from '@/components/ui';
import { PlusCircle, Users, Edit3 } from 'lucide-react';

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

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sticky Header with Blur Backdrop */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/dashboard" className="text-2xl font-bold text-neutral-950 hover:opacity-70 transition-opacity">
              FitChallenge
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/timeline"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                Timeline
              </Link>
              <Link
                href="/settings"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                Settings
              </Link>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Personalized Welcome */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-950 mb-2 tracking-tight">
            {getGreeting()}, {user.name}!
          </h1>
          <p className="text-lg text-neutral-600">
            {activeRooms.length === 0
              ? "Ready to start your accountability journey?"
              : loggedToday
                ? "Great job staying accountable today! 🎯"
                : "Time to log your progress for today"}
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <Link href="/rooms/create" className="block group">
            <div className="bg-white p-5 rounded-lg border border-neutral-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-150 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <PlusCircle size={24} className="text-neutral-950" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-950 mb-1">
                    Create Room
                  </h3>
                  <p className="text-xs text-neutral-500">Start a new challenge</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/rooms/join" className="block group">
            <div className="bg-white p-5 rounded-lg border border-neutral-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-150 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <Users size={24} className="text-neutral-950" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-950 mb-1">
                    Join Room
                  </h3>
                  <p className="text-xs text-neutral-500">Enter with invite code</p>
                </div>
              </div>
            </div>
          </Link>

          {activeRooms.length > 0 && !loggedToday && (
            <Link href="/log" className="block group">
              <div className="bg-red-50 p-5 rounded-lg border-2 border-red-600 hover:-translate-y-1 hover:shadow-lg transition-all duration-150 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Edit3 size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-900 mb-1">
                      Log Today
                    </h3>
                    <p className="text-xs text-red-700">Complete your daily log</p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Active Rooms */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-950 mb-6">
            Active Rooms ({activeRooms.length})
          </h2>
          {activeRooms.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold text-neutral-950 mb-3">No Active Rooms Yet</h3>
                <p className="text-neutral-600 mb-6">
                  Create your first accountability room or join an existing one to get started on your fitness journey.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Link href="/rooms/create">
                    <Button variant="primary" size="lg">
                      <PlusCircle size={20} />
                      Create a Room
                    </Button>
                  </Link>
                  <Link href="/rooms/join">
                    <Button variant="secondary" size="lg">
                      <Users size={20} />
                      Join a Room
                    </Button>
                  </Link>
                </div>
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
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-950 mb-6">
              Past Rooms ({endedRooms.length})
            </h2>
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
