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

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '0.75rem',
  backgroundColor: '#1c1007',
  border: '1px solid #5a3518',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  color: '#fde8c8',
  outline: 'none',
  resize: 'none' as const,
};

export default function ProductForm({ product, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<ProductFormData>(
    product
      ? { title: product.title, description: product.description, category: product.category,
          price: String(product.price), stock: String(product.stock),
          brand: product.brand ?? '', discountPercentage: String(product.discountPercentage) }
      : empty
  );
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const inFlight = useRef(false);

  useEffect(() => {
    setForm(
      product
        ? { title: product.title, description: product.description, category: product.category,
            price: String(product.price), stock: String(product.stock),
            brand: product.brand ?? '', discountPercentage: String(product.discountPercentage) }
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
        const patched = await updateProduct(product.id, form);
        saved = { ...product, ...patched };
      } else {
        const created = await createProduct(form);
        saved = { ...created, id: -Date.now(), thumbnail: 'https://dummyjson.com/icon/products/1', images: [], reviews: [] } as Product;
      }
      onSuccess(saved, !product);
    } catch {
      setApiError('Could not save product. Please try again.');
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  const field = (name: keyof ProductFormData, label: string, type = 'text', multiline = false) => (
    <div>
      <label className="mb-1 block text-xs font-medium" style={{ color: '#a07850' }}>{label}</label>
      {multiline ? (
        <textarea name={name} value={form[name]} onChange={handleChange} rows={3}
          style={{ ...inputStyle, borderColor: errors[name] ? '#ef4444' : '#5a3518' }}
          onFocus={(e) => { e.target.style.borderColor = '#d97706'; e.target.style.boxShadow = '0 0 0 2px #d9770633'; }}
          onBlur={(e)  => { e.target.style.borderColor = errors[name] ? '#ef4444' : '#5a3518'; e.target.style.boxShadow = 'none'; }}
        />
      ) : (
        <input type={type} name={name} value={form[name]} onChange={handleChange}
          style={{ ...inputStyle, borderColor: errors[name] ? '#ef4444' : '#5a3518' }}
          onFocus={(e) => { e.target.style.borderColor = '#d97706'; e.target.style.boxShadow = '0 0 0 2px #d9770633'; }}
          onBlur={(e)  => { e.target.style.borderColor = errors[name] ? '#ef4444' : '#5a3518'; e.target.style.boxShadow = 'none'; }}
        />
      )}
      {errors[name] && <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <p className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#3b0e0e', border: '1px solid #7f1d1d', color: '#fca5a5' }}>
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
          className="flex-1 rounded-xl py-2.5 text-sm font-medium transition"
          style={{ border: '1px solid #5a3518', color: '#c8a060' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#361f0c'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          Cancel
        </button>
        <button
          type="submit"
          id="save-product"
          disabled={submitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition"
          style={{ backgroundColor: '#d97706', color: '#1c1007', opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
          onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#b45309'; }}
          onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#d97706'; }}
        >
          {submitting ? <Spinner size="sm" /> : null}
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}
