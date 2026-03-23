'use client';

import { useReviewSession } from '@/hooks/useReviewSession';
import Flashcard from './Flashcard';
import QualityRating from './QualityRating';
import StreakDisplay from './StreakDisplay';
import Link from 'next/link';

interface FlashcardSessionProps {
  deckId: string;
  direction: string;
  newCardsLimit: number;
}

export default function FlashcardSession({ deckId, direction, newCardsLimit }: FlashcardSessionProps) {
  const {
    currentCard,
    isFlipped,
    isLoading,
    isComplete,
    isTransitioning,
    stats,
    currentIndex,
    totalCards,
    flip,
    handleRate,
    fromLang,
    toLang,
    fromKey,
    toKey,
  } = useReviewSession({ deckId, direction, newCardsLimit });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-trail-400 text-lg">Loading cards...</div>
      </div>
    );
  }

  if (isComplete) {
    const accuracy = stats.reviewed > 0 ? Math.round((stats.correct / stats.reviewed) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 page-enter">
        <img src="/icons/icon-192.png" alt="Duo Panda" className="w-20 h-20 rounded-2xl mb-4" />
        <h2 className="text-2xl font-bold text-trail-700 mb-2">Session Complete!</h2>
        <p className="text-trail-500 mb-8 text-center">
          {stats.reviewed === 0
            ? 'No cards due for review. Come back later!'
            : `You reviewed ${stats.reviewed} cards with ${accuracy}% accuracy.`}
        </p>

        {stats.reviewed > 0 && (
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-forest-500">{stats.reviewed}</div>
              <div className="text-xs text-trail-400">Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-forest-500">{stats.newLearned}</div>
              <div className="text-xs text-trail-400">New</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-forest-500">{accuracy}%</div>
              <div className="text-xs text-trail-400">Accuracy</div>
            </div>
          </div>
        )}

        <Link
          href="/dashboard"
          className="bg-forest-500 hover:bg-forest-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-trail-400 hover:text-trail-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
        <span className="text-sm text-trail-400">
          {currentIndex + 1} / {totalCards}
        </span>
        <div className="w-6" />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-trail-200 mx-4 rounded-full overflow-hidden">
        <div
          className="h-full bg-forest-500 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
        />
      </div>

      {/* Card area */}
      <div className={`flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <Flashcard
          front={currentCard[fromKey]}
          back={currentCard[toKey]}
          fromLang={fromLang}
          toLang={toLang}
          flipped={isFlipped}
          onFlip={flip}
        />

        {isFlipped ? (
          <QualityRating onRate={handleRate} />
        ) : (
          <button
            onClick={flip}
            className="bg-trail-200 hover:bg-trail-300 text-trail-600 px-8 py-3 rounded-xl font-medium transition-colors"
          >
            Show Answer
          </button>
        )}
      </div>
    </div>
  );
}
