// src/app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching orders from database...');
    const rows = await query('SELECT * FROM `order`');
    console.log('Fetched orders:', rows);
    return NextResponse.json({ orders: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
