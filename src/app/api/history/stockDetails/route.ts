// /pages/api/stock_details/index.ts
import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching stock details from the database...');
    
    const rows = await query(`
      SELECT
        sd.*,
        p.name AS product_name,
        p.SKU AS product_SKU,
        p.size AS product_size,
        p.color AS product_color,
        sbc.address_line AS source_branch_name,
        dbc.address_line AS destination_branch_name,
        e.first_name AS employee_name
      FROM 
        stock_details sd
      LEFT JOIN
        products p ON sd.product_id = p.id
      LEFT JOIN
        branches sbc ON sd.source_branch = sbc.id
      LEFT JOIN
        branches dbc ON sd.destination_branch = dbc.id
      LEFT JOIN
        employees e ON sd.employee_id = e.id
      ORDER BY
        sd.date DESC;
    `);
    
    console.log('Fetched stock details:', rows);
    return NextResponse.json({ stockDetails: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching stock details:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
