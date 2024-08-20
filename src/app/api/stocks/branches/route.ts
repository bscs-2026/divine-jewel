import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching branches from database...');
    const rows = await query('SELECT * FROM branches');
    console.log('Fetched branches:', rows);
    return NextResponse.json({ branches: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching branches:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

//curl -X GET 'http://divine-jewel.local:8000/api/products/inventory/branches' | jq .
