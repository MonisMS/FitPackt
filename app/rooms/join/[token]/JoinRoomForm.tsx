'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinRoom } from './actions';

type Room = {
  id: string;
  name: string;
  durationDays: number;
  deadlineTime: string;
  startDate: Date;
  endDate: Date;
};

export default function JoinRoomForm({
  room,
  userId,
  memberCount,
}: {
  room: Room;
  userId: string;
  memberCount: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const result = await joinRoom(room.id, userId);
      if (result.success) {
        router.push(`/rooms/${room.id}`);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h1 className="text-3xl font-bold mb-2">You've been invited!</h1>
      <p className="text-gray-600 mb-8">
        Join <span className="font-semibold">{room.name}</span> to start tracking together
      </p>

      {/* Room Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-4">Room Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Room Name</span>
            <span className="font-medium">{room.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration</span>
            <span className="font-medium">{room.durationDays} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Daily Deadline</span>
            <span className="font-medium">{room.deadlineTime.slice(0, 5)} IST</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Members</span>
            <span className="font-medium">{memberCount} / 5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Start Date</span>
            <span className="font-medium">
              {new Date(room.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">End Date</span>
            <span className="font-medium">
              {new Date(room.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* What to expect */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-2">What happens when you join?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• You'll need to log daily before {room.deadlineTime.slice(0, 5)} IST</li>
          <li>• All members can see each other's logs</li>
          <li>• Missed days will be visible to everyone</li>
          <li>• You cannot leave once you join</li>
          <li>• Your logs will be saved permanently</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleJoin}
          disabled={loading}
          className="flex-1 bg-black text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition"
        >
          {loading ? 'Joining...' : 'Join Room'}
        </button>
      </div>
    </div>
  );
}
