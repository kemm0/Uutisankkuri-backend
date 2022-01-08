const config = require('./config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const createJWT = async (tokenData) => {
    const token = jwt.sign(tokenData, config.TOKENSECRET);

    return token;
};

const verifyUser = async (token) => {
    if(token === null || token === undefined){
        return null;
    }
    let decodedToken = null;
    try{
        decodedToken = jwt.verify(token, config.TOKENSECRET);
    }
    catch(error){
        return null;
    }
    const requester = await User.findById(decodedToken.id);
    if(requester === null || requester === undefined){
        return null;
    }
    return requester;
};

module.exports = {
    createJWT,
    verifyUser
};