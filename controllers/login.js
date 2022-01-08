const config = require('../utils/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findOne({ username: body.username });

    if(user === null){
        return response.status(401).send('Invalid username');
    }

    const passwordCorrect = bcrypt.compare(body.password, user.passwordHash);

    if(!passwordCorrect){
        return response.status(401).send('Invalid password');
    }

    const tokenData = {
        username: user.username,
        id: user.id
    };

    const token = jwt.sign(tokenData, config.TOKENSECRET);

    response.status(200).send({
        loginToken: token,
        username: user.username,
        name: user.name
    });
});

module.exports = loginRouter;