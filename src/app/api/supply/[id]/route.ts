import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const {
      supplier_id,
      sku,
      material_name,
      quantity,
      unit_of_measure,
      price_per_unit,
      destination_branch_id,
      employee_id,
      note,
      status,
    } = await request.json();

    console.log('Updating supply_data in the database...');

    const result = await query(
      'UPDATE `supply_data` SET supplier_id = ?, sku = ?, material_name = ?, quantity = ?, unit_of_measure = ?, price_per_unit = ?, destination_branch_id = ?, employee_id = ?, note = ?, status = ? WHERE id = ?',
      [
        supplier_id,
        sku,
        material_name,
        quantity,
        unit_of_measure,
        price_per_unit,
        destination_branch_id || null,
        employee_id || null,
        note || null,
        status,
        id,
      ]
    );

    console.log('Updated Supply Data:', result);
    return NextResponse.json({ message: 'Supply data updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while updating supply data:', error);
    return NextResponse.json({ error: 'Internal Server Error', data: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    console.log(`Deleting supply_data with id ${id} from the database...`);

    const result = await query('DELETE FROM `supply_data` WHERE id = ?', [id]);

    console.log('Deleted Supply Data:', result);
    return NextResponse.json({ message: 'Supply data deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while deleting supply data:', error);
    return NextResponse.json({ error: 'Internal Server Error', data: error.message }, { status: 500 });
  }
}
