const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: { type: String, required: false, default: 'Nota senza titolo' },
    text: { type: String, required: true },
    category: {type: String, required: true, default: 'Note generiche'},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;