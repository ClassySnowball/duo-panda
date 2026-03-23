'use client';

interface DailyGoalRingProps {
  current: number;
  goal: number;
  label: string;
  size?: number;
}

export default function DailyGoalRing({ current, goal, label, size = 100 }: DailyGoalRingProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / goal, 1);
  const offset = circumference - progress * circumference;
  const isComplete = current >= goal;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-trail-200"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-700 ${isComplete ? 'text-forest-500' : 'text-forest-400'}`}
            style={{ animation: 'ring-fill 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-trail-700">{current}</span>
          <span className="text-xs text-trail-400">/ {goal}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-trail-600">{label}</span>
    </div>
  );
}
