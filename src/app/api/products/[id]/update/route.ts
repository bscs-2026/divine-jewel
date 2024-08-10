// src/app/api/products/id/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { category_id, name, price } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    console.log('Updating product in database...');

    const result = await query(
      'UPDATE `products` SET category_id = ?, name = ?, price = ? WHERE id = ?',
      [category_id, name, price, id]
    );

    console.log('Updated product:', result);

    return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while updating product:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
