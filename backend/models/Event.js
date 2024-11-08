const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  startTime: { type: String },
  endDate: { type: Date, required: true },
  endTime: { type: String },
  location: { type: String },
  isAllDay: { type: Boolean, default: false },

  //TODO RIPETIZIONI
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'none'],
    default: 'none'
  },
  repeatUntil:{ type: Date },
  excludedDates: [{type: Date}]

});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

