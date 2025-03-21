const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Apply for a loan (Borrower)
router.post('/apply', 
  authenticateToken, 
  authorizeRole(['Borrower']), 
  loanController.applyLoan
);

// Get all loans (Admin, Loan Officer)
router.get('/', 
  authenticateToken, 
  authorizeRole(['Admin', 'LoanOfficer']), 
  loanController.getAllLoans
);

// Get current user's loans (Any authenticated user)
router.get('/my-loans', 
  authenticateToken, 
  loanController.getUserLoans
);

// Get loan by ID (Admin, Loan Officer, Loan Owner)
router.get('/:id', 
  authenticateToken, 
  loanController.getLoanById
);

// Approve loan (Loan Officer)
router.put('/:id/approve', 
  authenticateToken, 
  authorizeRole(['LoanOfficer']), 
  loanController.approveLoan
);

// Reject loan (Loan Officer)
router.put('/:id/reject', 
  authenticateToken, 
  authorizeRole(['LoanOfficer']), 
  loanController.rejectLoan
);

module.exports = router;