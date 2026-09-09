const jwt = require('jsonwebtoken');
const logger = require('./logger');

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({
      error: 'expected `username` to be unique'
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: error.message
    });
  }
  next(error);
}

const tokenExtractor = (request, response, next) => {

  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  }
  next();
}

const userExtractor = (request, response, next) => {

  const userFromToken = jwt.verify(request.token, process.env.SECRET);
  if (userFromToken) {
    request.user = userFromToken;
  }
  next();
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}