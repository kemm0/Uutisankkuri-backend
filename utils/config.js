/* eslint-disable no-undef */
require('dotenv').config();

const PORT = process.env.PORT;

const MONGODB_URL = process.env.MONGODB_URL;

const TOKENSECRET = process.env.TOKENSECRET;

module.exports = {
    MONGODB_URL,
    PORT,
    TOKENSECRET
};