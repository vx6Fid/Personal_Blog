const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on("connect", () => {
  console.log("🟢 Connected to PostgreSQL");
});

// Ping the database to check if it's alive
const pingDatabase = async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    console.log("🟢 Database is alive");
  } catch (error) {
    console.error("🔴 Database is not responding", error);
  }
};
pingDatabase();

module.exports = pool;
