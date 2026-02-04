'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom } from './actions';

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
        deadlineTime: formData.deadlineTime + ':00', // Add seconds
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

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        {/* Room Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., January Fitness Challenge"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
            maxLength={100}
          />
          <p className="text-sm text-gray-500 mt-1">
            Choose a name that describes your goal or timeframe
          </p>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '30', label: '30 Days', desc: '1 month' },
              { value: '60', label: '60 Days', desc: '2 months' },
              { value: '90', label: '90 Days', desc: '3 months' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, durationDays: option.value })}
                className={`p-4 border-2 rounded-lg text-center hover:border-black transition ${
                  formData.durationDays === option.value
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300'
                }`}
              >
                <div className="font-semibold">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Logging Deadline (IST) <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={formData.deadlineTime}
            onChange={(e) => setFormData({ ...formData, deadlineTime: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Members must log before this time each day (Indian Standard Time)
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You'll get a unique invite link to share</li>
            <li>• Up to 4 more people can join (5 total)</li>
            <li>• Room starts when first person logs</li>
            <li>• Everyone can see each other's logs</li>
            <li>• Missed days are visible to all</li>
          </ul>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.name.trim()}
            className="flex-1 bg-black text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition"
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      </div>
    </form>
  );
}
