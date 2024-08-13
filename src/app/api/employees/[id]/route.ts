import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { first_name, last_name, email_address, contact_number, employee_type, role_id, username, password, } = await request.json();
        // const { first_name, last_name, email_address, contact_number, employee_type, role_id, username, password, status, is_archive} = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        console.log('Updating employee in database...');

        const result = await query('UPDATE `employees` SET first_name = ?, last_name = ?, email_address = ?, contact_number = ?, employee_type = ?, role_id = ?, username = ?, password = ? WHERE id = ?', 
            [first_name, last_name, email_address, contact_number, employee_type, role_id, username, password, id]);

        console.log('Updated employee:', result);
        return NextResponse.json({ message: 'Employee updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while updating employee:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
};

// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         const { id } = params;

//         if (!id) {
//             return NextResponse.json({ error: 'ID is required' }, { status: 400 });
//         }

//         console.log('Deleting employee from database...');

//         const result = await query('DELETE FROM `employees` WHERE id = ?', [id]);

//         console.log('Deleted employee:', result);
//         return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
//     } catch (error: any) {
//         console.error('An error occurred while deleting employee:', error);
//         return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
//     }
// };