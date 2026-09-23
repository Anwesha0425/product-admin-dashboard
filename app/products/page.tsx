'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import SearchBar from '@/components/products/SearchBar';
import FilterSort from '@/components/products/FilterSort';
import Pagination from '@/components/products/Pagination';
import ProductTable from '@/components/products/ProductTable';
import ProductCard from '@/components/products/ProductCard';
import ProductForm from '@/components/products/ProductForm';
import DeleteConfirm from '@/components/products/DeleteConfirm';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { removeToken, getStoredUser } from '@/lib/auth';
import type { Product, SortField, SortOrder } from '@/types';

function ProductsPageInner() {
  const router = useRouter();
  const {
    data, loading, error,
    page, limit, q, category, sortBy, order,
    setParam, setPage, getDisplayProducts, applyOverride, retry,
  } = useProducts();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const userRaw = getStoredUser();
  const user = userRaw ? JSON.parse(userRaw) : null;

  function logout() {
    removeToken();
    router.push('/login');
  }

  const displayProducts = getDisplayProducts();
  const total = data?.total ?? 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c1007' }}>
      {/* Top nav */}
      <header className="sticky top-0 z-40" style={{ backgroundColor: '#2a1a0aee', borderBottom: '1px solid #4a2e10', backdropFilter: 'blur(8px)' }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#d97706' }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#1c1007' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-base font-semibold" style={{ color: '#fde8c8' }}>Product Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden text-sm sm:block" style={{ color: '#a07850' }}>
                {user.firstName} {user.lastName}
              </span>
            )}
            <button
              id="logout-btn"
              onClick={logout}
              className="rounded-lg px-3 py-1.5 text-sm transition"
              style={{ border: '1px solid #5a3518', color: '#c8a060' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#361f0c'; e.currentTarget.style.color = '#fde8c8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#c8a060'; }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* CRUD persistence banner */}
        <div className="mb-4 rounded-xl px-4 py-2.5 text-xs" style={{ backgroundColor: '#3b1f0a', border: '1px solid #7c4a1a', color: '#f5c07a' }}>
          ℹ️ Add / Edit / Delete changes are stored locally and will reset on page refresh — the DummyJSON API does not persist writes.
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBar value={q} onChange={(v) => setParam('q', v)} disabled={!!category} />
          <FilterSort
            category={category}
            sortBy={sortBy}
            order={order}
            onCategoryChange={(v) => setParam('category', v)}
            onSortByChange={(v) => setParam('sortBy', v as SortField | '')}
            onOrderChange={(v) => setParam('order', v as SortOrder)}
            searchActive={!!q}
          />
          <button
            id="add-product-btn"
            onClick={() => { setEditTarget(null); setFormOpen(true); }}
            className="ml-auto flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition"
            style={{ backgroundColor: '#d97706', color: '#1c1007' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b45309'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#d97706'; }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <Spinner size="lg" />
          </div>
        )}
        {!loading && error && <ErrorState message={error} onRetry={retry} />}
        {!loading && !error && displayProducts.length === 0 && (
          <EmptyState message="No products match your search or filters." />
        )}
        {!loading && !error && displayProducts.length > 0 && (
          <>
            <div className="hidden md:block">
              <ProductTable
                products={displayProducts}
                onEdit={(p) => { setEditTarget(p); setFormOpen(true); }}
                onDelete={(p) => setDeleteTarget(p)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:hidden">
              {displayProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onEdit={(p) => { setEditTarget(p); setFormOpen(true); }}
                  onDelete={(p) => setDeleteTarget(p)}
                />
              ))}
            </div>
          </>
        )}

        {!loading && !error && total > 0 && (
          <div className="mt-6">
            <Pagination
              total={total}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(l) => setParam('limit', String(l))}
            />
          </div>
        )}
      </main>

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editTarget ? 'Edit Product' : 'Add Product'}>
        <ProductForm
          product={editTarget}
          onSuccess={(saved, isNew) => { applyOverride(isNew ? 'add' : 'edit', saved); setFormOpen(false); }}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete">
        {deleteTarget && (
          <DeleteConfirm
            product={deleteTarget}
            onConfirm={(p) => { applyOverride('delete', p); setDeleteTarget(null); }}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#1c1007' }}>
        <Spinner size="lg" />
      </div>
    }>
      <ProductsPageInner />
    </Suspense>
  );
}
