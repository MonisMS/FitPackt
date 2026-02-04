'use client';

import { useState } from 'react';
import { Badge, Card } from '@/components/ui';
import { CheckCircle, XCircle, ChevronDown, ChevronRight, Utensils, Dumbbell, Moon, Brain } from 'lucide-react';

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
      {/* Filter Pills */}
      <div className="flex gap-2 mb-6 animate-slide-up">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
              : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-red-600/50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('logs')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'logs'
              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
              : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-red-600/50'
          }`}
        >
          Logged
        </button>
        <button
          onClick={() => setFilter('missed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'missed'
              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
              : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-red-600/50'
          }`}
        >
          Missed
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 text-center">
            <p className="text-neutral-400">No activity yet. Be the first to log!</p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([dateKey, items], groupIdx) => (
            <div key={dateKey} className="animate-slide-up" style={{ animationDelay: `${groupIdx * 0.05}s` }}>
              {/* Date Header */}
              <div className="sticky top-20 z-10 bg-neutral-950/90 backdrop-blur-sm px-4 py-2 -mx-4 mb-3 rounded-lg border border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-300">{dateKey}</h3>
              </div>
              <div className="space-y-3">
                {items.map((item, idx) => {
                  const itemKey = `${item.userId}-${item.date.toISOString()}-${idx}`;

                  if (item.type === 'missed') {
                    return (
                      <div
                        key={itemKey}
                        className="bg-red-600/10 border-l-4 border-red-600 rounded-xl p-4 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <XCircle size={24} className="text-red-500 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-red-400">{item.userName}</p>
                            <p className="text-sm text-red-300">Missed logging this day</p>
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
                      className="bg-neutral-900/50 border border-neutral-800 border-l-4 border-l-green-500 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors backdrop-blur-sm"
                    >
                      <button
                        onClick={() => setExpandedLog(isExpanded ? null : itemKey)}
                        className="w-full p-4 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">
                              {log.workoutDone ? '💪' : '📝'}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{item.userName}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
                                {log.workoutDone && (
                                  <span className="px-2 py-1 bg-green-600/20 border border-green-600/30 rounded-full text-green-400 flex items-center gap-1">
                                    <Dumbbell size={10} />
                                    {log.workoutType || 'Workout'}
                                  </span>
                                )}
                                <span>Sleep: {log.sleepHours}h</span>
                                <span>•</span>
                                <span>Energy: {log.energyLevel}/5</span>
                              </div>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronDown size={20} className="text-neutral-500" />
                          ) : (
                            <ChevronRight size={20} className="text-neutral-500" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-4 border-t border-neutral-800 pt-4 bg-neutral-950/50 animate-scale-in">
                          {/* Food */}
                          {(log.breakfast || log.lunch || log.eveningSnacks || log.dinner) && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Utensils size={18} className="text-orange-500" />
                                <h4 className="text-sm font-semibold text-white">Food</h4>
                              </div>
                              <div className="space-y-2 text-sm ml-7">
                                {log.breakfast && (
                                  <div>
                                    <span className="text-neutral-400 font-medium">🌅 Breakfast:</span>{' '}
                                    <span className="text-neutral-300">{log.breakfast}</span>
                                  </div>
                                )}
                                {log.lunch && (
                                  <div>
                                    <span className="text-neutral-400 font-medium">🌞 Lunch:</span>{' '}
                                    <span className="text-neutral-300">{log.lunch}</span>
                                  </div>
                                )}
                                {log.eveningSnacks && (
                                  <div>
                                    <span className="text-neutral-400 font-medium">🌆 Evening:</span>{' '}
                                    <span className="text-neutral-300">{log.eveningSnacks}</span>
                                  </div>
                                )}
                                {log.dinner && (
                                  <div>
                                    <span className="text-neutral-400 font-medium">🌙 Dinner:</span>{' '}
                                    <span className="text-neutral-300">{log.dinner}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Workout details */}
                          {log.workoutDone && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Dumbbell size={18} className="text-red-500" />
                                <h4 className="text-sm font-semibold text-white">Workout</h4>
                              </div>
                              <div className="space-y-2 text-sm ml-7">
                                <div>
                                  <span className="text-neutral-400 font-medium">Type:</span>{' '}
                                  <span className="text-neutral-300">{log.workoutType || 'Not specified'}</span>
                                </div>
                                {log.workoutDurationMinutes && (
                                  <div>
                                    <span className="text-neutral-400 font-medium">Duration:</span>{' '}
                                    <span className="text-neutral-300">{log.workoutDurationMinutes} minutes</span>
                                  </div>
                                )}
                                {log.workoutIntensity && (
                                  <div>
                                    <span className="text-neutral-400 font-medium">Intensity:</span>{' '}
                                    <span className="text-neutral-300">{log.workoutIntensity}/5</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Body stats */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Moon size={18} className="text-blue-400" />
                              <h4 className="text-sm font-semibold text-white">Body & Energy</h4>
                            </div>
                            <div className="space-y-2 text-sm ml-7">
                              <div>
                                <span className="text-neutral-400 font-medium">Sleep:</span>{' '}
                                <span className="text-neutral-300">{log.sleepHours} hours</span>
                              </div>
                              <div>
                                <span className="text-neutral-400 font-medium">Energy:</span>{' '}
                                <span className="text-neutral-300">{log.energyLevel}/5</span>
                              </div>
                              {log.weightKg && (
                                <div>
                                  <span className="text-neutral-400 font-medium">Weight:</span>{' '}
                                  <span className="text-neutral-300">{log.weightKg} kg</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Note */}
                          {log.note && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Brain size={18} className="text-purple-400" />
                                <h4 className="text-sm font-semibold text-white">Note</h4>
                              </div>
                              <p className="text-sm text-neutral-300 italic ml-7 bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                                "{log.note}"
                              </p>
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
