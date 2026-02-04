import { redirect } from 'next/navigation';
import { requireOnboardedUser } from '@/lib/auth';
import Link from 'next/link';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const user = await requireOnboardedUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-black mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Update your profile and preferences</p>
        </div>

        <SettingsForm user={user} />
      </div>
    </div>
  );
}
