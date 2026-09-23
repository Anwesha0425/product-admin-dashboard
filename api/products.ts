import apiClient from '@/lib/axios';
import type { Product, ProductFormData, ProductsResponse } from '@/types';

interface FetchProductsParams {
  limit: number;
  skip: number;
  sortBy?: string;
  order?: string;
  signal?: AbortSignal;
}

export async function fetchProducts(params: FetchProductsParams): Promise<ProductsResponse> {
  const { signal, ...rest } = params;
  const { data } = await apiClient.get<ProductsResponse>('/products', {
    params: rest,
    signal,
  });
  return data;
}

export async function searchProducts(
  q: string,
  limit: number,
  skip: number,
  sortBy?: string,
  order?: string,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { data } = await apiClient.get<ProductsResponse>('/products/search', {
    params: { q, limit, skip, sortBy, order },
    signal,
  });
  return data;
}

export async function fetchProductsByCategory(
  category: string,
  limit: number,
  skip: number,
  sortBy?: string,
  order?: string,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { data } = await apiClient.get<ProductsResponse>(
    `/products/category/${category}`,
    { params: { limit, skip, sortBy, order }, signal }
  );
  return data;
}

export async function fetchProductById(id: number): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`);
  return data;
}

export async function createProduct(payload: ProductFormData): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products/add', {
    title: payload.title,
    description: payload.description,
    category: payload.category,
    price: parseFloat(payload.price),
    stock: parseInt(payload.stock, 10),
    brand: payload.brand,
    discountPercentage: parseFloat(payload.discountPercentage),
  });
  return data;
}

export async function updateProduct(id: number, payload: Partial<ProductFormData>): Promise<Product> {
  const body: Record<string, unknown> = {};
  if (payload.title) body.title = payload.title;
  if (payload.description) body.description = payload.description;
  if (payload.category) body.category = payload.category;
  if (payload.price) body.price = parseFloat(payload.price);
  if (payload.stock) body.stock = parseInt(payload.stock, 10);
  if (payload.brand) body.brand = payload.brand;
  if (payload.discountPercentage) body.discountPercentage = parseFloat(payload.discountPercentage);

  const { data } = await apiClient.put<Product>(`/products/${id}`, body);
  return data;
}

export async function deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean }> {
  const { data } = await apiClient.delete(`/products/${id}`);
  return data;
}
