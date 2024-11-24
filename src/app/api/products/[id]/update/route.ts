// src/app/api/products/[id]/update/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { deleteFromS3 } from '@/lib/s3Helpers';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;

    const { SKU, category_id, name, description, size, color, price, image_url } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Retrieve the current image_url from the database
    const currentProduct = await query('SELECT image_url FROM products WHERE id = ?', [id]);
    if (currentProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const currentImageUrl = currentProduct[0].image_url;

    // 
    if (currentImageUrl && currentImageUrl !== image_url) {
      await deleteFromS3(currentImageUrl);
    }
    
    // Update the product with the new details, including the new image_url
    const result = await query(
      'UPDATE `products` SET SKU = ?, category_id = ?, name = ?, description = ?, size = ?, color = ?, price = ?, image_url = ? WHERE id = ?',
      [SKU, category_id, name, description || null, size, color, price, image_url || null, id]
    );

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
