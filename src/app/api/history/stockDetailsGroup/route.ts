// /pages/api/history/stockDetailsGroup/index.ts
import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching stock details from the database...');

    const rows = await query(`
      SELECT 
          sd.id,
          sd.batch_id, 
          sd.date, 
          sd.action, 
          b1.name AS source_branch_name, 
          b2.name AS destination_branch_name, 
          CONCAT(e.first_name, ' ', e.last_name) AS employee_fullname 
      FROM 
          stock_details sd
      LEFT JOIN 
          branches b1 ON sd.source_branch = b1.id
      LEFT JOIN 
          branches b2 ON sd.destination_branch = b2.id
      LEFT JOIN 
          employees e ON sd.employee_id = e.id
      WHERE 
          sd.batch_id IS NOT NULL
      GROUP BY 
          sd.batch_id;
    `);

    console.log('Fetched stock details:', rows);
    return NextResponse.json({ stockDetails: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching stock details:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
//curl -X GET 'http://divine-jewel.local:8000/api/history/stockDetailsGroup' | jq .
//Users/prettyfaith/Documents/Github/divine-jewel/src/app/api/history/stockDetailsGroup