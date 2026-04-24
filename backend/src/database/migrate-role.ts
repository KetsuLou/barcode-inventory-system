import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'inventory.db');
const db = new Database(dbPath);

try {
  db.exec(`
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
  `);
  console.log('Migration completed successfully! Added role column to users table.');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('Column role already exists in users table, skipping migration.');
  } else {
    console.error('Migration failed for users table:', error);
  }
}

db.close();