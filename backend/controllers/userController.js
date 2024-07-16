const User = require('../models/user.model');
const jwt = require('jsonwebtoken');


//UPDATE di lastPomodoro
exports.updateLastPomodoro = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { cicles, relaxTime, studyTime } = req.body;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Devo prendere solo la parte dopo "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.lastPomodoro = {
      cicles: cicles || user.lastPomodoro.cicles,
      relaxTime: relaxTime || user.lastPomodoro.relaxTime,
      studyTime: studyTime || user.lastPomodoro.studyTime,
      updatedAt: Date.now()
    };

    await user.save();

    res.json({ message: 'LastPomodoro updated successfully', lastPomodoro: user.lastPomodoro });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserPomodoro = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('No authorization header provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Devo prendere solo la parte dopo "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.lastPomodoro) {
      return res.status(204).json({ message: 'No lastPomodoro data found' });
    }

    res.json({ lastPomodoro: user.lastPomodoro });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.log('Server error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

