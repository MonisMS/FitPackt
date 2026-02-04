'use client';

import { useState } from 'react';
import { completeOnboarding } from './actions';
import { Button, Input } from '@/components/ui';
import { User, Ruler, Activity, Moon, Dumbbell, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import { ProgressDots } from './components/ProgressDots';
import { Celebration } from './components/Celebration';
import { Summary } from './components/Summary';

type OnboardingData = {
  name: string;
  heightCm: string;
  weightKg: string;
  activityLevel: string;
  sleepHours: string;
  workoutFrequency: string;
  fitnessGoal: string;
};

const TOTAL_STEPS = 6;

export default function OnboardingForm({ userId }: { userId: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
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

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

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
      setShowCelebration(true);
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (showSummary) {
    return (
      <Summary
        data={{
          name: data.name,
          heightCm: parseFloat(data.heightCm),
          weightKg: parseFloat(data.weightKg),
          activityLevel: data.activityLevel,
          sleepHours: parseFloat(data.sleepHours),
          workoutFrequency: data.workoutFrequency,
          fitnessGoal: data.fitnessGoal,
        }}
      />
    );
  }

  return (
    <>
      {showCelebration && (
        <Celebration onComplete={() => setShowSummary(true)} />
      )}

      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-2xl relative z-10">
          {/* Progress Dots */}
          <ProgressDots currentStep={step} totalSteps={TOTAL_STEPS} />

          {/* Step Container */}
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 md:p-12 shadow-2xl">
            {/* Step 1: Name */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-red-600/10 rounded-xl border border-red-600/20">
                    <User size={32} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                      What's your name?
                    </h2>
                    <p className="text-neutral-400">Let's start with the basics</p>
                  </div>
                </div>
                <Input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateData('name', e.target.value)}
                  placeholder="Enter your name"
                  className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500 text-lg py-6"
                  autoFocus
                />
                <Button
                  onClick={nextStep}
                  disabled={!data.name.trim()}
                  className="w-full mt-6 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-6"
                >
                  Continue
                  <ChevronRight size={20} />
                </Button>
              </div>
            )}

            {/* Step 2: Physical Stats */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-red-600/10 rounded-xl border border-red-600/20">
                    <Ruler size={32} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                      Your current stats
                    </h2>
                    <p className="text-neutral-400">This helps track your progress</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      📏 Height (cm)
                    </label>
                    <Input
                      type="number"
                      value={data.heightCm}
                      onChange={(e) => updateData('heightCm', e.target.value)}
                      placeholder="e.g., 170"
                      className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500 text-lg py-6"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      ⚖️ Weight (kg)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={data.weightKg}
                      onChange={(e) => updateData('weightKg', e.target.value)}
                      placeholder="e.g., 70.5"
                      className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500 text-lg py-6"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={prevStep}
                    className="flex-1 !bg-neutral-800 !border-neutral-700 !text-white hover:!bg-neutral-700 py-6"
                  >
                    <ChevronLeft size={20} />
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!data.heightCm || !data.weightKg}
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-6"
                  >
                    Continue
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Activity Level */}
            {step === 3 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-red-600/10 rounded-xl border border-red-600/20">
                    <Activity size={32} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                      How active are you?
                    </h2>
                    <p className="text-neutral-400">Your current daily lifestyle</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'sedentary', emoji: '🛋️', label: 'Sedentary', desc: 'Desk job, little to no exercise' },
                    { value: 'lightly_active', emoji: '🚶', label: 'Lightly Active', desc: 'Light exercise 1-2 days/week' },
                    { value: 'moderately_active', emoji: '🏃', label: 'Moderately Active', desc: 'Exercise 3-5 days/week' },
                    { value: 'very_active', emoji: '💪', label: 'Very Active', desc: 'Intense exercise 6-7 days/week' },
                    { value: 'athlete', emoji: '🏆', label: 'Athlete', desc: 'Professional training daily' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        updateData('activityLevel', option.value);
                        setTimeout(nextStep, 300);
                      }}
                      className={`w-full border-2 rounded-xl p-4 text-left transition-all hover:scale-[1.02] ${
                        data.activityLevel === option.value
                          ? 'bg-red-600/20 border-red-600 shadow-lg shadow-red-600/20'
                          : 'bg-neutral-800/50 border-neutral-700 hover:border-red-600/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{option.emoji}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{option.label}</div>
                          <div className="text-sm text-neutral-400">{option.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={prevStep}
                  className="w-full mt-6 !bg-neutral-800 !border-neutral-700 !text-white hover:!bg-neutral-700 py-6"
                >
                  <ChevronLeft size={20} />
                  Back
                </Button>
              </div>
            )}

            {/* Step 4: Sleep Pattern */}
            {step === 4 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-red-600/10 rounded-xl border border-red-600/20">
                    <Moon size={32} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                      How much sleep? 😴
                    </h2>
                    <p className="text-neutral-400">Average hours per night</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { value: '5', label: '😴 Less than 5 hours', recommended: false },
                    { value: '5.5', label: '😪 5-6 hours', recommended: false },
                    { value: '6.5', label: '🌙 6-7 hours', recommended: false },
                    { value: '7.5', label: '✨ 7-8 hours (Optimal)', recommended: true },
                    { value: '8.5', label: '💤 8+ hours', recommended: false },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        updateData('sleepHours', option.value);
                        setTimeout(nextStep, 300);
                      }}
                      className={`w-full border-2 rounded-xl p-4 text-left transition-all hover:scale-[1.02] ${
                        data.sleepHours === option.value
                          ? 'bg-red-600/20 border-red-600 shadow-lg shadow-red-600/20'
                          : option.recommended
                          ? 'bg-green-600/10 border-green-600/30 hover:border-green-600/50'
                          : 'bg-neutral-800/50 border-neutral-700 hover:border-red-600/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{option.label}</span>
                        {option.recommended && (
                          <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full border border-green-600/30">
                            Recommended
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={prevStep}
                  className="w-full mt-6 !bg-neutral-800 !border-neutral-700 !text-white hover:!bg-neutral-700 py-6"
                >
                  <ChevronLeft size={20} />
                  Back
                </Button>
              </div>
            )}

            {/* Step 5: Workout Frequency */}
            {step === 5 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-red-600/10 rounded-xl border border-red-600/20">
                    <Dumbbell size={32} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                      Workout frequency? 💪
                    </h2>
                    <p className="text-neutral-400">Your current routine</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'never', label: '🚫 Never / Rarely', desc: 'Just starting out' },
                    { value: '1_2_per_week', label: '🌱 1-2 times per week', desc: 'Beginner level' },
                    { value: '3_4_per_week', label: '🔥 3-4 times per week', desc: 'Intermediate level' },
                    { value: '5_6_per_week', label: '💪 5-6 times per week', desc: 'Advanced level' },
                    { value: 'daily', label: '🏆 Daily', desc: 'Elite level' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        updateData('workoutFrequency', option.value);
                        setTimeout(nextStep, 300);
                      }}
                      className={`w-full border-2 rounded-xl p-4 text-left transition-all hover:scale-[1.02] ${
                        data.workoutFrequency === option.value
                          ? 'bg-red-600/20 border-red-600 shadow-lg shadow-red-600/20'
                          : 'bg-neutral-800/50 border-neutral-700 hover:border-red-600/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{option.label}</div>
                          <div className="text-sm text-neutral-400">{option.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={prevStep}
                  className="w-full mt-6 !bg-neutral-800 !border-neutral-700 !text-white hover:!bg-neutral-700 py-6"
                >
                  <ChevronLeft size={20} />
                  Back
                </Button>
              </div>
            )}

            {/* Step 6: Fitness Goal */}
            {step === 6 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-red-600/10 rounded-xl border border-red-600/20">
                    <Target size={32} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                      Your fitness goal? 🎯
                    </h2>
                    <p className="text-neutral-400">What are you working towards?</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'lose_weight', label: '🔥 Lose Weight', desc: 'Get lean and shed body fat' },
                    { value: 'build_muscle', label: '💪 Build Muscle', desc: 'Gain strength and size' },
                    { value: 'maintain', label: '⚖️ Maintain Weight', desc: 'Stay at current weight' },
                    { value: 'improve_fitness', label: '🏃 Improve Fitness', desc: 'Better endurance and stamina' },
                    { value: 'general_health', label: '🧘 General Health', desc: 'Overall wellness and consistency' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateData('fitnessGoal', option.value)}
                      className={`w-full border-2 rounded-xl p-4 text-left transition-all hover:scale-[1.02] ${
                        data.fitnessGoal === option.value
                          ? 'bg-red-600/20 border-red-600 shadow-lg shadow-red-600/20'
                          : 'bg-neutral-800/50 border-neutral-700 hover:border-red-600/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{option.label}</div>
                          <div className="text-sm text-neutral-400">{option.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={prevStep}
                    className="flex-1 !bg-neutral-800 !border-neutral-700 !text-white hover:!bg-neutral-700 py-6"
                  >
                    <ChevronLeft size={20} />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!data.fitnessGoal || loading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-6"
                  >
                    {loading ? 'Completing...' : 'Complete Setup 🎉'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Step indicator text */}
          <p className="text-center text-neutral-500 text-sm mt-6">
            Step {step} of {TOTAL_STEPS}
          </p>
        </div>
      </div>
    </>
  );
}
