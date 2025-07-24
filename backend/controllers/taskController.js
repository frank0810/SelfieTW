const User = require('../models/user.model');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; 

exports.createTask = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { title, description, deadline, isCompleted } = req.body;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newTask = new Task({
      title, 
      description,
      deadline,
      isCompleted
    });
    await newTask.save();

    user.userTasks.push(newTask._id);
    await user.save();

    res.json({ message: 'Task created successfully' });
  } catch(error){
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  const authHeader = req.headers.authorization;
  const taskId = req.params.taskId;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const taskIndex = user.userTasks.indexOf(taskId);
    if (taskIndex > -1) {
      user.userTasks.splice(taskIndex, 1);
      await user.save();

      await Task.findByIdAndDelete(taskId);

      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found in user\'s tasks' });
    }
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const authHeader = req.headers.authorization;
  const taskId = req.params.taskId;
  const { title, description, deadline, isCompleted } = req.body;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.userTasks.includes(taskId)) {
      return res.status(403).json({ message: 'You do NOT own this task' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (deadline) task.deadline = deadline;
    task.isCompleted = isCompleted;
  
    await task.save();

    res.json({ message: 'Task updated successfully', task });
    console.log(task)
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTaskById = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { taskId } = req.params;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
