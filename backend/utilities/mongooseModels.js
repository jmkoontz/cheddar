import mongoose from 'mongoose';

import {userSchema, budgetSchema, budgetCategorySchema, transactionSchema, savingsSchema, debtSchema, investmentSchema, allInvestmentsSchema, retirementHistorySchema, retirementSchema} from './mongooseSchemas';

export const userModel = mongoose.model('User', userSchema);
export const budgetModel = mongoose.model('Budget', budgetSchema);
export const budgetCategoryModel = mongoose.model('BudgetCategory', budgetCategorySchema);
export const transactionModel = mongoose.model('Transaction', transactionSchema);
export const savingsModel = mongoose.model('Savings', savingsSchema);
export const debtModel = mongoose.model('Debts', debtSchema);
export const investmentModel = mongoose.model('Invesment', investmentSchema);
export const allInvestmentsModel = mongoose.model('AllInvestments', allInvestmentsSchema);
export const retirementHistoryModel = mongoose.model('RetirementHistory', retirementHistorySchema);
export const retirementModel = mongoose.model('Retirement', retirementSchema);
