'use client';

import type { Category } from '@/lib/types';

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-forest-500 text-white'
            : 'bg-trail-100 text-trail-600 hover:bg-trail-200'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onSelect(cat.slug)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === cat.slug
              ? 'bg-forest-500 text-white'
              : 'bg-trail-100 text-trail-600 hover:bg-trail-200'
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}
