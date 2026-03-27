'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sm2 } from '@/lib/sm2';
import { DIRECTIONS } from '@/lib/constants';
import { calculateXPForReview, getLevelInfo } from '@/lib/xp';
import { consumePrefetchedCards } from '@/lib/card-prefetch';
import type { LevelInfo } from '@/lib/xp';
import type { ReviewCard, Card, UserCardProgress } from '@/lib/types';

interface UseReviewSessionOptions {
  deckId: string;
  direction: string;
  newCardsLimit: number;
}

interface SessionStats {
  reviewed: number;
  newLearned: number;
  correct: number;
  total: number;
}

export function useReviewSession({ deckId, direction, newCardsLimit }: UseReviewSessionOptions) {
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stats, setStats] = useState<SessionStats>({ reviewed: 0, newLearned: 0, correct: 0, total: 0 });
  const reviewedCardIds = useRef<Set<string>>(new Set());
  const [sessionXP, setSessionXP] = useState(0);
  const [lastXPGain, setLastXPGain] = useState(0);
  const [levelUp, setLevelUp] = useState<LevelInfo | null>(null);

  const supabase = createClient();
  const dir = DIRECTIONS.find(d => d.value === direction);

  const loadCards = useCallback(async () => {
    setIsLoading(true);

    // Check for prefetched data first
    const prefetched = consumePrefetchedCards(deckId, direction);

    let deckCards: Card[] | null;
    let progressData: UserCardProgress[] | null;

    if (prefetched) {
      deckCards = prefetched.cards;
      progressData = prefetched.progress;
    } else {
      // Fallback: fetch from DB
      const [{ data: { user } }, { data: fetchedCards }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('cards').select('*').eq('deck_id', deckId),
      ]);

      if (!user) return;
      deckCards = fetchedCards;

      if (!deckCards?.length) {
        setIsLoading(false);
        setIsComplete(true);
        return;
      }

      const { data: fetchedProgress } = await supabase
        .from('user_card_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('direction', direction)
        .in('card_id', deckCards.map(c => c.id));

      progressData = fetchedProgress;
    }

    if (!deckCards?.length) {
      setIsLoading(false);
      setIsComplete(true);
      return;
    }

    const progressMap = new Map<string, UserCardProgress>();
    progressData?.forEach(p => progressMap.set(p.card_id, p));

    const now = new Date();
    const dueCards: ReviewCard[] = [];
    const newCards: ReviewCard[] = [];

    for (const card of deckCards) {
      // Skip cards missing a language needed for this direction
      if (!card[dir?.fromKey ?? 'dutch'] || !card[dir?.toKey ?? 'polish']) continue;

      const progress = progressMap.get(card.id);
      if (progress) {
        if (new Date(progress.next_review_at) <= now) {
          dueCards.push({ ...card, progress, isNew: false });
        }
      } else {
        newCards.push({ ...card, isNew: true });
      }
    }

    // Sort due cards by next_review_at (most overdue first)
    dueCards.sort((a, b) => {
      const aDate = a.progress ? new Date(a.progress.next_review_at).getTime() : 0;
      const bDate = b.progress ? new Date(b.progress.next_review_at).getTime() : 0;
      return aDate - bDate;
    });

    // Take limited new cards
    const selectedNew = newCards.slice(0, newCardsLimit);

    const queue = [...dueCards, ...selectedNew];
    // Shuffle slightly to mix due and new
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }

    setCards(queue);
    setStats(s => ({ ...s, total: queue.length }));
    setIsLoading(false);

    if (queue.length === 0) {
      setIsComplete(true);
    }
  }, [deckId, direction, newCardsLimit, supabase]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const currentCard = cards[currentIndex];

  const handleRate = useCallback(async (quality: number) => {
    if (!currentCard) return;

    // Track unique reviews synchronously
    const isFirstReview = !reviewedCardIds.current.has(currentCard.id);
    reviewedCardIds.current.add(currentCard.id);

    // Compute XP synchronously
    const xpEarned = calculateXPForReview(quality, currentCard.isNew);

    // --- Update UI immediately ---
    setStats(s => ({
      ...s,
      reviewed: s.reviewed + (isFirstReview ? 1 : 0),
      newLearned: s.newLearned + (currentCard.isNew ? 1 : 0),
      correct: s.correct + (quality >= 3 ? 1 : 0),
    }));

    if (xpEarned > 0) {
      setSessionXP(prev => prev + xpEarned);
      setLastXPGain(xpEarned);
    }

    if (quality < 3) {
      setCards(prev => [...prev, { ...currentCard, isNew: false }]);
    }

    setIsFlipped(false);
    setHasRevealed(false);
    if (currentIndex + 1 >= cards.length && quality >= 3) {
      setIsComplete(true);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
        setIsTransitioning(false);
      }, 60);
    }

    // --- Persist to DB in background (fire-and-forget) ---
    const card = currentCard;
    const progress = card.progress;
    const result = sm2({
      quality,
      easeFactor: progress?.ease_factor ?? 2.5,
      interval: progress?.interval_days ?? 0,
      repetitions: progress?.repetitions ?? 0,
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      const now = new Date().toISOString();
      const today = now.split('T')[0];

      // Fire all independent writes in parallel
      Promise.all([
        supabase.from('user_card_progress').upsert({
          user_id: user.id,
          card_id: card.id,
          direction,
          ease_factor: result.easeFactor,
          interval_days: result.interval,
          repetitions: result.repetitions,
          next_review_at: result.nextReviewAt.toISOString(),
          last_reviewed_at: now,
        }, { onConflict: 'user_id,card_id,direction' }),

        supabase.from('review_log').insert({
          user_id: user.id,
          card_id: card.id,
          direction,
          quality,
        }),

        // Daily stats
        supabase.from('daily_stats')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .single()
          .then(({ data: existingStats }) => {
            if (existingStats) {
              return supabase.from('daily_stats').update({
                cards_reviewed: existingStats.cards_reviewed + (isFirstReview ? 1 : 0),
                new_cards_learned: existingStats.new_cards_learned + (card.isNew ? 1 : 0),
              }).eq('id', existingStats.id);
            } else {
              return supabase.from('daily_stats').insert({
                user_id: user.id,
                date: today,
                cards_reviewed: isFirstReview ? 1 : 0,
                new_cards_learned: card.isNew ? 1 : 0,
              });
            }
          }),

        // Streak
        supabase.from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single()
          .then(({ data: streak }) => {
            if (streak) {
              const lastDate = streak.last_review_date;
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split('T')[0];

              let newStreak = streak.current_streak;
              if (lastDate === today) {
                // Already reviewed today
              } else if (lastDate === yesterdayStr) {
                newStreak += 1;
              } else {
                newStreak = 1;
              }

              return supabase.from('user_streaks').update({
                current_streak: newStreak,
                longest_streak: Math.max(newStreak, streak.longest_streak),
                last_review_date: today,
              }).eq('id', streak.id);
            } else {
              return supabase.from('user_streaks').insert({
                user_id: user.id,
                current_streak: 1,
                longest_streak: 1,
                last_review_date: today,
              });
            }
          }),

        // XP
        xpEarned > 0
          ? supabase.from('user_xp')
              .select('*')
              .eq('user_id', user.id)
              .single()
              .then(({ data: currentXP }) => {
                const oldTotal = currentXP?.total_xp ?? 0;
                const newTotal = oldTotal + xpEarned;
                const newLevelInfo = getLevelInfo(newTotal);
                const oldLevelInfo = getLevelInfo(oldTotal);

                if (newLevelInfo.level > oldLevelInfo.level) {
                  setLevelUp(newLevelInfo);
                }

                return supabase.from('user_xp').upsert({
                  user_id: user.id,
                  total_xp: newTotal,
                  current_level: newLevelInfo.level,
                  updated_at: now,
                }, { onConflict: 'user_id' });
              })
          : Promise.resolve(),
      ]);
    });
  }, [currentCard, currentIndex, cards.length, direction, supabase]);

  const flip = useCallback(() => {
    setIsFlipped(f => !f);
    setHasRevealed(true);
  }, []);

  const dismissLevelUp = useCallback(() => setLevelUp(null), []);

  return {
    currentCard,
    isFlipped,
    hasRevealed,
    isLoading,
    isComplete,
    isTransitioning,
    stats,
    currentIndex,
    totalCards: cards.length,
    flip,
    handleRate,
    fromLang: dir?.from ?? '',
    toLang: dir?.to ?? '',
    fromKey: dir?.fromKey ?? 'dutch',
    toKey: dir?.toKey ?? 'polish',
    sessionXP,
    lastXPGain,
    levelUp,
    dismissLevelUp,
  };
}
