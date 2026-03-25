'use client';

import type { LevelInfo } from '@/lib/xp';

interface XPProgressBarProps {
  levelInfo: LevelInfo;
  totalXP: number;
}

export default function XPProgressBar({ levelInfo, totalXP }: XPProgressBarProps) {
  const progress = levelInfo.xpForNextLevel > 0
    ? Math.min(levelInfo.xpInLevel / levelInfo.xpForNextLevel, 1)
    : 1;

  const isMaxLevel = !levelInfo.nextName;

  return (
    <div className="bg-white rounded-2xl border border-trail-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{levelInfo.emoji}</span>
          <div>
            <span className="text-sm font-semibold text-trail-700">Lv.{levelInfo.level} {levelInfo.name}</span>
          </div>
        </div>
        <span className="text-xs text-trail-400">{totalXP.toLocaleString()} XP</span>
      </div>

      <div className="h-2.5 bg-trail-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-forest-500 rounded-full transition-all duration-700"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {!isMaxLevel && (
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-trail-400">
            {levelInfo.xpInLevel} / {levelInfo.xpForNextLevel} XP
          </span>
          <span className="text-xs text-trail-400">
            Next: {levelInfo.nextEmoji} {levelInfo.nextName}
          </span>
        </div>
      )}
      {isMaxLevel && (
        <p className="text-xs text-forest-500 mt-1.5 font-medium">Max level reached!</p>
      )}
    </div>
  );
}
