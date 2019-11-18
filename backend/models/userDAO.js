import {userModel} from '../utilities/mongooseModels';
import email from '../config/email';
import nodemailer from 'nodemailer';

export function getUser(uid) {
  return userModel.findOne({_id: uid})
    .then((user) => {
      if (user)
        return Promise.resolve(user);
      else
        return Promise.reject('UserError: User not found');
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function getAllUsers() {
  return userModel.find({})
    .then((users) => {
      if (users)
        return Promise.resolve(users);
      else
        return Promise.reject('UserError: Users');
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function createUser(user) {
  for (let i in user) {
    if (user.hasOwnProperty(i)) {
      if (user[i] === undefined)
        return Promise.reject('UserError: One or more fields are missing');
      else if (user[i] === '')
        return Promise.reject('UserError: Each field must have information');
    }
  }
  console.log("DEBUGGING");
  console.log(user);
  return userModel.create(user)
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function editUser(uid, changes) {
  let updateClause = {$set: changes};

  return userModel.findOneAndUpdate(
    {'_id': uid},
    updateClause,
    {'new': true})
    .then((updatedUser) => {
      if (updatedUser == null)
        return Promise.reject('UserError: User not found');

      return Promise.resolve(updatedUser);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function deleteUser(uid) {
  return userModel.findOneAndDelete({_id: uid})
    .then((user) => {
      if (user)
        return Promise.resolve(user);
      else
        return Promise.reject('UserError: User not found');
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export async function getNotifications(uid, isEmail) {
  const user = await getUser(uid);
  const today = new Date();
  const notifications = {};

  for (let i = 0; i < user.events.length; i++) {
    const event = user.events[i];

    if (event.notify == null || !event.notify)
      continue;

    for (let period in user.notificationSchedule) {
      if (user.notificationSchedule.hasOwnProperty(period) || !user.notificationSchedule[period])
        continue;

      // If dismissed or emailed already, don't include this notification
      if ((event.dismissed && event.dismissed[period]) || (isEmail && event.emailed && event.emailed[period]))
        continue;

      let cmp;
      const multiplier = 24 * 60 * 60 * 1000;
      switch (period) {
        case "month":
          cmp = new Date();
          cmp.setMonth(today.getMonth() + 1);
          break;
        case "twoWeek":
          cmp = new Date();
          cmp.setDate(today.getTime() + 14 * multiplier);
          break;
        case "week":
          cmp = new Date();
          cmp.setDate(today.getTime() + 7 * multiplier);
          break;
        case "day":
          cmp = new Date();
          cmp.setDate(today.getTime() + multiplier);
          break;
        case "dayOf":
          cmp = today;
          break;
        default:
          continue;
      }

      cmp.setHours(0, 0, 0);
      cmp.setMilliseconds(0);

      if (cmp >= event.start && event.start >= today) {
        notifications[event.id] = {
          id: event.id,
          title: event.title,
          period: period
        };
      }
    }
  }

  return Object.values(notifications);
}

export async function pushEmailNotifications() {
  const users = await getAllUsers();

  users.forEach(async (user) => {
    const notifications = await getNotifications(user._id, true);
    const events = user.events;

    if (!user.notificationSchedule || !user.notificationSchedule.emailsEnabled || notifications.length === 0)
      return;

    let emailString = "Hi " + user.firstName + ",\n\nYou have some expenses coming up that you should be aware of:\n";

    notifications.forEach((notification) => {
      emailString += "\t- " + notification.title + "\n";
      const periods = ["month", "twoWeek", "week", "day", "dayOf"];

      //set email sent to true for this period
      for (let i = 0; i < events.length; i++) {
        if (events[i].id == notification.id) {
          if (!events[i].emailed)
            events[i].emailed = {};

          for (let j = 0; j < periods.length; j++) {
            events[i].emailed[periods[j]] = true;

            if (periods[j] == notification.period)
              break;
          }
        }
      }
    });

    // Save emailed events
    editUser(user._id, {events: events});

    emailString += "\nThanks,\n- Cheddar Budgeting Team";

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email.email,
        pass: email.pass
      }
    });

    const mailOptions = {
      from: email.email,
      to: user.email,
      subject: 'Cheddar Event Notifications',
      text: emailString
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });

  return true;
}
