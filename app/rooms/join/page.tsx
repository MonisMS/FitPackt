import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import JoinRoomInput from './JoinRoomInput';

export default async function JoinRoomEntryPage() {
  const user = await requireOnboardedUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Join a Room</h1>
          <p className="text-gray-600">
            Enter an invite link to join an accountability room
          </p>
        </div>
        <JoinRoomInput />
      </div>
    </div>
  );
}
