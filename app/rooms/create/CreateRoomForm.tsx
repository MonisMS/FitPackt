'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from './actions';
import { Button, Input, Alert } from '@/components/ui';
import { Calendar, Clock, Users, Info, Sparkles } from 'lucide-react';

export default function CreateRoomForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    durationDays: '30',
    deadlineTime: '23:59',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createRoom({
        name: formData.name,
        durationDays: parseInt(formData.durationDays),
        deadlineTime: formData.deadlineTime + ':00',
        creatorId: userId,
      });

      if (result.success) {
        router.push(`/rooms/${result.roomId}/invite`);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
      setLoading(false);
    }
  };

  const durationOptions = [
    { value: '30', label: '30 Days', emoji: '🚀', badge: 'Quick Win', desc: 'Build momentum fast' },
    { value: '60', label: '60 Days', emoji: '💪', badge: 'Habit Builder', desc: 'Solidify your routine' },
    { value: '90', label: '90 Days', emoji: '🏆', badge: 'Transformation', desc: 'See real change' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 lg:p-8 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Room Name */}
        <div className="animate-slide-up">
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-red-600" />
              Room Name <span className="text-red-500">*</span>
            </div>
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., January Fitness Challenge"
            required
            maxLength={100}
            className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Choose a name that describes your goal or timeframe
          </p>
        </div>

        {/* Duration */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <label className="block text-sm font-medium text-neutral-300 mb-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-red-600" />
              Challenge Duration <span className="text-red-500">*</span>
            </div>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, durationDays: option.value })}
                className={`p-5 border-2 rounded-xl text-left transition-all hover:scale-[1.02] ${
                  formData.durationDays === option.value
                    ? 'bg-red-600/20 border-red-600 shadow-lg shadow-red-600/20'
                    : 'bg-neutral-800/50 border-neutral-700 hover:border-red-600/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{option.emoji}</span>
                    <div className="font-semibold text-lg text-white">{option.label}</div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-neutral-700 text-neutral-300">
                    {option.badge}
                  </span>
                </div>
                <div className="text-sm text-neutral-400">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Deadline */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-red-600" />
              Daily Logging Deadline (IST) <span className="text-red-500">*</span>
            </div>
          </label>
          <input
            type="time"
            value={formData.deadlineTime}
            onChange={(e) => setFormData({ ...formData, deadlineTime: e.target.value })}
            className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
            required
          />
          <p className="text-xs text-neutral-500 mt-1">
            ⏰ Members must log before this time each day (Indian Standard Time)
          </p>
        </div>

        {/* Info Alert */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">What happens next?</h4>
                <ul className="text-sm text-neutral-300 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>You'll get a unique invite link to share with friends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Up to 4 more people can join (5 total max)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Room starts when the first person logs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Everyone sees each other's logs - full transparency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Missed days are visible to all for accountability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1 !bg-neutral-800 !border-neutral-700 !text-white hover:!bg-neutral-700"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold"
            disabled={loading || !formData.name.trim()}
            loading={loading}
          >
            {loading ? 'Creating...' : 'Create Room 🚀'}
          </Button>
        </div>
      </div>
    </form>
  );
}
