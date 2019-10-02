import mongoose from 'mongoose';

import {userSchema, budgetSchema, budgetCategorySchema, transactionSchema, investmentSchema, allInvestmentsSchema} from './mongooseSchemas';

export const userModel = mongoose.model('User', userSchema);
export const budgetModel = mongoose.model('Budget', budgetSchema);
export const budgetCategoryModel = mongoose.model('BudgetCategory', budgetCategorySchema);
export const transactionModel = mongoose.model('Transaction', transactionSchema);
export const investmentModel = mongoose.model('Invesment', investmentSchema);
export const allInvestmentsModel = mongoose.model('AllInvestments', allInvestmentsSchema);