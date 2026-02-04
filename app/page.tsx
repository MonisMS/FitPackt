import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from './_components/Navigation';
import Hero from './_components/Hero';
import Features from './_components/Features';
import HowRoomsWork from './_components/HowRoomsWork';
import Screenshots from './_components/Screenshots';
import Testimonials from './_components/Testimonials';
import Pricing from './_components/Pricing';
import FAQ from './_components/FAQ';
import FinalCTA from './_components/FinalCTA';
import Footer from './_components/Footer';

export const metadata = {
  title: 'FitChallenge - Real Accountability for Your Fitness Goals',
  description: 'Create private accountability rooms with 2-5 friends. Log daily food, workouts, and sleep in under 2 minutes.',
};

export default async function Home() {
  const { userId } = await auth();

  // If authenticated, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  // Show landing page for non-authenticated users
  return (
    <main className="min-h-screen bg-neutral-950">
      <Navigation />
      <Hero />
      <Features />
      <HowRoomsWork />
      <Screenshots />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
