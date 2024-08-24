// api/supply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from '../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching supply data from database...');
    const rows = await query(`
      SELECT 
	      sd.*,
	      s.supplier_name AS supplier 
      FROM 
        supply_data sd
      LEFT JOIN
        suppliers s ON sd.supplier_id = s.id;
    `);
    console.log('Fetched supply data:', rows);
    return NextResponse.json({ supply_data: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching supply data', error);
    return NextResponse.json({ error: 'Internal Server Error', data: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { supplier_id, sku, material_name, quantity, unit_of_measure, price_per_unit, destination_branch_id, employee_id, note, status } = await request.json();
  try {
    console.log('Adding supply data to database...');
    const result = await query(
      'INSERT INTO `supply_data` (supplier_id, sku, material_name, quantity, unit_of_measure, price_per_unit, destination_branch_id, employee_id, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [supplier_id, sku, material_name, quantity, unit_of_measure, price_per_unit, destination_branch_id || null, employee_id || null, note || null, status || 'pending']
    );
    console.log('Added Supply Data:', result);
    return NextResponse.json({ message: 'Supply data added successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('An error occurred while adding supply data', error);
    return NextResponse.json({ error: 'Internal Server Error', data: error.message }, { status: 500 });
  }
}


