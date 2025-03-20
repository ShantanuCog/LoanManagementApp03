const Loan = require('../models/Loan');

// Apply for a new loan
const applyLoan = async (req, res) => {
  try {
    // Get user ID from JWT token
    const userId = req.user.sub;
    
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid loan amount'
      });
    }
    
    const loanData = {
      user_id: userId,
      amount: amount
    };
    
    const loan = await Loan.create(loanData);
    
    return res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: loan
    });
  } catch (error) {
    console.error('Error in loan application:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your loan application'
    });
  }
};

// Get loan by ID
const getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const loan = await Loan.getById(id);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    
    // Check if user is authorized to view this loan
    // Only the borrower, admin, or loan officer can view a loan
    const userId = req.user.sub;
    const userRole = req.user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    
    if (loan.user_id !== userId && userRole !== 'Admin' && userRole !== 'LoanOfficer') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this loan'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Loan retrieved successfully',
      data: loan
    });
  } catch (error) {
    console.error('Error retrieving loan:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the loan'
    });
  }
};

// Get all loans (for Admin and Loan Officer)
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.getAll();
    
    return res.status(200).json({
      success: true,
      message: 'Loans retrieved successfully',
      data: loans
    });
  } catch (error) {
    console.error('Error retrieving loans:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving loans'
    });
  }
};

// Get loans by user ID (for current user)
const getUserLoans = async (req, res) => {
  try {
    const userId = req.user.sub;
    
    const loans = await Loan.getByUserId(userId);
    
    return res.status(200).json({
      success: true,
      message: 'User loans retrieved successfully',
      data: loans
    });
  } catch (error) {
    console.error('Error retrieving user loans:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving user loans'
    });
  }
};

// Approve loan (Loan Officer only)
const approveLoan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const loan = await Loan.getById(id);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    
    if (loan.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve loan that is in ${loan.status} status`
      });
    }
    
    const updatedLoan = await Loan.updateStatus(id, 'Approved');
    
    return res.status(200).json({
      success: true,
      message: 'Loan approved successfully',
      data: updatedLoan
    });
  } catch (error) {
    console.error('Error approving loan:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while approving the loan'
    });
  }
};

// Reject loan (Loan Officer only)
const rejectLoan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const loan = await Loan.getById(id);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    
    if (loan.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject loan that is in ${loan.status} status`
      });
    }
    
    const updatedLoan = await Loan.updateStatus(id, 'Rejected');
    
    return res.status(200).json({
      success: true,
      message: 'Loan rejected successfully',
      data: updatedLoan
    });
  } catch (error) {
    console.error('Error rejecting loan:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while rejecting the loan'
    });
  }
};

module.exports = {
  applyLoan,
  getLoanById,
  getAllLoans,
  getUserLoans,
  approveLoan,
  rejectLoan
};
