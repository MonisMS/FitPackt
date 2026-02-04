'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { savePlan } from './actions';
import { Button, Textarea, Alert } from '@/components/ui';
import { Target, TrendingUp, Flag, Save, AlertCircle } from 'lucide-react';

type ExistingPlan = {
  id: string;
  expectations: string | null;
  strategy: string | null;
  targets: string | null;
  minWorkoutDaysPerWeek: number | null;
  minLoggingDaysPerWeek: number | null;
  version: number;
} | null | undefined;

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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 lg:p-8 space-y-8">
      {/* Auto-save indicator */}
      {hasChanges && !isReadOnly && (
        <Alert variant="warning">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm">You have unsaved changes</span>
          </div>
        </Alert>
      )}

      {/* Expectations */}
      <section className="animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} className="text-neutral-600" />
          <div>
            <h2 className="text-xl font-semibold text-neutral-950">Expectations</h2>
            <p className="text-sm text-neutral-600">What results are expected?</p>
          </div>
        </div>
        <Textarea
          value={data.expectations}
          onChange={(e) => updateData('expectations', e.target.value)}
          placeholder="e.g., Lose 5kg, build consistency, feel more energetic..."
          rows={4}
          maxLength={1000}
          disabled={isReadOnly}
          showCharCount={true}
        />
      </section>

      {/* Strategy */}
      <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-neutral-600" />
          <div>
            <h2 className="text-xl font-semibold text-neutral-950">Strategy</h2>
            <p className="text-sm text-neutral-600">How will training and eating be approached?</p>
          </div>
        </div>
        <Textarea
          value={data.strategy}
          onChange={(e) => updateData('strategy', e.target.value)}
          placeholder="e.g., Gym 4x/week (PPL split), high protein diet, no junk food after 8pm..."
          rows={4}
          maxLength={1000}
          disabled={isReadOnly}
          showCharCount={true}
        />
      </section>

      {/* Targets */}
      <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Flag size={20} className="text-neutral-600" />
          <div>
            <h2 className="text-xl font-semibold text-neutral-950">Specific Targets</h2>
            <p className="text-sm text-neutral-600">Measurable goals for this challenge</p>
          </div>
        </div>
        <Textarea
          value={data.targets}
          onChange={(e) => updateData('targets', e.target.value)}
          placeholder="e.g., Bench press 80kg, waist size 32 inches, run 5K in under 30 min..."
          rows={4}
          maxLength={1000}
          disabled={isReadOnly}
          showCharCount={true}
        />
      </section>

      {/* Minimums */}
      <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-xl font-semibold text-neutral-950 mb-4">Minimum Requirements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Min Workout Days / Week
            </label>
            <select
              value={data.minWorkoutDaysPerWeek}
              onChange={(e) => updateData('minWorkoutDaysPerWeek', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-4 py-2.5 bg-white text-neutral-950 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n} day{n !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Min Logging Days / Week
            </label>
            <select
              value={data.minLoggingDaysPerWeek}
              onChange={(e) => updateData('minLoggingDaysPerWeek', e.target.value)}
              disabled={isReadOnly}
              className="w-full px-4 py-2.5 bg-white text-neutral-950 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n} day{n !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Submit */}
      {!isReadOnly && (
        <div className="flex justify-end pt-4 border-t border-neutral-200">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || !hasChanges}
            loading={loading}
          >
            <Save size={20} />
            Save Plan
          </Button>
        </div>
      )}

      {isReadOnly && (
        <Alert variant="info">
          <span className="text-sm">This plan is read-only. Only room members can edit.</span>
        </Alert>
      )}
    </form>
  );
}
