// src/app/api/employees/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET() {
    try {
        console.log('Fetching employees from database...');
        const rows = await query('SELECT * FROM employees');
        console.log('Fetched employees:', rows);
        return NextResponse.json({ Employees: rows }, { status: 200 });
      } catch (error: any) {
        console.error('An error occurred while fetching employees:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
      }
}

