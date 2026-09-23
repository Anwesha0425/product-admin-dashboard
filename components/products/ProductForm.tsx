'use client';

import { useEffect, useRef, useState } from 'react';
import type { Product, ProductFormData } from '@/types';
import { createProduct, updateProduct } from '@/api/products';
import Spinner from '@/components/ui/Spinner';

interface Props {
  product?: Product | null;
  onSuccess: (p: Product, isNew: boolean) => void;
  onCancel: () => void;
}

const empty: ProductFormData = {
  title: '', description: '', category: '',
  price: '', stock: '', brand: '', discountPercentage: '0',
};

type Errors = Partial<Record<keyof ProductFormData, string>>;

function validate(form: ProductFormData): Errors {
  const errs: Errors = {};
  if (!form.title.trim()) errs.title = 'Title is required';
  if (!form.description.trim()) errs.description = 'Description is required';
  if (!form.category.trim()) errs.category = 'Category is required';
  const price = parseFloat(form.price);
  if (isNaN(price) || price <= 0) errs.price = 'Enter a valid price';
  const stock = parseInt(form.stock, 10);
  if (isNaN(stock) || stock < 0) errs.stock = 'Enter a valid stock number';
  return errs;
}

export default function ProductForm({ product, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<ProductFormData>(
    product
      ? {
          title: product.title,
          description: product.description,
          category: product.category,
          price: String(product.price),
          stock: String(product.stock),
          brand: product.brand ?? '',
          discountPercentage: String(product.discountPercentage),
        }
      : empty
  );
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  // Prevents double-submit on fast clicks
  const inFlight = useRef(false);

  // Reset when the product prop changes (switching from add to edit)
  useEffect(() => {
    setForm(
      product
        ? {
            title: product.title,
            description: product.description,
            category: product.category,
            price: String(product.price),
            stock: String(product.stock),
            brand: product.brand ?? '',
            discountPercentage: String(product.discountPercentage),
          }
        : empty
    );
    setErrors({});
    setApiError('');
  }, [product]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;

    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    inFlight.current = true;
    setSubmitting(true);
    setApiError('');

    try {
      let saved: Product;
      if (product) {
        // The API echoes back the patch — we merge it with the original locally
        const patched = await updateProduct(product.id, form);
        saved = { ...product, ...patched };
      } else {
        const created = await createProduct(form);
        // DummyJSON returns id=195 for any add; give it a unique negative id locally
        saved = {
          ...created,
          id: -Date.now(),
          thumbnail: 'https://dummyjson.com/icon/products/1',
          images: [],
          reviews: [],
        } as Product;
      }
      onSuccess(saved, !product);
    } catch {
      setApiError('Could not save product. Please try again.');
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  const field = (
    name: keyof ProductFormData,
    label: string,
    type = 'text',
    multiline = false
  ) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-400">{label}</label>
      {multiline ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
        />
      )}
      {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <p className="rounded-xl bg-red-900/40 border border-red-700/50 px-4 py-3 text-sm text-red-300">
          {apiError}
        </p>
      )}
      {field('title', 'Title')}
      {field('description', 'Description', 'text', true)}
      <div className="grid grid-cols-2 gap-3">
        {field('category', 'Category')}
        {field('brand', 'Brand')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('price', 'Price ($)', 'number')}
        {field('stock', 'Stock', 'number')}
      </div>
      {field('discountPercentage', 'Discount (%)', 'number')}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="save-product"
          disabled={submitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Spinner size="sm" /> : null}
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}
