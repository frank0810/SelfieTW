const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const eventsRouter = require('./routes/events');
const tasksRouter = require('./routes/tasks');
const { scheduleNotifications } = require('./notifications');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/events', eventsRouter);
app.use('/tasks', tasksRouter);

scheduleNotifications();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const authRouter = require('./routes/auth');

app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
