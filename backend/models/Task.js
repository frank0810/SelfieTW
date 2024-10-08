const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  //isOverdue: { type: Boolean, default: false }, Gestire bene con TimeMachine  
  //priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  // notifications: [{
  //   method: { type: String, enum: ['system', 'alert', 'email'] },
  //   urgencyLevels: [{ timeBeforeDeadline: Number }]
  // }],
});

// taskSchema.pre('save', function (next) {
//   const now = new Date();
//   if (this.deadline < now && !this.isCompleted) {
//     this.isOverdue = true;
//   }
//   next();
// });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;