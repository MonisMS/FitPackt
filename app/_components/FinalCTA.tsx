'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { ArrowRight, CheckCircle } from 'lucide-react';

const benefits = [
  'No subscriptions or hidden fees',
  'Start logging in under 5 minutes',
  'Works on all devices',
  'Your data stays yours forever',
];

export default function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-neutral-950">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-orange-500/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Stop Making Excuses?
          </h2>
          <p className="text-lg text-neutral-300 mb-8">
            Join thousands who've committed to real accountability. No gimmicks, no games—just
            honest daily logging with people who care.
          </p>

          {/* Benefits Checklist */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left max-w-xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle size={20} className="text-red-600 flex-shrink-0" />
                <span className="text-neutral-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link href="/sign-up">
            <Button className="min-w-[250px] bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-6 px-8 text-lg">
              Get Started Free
              <ArrowRight size={20} />
            </Button>
          </Link>

          <p className="text-sm text-neutral-500 mt-6">
            Free forever. No credit card required. No catch.
          </p>
        </div>
      </div>
    </section>
  );
}
