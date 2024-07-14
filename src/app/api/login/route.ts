// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    console.log('Fetching users from database...');
    const rows = await query('SELECT username, password, role_id FROM `employees`');
    console.log('Fetched users:', rows);
    return NextResponse.json({ users: rows }, { status: 200 });
  } catch (error: any) {
    console.error('An error occurred while fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
