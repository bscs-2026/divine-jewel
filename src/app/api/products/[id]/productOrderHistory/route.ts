// src/api/products/[id]/orderHistory/route.ts
// curl -X GET 'http://divine-jewel.local:8000/api/products/71/productOrderHistory' | jq .

import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Extract product_id from the request parameters

    if (!id) {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 });
    }

    console.log('Fetching order history for product_id:', id);

    // SQL query to fetch order history
    const rows = await query(
      `
      SELECT 
          od.product_id,
          od.date,
          od.status AS action,
          od.quantity AS quantity,
          od.order_id,
          b.name AS source_branch,
          CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
          od.note
      FROM order_details od
      INNER JOIN orders o ON od.order_id = o.id
      LEFT JOIN employees e ON o.employee_id = e.id
      LEFT JOIN branches b ON o.branch_code = b.id
      WHERE od.product_id = ?
      ORDER BY od.date ASC;
      `,
      [id] // Use parameterized query to safely inject product_id
    );

    console.log('Fetched order history:', rows);

    return NextResponse.json({ orderHistory: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching order history:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
