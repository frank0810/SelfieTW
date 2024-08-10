const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  isOverdue: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  notifications: [{
    method: { type: String, enum: ['system', 'alert', 'email', 'whatsapp'] },
    urgencyLevels: [{ timeBeforeDeadline: Number }]
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

taskSchema.pre('save', function (next) {
  const now = new Date();
  if (this.deadline < now && !this.isCompleted) {
    this.isOverdue = true;
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
