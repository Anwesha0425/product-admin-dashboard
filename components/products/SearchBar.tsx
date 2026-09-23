'use client';

import { useRef } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ value, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex-1 min-w-0">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        ref={inputRef}
        id="search-input"
        type="text"
        placeholder={disabled ? 'Clear category filter to search' : 'Search products…'}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
      />
      {value && !disabled && (
        <button
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
