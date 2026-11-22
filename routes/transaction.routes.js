const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
  searchTransactions,
  getCategorySummary,
  getPaginatedTransactions,
} = require("../controllers/transaction.controller");

// Add Transaction
router.post("/add", authMiddleware, addTransaction);

// Get All Transactions
router.get("/", authMiddleware, getTransactions);

// Search
router.get("/search", authMiddleware, searchTransactions);

// Monthly Summary
router.get("/summary", authMiddleware, getSummary);

// Category Summary
router.get("/category-summary", authMiddleware, getCategorySummary);

// Pagination
router.get("/pagination", authMiddleware, getPaginatedTransactions);

// Update
router.put("/:id", authMiddleware, updateTransaction);

// Delete
router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;