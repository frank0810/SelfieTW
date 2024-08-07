const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask, 
  getTaskById 
} = require('../controllers/taskController');

// Rotte per la gestione delle attività
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;