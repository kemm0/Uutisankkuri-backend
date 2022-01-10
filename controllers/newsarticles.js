const newsArticlesRouter = require('express').Router();
const tokenmanager = require('../utils/tokenmanager');
const NewsArticle = require('../models/newsarticle');
const mongoose = require('mongoose');

const defaultResultsAmount = 20;

newsArticlesRouter.get('/', async (request, response) => {
    const token = request.token;
    const requester = await tokenmanager.verifyUser(token);

    if(requester === null || requester === undefined){
        return response.status(400).send('Invalid token');
    }

    let skip = request.query.skip;
    let amount = request.query.amount;
    let keywords = request.query.keyword;
    let sourceFeeds = request.query.feedID;

    let findOptions = {};

    if(keywords !== undefined){
        let regexQuery = keywords.join('|');

        findOptions.headline = { $regex: regexQuery };
    }

    if(sourceFeeds !== undefined){
        if(sourceFeeds.length !== 0){
            findOptions.sourceNewsFeed = { $in: sourceFeeds };
        }
    }

    if(skip === undefined){
        skip = 0;
    }
    if(amount === undefined){
        amount = defaultResultsAmount;
    }

    const newsFeeds = await NewsArticle
        .find(findOptions)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(amount);

    response.json(newsFeeds);
});

newsArticlesRouter.get('/:id', async (request, response) => {
    const token = request.token;
    const requester = await tokenmanager.verifyUser(token);

    if(requester === null || requester === undefined){
        return response.status(400).send('Invalid token');
    }

    const article = await NewsArticle.findOne({ id_: mongoose.Types.ObjectId(request.params.id) });

    if(article === null || article === undefined){
        return response.status(400).send('Invalid id');
    }

    response.json(article);

});

module.exports = newsArticlesRouter;