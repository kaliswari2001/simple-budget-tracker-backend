const Transaction = require("../models/transaction.model");
const mongoose = require("mongoose");

// Add Transaction
const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date,
      userId: req.user.userId,
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Transactions fetched successfully",
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Transaction
const updateTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      { title, amount, type, category, date },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Monthly Income and Expense Summary
const getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const currentDate = new Date();
    const selectedMonth = month ? Number(month) - 1 : currentDate.getMonth();
    const selectedYear = year ? Number(year) : currentDate.getFullYear();

    if (
      !Number.isInteger(selectedMonth) ||
      selectedMonth < 0 ||
      selectedMonth > 11 ||
      !Number.isInteger(selectedYear) ||
      selectedYear < 2000
    ) {
      return res.status(400).json({
        message: "Invalid month or year",
      });
    }

    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 1);

    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let income = 0;
    let expense = 0;

    summary.forEach((item) => {
      if (item._id === "income") income = item.total;
      if (item._id === "expense") expense = item.total;
    });

    res.status(200).json({
      month: selectedMonth + 1,
      year: selectedYear,
      income,
      expense,
      balance: income - expense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Transactions
const searchTransactions = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        message: "Search keyword is required",
      });
    }

    const transactions = await Transaction.find({
      userId: req.user.userId,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Search results fetched successfully",
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Category-wise Expense Summary
const getCategorySummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.status(200).json({
      message: "Category summary fetched successfully",
      summary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pagination
const getPaginatedTransactions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        message: "Invalid page or limit",
      });
    }

    const skip = (page - 1) * limit;

    const filter = { userId: req.user.userId };

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions =
      await Transaction.countDocuments(filter);

    res.status(200).json({
      message: "Transactions fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export All Functions
module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
  searchTransactions,
  getCategorySummary,
  getPaginatedTransactions,
};