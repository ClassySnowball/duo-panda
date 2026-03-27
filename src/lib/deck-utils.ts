import type { Deck } from './types';

export function getDeckDisplayName(deck: Deck, preferredDirection?: string): string {
  if (!preferredDirection) return deck.name;

  const fromLang = preferredDirection.split('->')[0];
  const langMap: Record<string, 'name_nl' | 'name_pl' | 'name_en'> = {
    NL: 'name_nl',
    PL: 'name_pl',
    EN: 'name_en',
  };

  const field = langMap[fromLang];
  if (field && deck[field]) return deck[field] as string;
  return deck.name;
}
