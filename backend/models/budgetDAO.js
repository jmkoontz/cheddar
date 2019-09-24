import {userModel, budgetModel} from '../utilities/mongooseModels';

export function getAllBudgets(uid) {
  const returnClause = {
    '_id': 0, // exclude _id
    'budgets': 1
  };

  return userModel.findOne({_id: uid}, returnClause)
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
      if (user && user.budgets) {
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
    {'$addToSet': {'budgets': budget}})
    .then((originalUser) => {
      if (originalUser == null)
        return Promise.reject('UserError: User not found');

      return Promise.resolve(originalUser);
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

  // get names of budgets
  let categoryNames = [];
  try {
    categoryNames = await getBudgetCategoryNames(uid, budgetName);
  } catch (error) {
    return Promise.reject(error);
  }

  // protect against duplicate budget names
  if (categoryNames.includes(category.name))
    return Promise.reject('UserError: Budget category with name \"' + category.name + '\" already exists');

  return userModel.findOneAndUpdate(
    {_id: uid},
    {'$addToSet': {'budgets': budget}})
    .then((originalUser) => {
      if (originalUser == null)
        return Promise.reject('UserError: User not found');

      return Promise.resolve(originalUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}
