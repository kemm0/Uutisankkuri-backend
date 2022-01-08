const config = require('../utils/config');
const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

usersRouter.post('/', async (request, response, next) => {
    const body = request.body;

    const saltRounds = 10;
    if(body.password.length < 8){
        response.status(400).send('Error: Password too short');
    }
    else{
        const passwordHash = await bcrypt.hash(body.password, saltRounds);

        const user = new User({
            ...body,
            passwordHash: passwordHash
        });
        try{
            const savedUser = await user.save();
            response.json(savedUser);
        }
        catch(error){
            next(error);
        }
    }
});

usersRouter.get('/', async (request, response, next) => {
    const token = request.token;
    console.log(token);
    if(token === null || token === undefined){
        return response.status(400).send('Invalid token');
    }
    try{
        const decodedToken = jwt.verify(token, config.TOKENSECRET);
        const requester = await User.findById(decodedToken.id);
        if(requester === null ||requester === undefined){
            return response.status(400).send('Invalid token');
        }
        const users = await User.find({});
        response.json(users);
    }
    catch(error){
        next(error);
    }
});

module.exports = usersRouter;