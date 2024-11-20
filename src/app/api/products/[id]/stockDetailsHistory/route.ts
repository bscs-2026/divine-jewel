//src/app/api/products/[id]/stockHistory/stocks/route.ts
//curl -X GET 'http://divine-jewel.local:8000/api/products/71/productStockHistory' | jq .

import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Extract product_id from the request parameters

    if (!id) {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 });
    }

    console.log('Fetching stock history for product_id:', id);

    // SQL query to fetch stock history
    const rows = await query(
      `
      SELECT 
          sd.product_id,
          sd.date,
          sd.action,
          sd.quantity,
          sd.batch_id,
          sb.name AS source_branch,
          db.name AS destination_branch,
          CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
          sd.stock_out_reason AS reason,
          sd.note
      FROM stock_details sd
      LEFT JOIN branches sb ON sd.source_branch = sb.id
      LEFT JOIN branches db ON sd.destination_branch = db.id
      LEFT JOIN employees e ON sd.employee_id = e.id
      WHERE sd.product_id = ?
      ORDER BY sd.date ASC;
      `,
      [id] // Use parameterized query to safely inject product_id
    );

    console.log('Fetched stock history:', rows);

    return NextResponse.json({ stockHistory: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching stock history:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
