require('dotenv').config();

const PORT = process.env.PORT;
const url = process.env.NEWS_DB_URL;
const requestlogger = require('./requestLogger');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(requestlogger);

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  });

app.get('/', (req,res) => {
    res.send('<h1>Uutisankkuri backend</h1>');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});