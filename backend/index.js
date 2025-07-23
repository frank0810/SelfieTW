const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const eventsRoutes = require('./routes/event');
const tasksRoutes = require('./routes/task');
const userRouter = require('./routes/user');
const noteRoutes = require('./routes/note');
//const { scheduleNotifications } = require('./notificationManager'); 

dotenv.config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use('/events', eventsRoutes);
app.use('/tasks', tasksRoutes);
app.use('/user', userRouter);
app.use('/notes', noteRoutes);
app.use('/images', express.static('images'));

//scheduleNotifications();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://site232452:ahB4ha7j@mongo_site232452:27017/site232452?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
  console.log('Connected to database:', connection.db.databaseName);
});

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);



const frontendBuildPath = path.join(__dirname, 'frontend', 'build');
const indexPath = path.join(frontendBuildPath, 'index.html');

console.log('Serving static files from:', frontendBuildPath);
console.log('Index.html path:', indexPath);

app.use(express.static(frontendBuildPath));

app.get('*', (req, res) => {
  res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
