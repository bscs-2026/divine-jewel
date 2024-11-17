import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const data = await query(
      `SELECT 
        b.name AS branch_name, 
        b.address_line, 
        b.id AS branch_code, 
        COUNT(o.id) AS order_count,
        CONCAT(u.first_name, ' ', u.last_name) AS inCharge
      FROM rms_db.branches b
      LEFT JOIN rms_db.orders o ON b.id = o.branch_code
      LEFT JOIN rms_db.sessions s ON b.id = s.branch_id
      LEFT JOIN rms_db.employees u ON s.user_id = u.id
      GROUP BY b.id
      ORDER BY b.id`
    );

    // Mapping the result data to match the expected structure
    const branches = data.map((row: any) => ({
      branch_name: row.branch_name,
      address_line: row.address_line,
      branch_code: row.branch_code,
      order_count: row.order_count,
      inCharge: row.inCharge, // Adding inCharge to the result
    }));

    return NextResponse.json({ branches }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching branches:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
