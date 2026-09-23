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

const selectStyle: React.CSSProperties = {
  appearance: 'none',
  borderRadius: '0.75rem',
  backgroundColor: '#2a1a0a',
  border: '1px solid #5a3518',
  padding: '0.625rem 2rem 0.625rem 0.75rem',
  fontSize: '0.875rem',
  color: '#fde8c8',
  outline: 'none',
};

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
        <select id="category-filter" value={category} onChange={(e) => onCategoryChange(e.target.value)} style={selectStyle}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#a07850' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {searchActive && !category && (
        <span className="self-center rounded-lg px-3 py-1.5 text-xs" style={{ backgroundColor: '#3b1f0a', border: '1px solid #7c4a1a', color: '#f5c07a' }}>
          Pick a category to disable search, or vice versa
        </span>
      )}

      {/* Sort by */}
      <div className="relative">
        <select id="sort-by" value={sortBy} onChange={(e) => onSortByChange(e.target.value as SortField | '')} style={selectStyle}>
          <option value="">No sort</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>
        <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#a07850' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Order toggle */}
      <button
        id="sort-order"
        onClick={() => onOrderChange(order === 'asc' ? 'desc' : 'asc')}
        title={order === 'asc' ? 'Ascending' : 'Descending'}
        className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm transition"
        style={{ backgroundColor: '#2a1a0a', border: '1px solid #5a3518', color: '#fde8c8' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d97706'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#5a3518'; }}
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
