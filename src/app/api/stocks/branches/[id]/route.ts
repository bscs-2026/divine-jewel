import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { name, address_line } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Branch ID is required' }, { status: 400 });
        }
        console.log('Updating branch in database...');

        const result = await query(
            'UPDATE `branches` SET name = ?, address_line = ? WHERE id = ?',
            [name, address_line, id]
        );

        console.log('Updated Branch:', result);

        return NextResponse.json({ message: 'Branch updated successfully' }, { status: 200 });

    } catch (error: any){
        console.error('An error occurred while updating branch:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'Branch ID is required' }, { status: 400 });
        }
        console.log('Deleting branch from database...');
        const result = await query('DELETE FROM `branches` WHERE id = ?', [id]);

        console.log('Deleted Branch:', result);
        return NextResponse.json({ message: 'Branch deleted successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('An error occurred while deleting the branch:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
