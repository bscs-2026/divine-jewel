import { NextRequest, NextResponse } from "next/server";
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching inventory_item from database...');
    const rows = await query(`
      SELECT
        ii.*,
        p.name AS product_name,
        sl.address_line AS shop_location,
        ii.quantity AS stock
      FROM 
        inventory_item ii
      LEFT JOIN
        products p ON ii.product_id = p.id
      LEFT JOIN
        shop_location sl ON ii.shop_location = sl.id;
    `);
    console.log('Fetched inventory:', rows);
    return NextResponse.json({ inventory: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching inventory:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
   const { product_id, shop_location, quantity } = await request.json(); 
    try {
        console.log('Adding inventory to database...');
        const result = await query(
        'INSERT INTO `inventory_item` (product_id, shop_location, quantity) VALUES (?, ?, ?)',
        [product_id, shop_location, quantity]
        );
        console.log('Added inventory:', result);
        return NextResponse.json({ message: 'Inventory added successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('An error occurred while adding inventory:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

