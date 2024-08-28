// src/app/api/employees/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET() {
    try {
        console.log('Fetching employees from database...');
        const rows = await query(
         `SELECT 
              e.*,
              r.name AS role_name
           FROM 
              employees e
           LEFT JOIN 
              roles r ON e.role_id = r.id
              ORDER BY
                r.name ASC, e.last_name ASC, e.first_name ASC`
        );
        console.log('Fetched employees:', rows);
        return NextResponse.json({ Employees: rows }, { status: 200 });
      } catch (error: any) {
        console.error('An error occurred while fetching employees:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
      }
}

export async function POST(request: NextRequest) { 
  const { first_name, last_name, email_address, contact_number, employee_type, role_id, username, password, is_archive} = await request.json();
  try {
    console.log('Adding employee to database...');
    const result = await query(
      'INSERT INTO `employees` (first_name, last_name, email_address, contact_number, employee_type, role_id, username, password, is_archive ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email_address, contact_number, employee_type, role_id, username, password, 0]
      // 'INSERT INTO `employees` (first_name, last_name, email_address, contact_number, employee_type, role_id, username, password, status, is_archive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      // [first_name, last_name, email_address, contact_number, employee_type, role_id, username, password, status, is_archive]
    );
    console.log('Added employee:', result);
    return NextResponse.json({ message: 'Employee added successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('An error occurred while adding employee:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

