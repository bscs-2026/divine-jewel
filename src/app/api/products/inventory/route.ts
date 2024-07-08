import { NextRequest, NextResponse } from "next/server";
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching inventory_item from database...');
    const rows = await query('SELECT * FROM inventory_item');
    console.log('Fetched inventory:', rows);
    return NextResponse.json({ inventory: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching inventory:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
   const { product_id, quantity } = await request.json(); 
    try {
        console.log('Adding inventory to database...');
        const result = await query(
        'INSERT INTO `inventory_item` (product_id, quantity) VALUES (?, ?)',
        [product_id, quantity]
        );
        console.log('Added inventory:', result);
        return NextResponse.json({ message: 'Inventory added successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('An error occurred while adding inventory:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

