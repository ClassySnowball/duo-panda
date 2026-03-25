'use client';

import type { LevelInfo } from '@/lib/xp';

interface LevelUpModalProps {
  levelInfo: LevelInfo;
  onDismiss: () => void;
}

export default function LevelUpModal({ levelInfo, onDismiss }: LevelUpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 mx-6 text-center shadow-xl max-w-sm w-full">
        <div className="text-6xl mb-4">{levelInfo.emoji}</div>
        <h2 className="text-xl font-bold text-trail-700 mb-1">Level Up!</h2>
        <p className="text-trail-500 mb-6">
          You reached Level {levelInfo.level} — <span className="font-semibold text-trail-700">{levelInfo.name}</span>
        </p>
        <button
          onClick={onDismiss}
          className="bg-forest-500 hover:bg-forest-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
