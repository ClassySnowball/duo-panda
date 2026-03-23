'use client';

import FlashcardSession from '@/components/FlashcardSession';

interface ReviewClientProps {
  deckId: string;
  direction: string;
  newCardsLimit: number;
}

export default function ReviewClient({ deckId, direction, newCardsLimit }: ReviewClientProps) {
  return (
    <div className="-mx-4 -my-6">
      <FlashcardSession
        deckId={deckId}
        direction={direction}
        newCardsLimit={newCardsLimit}
      />
    </div>
  );
}
