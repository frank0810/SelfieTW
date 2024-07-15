const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
