const config = require('./utils/config');
const express = require('express');
const mongoose = require('mongoose');
const categoriesRouter = require('./controllers/categories');
const feedBoardsRouter = require('./controllers/feedboards');
const newsArticlesRouter = require('./controllers/newsarticles');
const newsFeedsRouter = require('./controllers/newsfeeds');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const loginRouter = require('./controllers/login');

const app = express();
require('express-async-errors');

console.log('connecting to', config.MONGODB_URL);
mongoose.connect(config.MONGODB_URL)
    .catch(error => {
        console.log(error);
    });

app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/categories', categoriesRouter);
app.use('/api/feedboards', feedBoardsRouter);
app.use('/api/newsarticles', newsArticlesRouter);
app.use('/api/newsfeeds', newsFeedsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;



