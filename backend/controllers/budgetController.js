import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getAllBudgets, getBudgetNames, getBudgetCategoryNames, createBudget,
    deleteBudget, addBudgetCategory, deleteBudgetCategory, addTransactionToBudget,
    removeTransactionFromBudget, getTransactionsInBudgetCategory} from '../models/budgetDAO';

export default (app) => {
  // create budget
  app.post('/Cheddar/Budgets/:uid', async (req, res) => {
    let budget = {
      name: req.body.name,
      type: req.body.type,
      income: req.body.income,
      timeFrame: req.body.timeFrame,
      favorite: req.body.favorite,
      budgetCategories: req.body.budgetCategories
    };

    let data;
    try {
      data = await createBudget(req.params.uid, budget);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // delete budget
  app.delete('/Cheddar/Budgets/Budget/:uid/:budgetName', async (req, res) => {
    let data;
    try {
      data = await deleteBudget(req.params.uid, req.params.budgetName);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // add budget category
  app.post('/Cheddar/Budgets/Budget/Categories/:uid/:budgetName', async (req, res) => {
    let category = {
      name: req.body.name,
      amount: req.body.amount,
      transactions: req.body.transactions
    };

    let data;
    try {
      data = await addBudgetCategory(req.params.uid, req.params.budgetName, category);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // delete budget category
  app.delete('/Cheddar/Budgets/Budget/Categories/:uid/:budgetName/:categoryName', async (req, res) => {
    let data;
    try {
      data = await deleteBudgetCategory(req.params.uid, req.params.budgetName, req.params.categoryName);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // get all budgets
  app.get('/Cheddar/Budgets/:uid', async (req, res) => {
    let data;
    try {
      data = await getAllBudgets(req.params.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // get all budget names (testing)
  app.get('/Cheddar/Budgets/Names/:uid', async (req, res) => {
    let data;
    try {
      data = await getBudgetNames(req.params.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // get all budget category names (testing)
  app.get('/Cheddar/Budgets/Budget/Categories/Names/:uid/:budgetName', async (req, res) => {
    let data;
    try {
      data = await getBudgetCategoryNames(req.params.uid, req.params.budgetName);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // add transaction to budget
  app.post('/Cheddar/Budgets/Budget/Transaction/:uid/:budgetName/:categoryName', async (req, res) => {
    let transaction = {
      name: req.body.name,
      amount: req.body.amount,
      date: req.body.date,
    };

    let data;
    try {
      data = await addTransactionToBudget(req.params.uid, req.params.budgetName, req.params.categoryName, transaction);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // remove transaction from budget
  app.delete('/Cheddar/Budgets/Budget/Transaction/:uid/:budgetName/:categoryName/:transactionId', async (req, res) => {
    let data;
    try {
      data = await removeTransactionFromBudget(req.params.uid, req.params.budgetName, req.params.categoryName, req.params.transactionId);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // get transactions in budget category
  app.get('/Cheddar/Budgets/Budget/Transactions/ByCategory/:uid/:budgetName/:categoryName', async (req, res) => {
    let data;
    try {
      data = await getTransactionsInBudgetCategory(req.params.uid, req.params.budgetName, req.params.categoryName);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });
};
