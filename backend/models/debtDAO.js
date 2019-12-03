import mongoose from 'mongoose';

import {userModel} from '../utilities/mongooseModels';

export function getAllDebts(uid) {
  const returnClause = {
    '_id': 0, // exclude _id
    'debts': 1
  };

  return userModel.findOne({_id: uid}, returnClause)
    .then((user) => {
      if (user)
        return Promise.resolve(user.debts);
      else
        return Promise.reject('UserError: User not found');
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function createDebt(uid, debt) {
  for (let i in debt) {
    if (debt.hasOwnProperty(i)) {
      if (debt[i] === undefined)
        return Promise.reject('UserError: Missing field(s): ' + i);
      else if (debt[i] === '' & i != "nickname")
        return Promise.reject('UserError: Missing field(s): ' + i);
    }
  }

  return userModel.findOneAndUpdate(
    {_id: uid},
    {'$addToSet': {'debts': debt}},
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

export async function editDebt(uid, debtID, changes) {
  let updateClause = {$set: {}};

  const findClause = {
    '_id': uid,
    'debts._id': debtID
  };

  if(changes.category)
    updateClause.$set['debts.$.category'] = changes.category;

  if (changes.nickname)
    updateClause.$set['debts.$.nickname'] = changes.nickname;

  if (changes.initial)
    updateClause.$set['debts.$.initial'] = changes.initial;

  if (changes.currBalance)
    updateClause.$set['debts.$.currBalance'] = changes.currBalance;

  if (changes.interestRate)
    updateClause.$set['debts.$.interestRate'] = changes.interestRate;

  if (changes.minimumPayment)
    updateClause.$set['debts.$.minimumPayment'] = changes.minimumPayment;

  return userModel.findOneAndUpdate(
    findClause,
    updateClause,
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or debt not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function deleteDebt(uid, debtID) {
  return userModel.findOneAndUpdate(
    {'_id': uid},
    {'$pull': {'debts': {'_id': debtID}}},
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or debt not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function favDebt(uid, debtId){
  var debts;
  try{
    debts = await getAllDebts(uid);
  } catch (err){
    return Promise.reject(err);
  }

  for(let i in debts){
    if(debts[i]._id === debtsId){
      debts[i].favorite = true;
    }
    else if(debts[i].favorite === true){
      debts[x].favorite = false;
    }
  }

  return userModel.findOneAndUpdate(
    {'_id': uid},
    {'$set': {'debts': debts}},
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or debt not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function unfavDebt(uid, debtId){
  return userModel.findOneAndUpdate(
    {'_id': uid, 'debts._id': debtsId},
    {'$set': {'debts.$.favorite': false}},
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or debt not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}
