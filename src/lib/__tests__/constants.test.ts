import { describe, it, expect } from 'vitest';
import { DIRECTIONS, CATEGORIES, QUALITY_LABELS } from '../constants';

describe('constants', () => {
  describe('DIRECTIONS', () => {
    it('should have 6 directions', () => {
      expect(DIRECTIONS).toHaveLength(6);
    });

    it('should cover all language pair combinations', () => {
      const values = DIRECTIONS.map(d => d.value);
      expect(values).toContain('NL->PL');
      expect(values).toContain('PL->NL');
      expect(values).toContain('EN->PL');
      expect(values).toContain('PL->EN');
      expect(values).toContain('NL->EN');
      expect(values).toContain('EN->NL');
    });

    it('should have matching from/to labels', () => {
      const nlToPl = DIRECTIONS.find(d => d.value === 'NL->PL');
      expect(nlToPl?.from).toBe('Dutch');
      expect(nlToPl?.to).toBe('Polish');
      expect(nlToPl?.fromKey).toBe('dutch');
      expect(nlToPl?.toKey).toBe('polish');
    });

    it('should have valid card language keys', () => {
      const validKeys = ['dutch', 'polish', 'english'];
      DIRECTIONS.forEach(d => {
        expect(validKeys).toContain(d.fromKey);
        expect(validKeys).toContain(d.toKey);
        expect(d.fromKey).not.toBe(d.toKey);
      });
    });
  });

  describe('CATEGORIES', () => {
    it('should have 5 categories', () => {
      expect(CATEGORIES).toHaveLength(5);
    });

    it('should include all required topics', () => {
      const slugs = CATEGORIES.map(c => c.slug);
      expect(slugs).toContain('food');
      expect(slugs).toContain('travel');
      expect(slugs).toContain('relationships');
      expect(slugs).toContain('hiking');
      expect(slugs).toContain('dogs');
    });

    it('should have unique slugs', () => {
      const slugs = CATEGORIES.map(c => c.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it('should have icons for all categories', () => {
      CATEGORIES.forEach(c => {
        expect(c.icon).toBeTruthy();
      });
    });
  });

  describe('QUALITY_LABELS', () => {
    it('should have 4 rating options', () => {
      expect(QUALITY_LABELS).toHaveLength(4);
    });

    it('should have quality values 1, 2, 4, 5', () => {
      const qualities = QUALITY_LABELS.map(q => q.quality);
      expect(qualities).toEqual([1, 2, 4, 5]);
    });

    it('should have labels for all ratings', () => {
      const labels = QUALITY_LABELS.map(q => q.label);
      expect(labels).toEqual(['Again', 'Hard', 'Good', 'Easy']);
    });
  });
});
