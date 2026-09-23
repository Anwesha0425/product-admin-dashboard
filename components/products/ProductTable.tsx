'use client';

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
    <span className="flex items-center gap-1" style={{ color: '#d97706' }}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      <span className="ml-1 text-xs" style={{ color: '#a07850' }}>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid #4a2e10' }}>
      <table className="w-full text-sm" style={{ color: '#c8a060' }}>
        <thead style={{ backgroundColor: '#2a1a0a' }}>
          <tr style={{ color: '#7c5030' }} className="text-xs uppercase tracking-wider">
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-left">Rating</th>
            <th className="px-4 py-3 text-right">Stock</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="group transition"
              style={{ borderTop: '1px solid #3a2010' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a1a0a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <td className="px-4 py-3">
                <Link href={`/products/${product.id}`} className="flex items-center gap-3 transition"
                  style={{ color: '#fde8c8' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#d97706'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#fde8c8'; }}
                >
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg" style={{ backgroundColor: '#361f0c' }}>
                    <Image src={product.thumbnail} alt={product.title} fill sizes="40px" className="object-cover" unoptimized />
                  </div>
                  <span className="font-medium line-clamp-1">{product.title}</span>
                </Link>
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full px-2.5 py-0.5 text-xs capitalize" style={{ backgroundColor: '#3b1f0a', color: '#c8a060' }}>
                  {product.category}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-semibold" style={{ color: '#86efac' }}>
                ${product.price.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <StarRating rating={product.rating} />
              </td>
              <td className="px-4 py-3 text-right">
                <span style={{ color: product.stock < 10 ? '#ef4444' : '#c8a060', fontWeight: product.stock < 10 ? 700 : 400 }}>
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium transition"
                    style={{ backgroundColor: '#361f0c', color: '#c8a060', border: '1px solid #5a3518' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d97706'; e.currentTarget.style.color = '#1c1007'; e.currentTarget.style.borderColor = '#d97706'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#361f0c'; e.currentTarget.style.color = '#c8a060'; e.currentTarget.style.borderColor = '#5a3518'; }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium transition"
                    style={{ backgroundColor: '#361f0c', color: '#c8a060', border: '1px solid #5a3518' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#ef4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#361f0c'; e.currentTarget.style.color = '#c8a060'; e.currentTarget.style.borderColor = '#5a3518'; }}
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
