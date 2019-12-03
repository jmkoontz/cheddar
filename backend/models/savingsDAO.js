import mongoose from 'mongoose';

import {userModel} from '../utilities/mongooseModels';

export function getAllSavings(uid) {
  const returnClause = {
    '_id': 0, // exclude _id
    'savings': 1
  };

  return userModel.findOne({_id: uid}, returnClause)
    .then((user) => {
      if (user)
        return Promise.resolve(user.savings);
      else
        return Promise.reject('UserError: User not found');
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function getSavingsTitles(uid) {
  const returnClause = {
    '_id': 0, // exclude _id
    'savings.title': 1
  };

  return userModel.findOne({_id: uid}, returnClause)
    .then((user) => {
      if (user && user.savings) {
        let titles = [];
        for (let i in user.savings)
          titles.push(user.savings[i].title);

        return Promise.resolve(titles);
      } else {
        return Promise.reject('UserError: User not found');
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function createSavings(uid, saving) {
  for (let i in saving) {
    if (saving.hasOwnProperty(i)) {
      if (saving[i] === undefined)
        return Promise.reject('UserError: Missing field(s)');
      else if (saving[i] === '')
        return Promise.reject('UserError: Missing field(s)');
    }
  }

  return userModel.findOneAndUpdate(
    {_id: uid},
    {'$addToSet': {'savings': saving}},
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

export async function getOneSavings(uid, savingsId){
  const findClause = {
    '_id': uid,
    'savings._id': savingsId
  };

  const returnClause = {
    '_id': 0, // exclude _id
    'savings': 1
  };

  return userModel.findOne(findClause, returnClause)
    .then((user) => {
      if (user)
        return Promise.resolve(user.savings);
      else
        return Promise.reject('UserError: User not found');
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function editSavings(uid, savingsId, changes) {
  let updateClause = {$set: {}};

  const findClause = {
    '_id': uid,
    'savings._id': savingsId
  };

  if (changes.title)
    updateClause.$set['savings.$.title'] = changes.title;

  if (changes.goalAmount)
    updateClause.$set['savings.$.goalAmount'] = changes.goalAmount;

  if (changes.monthlyContribution)
    updateClause.$set['savings.$.monthlyContribution'] = changes.monthlyContribution;

  if (changes.goalYear)
    updateClause.$set['savings.$.goalYear'] = changes.goalYear;

  if (changes.goalMonth)
    updateClause.$set['savings.$.goalMonth'] = changes.goalMonth;

  return userModel.findOneAndUpdate(
    findClause,
    updateClause,
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or savings not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function deleteSavings(uid, savingsId) {
  return userModel.findOneAndUpdate(
    {'_id': uid},
    {'$pull': {'savings': {'_id': savingsId}}},
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or savings not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function favSavings(uid, savingsId){
  var savings;
  try{
    savings = await getAllSavings(uid);
  } catch (err){
    return Promise.reject(err);
  }

  for(let i in savings){
    if(savings[i]._id === savingsId){
      savings[i].favorite = true;
    }
    else if(savings[i].favorite === true){
      savings[x].favorite = false;
    }
  }

  return userModel.findOneAndUpdate(
    {'_id': uid},
    {'$set': {'savings': savings}},
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or savings not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function unfavSavings(uid, savingsId){
  return userModel.findOneAndUpdate(
    {'_id': uid, 'savings._id': savingsId},
    {'$set': {'savings.$.favorite': false}},
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User or savings not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}
