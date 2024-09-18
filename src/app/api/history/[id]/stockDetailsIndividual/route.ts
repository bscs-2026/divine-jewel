// src/app/api/history/[id]/stockDetailsIndividual/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // 'id' is the batch_id

    if (!id) {
      return NextResponse.json({ error: 'batch_id is required' }, { status: 400 });
    }

    console.log('Fetching stock details for batch_id:', id);

    const rows = await query(`
        SELECT 
            sd.id,
            sd.batch_id, 
            sd.date, 
            sd.action, 
            sd.note,
            b1.name AS source_branch_name, 
            b2.name AS destination_branch_name, 
            CONCAT(e.first_name, ' ', e.last_name) AS employee_fullname, 
            p.name AS product_name, 
            p.SKU AS product_sku, 
            p.size AS product_size, 
            p.color AS product_color, 
            sd.quantity
        FROM 
            stock_details sd
        LEFT JOIN 
            branches b1 ON sd.source_branch = b1.id
        LEFT JOIN 
            branches b2 ON sd.destination_branch = b2.id
        LEFT JOIN 
            employees e ON sd.employee_id = e.id
        LEFT JOIN 
            products p ON sd.product_id = p.id
        WHERE 
            sd.batch_id = ?;
    `, [id]);

    console.log('Fetched stock details:', rows);
    return NextResponse.json({ stockDetails: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching stock details:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
