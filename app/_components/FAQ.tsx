'use client';

import { Accordion, AccordionItemData } from '@/components/ui';

const faqItems: AccordionItemData[] = [
  {
    id: '1',
    question: 'How does accountability actually work?',
    answer: 'Everyone in your room sees everything. When you log your food, workouts, and sleep, your entire squad sees it. When you miss a day, everyone knows. This transparency creates social pressure to stay consistent—the same reason you wouldn\'t skip a gym session with a friend.',
  },
  {
    id: '2',
    question: 'What exactly do I log each day?',
    answer: 'Three simple things: (1) What you ate today, (2) What workout you did (if any), and (3) How much sleep you got. It\'s intentionally simple—just text descriptions, no calorie counting or macro tracking. Takes under 2 minutes.',
  },
  {
    id: '3',
    question: 'Why can\'t I edit logs after submitting?',
    answer: 'Real accountability means no backtracking. Once you submit a log, it\'s permanent. This prevents the temptation to "fix" your log later or rewrite history. Your squad sees your actual journey, not a curated version.',
  },
  {
    id: '4',
    question: 'What happens if I miss a day?',
    answer: 'Nothing punitive happens—your room doesn\'t close or anything. But everyone in your squad sees the gap in your logs. That social accountability is the point. The transparency keeps you honest and consistent.',
  },
  {
    id: '5',
    question: 'Can I create multiple rooms?',
    answer: 'Yes! You can be in multiple accountability rooms at once. Maybe one with gym buddies, another with family. Each room is independent with its own challenge duration and members.',
  },
  {
    id: '6',
    question: 'How do I create a room?',
    answer: 'Sign up, click "Create Room," choose your challenge duration (30, 60, or 90 days), and you\'ll get a unique room code. Share that code with 1-4 friends to invite them. They sign up and enter your code to join.',
  },
  {
    id: '7',
    question: 'What if someone quits mid-challenge?',
    answer: 'Their logs stay visible but they stop adding new ones. The rest of the group continues. You can always start a new room with different people if your squad changes.',
  },
  {
    id: '8',
    question: 'Is my data private from people outside my room?',
    answer: 'Absolutely. Each room is completely private and invite-only. Only people with your unique room code can join. Your logs are only visible to people in your rooms—nobody else.',
  },
  {
    id: '9',
    question: 'Can I delete my data?',
    answer: 'You can delete your account and all your data anytime. But within a challenge, logs are permanent (no editing) to maintain accountability. When the challenge ends, you own that data forever.',
  },
  {
    id: '10',
    question: 'Why is the group size limited to 2-5 people?',
    answer: 'Research shows small groups create the strongest accountability. With 2-5 people, everyone matters. Nobody can hide. Larger groups lead to diffusion of responsibility—"someone else will check on them." Small squads work.',
  },
  {
    id: '11',
    question: 'Do I need to pay eventually?',
    answer: 'No. FitChallenge is completely free, forever. No premium tiers, no locked features, no trials. We believe accountability shouldn\'t cost money. What you see is what you get, permanently.',
  },
  {
    id: '12',
    question: 'What happens when a challenge ends?',
    answer: 'You keep all your data and can review your complete log history. You can start a new challenge with the same group or create a fresh room. Many squads do back-to-back challenges to maintain momentum.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-neutral-900 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-neutral-400">
            Everything you need to know about how FitChallenge works.
          </p>
        </div>

        <Accordion items={faqItems} allowMultiple={false} />
      </div>
    </section>
  );
}
