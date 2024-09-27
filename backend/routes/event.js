const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/create', eventController.createEvent);
router.delete('/delete/:eventId', eventController.deleteEvent);
router.put('/update/:eventId', eventController.updateEvent);
router.get('/:eventId', eventController.getEventById);

module.exports = router;
