'use client';

import { UserPlus, Calendar, CheckCircle, BarChart } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create Your Room',
    description: 'Set up a private accountability room with a unique code. Choose your challenge duration: 30, 60, or 90 days.',
  },
  {
    icon: Calendar,
    number: '02',
    title: 'Invite 1-4 Friends',
    description: 'Share your room code with 1-4 trusted friends. Small groups create the strongest accountability.',
  },
  {
    icon: CheckCircle,
    number: '03',
    title: 'Log Daily Together',
    description: 'Everyone logs food, workouts, and sleep daily. Takes under 2 minutes. Everyone sees everything—no hiding.',
  },
  {
    icon: BarChart,
    number: '04',
    title: 'Track & Complete',
    description: 'Watch your progress unfold. See who\'s consistent. Finish the challenge together and start a new one.',
  },
];

export default function HowRoomsWork() {
  return (
    <section id="how-it-works" className="bg-neutral-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How Rooms Work</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Simple, powerful accountability in four steps. No complex setup, no confusion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Connection Line (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-red-600/50 to-transparent -z-10" />
                )}

                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-500 rounded-full opacity-10 blur-xl" />
                    <div className="relative bg-neutral-800 border-2 border-red-600/30 rounded-full w-full h-full flex items-center justify-center">
                      <Icon size={40} className="text-red-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center border-4 border-neutral-900">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
