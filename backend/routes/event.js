const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');

router.post('/events', authController.auth, eventController.createEvent);
router.get('/events', authController.auth, eventController.getEvents);
router.get('/events/:id', authController.auth, eventController.getEventById);
router.patch('/events/:id', authController.auth, eventController.updateEvent);
router.delete('/events/:id', authController.auth, eventController.deleteEvent);

module.exports = router;
