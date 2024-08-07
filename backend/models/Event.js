const mongoose = require('mongoose');

// Definizione dello schema per gli eventi
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String },  // può essere un indirizzo fisico o un URL virtuale
  isAllDay: { type: Boolean, default: false }, // Per eventi che durano tutto il giorno
  repeat: {
    frequency: { type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'] }, // Frequenza di ripetizione
    interval: { type: Number, default: 1 }, // Intervallo tra le ripetizioni (es. ogni 2 giorni)
    daysOfWeek: [{ type: Number, min: 0, max: 6 }], // Per ripetizioni settimanali (0 = domenica, 1 = lunedì, ecc.)
    count: { type: Number }, // Numero di ripetizioni
    until: { type: Date } // Data di fine ripetizione
  },
  notifications: [{
    method: { type: String, enum: ['system', 'alert', 'email', 'whatsapp'] }, // Metodo di notifica
    advance: { type: Number }, // Anticipo in minuti
    repeat: { type: Number } // Numero di ripetizioni della notifica
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Collegamento con l'utente
});

module.exports = mongoose.model('Event', eventSchema);