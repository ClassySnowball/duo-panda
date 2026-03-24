'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Deck } from '@/lib/types';

interface ImportCardsProps {
  decks: Deck[];
  userId: string;
}

interface ParsedCard {
  dutch: string | null;
  polish: string | null;
  english: string | null;
  card_type: string;
  notes: string | null;
  pronunciation_pl: string | null;
  pronunciation_nl: string | null;
  example_sentence_nl: string | null;
  example_sentence_pl: string | null;
  example_sentence_en: string | null;
  error?: string;
}

const KNOWN_HEADERS = [
  'dutch', 'polish', 'english', 'card_type', 'notes',
  'pronunciation_pl', 'pronunciation_nl',
  'example_sentence_nl', 'example_sentence_pl', 'example_sentence_en',
] as const;

function parseList(text: string, cardType: string): ParsedCard[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(',').map(p => p.trim());
      const dutch = parts[0] || null;
      const polish = parts[1] || null;
      const english = parts[2] || null;
      const filled = [dutch, polish, english].filter(Boolean).length;
      return {
        dutch, polish, english,
        card_type: cardType,
        notes: null,
        pronunciation_pl: null,
        pronunciation_nl: null,
        example_sentence_nl: null,
        example_sentence_pl: null,
        example_sentence_en: null,
        ...(filled < 2 ? { error: 'Need at least 2 languages' } : {}),
      };
    });
}

function parseCsv(text: string): ParsedCard[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const columnMap = headers.map(h => {
    const match = KNOWN_HEADERS.find(k => k === h);
    return match ?? null;
  });

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const card: Record<string, string | null> = {};

    for (const key of KNOWN_HEADERS) {
      card[key] = null;
    }
    card.card_type = 'word';

    columnMap.forEach((key, i) => {
      if (key && values[i]) {
        card[key] = values[i];
      }
    });

    const filled = [card.dutch, card.polish, card.english].filter(Boolean).length;
    return {
      ...card,
      ...(filled < 2 ? { error: 'Need at least 2 languages' } : {}),
    } as ParsedCard;
  });
}

