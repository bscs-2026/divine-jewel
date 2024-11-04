// src/lib/sessionHelper.ts

import { query } from './db';

export async function verifySession(token: string): Promise<boolean> {
  try {
    const result: any = await query('SELECT * FROM sessions WHERE token = ?', [token]);
    return result.length > 0;
  } catch (error) {
    console.error('Error verifying session:', error);
    return false;
  }
}
