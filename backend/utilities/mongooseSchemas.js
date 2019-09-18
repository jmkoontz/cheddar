import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  _id: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
  type: String,
  netWorth: Number,
  budgets: [budgetSchema],
  transactions: [transactionSchema]
});

export const budgetSchema = new mongoose.Schema({
  budgetId: String,
  name: String,
  type: String,
  income: Number,
  timeFrame: Number,
  budgetCategories: [budgetCategorySchema]
});

export const budgetCategorySchema = new mongoose.Schema({
  BudgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  },
  name: String,
  amount: Number,
  transactions: [transactionSchema]
});

export const transactionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  date: Number
})
