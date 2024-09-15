// src/app/api/products/id/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { SKU, category_id, name, description, size, color, price } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    console.log(`Updating product with ID: ${id}...`);

    // Update the product in the database
    const result = await query(
      'UPDATE `products` SET SKU = ?, category_id = ?, name = ?, description = ?, size = ?, color = ?, price = ? WHERE id = ?',
      [SKU, category_id, name, description || null, size, color, price, id]
    );

    console.log('Updated product:', result);

    return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while updating the product:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
