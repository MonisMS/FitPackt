'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserSettings } from './actions';
import { Button, Input, Alert } from '@/components/ui';
import { User as UserIcon, Save, AlertCircle } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  heightCm: string | null;
  startingWeightKg: string | null;
  activityLevel: string | null;
  typicalSleepHours: string | null;
  currentWorkoutFrequency: string | null;
  fitnessGoal: string | null;
};

export default function SettingsForm({ user }: { user: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [data, setData] = useState({
    name: user.name,
    heightCm: user.heightCm || '',
    currentWeightKg: '',
    activityLevel: user.activityLevel || '',
    typicalSleepHours: user.typicalSleepHours || '',
    currentWorkoutFrequency: user.currentWorkoutFrequency || '',
    fitnessGoal: user.fitnessGoal || '',
  });

  const updateData = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserSettings({
        userId: user.id,
        name: data.name,
        heightCm: data.heightCm ? parseFloat(data.heightCm) : null,
        currentWeightKg: data.currentWeightKg ? parseFloat(data.currentWeightKg) : null,
        activityLevel: data.activityLevel || null,
        typicalSleepHours: data.typicalSleepHours ? parseFloat(data.typicalSleepHours) : null,
        currentWorkoutFrequency: data.currentWorkoutFrequency || null,
        fitnessGoal: data.fitnessGoal || null,
      });

      setHasChanges(false);
      router.refresh();
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 lg:p-8 space-y-6">
      {/* Unsaved changes warning */}
      {hasChanges && (
        <Alert variant="warning">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm">You have unsaved changes</span>
          </div>
        </Alert>
      )}

      {/* Profile Section */}
      <section className="animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <UserIcon size={20} className="text-neutral-600" />
          <h2 className="text-xl font-semibold text-neutral-950">Profile Information</h2>
        </div>
        <div className="space-y-4">
          <Input
            label="Name"
            type="text"
            value={data.name}
            onChange={(e) => updateData('name', e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={user.email}
            disabled
            helperText="Email cannot be changed"
          />
        </div>
      </section>

      <div className="border-t border-neutral-200" />

      {/* Body Stats Section */}
      <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-semibold text-neutral-950 mb-4">Body Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Height (cm)"
            type="number"
            value={data.heightCm}
            onChange={(e) => updateData('heightCm', e.target.value)}
            placeholder="e.g., 170"
          />
          <Input
            label="Current Weight (kg)"
            type="number"
            step="0.1"
            value={data.currentWeightKg}
            onChange={(e) => updateData('currentWeightKg', e.target.value)}
            placeholder="e.g., 70.5"
            helperText="Leave empty to keep current"
          />
        </div>
        {user.startingWeightKg && (
          <p className="text-sm text-neutral-600 mt-2">
            Starting weight: {user.startingWeightKg} kg
          </p>
        )}
      </section>

      <div className="border-t border-neutral-200" />

      {/* Activity Section */}
      <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-semibold text-neutral-950 mb-4">Activity & Goals</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Activity Level</label>
            <select
              value={data.activityLevel}
              onChange={(e) => updateData('activityLevel', e.target.value)}
              className="w-full px-4 py-2.5 bg-white text-neutral-950 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all"
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="lightly_active">Lightly Active</option>
              <option value="moderately_active">Moderately Active</option>
              <option value="very_active">Very Active</option>
              <option value="athlete">Athlete</option>
            </select>
          </div>
          <Input
            label="Typical Sleep Hours"
            type="number"
            step="0.5"
            value={data.typicalSleepHours}
            onChange={(e) => updateData('typicalSleepHours', e.target.value)}
            placeholder="e.g., 7.5"
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Workout Frequency</label>
            <select
              value={data.currentWorkoutFrequency}
              onChange={(e) => updateData('currentWorkoutFrequency', e.target.value)}
              className="w-full px-4 py-2.5 bg-white text-neutral-950 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all"
            >
              <option value="">Select frequency</option>
              <option value="never">Never / Rarely</option>
              <option value="1_2_per_week">1-2 times per week</option>
              <option value="3_4_per_week">3-4 times per week</option>
              <option value="5_6_per_week">5-6 times per week</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Fitness Goal</label>
            <select
              value={data.fitnessGoal}
              onChange={(e) => updateData('fitnessGoal', e.target.value)}
              className="w-full px-4 py-2.5 bg-white text-neutral-950 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all"
            >
              <option value="">Select goal</option>
              <option value="lose_weight">Lose Weight</option>
              <option value="build_muscle">Build Muscle</option>
              <option value="maintain">Maintain Weight</option>
              <option value="improve_fitness">Improve Fitness</option>
              <option value="general_health">General Health</option>
            </select>
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-end pt-4 border-t border-neutral-200">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading || !hasChanges}
          loading={loading}
        >
          <Save size={20} />
          Save Changes
        </Button>
      </div>
    </form>
  );
}
