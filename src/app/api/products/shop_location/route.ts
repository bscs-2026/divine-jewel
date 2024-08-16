import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching shop location from database...');
    const rows = await query('SELECT * FROM shop_location');
    console.log('Fetched shop location:', rows);
    return NextResponse.json({ shop_location: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching shop_location:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

//curl -X GET 'http://divine-jewel.local:8000/api/products/shop_location' | jq .
