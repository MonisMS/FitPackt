'use client';

import { Calendar, Users, TrendingUp } from 'lucide-react';

const screenshots = [
  {
    icon: Calendar,
    title: 'Daily Log Interface',
    description: 'Simple form to log food, workouts, and sleep in under 2 minutes. No endless fields or calorie counting.',
    features: ['Quick text inputs', 'Optional details', 'Submit once, no edits'],
  },
  {
    icon: Users,
    title: 'Room Feed View',
    description: 'See everyone\'s daily logs in real-time. Complete transparency keeps the entire group accountable.',
    features: ['Live activity feed', 'See who logged', 'Track missing days'],
  },
  {
    icon: TrendingUp,
    title: 'Progress Dashboard',
    description: 'Visual insights into your journey. Track weight, energy, and workout trends over the challenge duration.',
    features: ['Weight tracking', 'Energy levels', 'Workout frequency'],
  },
];

export default function Screenshots() {
  return (
    <section id="screenshots" className="bg-neutral-950 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Clean, Simple Interface</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            No clutter, no confusion. Everything you need to stay accountable, nothing you don't.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {screenshots.map((screen, index) => {
            const Icon = screen.icon;
            return (
              <div
                key={screen.title}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Screenshot Placeholder */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden mb-6 group hover:border-neutral-700 transition-colors">
                  <div className="p-3 bg-neutral-800 border-b border-neutral-700">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="aspect-[4/3] bg-gradient-to-br from-neutral-900 to-neutral-950 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-orange-500/5" />
                    <Icon size={64} className="text-neutral-800 relative z-10" />
                  </div>
                </div>

                {/* Description */}
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-semibold text-white mb-3">{screen.title}</h3>
                  <p className="text-neutral-400 mb-4 leading-relaxed">{screen.description}</p>
                  <ul className="space-y-2">
                    {screen.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-neutral-500">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
