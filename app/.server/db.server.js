/* global process */
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

// let db: Database;

// declare global {
//   let __db__: typeof drizzle | undefined;
// }
let db;

if (process.env.NODE_ENV === 'production') {
  const sqlite3 = new Database(process.env.DB_URL);
  db = drizzle(sqlite3);
} else {
  if (!global.__db__) {
    const sqlite3 = new Database(':memory:');
    db = drizzle(sqlite3);
    global.__db__ = db;
  }
  db = global.__db__;
}

export { db };
