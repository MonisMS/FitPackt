'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinRoom } from './actions';
import { Button, Card, Alert, Badge } from '@/components/ui';
import { Users, Calendar, Clock, UserPlus, AlertCircle } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
      <div className="animate-slide-up">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-950 mb-2">You've been invited!</h1>
        <p className="text-neutral-600 mb-8">
          Join <span className="font-semibold text-neutral-950">{room.name}</span> to start tracking together
        </p>
      </div>

      {/* Room Details Card */}
      <Card variant="default" padding="lg" className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-950">Room Details</h3>
          <Badge variant="neutral">
            <Users size={14} />
            {memberCount} / 5 members
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <span className="text-sm text-neutral-600">Duration</span>
            <span className="text-sm font-medium text-neutral-950 flex items-center gap-1">
              <Calendar size={14} />
              {room.durationDays} days
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <span className="text-sm text-neutral-600">Daily Deadline</span>
            <span className="text-sm font-medium text-neutral-950 flex items-center gap-1">
              <Clock size={14} />
              {room.deadlineTime.slice(0, 5)} IST
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <span className="text-sm text-neutral-600">Start Date</span>
            <span className="text-sm font-medium text-neutral-950">
              {new Date(room.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-neutral-600">End Date</span>
            <span className="text-sm font-medium text-neutral-950">
              {new Date(room.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Commitment Alert */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Alert variant="warning" title="Commitment Required">
          <ul className="text-sm space-y-1.5 mt-2">
            <li className="flex items-start gap-2">
              <span className="text-neutral-500">•</span>
              <span>Log daily before {room.deadlineTime.slice(0, 5)} IST</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-500">•</span>
              <span>All members can see each other's logs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-500">•</span>
              <span>Missed days will be visible to everyone</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-500">•</span>
              <span>You cannot leave once you join</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-500">•</span>
              <span>Your logs will be saved permanently</span>
            </li>
          </ul>
        </Alert>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={() => router.push('/dashboard')}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={handleJoin}
          disabled={loading}
          loading={loading}
        >
          <UserPlus size={20} />
          Join Room
        </Button>
      </div>
    </div>
  );
}
