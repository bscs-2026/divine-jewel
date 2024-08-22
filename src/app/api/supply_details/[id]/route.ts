import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { supplier_name, material_name, quantity, unit_of_measure, status, destination_branch } = await request.json();

        console.log('Updating supply_details in database...');

        const result = await query(
            'UPDATE `supply_details` SET supplier_name = ?, material_name = ?, quantity = ?, unit_of_measure = ?, status = ?, destination_branch = ? WHERE id = ?',
            [supplier_name, material_name, quantity, unit_of_measure, status, destination_branch || null, id]
        );

        console.log('Updated Supply Detail:', result);
        return NextResponse.json({ message: 'Supply details updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while updating supply details:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
