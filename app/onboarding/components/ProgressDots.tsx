'use client';

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isCompleted = currentStep > stepNum;
        const isCurrent = currentStep === stepNum;

        return (
          <div
            key={stepNum}
            className={`h-2 rounded-full transition-all duration-300 ${
              isCompleted
                ? 'w-8 bg-green-500'
                : isCurrent
                ? 'w-12 bg-red-600'
                : 'w-2 bg-neutral-700'
            }`}
          />
        );
      })}
    </div>
  );
}
