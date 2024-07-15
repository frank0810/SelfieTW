const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deadline: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  notifications: [{
    method: { type: String, enum: ['system', 'alert', 'email'] },
    advance: { type: Number },
    repeat: { type: Number }
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Task', taskSchema);
