import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import OnboardingForm from './OnboardingForm';

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user exists in database
  let user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  // If user doesn't exist in database, create them
  if (!user) {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      redirect('/sign-in');
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return <div>Error: No email found</div>;
    }

    // Create user in database
    await db.insert(users).values({
      id: userId,
      email: email,
      name: clerkUser.firstName && clerkUser.lastName
        ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim()
        : clerkUser.firstName || 'User',
      onboarded: false,
    });

    // Fetch the newly created user
    user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return <div>Error: Failed to create user</div>;
    }
  }

  // If already onboarded, redirect to dashboard
  if (user.onboarded) {
    redirect('/dashboard');
  }

  return <OnboardingForm userId={user.id} />;
}
