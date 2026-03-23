import Link from 'next/link';
import type { Deck, Category } from '@/lib/types';

interface DeckCardProps {
  deck: Deck;
  category?: Category;
  dueCount?: number;
}

export default function DeckCard({ deck, category, dueCount }: DeckCardProps) {
  return (
    <Link
      href={`/decks/${deck.id}`}
      className="block bg-white rounded-2xl shadow-sm border border-trail-200 p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-lg">{category?.icon || '📚'}</span>
        {dueCount !== undefined && dueCount > 0 && (
          <span className="bg-rust-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {dueCount} due
          </span>
        )}
      </div>
      <h3 className="font-bold text-trail-700 mb-1">{deck.name}</h3>
      {category && (
        <span className="text-xs text-trail-400">{category.name}</span>
      )}
      {deck.description && (
        <p className="text-sm text-trail-500 mt-2 line-clamp-2">{deck.description}</p>
      )}
    </Link>
  );
}
