'use client';

import { useEffect, useState } from 'react';
import { fetchCategories } from '@/api/categories';
import type { Category, SortField, SortOrder } from '@/types';

interface Props {
  category: string;
  sortBy: SortField | '';
  order: SortOrder;
  onCategoryChange: (v: string) => void;
  onSortByChange: (v: SortField | '') => void;
  onOrderChange: (v: SortOrder) => void;
  searchActive: boolean;
}

export default function FilterSort({
  category, sortBy, order,
  onCategoryChange, onSortByChange, onOrderChange,
  searchActive,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div className="flex flex-wrap gap-3">
      {/* Category filter */}
      <div className="relative">
        <select
          id="category-filter"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="appearance-none rounded-xl bg-slate-800 border border-slate-700 py-2.5 pl-3 pr-8 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {searchActive && !category && (
        <span className="self-center rounded-lg bg-amber-900/40 border border-amber-700/50 px-3 py-1.5 text-xs text-amber-300">
          Pick a category to disable search, or vice versa
        </span>
      )}

      {/* Sort by */}
      <div className="relative">
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortField | '')}
          className="appearance-none rounded-xl bg-slate-800 border border-slate-700 py-2.5 pl-3 pr-8 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
        >
          <option value="">No sort</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>
        <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Order toggle */}
      <button
        id="sort-order"
        onClick={() => onOrderChange(order === 'asc' ? 'desc' : 'asc')}
        title={order === 'asc' ? 'Ascending' : 'Descending'}
        className="flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-white transition hover:border-indigo-500"
      >
        {order === 'asc' ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
        )}
        {order === 'asc' ? 'Asc' : 'Desc'}
      </button>
    </div>
  );
}
