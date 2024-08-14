const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String },
  isAllDay: { type: Boolean, default: false },
  notifications: [{
    method: { type: String, enum: ['system', 'alert', 'email'] },
    advance: { type: Number },
    repeat: { type: Number }
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Event', eventSchema);
