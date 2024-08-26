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

export async function POST(request: NextRequest) {
  const { address_line } = await request.json();
  try {
    console.log('Adding branch to database...');
    const result = await query('INSERT INTO branches (address_line) VALUES (?)', [address_line]);
    console.log('Added Branch:', result);
    return NextResponse.json({ message: 'Branch added successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('An error occurred while adding branch:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}