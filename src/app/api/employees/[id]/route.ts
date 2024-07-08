import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { first_name, last_name, email_address, contact_number, employee_type, role_id, username, password, status, is_archive} = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        console.log('Updating employee in database...');

        const result = await query('UPDATE `employees` SET first_name = ?, last_name = ?, email_address = ?, contact_number = ?, employee_type = ?, role_id = ?, username = ?, password = ?, status = ?, is_archive = ? WHERE id = ?', [first_name, last_name, email_address, contact_number, employee_type, role_id, username, password, status, is_archive, id]);

        console.log('Updated employee:', result);
        return NextResponse.json({ message: 'Employee updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while updating employee:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
    

}