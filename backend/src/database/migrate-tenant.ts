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
    ALTER TABLE users ADD COLUMN tenant_id INTEGER DEFAULT 1;
  `);
  console.log('Migration completed successfully! Added tenant_id column to users table.');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('Column tenant_id already exists in users table, skipping migration.');
  } else {
    console.error('Migration failed for users table:', error);
  }
}

try {
  db.exec(`
    ALTER TABLE products ADD COLUMN tenant_id INTEGER DEFAULT 1;
  `);
  console.log('Migration completed successfully! Added tenant_id column to products table.');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('Column tenant_id already exists in products table, skipping migration.');
  } else {
    console.error('Migration failed for products table:', error);
  }
}

try {
  db.exec(`
    ALTER TABLE barcode_api_config ADD COLUMN tenant_id INTEGER DEFAULT 1;
  `);
  console.log('Migration completed successfully! Added tenant_id column to barcode_api_config table.');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('Column tenant_id already exists in barcode_api_config table, skipping migration.');
  } else {
    console.error('Migration failed for barcode_api_config table:', error);
  }
}

try {
  db.exec(`
    ALTER TABLE remark_images ADD COLUMN tenant_id INTEGER DEFAULT 1;
  `);
  console.log('Migration completed successfully! Added tenant_id column to remark_images table.');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('Column tenant_id already exists in remark_images table, skipping migration.');
  } else {
    console.error('Migration failed for remark_images table:', error);
  }
}

db.close();