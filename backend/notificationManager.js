const { RRule, RRuleSet, rrulestr } = require('rrule');
const { sendEmailNotification, sendSystemNotification, sendAlertNotification } = require('./services/notificationService');
const Event = require('./models/Event');
const Task = require('./models/Task');

// Funzione per inviare notifiche in base al metodo scelto
const sendNotification = (userId, message, method) => {
  switch (method) {
    case 'system':
      sendSystemNotification('Reminder', message);
      break;
    case 'alert':
      sendAlertNotification(message);
      break;
    case 'email':
      sendEmailNotification('example@example.com', 'Reminder', message);
      break;
  }
};

// Funzione per pianificare notifiche per un evento
const scheduleEventNotifications = async () => {
  const events = await Event.find({});
  
  events.forEach(event => {
    event.notifications.forEach(notification => {
      const { advance, repeat, method, rruleString } = notification;
      const eventDate = new Date(event.startDate);
      const notificationDate = new Date(eventDate.getTime() - advance * 60000);

      const rule = rrulestr(rruleString);
      const notificationTimes = rule.all();

      notificationTimes.forEach(nt => {
        if (nt >= notificationDate && nt < eventDate) {
          sendNotification(event.userId, event.title, method);
        }
      });

      // Ripetizione della notifica
      for (let i = 0; i < repeat; i++) {
        setTimeout(() => {
          sendNotification(event.userId, event.title, method);
        }, i * 60000);
      }
    });
  });
};

// Funzione per pianificare notifiche per una task
const scheduleTaskNotifications = async () => {
  const tasks = await Task.find({});
  
  tasks.forEach(task => {
    task.notifications.forEach(notification => {
      const { advance, repeat, method, rruleString } = notification;
      const deadline = new Date(task.deadline);
      const notificationDate = new Date(deadline.getTime() - advance * 60000);

      const rule = rrulestr(rruleString);
      const notificationTimes = rule.all();

      notificationTimes.forEach(nt => {
        if (nt >= notificationDate && nt < deadline) {
          sendNotification(task.userId, task.title, method);
        }
      });

      // Ripetizione della notifica
      for (let i = 0; i < repeat; i++) {
        setTimeout(() => {
          sendNotification(task.userId, task.title, method);
        }, i * 60000);
      }
    });
  });
};

// Funzione principale per pianificare tutte le notifiche
const scheduleNotifications = async () => {
  await scheduleEventNotifications();
  await scheduleTaskNotifications();
};

module.exports = {
  scheduleNotifications
};
