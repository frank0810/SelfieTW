const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;


app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
  });