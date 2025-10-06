// db.js
require('dotenv').config(); // Loads environment variables from a .env file
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Verification log
console.log('Database pool created. Attempting test connection...');

// Optional: Test the connection
pool
  .query('SELECT NOW()')
  .then(res => {
    console.log('Database connected successfully at:', res.rows[0].now);
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

module.exports = pool;
