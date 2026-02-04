'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { savePlan } from './actions';

type ExistingPlan = {
  id: string;
  expectations: string | null;
  strategy: string | null;
  targets: string | null;
  minWorkoutDaysPerWeek: number | null;
  minLoggingDaysPerWeek: number | null;
  version: number;
} | null;

export default function PlanForm({
  roomId,
  userId,
  existingPlan,
  isReadOnly,
}: {
  roomId: string;
  userId: string;
  existingPlan: ExistingPlan;
  isReadOnly: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [data, setData] = useState({
    expectations: existingPlan?.expectations || '',
    strategy: existingPlan?.strategy || '',
    targets: existingPlan?.targets || '',
    minWorkoutDaysPerWeek: existingPlan?.minWorkoutDaysPerWeek?.toString() || '3',
    minLoggingDaysPerWeek: existingPlan?.minLoggingDaysPerWeek?.toString() || '5',
  });

  const updateData = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await savePlan({
        roomId,
        userId,
        expectations: data.expectations || null,
        strategy: data.strategy || null,
        targets: data.targets || null,
        minWorkoutDaysPerWeek: parseInt(data.minWorkoutDaysPerWeek),
        minLoggingDaysPerWeek: parseInt(data.minLoggingDaysPerWeek),
      });

      setHasChanges(false);
      router.refresh();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-8">
      {/* Expectations */}
      <section>
        <div className="mb-2">
          <h2 className="text-xl font-bold">Expectations</h2>
          <p className="text-sm text-gray-600">What results are expected?</p>
        </div>
        <textarea
          value={data.expectations}
          onChange={(e) => updateData('expectations', e.target.value)}
          placeholder="e.g., Lose 5kg, build consistency, feel more energetic..."
          rows={4}
          maxLength={1000}
          disabled={isReadOnly}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          {data.expectations.length}/1000 characters
        </p>
      </section>

      {/* Strategy */}
      <section>
        <div className="mb-2">
          <h2 className="text-xl font-bold">Strategy</h2>
          <p className="text-sm text-gray-600">How will training and eating be approached?</p>
        </div>
        <textarea
          value={data.strategy}
          onChange={(e) => updateData('strategy', e.target.value)}
          placeholder="e.g., Gym 4x/week (PPL split), high protein diet, no junk food after 8pm..."
          rows={5}
          maxLength={1000}
          disabled={isReadOnly}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          {data.strategy.length}/1000 characters
        </p>
      </section>

      {/* Targets */}
      <section>
        <div className="mb-2">
          <h2 className="text-xl font-bold">Targets</h2>
          <p className="text-sm text-gray-600">Measurable outcomes</p>
        </div>
        <textarea
          value={data.targets}
          onChange={(e) => updateData('targets', e.target.value)}
          placeholder="e.g., Target weight: 75kg, Bench press: 80kg, Run 5km under 30min..."
          rows={4}
          maxLength={500}
          disabled={isReadOnly}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">{data.targets.length}/500 characters</p>
      </section>

      {/* Non-Negotiables */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Non-Negotiables</h2>
          <p className="text-sm text-gray-600">Minimum commitments</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum workout days per week
            </label>
            <select
              value={data.minWorkoutDaysPerWeek}
              onChange={(e) => updateData('minWorkoutDaysPerWeek', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((days) => (
                <option key={days} value={days}>
                  {days} {days === 1 ? 'day' : 'days'} per week
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum logging days per week
            </label>
            <select
              value={data.minLoggingDaysPerWeek}
              onChange={(e) => updateData('minLoggingDaysPerWeek', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                <option key={days} value={days}>
                  {days} {days === 1 ? 'day' : 'days'} per week
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Info */}
      {!existingPlan && !isReadOnly && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All members can edit this plan. Changes are tracked with
            versions.
          </p>
        </div>
      )}

      {/* Actions */}
      {!isReadOnly && (
        <div className="flex gap-3 pt-4 border-t">
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
            {loading ? 'Saving...' : existingPlan ? 'Update Plan' : 'Save Plan'}
          </button>
        </div>
      )}

      {isReadOnly && (
        <div className="pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Back to Room
          </button>
        </div>
      )}
    </form>
  );
}
