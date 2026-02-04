'use client';

import { Clock, Users, TrendingUp, Lock, Eye, Database } from 'lucide-react';
import { Card } from '@/components/ui';

const features = [
  {
    icon: Clock,
    title: 'Log in Under 2 Minutes',
    description: 'Quick daily logs that don\'t disrupt your routine. Food, workout, sleep—done.',
  },
  {
    icon: Users,
    title: '2-5 Person Groups',
    description: 'Small enough to matter, big enough for accountability. Perfect group dynamics.',
  },
  {
    icon: TrendingUp,
    title: 'See Your Progress',
    description: 'Track weight, energy, workouts over time. Visual insights into your journey.',
  },
  {
    icon: Lock,
    title: 'Logs Are Final',
    description: 'No editing after submission. Real accountability means no backtracking.',
  },
  {
    icon: Eye,
    title: 'Everyone Sees Everything',
    description: 'Complete transparency. When someone misses a log, the whole group knows.',
  },
  {
    icon: Database,
    title: 'Your Data Forever',
    description: 'We never delete your logs. Your complete fitness history stays with you.',
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-4xl font-bold text-neutral-950 mb-4">Built for Real Accountability</h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          No gimmicks, no gamification. Just the features you need to stay consistent
          with people who care.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              variant="elevated"
              padding="lg"
              interactive
              className="animate-slide-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-3 bg-neutral-100 rounded-lg inline-flex mb-4 transition-transform group-hover:scale-110">
                <Icon size={28} className="text-neutral-950" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-950 mb-2">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
