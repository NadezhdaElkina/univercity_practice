const mysql = require("mysql2");
require("dotenv").config();


const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "surveyapp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise(); 

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL Database!");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

module.exports = { pool, connectDB };
