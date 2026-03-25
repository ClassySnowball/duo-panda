import { describe, it, expect } from 'vitest';
import { levenshtein, normalizeForComparison, deriveQuality } from '../levenshtein';

describe('levenshtein', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshtein('hello', 'hello')).toBe(0);
  });

  it('returns length of other string when one is empty', () => {
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('abc', '')).toBe(3);
  });

  it('computes single character difference', () => {
    expect(levenshtein('cat', 'car')).toBe(1);
  });

  it('computes insertion distance', () => {
    expect(levenshtein('pies', 'piesy')).toBe(1);
  });

  it('handles Polish diacritics as distinct characters', () => {
    expect(levenshtein('ś', 's')).toBe(1);
    expect(levenshtein('środek', 'srodek')).toBe(1);
    expect(levenshtein('ść', 'sc')).toBe(2);
  });

  it('handles completely different strings', () => {
    expect(levenshtein('abc', 'xyz')).toBe(3);
  });
});

describe('normalizeForComparison', () => {
  it('trims whitespace', () => {
    expect(normalizeForComparison('  hello  ')).toBe('hello');
  });

  it('lowercases', () => {
    expect(normalizeForComparison('Hello World')).toBe('hello world');
  });

  it('collapses multiple spaces', () => {
    expect(normalizeForComparison('dobry   wieczór')).toBe('dobry wieczór');
  });

  it('preserves diacritics', () => {
    expect(normalizeForComparison('Ąćę')).toBe('ąćę');
  });
});

describe('deriveQuality', () => {
  it('returns wrong for empty input', () => {
    expect(deriveQuality('', 'pies')).toEqual({ quality: 1, matchType: 'wrong' });
    expect(deriveQuality('   ', 'pies')).toEqual({ quality: 1, matchType: 'wrong' });
  });

  it('returns exact for case-insensitive match', () => {
    expect(deriveQuality('Pies', 'pies')).toEqual({ quality: 5, matchType: 'exact' });
  });

  it('returns exact with trimmed whitespace', () => {
    expect(deriveQuality('  pies  ', 'pies')).toEqual({ quality: 5, matchType: 'exact' });
  });

  it('returns exact for multi-word match', () => {
    expect(deriveQuality('dobry wieczór', 'Dobry wieczór')).toEqual({ quality: 5, matchType: 'exact' });
  });

  it('returns close for 1 character typo', () => {
    expect(deriveQuality('peis', 'pies')).toEqual({ quality: 4, matchType: 'close' });
  });

  it('returns close for missing diacritic', () => {
    expect(deriveQuality('srodek', 'środek')).toEqual({ quality: 4, matchType: 'close' });
  });

  it('returns close for longer word with small edit distance', () => {
    expect(deriveQuality('goedenavod', 'goedenavond')).toEqual({ quality: 4, matchType: 'close' });
  });

  it('returns partial for some character overlap', () => {
    // "pies" has 4 chars, need >=2 overlap for partial
    expect(deriveQuality('pxes', 'pies')).toEqual({ quality: 4, matchType: 'close' });
  });

  it('returns wrong for completely different input', () => {
    expect(deriveQuality('xyz', 'pies')).toEqual({ quality: 1, matchType: 'wrong' });
  });

  it('returns wrong for gibberish on longer words', () => {
    expect(deriveQuality('aaaa', 'goedenavond')).toEqual({ quality: 1, matchType: 'wrong' });
  });
});
