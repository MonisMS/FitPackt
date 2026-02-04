import Link from 'next/link';

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

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{room.name}</h3>
          {isActive && (
            <p className="text-sm text-gray-600 mt-1">
              Day {Math.min(daysPassed + 1, totalDays)} of {totalDays}
            </p>
          )}
        </div>
        {isActive && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            hasLogged
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {hasLogged ? '✓ Logged' : 'Not logged'}
          </span>
        )}
        {!isActive && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Ended
          </span>
        )}
      </div>

      {isActive && (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{daysRemaining} days left</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all"
                style={{ width: `${(daysPassed / totalDays) * 100}%` }}
              />
            </div>
          </div>

          {!hasLogged && (
            <button
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/log?roomId=${room.id}`;
              }}
              className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition text-sm"
            >
              Log Today
            </button>
          )}
        </>
      )}

      {!isActive && (
        <p className="text-sm text-gray-600">
          Ended on {endDate.toLocaleDateString()}
        </p>
      )}
    </Link>
  );
}
