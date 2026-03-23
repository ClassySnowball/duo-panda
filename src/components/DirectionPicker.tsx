'use client';

import { DIRECTIONS, type Direction } from '@/lib/constants';

interface DirectionPickerProps {
  value: Direction;
  onChange: (direction: Direction) => void;
  compact?: boolean;
}

export default function DirectionPicker({ value, onChange, compact }: DirectionPickerProps) {
  if (compact) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Direction)}
        className="bg-trail-100 text-trail-700 text-sm rounded-lg px-3 py-1.5 border border-trail-200 focus:ring-2 focus:ring-forest-400 focus:outline-none"
      >
        {DIRECTIONS.map((d) => (
          <option key={d.value} value={d.value}>
            {d.from} → {d.to}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {DIRECTIONS.map((d) => (
        <button
          key={d.value}
          onClick={() => onChange(d.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            value === d.value
              ? 'bg-forest-500 text-white'
              : 'bg-trail-100 text-trail-600 hover:bg-trail-200'
          }`}
        >
          {d.from} → {d.to}
        </button>
      ))}
    </div>
  );
}
