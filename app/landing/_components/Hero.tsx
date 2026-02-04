'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-red-950/30 border border-red-600/50">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-sm font-medium text-red-400">
              Real accountability, not another tracking app
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Stop Making Excuses.
            <br />
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Start Logging.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
            Daily accountability that actually works. No hiding, no excuses. Log your food,
            workouts, and progress with 2-5 friends who'll see everything.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button variant="accent" size="xl" className="min-w-[200px]">
                Get Started Free
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="xl"
              className="min-w-[200px] !text-white !border-neutral-600 !bg-transparent hover:!bg-white/10"
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

          {/* Social Proof */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 text-white">100%</div>
              <div className="text-xs text-neutral-500">Transparent logs</div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 text-white">2-5</div>
              <div className="text-xs text-neutral-500">Person groups</div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 text-white">Forever</div>
              <div className="text-xs text-neutral-500">Keep your data</div>
            </div>
          </div>
        </div>

        {/* Floating Dashboard Preview */}
        <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in">
          <div className="bg-white/5 backdrop-blur-xl rounded-lg overflow-hidden border border-white/10 shadow-2xl">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
            <div className="aspect-video bg-gradient-to-br from-neutral-900 to-neutral-950 flex items-center justify-center">
              <p className="text-sm text-neutral-500">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 to-transparent" />
    </section>
  );
}
