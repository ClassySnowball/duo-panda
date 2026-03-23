'use client';

import { QUALITY_LABELS } from '@/lib/constants';

interface QualityRatingProps {
  onRate: (quality: number) => void;
  disabled?: boolean;
}

export default function QualityRating({ onRate, disabled }: QualityRatingProps) {
  return (
    <div className="grid grid-cols-4 gap-2 w-full max-w-sm mx-auto">
      {QUALITY_LABELS.map(({ quality, label, color, description }) => (
        <button
          key={quality}
          onClick={() => onRate(quality)}
          disabled={disabled}
          className={`${color} text-white rounded-xl py-3 px-2 flex flex-col items-center gap-0.5 transition-all active:scale-95 disabled:opacity-50`}
        >
          <span className="text-sm font-bold">{label}</span>
          <span className="text-[10px] opacity-80">{description}</span>
        </button>
      ))}
    </div>
  );
}
