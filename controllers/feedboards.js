const feedBoardsRouter = require('express').Router();
const mongoose = require('mongoose');
const tokenmanager = require('../utils/tokenmanager');
const FeedBoard = require('../models/feedboard');
const User = require('../models/user');
const logger = require('../utils/logger');

feedBoardsRouter.get('/', async (request, response ) => {
    const token = request.token;
    const requester = await tokenmanager.verifyUser(token);

    if(requester === null || requester === undefined){
        return response.status(400).send('Invalid token');
    }

    const feedBoards = await FeedBoard.find({ '_id': { $in: requester.boards.map(id => mongoose.Types.ObjectId(id)) } });

    response.json(feedBoards);
});

feedBoardsRouter.get('/:id', async (request, response) => {
    const token = request.token;
    const requester = await tokenmanager.verifyUser(token);

    if(requester === null || requester === undefined){
        return response.status(400).send('Invalid token');
    }

    const feedBoard = await FeedBoard.findOne({ '_id': mongoose.Types.ObjectId(request.params.id) });

    if(feedBoard === null || feedBoard === undefined){
        return response.status(400).send('Invalid id');
    }

    if(feedBoard.creator !== requester.id && feedBoard.public !== true){
        return response.status(400).send('Invalid access rights');
    }

    response.json(feedBoard);
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

    requester.boards.push(savedFeedBoard.id);

    logger.info(requester);

    await requester.save();

    response.json(savedFeedBoard);
});

feedBoardsRouter.put('/:id', async ( request, response ) => {
    const body = request.body;
    const token = request.token;
    const requester = await tokenmanager.verifyUser(token);

    if(requester === null || requester === undefined){
        return response.status(400).send('Invalid token');
    }

    const feedBoard = await FeedBoard.findOne({ '_id': mongoose.Types.ObjectId(request.params.id) });

    if(feedBoard === null || feedBoard === undefined){
        return response.status(400).send('Invalid id');
    }

    if(feedBoard.creator !== requester.id && feedBoard.public !== true){
        return response.status(400).send('Invalid access rights');
    }

    const updatedFeedBoard = {
        ...body,
        subscribers: feedBoard.subscribers,
        creator: feedBoard.creator
    };


    response.json(await FeedBoard.findByIdAndUpdate({ '_id': request.params.id }, updatedFeedBoard, { new: true }));
});

feedBoardsRouter.delete('/:id', async ( request, response ) => {
    const token = request.token;
    const requester = await tokenmanager.verifyUser(token);

    if(requester === null || requester === undefined){
        return response.status(400).send('Invalid token');
    }

    const feedBoard = await FeedBoard.findOne({ '_id': mongoose.Types.ObjectId(request.params.id) });

    if(feedBoard === null || feedBoard === undefined){
        return response.status(400).send('Invalid id');
    }

    if(feedBoard.creator !== requester.id && feedBoard.public !== true){
        return response.status(400).send('Invalid access rights');
    }

    requester.boards = requester.boards.filter((boardID) => {
        return boardID !== feedBoard.id;
    });

    await requester.save();

    await FeedBoard.findOneAndDelete({ '_id': mongoose.Types.ObjectId(request.params.id) });
    response.status(203).send('feedboard deleted');
});

module.exports = feedBoardsRouter;