import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getUser, editUser, getNotifications} from '../models/userDAO';

export default (app) => {
  // get a user's events
  app.get('/Cheddar/Calendar/:uid', async (req, res) => {
    let data;
    try {
      data = await getUser(req.params.uid);
      data = data.events;
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // Create a new event
  app.post('/Cheddar/Calendar/event/:uid', async (req, res) => {
    let data;
    try {
      const user = await getUser(req.params.uid);
      const events = user.events;
      events.push(req.body);

      data = await editUser(req.params.uid, {events: events});
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // edit an event indexed by the id
  app.put('/Cheddar/Calendar/event/:uid', async (req, res) => {
    let data;
    try {
      const user = await getUser(req.params.uid);
      const events = user.events;

      for (let i = 0; i < events.length; i++) {
        if (events[i].id === req.body.id) {
          events[i] = req.body;
          break;
        }
      }

      data = await editUser(req.params.uid, {events: events});
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // Delete an event
  app.delete('/Cheddar/Calendar/event/:uid/:eventId', async (req, res) => {
    let data;
    try {
      const user = await getUser(req.params.uid);
      const events = user.events;

      for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
          events.splice(i, 1);
          break;
        }
      }

      data = await editUser(req.params.uid, {events: events});
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // edit an event indexed by the id
  app.get('/Cheddar/Calendar/notifications/:uid', async (req, res) => {
    let data;
    try {
      data = await getNotifications(req.params.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // edit the notification schedule
  app.put('/Cheddar/Calendar/notificationSchedule/:uid', async (req, res) => {
    let data;
    try {
      data = await editUser(req.params.uid, {notificationSchedule: req.body});
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });
};
