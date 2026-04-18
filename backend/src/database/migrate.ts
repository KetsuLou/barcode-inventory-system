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
    ALTER TABLE products ADD COLUMN image_url TEXT;
  `);
  console.log('Migration completed successfully! Added image_url column to products table.');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('Column image_url already exists, skipping migration.');
  } else {
    console.error('Migration failed:', error);
  }
}

try {
  db.exec(`
    ALTER TABLE products ADD COLUMN tags TEXT;
  `);
  console.log('Migration completed successfully! Added tags column to products table.');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('Column tags already exists, skipping migration.');
  } else {
    console.error('Migration failed:', error);
  }
}

db.close();
