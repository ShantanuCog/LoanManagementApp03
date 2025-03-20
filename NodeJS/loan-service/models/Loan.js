const { v4: uuidv4 } = require('uuid');
const { pool, sql } = require('../config/db');

class Loan {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.user_id = data.user_id;
    this.amount = data.amount;
    this.status = data.status || 'Pending';
    this.created_at = data.created_at || new Date();
  }
  
  // Create a new loan application
  static async create(loanData) {
    try {
      await pool.connect();
      
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, uuidv4())
        .input('user_id', sql.UniqueIdentifier, loanData.user_id)
        .input('amount', sql.Decimal(10, 2), loanData.amount)
        .input('status', sql.VarChar(20), 'Pending')
        .query(`
          INSERT INTO Loans (id, user_id, amount, status)
          VALUES (@id, @user_id, @amount, @status);
          
          SELECT * FROM Loans WHERE id = @id;
        `);
      
      return new Loan(result.recordset[0]);
    } catch (error) {
      console.error('Error creating loan:', error);
      throw error;
    }
  }
  
  // Get loan by ID
  static async getById(id) {
    try {
      await pool.connect();
      
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .query(`
          SELECT l.*, u.Name as borrower_name, u.Email as borrower_email
          FROM Loans l
          JOIN Users u ON l.user_id = u.Id
          WHERE l.id = @id
        `);
      
      if (result.recordset.length === 0) {
        return null;
      }
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error fetching loan:', error);
      throw error;
    }
  }
  
  // Get all loans
  static async getAll() {
    try {
      await pool.connect();
      
      const result = await pool.request()
        .query(`
          SELECT l.*, u.Name as borrower_name, u.Email as borrower_email
          FROM Loans l
          JOIN Users u ON l.user_id = u.Id
          ORDER BY l.created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error fetching all loans:', error);
      throw error;
    }
  }
  
  // Get loans by user ID
  static async getByUserId(userId) {
    try {
      await pool.connect();
      
      const result = await pool.request()
        .input('user_id', sql.UniqueIdentifier, userId)
        .query(`
          SELECT * FROM Loans
          WHERE user_id = @user_id
          ORDER BY created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error fetching user loans:', error);
      throw error;
    }
  }
  
  // Update loan status
  static async updateStatus(id, status) {
    try {
      await pool.connect();
      
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('status', sql.VarChar(20), status)
        .query(`
          UPDATE Loans
          SET status = @status
          WHERE id = @id;
          
          SELECT l.*, u.Name as borrower_name, u.Email as borrower_email
          FROM Loans l
          JOIN Users u ON l.user_id = u.Id
          WHERE l.id = @id
        `);
      
      if (result.recordset.length === 0) {
        return null;
      }
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error updating loan status:', error);
      throw error;
    }
  }
}

module.exports = Loan;
