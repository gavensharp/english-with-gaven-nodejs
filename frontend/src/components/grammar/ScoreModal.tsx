"use client";

interface ScoreModalProps {
  isOpen: boolean;
  score: number;
  total: number;
  onClose: () => void;
  onReset: () => void;
}

export default function ScoreModal({
  isOpen,
  score,
  total,
  onClose,
  onReset,
}: ScoreModalProps) {
  if (!isOpen) return null;

  const percentage = Math.round((score / total) * 100);

  let emoji = "";
  let feedback = "";
  let message = "";
  let colorClass = "";

  if (percentage >= 90) {
    emoji = "🎉";
    feedback = "Excellent work!";
    message = "You have mastered this grammar!";
    colorClass = "text-green-600";
  } else if (percentage >= 70) {
    emoji = "👍";
    feedback = "Good job!";
    message = "You're doing well. Keep practicing!";
    colorClass = "text-blue-600";
  } else if (percentage >= 50) {
    emoji = "💪";
    feedback = "Keep practicing!";
    message = "You're making progress. Review mistakes and try again.";
    colorClass = "text-yellow-600";
  } else {
    emoji = "📚";
    feedback = "Review and try again!";
    message = "Take your time to review then try again.";
    colorClass = "text-red-600";
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 animate-fadeIn">
        <div className="text-center">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className={`text-3xl font-bold mb-3 ${colorClass}`}>
            {feedback}
          </h2>
          <div className="mb-4">
            <div className={`text-5xl font-bold ${colorClass}`}>
              {score}
              <span className="text-2xl text-gray-500">/{total}</span>
            </div>
            <div className="text-xl text-gray-600 mt-2">{percentage}%</div>
          </div>
          <p className="text-gray-700 mb-6">{message}</p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  percentage >= 90
                    ? "bg-green-500"
                    : percentage >= 70
                      ? "bg-blue-500"
                      : percentage >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onReset}
              className="flex-1 bg-accent-orchid hover:bg-accent-orchid/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-accent-orchid">
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-accent-blue hover:bg-accent-blue-dark text-primary-dark font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-accent-blue">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
