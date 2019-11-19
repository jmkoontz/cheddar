import mongoose from 'mongoose';

import { userModel } from '../utilities/mongooseModels';
import { addTransaction, getTransactions } from './transactionDAO';

export async function getAllBudgets(uid, external) {
  const returnClause = {
    '_id': 1, // include _id
    'budgets': 1
  };

  // skip if called from transferOldTransactions
  if (external)
    await transferOldTransactions(uid);

  return userModel.findOne({ _id: uid }, returnClause)
    .then((user) => {
      if (user && user.budgets)
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
    '_id': 1, // exclude _id
    'budgets.name': 1
  };

  return userModel.findOne({ _id: uid }, returnClause)
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

export function getBudget(uid, budgetName) {
  const findClause = {
    '_id': uid,
    'budgets.name': budgetName
  };

  const returnClause = {
    '_id': 0, // exclude _id
    'budgets': 1
  };

  return userModel.findOne(findClause, returnClause)
    .then((user) => {
      if (user && user.budgets) {
        return Promise.resolve(user.budgets[0]);
      } else {
        return Promise.reject('UserError: User or budget not found');
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function getBudgetCategoryNames(uid, budgetName) {
  const returnClause = {
    '_id': 0, // exclude _id
    'budgets': { '$elemMatch': { 'name': budgetName } },
    'budgets.budgetCategories.name': 1
  };

  return userModel.findOne({ _id: uid }, returnClause)
    .then((user) => {
      if (user && user.budgets && user.budgets[0].budgetCategories) {
        let namesList = [];
        for (let i in user.budgets[0].budgetCategories)
          namesList.push(user.budgets[0].budgetCategories[i].name);

        return Promise.resolve(namesList);
      } else {
        return Promise.reject('UserError: User or budget not found');
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

  // protect against duplicate category names
  for (let i in budget.budgetCategories) {
    for (let j in budget.budgetCategories) {
      if (i !== j) {
        if (budget.budgetCategories[i].name.toLowerCase() === budget.budgetCategories[j].name.toLowerCase())
          return Promise.reject('UserError: Budget cannot have multiple categories of the same name');
      }
    }
  }

  // set update date for budget
  let currentDate = new Date(Date.now());
  currentDate = new Date(currentDate.getFullYear(), currentDate.getUTCMonth(), currentDate.getDate());
  if (budget.timeFrame === 'monthly') {
    if (currentDate.getUTCMonth() === 11)
      budget.nextUpdate = new Date(currentDate.getFullYear() + 1, 0, 1);
    else
      budget.nextUpdate = new Date(currentDate.getFullYear(), currentDate.getUTCMonth() + 1, 1);
  } else if (budget.timeFrame === 'biweekly') {
    const twoWeeksOffset = 1000 * 60 * 60 * 24 * 14;
    budget.nextUpdate = new Date(Date.parse(currentDate) + twoWeeksOffset);
  } else if (budget.timeFrame === 'weekly') {
    const oneWeekOffset = 1000 * 60 * 60 * 24 * 7;
    budget.nextUpdate = new Date(Date.parse(currentDate) + oneWeekOffset);
  }

  return userModel.findOneAndUpdate(
    { _id: uid },
    { '$addToSet': { 'budgets': budget } },
    { 'new': true })
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function editBudget(uid, budgetName, changes) {
  let updateClause = { $set: {} };

  if (changes.name !== "") {
    // get names of budgets
    let budgetNames = [];
    try {
      budgetNames = await getBudgetNames(uid);
    } catch (error) {
      return Promise.reject(error);
    }

    // protect against duplicate budget names
    if (changes.name !== budgetName && budgetNames.includes(changes.name))
      return Promise.reject('UserError: Budget with name \"' + changes.name + '\" already exists');

    updateClause.$set['budgets.$.name'] = changes.name;
  }

  const findClause = {
    '_id': uid,
    'budgets.name': budgetName
  };

  if (changes.income)
    updateClause.$set['budgets.$.income'] = changes.income;

  if (changes.budgetCategories) {
    // protect against duplicate category names
    for (let i in changes.budgetCategories) {
      for (let j in changes.budgetCategories) {
        if (i !== j) {
          if (changes.budgetCategories[i].name.toLowerCase() === changes.budgetCategories[j].name.toLowerCase())
            return Promise.reject('UserError: Budget cannot have multiple categories of the same name');
        }
      }
    }

    updateClause.$set['budgets.$.budgetCategories'] = changes.budgetCategories;
  }

  return userModel.findOneAndUpdate(
    findClause,
    updateClause,
    { 'new': true })
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or budget not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function favoriteBudget(uid, budgetName) {

  let budgets;
  try {
    budgets = await getAllBudgets(uid);
  } catch (err) {
    return Promise.reject(err);
  }

  for (let x = 0; x < budgets.length; x++) {
    if (budgets[x].favorite === true) {
      budgets[x].favorite = false;
    }

    if (budgets[x].name === budgetName) {
      budgets[x].favorite = true;
    }
  }

  const findClause = {
    '_id': uid
  };

  return userModel.findOneAndUpdate(
    findClause,
    { '$set': { 'budgets': budgets } },
    { 'new': true })
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or budget not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function unfavoriteBudget(uid, budgetName) {

  const findClause = {
    '_id': uid,
    'budgets.name': budgetName
  };

  return userModel.findOneAndUpdate(
    findClause,
    { '$set': { 'budgets.$.favorite': false } },
    { 'new': true })
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or budget not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function deleteBudget(uid, budgetName) {
  return userModel.findOneAndUpdate(
    { '_id': uid },
    { '$pull': { 'budgets': { 'name': budgetName } } },
    { 'new': true })
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or budget not found');

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
    { '$addToSet': { 'budgets.$.budgetCategories': category } },
    { 'new': true })
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function editBudgetCategory(uid, budgetName, categoryName, changes) {
  let updateClause = { $set: {} };

  if (changes.name) {
    // get names of budget categories
    let categoryNames = [];
    try {
      categoryNames = await getBudgetCategoryNames(uid, budgetName);
    } catch (error) {
      return Promise.reject(error);
    }

    // protect against duplicate budget category names
    if (categoryNames.includes(changes.name))
      return Promise.reject('UserError: Category with name \"' + changes.name + '\" already exists');

    updateClause.$set['budgets.$[budget].budgetCategories.$[category].name'] = changes.name;
  }

  if (changes.amount)
    updateClause.$set['budgets.$[budget].budgetCategories.$[category].amount'] = changes.amount;

  const options = {
    'arrayFilters': [{ 'budget.name': budgetName }, { 'category.name': categoryName }],
    'new': true
  };

  return userModel.findOneAndUpdate(
    { '_id': uid },
    updateClause,
    options)
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or budget not found');

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
    { '$pull': { 'budgets.$.budgetCategories': { 'name': categoryName } } },
    { 'new': true })
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or budget not found');

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
    'arrayFilters': [{ 'budget.name': budgetName }, { 'category.name': categoryName }],
    'new': true
  };

  return userModel.findOneAndUpdate(
    { '_id': uid },
    { '$push': { 'budgets.$[budget].budgetCategories.$[category].transactions': transaction._id } },
    options)
    .then(async (updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or budget not found');

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
    'arrayFilters': [{ 'budget.name': budgetName }, { 'category.name': categoryName }],
    'new': true
  };

  return userModel.findOneAndUpdate(
    { '_id': uid },
    { '$pull': { 'budgets.$[budget].budgetCategories.$[category].transactions': mongoose.Types.ObjectId(transactionId) } },
    options)
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or budget not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function getTransactionsInBudgetCategory(uid, budgetName, categoryName) {
  const returnClause = {
    '_id': 0, // exclude _id
    'budgets': { '$elemMatch': { 'name': budgetName, 'budgetCategories.name': categoryName } },
    'budgets.budgetCategories': 1
  };

  return userModel.findOne(
    { '_id': uid },
    returnClause)
    .then(async (user) => {
      if (user && user.budgets && user.budgets[0].budgetCategories) {
        let transactions = [];
        let transactionIdList = [];
        for (let i in user.budgets[0].budgetCategories) {
          if (user.budgets[0].budgetCategories[i].name === categoryName) {
            for (let j in user.budgets[0].budgetCategories[i].transactions)
              transactionIdList.push(user.budgets[0].budgetCategories[i].transactions[j]);

            try {
              transactions = await getTransactions(uid, transactionIdList);
            } catch (error) {
              return Promise.reject(error);
            }
          }
        }

        return Promise.resolve(transactions);
      } else {
        return Promise.reject('UserError: User or budget not found');
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function getTransactionsInBudgetCategoryAndDateRange(uid, budgetName, categoryName, dateRange) {
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

  transactions = transactions.filter((t) => t.date >= startDate && t.date <= endDate);

  return Promise.resolve(transactions);
}

export function getTransactionsInBudget(uid, budgetName) {
  const returnClause = {
    '_id': 0, // exclude _id
    'budgets': { '$elemMatch': { 'name': budgetName } },
    'budgets.budgetCategories': 1
  };

  return userModel.findOne(
    { '_id': uid },
    returnClause)
    .then(async (user) => {
      if (user && user.budgets && user.budgets[0].budgetCategories) {
        let transactions = [];
        let transactionIdList = [];
        let transactionCategoryList = [];
        for (let i in user.budgets[0].budgetCategories) {
          for (let j in user.budgets[0].budgetCategories[i].transactions) {
            transactionIdList.push(user.budgets[0].budgetCategories[i].transactions[j]);
            transactionCategoryList.push({
              'id': user.budgets[0].budgetCategories[i].transactions[j],
              'category': user.budgets[0].budgetCategories[i].name
            });
          }
        }

        try {
          transactions = await getTransactions(uid, transactionIdList);
        } catch (error) {
          return Promise.reject(error);
        }

        for (let i in transactionCategoryList) {
          for (let j in transactions) {
            if (transactionCategoryList[i].id.toString() === transactions[j]._id.toString()) {
              transactions[j] = transactions[j].toObject(); // Mongoose objects are not mutable
              transactions[j].category = transactionCategoryList[i].category;
              break;
            }
          }
        }

        return Promise.resolve(transactions);
      } else {
        return Promise.reject('UserError: User or budget not found');
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function getTransactionsInBudgetAndDateRange(uid, budgetName, dateRange) {
  if (!dateRange.startYear || !dateRange.startMonth || !dateRange.startDay)
    return Promise.reject('UserError: No start date specified');

  let transactions = [];
  let budget = {};
  try {
    budget = await getBudget(uid, budgetName);
    transactions = await getTransactionsInBudget(uid, budgetName);
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

  // Determine max index based on user's start date
  let maxIndex = 0;
  for (let i in budget.budgetCategories) {
    if (budget.budgetCategories[i].oldTransactions) {
      for (let j in budget.budgetCategories[i].oldTransactions) {
        if (new Date(budget.budgetCategories[i].oldTransactions[j].startDate) < startDate) {
          maxIndex = j;
          break;
        }
      }
    }
  }

  // Loop through and call getOldTransactions for each index based on startDate

  for (let i = 0; i <= maxIndex; i++) {
    let tmp = [];
    try {
      tmp = await getOldTransactions(uid, budgetName, i);
      console.log(tmp);
    } catch (error) {
        return Promise.reject(error);
    }

    // append new transactions to the list
    for (let i in tmp) {
      transactions.push(tmp[i])
    }
    //transactions = [...transactions, tmp];
  }

  console.log(transactions);

  transactions = transactions.filter((t) => t.date >= startDate && t.date <= endDate);
  //console.log(transactions);
  return Promise.resolve(transactions);
}

export async function getOldTransactions(uid, budgetName, index) {
  let budget;
  try {
    budget = await getBudget(uid, budgetName);
  } catch (error) {
    return Promise.reject(error);
  }

  let transactions = [];
  let transactionIdList = [];
  let transactionCategoryList = [];
  for (let i in budget.budgetCategories) {
    if (budget.budgetCategories[i].oldTransactions && budget.budgetCategories[i].oldTransactions[index]) {
      for (let j in budget.budgetCategories[i].oldTransactions[index].transactions) {
        transactionIdList.push(budget.budgetCategories[i].oldTransactions[index].transactions[j]);
        transactionCategoryList.push({
          'id': budget.budgetCategories[i].oldTransactions[index].transactions[j],
          'category': budget.budgetCategories[i].name
        });
      }
    }
  }

  try {
    transactions = await getTransactions(uid, transactionIdList);
  } catch (error) {
    return Promise.reject(error);
  }

  for (let i in transactionCategoryList) {
    for (let j in transactions) {
      if (transactionCategoryList[i].id.toString() === transactions[j]._id.toString()) {
        transactions[j] = transactions[j].toObject(); // Mongoose objects are not mutable
        transactions[j].category = transactionCategoryList[i].category;
        break;
      }
    }
  }

  return Promise.resolve(transactions);
}

export async function transferOldTransactions(uid) {
  let budgets;
  try {
    budgets = await getAllBudgets(uid, false);
  } catch (error) {
    return Promise.reject(error);
  }

  let modified = false;
  for (let i in budgets) {
    // legacy compatibility
    if (!budgets[i].nextUpdate || budgets[i].type !== 'Custom')
      continue;

    if (budgets[i].nextUpdate <= new Date(Date.now())) {
      modified = true;
      let oldEndDate = new Date(budgets[i].nextUpdate);
      let oldStartDate;
      let newDate;

      if (budgets[i].timeFrame === 'monthly') {
        if (oldEndDate.getUTCMonth() === 11)
          newDate = new Date(oldEndDate.getFullYear() + 1, 0, 1);
        else
          newDate = new Date(oldEndDate.getFullYear(), oldEndDate.getUTCMonth() + 1, 1);

        if (oldEndDate.getUTCMonth() === 0)
          oldStartDate = new Date(oldEndDate.getFullYear() - 1, 11, 1);
        else
          oldStartDate = new Date(oldEndDate.getFullYear(), oldEndDate.getUTCMonth() - 1, 1);
      } else if (budgets[i].timeFrame === 'biweekly') {
        const twoWeeksOffset = 1000 * 60 * 60 * 24 * 14;
        newDate = new Date(Date.parse(oldEndDate) + twoWeeksOffset);
        oldStartDate = new Date(Date.parse(oldEndDate) - twoWeeksOffset);
      } else if (budgets[i].timeFrame === 'weekly') {
        const oneWeekOffset = 1000 * 60 * 60 * 24 * 7;
        newDate = new Date(Date.parse(oldEndDate) + oneWeekOffset);
        oldStartDate = new Date(Date.parse(oldEndDate) - oneWeekOffset);
      }

      oldEndDate.setDate(oldEndDate.getDate() - 1);

      for (let j in budgets[i].budgetCategories) {
        let oldTransactionObj = {
          startDate: oldStartDate,
          endDate: oldEndDate,
          amount: budgets[i].budgetCategories[j].amount,
          transactions: budgets[i].budgetCategories[j].transactions
        }

        budgets[i].budgetCategories[j].oldTransactions.unshift(oldTransactionObj);
        budgets[i].budgetCategories[j].transactions = [];
      }

      budgets[i].nextUpdate = newDate;
    }

    if (modified) {
      return userModel.findOneAndUpdate(
        { '_id': uid },
        { '$set': { budgets: budgets } },
        { 'new': true })
        .then((updatedUser) => {
          if (updatedUser == null)
            return Promise.reject('UserError: User not found');

          return Promise.resolve(updatedUser);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
  }

  return Promise.resolve('No changes made');
}
