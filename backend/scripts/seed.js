// backend/scripts/seed.js
// Simple script to import hospital_management.sql into MySQL using mysql2.
// Usage: from backend folder run `node scripts/seed.js`.
// It reads DB credentials from environment variables (or .env) using dotenv.

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const sqlFile = path.resolve(__dirname, '../../hospital_management.sql');
  if (!fs.existsSync(sqlFile)) {
    console.error('SQL file not found at', sqlFile);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFile, 'utf8');

  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

  console.log(`Connecting to MySQL ${user}@${host}:${port} ...`);

  let conn;
  try {
    conn = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true,
      // do not specify database because the SQL script creates it
    });

    console.log('Connected. Executing SQL script (this may take a few seconds)...');
    const [results] = await conn.query(sql);
    console.log('SQL executed. Results summary:');
    // results can be array or object depending on statements; just print success message
    console.log('Import completed.');
    process.exit(0);
  } catch (err) {
    console.error('Error running SQL import:');
    console.error(err.message || err);
    process.exit(2);
  } finally {
    if (conn) await conn.end();
  }
}

run();
