// lib/db.ts

import { Pool } from 'pg';

// Set up the PostgreSQL connection pool
const pool = new Pool({
  user: process.env.NEXT_DB_USER,
  host: process.env.NEXT_DB_HOST,
  database: process.env.NEXT_DB_NAME,
  password: process.env.NEXT_DB_PASSWORD,
  port: process.env.NEXT_DB_PORT ? Number(process.env.NEXT_DB_PORT) : undefined,
});

// Utility function to query the database
export const query = async (text: string, params: unknown[] = []) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
};
