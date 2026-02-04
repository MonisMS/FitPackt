'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinRoomInput() {
  const router = useRouter();
  const [inviteLink, setInviteLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Extract token from URL
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invite Link
          </label>
          <input
            type="text"
            value={inviteLink}
            onChange={(e) => {
              setInviteLink(e.target.value);
              setError('');
            }}
            placeholder="https://example.com/rooms/join/abc123..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <p className="text-sm text-gray-500 mt-2">
            Paste the invite link you received from a room creator
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Don't have an invite link?</h4>
          <p className="text-sm text-gray-600">
            Ask a friend who created a room to share their invite link with you, or create your own room.
          </p>
        </div>

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
            disabled={!inviteLink.trim()}
            className="flex-1 bg-black text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </form>
  );
}
