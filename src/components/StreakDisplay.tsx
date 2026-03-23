interface StreakDisplayProps {
  streak: number;
  size?: 'sm' | 'lg';
}

export default function StreakDisplay({ streak, size = 'sm' }: StreakDisplayProps) {
  const isActive = streak > 0;

  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className={`text-4xl ${isActive ? '' : 'grayscale opacity-50'}`}>🔥</span>
        <span className="text-2xl font-bold text-trail-700">{streak}</span>
        <span className="text-sm text-trail-500">day streak</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-lg ${isActive ? '' : 'grayscale opacity-50'}`}>🔥</span>
      <span className="font-bold text-trail-700">{streak}</span>
    </div>
  );
}
