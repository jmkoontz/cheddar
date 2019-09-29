import mongoose from 'mongoose';

import {userModel} from '../utilities/mongooseModels';
import {addTransaction, getTransactions} from './transactionDAO';

export function getAllBudgets(uid) {
  const returnClause = {
    '_id': 0, // exclude _id
    'budgets': 1
  };

  return userModel.findOne({_id: uid}, returnClause)
    .then((user) => {
      if (user)
        return Promise.resolve(user.budgets);
      else
        return Promise.reject('UserError: User not found');
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function getBudgetNames(uid) {
  const returnClause = {
    '_id': 0, // exclude _id
    'budgets.name': 1
  };

  return userModel.findOne({_id: uid}, returnClause)
    .then((user) => {
      if (user && user.budgets) {
        let namesList = [];
        for (let i in user.budgets)
          namesList.push(user.budgets[i].name);

        return Promise.resolve(namesList);
      } else {
        return Promise.reject('UserError: User not found');
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function getBudgetCategoryNames(uid, budgetName) {
  const returnClause = {
    '_id': 0, // exclude _id
    'budgets': {'$elemMatch': {'name': budgetName}},
    'budgets.budgetCategories.name': 1
  };

  return userModel.findOne({_id: uid}, returnClause)
    .then((user) => {
      if (user && user.budgets && user.budgets[0].budgetCategories) {
        let namesList = [];
        for (let i in user.budgets[0].budgetCategories)
          namesList.push(user.budgets[0].budgetCategories[i].name);

        return Promise.resolve(namesList);
      } else {
        return Promise.reject('UserError: User not found');
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function createBudget(uid, budget) {
  for (let i in budget) {
    if (budget.hasOwnProperty(i)) {
      if (budget[i] === undefined)
        return Promise.reject('UserError: One or more fields are missing');
      else if (budget[i] === '')
        return Promise.reject('UserError: Each field must have information');
    }
  }

  // get names of budgets
  let budgetNames = [];
  try {
    budgetNames = await getBudgetNames(uid);
  } catch (error) {
    return Promise.reject(error);
  }

  // protect against duplicate budget names
  if (budgetNames.includes(budget.name))
    return Promise.reject('UserError: Budget with name \"' + budget.name + '\" already exists');

  return userModel.findOneAndUpdate(
    {_id: uid},
    {'$addToSet': {'budgets': budget}},
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function deleteBudget(uid, budgetName) {
  return userModel.findOneAndUpdate(
    {'_id': uid},
    {'$pull': {'budgets': {'name': budgetName}}},
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function addBudgetCategory(uid, budgetName, category) {
  for (let i in category) {
    if (category.hasOwnProperty(i)) {
      if (category[i] === undefined)
        return Promise.reject('UserError: One or more fields are missing');
      else if (category[i] === '')
        return Promise.reject('UserError: Each field must have information');
    }
  }

  // get names of budget categories
  let categoryNames = [];
  try {
    categoryNames = await getBudgetCategoryNames(uid, budgetName);
  } catch (error) {
    return Promise.reject(error);
  }

  // protect against duplicate category names
  if (categoryNames.includes(category.name))
    return Promise.reject('UserError: Budget category with name \"' + category.name + '\" already exists');

  const findClause = {
    '_id': uid,
    'budgets.name': budgetName
  };

  return userModel.findOneAndUpdate(
    findClause,
    {'$addToSet': {'budgets.$.budgetCategories': category}},
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function deleteBudgetCategory(uid, budgetName, categoryName) {
  const findClause = {
    '_id': uid,
    'budgets.name': budgetName
  };

  return userModel.findOneAndUpdate(
    findClause,
    {'$pull': {'budgets.$.budgetCategories': {'name': categoryName}}},
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function addTransactionToBudget(uid, budgetName, categoryName, transaction) {
  for (let i in transaction) {
    if (transaction.hasOwnProperty(i)) {
      if (transaction[i] === undefined)
        return Promise.reject('UserError: One or more fields are missing');
      else if (transaction[i] === '')
        return Promise.reject('UserError: Each field must have information');
    }
  }

  transaction._id = new mongoose.Types.ObjectId();

  const options = {
    'arrayFilters': [{'budget.name': budgetName}, {'category.name': categoryName}],
    'new': true
  };

  return userModel.findOneAndUpdate(
    {'_id': uid},
    {'$push': {'budgets.$[budget].budgetCategories.$[category].transactions': transaction._id}},
    options)
    .then(async (updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User not found');

      try {
        await addTransaction(uid, transaction);
      } catch (error) {
        return Promise.reject(error);
      }

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function removeTransactionFromBudget(uid, budgetName, categoryName, transactionId) {
  const options = {
    'arrayFilters': [{'budget.name': budgetName}, {'category.name': categoryName}],
    'new': true
  };

  return userModel.findOneAndUpdate(
    {'_id': uid},
    {'$pull': {'budgets.$[budget].budgetCategories.$[category].transactions': transactionId}},
    options)
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function getTransactionsInBudgetCategory(uid, budgetName, categoryName) {
  const returnClause = {
    '_id': 0, // exclude _id
    'budgets': {'$elemMatch': {'name': budgetName, 'budgetCategories.name': categoryName}},
    'budgets.budgetCategories': 1
  };

  return userModel.findOne(
    {'_id': uid},
    returnClause)
    .then(async (user) => {
      if (user && user.budgets && user.budgets[0].budgetCategories) {
        let transactions = [];
        let transactionIdList = [];
        for (let i in user.budgets[0].budgetCategories) {
          if (user.budgets[0].budgetCategories[i].name === categoryName) {
            for (let j in user.budgets[0].budgetCategories[i].transactions)
              transactionIdList.push(user.budgets[0].budgetCategories[i].transactions[j]._id);

            try {
              transactions = await getTransactions(uid, transactionIdList);
            } catch (error) {
              return Promise.reject(error);
            }
          }
        }

        return Promise.resolve(transactions);
      } else {
        return Promise.reject('UserError: User not found');
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function getTransactionsInDateRangeAndBudgetCategory(uid, budgetName, categoryName, dateRange) {
  if (!dateRange.startYear || !dateRange.startMonth || !dateRange.startDay)
    return Promise.reject('UserError: No start date specified');

  let transactions = [];
  try {
    transactions = await getTransactionsInBudgetCategory(uid, budgetName, categoryName);
  } catch (error) {
    return Promise.reject(error);
  }

  let currentDate = new Date();
  if (!dateRange.endYear)
    dateRange.endYear = currentDate.getFullYear();
  if (!dateRange.endMonth)
    dateRange.endMonth = currentDate.getMonth();
  if (!dateRange.endDay)
    dateRange.endDay = currentDate.getDate() + 1;

  let startDate = new Date(dateRange.startYear, dateRange.startMonth, dateRange.startDay);
  let endDate = new Date(dateRange.endYear, dateRange.endMonth, dateRange.endDay);

  transactions = transactions.filter((t) => t.date >= startDate && t.date < endDate);

  return Promise.resolve(transactions);
}
