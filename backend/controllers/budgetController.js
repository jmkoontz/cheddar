import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getAllBudgets, getBudgetNames, getBudgetCategoryNames, createBudget,
    addBudgetCategory} from '../models/budgetDAO';

export default (app) => {
  app.post('/Cheddar/Budgets/:uid', async (req, res) => {
    let budget = {
      name: req.body.name,
      type: req.body.type,
      income: req.body.income,
      timeFrame: req.body.timeFrame,
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

  // add budget category
  app.post('/Cheddar/Budgets/Budget/:uid/:name', async (req, res) => {
    let data;
    try {
      data = await addBudgetCategory(req.params.uid, req.params.name, budget);
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
  app.get('/Cheddar/Budgets/Budget/Names/:uid/:name', async (req, res) => {
    let data;
    try {
      data = await getBudgetCategoryNames(req.params.uid, req.params.name);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });
};
