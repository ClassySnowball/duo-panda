'use client';

import { useState } from 'react';

interface FlashcardProps {
  front: string;
  back: string;
  fromLang: string;
  toLang: string;
  onFlip?: () => void;
  flipped?: boolean;
}

export default function Flashcard({ front, back, fromLang, toLang, onFlip, flipped: controlledFlipped }: FlashcardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const flipped = controlledFlipped ?? internalFlipped;

  const handleClick = () => {
    if (controlledFlipped === undefined) {
      setInternalFlipped(!internalFlipped);
    }
    onFlip?.();
  };

  return (
    <div className="flashcard-container w-full max-w-sm mx-auto" style={{ height: '280px' }}>
      <div
        className={`flashcard-inner w-full h-full cursor-pointer ${flipped ? 'flipped' : ''}`}
        onClick={handleClick}
      >
        {/* Front */}
        <div className="flashcard-front w-full h-full bg-white rounded-2xl shadow-lg border border-trail-200 flex flex-col items-center justify-center p-8">
          <span className="text-xs uppercase tracking-wide text-trail-400 mb-4">{fromLang}</span>
          <p className="text-2xl font-bold text-trail-700 text-center leading-relaxed">{front}</p>
          <span className="mt-6 text-xs text-trail-300">Tap to flip</span>
        </div>

        {/* Back */}
        <div className="flashcard-back w-full h-full bg-forest-500 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8">
          <span className="text-xs uppercase tracking-wide text-forest-300 mb-4">{toLang}</span>
          <p className="text-2xl font-bold text-white text-center leading-relaxed">{back}</p>
          <span className="mt-6 text-xs text-forest-300">Tap to flip back</span>
        </div>
      </div>
    </div>
  );
}
