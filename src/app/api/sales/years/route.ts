import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const data = await query(
      "SELECT YEAR(date) AS year FROM orders GROUP BY year ORDER BY year ASC"
      // "SELECT YEAR(date) AS year, COUNT(*) AS year_order_count FROM orders GROUP BY year ORDER BY year ASC"
    );
    return NextResponse.json({ Years: data }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching years:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}