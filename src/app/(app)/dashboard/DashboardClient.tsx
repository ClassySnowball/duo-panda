'use client';

import { useState } from 'react';
import Link from 'next/link';
import StreakDisplay from '@/components/StreakDisplay';
import DailyGoalRing from '@/components/DailyGoalRing';
import DirectionPicker from '@/components/DirectionPicker';
import DeckCard from '@/components/DeckCard';
import XPProgressBar from '@/components/XPProgressBar';
import { getLevelInfo } from '@/lib/xp';
import type { Direction } from '@/lib/constants';
import type { Deck } from '@/lib/types';

interface DashboardClientProps {
  greeting: string;
  displayName: string;
  streak: number;
  cardsReviewed: number;
  newCardsLearned: number;
  dailyGoalReviews: number;
  dailyGoalNewWords: number;
  preferredDirection: string;
  totalXP: number;
  decks: Deck[];
}

export default function DashboardClient({
  greeting,
  displayName,
  streak,
  cardsReviewed,
  newCardsLearned,
  dailyGoalReviews,
  dailyGoalNewWords,
  preferredDirection,
  totalXP,
  decks,
}: DashboardClientProps) {
  const [direction, setDirection] = useState<Direction>(preferredDirection as Direction);
  const levelInfo = getLevelInfo(totalXP);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-trail-700">{greeting}, {displayName}</h1>
          <p className="text-sm text-trail-500">Keep exploring new words!</p>
        </div>
        <StreakDisplay streak={streak} />
      </div>

      {/* Daily Goals */}
      <div className="bg-white rounded-2xl border border-trail-200 p-6">
        <h2 className="text-sm font-medium text-trail-500 mb-4">Today&apos;s Progress</h2>
        <div className="flex justify-around">
          <DailyGoalRing
            current={cardsReviewed}
            goal={dailyGoalReviews}
            label="Reviews"
          />
          <DailyGoalRing
            current={newCardsLearned}
            goal={dailyGoalNewWords}
            label="New Words"
          />
        </div>
      </div>

      {/* XP & Level */}
      <XPProgressBar levelInfo={levelInfo} totalXP={totalXP} />

      {/* Direction Picker */}
      <div>
        <h2 className="text-sm font-medium text-trail-500 mb-2">Practice direction</h2>
        <DirectionPicker value={direction} onChange={setDirection} compact />
      </div>

      {/* Quick Start */}
      {decks.length > 0 && (
        <Link
          href={`/review/${decks[0].id}?direction=${direction}`}
          className="block bg-forest-500 hover:bg-forest-600 text-white text-center py-4 rounded-2xl font-bold text-lg transition-colors shadow-sm"
        >
          🐼 Start Learning
        </Link>
      )}

      {/* Recent Decks */}
      {decks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-trail-500">Your Decks</h2>
            <Link href="/decks" className="text-sm text-forest-500 hover:text-forest-600">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {decks.slice(0, 4).map((deck) => (
              <DeckCard key={deck.id} deck={deck} category={deck.category} />
            ))}
          </div>
        </div>
      )}

      {decks.length === 0 && (
        <div className="bg-white rounded-2xl border border-trail-200 p-8 text-center">
          <div className="text-4xl mb-3">🌱</div>
          <h3 className="font-bold text-trail-700 mb-1">No decks yet</h3>
          <p className="text-sm text-trail-500 mb-4">Seed the database to get started with pre-built vocabulary.</p>
        </div>
      )}
    </div>
  );
}
