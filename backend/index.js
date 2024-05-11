const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Errore di connessione a MongoDB:'));
db.once('open', () => {
  console.log('Connessione a MongoDB riuscita');
});

app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
  });