'use client';

import { useRef, useState } from 'react';
import type { Product } from '@/types';
import { deleteProduct } from '@/api/products';
import Spinner from '@/components/ui/Spinner';

interface Props {
  product: Product;
  onConfirm: (p: Product) => void;
  onCancel: () => void;
}

export default function DeleteConfirm({ product, onConfirm, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);

  async function handleDelete() {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    try {
      await deleteProduct(product.id);
    } catch {
      // The API may 404 on locally-added products — still treat as success locally
    } finally {
      inFlight.current = false;
      setLoading(false);
      onConfirm(product);
    }
  }

  return (
    <div className="space-y-4">
      <p style={{ color: '#a07850' }}>
        Are you sure you want to delete{' '}
        <span className="font-semibold" style={{ color: '#fde8c8' }}>{product.title}</span>?
        This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl py-2.5 text-sm font-medium transition"
          style={{ border: '1px solid #5a3518', color: '#c8a060' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#361f0c'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          Cancel
        </button>
        <button
          id="confirm-delete"
          onClick={handleDelete}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition"
          style={{ backgroundColor: '#dc2626', opacity: loading ? 0.6 : 1 }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#b91c1c'; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#dc2626'; }}
        >
          {loading ? <Spinner size="sm" /> : null}
          Delete
        </button>
      </div>
    </div>
  );
}
