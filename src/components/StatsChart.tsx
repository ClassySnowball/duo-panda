'use client';

import { formatDate } from '@/lib/utils';

interface StatsChartProps {
  data: { date: string; count: number }[];
}

export default function StatsChart({ data }: StatsChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-2xl border border-trail-200 p-4">
      <h3 className="text-sm font-medium text-trail-600 mb-4">Cards reviewed (last 7 days)</h3>
      <div className="flex items-end gap-2 h-32">
        {data.map((day) => (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-trail-500">{day.count}</span>
            <div
              className="w-full bg-forest-400 rounded-t-md transition-all min-h-[4px]"
              style={{ height: `${(day.count / maxCount) * 100}%` }}
            />
            <span className="text-[10px] text-trail-400">{formatDate(day.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
