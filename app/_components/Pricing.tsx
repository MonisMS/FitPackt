'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Check } from 'lucide-react';

const features = [
  'Unlimited accountability rooms',
  'Up to 5 people per room',
  'Unlimited challenge durations',
  'Complete data history forever',
  'Progress tracking & insights',
  'Instant notifications',
  'Mobile & desktop access',
  'Private invite-only rooms',
  'No ads, ever',
  'No hidden fees',
  'No credit card required',
  'Yours to use, forever',
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-neutral-950 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, Honest Pricing</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            No tiers, no upsells, no premium features. Everything you need, completely free, forever.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-red-600 to-orange-500 p-1 rounded-2xl animate-slide-up">
            <div className="bg-neutral-900 rounded-xl p-8 md:p-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Forever Free</h3>
                <div className="flex items-baseline justify-center gap-2 mb-3">
                  <span className="text-6xl font-bold text-white">$0</span>
                  <span className="text-neutral-400 text-lg">/forever</span>
                </div>
                <p className="text-neutral-400">
                  No catch. No strings attached. Just real accountability.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start">
                    <Check size={20} className="text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/sign-up">
                <Button className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-6 text-lg">
                  Get Started Free
                </Button>
              </Link>

              <p className="text-center text-sm text-neutral-500 mt-6">
                No credit card required • No time limit • No hidden fees
              </p>
            </div>
          </div>
        </div>

        {/* Trust Statement */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-neutral-400 leading-relaxed">
            We believe accountability shouldn't cost money. FitChallenge is free because fitness goals
            are hard enough without paywalls. We're committed to keeping it that way.
          </p>
        </div>
      </div>
    </section>
  );
}
