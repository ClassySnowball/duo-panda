'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { deriveQuality, MATCH_LABELS, type QualityResult } from '@/lib/levenshtein';
import { QUALITY_LABELS } from '@/lib/constants';
import SpeakerButton from './SpeakerButton';

interface TypingCardProps {
  front: string;
  correctAnswer: string;
  fromLang: string;
  toLang: string;
  onRate: (quality: number) => void;
  isTransitioning: boolean;
}

export default function TypingCard({ front, correctAnswer, fromLang, toLang, onRate, isTransitioning }: TypingCardProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<QualityResult | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when card changes
  useEffect(() => {
    setInput('');
    setResult(null);
    setSubmittedAnswer('');
    // Focus after transition completes
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [front]);

  const handleCheck = useCallback(() => {
    if (result) return;
    const quality = deriveQuality(input, correctAnswer);
    setSubmittedAnswer(input);
    setResult(quality);
  }, [input, correctAnswer, result]);

  const handleContinue = useCallback((quality: number) => {
    onRate(quality);
  }, [onRate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (!result) {
      handleCheck();
    } else {
      handleContinue(result.quality);
    }
  }, [result, handleCheck, handleContinue]);

  const matchInfo = result ? MATCH_LABELS[result.matchType] : null;

  return (
    <div
      className={`w-full max-w-sm mx-auto flex flex-col gap-4 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      onKeyDown={handleKeyDown}
    >
      {/* Card */}
      <div className={`w-full rounded-2xl shadow-lg border p-8 flex flex-col items-center justify-center ${
        result ? 'bg-forest-500 border-forest-600' : 'bg-white border-trail-200'
      }`} style={{ minHeight: '220px' }}>
        <span className={`text-xs uppercase tracking-wide mb-3 ${
          result ? 'text-forest-300' : 'text-trail-400'
        }`}>{fromLang}</span>
        <div className="flex items-center gap-2">
          <p className={`text-2xl font-bold text-center leading-relaxed ${
            result ? 'text-white' : 'text-trail-700'
          }`}>{front}</p>
          <SpeakerButton text={front} lang={fromLang} variant={result ? 'dark' : 'light'} />
        </div>

        {result && (
          <>
            <div className="w-12 border-t border-forest-400 my-3" />
            <span className="text-xs uppercase tracking-wide text-forest-300 mb-2">{toLang}</span>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-white text-center">{correctAnswer}</p>
              <SpeakerButton text={correctAnswer} lang={toLang} variant="dark" />
            </div>
          </>
        )}
      </div>

      {/* Input or result area */}
      {!result ? (
        <>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type the ${toLang} translation...`}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full bg-white border border-trail-200 rounded-xl px-4 py-4 text-lg text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:border-forest-400 focus:outline-none"
          />
          <button
            onClick={handleCheck}
            className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3 rounded-xl font-bold text-lg transition-colors"
          >
            Check
          </button>
        </>
      ) : (
        <>
          {/* Answer comparison */}
          <div className={`bg-white rounded-xl border border-trail-200 p-4 space-y-2 ${
            result.matchType === 'wrong' ? 'answer-wrong' : ''
          } ${result.matchType === 'exact' ? 'answer-correct' : ''}`}>
            <div className="flex items-start gap-2">
              <span className="text-xs text-trail-400 w-14 pt-0.5 shrink-0">Yours:</span>
              <span className={`text-sm font-medium ${matchInfo!.color}`}>
                {submittedAnswer || '(empty)'}
              </span>
            </div>
            {result.matchType !== 'exact' && (
              <div className="flex items-start gap-2">
                <span className="text-xs text-trail-400 w-14 pt-0.5 shrink-0">Correct:</span>
                <span className="text-sm font-medium text-forest-500">{correctAnswer}</span>
              </div>
            )}
            <div className={`text-sm font-semibold ${matchInfo!.color} pt-1`}>
              {matchInfo!.label}
            </div>
          </div>

          {/* Continue button with auto-quality */}
          <button
            onClick={() => handleContinue(result.quality)}
            className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3 rounded-xl font-bold text-lg transition-colors"
          >
            Continue
          </button>

          {/* Override quality buttons */}
          <div className="space-y-1">
            <p className="text-xs text-trail-400 text-center">Override rating:</p>
            <div className="grid grid-cols-4 gap-2">
              {QUALITY_LABELS.map(({ quality, label, color, description }) => (
                <button
                  key={quality}
                  onClick={() => handleContinue(quality)}
                  className={`${color} text-white rounded-xl py-2 px-2 flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                    quality === result.quality ? 'ring-2 ring-white ring-offset-2 ring-offset-trail-50' : 'opacity-60'
                  }`}
                >
                  <span className="text-xs font-bold">{label}</span>
                  <span className="text-[9px] opacity-80">{description}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
