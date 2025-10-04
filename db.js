const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",          // change if needed
  host: "localhost",
  database: "flight",        // your database
  password: "root",  // your postgres password
  port: 5432,
});

module.exports = pool;
