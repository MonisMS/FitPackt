'use client';

import { useState } from 'react';

type FeedItem = {
  type: 'log' | 'missed';
  date: Date;
  userId: string;
  userName: string;
  log?: any;
};

type Member = {
  userId: string;
  user: {
    name: string;
  };
};

export default function RoomFeed({
  feedItems,
  members,
}: {
  feedItems: FeedItem[];
  members: any[];
}) {
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'logs' | 'missed'>('all');

  const filteredItems = feedItems.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'logs') return item.type === 'log';
    if (filter === 'missed') return item.type === 'missed';
    return true;
  });

  // Group by date
  const groupedItems: Record<string, FeedItem[]> = {};
  filteredItems.forEach((item) => {
    const dateKey = new Date(item.date).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    if (!groupedItems[dateKey]) {
      groupedItems[dateKey] = [];
    }
    groupedItems[dateKey].push(item);
  });

  return (
    <div>
      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-black text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('logs')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'logs'
              ? 'bg-black text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Logged
        </button>
        <button
          onClick={() => setFilter('missed')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'missed'
              ? 'bg-black text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Missed
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No activity yet</p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([dateKey, items]) => (
            <div key={dateKey}>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">{dateKey}</h3>
              <div className="space-y-3">
                {items.map((item, idx) => {
                  const itemKey = `${item.userId}-${item.date.toISOString()}-${idx}`;

                  if (item.type === 'missed') {
                    return (
                      <div
                        key={itemKey}
                        className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">✗</span>
                          <div>
                            <p className="font-semibold text-red-900">
                              {item.userName}
                            </p>
                            <p className="text-sm text-red-700">Missed logging this day</p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Log item
                  const log = item.log;
                  const isExpanded = expandedLog === itemKey;

                  return (
                    <div
                      key={itemKey}
                      className="bg-white rounded-lg shadow hover:shadow-md transition"
                    >
                      <button
                        onClick={() =>
                          setExpandedLog(isExpanded ? null : itemKey)
                        }
                        className="w-full p-4 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {log.workoutDone ? '💪' : '📝'}
                            </span>
                            <div>
                              <p className="font-semibold">{item.userName}</p>
                              <p className="text-sm text-gray-600">
                                {log.workoutDone
                                  ? `Worked out • ${log.workoutType || 'Unknown'}`
                                  : 'No workout'}
                                {' • '}
                                Sleep: {log.sleepHours}h
                                {' • '}
                                Energy: {log.energyLevel}/5
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

                          {/* Workout details */}
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

                          {/* Body stats */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Body & Energy</h4>
                            <div className="space-y-1 text-sm">
                              <div>
                                <span className="text-gray-600">Sleep:</span> {log.sleepHours}{' '}
                                hours
                              </div>
                              <div>
                                <span className="text-gray-600">Energy:</span>{' '}
                                {log.energyLevel}/5
                              </div>
                              {log.weightKg && (
                                <div>
                                  <span className="text-gray-600">Weight:</span> {log.weightKg}{' '}
                                  kg
                                </div>
                              )}
                            </div>
                          </div>

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
