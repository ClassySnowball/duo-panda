export const DIRECTIONS = [
  { value: 'NL->PL', from: 'Dutch', to: 'Polish', fromKey: 'dutch' as const, toKey: 'polish' as const },
  { value: 'PL->NL', from: 'Polish', to: 'Dutch', fromKey: 'polish' as const, toKey: 'dutch' as const },
  { value: 'EN->PL', from: 'English', to: 'Polish', fromKey: 'english' as const, toKey: 'polish' as const },
  { value: 'PL->EN', from: 'Polish', to: 'English', fromKey: 'polish' as const, toKey: 'english' as const },
  { value: 'NL->EN', from: 'Dutch', to: 'English', fromKey: 'dutch' as const, toKey: 'english' as const },
  { value: 'EN->NL', from: 'English', to: 'Dutch', fromKey: 'english' as const, toKey: 'dutch' as const },
] as const;

export type Direction = typeof DIRECTIONS[number]['value'];
export type CardLanguageKey = 'dutch' | 'polish' | 'english';

export const CATEGORIES = [
  { name: 'Food', slug: 'food', icon: '🍽️', description: 'Food, drinks, cooking, and dining' },
  { name: 'Travel', slug: 'travel', icon: '✈️', description: 'Transport, directions, and accommodation' },
  { name: 'Relationships', slug: 'relationships', icon: '❤️', description: 'Family, emotions, and social life' },
  { name: 'Hiking', slug: 'hiking', icon: '🥾', description: 'Nature, trails, and outdoor gear' },
  { name: 'Dogs', slug: 'dogs', icon: '🐕', description: 'Commands, care, and breeds' },
] as const;

export const QUALITY_LABELS = [
  { quality: 1, label: 'Again', color: 'bg-rust-500 hover:bg-rust-600', description: 'No idea' },
  { quality: 2, label: 'Hard', color: 'bg-trail-400 hover:bg-trail-500', description: 'Struggled' },
  { quality: 4, label: 'Good', color: 'bg-forest-400 hover:bg-forest-500', description: 'Got it' },
  { quality: 5, label: 'Easy', color: 'bg-forest-600 hover:bg-forest-700', description: 'Easy!' },
] as const;

export const DEFAULT_DAILY_GOAL_REVIEWS = 20;
export const DEFAULT_DAILY_GOAL_NEW_WORDS = 5;
