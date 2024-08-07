const cron = require('node-cron');
const notificationService = require('./utils/notificationService');
const Event = require('./models/Event');

// Definisci la funzione per pianificare le notifiche degli eventi
function scheduleEventNotifications() {
  // Pianifica un task che controlla gli eventi imminenti ogni minuto
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const upcomingEvents = await Event.find({
        startTime: { $gte: now, $lt: new Date(now.getTime() + 5 * 60000) } // Eventi che iniziano nei prossimi 5 minuti
      });

      upcomingEvents.forEach(event => {
        // Invia notifiche per ogni evento imminente
        notificationService.sendEmailNotification(event.userEmail, `Upcoming Event: ${event.title}`, `You have an event coming up at ${event.startTime}`);
        // Altri tipi di notifica possono essere gestiti qui
      });

    } catch (error) {
      console.error('Errore durante la pianificazione delle notifiche:', error);
    }
  });
}

// Esporta la funzione per essere utilizzata in altri moduli
module.exports = {
  scheduleEventNotifications // Assicurati che questa linea esista e che sia corretta
};
