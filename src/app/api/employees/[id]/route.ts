// src/app/api/employees/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { hashPassword } from '../../../../lib/passwordHelper';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const {
            first_name,
            last_name,
            address,
            birth_date,
            email_address,
            contact_number,
            employee_type,
            role_id,
            username,
            password,
        } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // console.log('Updating employee in database...');

        let queryStr = 'UPDATE `employees` SET first_name = ?, last_name = ?, address = ?, birth_date = ?, email_address = ?, contact_number = ?, employee_type = ?, role_id = ?, username = ?';
        const queryParams = [
            first_name,
            last_name,
            address,
            birth_date,
            email_address,
            contact_number,
            employee_type,
            role_id,
            username,
        ];

        if (password && password.trim() !== "") {
            const hashedPassword = await hashPassword(password);
            queryStr += ", password = ?";
            queryParams.push(hashedPassword);
          }
      
          queryStr += " WHERE id = ?";
          queryParams.push(id);

        const result = await query(queryStr, queryParams);

        // console.log('Updated employee:', result);
        return NextResponse.json({ message: 'Employee updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while updating employee:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
};

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // console.log('Deleting employee from database...');

        const result = await query('DELETE FROM `employees` WHERE id = ?', [id]);

        // console.log('Deleted employee:', result);
        return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('An error occurred while deleting employee:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
};
