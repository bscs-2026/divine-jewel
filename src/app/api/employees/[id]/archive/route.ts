// src/app/api/employees/[id]/archive/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { is_archive } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Validate that `is_archive` is a boolean
        if (typeof is_archive !== 'boolean') {
            return NextResponse.json({ error: 'Invalid value for is_archive' }, { status: 400 });
        }

        // console.log('Updating employee in database...');

        const result = await query(
            'UPDATE `employees` SET is_archive = ? WHERE id = ?',
            [is_archive, id]
        );

        // console.log('Updated employee:', result);

        return NextResponse.json({ message: 'Employee updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while updating employee:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}