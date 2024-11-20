import { query } from './db';

/**
 * Verifies if a session token exists in the database.
 * @param token - The session token to verify.
 * @returns A boolean indicating if the session is valid.
 */
export async function verifySession(token: string): Promise<boolean> {
  try {
    const result: { token: string }[] = await query('SELECT * FROM sessions WHERE token = ?', [token]);
    return result.length > 0;
  } catch (error) {
    console.error('Error verifying session:', error);
    return false;
  }
}
