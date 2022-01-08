const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const tokenmanager = require('../utils/tokenmanager');

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

usersRouter.get('/', async (request, response) => {
    const token = request.token;
    const requester = await tokenmanager.verifyUser(token);

    if(requester === null || requester === undefined){
        return response.status(400).send('Invalid token');
    }
    const users = await User.find({});
    response.json(users);
});

module.exports = usersRouter;