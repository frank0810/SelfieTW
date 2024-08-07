const cron = require('node-cron');
const Event = require('./models/Event');
const Task = require('./models/Task');
const {
  sendEmailNotification,
  sendSystemNotification,
  sendAlertNotification
} = require('./utils/notificationService');

// Pianificazione delle notifiche per gli eventi
const scheduleEventNotifications = async () => {
  const events = await Event.find({}); // Ottieni tutti gli eventi

  events.forEach(event => {
    event.notifications.forEach(notification => {
      const advanceInMinutes = notification.advance;
      const repeat = notification.repeat;
      const method = notification.method;

      const eventDate = new Date(event.startDate);
      const notificationDate = new Date(eventDate.getTime() - advanceInMinutes * 60000);

      // Pianifica la notifica
      cron.schedule(`* * * * *`, () => {
        const now = new Date();
        if (now >= notificationDate && now < eventDate) {
          sendNotification(event.userId, event.title, method);
          repeatNotification(event.userId, event.title, method, repeat);
        }
      });
    });
  });
};

// Pianificazione delle notifiche per le attività
const scheduleTaskNotifications = async () => {
  const tasks = await Task.find({});

  tasks.forEach(task => {
    task.notifications.forEach(notification => {
      const advanceInMinutes = notification.advance;
      const repeat = notification.repeat;
      const method = notification.method;

      const deadline = new Date(task.deadline);
      const notificationDate = new Date(deadline.getTime() - advanceInMinutes * 60000);

      // Pianifica la notifica
      cron.schedule(`* * * * *`, () => {
        const now = new Date();
        if (now >= notificationDate && now < deadline) {
          sendNotification(task.userId, task.title, method);
          repeatNotification(task.userId, task.title, method, repeat);
        }
      });
    });
  });
};

// Funzione per inviare la notifica in base al metodo scelto
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

// Funzione per ripetere le notifiche
const repeatNotification = (userId, message, method, repeat) => {
  for (let i = 0; i < repeat; i++) {
    setTimeout(() => {
      sendNotification(userId, message, method);
    }, i * 60000); // Ripeti ogni minuto
  }
};

// Pianifica le notifiche per eventi e attività
scheduleEventNotifications();
scheduleTaskNotifications();