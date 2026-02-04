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
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-900">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Stop Making Excuses?
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            Join others who've committed to real accountability. No gimmicks, no games—just
            honest daily logging with people who care.
          </p>

          {/* Benefits Checklist */}
          <div className="grid sm:grid-cols-2 gap-3 mb-10 text-left max-w-xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle size={20} className="text-red-600 flex-shrink-0" />
                <span className="text-white">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link href="/sign-up">
            <Button variant="accent" size="xl" className="min-w-[250px]">
              Get Started Free
              <ArrowRight size={20} />
            </Button>
          </Link>

          <p className="text-xs text-neutral-500 mt-4">
            Free to use. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
