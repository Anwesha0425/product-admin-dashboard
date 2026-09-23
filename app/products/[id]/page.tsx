'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProductById } from '@/api/products';
import type { Product } from '@/types';
import Spinner from '@/components/ui/Spinner';

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1" style={{ color: '#d97706' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span className="ml-1 text-sm" style={{ color: '#a07850' }}>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    params.then(({ id: rawId }) => {
      const parsed = parseInt(rawId, 10);
      if (isNaN(parsed) || parsed <= 0) { setNotFound(true); setLoading(false); return; }
      setId(parsed);
    });
  }, [params]);

  useEffect(() => {
    if (id === null) return;
    setLoading(true);
    fetchProductById(id)
      .then((p) => { setProduct(p); setLoading(false); })
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#1c1007' }}>
      <Spinner size="lg" />
    </div>
  );

  if (notFound || !product) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4" style={{ backgroundColor: '#1c1007' }}>
      <p className="text-7xl font-black" style={{ color: '#d97706' }}>404</p>
      <h1 className="text-2xl font-bold" style={{ color: '#fde8c8' }}>Product not found</h1>
      <p style={{ color: '#a07850' }}>No product exists with that ID.</p>
      <Link href="/products" className="mt-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition" style={{ backgroundColor: '#d97706', color: '#1c1007' }}>
        Back to products
      </Link>
    </div>
  );

  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c1007' }}>
      <header className="sticky top-0 z-40" style={{ backgroundColor: '#2a1a0aee', borderBottom: '1px solid #4a2e10', backdropFilter: 'blur(8px)' }}>
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm transition" style={{ color: '#a07850' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#fde8c8'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#a07850'; }}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span style={{ color: '#5a3518' }}>/</span>
          <span className="text-sm line-clamp-1" style={{ color: '#fde8c8' }}>{product.title}</span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl" style={{ backgroundColor: '#2a1a0a' }}>
              <Image src={images[activeImg] ?? product.thumbnail} alt={product.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" unoptimized />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition" style={{ borderColor: i === activeImg ? '#d97706' : 'transparent' }}>
                    <Image src={src} alt="" fill className="object-cover" sizes="64px" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <span className="rounded-full px-3 py-1 text-xs capitalize" style={{ backgroundColor: '#2a1a0a', color: '#a07850' }}>{product.category}</span>
            <h1 className="text-2xl font-bold" style={{ color: '#fde8c8' }}>{product.title}</h1>
            {product.brand && <p className="text-sm" style={{ color: '#a07850' }}>by <span style={{ color: '#fde8c8' }}>{product.brand}</span></p>}
            <StarRating rating={product.rating} />
            <p className="leading-relaxed" style={{ color: '#a07850' }}>{product.description}</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black" style={{ color: '#86efac' }}>${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="mb-1 rounded-lg px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: '#3b0e0e', color: '#ef4444' }}>-{product.discountPercentage.toFixed(0)}%</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-2xl p-4 text-sm" style={{ border: '1px solid #4a2e10' }}>
              <div><p style={{ color: '#7c5030' }}>Stock</p><p className="font-semibold" style={{ color: '#fde8c8' }}>{product.stock}</p></div>
              <div><p style={{ color: '#7c5030' }}>SKU</p><p className="font-semibold" style={{ color: '#fde8c8' }}>{product.sku}</p></div>
              <div><p style={{ color: '#7c5030' }}>Availability</p><p className="font-semibold" style={{ color: '#86efac' }}>{product.availabilityStatus}</p></div>
              <div><p style={{ color: '#7c5030' }}>Min. Order</p><p className="font-semibold" style={{ color: '#fde8c8' }}>{product.minimumOrderQuantity}</p></div>
              <div className="col-span-2"><p style={{ color: '#7c5030' }}>Warranty</p><p className="font-semibold" style={{ color: '#fde8c8' }}>{product.warrantyInformation}</p></div>
              <div className="col-span-2"><p style={{ color: '#7c5030' }}>Shipping</p><p className="font-semibold" style={{ color: '#fde8c8' }}>{product.shippingInformation}</p></div>
            </div>
          </div>
        </div>
        {product.reviews?.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold" style={{ color: '#fde8c8' }}>Customer Reviews</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {product.reviews.map((r, i) => (
                <div key={i} className="rounded-2xl p-4" style={{ backgroundColor: '#2a1a0a', border: '1px solid #4a2e10' }}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium" style={{ color: '#fde8c8' }}>{r.reviewerName}</span>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="text-sm" style={{ color: '#a07850' }}>{r.comment}</p>
                  <p className="mt-2 text-xs" style={{ color: '#7c5030' }}>{new Date(r.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}