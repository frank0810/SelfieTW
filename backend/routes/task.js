const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/create', taskController.createTask);
router.delete('/delete/:taskId', taskController.deleteTask);
router.put('/update/:taskId', taskController.updateTask);
router.get('/:taskId', taskController.getTaskById);

module.exports = router;