const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  startTime: {type:String, required: true},
  endDate: { type: Date, required: true },
  endTime: {type:String, required: true},
  location: { type: String },
  isAllDay: { type: Boolean, default: false }
  /*notifications: [{
    method: { type: String, enum: ['system', 'alert', 'email'] },
    advance: { type: Number },
    repeat: { type: Number }
  }]*/

 //TODO RIPETIZIONI

});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

