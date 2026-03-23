'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Deck } from '@/lib/types';

interface AddCardFormProps {
  decks: Deck[];
  onCardAdded?: () => void;
}

export default function AddCardForm({ decks, onCardAdded }: AddCardFormProps) {
  const [dutch, setDutch] = useState('');
  const [polish, setPolish] = useState('');
  const [english, setEnglish] = useState('');
  const [cardType, setCardType] = useState('word');
  const [deckId, setDeckId] = useState(decks[0]?.id || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dutch.trim() || !polish.trim() || !english.trim() || !deckId) return;

    setSaving(true);
    setSuccess(false);

    const { error } = await supabase.from('cards').insert({
      deck_id: deckId,
      dutch: dutch.trim(),
      polish: polish.trim(),
      english: english.trim(),
      card_type: cardType,
    });

    setSaving(false);

    if (!error) {
      setSuccess(true);
      setDutch('');
      setPolish('');
      setEnglish('');
      onCardAdded?.();
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-trail-600 mb-1">Dutch 🇳🇱</label>
        <input
          type="text"
          value={dutch}
          onChange={(e) => setDutch(e.target.value)}
          className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:outline-none"
          placeholder="e.g., hond"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-trail-600 mb-1">Polish 🇵🇱</label>
        <input
          type="text"
          value={polish}
          onChange={(e) => setPolish(e.target.value)}
          className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:outline-none"
          placeholder="e.g., pies"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-trail-600 mb-1">English 🇬🇧</label>
        <input
          type="text"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:outline-none"
          placeholder="e.g., dog"
          required
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-trail-600 mb-1">Type</label>
          <select
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
            className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 focus:ring-2 focus:ring-forest-400 focus:outline-none"
          >
            <option value="word">Word</option>
            <option value="phrase">Phrase</option>
            <option value="sentence">Sentence</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-trail-600 mb-1">Deck</label>
          <select
            value={deckId}
            onChange={(e) => setDeckId(e.target.value)}
            className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 focus:ring-2 focus:ring-forest-400 focus:outline-none"
          >
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : success ? 'Saved! Add another' : 'Save Card'}
      </button>

      {success && (
        <p className="text-center text-sm text-forest-500">Card added successfully!</p>
      )}
    </form>
  );
}
