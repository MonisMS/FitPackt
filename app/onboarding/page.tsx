import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import OnboardingForm from './OnboardingForm';

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  // If already onboarded, redirect to dashboard
  if (user.onboarded) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <OnboardingForm userId={user.id} />
      </div>
    </div>
  );
}
