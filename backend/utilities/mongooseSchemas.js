import mongoose from 'mongoose';

export const transactionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  date: Date
});

export const budgetCategorySchema = new mongoose.Schema({
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  },
  name: String,
  amount: Number,
  transactions: [mongoose.Schema.Types.ObjectId]
});

export const budgetSchema = new mongoose.Schema({
  name: String,
  type: String,
  income: Number,
  timeFrame: Number,
  favorite: Boolean,
  budgetCategories: [budgetCategorySchema]
});

export const investmentSchema = new mongoose.Schema({
    type: String,
    startingInvestment: Number,
    company: String,
    startDate: String,
});

export const allInvestmentsSchema = new mongoose.Schema({
    trackedCompanies: [String],
    investments: [investmentSchema]
});

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
  transactions: [transactionSchema],
  investments: allInvestmentsSchema
});

