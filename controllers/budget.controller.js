const Budget = require("../models/budget.model");

// ADD BUDGET
const addBudget = async (req, res) => {
  try {
    const { category, budget } = req.body;

    if (!category || !budget || Number(budget) <= 0) {
      return res.status(400).json({
        message: "Please provide a valid category and budget amount",
      });
    }

    const existingBudget = await Budget.findOne({
      category,
      userId: req.user.userId,
    });

    if (existingBudget) {
      return res.status(400).json({
        message: "Budget already exists for this category",
      });
    }

    const newBudget = await Budget.create({
      category,
      budget: Number(budget),
      userId: req.user.userId,
    });

    res.status(201).json({
      message: "Budget added successfully",
      budget: newBudget,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding budget",
      error: error.message,
    });
  }
};

// GET ALL BUDGETS
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Budgets fetched successfully",
      budgets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching budgets",
      error: error.message,
    });
  }
};

// UPDATE BUDGET
const updateBudget = async (req, res) => {
  try {
    const { category, budget } = req.body;

    if (!category || !budget || Number(budget) <= 0) {
      return res.status(400).json({
        message: "Please provide a valid category and budget amount",
      });
    }

    const existingBudget = await Budget.findOne({
      category,
      userId: req.user.userId,
      _id: { $ne: req.params.id },
    });

    if (existingBudget) {
      return res.status(400).json({
        message: "Budget already exists for this category",
      });
    }

    const updatedBudget = await Budget.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      {
        category,
        budget: Number(budget),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBudget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    res.status(200).json({
      message: "Budget updated successfully",
      budget: updatedBudget,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating budget",
      error: error.message,
    });
  }
};

// DELETE BUDGET
const deleteBudget = async (req, res) => {
  try {
    const deletedBudget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deletedBudget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting budget",
      error: error.message,
    });
  }
};

module.exports = {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};