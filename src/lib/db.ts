// lib/db.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let cachedPool: any = global.mysqlPool;

if (!cachedPool) {
  cachedPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  global.mysqlPool = cachedPool;
}

export const pool = cachedPool;

// A utility function to perform database queries
export async function query(sql: string, values: any[] = []) {
  try {
    const [results] = await pool.execute(sql, values);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

// Function to get a connection and start a transaction
export async function getConnection() {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
}
