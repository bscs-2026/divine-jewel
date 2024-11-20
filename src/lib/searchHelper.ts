// src/lib/searchHelper.ts

import { Product } from '../types';
import { OrderDetail } from '../types';

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

export function searchOrderByID(orders: OrderDetail[], query: string): OrderDetail[] {
  return orders.filter(order => order.order_id.toString().toLowerCase().includes(query.toLowerCase()));
}
