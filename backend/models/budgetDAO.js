import {userModel, budgetModel} from '../utilities/mongooseModels';

export function getAllBudgets(uid) {
  return userModel.findOne({_id: uid})
    .then((user) => {
      if (user)
        return Promise.resolve(user);
      else
        return Promise.reject('UserError: User not found');
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function createBudget(uid, budget) {
  for (let i in budget) {
    if (budget.hasOwnProperty(i)) {
      if (budget[i] === undefined)
        return Promise.reject('UserError: One or more fields are missing');
      else if (budget[i] === '')
        return Promise.reject('UserError: Each field must have information');
    }
  }

  // TODO Fix
  return userModel.findOneAndUpdate(
    {_id: uid},
    {'$addToSet': {'budgets': budget}},
    {rawResult: true})
    .then((originalUser) => {
      console.log(originalUser)
      if (originalUser == null)
        return Promise.reject('UserError: User does not exist');

      return Promise.resolve(originalUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}
