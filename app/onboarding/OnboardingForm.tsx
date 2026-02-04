'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { completeOnboarding } from './actions';

type OnboardingData = {
  name: string;
  heightCm: string;
  weightKg: string;
  activityLevel: string;
  sleepHours: string;
  workoutFrequency: string;
  fitnessGoal: string;
};

export default function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    heightCm: '',
    weightKg: '',
    activityLevel: '',
    sleepHours: '',
    workoutFrequency: '',
    fitnessGoal: '',
  });

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await completeOnboarding(userId, {
        name: data.name,
        heightCm: parseFloat(data.heightCm),
        weightKg: parseFloat(data.weightKg),
        activityLevel: data.activityLevel,
        sleepHours: parseFloat(data.sleepHours),
        workoutFrequency: data.workoutFrequency,
        fitnessGoal: data.fitnessGoal,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Step {step} of 6</span>
          <span className="text-sm text-gray-600">{Math.round((step / 6) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Name */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">What's your name?</h2>
          <p className="text-gray-600 mb-6">Let's start with the basics</p>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateData('name', e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            autoFocus
          />
          <button
            onClick={nextStep}
            disabled={!data.name.trim()}
            className="w-full mt-6 bg-black text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Physical Stats */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Your current stats</h2>
          <p className="text-gray-600 mb-6">This helps track your progress</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={data.heightCm}
                onChange={(e) => updateData('heightCm', e.target.value)}
                placeholder="e.g., 170"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.weightKg}
                onChange={(e) => updateData('weightKg', e.target.value)}
                placeholder="e.g., 70.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={prevStep}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!data.heightCm || !data.weightKg}
              className="flex-1 bg-black text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Activity Level */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">How active are you currently?</h2>
          <p className="text-gray-600 mb-6">Be honest about your current lifestyle</p>
          <div className="space-y-3">
            {[
              { value: 'sedentary', label: '🛋️ Sedentary', desc: 'Little to no exercise' },
              { value: 'lightly_active', label: '🚶 Lightly active', desc: '1-2 days/week' },
              { value: 'moderately_active', label: '🏃 Moderately active', desc: '3-5 days/week' },
              { value: 'very_active', label: '💪 Very active', desc: '6-7 days/week' },
              { value: 'athlete', label: '🏆 Athlete', desc: 'Intense training daily' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  updateData('activityLevel', option.value);
                  setTimeout(nextStep, 200);
                }}
                className={`w-full p-4 border-2 rounded-lg text-left hover:border-black transition ${
                  data.activityLevel === option.value
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
          <button
            onClick={prevStep}
            className="w-full mt-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Back
          </button>
        </div>
      )}

      {/* Step 4: Sleep Pattern */}
      {step === 4 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">How much sleep do you typically get?</h2>
          <p className="text-gray-600 mb-6">Average hours per night</p>
          <div className="space-y-3">
            {[
              { value: '5', label: 'Less than 5 hours' },
              { value: '5.5', label: '5-6 hours' },
              { value: '6.5', label: '6-7 hours' },
              { value: '7.5', label: '7-8 hours (recommended)' },
              { value: '8.5', label: '8+ hours' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  updateData('sleepHours', option.value);
                  setTimeout(nextStep, 200);
                }}
                className={`w-full p-4 border-2 rounded-lg text-left hover:border-black transition ${
                  data.sleepHours === option.value
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
              </button>
            ))}
          </div>
          <button
            onClick={prevStep}
            className="w-full mt-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Back
          </button>
        </div>
      )}

      {/* Step 5: Workout Frequency */}
      {step === 5 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">How often do you work out currently?</h2>
          <p className="text-gray-600 mb-6">Your current routine</p>
          <div className="space-y-3">
            {[
              { value: 'never', label: 'Never / Rarely' },
              { value: '1_2_per_week', label: '1-2 times per week' },
              { value: '3_4_per_week', label: '3-4 times per week' },
              { value: '5_6_per_week', label: '5-6 times per week' },
              { value: 'daily', label: 'Daily' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  updateData('workoutFrequency', option.value);
                  setTimeout(nextStep, 200);
                }}
                className={`w-full p-4 border-2 rounded-lg text-left hover:border-black transition ${
                  data.workoutFrequency === option.value
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
              </button>
            ))}
          </div>
          <button
            onClick={prevStep}
            className="w-full mt-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Back
          </button>
        </div>
      )}

      {/* Step 6: Fitness Goal */}
      {step === 6 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">What's your primary fitness goal?</h2>
          <p className="text-gray-600 mb-6">What are you working towards?</p>
          <div className="space-y-3">
            {[
              { value: 'lose_weight', label: '🔥 Lose weight (get lean)' },
              { value: 'build_muscle', label: '💪 Build muscle (bulk up)' },
              { value: 'maintain', label: '⚖️ Maintain current weight' },
              { value: 'improve_fitness', label: '🏃 Improve fitness/endurance' },
              { value: 'general_health', label: '🧘 General health & consistency' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('fitnessGoal', option.value)}
                className={`w-full p-4 border-2 rounded-lg text-left hover:border-black transition ${
                  data.fitnessGoal === option.value
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={prevStep}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!data.fitnessGoal || loading}
              className="flex-1 bg-black text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition"
            >
              {loading ? 'Completing...' : 'Complete Setup'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
