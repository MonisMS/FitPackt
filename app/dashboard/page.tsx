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
    redirect('/onboarding');
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
    <div className="min-h-screen bg-neutral-950">
      {/* Sticky Header with Blur Backdrop */}
      <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/dashboard" className="text-2xl font-bold text-white hover:opacity-70 transition-opacity">
              FitChallenge
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/timeline"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Timeline
              </Link>
              <Link
                href="/settings"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            {getGreeting()}, {user.name}!
          </h1>
          <p className="text-lg text-neutral-400">
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
            <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/10 hover:border-red-600/50 transition-all duration-200 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-600/10 rounded-lg border border-red-600/20">
                  <PlusCircle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Create Room
                  </h3>
                  <p className="text-sm text-neutral-500">Start a new challenge</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/rooms/join" className="block group">
            <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-500/50 transition-all duration-200 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-600/10 rounded-lg border border-orange-600/20">
                  <Users size={24} className="text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Join Room
                  </h3>
                  <p className="text-sm text-neutral-500">Enter with invite code</p>
                </div>
              </div>
            </div>
          </Link>

          {activeRooms.length > 0 && !loggedToday && (
            <Link href="/log" className="block group">
              <div className="bg-gradient-to-br from-red-600/20 to-orange-500/20 border-2 border-red-600 p-5 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/20 transition-all duration-200 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-600/20 rounded-lg border border-red-600/30">
                    <Edit3 size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Log Today
                    </h3>
                    <p className="text-sm text-red-300">Complete your daily log</p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Active Rooms */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Active Rooms ({activeRooms.length})
          </h2>
          {activeRooms.length === 0 ? (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold text-white mb-3">No Active Rooms Yet</h3>
                <p className="text-neutral-400 mb-6">
                  Create your first accountability room or join an existing one to get started on your fitness journey.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Link href="/rooms/create">
                    <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white">
                      <PlusCircle size={20} />
                      Create a Room
                    </Button>
                  </Link>
                  <Link href="/rooms/join">
                    <Button className="!bg-neutral-800 !border-neutral-700 !text-white hover:!bg-neutral-700">
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
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
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
