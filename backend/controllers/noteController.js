const User = require('../models/user.model');
const Note = require('../models/note')
const jwt = require('jsonwebtoken');


exports.createNote = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { title, text, category } = req.body;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newNote = new Note({
        title,
        text,
        category
      });
      await newNote.save();
  
      // Metto la nota dentro alla lista dell'utente che l'ha creata
      user.userNotes.push(newNote._id);
      await user.save();


    res.json({ message: 'Note created successfully' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteNote = async (req, res) => {
  const authHeader = req.headers.authorization;
  const noteId = req.params.noteId;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const noteIndex = user.userNotes.indexOf(noteId);
    if (noteIndex > -1) {
      user.userNotes.splice(noteIndex, 1);
      await user.save();

      await Note.findByIdAndDelete(noteId);

      res.json({ message: 'Note deleted successfully' });
    } else {
      res.status(404).json({ message: 'Note not found in user\'s notes' });
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateNote = async (req, res) => {
    const authHeader = req.headers.authorization;
    const noteId = req.params.noteId;
    const { title, text, category } = req.body;
  
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1]; 
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.userNotes.includes(noteId)) {
        return res.status(403).json({ message: 'You do NOT own this note' });
      }
  
      const note = await Note.findById(noteId);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      if (title) note.title = title;
      if (text) note.text = text;
      if (category) note.category = category;
      note.updatedAt = Date.now();
  
      await note.save();
  
      res.json({ message: 'Note updated successfully', note });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.getNoteById = async (req, res) => {
    const authHeader = req.headers.authorization;
    const { noteId } = req.params;
  
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1]; 
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const note = await Note.findById(noteId);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      res.json({ note });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  };