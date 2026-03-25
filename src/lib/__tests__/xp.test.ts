import { describe, it, expect } from 'vitest';
import { calculateXPForReview, getLevelInfo } from '../xp';

describe('calculateXPForReview', () => {
  it('returns 0 for Again (quality 1)', () => {
    expect(calculateXPForReview(1, false)).toBe(0);
  });

  it('returns 5 for Hard (quality 2)', () => {
    expect(calculateXPForReview(2, false)).toBe(5);
  });

  it('returns 10 for Good (quality 4)', () => {
    expect(calculateXPForReview(4, false)).toBe(10);
  });

  it('returns 15 for Easy (quality 5)', () => {
    expect(calculateXPForReview(5, false)).toBe(15);
  });

  it('adds new card bonus for quality >= 3', () => {
    expect(calculateXPForReview(4, true)).toBe(15); // 10 + 5
    expect(calculateXPForReview(5, true)).toBe(20); // 15 + 5
  });

  it('does not add new card bonus for quality < 3', () => {
    expect(calculateXPForReview(1, true)).toBe(0);
    expect(calculateXPForReview(2, true)).toBe(5);
  });
});

describe('getLevelInfo', () => {
  it('returns level 1 (Chihuahua) for 0 XP', () => {
    const info = getLevelInfo(0);
    expect(info.level).toBe(1);
    expect(info.name).toBe('Chihuahua');
    expect(info.emoji).toBe('🐕');
    expect(info.xpInLevel).toBe(0);
    expect(info.xpForNextLevel).toBe(100);
    expect(info.nextName).toBe('Toy Poodle');
  });

  it('returns level 2 (Toy Poodle) at 100 XP', () => {
    const info = getLevelInfo(100);
    expect(info.level).toBe(2);
    expect(info.name).toBe('Toy Poodle');
    expect(info.xpInLevel).toBe(0);
    expect(info.xpForNextLevel).toBe(150); // 250 - 100
  });

  it('returns correct progress within a level', () => {
    const info = getLevelInfo(175); // halfway through level 2 (100-250)
    expect(info.level).toBe(2);
    expect(info.xpInLevel).toBe(75);
    expect(info.xpForNextLevel).toBe(150);
  });

  it('returns level 7 (Labradoodle) at 1400 XP', () => {
    const info = getLevelInfo(1400);
    expect(info.level).toBe(7);
    expect(info.name).toBe('Labradoodle');
    expect(info.emoji).toBe('🐩');
  });

  it('returns level 11 (Red Panda Cub) at 4100 XP', () => {
    const info = getLevelInfo(4100);
    expect(info.level).toBe(11);
    expect(info.name).toBe('Red Panda Cub');
    expect(info.emoji).toBe('🐾');
  });

  it('returns max level (Giant Red Panda) at 6500+ XP', () => {
    const info = getLevelInfo(9999);
    expect(info.level).toBe(13);
    expect(info.name).toBe('Giant Red Panda');
    expect(info.xpForNextLevel).toBe(0);
    expect(info.nextName).toBeNull();
    expect(info.nextEmoji).toBeNull();
  });

  it('stays at level 1 just below level 2 threshold', () => {
    const info = getLevelInfo(99);
    expect(info.level).toBe(1);
    expect(info.xpInLevel).toBe(99);
  });
});
