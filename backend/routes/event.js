const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.post('/events', async (req, res) => {
  const event = new Event(req.body);
  try {
    await event.save();
    res.status(201).send(event);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id });
    res.send(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
