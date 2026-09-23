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
    <span className="flex items-center gap-1 text-amber-400">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span className="ml-1 text-sm text-slate-400">{rating.toFixed(1)}</span>
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
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <Spinner size="lg" />
    </div>
  );

  if (notFound || !product) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-center px-4">
      <p className="text-7xl font-black text-indigo-500">404</p>
      <h1 className="text-2xl font-bold text-white">Product not found</h1>
      <p className="text-slate-400">No product exists with that ID.</p>
      <Link href="/products" className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
        Back to products
      </Link>
    </div>
  );

  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-sm text-white line-clamp-1">{product.title}</span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl bg-slate-800">
              <Image src={images[activeImg] ?? product.thumbnail} alt={product.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" unoptimized />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${i === activeImg ? 'border-indigo-500' : 'border-transparent hover:border-slate-600'}`}>
                    <Image src={src} alt="" fill className="object-cover" sizes="64px" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs capitalize text-slate-400">{product.category}</span>
            <h1 className="text-2xl font-bold text-white">{product.title}</h1>
            {product.brand && <p className="text-sm text-slate-400">by <span className="text-white">{product.brand}</span></p>}
            <StarRating rating={product.rating} />
            <p className="text-slate-400 leading-relaxed">{product.description}</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-emerald-400">${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="mb-1 rounded-lg bg-red-900/40 px-2 py-0.5 text-xs font-semibold text-red-400">-{product.discountPercentage.toFixed(0)}%</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-700 p-4 text-sm">
              <div><p className="text-slate-500">Stock</p><p className="font-semibold text-white">{product.stock}</p></div>
              <div><p className="text-slate-500">SKU</p><p className="font-semibold text-white">{product.sku}</p></div>
              <div><p className="text-slate-500">Availability</p><p className="font-semibold text-emerald-400">{product.availabilityStatus}</p></div>
              <div><p className="text-slate-500">Min. Order</p><p className="font-semibold text-white">{product.minimumOrderQuantity}</p></div>
              <div className="col-span-2"><p className="text-slate-500">Warranty</p><p className="font-semibold text-white">{product.warrantyInformation}</p></div>
              <div className="col-span-2"><p className="text-slate-500">Shipping</p><p className="font-semibold text-white">{product.shippingInformation}</p></div>
            </div>
          </div>
        </div>
        {product.reviews?.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-white">Customer Reviews</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {product.reviews.map((r, i) => (
                <div key={i} className="rounded-2xl border border-slate-700 bg-slate-800/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-white">{r.reviewerName}</span>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="text-sm text-slate-400">{r.comment}</p>
                  <p className="mt-2 text-xs text-slate-600">{new Date(r.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}