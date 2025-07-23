const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';  // Hardcoded dal .env

exports.register = async (req, res) => {
  console.log('Register endpoint chiamato');
  console.log('Body ricevuto:', req.body);

  const { firstName, lastName, email, password, username } = req.body;

  try {
    console.log('Controllo se esiste email:', email);
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log('Email già in uso:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    console.log('Controllo se esiste username:', username);
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log('Username già in uso:', username);
      return res.status(400).json({ message: 'Username already exists' });
    }

    console.log('Creo nuovo utente...');
    const newUser = new User({ firstName, lastName, email, password, username });
    await newUser.save();

    console.log('Utente creato con successo:', newUser._id);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Trova l'utente per username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    // Verifica la password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Genera il token JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
