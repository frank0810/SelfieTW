const Event = require('../models/Event');

// Creazione di un nuovo evento
const createEvent = async (req, res) => {
  const event = new Event({
    ...req.body,
    userId: req.user._id // Assegna l'evento all'utente autenticato
  });
  
  try {
    await event.save();
    res.status(201).send(event);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Ottenere tutti gli eventi di un utente
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id });
    res.send(events);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Ottenere un evento specifico tramite ID
const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOne({ _id: id, userId: req.user._id });
    if (!event) {
      return res.status(404).send({ error: 'Event not found' });
    }
    res.send(event);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Aggiornare un evento esistente
const updateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).send({ error: 'Event not found' });
    }
    res.send(event);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Cancellare un evento
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!event) {
      return res.status(404).send({ error: 'Event not found' });
    }
    res.send(event);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent };