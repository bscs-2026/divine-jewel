// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const rows = await query(`
      SELECT 
          p.*,
          c.name AS category_name, 
          SUM(s.quantity) AS stock
      FROM 
          products p
      LEFT JOIN 
          category c ON p.category_id = c.id
      LEFT JOIN 
          stocks s ON p.id = s.product_id
      GROUP BY 
          p.id
    `);
    return NextResponse.json({ products: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { SKU, category_id, name, description, size, color, price, image_url } = await request.json();
  
  try {
    const result = await query(
      'INSERT INTO `products` (SKU, category_id, name, description, size, color, price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [SKU, category_id, name, description || null, size, color, price, image_url || null]
    );

    const productId = result.insertId;
    await query(
      'INSERT INTO `stocks` (product_id, SKU, quantity, damaged, branch_code) VALUES (?, ?, ?, ?, ?)',
      [productId, SKU, 0, 0, 1]
    );

    return NextResponse.json({ message: 'Product added successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}


