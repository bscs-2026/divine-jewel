// src/app/api/products/category/last-sku/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Query the database to get the last SKU for the specified category
    const results = await query(
      `SELECT SKU FROM products WHERE category_id = ? ORDER BY SKU DESC LIMIT 1`,
      [categoryId]
    );

    const lastSKU = results.length > 0 ? results[0].SKU : null;

    return NextResponse.json({ lastSKU });
  } catch (error) {
    console.error('Error fetching last SKU:', error);
    return NextResponse.json({ error: 'Error fetching last SKU' }, { status: 500 });
  }
}
