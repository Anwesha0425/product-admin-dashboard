import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <span className="flex items-center gap-1 text-amber-400">
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      <span className="ml-1 text-xs text-slate-400">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-700">
      <table className="w-full text-sm text-slate-300">
        <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-left">Rating</th>
            <th className="px-4 py-3 text-right">Stock</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {products.map((product) => (
            <tr key={product.id} className="group transition hover:bg-slate-800/40">
              <td className="px-4 py-3">
                <Link href={`/products/${product.id}`} className="flex items-center gap-3 hover:text-indigo-400 transition">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-700">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="font-medium text-white line-clamp-1 group-hover:text-indigo-400">{product.title}</span>
                </Link>
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-xs capitalize">
                  {product.category}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-emerald-400">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <StarRating rating={product.rating} />
              </td>
              <td className="px-4 py-3 text-right">
                <span className={product.stock < 10 ? 'text-red-400 font-semibold' : ''}>
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-lg bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-indigo-600 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="rounded-lg bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
