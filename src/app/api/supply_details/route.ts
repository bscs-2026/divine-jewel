// api/supply_details/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from '../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching supply details from database...');
    const rows = await query(`
      SELECT * FROM supply_details;
    `);
    console.log('Fetched supply details:', rows);
    return NextResponse.json({ supply_details: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching supply details', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { supplier_name, material_name, quantity, unit_of_measure, status, destination_branch } = await request.json(); 
  try {
      console.log('Adding supply details to database...');
      const result = await query(
      'INSERT INTO `supply_details` (supplier_name, material_name, quantity, unit_of_measure, status, destination_branch) VALUES (?, ?, ?, ?, ?, ?)',
      [supplier_name, material_name, quantity, unit_of_measure, status, destination_branch || null]
      );
      console.log('Added Supply Detail:', result);
      return NextResponse.json({ message: 'supply details added successfully' }, { status: 201 });
  } catch (error: any) {
      console.error('An error occurred while adding supply details', error);
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}


