// backend/scripts/clear_seed.js
// Safely remove all seeded data from hospital_management tables.
// Usage: from backend folder run `node scripts/clear_seed.js`

const mysql = require('mysql2/promise');
require('dotenv').config();
const path = require('path');

async function run() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
  const database = process.env.DB_NAME || 'hospital_management';

  let conn;
  try {
    conn = await mysql.createConnection({ host, user, password, port, database, multipleStatements: true });
    console.log('Connected to DB. Removing seeded data...');
    const sql = `
      SET FOREIGN_KEY_CHECKS = 0;
      TRUNCATE TABLE appointments;
      TRUNCATE TABLE bills;
      TRUNCATE TABLE patients;
      TRUNCATE TABLE doctors;
      TRUNCATE TABLE rooms;
      TRUNCATE TABLE staff;
      SET FOREIGN_KEY_CHECKS = 1;
    `;
    await conn.query(sql);
    console.log('All tables truncated. Seed data removed.');
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Error clearing seed data:', err.message || err);
    if (conn) await conn.end();
    process.exit(1);
  }
}

run();
