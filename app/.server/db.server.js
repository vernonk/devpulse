/* global process */
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { members } from '../drizzle/schema.server';

let db;
let globalDb;

if (process.env.NODE_ENV === 'production') {
  const sqlite3 = new Database(process.env.DB_URL);
  db = drizzle(sqlite3, { schema: { members } });
} else {
  if (!globalDb) {
    const sqlite3 = new Database(process.env.DB_URL);
    db = drizzle(sqlite3, { schema: { members } });
    globalDb = db;
  }
  db = globalDb;
}

export { db };
