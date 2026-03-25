export function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Use two-row DP for O(min(m,n)) space
  if (a.length > b.length) [a, b] = [b, a];

  let prev = Array.from({ length: a.length + 1 }, (_, i) => i);
  let curr = new Array(a.length + 1);

  for (let j = 1; j <= b.length; j++) {
    curr[0] = j;
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[i] = Math.min(
        prev[i] + 1,      // deletion
        curr[i - 1] + 1,  // insertion
        prev[i - 1] + cost // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[a.length];
}

export function normalizeForComparison(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

export type MatchType = 'exact' | 'close' | 'partial' | 'wrong';

export interface QualityResult {
  quality: number;
  matchType: MatchType;
}

export function deriveQuality(userAnswer: string, correctAnswer: string): QualityResult {
  const normalized = normalizeForComparison(userAnswer);
  const correct = normalizeForComparison(correctAnswer);

  if (normalized.length === 0) {
    return { quality: 1, matchType: 'wrong' };
  }

  if (normalized === correct) {
    return { quality: 5, matchType: 'exact' };
  }

  const distance = levenshtein(normalized, correct);
  const threshold = Math.max(2, Math.ceil(correct.length * 0.2));

  if (distance <= threshold) {
    return { quality: 4, matchType: 'close' };
  }

  // Character overlap ratio
  const correctChars = new Map<string, number>();
  for (const ch of correct) {
    correctChars.set(ch, (correctChars.get(ch) || 0) + 1);
  }
  let overlap = 0;
  const usedChars = new Map<string, number>();
  for (const ch of normalized) {
    const available = (correctChars.get(ch) || 0) - (usedChars.get(ch) || 0);
    if (available > 0) {
      overlap++;
      usedChars.set(ch, (usedChars.get(ch) || 0) + 1);
    }
  }

  if (overlap >= correct.length * 0.5) {
    return { quality: 2, matchType: 'partial' };
  }

  return { quality: 1, matchType: 'wrong' };
}

export const MATCH_LABELS: Record<MatchType, { label: string; color: string }> = {
  exact: { label: 'Exact match!', color: 'text-forest-500' },
  close: { label: 'Close enough!', color: 'text-amber-500' },
  partial: { label: 'Partially correct', color: 'text-rust-400' },
  wrong: { label: 'Incorrect', color: 'text-rust-500' },
};
