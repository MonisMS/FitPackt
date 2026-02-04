'use client';

import { Clock, Users, Eye, Lock, Database, TrendingUp, Calendar, Shield, Bell, Smartphone, Award, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui';

const features = [
  {
    icon: Clock,
    title: 'Quick Daily Logs',
    description: 'Log food, workouts, and sleep in under 2 minutes. No tedious calorie counting or endless forms.',
  },
  {
    icon: Users,
    title: '2-5 Person Groups',
    description: 'Perfect accountability size. Small enough to matter, big enough for support and motivation.',
  },
  {
    icon: Eye,
    title: 'Complete Transparency',
    description: 'Everyone sees everything. When someone misses a log, the whole group knows. No hiding.',
  },
  {
    icon: Lock,
    title: 'Permanent Logs',
    description: 'No editing after submission. Real accountability means no backtracking or cheating.',
  },
  {
    icon: Database,
    title: 'Your Data Forever',
    description: 'We never delete your logs. Your complete fitness history stays with you, always accessible.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Visual insights into weight, energy, and workout trends over time. See your journey unfold.',
  },
  {
    icon: Calendar,
    title: 'Challenge Durations',
    description: 'Choose 30, 60, or 90-day challenges. Finish together, celebrate, then start a new one.',
  },
  {
    icon: Shield,
    title: 'Private Rooms',
    description: 'Invite-only with unique room codes. Your accountability squad stays private and focused.',
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Know exactly when your squad logs or misses a day. Stay connected and accountable.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Works seamlessly on all devices. Log from anywhere, anytime, on any screen size.',
  },
  {
    icon: Award,
    title: 'No Gamification',
    description: 'No points, badges, or streaks. Just honest accountability with people who care about you.',
  },
  {
    icon: RefreshCw,
    title: 'Challenge Complete',
    description: 'Finish challenges together and start fresh. Keep the momentum going with your squad.',
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-neutral-950 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Built for Real Accountability</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
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
                className="bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-6">
                  <div className="p-3 bg-red-600/10 rounded-lg inline-flex mb-4 transition-transform group-hover:scale-110">
                    <Icon size={28} className="text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
