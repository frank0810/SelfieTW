const Event = require('../models/Event');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Creazione di un nuovo evento
const createEvent = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { title, startDate, startTime, endDate, endTime, location, isAllDay } = req.body;

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
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    const newEvent = new Event({
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      isAllDay
    });
    console.log(newEvent);
    await newEvent.save();

    user.userEvents.push(newEvent._id);
    await user.save();


    res.json({ message: 'Event created successfully' });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};


// Ottenere un evento specifico tramite ID
const getEventById = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { eventID } = req.params;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const event = await Event.findById(eventID);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Aggiornare un evento esistente
const updateEvent = async (req, res) => {
  const authHeader = req.headers.authorization;
  const eventId = req.params.eventId;
  const { title, startDate, startTime, endDate, endTime, location, isAllDay } = req.body;

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

    if (!user.userEvents.includes(eventId)) {
      return res.status(403).json({ message: 'You do NOT own this event' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'event not found' });
    }

    if (title) event.title = title;
    if (startDate) event.startDate = startDate;
    if (startTime) event.startTime = startTime;
    if (endDate) event.endDate = endDate;
    if (endTime) event.endTime = endTime;
    if (location) event.location = location;
    if (isAllDay) event.isAllDay = isAllDay;

    await event.save();

    res.json({ message: 'event updated successfully', event });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Eliminare un evento
const deleteEvent = async (req, res) => {
  const authHeader = req.headers.authorization;
  const eventId = req.params.eventId;

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

    const eventIndex = user.userEvents.indexOf(eventId);
    if (eventIndex > -1) {
      user.userEvents.splice(eventIndex, 1);
      await user.save();

      await Event.findByIdAndDelete(eventId);

      res.json({ message: 'Event deleted successfully' });
    } else {
      res.status(404).json({ message: 'event not found in user\'s events' });
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent
};
