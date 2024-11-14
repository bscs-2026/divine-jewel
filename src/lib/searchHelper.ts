// src/lib/searchHelper.ts

import { Product } from '../types';

/**
 * Filters products by name based on the provided search query.
 * @param products - Array of Product objects
 * @param query - Search query to filter by name
 * @returns Filtered array of products
 */
export function searchProductsByName(products: Product[], query: string): Product[] {
  const lowerCaseQuery = query.toLowerCase();
  return products.filter(product => product.name.toLowerCase().includes(lowerCaseQuery));
}
