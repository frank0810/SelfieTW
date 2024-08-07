const mongoose = require('mongoose');

// Definizione dello schema per le attività
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deadline: { type: Date, required: true }, // Scadenza per il completamento dell'attività
  isCompleted: { type: Boolean, default: false }, // Stato di completamento dell'attività
  notifications: [{
    method: { type: String, enum: ['system', 'alert', 'email', 'whatsapp'] },
    advance: { type: Number },
    repeat: { type: Number }
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Task', taskSchema);