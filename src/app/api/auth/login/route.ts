// src/app/api/auth/login/route.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '../../../../lib/db';
import dotenv from 'dotenv';
import { hashPassword, comparePassword } from '../../../../lib/passwordHelper';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, branch } = body;

    if (!username || !password || !branch) {
      return NextResponse.json({ error: 'Username, password, and branch are required.' }, { status: 400 });
    }

    const userResults: any = await query('SELECT * FROM employees WHERE username = ?', [username]);
    const branchResults: any = await query('SELECT * FROM branches WHERE name = ?', [branch]);

    if (userResults.length === 0 || branchResults.length === 0) {
      return NextResponse.json({ error: 'Invalid username, password, or branch.' }, { status: 401 });
    }

    const user = userResults[0];
    const branchData = branchResults[0];
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    // Create JWT payload
    const payload = { id: user.id, username: user.username, role_id: user.role_id, branch_id: branchData.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Invalidate old sessions for the user
    await query('DELETE FROM sessions WHERE user_id = ?', [user.id]);

    // Store new session in the database
    await query(
      'INSERT INTO sessions (user_id, token, expiration, branch_id) VALUES (?, ?, ?, ?)',
      [user.id, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), branchData.id]
    );

    // Set JWT and branch in the session cookie
    const response = NextResponse.json({ success: true, userId: user.id }, { status: 200 });
    const cookieOptions = {
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    };

    response.cookies.set('sessionToken', token, cookieOptions);
    response.cookies.set('user_id', user.id, { ...cookieOptions, httpOnly: false });
    response.cookies.set('username', user.username, { ...cookieOptions, httpOnly: false });
    response.cookies.set('role_id', user.role_id, { ...cookieOptions, httpOnly: false });
    response.cookies.set('branch_id', branchData.id, { ...cookieOptions, httpOnly: false });
    response.cookies.set('branch_name', branchData.name, { ...cookieOptions, httpOnly: false });

    return response;
  } catch (error) {
    console.error('An error occurred while logging in:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
