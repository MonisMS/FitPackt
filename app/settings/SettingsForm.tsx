'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserSettings } from './actions';

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
    currentWeightKg: '', // For updating current weight
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Account Info */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed (managed by authentication provider)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData('name', e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </section>

      {/* Physical Stats */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Physical Stats</h2>
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
              step="0.1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starting Weight
            </label>
            <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">
              <span className="font-medium">{user.startingWeightKg || 'Not set'} kg</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your starting weight is locked (set during onboarding)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Weight (kg) - Optional
            </label>
            <input
              type="number"
              value={data.currentWeightKg}
              onChange={(e) => updateData('currentWeightKg', e.target.value)}
              placeholder="e.g., 70.5"
              step="0.1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Update this to track your progress over time
            </p>
          </div>
        </div>
      </section>

      {/* Activity & Habits */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Activity & Habits</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Level
            </label>
            <select
              value={data.activityLevel}
              onChange={(e) => updateData('activityLevel', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary (little to no exercise)</option>
              <option value="lightly_active">Lightly active (1-2 days/week)</option>
              <option value="moderately_active">Moderately active (3-5 days/week)</option>
              <option value="very_active">Very active (6-7 days/week)</option>
              <option value="athlete">Athlete (intense training daily)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Typical Sleep Hours
            </label>
            <input
              type="number"
              value={data.typicalSleepHours}
              onChange={(e) => updateData('typicalSleepHours', e.target.value)}
              placeholder="e.g., 7.5"
              step="0.5"
              min="0"
              max="24"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Workout Frequency
            </label>
            <select
              value={data.currentWorkoutFrequency}
              onChange={(e) => updateData('currentWorkoutFrequency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select frequency</option>
              <option value="never">Never / Rarely</option>
              <option value="1_2_per_week">1-2 times per week</option>
              <option value="3_4_per_week">3-4 times per week</option>
              <option value="5_6_per_week">5-6 times per week</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Fitness Goal</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Goal
          </label>
          <select
            value={data.fitnessGoal}
            onChange={(e) => updateData('fitnessGoal', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select goal</option>
            <option value="lose_weight">Lose weight (get lean)</option>
            <option value="build_muscle">Build muscle (bulk up)</option>
            <option value="maintain">Maintain current weight</option>
            <option value="improve_fitness">Improve fitness/endurance</option>
            <option value="general_health">General health & consistency</option>
          </select>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !hasChanges}
          className="flex-1 bg-black text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
