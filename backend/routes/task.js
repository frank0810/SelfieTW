const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');

router.post('/tasks', authController.auth, taskController.createTask);
router.get('/tasks', authController.auth, taskController.getTasks);
router.get('/tasks/:id', authController.auth, taskController.getTaskById);
router.patch('/tasks/:id', authController.auth, taskController.updateTask);
router.delete('/tasks/:id', authController.auth, taskController.deleteTask);

module.exports = router;
