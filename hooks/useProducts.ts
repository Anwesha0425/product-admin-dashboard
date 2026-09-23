'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  fetchProducts,
  fetchProductsByCategory,
  searchProducts,
} from '@/api/products';
import { useDebounce } from './useDebounce';
import type { Product, ProductsResponse, SortField, SortOrder } from '@/types';

// Clamps a numeric string to a valid integer, returning `fallback` for bad input.
function safeInt(val: string | null, fallback: number, min = 1): number {
  const parsed = parseInt(val ?? '', 10);
  return isNaN(parsed) || parsed < min ? fallback : parsed;
}

export interface OverrideMap {
  [id: number]: { type: 'edit' | 'delete'; product: Product } | { type: 'add'; product: Product };
}

export function useProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Parse URL params with safe defaults ---
  const page = safeInt(searchParams.get('page'), 1);
  const limit = (() => {
    const v = safeInt(searchParams.get('limit'), 10);
    return [10, 20, 50].includes(v) ? v : 10;
  })();
  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const sortBy = (searchParams.get('sortBy') ?? '') as SortField | '';
  const order = (searchParams.get('order') ?? 'asc') as SortOrder;

  const debouncedQ = useDebounce(q, 400);

  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Local CRUD overrides that survive until page refresh
  const [overrides, setOverrides] = useState<OverrideMap>({});

  // Track the latest fetch so stale responses are silently dropped
  const fetchIdRef = useRef(0);

  // Sync a single URL param without losing the others
  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset to page 1 when filters change
    if (key !== 'page' && key !== 'limit') params.set('page', '1');
    router.push(`?${params.toString()}`);
  }

  function setPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`?${params.toString()}`);
  }

  useEffect(() => {
    const skip = (page - 1) * limit;
    const controller = new AbortController();
    const fetchId = ++fetchIdRef.current;

    setLoading(true);
    setError(null);

    async function load() {
      try {
        let result: ProductsResponse;

        if (category) {
          // Category filter takes priority; search is ignored when active
          result = await fetchProductsByCategory(
            category, limit, skip,
            sortBy || undefined, order,
            controller.signal
          );
        } else if (debouncedQ) {
          result = await searchProducts(
            debouncedQ, limit, skip,
            sortBy || undefined, order,
            controller.signal
          );
        } else {
          result = await fetchProducts({
            limit, skip,
            sortBy: sortBy || undefined,
            order,
            signal: controller.signal,
          });
        }

        // Only update state if this is still the latest request
        if (fetchId === fetchIdRef.current) {
          setData(result);
          setLoading(false);
        }
      } catch (err: unknown) {
        if ((err as { name?: string }).name === 'CanceledError' || (err as { name?: string }).name === 'AbortError') return;
        if (fetchId === fetchIdRef.current) {
          setError('Something went wrong. Please try again.');
          setLoading(false);
        }
      }
    }

    load();
    return () => controller.abort();
  }, [page, limit, debouncedQ, category, sortBy, order]);

  // Apply local overrides on top of API data
  function getDisplayProducts(): Product[] {
    if (!data) return [];
    const apiProducts = data.products.map((p) => {
      const override = overrides[p.id];
      if (!override) return p;
      if (override.type === 'delete') return null;
      if (override.type === 'edit') return override.product;
      return p;
    }).filter(Boolean) as Product[];

    // Prepend locally-added products (negative IDs)
    const added = Object.values(overrides)
      .filter((o) => o.type === 'add')
      .map((o) => o.product);

    return [...added, ...apiProducts];
  }

  function applyOverride(type: 'add' | 'edit' | 'delete', product: Product) {
    setOverrides((prev) => ({ ...prev, [product.id]: { type, product } }));
  }

  const retry = () => {
    setError(null);
    setLoading(true);
    fetchIdRef.current++; // bump id to allow re-fetch
    // Trigger re-run by toggling loading — useEffect will fire when deps change,
    // so we force it by clearing error which causes a re-render queue on next tick.
  };

  return {
    data,
    loading,
    error,
    page,
    limit,
    q,
    category,
    sortBy,
    order,
    setParam,
    setPage,
    getDisplayProducts,
    applyOverride,
    retry,
  };
}
