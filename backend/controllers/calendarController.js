import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getUser, editUser, getNotifications, pushEmailNotifications} from '../models/userDAO';

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
      const event = req.body;
      const user = await getUser(req.params.uid);
      const events = user.events;

      if (event.repeat && event.repeat !== "Never") {
        let loops = 1;

        switch (event.repeat) {
          case "Weekly":
            loops *= 52;
            break;
          case "Biweekly":
            loops *= 26;
            break;
          case "Monthly":
            loops *= 12;
        }

        let nextEvent = event;
        nextEvent.start = new Date(nextEvent.start);

        for (let i = 0; i < loops; i++) {
          nextEvent.subId = i;
          console.log(nextEvent);
          events.push(nextEvent);

          nextEvent.start = new Date(nextEvent.start);
          switch (event.repeat) {
            case "Weekly":
              nextEvent.start.setDate(nextEvent.start.getDate() + 7);
              break;
            case "Biweekly":
              nextEvent.start.setDate(nextEvent.start.getDate() + 14);
              break;
            case "Monthly":
              nextEvent.start.setMonth(nextEvent.start.getMonth() + 1);
          }

          nextEvent.end = nextEvent.start;
        }

      } else {
        events.push(event);
      }

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
          let sub = events[i].subId;
          events[i] = req.body;
          events[i].subId = sub;
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
          i--;
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

  // edit an event indexed by the id
  app.post('/Cheddar/Calendar/dismissNotification/:uid', async (req, res) => {
    let data;
    try {
      const user = await getUser(req.params.uid);
      const events = user.events;
      const periods = ["month", "twoWeek", "week", "day", "dayOf"];

      for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.body.id) {
          if (!events[i].dismissed)
            events[i].dismissed = {
              month: false,
              twoWeek: false,
              week: false,
              day: false,
              dayOf: false
            };

          for (let j = 0; j < periods.length; j++) {
            events[i].dismissed[periods[j]] = true;

            if (periods[j] == req.body.period)
              break;
          }
        }
      }

      data = await editUser(req.params.uid, {events: events});
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });

  // get the notification schedule
  app.get('/Cheddar/Calendar/notificationSchedule/:uid', async (req, res) => {
    let data;
    try {
      data = await getUser(req.params.uid);
      data = data.notificationSchedule;
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

  app.get('/Cheddar/Calendar/triggerAllEmails/:uid', async (req, res) => {
    let data;
    try {
      data = await pushEmailNotifications();
    } catch (err) {
      data = {error: parseError(err)};
    }

    buildResponse(res, data);
  });
};
