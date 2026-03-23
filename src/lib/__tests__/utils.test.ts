import { describe, it, expect, vi } from 'vitest';
import { getToday, formatDate, getGreeting, pluralize } from '../utils';

describe('utils', () => {
  describe('getToday', () => {
    it('should return a date string in YYYY-MM-DD format', () => {
      const today = getToday();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return today\'s date', () => {
      const today = getToday();
      const now = new Date();
      const expected = now.toISOString().split('T')[0];
      expect(today).toBe(expected);
    });
  });

  describe('formatDate', () => {
    it('should format a date string', () => {
      const formatted = formatDate('2026-01-15');
      expect(formatted).toBe('Jan 15');
    });

    it('should format a Date object', () => {
      const formatted = formatDate(new Date('2026-06-01'));
      // Note: month formatting can vary by locale
      expect(formatted).toContain('1');
    });
  });

  describe('getGreeting', () => {
    it('should return a string greeting', () => {
      const greeting = getGreeting();
      expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(greeting);
    });

    it('should return "Good morning" before noon', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-23T09:00:00'));
      expect(getGreeting()).toBe('Good morning');
      vi.useRealTimers();
    });

    it('should return "Good afternoon" between noon and 5pm', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-23T14:00:00'));
      expect(getGreeting()).toBe('Good afternoon');
      vi.useRealTimers();
    });

    it('should return "Good evening" after 5pm', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-23T20:00:00'));
      expect(getGreeting()).toBe('Good evening');
      vi.useRealTimers();
    });
  });

  describe('pluralize', () => {
    it('should return singular for count 1', () => {
      expect(pluralize(1, 'card')).toBe('card');
    });

    it('should return plural for count 0', () => {
      expect(pluralize(0, 'card')).toBe('cards');
    });

    it('should return plural for count > 1', () => {
      expect(pluralize(5, 'card')).toBe('cards');
    });

    it('should use custom plural form', () => {
      expect(pluralize(2, 'child', 'children')).toBe('children');
    });

    it('should use singular with custom plural for count 1', () => {
      expect(pluralize(1, 'child', 'children')).toBe('child');
    });
  });
});
