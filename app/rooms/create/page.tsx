import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import CreateRoomForm from './CreateRoomForm';

export default async function CreateRoomPage() {
  const user = await requireOnboardedUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create a Room</h1>
          <p className="text-gray-600">
            Start an accountability room with 2-5 people
          </p>
        </div>
        <CreateRoomForm userId={user.id} />
      </div>
    </div>
  );
}
