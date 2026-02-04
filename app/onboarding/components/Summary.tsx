'use client';

import { Button } from '@/components/ui';
import { TrendingUp, Activity, Target, Zap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SummaryProps {
  data: {
    name: string;
    heightCm: number;
    weightKg: number;
    activityLevel: string;
    sleepHours: number;
    workoutFrequency: string;
    fitnessGoal: string;
  };
}

function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function getBMICategory(bmi: number): { label: string; color: string; emoji: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400', emoji: '📉' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-400', emoji: '✅' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-400', emoji: '⚠️' };
  return { label: 'Obese', color: 'text-red-400', emoji: '🔴' };
}

function getGoalLabel(goal: string): string {
  const goals: Record<string, string> = {
    lose_weight: 'Lose Weight',
    build_muscle: 'Build Muscle',
    maintain: 'Maintain Weight',
    improve_fitness: 'Improve Fitness',
    general_health: 'General Health'
  };
  return goals[goal] || goal;
}

function getActivityLabel(level: string): string {
  const levels: Record<string, string> = {
    sedentary: 'Sedentary',
    lightly_active: 'Lightly Active',
    moderately_active: 'Moderately Active',
    very_active: 'Very Active',
    athlete: 'Athlete'
  };
  return levels[level] || level;
}

function getBasicInsights(bmi: number, goal: string, activityLevel: string): string[] {
  const insights: string[] = [];
  const bmiCat = getBMICategory(bmi);

  // BMI-based insights
  if (goal === 'lose_weight' && bmi >= 25) {
    insights.push('Your goal aligns with your current BMI. Focus on calorie deficit and consistent workouts.');
  } else if (goal === 'build_muscle' && bmi < 25) {
    insights.push('To build muscle, ensure you\'re eating enough protein and lifting heavy weights progressively.');
  } else if (goal === 'lose_weight' && bmi < 25) {
    insights.push('Your BMI is normal. Consider body recomposition instead of pure weight loss.');
  }

  // Activity-based insights
  if (activityLevel === 'sedentary') {
    insights.push('Starting with even 2-3 workouts per week will make a huge difference in your fitness journey.');
  } else if (activityLevel === 'very_active' || activityLevel === 'athlete') {
    insights.push('You\'re already very active! Focus on recovery and proper nutrition to support your training.');
  }

  // General insights
  if (goal === 'lose_weight') {
    insights.push('Aim for 300-500 calorie deficit daily. Track your food honestly in your daily logs.');
  } else if (goal === 'build_muscle') {
    insights.push('Aim for 0.8-1g protein per lb of bodyweight. Progressive overload is key.');
  }

  insights.push('Daily logging with your accountability squad will help you stay consistent!');

  return insights;
}

export function Summary({ data }: SummaryProps) {
  const router = useRouter();
  const bmi = calculateBMI(data.heightCm, data.weightKg);
  const bmiCategory = getBMICategory(bmi);
  const insights = getBasicInsights(bmi, data.fitnessGoal, data.activityLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Your Fitness Profile
          </h1>
          <p className="text-lg text-neutral-400">
            Here's what we know about you, {data.name} 👋
          </p>
        </div>

        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* BMI Card */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-600/10 rounded-lg">
                  <TrendingUp size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Body Mass Index</h3>
                  <p className="text-sm text-neutral-400">Based on your height and weight</p>
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-white">{bmi.toFixed(1)}</span>
              <span className={`text-2xl font-semibold ${bmiCategory.color}`}>
                {bmiCategory.emoji} {bmiCategory.label}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={20} className="text-red-600" />
                <span className="text-sm text-neutral-400">Activity Level</span>
              </div>
              <p className="text-lg font-semibold text-white">{getActivityLabel(data.activityLevel)}</p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={20} className="text-red-600" />
                <span className="text-sm text-neutral-400">Goal</span>
              </div>
              <p className="text-lg font-semibold text-white">{getGoalLabel(data.fitnessGoal)}</p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={20} className="text-red-600" />
                <span className="text-sm text-neutral-400">Sleep</span>
              </div>
              <p className="text-lg font-semibold text-white">{data.sleepHours} hours</p>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">💡 Your Personalized Insights</h3>
            <ul className="space-y-3">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3 text-neutral-300">
                  <span className="text-red-600 mt-1">•</span>
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Placeholder */}
          <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border border-neutral-700 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-600/10 to-orange-500/10 blur-3xl" />
            <div className="relative">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                🤖 AI-Powered Recommendations
                <span className="text-xs bg-neutral-700 text-neutral-300 px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </h3>
              <p className="text-sm text-neutral-400 mb-4">
                Get personalized workout plans, meal suggestions, and fitness advice powered by AI.
              </p>
              <Button
                disabled
                variant="secondary"
                className="!bg-neutral-800 !text-neutral-500 !border-neutral-700 cursor-not-allowed"
              >
                Generate AI Summary
              </Button>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-6 text-lg"
          >
            Go to Dashboard
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
