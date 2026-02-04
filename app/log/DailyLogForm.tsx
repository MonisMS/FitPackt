'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitDailyLog } from './actions';

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
        className="bg-white rounded-lg shadow p-6 space-y-8"
      >
        {/* Food Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">🥣 Food</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breakfast
              </label>
              <textarea
                value={data.breakfast}
                onChange={(e) => updateData('breakfast', e.target.value)}
                placeholder="e.g., 2 rotis, dal, sabzi, curd"
                rows={2}
                maxLength={300}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {data.breakfast.length}/300 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lunch
              </label>
              <textarea
                value={data.lunch}
                onChange={(e) => updateData('lunch', e.target.value)}
                placeholder="e.g., rice, dal, chicken, salad"
                rows={2}
                maxLength={300}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {data.lunch.length}/300 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evening / Snacks
              </label>
              <textarea
                value={data.eveningSnacks}
                onChange={(e) => updateData('eveningSnacks', e.target.value)}
                placeholder="e.g., tea, biscuits, fruits"
                rows={2}
                maxLength={300}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {data.eveningSnacks.length}/300 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dinner
              </label>
              <textarea
                value={data.dinner}
                onChange={(e) => updateData('dinner', e.target.value)}
                placeholder="e.g., 3 rotis, paneer, dal, salad"
                rows={2}
                maxLength={300}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {data.dinner.length}/300 characters
              </p>
            </div>
          </div>
        </section>

        {/* Workout Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">🏋️ Workout</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Did you workout today? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => updateData('workoutDone', true)}
                  className={`flex-1 py-3 rounded-lg font-medium border-2 transition ${
                    data.workoutDone
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => updateData('workoutDone', false)}
                  className={`flex-1 py-3 rounded-lg font-medium border-2 transition ${
                    !data.workoutDone
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {data.workoutDone && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={data.workoutType}
                    onChange={(e) => updateData('workoutType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select type</option>
                    <option value="gym">Gym</option>
                    <option value="walk">Walk</option>
                    <option value="run">Run</option>
                    <option value="rest">Rest / Light activity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={data.workoutDurationMinutes}
                    onChange={(e) => updateData('workoutDurationMinutes', e.target.value)}
                    placeholder="e.g., 45"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Intensity
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateData('workoutIntensity', level.toString())}
                        className={`flex-1 py-3 rounded-lg font-medium border-2 transition ${
                          data.workoutIntensity === level.toString()
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-black'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    1 = Very light, 5 = Very intense
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Body & Energy Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">😴 Body & Energy</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sleep Hours <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={data.sleepHours}
                onChange={(e) => updateData('sleepHours', e.target.value)}
                placeholder="e.g., 7.5"
                step="0.5"
                min="0"
                max="24"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Energy Level <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateData('energyLevel', level.toString())}
                    className={`flex-1 py-3 rounded-lg font-medium border-2 transition ${
                      data.energyLevel === level.toString()
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                1 = Very low, 5 = Very high
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg) - Optional
              </label>
              <input
                type="number"
                value={data.weightKg}
                onChange={(e) => updateData('weightKg', e.target.value)}
                placeholder="e.g., 70.5"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </section>

        {/* Note Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">🧠 Note</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Optional honest reflection
            </label>
            <textarea
              value={data.note}
              onChange={(e) => updateData('note', e.target.value)}
              placeholder="How did today go? Any challenges or wins?"
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {data.note.length}/200 characters
            </p>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-black text-white py-4 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition"
          >
            Submit & Lock
          </button>
          <p className="text-sm text-gray-500 text-center mt-3">
            Once submitted, you cannot edit this log
          </p>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Submission</h3>
            <p className="text-gray-600 mb-6">
              You're about to submit your log for today. Once submitted, you cannot edit or delete it. Are you sure?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                {loading ? 'Submitting...' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
