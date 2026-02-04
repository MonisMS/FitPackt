'use client';

import Image from 'next/image';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Marathon Runner',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    quote: 'The transparency is what makes this work. Knowing my squad sees everything keeps me honest about my nutrition and training.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Software Engineer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    quote: 'I\'ve tried every fitness app out there. This is the only one that actually keeps me consistent. The small group size is perfect.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Personal Trainer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    quote: 'I recommend this to all my clients. The permanent logs and no-edit policy creates real accountability, not fake progress.',
  },
  {
    name: 'David Chen',
    role: 'Entrepreneur',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    quote: 'Lost 30 lbs in 90 days with my accountability squad. The daily check-ins take 2 minutes but make all the difference.',
  },
  {
    name: 'Jessica Williams',
    role: 'Nurse',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    quote: 'Working night shifts made consistency impossible. Now my squad keeps me on track no matter my schedule. Game changer.',
  },
  {
    name: 'Tom Anderson',
    role: 'College Student',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    quote: 'My roommates and I started a 60-day challenge. We all hit our goals. The group pressure works better than any personal trainer.',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-neutral-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Real People, Real Results</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Thousands of people are reaching their fitness goals with accountability squads.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-red-600/30">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-neutral-300 leading-relaxed italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
