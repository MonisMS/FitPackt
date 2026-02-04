'use client';

import { PlusCircle, Edit3, Trophy } from 'lucide-react';

const steps = [
  {
    icon: PlusCircle,
    step: 1,
    title: 'Create or Join a Room',
    description:
      'Start a 30, 60, or 90-day challenge. Invite 2-5 friends with a simple code.',
    highlight: 'Takes 30 seconds',
  },
  {
    icon: Edit3,
    step: 2,
    title: 'Log Daily',
    description:
      'Every day, log your food, workout, sleep, and energy. Your group sees it all. No logs = everyone knows.',
    highlight: 'Under 2 minutes',
  },
  {
    icon: Trophy,
    step: 3,
    title: 'Complete the Challenge',
    description:
      'Finish your 30/60/90 days with complete transparency. Review your progress, celebrate wins, start again.',
    highlight: 'Your data forever',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl font-bold text-neutral-950 mb-4">How It Works</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Three simple steps to transform your fitness accountability
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.step}
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Icon & Line */}
                  <div className="flex flex-col items-center">
                    <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center bg-neutral-950 shadow-lg">
                      <Icon size={28} className="text-white" />
                    </div>
                    {!isLast && (
                      <div
                        className="w-0.5 h-full mt-4 bg-gradient-to-b from-neutral-300 to-transparent"
                        style={{ minHeight: '60px' }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-lg shadow-md border border-neutral-200 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-semibold text-neutral-950">{step.title}</h3>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 whitespace-nowrap">
                        {step.highlight}
                      </span>
                    </div>
                    <p className="text-neutral-600">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
