import apiClient from '@/lib/axios';
import type { Category } from '@/types';

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/products/categories');
  return data;
}
