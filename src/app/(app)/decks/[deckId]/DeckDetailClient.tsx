'use client';

import { useState } from 'react';
import Link from 'next/link';
import DirectionPicker from '@/components/DirectionPicker';
import ModePicker from '@/components/ModePicker';
import type { Deck, Card } from '@/lib/types';
import type { Direction, ReviewMode } from '@/lib/constants';

interface DeckDetailClientProps {
  deck: Deck;
  cards: Card[];
  dueCount: number;
  preferredReviewMode: string;
}

export default function DeckDetailClient({ deck, cards, dueCount, preferredReviewMode }: DeckDetailClientProps) {
  const [direction, setDirection] = useState<Direction>('PL->NL');
  const [mode, setMode] = useState<ReviewMode>(preferredReviewMode as ReviewMode);

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link href="/decks" className="text-sm text-forest-500 hover:text-forest-600">
        ← Back to decks
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{deck.category?.icon || '📚'}</span>
          <h1 className="text-xl font-bold text-trail-700">{deck.name}</h1>
        </div>
        {deck.description && (
          <p className="text-sm text-trail-500">{deck.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-white rounded-xl border border-trail-200 px-4 py-3 flex-1 text-center">
          <div className="text-xl font-bold text-trail-700">{cards.length}</div>
          <div className="text-xs text-trail-400">Total cards</div>
        </div>
        <div className="bg-white rounded-xl border border-trail-200 px-4 py-3 flex-1 text-center">
          <div className="text-xl font-bold text-rust-500">{dueCount}</div>
          <div className="text-xs text-trail-400">Due today</div>
        </div>
      </div>

      {/* Direction */}
      <div>
        <h2 className="text-sm font-medium text-trail-500 mb-2">Practice direction</h2>
        <DirectionPicker value={direction} onChange={setDirection} />
      </div>

      {/* Review mode */}
      <div>
        <h2 className="text-sm font-medium text-trail-500 mb-2">Review mode</h2>
        <ModePicker value={mode} onChange={setMode} />
      </div>

      {/* Start Review */}
      <Link
        href={`/review/${deck.id}?direction=${direction}${mode === 'type' ? '&mode=type' : ''}`}
        className="block bg-forest-500 hover:bg-forest-600 text-white text-center py-4 rounded-2xl font-bold text-lg transition-colors"
      >
        🐼 Start Review
      </Link>

      {/* Card list */}
      <div>
        <h2 className="text-sm font-medium text-trail-500 mb-3">Cards ({cards.length})</h2>
        <div className="space-y-2">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl border border-trail-200 p-3">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-[10px] text-trail-400 uppercase">NL</span>
                  <p className="text-trail-700 font-medium">{card.dutch}</p>
                </div>
                <div>
                  <span className="text-[10px] text-trail-400 uppercase">PL</span>
                  <p className="text-trail-700 font-medium">{card.polish}</p>
                </div>
                <div>
                  <span className="text-[10px] text-trail-400 uppercase">EN</span>
                  <p className="text-trail-700 font-medium">{card.english}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
