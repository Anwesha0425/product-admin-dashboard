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
    <div
      className="rounded-2xl p-4 transition"
      style={{ backgroundColor: '#2a1a0a', border: '1px solid #4a2e10' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#d97706'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#4a2e10'; }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl" style={{ backgroundColor: '#361f0c' }}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition hover:scale-105"
            unoptimized
          />
        </div>
        <h3 className="mb-1 font-semibold line-clamp-1 transition" style={{ color: '#fde8c8' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#d97706'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#fde8c8'; }}
        >{product.title}</h3>
      </Link>
      <p className="mb-3 text-xs capitalize" style={{ color: '#7c5030' }}>{product.category}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold" style={{ color: '#86efac' }}>${product.price.toFixed(2)}</span>
        <span className="text-xs" style={{ color: '#d97706' }}>★ {product.rating.toFixed(1)}</span>
      </div>
      <p className="mt-1 text-xs" style={{ color: '#7c5030' }}>Stock: {product.stock}</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 rounded-lg py-1.5 text-xs font-medium transition"
          style={{ backgroundColor: '#361f0c', color: '#c8a060', border: '1px solid #5a3518' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d97706'; e.currentTarget.style.color = '#1c1007'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#361f0c'; e.currentTarget.style.color = '#c8a060'; }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product)}
          className="flex-1 rounded-lg py-1.5 text-xs font-medium transition"
          style={{ backgroundColor: '#361f0c', color: '#c8a060', border: '1px solid #5a3518' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#361f0c'; e.currentTarget.style.color = '#c8a060'; }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
