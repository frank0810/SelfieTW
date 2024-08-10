const mongoose = require('mongoose');
const { RRule } = require('rrule');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String },
  isAllDay: { type: Boolean, default: false },
  recurrenceRule: { type: String },
  exceptions: [{ type: Date }],
  notifications: [{
    method: { type: String, enum: ['system', 'alert', 'email', 'whatsapp'] },
    advance: { type: Number },
    repeat: { type: Number }
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

eventSchema.methods.getRecurringDates = function () {
  if (!this.recurrenceRule) return [];

  const rule = RRule.fromString(this.recurrenceRule);
  return rule.all();
};

module.exports = mongoose.model('Event', eventSchema);