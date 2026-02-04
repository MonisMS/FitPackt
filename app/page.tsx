import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();

  // If authenticated, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  // Redirect to landing page for non-authenticated users
  redirect('/landing');
}
