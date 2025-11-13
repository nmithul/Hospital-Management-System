// backend/scripts/check_db.js
// Check whether the hospital_management database and its tables exist and print counts.
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function check() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

  try {
    const conn = await mysql.createConnection({ host, user, password, port, multipleStatements: false });
    // Check database existence
    const [dbRows] = await conn.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'hospital_management'");
    if (!dbRows || dbRows.length === 0) {
      console.log('DATABASE_NOT_FOUND');
      await conn.end();
      process.exit(0);
    }

    console.log('DATABASE_EXISTS');
    // Now get counts from key tables
    const tables = ['doctors','patients','appointments','rooms','bills','staff'];
    for (const t of tables) {
      try {
        const [rows] = await conn.query(`SELECT COUNT(*) as cnt FROM hospital_management.${t}`);
        console.log(`${t}: ${rows[0].cnt}`);
      } catch (err) {
        console.log(`${t}: ERROR (${err.code || err.message})`);
      }
    }
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('CONNECTION_ERROR');
    console.error(err.message || err);
    process.exit(2);
  }
}

check();
