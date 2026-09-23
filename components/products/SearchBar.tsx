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
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
        style={{ color: '#7c5030' }}
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
        style={{
          width: '100%',
          borderRadius: '0.75rem',
          backgroundColor: '#2a1a0a',
          border: '1px solid #5a3518',
          padding: '0.625rem 2.5rem 0.625rem 2.5rem',
          fontSize: '0.875rem',
          color: '#fde8c8',
          outline: 'none',
          opacity: disabled ? 0.4 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        onFocus={(e) => { e.target.style.borderColor = '#d97706'; e.target.style.boxShadow = '0 0 0 3px #d9770633'; }}
        onBlur={(e)  => { e.target.style.borderColor = '#5a3518';  e.target.style.boxShadow = 'none'; }}
      />
      {value && !disabled && (
        <button
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition"
          style={{ color: '#7c5030' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fde8c8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#7c5030'; }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
