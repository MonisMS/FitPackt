'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitDailyLog } from './actions';
import { Button, Modal, ModalFooter, Textarea, Input, Select } from '@/components/ui';
import { Utensils, Dumbbell, Moon, Brain, Lock, CheckCircle, AlertCircle } from 'lucide-react';

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
        className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 md:p-8 space-y-8 backdrop-blur-sm"
      >
        {/* Food Section */}
        <section className="animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-600/10 rounded-lg border border-orange-600/20">
              <Utensils size={24} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Food 🍽️</h2>
              <p className="text-sm text-neutral-400">What did you eat today?</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                🌅 Breakfast
              </label>
              <Textarea
                value={data.breakfast}
                onChange={(e) => updateData('breakfast', e.target.value)}
                placeholder="e.g., 2 rotis, dal, sabzi, curd"
                rows={2}
                maxLength={300}
                showCharCount={true}
                className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                🌞 Lunch
              </label>
              <Textarea
                value={data.lunch}
                onChange={(e) => updateData('lunch', e.target.value)}
                placeholder="e.g., rice, dal, chicken, salad"
                rows={2}
                maxLength={300}
                showCharCount={true}
                className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                🌆 Evening / Snacks
              </label>
              <Textarea
                value={data.eveningSnacks}
                onChange={(e) => updateData('eveningSnacks', e.target.value)}
                placeholder="e.g., tea, biscuits, fruits"
                rows={2}
                maxLength={300}
                showCharCount={true}
                className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                🌙 Dinner
              </label>
              <Textarea
                value={data.dinner}
                onChange={(e) => updateData('dinner', e.target.value)}
                placeholder="e.g., 3 rotis, paneer, dal, salad"
                rows={2}
                maxLength={300}
                showCharCount={true}
                className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500"
              />
            </div>
          </div>
        </section>

        <div className="border-t border-neutral-800" />

        {/* Workout Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-600/10 rounded-lg border border-red-600/20">
              <Dumbbell size={24} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Workout 💪</h2>
              <p className="text-sm text-neutral-400">Did you train today?</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Did you workout today? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => updateData('workoutDone', true)}
                  className={`flex-1 py-3 rounded-lg font-medium border-2 transition-all ${
                    data.workoutDone
                      ? 'border-red-600 bg-red-600/20 text-white scale-105'
                      : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-red-600/50'
                  }`}
                >
                  Yes ✓
                </button>
                <button
                  type="button"
                  onClick={() => updateData('workoutDone', false)}
                  className={`flex-1 py-3 rounded-lg font-medium border-2 transition-all ${
                    !data.workoutDone
                      ? 'border-red-600 bg-red-600/20 text-white scale-105'
                      : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-red-600/50'
                  }`}
                >
                  No ✗
                </button>
              </div>
            </div>

            {data.workoutDone && (
              <div className="space-y-4 animate-scale-in">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Type</label>
                  <Select
                    value={data.workoutType}
                    onChange={(e) => updateData('workoutType', e.target.value)}
                    options={[
                      { value: '', label: 'Select type' },
                      { value: 'gym', label: '🏋️ Gym' },
                      { value: 'walk', label: '🚶 Walk' },
                      { value: 'run', label: '🏃 Run' },
                      { value: 'rest', label: '🧘 Rest / Light activity' },
                      { value: 'other', label: '💫 Other' },
                    ]}
                    className="!bg-neutral-800 !border-neutral-700 !text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={data.workoutDurationMinutes}
                    onChange={(e) => updateData('workoutDurationMinutes', e.target.value)}
                    placeholder="e.g., 45"
                    min="0"
                    className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">Intensity</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateData('workoutIntensity', level.toString())}
                        className={`flex-1 py-3 rounded-lg font-medium border-2 transition-all ${
                          data.workoutIntensity === level.toString()
                            ? 'border-red-600 bg-red-600/20 text-white scale-105'
                            : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-red-600/50'
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

        <div className="border-t border-neutral-800" />

        {/* Body & Energy Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600/10 rounded-lg border border-blue-600/20">
              <Moon size={24} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Body & Energy 😴</h2>
              <p className="text-sm text-neutral-400">How are you feeling?</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Sleep Hours <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={data.sleepHours}
                onChange={(e) => updateData('sleepHours', e.target.value)}
                placeholder="e.g., 7.5"
                step="0.5"
                min="0"
                max="24"
                required
                className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Energy Level <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateData('energyLevel', level.toString())}
                    className={`flex-1 py-3 rounded-lg font-medium border-2 transition-all ${
                      data.energyLevel === level.toString()
                        ? 'border-blue-500 bg-blue-600/20 text-white scale-105'
                        : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-blue-500/50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-neutral-500 mt-2">1 = Very low, 5 = Very high</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Weight (kg) - Optional
              </label>
              <Input
                type="number"
                value={data.weightKg}
                onChange={(e) => updateData('weightKg', e.target.value)}
                placeholder="e.g., 70.5"
                step="0.1"
                min="0"
                className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500"
              />
            </div>
          </div>
        </section>

        <div className="border-t border-neutral-800" />

        {/* Note Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-600/10 rounded-lg border border-purple-600/20">
              <Brain size={24} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Note 📝</h2>
              <p className="text-sm text-neutral-400">Optional honest reflection</p>
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
            className="!bg-neutral-800 !border-neutral-700 !text-white placeholder:!text-neutral-500"
          />
        </section>

        {/* Submit */}
        <div className="pt-4 border-t border-neutral-800">
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={!canSubmit}
            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-6"
          >
            <Lock size={20} />
            Submit & Lock
          </Button>
          <p className="text-xs text-neutral-500 text-center mt-3 flex items-center justify-center gap-2">
            <AlertCircle size={14} />
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
          <p className="text-neutral-300">
            You're about to submit your log for today. Once submitted, you cannot edit or delete it.
          </p>
          <div className="bg-red-600/10 p-4 rounded-lg border border-red-600/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-red-500" />
              <span className="text-sm font-medium text-white">This is permanent</span>
            </div>
            <p className="text-xs text-neutral-400">
              Your accountability partners will see this log. Make sure everything is accurate.
            </p>
          </div>
        </div>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="!bg-neutral-800 !border-neutral-700 !text-white hover:!bg-neutral-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            loading={loading}
            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold"
          >
            Yes, Submit
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
