import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getUser, createUser} from '../models/userDAO';

export default (app) => {
  app.post('/Cheddar/CreateAccount', async (req, res) => {
    let user = {
      _id: req.body._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    };

    let data;
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
      data = await getUser(req.params.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  app.get('/Cheddar/test', async (req, res) => {
    let data;
    try {
      console.log('it worked')
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });
};
