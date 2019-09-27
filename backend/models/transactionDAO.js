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
