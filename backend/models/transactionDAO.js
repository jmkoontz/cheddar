import mongoose from 'mongoose';

import {userModel} from '../utilities/mongooseModels';

export function addTransaction(uid, transaction) {
  for (let i in transaction) {
    if (transaction.hasOwnProperty(i)) {
      if (transaction[i] === undefined)
        return Promise.reject('UserError: One or more fields are missing');
      else if (transaction[i] === '')
        return Promise.reject('UserError: Each field must have information');
    }
  }

  return userModel.findOneAndUpdate(
    {'_id': uid},
    {'$push': {'transactions': transaction}},
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

export function editTransaction(uid, transactionId, transaction) {
  for (let i in transaction) {
    if (transaction.hasOwnProperty(i)) {
      if (transaction[i] === undefined)
        return Promise.reject('UserError: One or more fields are missing');
      else if (transaction[i] === '')
        return Promise.reject('UserError: Each field must have information');
    }
  }

  const findClause = {
    '_id': uid,
    'transactions._id': mongoose.Types.ObjectId(transactionId)
  };

  return userModel.findOneAndUpdate(
    findClause,
    {'$set': {'transactions.$': {
      '_id': mongoose.Types.ObjectId(transactionId),
      'name': transaction.name,
      'amount': transaction.amount,
      'date': transaction.date}}},
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

// TODO remove transaction from budget categories
export function deleteTransaction(uid, transactionId) {
  return userModel.findOneAndUpdate(
    {'_id': uid},
    {'$pull': {'transactions': {'_id': mongoose.Types.ObjectId(transactionId)}}},
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

export function getAllTransactions(uid) {
  const returnClause = {
    '_id': 0, // exclude _id
    'transactions': 1
  };

  return userModel.findOne(
    {'_id': uid},
    returnClause)
    .then((user) => {
      if (user)
        return Promise.resolve(user.transactions.sort((t1, t2) => (t1.date < t2.date) ? 1 : -1));
      else
        return Promise.reject('UserError: User not found');
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function getTransactions(uid, transactionIdList) {
  let transactions = [];
  try {
    transactions = await getAllTransactions(uid);
  } catch (error) {
    return Promise.reject(error);
  }

  let matches = [];
  transactionIdList = JSON.stringify(transactionIdList);
  for (let i in transactions) {
    if (transactionIdList.includes(transactions[i]._id))
      matches.push(transactions[i])
  }

  return Promise.resolve(matches);
}

export async function getTransactionsInDateRange(uid, dateRange) {
  if (!dateRange.startYear || !dateRange.startMonth || !dateRange.startDay)
    return Promise.reject('UserError: No start date specified');

  let transactions = [];
  try {
    transactions = await getAllTransactions(uid);
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
