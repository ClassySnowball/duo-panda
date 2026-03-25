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

export const REVIEW_MODES = [
  { value: 'flip' as const, label: 'Flip', description: 'Flip cards to reveal' },
  { value: 'type' as const, label: 'Type', description: 'Type your answer' },
] as const;

export type ReviewMode = 'flip' | 'type';

export const DEFAULT_DAILY_GOAL_REVIEWS = 20;
export const DEFAULT_DAILY_GOAL_NEW_WORDS = 5;

// XP System
export const XP_PER_QUALITY: Record<number, number> = {
  1: 0,   // Again
  2: 5,   // Hard
  4: 10,  // Good
  5: 15,  // Easy
};

export const NEW_CARD_BONUS = 5;
export const DAILY_GOAL_BONUS = 25;

export const LEVELS = [
  { level: 1,  name: 'Chihuahua',      emoji: '🐕', xpRequired: 0 },
  { level: 2,  name: 'Toy Poodle',     emoji: '🐩', xpRequired: 100 },
  { level: 3,  name: 'Dachshund',      emoji: '🐕', xpRequired: 250 },
  { level: 4,  name: 'Maltipoo',       emoji: '🐩', xpRequired: 450 },
  { level: 5,  name: 'Corgi',          emoji: '🐕', xpRequired: 700 },
  { level: 6,  name: 'Beagle',         emoji: '🐕', xpRequired: 1000 },
  { level: 7,  name: 'Labradoodle',    emoji: '🐩', xpRequired: 1400 },
  { level: 8,  name: 'Border Collie',  emoji: '🐕', xpRequired: 1900 },
  { level: 9,  name: 'Labrador',       emoji: '🐕', xpRequired: 2500 },
  { level: 10, name: 'Great Dane',     emoji: '🐕', xpRequired: 3200 },
  { level: 11, name: 'Red Panda Cub',  emoji: '🐾', xpRequired: 4100 },
  { level: 12, name: 'Red Panda',      emoji: '🐼', xpRequired: 5200 },
  { level: 13, name: 'Giant Red Panda', emoji: '🐼', xpRequired: 6500 },
] as const;
