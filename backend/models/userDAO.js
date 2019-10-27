import {userModel} from '../utilities/mongooseModels';

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

export function createUser(user) {
  for (let i in user) {
    if (user.hasOwnProperty(i)) {
      if (user[i] === undefined)
        return Promise.reject('UserError: One or more fields are missing');
      else if (user[i] === '')
        return Promise.reject('UserError: Each field must have information');
    }
  }

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

export async function getNotifications(uid) {
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

      if (event.dismissed && event.dismissed[period])
        continue;

      let cmp;
      switch (period) {
        case "month":
          cmp = new Date();
          cmp.setMonth(today.getMonth() - 1);
          break;
        case "twoWeek":
          cmp = new Date();
          cmp.setDate(today.getDate() - 14);
          break;
        case "week":
          cmp = new Date();
          cmp.setDate(today.getDate() - 7);
          break;
        case "day":
          cmp = new Date();
          cmp.setDate(today.getDate() - 1);
          break;
        case "dayOf":
          cmp = today;
          break;
        default:
          continue;
      }

      cmp.setHours(0, 0, 0);
      cmp.setMilliseconds(0);

      if (cmp <= event.start && event.start <= today) {
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
