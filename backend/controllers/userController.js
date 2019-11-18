import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getUser, createUser, editUser, deleteUser} from '../models/userDAO';

export default (app) => {
  app.post('/Cheddar/CreateAccount', async (req, res) => {
    console.log("IN BACKEND");
    let user = {
      _id: req.body._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      // hard-coded values for now
      type: 'general',
      netWorth: 0,
      budgets: [],
      transactions: [],
      savings: [],
      debts: [],
      investments: {
          trackedCompanies: [],
          investments: [],
          totalInvestment: 0,
      },
      retirement: {
        total: 0,
        history: [],
      }
    };

    let data;
    console.log("DEBUGGING");
    console.log(user);
    try {
      data = await createUser(user);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // get a user
  app.get('/Cheddar/:uid', async (req, res) => {
    let data;
    try {
      console.log('it worked');
      data = 'Hello the';
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // edit a user
  app.put('/Cheddar/:uid', async (req, res) => {
    let changes = {
      firstName: req.query.firstName,
      lastName: req.query.lastName,
      type: req.query.type,
      netWorth: req.query.netWorth
    };

    let data;
    try {
      data = await editUser(req.params.uid, changes);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // delete a user
  app.delete('/Cheddar/:uid', async (req, res) => {
    let data;
    try {
      data = await deleteUser(req.params.uid)
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

};
