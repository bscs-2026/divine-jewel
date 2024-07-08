// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching products from database...');
    const rows = await query(`
      SELECT products.*, category.name as category_name
      FROM products
      LEFT JOIN category
      ON products.category_id = category.id
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


export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { category_id, name, price, is_archive } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    console.log('Updating product in database...');
    
    const result = await query(
      'UPDATE `products` SET category_id = ?, name = ?, price = ?, is_archive = ? WHERE id = ?',
      [category_id, name, price, is_archive, id]
    );
    
    console.log('Updated product:', result);
    
    return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while updating product:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

