import { createClient } from '@/lib/supabase/client';
import type { Card, UserCardProgress } from '@/lib/types';

interface PrefetchEntry {
  deckId: string;
  direction: string;
  cards: Card[];
  progress: UserCardProgress[];
  timestamp: number;
}

let cache: PrefetchEntry | null = null;

const MAX_AGE_MS = 30_000; // 30 seconds — stale after that

export function prefetchCards(deckId: string, direction: string) {
  const supabase = createClient();

  // Fire and forget — don't block the caller
  Promise.all([
    supabase.auth.getUser(),
    supabase.from('cards').select('*').eq('deck_id', deckId),
  ]).then(async ([{ data: { user } }, { data: deckCards }]) => {
    if (!user || !deckCards?.length) return;

    const { data: progressData } = await supabase
      .from('user_card_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('direction', direction)
      .in('card_id', deckCards.map(c => c.id));

    cache = {
      deckId,
      direction,
      cards: deckCards,
      progress: progressData ?? [],
      timestamp: Date.now(),
    };
  });
}

export function consumePrefetchedCards(
  deckId: string,
  direction: string,
): { cards: Card[]; progress: UserCardProgress[] } | null {
  if (
    cache &&
    cache.deckId === deckId &&
    cache.direction === direction &&
    Date.now() - cache.timestamp < MAX_AGE_MS
  ) {
    const result = { cards: cache.cards, progress: cache.progress };
    cache = null; // consume once
    return result;
  }
  cache = null;
  return null;
}
