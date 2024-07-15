const schedule = require('node-schedule');
const Event = require('./models/Event');
const Task = require('./models/Task');
const { sendNotification } = require('./utils/notificationService');

const scheduleNotifications = () => {
  Event.find({}, (err, events) => {
    if (err) throw err;
    events.forEach(event => {
      event.notifications.forEach(notification => {
        const notificationTime = new Date(new Date(event.startDate).getTime() - notification.advance * 60000);
        schedule.scheduleJob(notificationTime, () => {
          sendNotification(notification.method, event.title);
        });
      });
    });
  });

  Task.find({}, (err, tasks) => {
    if (err) throw err;
    tasks.forEach(task => {
      task.notifications.forEach(notification => {
        const notificationTime = new Date(new Date(task.deadline).getTime() - notification.advance * 60000);
        schedule.scheduleJob(notificationTime, () => {
          sendNotification(notification.method, task.title);
        });
      });
    });
  });
};

module.exports = { scheduleNotifications };
