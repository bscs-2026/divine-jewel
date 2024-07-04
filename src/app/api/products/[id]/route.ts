// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

/*
curl -X PUT http://divine-jewel.local:8000/api/products/3 -H "Content-Type: application/json" -d '{
  "category_id": 1,
  "name": "Kuromi",
  "price": 200,
  "is_archive": 2
}'
*/

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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