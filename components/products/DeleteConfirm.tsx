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
      <p className="text-slate-300">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-white">{product.title}</span>?
        This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          id="confirm-delete"
          onClick={handleDelete}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
        >
          {loading ? <Spinner size="sm" /> : null}
          Delete
        </button>
      </div>
    </div>
  );
}
