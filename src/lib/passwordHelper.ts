// src/lib/sessionHelper.ts

import bcrypt from 'bcryptjs';

/**
 * Hashes a plain text password.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

/**
 * Compares a plain text password with a hashed password.
 * @param {string} plainPassword - The plain text password.
 * @param {string} hashedPassword - The hashed password from the database.
 * @returns {Promise<boolean>} True if the password matches, false otherwise.
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}
