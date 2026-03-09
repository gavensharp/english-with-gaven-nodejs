"use client";

interface ProgressIndicatorProps {
  attempted: number;
  total: number;
  score: number;
}

export default function ProgressIndicator({
  attempted,
  total,
  score,
}: ProgressIndicatorProps) {
  const percentage = total > 0 ? Math.round((attempted / total) * 100) : 0;

  return (
    <div className="mb-6">
      <div className="bg-white border-2 border-neutral rounded-lg p-3 md:p-4 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <span className="text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">
              Progress: {attempted}/{total}
            </span>
            <div className="bg-gray-200 rounded-full h-2.5 md:h-3 flex-grow sm:flex-grow-0 sm:w-40 md:w-48 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <div className="text-primary-dark font-bold text-base md:text-lg whitespace-nowrap">
            Score: {score}/{total}
          </div>
        </div>
      </div>
    </div>
  );
}
