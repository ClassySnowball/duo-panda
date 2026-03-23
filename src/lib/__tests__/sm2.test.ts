import { describe, it, expect } from 'vitest';
import { sm2 } from '../sm2';

describe('SM-2 Algorithm', () => {
  describe('successful reviews (quality >= 3)', () => {
    it('should set interval to 1 day on first successful review', () => {
      const result = sm2({ quality: 4, easeFactor: 2.5, interval: 0, repetitions: 0 });
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
    });

    it('should set interval to 6 days on second successful review', () => {
      const result = sm2({ quality: 4, easeFactor: 2.5, interval: 1, repetitions: 1 });
      expect(result.interval).toBe(6);
      expect(result.repetitions).toBe(2);
    });

    it('should multiply interval by ease factor on subsequent reviews', () => {
      const result = sm2({ quality: 4, easeFactor: 2.5, interval: 6, repetitions: 2 });
      expect(result.interval).toBe(15); // round(6 * 2.5) = 15
      expect(result.repetitions).toBe(3);
    });

    it('should increase ease factor for quality 5 (Easy)', () => {
      const result = sm2({ quality: 5, easeFactor: 2.5, interval: 6, repetitions: 2 });
      expect(result.easeFactor).toBe(2.6);
    });

    it('should decrease ease factor for quality 3', () => {
      const result = sm2({ quality: 3, easeFactor: 2.5, interval: 6, repetitions: 2 });
      expect(result.easeFactor).toBe(2.36);
    });

    it('should keep ease factor for quality 4 (Good)', () => {
      const result = sm2({ quality: 4, easeFactor: 2.5, interval: 6, repetitions: 2 });
      expect(result.easeFactor).toBe(2.5);
    });
  });

  describe('failed reviews (quality < 3)', () => {
    it('should reset repetitions to 0 on failure', () => {
      const result = sm2({ quality: 1, easeFactor: 2.5, interval: 15, repetitions: 3 });
      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(0);
    });

    it('should reset interval to 0 on failure', () => {
      const result = sm2({ quality: 2, easeFactor: 2.5, interval: 30, repetitions: 5 });
      expect(result.interval).toBe(0);
      expect(result.repetitions).toBe(0);
    });

    it('should still update ease factor on failure', () => {
      const result = sm2({ quality: 1, easeFactor: 2.5, interval: 6, repetitions: 2 });
      expect(result.easeFactor).toBeLessThan(2.5);
    });
  });

  describe('ease factor bounds', () => {
    it('should not let ease factor go below 1.3', () => {
      const result = sm2({ quality: 0, easeFactor: 1.3, interval: 6, repetitions: 2 });
      expect(result.easeFactor).toBe(1.3);
    });

    it('should not let ease factor go below 1.3 even with repeated failures', () => {
      let ef = 2.5;
      for (let i = 0; i < 20; i++) {
        const result = sm2({ quality: 0, easeFactor: ef, interval: 0, repetitions: 0 });
        ef = result.easeFactor;
      }
      expect(ef).toBeGreaterThanOrEqual(1.3);
    });
  });

  describe('next review date', () => {
    it('should set next review to today for failed cards', () => {
      const before = new Date();
      const result = sm2({ quality: 1, easeFactor: 2.5, interval: 0, repetitions: 0 });
      const today = new Date();
      // nextReviewAt should be approximately now (same day)
      expect(result.nextReviewAt.toDateString()).toBe(today.toDateString());
    });

    it('should set next review to tomorrow for first success', () => {
      const result = sm2({ quality: 4, easeFactor: 2.5, interval: 0, repetitions: 0 });
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(result.nextReviewAt.toDateString()).toBe(tomorrow.toDateString());
    });

    it('should set next review to 6 days from now for second success', () => {
      const result = sm2({ quality: 4, easeFactor: 2.5, interval: 1, repetitions: 1 });
      const expected = new Date();
      expected.setDate(expected.getDate() + 6);
      expect(result.nextReviewAt.toDateString()).toBe(expected.toDateString());
    });
  });

  describe('progression through review stages', () => {
    it('should produce increasing intervals with consistent good ratings', () => {
      let ef = 2.5;
      let interval = 0;
      let reps = 0;
      const intervals: number[] = [];

      for (let i = 0; i < 5; i++) {
        const result = sm2({ quality: 4, easeFactor: ef, interval, repetitions: reps });
        ef = result.easeFactor;
        interval = result.interval;
        reps = result.repetitions;
        intervals.push(interval);
      }

      // Intervals should be increasing: 1, 6, 15, 38, 94 (approximately)
      expect(intervals[0]).toBe(1);
      expect(intervals[1]).toBe(6);
      for (let i = 2; i < intervals.length; i++) {
        expect(intervals[i]).toBeGreaterThan(intervals[i - 1]);
      }
    });
  });
});
