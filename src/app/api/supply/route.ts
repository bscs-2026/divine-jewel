import { NextRequest, NextResponse } from "next/server";
import { query } from '../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching supply data from database...');
    const rows = await query(`
      SELECT
        sd.id,
        sd.batch_id,
        sd.supply_date,
        sd.supplier_id,
        s.supplier_name,
        sd.status
      FROM 
        supply_data sd
      LEFT JOIN
        suppliers s ON sd.supplier_id = s.id
      GROUP BY 
        sd.batch_id;
    `);
    // console.log('Fetched supply data:', rows);
    return NextResponse.json({ supply_data: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching supply data', error);
    return NextResponse.json({ error: 'Internal Server Error', data: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supplies } = await request.json();  // Expecting an array of supplies

    if (!Array.isArray(supplies) || supplies.length === 0) {
      return NextResponse.json({ error: 'No supplies provided or invalid format' }, { status: 400 });
    }

    console.log('Inserting multiple supplies into the database...');

    // Ensure all fields are defined and convert undefined values to null or appropriate defaults
    const values = supplies.map(
      ({
        batch_id,
        supplier_id,
        sku,
        material_name,
        quantity,
        unit_of_measure,
        price_per_unit,
        destination_branch_id,
        employee_id,
        note,
        status
      }) => [
        batch_id ?? null,
        supplier_id ?? null,
        sku ?? null,
        material_name ?? '',
        quantity ?? 0,
        unit_of_measure ?? '',
        price_per_unit ?? 0,
        destination_branch_id ?? null,
        employee_id ?? null,
        note ?? null,
        status ?? 'pending'
      ]
    );

    // Dynamically create the placeholders for the number of rows you want to insert
    const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');

    // Flatten the array of values to match the placeholders
    const flattenedValues = values.flat();

    // Construct the query with dynamic placeholders
    const queryStr = `
      INSERT INTO supply_data 
      (batch_id, supplier_id, sku, material_name, quantity, unit_of_measure, price_per_unit, destination_branch_id, employee_id, note, status) 
      VALUES ${placeholders}
    `;

    // Log the query and values to check for issues
    // console.log('Query:', queryStr);
    // console.log('Flattened Values:', flattenedValues);

    // Execute the query with the flattened values
    const result = await query(queryStr, flattenedValues);

    // console.log('Inserted Supplies:', result);

    return NextResponse.json({ message: 'Supplies added successfully' }, { status: 200 });
  } catch (error: any) {
    // Log the error and the exact values that failed
    console.error('Database query error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', data: error.message }, { status: 500 });
  }
}
