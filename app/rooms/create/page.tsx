import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import CreateRoomForm from './CreateRoomForm';

export default async function CreateRoomPage() {
  const user = await requireOnboardedUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-8 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Create a Room</h1>
          <p className="text-lg text-neutral-400">
            Start an accountability challenge with 2-5 friends
          </p>
        </div>

        {/* Form */}
        <CreateRoomForm userId={user.id} />
      </div>
    </div>
  );
}
