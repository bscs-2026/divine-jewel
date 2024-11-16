// src/app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('sessionToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No session token found.' }, { status: 400 });
    }

    // Delete session from the database
    await query('DELETE FROM sessions WHERE token = ?', [token]);

    // Create a response that clears the cookies
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' }, { status: 200 });
    response.cookies.delete('sessionToken');
    response.cookies.delete('user_id');
    response.cookies.delete('username');
    response.cookies.delete('role_id');
    response.cookies.delete('branch_id');
    response.cookies.delete('branch_name');
    response.cookies.delete('first_name');
    response.cookies.delete('last_name');

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
