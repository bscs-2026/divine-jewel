// src/app/api/verify-session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '../../../lib/sessionHelper';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const isValid = await verifySession(token);
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
