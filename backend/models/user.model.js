const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const lastPomodoroSchema = new Schema({
  cicles: { type: Number, default: 0 },
  relaxTime: { type: Number, default: 0 }, 
  studyTime: { type: Number, default: 0 }, 
  updatedAt: { type: Date, default: Date.now }
});

const userSchema = new Schema({
  username: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastPomodoro: { type: lastPomodoroSchema, default: null },
  birthday: { type: Date, required: false }, 
  profilePic: { type: String, required: false, default: '/images/profile-pic.jpg' },
  userNotes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error); // Passa l'errore a Mongoose per la gestione degli errori
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
