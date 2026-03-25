'use client';

import { REVIEW_MODES, type ReviewMode } from '@/lib/constants';

interface ModePickerProps {
  value: ReviewMode;
  onChange: (mode: ReviewMode) => void;
}

export default function ModePicker({ value, onChange }: ModePickerProps) {
  return (
    <div className="flex gap-2">
      {REVIEW_MODES.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            value === m.value
              ? 'bg-forest-500 text-white'
              : 'bg-trail-100 text-trail-600 hover:bg-trail-200'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
