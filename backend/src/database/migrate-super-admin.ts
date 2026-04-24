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
  const user = db.prepare('SELECT * FROM users WHERE id = 1').get() as any;
  
  if (user) {
    db.prepare('UPDATE users SET role = ? WHERE id = 1').run('super_admin');
    console.log('Successfully set user with id=1 as super_admin');
  } else {
    console.log('No user found with id=1');
  }
} catch (error) {
  console.error('Migration failed:', error);
} finally {
  db.close();
}
