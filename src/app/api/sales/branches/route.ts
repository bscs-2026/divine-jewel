import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const data = await query(
      "SELECT b.name AS branch_name, b.address_line, b.id AS branch_code, COUNT(o.id) AS order_count FROM rms_db.branches b LEFT JOIN rms_db.orders o ON b.id = o.branch_code GROUP BY b.id ORDER BY b.id"
    );
    const branches = data.map((row: any) => ({
      branch_name: row.branch_name,
      address_line: row.address_line,
      branch_code: row.branch_code,
      order_count: row.order_count,
    }));
    return NextResponse.json({ branches }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching branches:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}