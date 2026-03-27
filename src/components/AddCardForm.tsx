'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getDeckDisplayName } from '@/lib/deck-utils';
import type { Deck } from '@/lib/types';

interface AddCardFormProps {
  decks: Deck[];
  userId: string;
  preferredDirection?: string;
  onCardAdded?: () => void;
}

export default function AddCardForm({ decks, userId, preferredDirection, onCardAdded }: AddCardFormProps) {
  const [dutch, setDutch] = useState('');
  const [polish, setPolish] = useState('');
  const [english, setEnglish] = useState('');
  const [cardType, setCardType] = useState('word');
  const [deckId, setDeckId] = useState(decks[0]?.id || '__new__');
  const [newDeckNameNl, setNewDeckNameNl] = useState('');
  const [newDeckNamePl, setNewDeckNamePl] = useState('');
  const [newDeckNameEn, setNewDeckNameEn] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const filled = [dutch.trim(), polish.trim(), english.trim()].filter(Boolean).length;
    if (filled < 2) {
      setError('Please fill in at least 2 of the 3 languages.');
      return;
    }

    let targetDeckId = deckId;

    if (deckId === '__new__') {
      if (!newDeckNameNl.trim() || !newDeckNamePl.trim() || !newDeckNameEn.trim()) {
        setError('Please fill in the deck name in all 3 languages.');
        return;
      }

      setSaving(true);
      const { data: newDeck, error: deckError } = await supabase.from('decks').insert({
        name: newDeckNameEn.trim(),
        name_nl: newDeckNameNl.trim(),
        name_pl: newDeckNamePl.trim(),
        name_en: newDeckNameEn.trim(),
        user_id: userId,
        card_type: cardType,
      }).select('id').single();

      if (deckError || !newDeck) {
        setSaving(false);
        setError(deckError?.message || 'Failed to create deck.');
        return;
      }
      targetDeckId = newDeck.id;
    }

    setSaving(true);
    setSuccess(false);

    const { error: insertError } = await supabase.from('cards').insert({
      deck_id: targetDeckId,
      dutch: dutch.trim() || null,
      polish: polish.trim() || null,
      english: english.trim() || null,
      card_type: cardType,
    });

    setSaving(false);

    if (!insertError) {
      setSuccess(true);
      setDutch('');
      setPolish('');
      setEnglish('');
      if (deckId === '__new__') {
        setNewDeckNameNl('');
        setNewDeckNamePl('');
        setNewDeckNameEn('');
        setDeckId(targetDeckId);
      }
      onCardAdded?.();
      setTimeout(() => setSuccess(false), 2000);
    } else {
      setError(insertError.message);
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
            <option value="__new__">+ Create new deck</option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {getDeckDisplayName(deck, preferredDirection)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {deckId === '__new__' && (
        <div className="space-y-3 bg-trail-50 rounded-xl p-4">
          <p className="text-sm font-medium text-trail-600">New deck name</p>
          <input
            type="text"
            value={newDeckNameNl}
            onChange={(e) => setNewDeckNameNl(e.target.value)}
            className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:outline-none"
            placeholder="Dutch name 🇳🇱"
          />
          <input
            type="text"
            value={newDeckNamePl}
            onChange={(e) => setNewDeckNamePl(e.target.value)}
            className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:outline-none"
            placeholder="Polish name 🇵🇱"
          />
          <input
            type="text"
            value={newDeckNameEn}
            onChange={(e) => setNewDeckNameEn(e.target.value)}
            className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:outline-none"
            placeholder="English name 🇬🇧"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-rust-500">{error}</p>
      )}

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
