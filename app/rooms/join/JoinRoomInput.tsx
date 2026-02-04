'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Alert } from '@/components/ui';
import { Link2, HelpCircle } from 'lucide-react';

export default function JoinRoomInput() {
  const router = useRouter();
  const [inviteLink, setInviteLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = new URL(inviteLink);
      const pathParts = url.pathname.split('/');
      const token = pathParts[pathParts.length - 1];

      if (!token) {
        setError('Invalid invite link format');
        return;
      }

      router.push(`/rooms/join/${token}`);
    } catch (err) {
      setError('Please enter a valid URL');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 lg:p-8">
      <div className="space-y-6">
        <div className="animate-slide-up">
          <Input
            label="Invite Link"
            type="text"
            value={inviteLink}
            onChange={(e) => {
              setInviteLink(e.target.value);
              setError('');
            }}
            placeholder="https://example.com/rooms/join/abc123..."
            required
            error={error}
            helperText={!error ? "Paste the invite link you received from a room creator" : undefined}
            leftIcon={<Link2 size={18} />}
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Alert variant="info">
            <div className="flex items-start gap-2">
              <HelpCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Don't have an invite link?</h4>
                <p className="text-sm">
                  Ask a friend who created a room to share their invite link with you, or create your own room.
                </p>
              </div>
            </div>
          </Alert>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={!inviteLink.trim()}
          >
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
}
