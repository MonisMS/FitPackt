'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Badge, Button } from '@/components/ui';
import { Filter, X, ChevronDown, ChevronRight } from 'lucide-react';

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
      <Card variant="elevated" padding="md" className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-neutral-600" />
          <h3 className="text-lg font-semibold text-neutral-950">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Room</label>
            <select
              value={localFilters.roomId}
              onChange={(e) => setLocalFilters({ ...localFilters, roomId: e.target.value })}
              className="w-full px-4 py-2.5 bg-white text-neutral-950 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all"
            >
              <option value="">All Rooms</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">From Date</label>
            <input
              type="date"
              value={localFilters.from}
              onChange={(e) => setLocalFilters({ ...localFilters, from: e.target.value })}
              className="w-full px-4 py-2.5 bg-white text-neutral-950 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">To Date</label>
            <input
              type="date"
              value={localFilters.to}
              onChange={(e) => setLocalFilters({ ...localFilters, to: e.target.value })}
              className="w-full px-4 py-2.5 bg-white text-neutral-950 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
          {hasFilters && (
            <Button variant="secondary" onClick={clearFilters}>
              <X size={18} />
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.keys(groupedLogs).length === 0 ? (
          <Card variant="elevated" padding="lg" className="text-center">
            <p className="text-neutral-600">No logs found</p>
          </Card>
        ) : (
          Object.entries(groupedLogs).map(([monthKey, monthLogs]) => (
            <div key={monthKey}>
              <h2 className="text-2xl font-bold text-neutral-950 mb-4">{monthKey}</h2>
              <div className="space-y-3">
                {monthLogs.map((log) => {
                  const isExpanded = expandedLog === log.id;
                  return (
                    <Card key={log.id} variant="elevated" padding="none" interactive className="overflow-hidden">
                      <button
                        onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                        className="w-full p-4 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{log.workoutDone ? '💪' : '📝'}</div>
                            <div>
                              <p className="font-semibold text-neutral-950">
                                {new Date(log.logDate).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {log.room && (
                                  <Badge variant="neutral" size="sm">{log.room.name}</Badge>
                                )}
                                {log.workoutDone && (
                                  <Badge variant="success" size="sm">Workout</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronDown size={20} className="text-neutral-400" />
                          ) : (
                            <ChevronRight size={20} className="text-neutral-400" />
                          )}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-3 border-t border-neutral-200 pt-4 bg-neutral-50">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-neutral-600 font-medium">Sleep:</span>{' '}
                              <span className="text-neutral-950">{log.sleepHours}h</span>
                            </div>
                            <div>
                              <span className="text-neutral-600 font-medium">Energy:</span>{' '}
                              <span className="text-neutral-950">{log.energyLevel}/5</span>
                            </div>
                            {log.weightKg && (
                              <div>
                                <span className="text-neutral-600 font-medium">Weight:</span>{' '}
                                <span className="text-neutral-950">{log.weightKg} kg</span>
                              </div>
                            )}
                          </div>
                          {log.note && (
                            <div className="bg-white p-3 rounded-lg border border-neutral-200">
                              <p className="text-sm italic text-neutral-700">{log.note}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
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
