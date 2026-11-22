const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Shopping",
        "Transport",
        "Bills",
        "Entertainment",
        "Health",
        "Education",
        "Other",
      ],
    },

    budget: {
      type: Number,
      required: true,
      min: 1,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

budgetSchema.index(
  { userId: 1, category: 1 },
  { unique: true }
);

module.exports = mongoose.model("Budget", budgetSchema);