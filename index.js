require('dotenv').config();

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URL;

const requestlogger = require('./requestLogger');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(requestlogger);

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });

app.get('/', (req,res) => {
    res.send('<h1>Uutisankkuri backend</h1>');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});