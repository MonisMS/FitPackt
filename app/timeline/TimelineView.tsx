'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Log = {
  id: string;
  logDate: Date;
  breakfast: string | null;
  lunch: string | null;
  eveningSnacks: string | null;
  dinner: string | null;
  workoutDone: boolean;
  workoutType: string | null;
  workoutDurationMinutes: number | null;
  workoutIntensity: number | null;
  sleepHours: string;
  energyLevel: number;
  weightKg: string | null;
  note: string | null;
  room: {
    id: string;
    name: string;
  } | null;
};

type Room = {
  id: string;
  name: string;
};

export default function TimelineView({
  logs,
  rooms,
  filters,
}: {
  logs: Log[];
  rooms: Room[];
  filters: { roomId?: string; from?: string; to?: string };
}) {
  const router = useRouter();
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [localFilters, setLocalFilters] = useState({
    roomId: filters.roomId || '',
    from: filters.from || '',
    to: filters.to || '',
  });

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (localFilters.roomId) params.set('roomId', localFilters.roomId);
    if (localFilters.from) params.set('from', localFilters.from);
    if (localFilters.to) params.set('to', localFilters.to);

    router.push(`/timeline?${params.toString()}`);
  };

  const clearFilters = () => {
    setLocalFilters({ roomId: '', from: '', to: '' });
    router.push('/timeline');
  };

  const hasFilters = filters.roomId || filters.from || filters.to;

  // Group logs by month
  const groupedLogs: Record<string, Log[]> = {};
  logs.forEach((log) => {
    const monthKey = new Date(log.logDate).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
    });
    if (!groupedLogs[monthKey]) {
      groupedLogs[monthKey] = [];
    }
    groupedLogs[monthKey].push(log);
  });

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="font-semibold mb-4">Filters</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room
            </label>
            <select
              value={localFilters.roomId}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, roomId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All rooms</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input
              type="date"
              value={localFilters.from}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, from: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="date"
              value={localFilters.to}
              onChange={(e) => setLocalFilters({ ...localFilters, to: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={applyFilters}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Apply Filters
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.keys(groupedLogs).length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No logs found</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-black underline hover:no-underline"
              >
                Clear filters to see all logs
              </button>
            )}
          </div>
        ) : (
          Object.entries(groupedLogs).map(([monthKey, monthLogs]) => (
            <div key={monthKey}>
              <h3 className="text-lg font-bold text-gray-700 mb-4">{monthKey}</h3>
              <div className="space-y-3">
                {monthLogs.map((log) => {
                  const isExpanded = expandedLog === log.id;

                  return (
                    <div
                      key={log.id}
                      className="bg-white rounded-lg shadow hover:shadow-md transition"
                    >
                      <button
                        onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                        className="w-full p-4 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold">
                                {new Date(log.logDate).getDate()}
                              </div>
                              <div className="text-xs text-gray-600">
                                {new Date(log.logDate).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                })}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">
                                  {log.workoutDone ? '💪' : '📝'}
                                </span>
                                {log.room && (
                                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                    {log.room.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {log.workoutDone
                                  ? `${log.workoutType || 'Workout'}`
                                  : 'Rest day'}
                                {' • '}
                                Sleep: {log.sleepHours}h
                                {' • '}
                                Energy: {log.energyLevel}/5
                                {log.weightKg && ` • Weight: ${log.weightKg}kg`}
                              </p>
                            </div>
                          </div>
                          <span className="text-gray-400">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-4 border-t pt-4">
                          {/* Food */}
                          {(log.breakfast || log.lunch || log.eveningSnacks || log.dinner) && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Food</h4>
                              <div className="space-y-2 text-sm">
                                {log.breakfast && (
                                  <div>
                                    <span className="text-gray-600">Breakfast:</span>{' '}
                                    {log.breakfast}
                                  </div>
                                )}
                                {log.lunch && (
                                  <div>
                                    <span className="text-gray-600">Lunch:</span> {log.lunch}
                                  </div>
                                )}
                                {log.eveningSnacks && (
                                  <div>
                                    <span className="text-gray-600">Evening:</span>{' '}
                                    {log.eveningSnacks}
                                  </div>
                                )}
                                {log.dinner && (
                                  <div>
                                    <span className="text-gray-600">Dinner:</span> {log.dinner}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Workout */}
                          {log.workoutDone && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Workout</h4>
                              <div className="space-y-1 text-sm">
                                <div>
                                  <span className="text-gray-600">Type:</span>{' '}
                                  {log.workoutType || 'Not specified'}
                                </div>
                                {log.workoutDurationMinutes && (
                                  <div>
                                    <span className="text-gray-600">Duration:</span>{' '}
                                    {log.workoutDurationMinutes} minutes
                                  </div>
                                )}
                                {log.workoutIntensity && (
                                  <div>
                                    <span className="text-gray-600">Intensity:</span>{' '}
                                    {log.workoutIntensity}/5
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Note */}
                          {log.note && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Note</h4>
                              <p className="text-sm text-gray-700 italic">{log.note}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
