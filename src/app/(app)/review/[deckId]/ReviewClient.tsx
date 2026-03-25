'use client';

import FlashcardSession from '@/components/FlashcardSession';
import type { ReviewMode } from '@/lib/constants';

interface ReviewClientProps {
  deckId: string;
  direction: string;
  newCardsLimit: number;
  mode: ReviewMode;
}

export default function ReviewClient({ deckId, direction, newCardsLimit, mode }: ReviewClientProps) {
  return (
    <div className="-mx-4 -my-6">
      <FlashcardSession
        deckId={deckId}
        direction={direction}
        newCardsLimit={newCardsLimit}
        mode={mode}
      />
    </div>
  );
}
