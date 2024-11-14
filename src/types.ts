// src/types.ts
export interface Product {
    id: number;
    SKU: string;
    category_id: number;
    name: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    is_archived?: boolean;
  }
  
  export interface Category {
    id: number;
    name: string;
    description: string;
  }
  