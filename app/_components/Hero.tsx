'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="Fitness workout"
          fill
          priority
          quality={80}
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/90 to-neutral-950" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32 text-center">
        <div className="max-w-4xl mx-auto animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-red-600/10 border border-red-600/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-sm font-medium text-red-400">
              Real accountability, not another tracking app
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Your Fitness Goals.
            <br />
            Your Squad.
            <br />
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Complete Transparency.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 mb-12 max-w-2xl mx-auto">
            Daily accountability that actually works. No hiding, no excuses. Log your food,
            workouts, and sleep with 2-5 friends who'll see everything.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button variant="accent" size="xl" className="min-w-[200px] bg-red-600 hover:bg-red-700">
                Get Started Free
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="xl"
              className="min-w-[200px] !text-white !border-neutral-600 !bg-neutral-800/50 hover:!bg-neutral-800"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              <Play size={20} />
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1 text-white">100%</div>
              <div className="text-sm text-neutral-400">Transparent</div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1 text-white">2-5</div>
              <div className="text-sm text-neutral-400">Person Groups</div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1 text-white">Forever</div>
              <div className="text-sm text-neutral-400">Free</div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1 text-white">&lt;2min</div>
              <div className="text-sm text-neutral-400">Daily Logs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
