'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

interface CelebrationProps {
  onComplete: () => void;
}

export function Celebration({ onComplete }: CelebrationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Fire confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        setTimeout(() => {
          setShow(false);
          onComplete();
        }, 500);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm animate-fade-in">
      <div className="text-center animate-scale-in">
        <div className="inline-flex items-center justify-center w-32 h-32 mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full animate-pulse">
          <Sparkles size={64} className="text-white" />
        </div>
        <h2 className="text-5xl font-bold text-white mb-4 animate-slide-up">
          Welcome Aboard! 🎉
        </h2>
        <p className="text-xl text-neutral-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Let's see your fitness profile...
        </p>
      </div>
    </div>
  );
}
