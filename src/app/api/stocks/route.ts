// api/stocks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from '../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching stocks from database...');
    const rows = await query(`
      SELECT
        s.*,
        p.name AS product_name,
        p.SKU AS product_SKU,
        c.name AS category_name,
        p.size AS product_size,
        p.color AS product_color,
        p.image_url AS image_url,
        bc.address_line AS branch_name
      FROM 
        stocks s
      LEFT JOIN
        products p ON s.product_id = p.id
      LEFT JOIN
        category c ON p.category_id = c.id
      LEFT JOIN
        branches bc ON s.branch_code = bc.id
      ORDER BY
        p.name ASC;
    `);
    // console.log('Fetched stocks:', rows);
    return NextResponse.json({ stocks: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching stocks:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
   const { product_id, branch_code, quantity } = await request.json(); 
    try {
        // console.log('Adding stocks to database...');
        const result = await query(
        'INSERT INTO `stocks` (product_id, branch_code, quantity) VALUES (?, ?, ?)',
        [product_id, branch_code,  quantity]
        );
        // console.log('Added Stock:', result);
        return NextResponse.json({ message: 'stocks added successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('An error occurred while adding stocks:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

//curl -X GET 'http://divine-jewel.local:8000/api/stocks' | jq .