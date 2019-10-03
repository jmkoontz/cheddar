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

export const eventsSchema = new mongoose.Schema({
  id: Number,
  title: String,
  start: Date,
  end: Date,
  allDay: Boolean,
  amount: Number
});

export const savingsSchema = new mongoose.Schema({
  title: String,
  category: String,
  goalAmount: Number,
  goalYear: Number,
  goalMonth: String,
  monthlyContribution: Number
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
  events: [eventsSchema],
  savings: [savingsSchema]
});
