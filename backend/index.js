const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const eventsRoutes = require('./routes/event');
const tasksRoutes = require('./routes/task');
const userRouter = require('./routes/user');
const noteRoutes = require('./routes/note');
const { scheduleNotifications } = require('./notificationManager'); 


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/events', eventsRoutes);
app.use('/tasks', tasksRoutes);
app.use('/user', userRouter);
app.use('/notes', noteRoutes);
app.use('/images', express.static('images'));
//app.use('/notifications', notificationRoutes);

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