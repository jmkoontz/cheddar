import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {addTransaction, editTransaction, deleteTransaction, getAllTransactions,
    getTransactions, getTransactionsInDateRange} from '../models/transactionDAO';

export default (app) => {
  // add transaction
  app.post('/Cheddar/Transactions/:uid', async (req, res) => {
    let transaction = {
      name: req.body.name,
      amount: req.body.amount,
      date: req.body.date,
    };

    let data;
    try {
      data = await addTransaction(req.params.uid, transaction);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // edit transaction
  app.put('/Cheddar/Transactions/:uid/:transactionId', async (req, res) => {
    let transaction = {
      name: req.body.name,
      amount: req.body.amount,
      date: req.body.date,
    };

    let data;
    try {
      data = await editTransaction(req.params.uid, req.params.transactionId, transaction);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // delete transaction
  app.delete('/Cheddar/Transactions/:uid/:transactionId', async (req, res) => {
    let data;
    try {
      data = await deleteTransaction(req.params.uid, req.params.transactionId);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // get all transactions
  app.get('/Cheddar/Transactions/:uid', async (req, res) => {
    let data;
    try {
      data = await getAllTransactions(req.params.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // get transactions in date range
  app.get('/Cheddar/Transactions/DateRange/:uid', async (req, res) => {
    let dateRange = {
      startYear: req.query.startYear,
      startMonth: req.query.startMonth,
      startDay: req.query.startDay,
      endYear: req.query.endYear,
      endMonth: req.query.endMonth,
      endDay: req.query.endDay
    };

    let data;
    try {
      data = await getTransactionsInDateRange(req.params.uid, dateRange);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });
};
