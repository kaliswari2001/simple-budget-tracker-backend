const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budget.controller");

// Add Budget
router.post("/add", authMiddleware, addBudget);

// Get All Budgets
router.get("/", authMiddleware, getBudgets);

// Update Budget
router.put("/:id", authMiddleware, updateBudget);

// Delete Budget
router.delete("/:id", authMiddleware, deleteBudget);

module.exports = router;