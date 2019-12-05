import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getAllSavings, getSavingsTitles, createSavings, editSavings, deleteSavings, getOneSavings, favSavings, unfavSavings, getfavSavings} from '../models/savingsDAO';

export default (app) => {
  app.get('/Cheddar/Savings/test', async (req, res) => {
    let data;
    try {
      console.log('it worked');
      data = 'Savings - Hello there';
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  //find one savings
  app.get('Cheddar/Savings/:uid/Saving/:savingsId', async (req, res) => {
    let data;
    try {
      data = await getOneSavings(req.params.uid, req.params.savingsId);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // create savings
  app.post('/Cheddar/Savings/:uid', async (req, res) => {
    let savings = {
      title: req.body.title,
      category: req.body.category,
      goalAmount: req.body.goalAmount,
      goalYear: req.body.goalYear,
      goalMonth: req.body.goalMonth,
      monthlyContribution: req.body.monthlyContribution,
      currSaved: 0
    };

    let data;
    try {
      data = await createSavings(req.params.uid, savings);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // edit savings
  app.put('/Cheddar/Savings/:uid/:savingsTitle', async (req, res) => {
    let changes = {
      title: req.body.title,
      goalAmount: req.body.goalAmount,
      goalYear: req.body.goalYear,
      goalMonth: req.body.goalMonth,
      monthlyContribution: req.body.monthlyContribution,
      currSaved: req.body.currSaved
    };

    let data;
    try {
      data = await editSavings(req.params.uid, req.params.savingsTitle, changes);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // delete savings
  app.delete('/Cheddar/Savings/Saving/:uid/:savingsId', async (req, res) => {
    let data;
    try {
      data = await deleteSavings(req.params.uid, req.params.savingsId);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // get all savings
  app.get('/Cheddar/Savings/:uid', async (req, res) => {
    let data;
    try {
      data = await getAllSavings(req.params.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // get all savings titles
  app.get('/Cheddar/Savings/titles/:uid', async (req, res) => {
    let data;
    try {
      data = await getSavingsTitles(req.params.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // favorite a savings plans
  app.put('/Cheddar/Savings/Favorite/:uid/:savingsId', async (req, res) => {
    let data;
    try{
      data = await favSavings(req.params.uid, req.params.savingsId);
    } catch (err) {
      data = {error: parseError(err)};
    }
    buildResponse(res, data);
  });

  // unfavorite a savings plans
  app.put('/Cheddar/Savings/Unfavorite/:uid/:savingsId', async (req, res) => {
    let data;
    try{
      data = await unfavSavings(req.params.uid, req.params.savingsId);
    } catch (err) {
      data = {error: parseError(err)};
    }
    buildResponse(res, data);
  });

  app.get('/Cheddar/Savings/Favorite/:uid', async (req, res) => {
    let data;
    try{
      data = await getfavSavings(req.params.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }
    buildResponse(res, data);
  });
};
