const newsFeedsRouter = require('express').Router();
const tokenmanager = require('../utils/tokenmanager');
const NewsFeed = require('../models/newsfeed');
const rssFeedParser = require('../utils/rssFeedParser');

newsFeedsRouter.get('/', async (request, response) => {
    const token = request.token;
    const requester = await tokenmanager.verifyUser(token);

    if(requester === null || requester === undefined){
        return response.status(400).send('Invalid token');
    }

    const newsFeeds = await NewsFeed.find({});

    response.json(newsFeeds);
});

newsFeedsRouter.post('/', async (request, response) => {
    const body = request.body;
    const token = request.token;
    const requester = await tokenmanager.verifyUser(token);

    if(requester === null || requester === undefined){
        return response.status(400).send('Invalid token');
    }

    const foundNewsFeed = await NewsFeed.findOne({ link: body.link });

    if(foundNewsFeed !== null && foundNewsFeed !== undefined){
        return response.status(400).send('A news feed with this link already exists!');
    }

    const data = await rssFeedParser.getRssFeedJSON(body.link);

    if(data === null){
        return response.status(400).send('Invalid rss feed');
    }

    const newsFeed = new NewsFeed({
        name: data.rss.channel.title,
        link: body.link,
        language: data.rss.channel.language,
        description: data.rss.channel.description
    });

    const savedNewsFeed = await newsFeed.save();

    response.send(savedNewsFeed);
});

module.exports = newsFeedsRouter;