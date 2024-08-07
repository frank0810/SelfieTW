const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  getEvents, 
  updateEvent, 
  deleteEvent, 
  getEventById 
} = require('../controllers/eventController');

// Rotte per la gestione degli eventi
router.post('/', createEvent); // Creazione di un nuovo evento
router.get('/', getEvents); // Ottenere tutti gli eventi dell'utente
router.get('/:id', getEventById); // Ottenere un evento specifico tramite ID
router.put('/:id', updateEvent); // Aggiornare un evento esistente
router.delete('/:id', deleteEvent); // Cancellare un evento

module.exports = router;