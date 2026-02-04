'use client';

import { useState } from 'react';

export default function CopyInviteLink({ inviteUrl }: { inviteUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={inviteUrl}
        readOnly
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
      />
      <button
        onClick={handleCopy}
        className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition whitespace-nowrap"
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}
