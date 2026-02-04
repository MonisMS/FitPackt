import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();

  // If authenticated, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  // Landing page for non-authenticated users
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md w-full px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Accountability App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Private accountability and execution logging for fitness and habits.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/sign-up"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
