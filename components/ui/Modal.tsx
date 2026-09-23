'use client';

import { useEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl" style={{ backgroundColor: '#2a1a0a', border: '1px solid #4a2e10' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #4a2e10' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#fde8c8' }}>{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition"
            style={{ color: '#a07850' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#361f0c'; e.currentTarget.style.color = '#fde8c8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a07850'; }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
