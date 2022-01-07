const requestLogger = (request, response, next) => {
    console.log(new Date().toString());
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
};

module.exports = requestLogger;