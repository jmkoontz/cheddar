import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getUser, editUser} from '../models/userDAO';

export default (app) => {
  // get a user's events
  app.get('/Cheddar/Calendar/:uid', async (req, res) => {
    let data;
    try {
      //data = await getUser(req.params.uid);
      data = [
        {
          title: "rent due",
          start: new Date,
          end: new Date,
          allDay: true
        }, {
          title: "rent due 2",
          start: new Date,
          end: new Date,
          allDay: true
        }
      ];
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // Create a new event
  app.post('/Cheddar/Calendar/event/:uid/:eventId', async (req, res) => {

    buildResponse(res, data);
  });

  // edit an event indexed by the id
  app.put('/Cheddar/Calendar/event/:uid/:eventId', async (req, res) => {

    buildResponse(res, data);
  });

  // Delete an event
  app.delete('/Cheddar/Calendar/event/:uid/:eventId', async (req, res) => {

    buildResponse(res, data);
  });
};
