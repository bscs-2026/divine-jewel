import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const { supplier_name, contact_info, address, email, phone_number } = await request.json();

    if (!id) {
        return NextResponse.json({ error: 'Supplier ID is required' }, { status: 400 });
    }

    try {
        console.log(`Updating supplier with ID ${id}...`);
        const result = await query(
            'UPDATE `suppliers` SET supplier_name = ?, contact_info = ?, address = ?, email = ?, phone_number = ? WHERE id = ?',
            [supplier_name, contact_info || null, address || null, email || null, phone_number || null, id]
        );

        console.log('Updated Supplier:', result);
        return NextResponse.json({ message: 'Supplier updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while updating the supplier:', error);
        return NextResponse.json({ error: 'Internal Server Error', data: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'Supplier ID is required' }, { status: 400 });
    }

    try {
        console.log(`Deleting supplier with ID ${id}...`);
        const result = await query(
            'DELETE FROM `suppliers` WHERE id = ?',
            [id]
        );

        console.log('Deleted Supplier:', result);
        return NextResponse.json({ message: 'Supplier deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while deleting the supplier:', error);
        return NextResponse.json({ error: 'Internal Server Error', data: error.message }, { status: 500 });
    }
}