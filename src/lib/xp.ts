import { XP_PER_QUALITY, NEW_CARD_BONUS, LEVELS } from './constants';

export function calculateXPForReview(quality: number, isNew: boolean): number {
  const base = XP_PER_QUALITY[quality] ?? 0;
  const bonus = isNew && quality >= 3 ? NEW_CARD_BONUS : 0;
  return base + bonus;
}

export interface LevelInfo {
  level: number;
  name: string;
  emoji: string;
  xpInLevel: number;
  xpForNextLevel: number;
  nextName: string | null;
  nextEmoji: string | null;
}

export function getLevelInfo(totalXP: number): LevelInfo {
  let currentIndex = 0;

  for (let i = 1; i < LEVELS.length; i++) {
    if (totalXP >= LEVELS[i].xpRequired) {
      currentIndex = i;
    } else {
      break;
    }
  }

  const current = LEVELS[currentIndex];
  const next = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

  const xpInLevel = totalXP - current.xpRequired;
  const xpForNextLevel = next ? next.xpRequired - current.xpRequired : 0;

  return {
    level: current.level,
    name: current.name,
    emoji: current.emoji,
    xpInLevel,
    xpForNextLevel,
    nextName: next?.name ?? null,
    nextEmoji: next?.emoji ?? null,
  };
}
