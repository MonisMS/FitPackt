'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitDailyLog } from './actions';
import { Button, Modal, ModalFooter, Textarea, Input, Select } from '@/components/ui';
import { Utensils, Dumbbell, Moon, Brain, Lock, CheckCircle } from 'lucide-react';

type FormData = {
  breakfast: string;
  lunch: string;
  eveningSnacks: string;
  dinner: string;
  workoutDone: boolean;
  workoutType: string;
  workoutDurationMinutes: string;
  workoutIntensity: string;
  sleepHours: string;
  energyLevel: string;
  weightKg: string;
  note: string;
};

export default function DailyLogForm({
  userId,
  roomId,
}: {
  userId: string;
  roomId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [data, setData] = useState<FormData>({
    breakfast: '',
    lunch: '',
    eveningSnacks: '',
    dinner: '',
    workoutDone: false,
    workoutType: '',
    workoutDurationMinutes: '',
    workoutIntensity: '',
    sleepHours: '',
    energyLevel: '',
    weightKg: '',
    note: '',
  });

  const updateData = (field: keyof FormData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitDailyLog({
        userId,
        roomId: roomId || null,
        breakfast: data.breakfast || null,
        lunch: data.lunch || null,
        eveningSnacks: data.eveningSnacks || null,
        dinner: data.dinner || null,
        workoutDone: data.workoutDone,
        workoutType: data.workoutDone && data.workoutType ? data.workoutType : null,
        workoutDurationMinutes: data.workoutDone && data.workoutDurationMinutes
          ? parseInt(data.workoutDurationMinutes)
          : null,
        workoutIntensity: data.workoutDone && data.workoutIntensity
          ? parseInt(data.workoutIntensity)
          : null,
        sleepHours: parseFloat(data.sleepHours),
        energyLevel: parseInt(data.energyLevel),
        weightKg: data.weightKg ? parseFloat(data.weightKg) : null,
        note: data.note || null,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting log:', error);
      alert('Failed to submit log. Please try again.');
      setLoading(false);
    }
  };

  const canSubmit =
    data.sleepHours &&
    data.energyLevel &&
    (data.breakfast || data.lunch || data.eveningSnacks || data.dinner);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirm(true);
        }}
        className="bg-white rounded-lg shadow-md p-6 space-y-8"
      >
        {/* Food Section */}
        <section className="animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <Utensils size={24} className="text-neutral-950" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-950">Food</h2>
              <p className="text-sm text-neutral-600">What did you eat today?</p>
            </div>
          </div>
          <div className="space-y-4">
            <Textarea
              label="Breakfast"
              value={data.breakfast}
              onChange={(e) => updateData('breakfast', e.target.value)}
              placeholder="e.g., 2 rotis, dal, sabzi, curd"
              rows={2}
              maxLength={300}
              showCharCount={true}
            />
            <Textarea
              label="Lunch"
              value={data.lunch}
              onChange={(e) => updateData('lunch', e.target.value)}
              placeholder="e.g., rice, dal, chicken, salad"
              rows={2}
              maxLength={300}
              showCharCount={true}
            />
            <Textarea
              label="Evening / Snacks"
              value={data.eveningSnacks}
              onChange={(e) => updateData('eveningSnacks', e.target.value)}
              placeholder="e.g., tea, biscuits, fruits"
              rows={2}
              maxLength={300}
              showCharCount={true}
            />
            <Textarea
              label="Dinner"
              value={data.dinner}
              onChange={(e) => updateData('dinner', e.target.value)}
              placeholder="e.g., 3 rotis, paneer, dal, salad"
              rows={2}
              maxLength={300}
              showCharCount={true}
            />
          </div>
        </section>

        <div className="border-t border-neutral-200" />

        {/* Workout Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <Dumbbell size={24} className="text-neutral-950" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-950">Workout</h2>
              <p className="text-sm text-neutral-600">Did you train today?</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Did you workout today? <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => updateData('workoutDone', true)}
                  className={`flex-1 py-3 rounded-lg font-medium border-2 transition-all ${
                    data.workoutDone
                      ? 'border-neutral-950 bg-neutral-950 text-white scale-105'
                      : 'border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => updateData('workoutDone', false)}
                  className={`flex-1 py-3 rounded-lg font-medium border-2 transition-all ${
                    !data.workoutDone
                      ? 'border-neutral-950 bg-neutral-950 text-white scale-105'
                      : 'border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {data.workoutDone && (
              <div className="space-y-4 animate-scale-in">
                <Select
                  label="Type"
                  value={data.workoutType}
                  onChange={(e) => updateData('workoutType', e.target.value)}
                  options={[
                    { value: '', label: 'Select type' },
                    { value: 'gym', label: 'Gym' },
                    { value: 'walk', label: 'Walk' },
                    { value: 'run', label: 'Run' },
                    { value: 'rest', label: 'Rest / Light activity' },
                    { value: 'other', label: 'Other' },
                  ]}
                />

                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={data.workoutDurationMinutes}
                  onChange={(e) => updateData('workoutDurationMinutes', e.target.value)}
                  placeholder="e.g., 45"
                  min="0"
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">Intensity</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateData('workoutIntensity', level.toString())}
                        className={`flex-1 py-3 rounded-lg font-medium border-2 transition-all ${
                          data.workoutIntensity === level.toString()
                            ? 'border-neutral-950 bg-neutral-950 text-white scale-105'
                            : 'border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">1 = Very light, 5 = Very intense</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="border-t border-neutral-200" />

        {/* Body & Energy Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <Moon size={24} className="text-neutral-950" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-950">Body & Energy</h2>
              <p className="text-sm text-neutral-600">How are you feeling?</p>
            </div>
          </div>
          <div className="space-y-4">
            <Input
              label={
                <>
                  Sleep Hours <span className="text-red-600">*</span>
                </>
              }
              type="number"
              value={data.sleepHours}
              onChange={(e) => updateData('sleepHours', e.target.value)}
              placeholder="e.g., 7.5"
              step="0.5"
              min="0"
              max="24"
              required
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Energy Level <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateData('energyLevel', level.toString())}
                    className={`flex-1 py-3 rounded-lg font-medium border-2 transition-all ${
                      data.energyLevel === level.toString()
                        ? 'border-neutral-950 bg-neutral-950 text-white scale-105'
                        : 'border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-neutral-500 mt-2">1 = Very low, 5 = Very high</p>
            </div>

            <Input
              label="Weight (kg) - Optional"
              type="number"
              value={data.weightKg}
              onChange={(e) => updateData('weightKg', e.target.value)}
              placeholder="e.g., 70.5"
              step="0.1"
              min="0"
            />
          </div>
        </section>

        <div className="border-t border-neutral-200" />

        {/* Note Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <Brain size={24} className="text-neutral-950" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-950">Note</h2>
              <p className="text-sm text-neutral-600">Optional honest reflection</p>
            </div>
          </div>
          <Textarea
            label="How did today go?"
            value={data.note}
            onChange={(e) => updateData('note', e.target.value)}
            placeholder="Any challenges or wins? How are you feeling?"
            rows={3}
            maxLength={200}
            showCharCount={true}
          />
        </section>

        {/* Submit */}
        <div className="pt-4 border-t border-neutral-200">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canSubmit}
          >
            <Lock size={20} />
            Submit & Lock
          </Button>
          <p className="text-xs text-neutral-500 text-center mt-3">
            Once submitted, you cannot edit this log
          </p>
        </div>
      </form>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => !loading && setShowConfirm(false)}
        title="Confirm Submission"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">
            You're about to submit your log for today. Once submitted, you cannot edit or delete it.
          </p>
          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-green-600" />
              <span className="text-sm font-medium text-neutral-950">This is permanent</span>
            </div>
            <p className="text-xs text-neutral-600">
              Your accountability partners will see this log. Make sure everything is accurate.
            </p>
          </div>
        </div>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            loading={loading}
          >
            Yes, Submit
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
