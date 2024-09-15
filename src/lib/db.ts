import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let cachedPool: any = global.mysqlPool;

// Create a new pool if it doesn't already exist (use caching to avoid re-creating in serverless environments)
if (!cachedPool) {
  cachedPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Adjust based resources and usage / curreently we are using t2.micro instance so we can set it to 10
    queueLimit: 0, // Set to 0 to allow unlimited queue (could be adjusted)
  });

  global.mysqlPool = cachedPool;
}

// Export the pool and query function
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