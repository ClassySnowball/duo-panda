'use client';

import { useState } from 'react';
import CategoryFilter from '@/components/CategoryFilter';
import DeckCard from '@/components/DeckCard';
import Link from 'next/link';
import type { Category, Deck } from '@/lib/types';

interface DecksClientProps {
  categories: Category[];
  decks: Deck[];
  preferredDirection?: string;
}

export default function DecksClient({ categories, decks, preferredDirection }: DecksClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredDecks = selectedCategory
    ? decks.filter(d => d.category?.slug === selectedCategory)
    : decks;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-trail-700">Decks</h1>
        <Link
          href="/cards/new"
          className="bg-forest-500 hover:bg-forest-600 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors"
        >
          + Add Card
        </Link>
      </div>

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {filteredDecks.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredDecks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} category={deck.category} preferredDirection={preferredDirection} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-trail-400">
          No decks found in this category.
        </div>
      )}
    </div>
  );
}
