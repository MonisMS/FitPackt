'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { completeOnboarding } from './actions';
import { Button, Input, CircularProgress } from '@/components/ui';
import {
  User,
  Ruler,
  Activity,
  Moon,
  Dumbbell,
  Target,
  ChevronRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

type OnboardingData = {
  name: string;
  heightCm: string;
  weightKg: string;
  activityLevel: string;
  sleepHours: string;
  workoutFrequency: string;
  fitnessGoal: string;
};

const stepIcons = [User, Ruler, Activity, Moon, Dumbbell, Target];
const stepTitles = ['Name', 'Stats', 'Activity', 'Sleep', 'Workout', 'Goal'];

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

  const percentage = Math.round((step / 6) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-[250px,1fr] gap-8">
        {/* Step Sidebar - Desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-8 space-y-3">
            {stepTitles.map((title, index) => {
              const StepIcon = stepIcons[index];
              const stepNum = index + 1;
              const isCompleted = step > stepNum;
              const isCurrent = step === stepNum;

              return (
                <div
                  key={title}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isCurrent ? 'bg-white shadow-md border border-neutral-200' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-600'
                        : isCurrent
                        ? 'bg-neutral-950'
                        : 'bg-neutral-200'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={20} className="text-white" />
                    ) : (
                      <StepIcon
                        size={20}
                        className={isCurrent ? 'text-white' : 'text-neutral-500'}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Step {stepNum}</p>
                    <p
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-neutral-950' : 'text-neutral-600'
                      }`}
                    >
                      {title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
          {/* Mobile Progress */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-between mb-4">
              <CircularProgress
                value={step}
                max={6}
                size={64}
                strokeWidth={6}
                variant="default"
                showLabel={true}
              />
              <div className="text-right">
                <p className="text-xs text-neutral-500">Step {step} of 6</p>
                <p className="text-sm font-medium text-neutral-950">{stepTitles[step - 1]}</p>
              </div>
            </div>
          </div>

          {/* Step 1: Name */}
          {step === 1 && (
            <div className="animate-scale-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <User size={32} className="text-neutral-950" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-neutral-950 mb-1">What's your name?</h2>
                  <p className="text-neutral-600">Let's start with the basics</p>
                </div>
              </div>
              <Input
                type="text"
                value={data.name}
                onChange={(e) => updateData('name', e.target.value)}
                placeholder="Enter your name"
                autoFocus
              />
              <Button
                onClick={nextStep}
                disabled={!data.name.trim()}
                variant="primary"
                size="lg"
                fullWidth
                className="mt-6"
              >
                Continue
                <ChevronRight size={20} />
              </Button>
            </div>
          )}

          {/* Step 2: Physical Stats */}
          {step === 2 && (
            <div className="animate-scale-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <Ruler size={32} className="text-neutral-950" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-neutral-950 mb-1">Your current stats</h2>
                  <p className="text-neutral-600">This helps track your progress</p>
                </div>
              </div>
              <div className="space-y-4">
                <Input
                  label="Height (cm)"
                  type="number"
                  value={data.heightCm}
                  onChange={(e) => updateData('heightCm', e.target.value)}
                  placeholder="e.g., 170"
                  autoFocus
                />
                <Input
                  label="Weight (kg)"
                  type="number"
                  step="0.1"
                  value={data.weightKg}
                  onChange={(e) => updateData('weightKg', e.target.value)}
                  placeholder="e.g., 70.5"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={prevStep} variant="secondary" size="lg" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={!data.heightCm || !data.weightKg}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  Continue
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Activity Level */}
          {step === 3 && (
            <div className="animate-scale-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <Activity size={32} className="text-neutral-950" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-neutral-950 mb-1">How active are you?</h2>
                  <p className="text-neutral-600">Be honest about your current lifestyle</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'sedentary', emoji: '🛋️', label: 'Sedentary', desc: 'Little to no exercise' },
                  { value: 'lightly_active', emoji: '🚶', label: 'Lightly active', desc: '1-2 days/week' },
                  { value: 'moderately_active', emoji: '🏃', label: 'Moderately active', desc: '3-5 days/week' },
                  { value: 'very_active', emoji: '💪', label: 'Very active', desc: '6-7 days/week' },
                  { value: 'athlete', emoji: '🏆', label: 'Athlete', desc: 'Intense training daily' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      updateData('activityLevel', option.value);
                      setTimeout(nextStep, 200);
                    }}
                    className={`w-full bg-white border-2 rounded-lg p-4 text-left transition-all hover:scale-105 ${
                      data.activityLevel === option.value
                        ? 'border-neutral-950 shadow-lg'
                        : 'border-neutral-300 hover:border-neutral-950'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{option.emoji}</span>
                      <div>
                        <div className="font-medium text-neutral-950 mb-1">{option.label}</div>
                        <div className="text-sm text-neutral-600">{option.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <Button onClick={prevStep} variant="secondary" size="lg" fullWidth className="mt-6">
                Back
              </Button>
            </div>
          )}

          {/* Step 4: Sleep Pattern */}
          {step === 4 && (
            <div className="animate-scale-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <Moon size={32} className="text-neutral-950" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-neutral-950 mb-1">How much sleep?</h2>
                  <p className="text-neutral-600">Average hours per night</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { value: '5', label: 'Less than 5 hours' },
                  { value: '5.5', label: '5-6 hours' },
                  { value: '6.5', label: '6-7 hours' },
                  { value: '7.5', label: '7-8 hours (recommended)', recommended: true },
                  { value: '8.5', label: '8+ hours' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      updateData('sleepHours', option.value);
                      setTimeout(nextStep, 200);
                    }}
                    className={`w-full bg-white border-2 rounded-lg p-4 text-left transition-all hover:scale-105 ${
                      data.sleepHours === option.value
                        ? 'border-neutral-950 shadow-lg'
                        : option.recommended
                        ? 'border-green-300 hover:border-green-600'
                        : 'border-neutral-300 hover:border-neutral-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-neutral-950">{option.label}</span>
                      {option.recommended && (
                        <Sparkles size={16} className="text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <Button onClick={prevStep} variant="secondary" size="lg" fullWidth className="mt-6">
                Back
              </Button>
            </div>
          )}

          {/* Step 5: Workout Frequency */}
          {step === 5 && (
            <div className="animate-scale-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <Dumbbell size={32} className="text-neutral-950" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-neutral-950 mb-1">How often do you workout?</h2>
                  <p className="text-neutral-600">Your current routine</p>
                </div>
              </div>
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
                    className={`w-full bg-white border-2 rounded-lg p-4 text-left transition-all hover:scale-105 ${
                      data.workoutFrequency === option.value
                        ? 'border-neutral-950 shadow-lg'
                        : 'border-neutral-300 hover:border-neutral-950'
                    }`}
                  >
                    <span className="font-medium text-neutral-950">{option.label}</span>
                  </button>
                ))}
              </div>
              <Button onClick={prevStep} variant="secondary" size="lg" fullWidth className="mt-6">
                Back
              </Button>
            </div>
          )}

          {/* Step 6: Fitness Goal */}
          {step === 6 && (
            <div className="animate-scale-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <Target size={32} className="text-neutral-950" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-neutral-950 mb-1">Your fitness goal?</h2>
                  <p className="text-neutral-600">What are you working towards?</p>
                </div>
              </div>
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
                    className={`w-full bg-white border-2 rounded-lg p-4 text-left transition-all hover:scale-105 ${
                      data.fitnessGoal === option.value
                        ? 'border-neutral-950 shadow-lg'
                        : 'border-neutral-300 hover:border-neutral-950'
                    }`}
                  >
                    <span className="font-medium text-neutral-950">{option.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={prevStep} variant="secondary" size="lg" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!data.fitnessGoal || loading}
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="flex-1"
                >
                  <CheckCircle size={20} />
                  Complete Setup
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
