const feedBoardsRouter = require('express').Router();
const tokenmanager = require('../utils/tokenmanager');
const FeedBoard = require('../models/feedboard');
const mongoose = require('mongoose');

feedBoardsRouter.get('/', async (request, response ) => {
    const token = request.token;
    const requester = await tokenmanager.verifyUser(token);

    if(requester === null || requester === undefined){
        return response.status(400).send('Invalid token');
    }

    const feedBoards = await FeedBoard.find({ '_id': { $in: requester.boards.map(id => mongoose.Types.ObjectId(id)) } });

    response.json(feedBoards);
});

feedBoardsRouter.post('/', async (request, response ) => {
    const body = request.body;
    const token = request.token;
    const requester = await tokenmanager.verifyUser(token);

    if(requester === null || requester === undefined){
        return response.status(400).send('Invalid token');
    }

    const feedBoard = new FeedBoard({
        ...body,
        creator: requester.id,
        subscribers: [requester.id]
    });

    const savedFeedBoard = await feedBoard.save();

    response.json(savedFeedBoard);
});

module.exports = feedBoardsRouter;