export default function ImportCards({ decks, userId }: ImportCardsProps) {
  const [tab, setTab] = useState<'paste' | 'csv'>('paste');
  const [pasteText, setPasteText] = useState('');
  const [csvText, setCsvText] = useState('');
  const [cardType, setCardType] = useState('word');
  const [deckId, setDeckId] = useState(decks[0]?.id || '__new__');
  const [newDeckName, setNewDeckName] = useState('');
  const [preview, setPreview] = useState<ParsedCard[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: number } | null>(null);

  const supabase = createClient();

  const handlePreview = () => {
    const cards = tab === 'paste'
      ? parseList(pasteText, cardType)
      : parseCsv(csvText);
    setPreview(cards);
    setResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCsvText(reader.result as string);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!preview) return;
    const validCards = preview.filter(c => !c.error);
    if (validCards.length === 0) return;

    setImporting(true);

    let targetDeckId = deckId;

    if (deckId === '__new__') {
      if (!newDeckName.trim()) {
        setImporting(false);
        return;
      }
      const { data: newDeck, error } = await supabase.from('decks').insert({
        name: newDeckName.trim(),
        user_id: userId,
        card_type: cardType,
      }).select('id').single();

      if (error || !newDeck) {
        setImporting(false);
        return;
      }
      targetDeckId = newDeck.id;
    }

    const rows = validCards.map(c => ({
      deck_id: targetDeckId,
      dutch: c.dutch,
      polish: c.polish,
      english: c.english,
      card_type: c.card_type,
      notes: c.notes,
      pronunciation_pl: c.pronunciation_pl,
      pronunciation_nl: c.pronunciation_nl,
      example_sentence_nl: c.example_sentence_nl,
      example_sentence_pl: c.example_sentence_pl,
      example_sentence_en: c.example_sentence_en,
    }));

    const { error } = await supabase.from('cards').insert(rows);

    setImporting(false);
    setResult({
      success: error ? 0 : validCards.length,
      errors: error ? validCards.length : preview.length - validCards.length,
    });

    if (!error) {
      setPreview(null);
      setPasteText('');
      setCsvText('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex bg-trail-100 rounded-xl p-1">
        <button
          onClick={() => { setTab('paste'); setPreview(null); setResult(null); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'paste' ? 'bg-white text-trail-700 shadow-sm' : 'text-trail-500'
          }`}
        >
          Paste List
        </button>
        <button
          onClick={() => { setTab('csv'); setPreview(null); setResult(null); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'csv' ? 'bg-white text-trail-700 shadow-sm' : 'text-trail-500'
          }`}
        >
          CSV File
        </button>
      </div>

      {/* Paste tab */}
      {tab === 'paste' && (
        <div className="space-y-3">
          <p className="text-sm text-trail-500">
            One card per line: <code className="bg-trail-100 px-1 rounded">dutch, polish, english</code>
            <br />Leave a field empty to skip it (e.g. <code className="bg-trail-100 px-1 rounded">, pies, dog</code>)
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={8}
            className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:outline-none text-sm font-mono"
            placeholder={"hond, pies, dog\nkat, kot, cat\n, dom, house"}
          />
          <div>
            <label className="block text-sm font-medium text-trail-600 mb-1">Card type</label>
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
        </div>
      )}

      {/* CSV tab */}
      {tab === 'csv' && (
        <div className="space-y-3">
          <p className="text-sm text-trail-500">
            Upload a CSV with a header row. Recognized columns: <code className="bg-trail-100 px-1 rounded">dutch</code>, <code className="bg-trail-100 px-1 rounded">polish</code>, <code className="bg-trail-100 px-1 rounded">english</code>, <code className="bg-trail-100 px-1 rounded">card_type</code>, <code className="bg-trail-100 px-1 rounded">notes</code>, etc.
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="w-full text-sm text-trail-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-forest-50 file:text-forest-600 hover:file:bg-forest-100"
          />
          {csvText && (
            <p className="text-sm text-forest-500">File loaded ({csvText.split('\n').filter(l => l.trim()).length - 1} rows detected)</p>
          )}
        </div>
      )}

      {/* Deck selector */}
      <div>
        <label className="block text-sm font-medium text-trail-600 mb-1">Deck</label>
        <select
          value={deckId}
          onChange={(e) => setDeckId(e.target.value)}
          className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 focus:ring-2 focus:ring-forest-400 focus:outline-none"
        >
          <option value="__new__">+ Create new deck</option>
          {decks.map((deck) => (
            <option key={deck.id} value={deck.id}>
              {deck.name}
            </option>
          ))}
        </select>
      </div>

      {deckId === '__new__' && (
        <input
          type="text"
          value={newDeckName}
          onChange={(e) => setNewDeckName(e.target.value)}
          className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:outline-none"
          placeholder="New deck name"
        />
      )}

      {/* Preview button */}
      {!preview && (
        <button
          onClick={handlePreview}
          disabled={tab === 'paste' ? !pasteText.trim() : !csvText.trim()}
          className="w-full bg-trail-200 hover:bg-trail-300 text-trail-700 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          Preview
        </button>
      )}

      {/* Preview table */}
      {preview && preview.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-trail-600">
            Preview ({preview.filter(c => !c.error).length} valid, {preview.filter(c => c.error).length} errors)
          </h3>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-trail-500 border-b border-trail-200">
                  <th className="py-2 pr-3">Dutch</th>
                  <th className="py-2 pr-3">Polish</th>
                  <th className="py-2 pr-3">English</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((card, i) => (
                  <tr key={i} className={`border-b border-trail-100 ${card.error ? 'bg-rust-50' : ''}`}>
                    <td className="py-2 pr-3 text-trail-700">{card.dutch || '-'}</td>
                    <td className="py-2 pr-3 text-trail-700">{card.polish || '-'}</td>
                    <td className="py-2 pr-3 text-trail-700">{card.english || '-'}</td>
                    <td className="py-2">
                      {card.error
                        ? <span className="text-rust-500 text-xs">{card.error}</span>
                        : <span className="text-forest-500 text-xs">OK</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPreview(null)}
              className="flex-1 bg-trail-200 hover:bg-trail-300 text-trail-700 py-3 rounded-xl font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleImport}
              disabled={importing || preview.filter(c => !c.error).length === 0 || (deckId === '__new__' && !newDeckName.trim())}
              className="flex-1 bg-forest-500 hover:bg-forest-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {importing ? 'Importing...' : `Import ${preview.filter(c => !c.error).length} cards`}
            </button>
          </div>
        </div>
      )}

      {preview && preview.length === 0 && (
        <p className="text-sm text-trail-500 text-center">No cards found. Check your input format.</p>
      )}

      {/* Result */}
      {result && (
        <div className="bg-white rounded-2xl border border-trail-200 p-4 text-center">
          <p className="text-forest-600 font-medium">
            {result.success} cards imported successfully
          </p>
          {result.errors > 0 && (
            <p className="text-rust-500 text-sm mt-1">{result.errors} cards skipped due to errors</p>
          )}
        </div>
      )}
    </div>
  );
}
