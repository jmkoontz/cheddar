import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getAllBudgets, createBudget} from '../models/budgetDAO';

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
};
