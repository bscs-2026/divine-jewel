import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');

  if (!year) {
    return NextResponse.json({ error: 'Year parameter is required' }, { status: 400 });
  }

  try {
    const data = await query(
      "SELECT YEAR(date) AS year, COUNT(*) AS yearly_orders FROM orders WHERE YEAR(date) = ?",
      [year]
    );
    return NextResponse.json({ YearlyOrders: data }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching total orders:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}