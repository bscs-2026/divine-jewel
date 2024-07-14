// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching products from database...');
    const rows = await query(`
      SELECT 
          p.*, 
          c.name AS category_name, 
          ii.quantity AS stock
      FROM 
          products p
      LEFT JOIN 
          category c ON p.category_id = c.id
      LEFT JOIN 
          inventory_item ii ON p.id = ii.product_id;
    `);
    console.log('Fetched products:', rows);
    return NextResponse.json({ products: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { category_id, name, price } = await request.json();
  try {
    console.log('Adding product to database...');
    const result = await query(
      'INSERT INTO `products` (category_id, name, price) VALUES (?, ?, ?)',
      [category_id, name, price]
    );
    console.log('Added product:', result);
    return NextResponse.json({ message: 'Product added successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('An error occurred while adding product:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }

}

