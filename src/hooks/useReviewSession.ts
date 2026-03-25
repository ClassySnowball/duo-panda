'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sm2 } from '@/lib/sm2';
import { DIRECTIONS } from '@/lib/constants';
import { calculateXPForReview, getLevelInfo } from '@/lib/xp';
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
  const [sessionXP, setSessionXP] = useState(0);
  const [lastXPGain, setLastXPGain] = useState(0);
  const [levelUp, setLevelUp] = useState<LevelInfo | null>(null);

  const supabase = createClient();
  const dir = DIRECTIONS.find(d => d.value === direction);

  const loadCards = useCallback(async () => {
    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get all cards in the deck
    const { data: deckCards } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId);

    if (!deckCards?.length) {
      setIsLoading(false);
      setIsComplete(true);
      return;
    }

    // Get user progress for these cards in this direction
    const { data: progressData } = await supabase
      .from('user_card_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('direction', direction)
      .in('card_id', deckCards.map(c => c.id));

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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const progress = currentCard.progress;
    const result = sm2({
      quality,
      easeFactor: progress?.ease_factor ?? 2.5,
      interval: progress?.interval_days ?? 0,
      repetitions: progress?.repetitions ?? 0,
    });

    // Upsert progress
    await supabase.from('user_card_progress').upsert({
      user_id: user.id,
      card_id: currentCard.id,
      direction,
      ease_factor: result.easeFactor,
      interval_days: result.interval,
      repetitions: result.repetitions,
      next_review_at: result.nextReviewAt.toISOString(),
      last_reviewed_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,card_id,direction',
    });

    // Log the review
    await supabase.from('review_log').insert({
      user_id: user.id,
      card_id: currentCard.id,
      direction,
      quality,
    });

    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    const { data: existingStats } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (existingStats) {
      await supabase.from('daily_stats').update({
        cards_reviewed: existingStats.cards_reviewed + 1,
        new_cards_learned: existingStats.new_cards_learned + (currentCard.isNew ? 1 : 0),
      }).eq('id', existingStats.id);
    } else {
      await supabase.from('daily_stats').insert({
        user_id: user.id,
        date: today,
        cards_reviewed: 1,
        new_cards_learned: currentCard.isNew ? 1 : 0,
      });
    }

    // Update streak
    const { data: streak } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (streak) {
      const lastDate = streak.last_review_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = streak.current_streak;
      if (lastDate === today) {
        // Already reviewed today, no change
      } else if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      await supabase.from('user_streaks').update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak),
        last_review_date: today,
      }).eq('id', streak.id);
    } else {
      await supabase.from('user_streaks').insert({
        user_id: user.id,
        current_streak: 1,
        longest_streak: 1,
        last_review_date: today,
      });
    }

    // Update XP
    const xpEarned = calculateXPForReview(quality, currentCard.isNew);
    if (xpEarned > 0) {
      const { data: currentXP } = await supabase
        .from('user_xp')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const oldTotal = currentXP?.total_xp ?? 0;
      const newTotal = oldTotal + xpEarned;
      const oldLevelInfo = getLevelInfo(oldTotal);
      const newLevelInfo = getLevelInfo(newTotal);

      await supabase.from('user_xp').upsert({
        user_id: user.id,
        total_xp: newTotal,
        current_level: newLevelInfo.level,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

      setSessionXP(prev => prev + xpEarned);
      setLastXPGain(xpEarned);

      if (newLevelInfo.level > oldLevelInfo.level) {
        setLevelUp(newLevelInfo);
      }
    }

    // Update session stats
    setStats(s => ({
      ...s,
      reviewed: s.reviewed + 1,
      newLearned: s.newLearned + (currentCard.isNew ? 1 : 0),
      correct: s.correct + (quality >= 3 ? 1 : 0),
    }));

    // If failed, re-queue at end
    if (quality < 3) {
      setCards(prev => [...prev, { ...currentCard, isNew: false }]);
    }

    // Move to next — delay so flip animation resets before showing new card
    setIsFlipped(false);
    setHasRevealed(false);
    if (currentIndex + 1 >= cards.length && quality >= 3) {
      setIsComplete(true);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
        setIsTransitioning(false);
      }, 300);
    }
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
