import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4 transition hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-900/20">
      <Link href={`/products/${product.id}`}>
        <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-slate-700">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition hover:scale-105"
            unoptimized
          />
        </div>
        <h3 className="mb-1 font-semibold text-white line-clamp-1 hover:text-indigo-400 transition">{product.title}</h3>
      </Link>
      <p className="mb-3 text-xs capitalize text-slate-500">{product.category}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-emerald-400">${product.price.toFixed(2)}</span>
        <span className="text-xs text-amber-400">★ {product.rating.toFixed(1)}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">Stock: {product.stock}</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 rounded-lg bg-slate-700 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-indigo-600 hover:text-white"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product)}
          className="flex-1 rounded-lg bg-slate-700 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-red-600 hover:text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
