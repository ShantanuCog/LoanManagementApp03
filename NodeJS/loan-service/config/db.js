const sql = require('mssql');
require('dotenv').config();

// SQL Server connection configuration
const dbConfig = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Create a new connection pool
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

// Handle connection errors
poolConnect.catch(err => {
  console.error('Database connection failed!', err);
});

// Create Loans table if it doesn't exist
async function initDb() {
  try {
    await poolConnect;
    
    // Check if Loans table exists and create it if not
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Loans')
      BEGIN
        CREATE TABLE Loans (
          id UNIQUEIDENTIFIER PRIMARY KEY,
          user_id UNIQUEIDENTIFIER NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          status VARCHAR(20) NOT NULL,
          created_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (user_id) REFERENCES Users(Id)
        )
      END
    `);
    
    console.log('Database initialization completed');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

module.exports = {
  pool,
  sql,
  initDb
};