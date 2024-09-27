import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching order details from the database...');

    const rows = await query(`
      SELECT 
          o.id AS order_id,
          o.date,
          o.total_amount,
          CONCAT(e.first_name, ' ', e.last_name) AS employee_name
      FROM 
          orders o
      LEFT JOIN 
          employees e ON o.employee_id = e.id
      WHERE 
          o.id IS NOT NULL
      ORDER BY 
          o.date DESC;
    `);

    console.log('Fetched order details:', rows);
    return NextResponse.json({ orders: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching order details:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

//curl -X GET 'http://divine-jewel.local:8000/api/history/orders' | jq .