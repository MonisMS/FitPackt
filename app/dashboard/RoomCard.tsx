'use client';

import Link from 'next/link';
import { CircularProgress, Badge } from '@/components/ui';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

type Room = {
  id: string;
  name: string;
  durationDays: number;
  startDate: Date;
  endDate: Date;
  status: string;
};

type RoomCardProps = {
  room: Room;
  hasLogged: boolean;
  isActive: boolean;
};

export default function RoomCard({ room, hasLogged, isActive }: RoomCardProps) {
  const startDate = new Date(room.startDate);
  const endDate = new Date(room.endDate);
  const today = new Date();

  const totalDays = room.durationDays;
  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Color-coded left border
  const getBorderColor = () => {
    if (!isActive) return 'border-neutral-700';
    if (hasLogged) return 'border-green-500';
    return 'border-red-600';
  };

  return (
    <Link href={`/rooms/${room.id}`} className="block group">
      <div
        className={`bg-neutral-900/50 backdrop-blur-sm rounded-xl border-l-4 border-r border-t border-b border-neutral-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-600/10 transition-all duration-200 p-6 h-full ${getBorderColor()}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-1">{room.name}</h3>
            {isActive && (
              <p className="text-sm text-neutral-400 flex items-center gap-1">
                <Calendar size={14} />
                Day {Math.min(daysPassed + 1, totalDays)} of {totalDays}
              </p>
            )}
          </div>
          {isActive && (
            <Badge variant={hasLogged ? 'success' : 'error'} dot>
              {hasLogged ? 'Logged' : 'Not Logged'}
            </Badge>
          )}
          {!isActive && <Badge variant="neutral">Ended</Badge>}
        </div>

        {isActive && (
          <>
            <div className="flex items-center gap-4 mb-4">
              <CircularProgress
                value={daysPassed}
                max={totalDays}
                size={60}
                strokeWidth={6}
                variant={hasLogged ? 'success' : 'default'}
                showLabel={true}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-white mb-1">Progress</p>
                <p className="text-sm text-neutral-400">{daysRemaining} days remaining</p>
              </div>
            </div>

            {!hasLogged && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/log?roomId=${room.id}`;
                }}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <XCircle size={16} />
                Log Today
              </button>
            )}

            {hasLogged && (
              <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-green-600/20 border border-green-600/30 text-green-400">
                <CheckCircle size={16} />
                <span className="text-sm font-semibold">Logged for today ✓</span>
              </div>
            )}
          </>
        )}

        {!isActive && (
          <p className="text-sm text-neutral-400 flex items-center gap-1">
            <Calendar size={14} />
            Ended on {endDate.toLocaleDateString()}
          </p>
        )}
      </div>
    </Link>
  );
}
