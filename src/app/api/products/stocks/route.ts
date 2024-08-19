// api/products/stocks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching stocks from database...');
    const rows = await query(`
      SELECT
        s.id,
        p.name AS product_name,
        bc.address_line AS branch_name,
        s.quantity AS stock
      FROM 
        stocks s
      LEFT JOIN
        products p ON s.product_id = p.id
      LEFT JOIN
        branches bc ON s.branch_code = bc.id;
    `);
    console.log('Fetched stocks:', rows);
    return NextResponse.json({ stocks: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching stocks:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
   const { product_id, branch_code, quantity } = await request.json(); 
    try {
        console.log('Adding stocks to database...');
        const result = await query(
        'INSERT INTO `stocks` (product_id, branch_code, quantity) VALUES (?, ?, ?)',
        [product_id, branch_code,  quantity]
        );
        console.log('Added Stock:', result);
        return NextResponse.json({ message: 'stocks added successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('An error occurred while adding stocks:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

