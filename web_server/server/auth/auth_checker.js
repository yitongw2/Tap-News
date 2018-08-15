const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const jwt_config = require('../config/jwt_config.json');

function authChecker(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  // decode the token using a secret key-phrase
  return jwt.verify(token, jwt_config.jwtSecret, (error, decoded) => {
    if (error) {
      return res.status(401).end();
    }

    const id = decoded.sub;
    return User.findById(id, (err, user) => {
      if (err || !user) {
        return res.status(401).end();
      }

      return next();
    });
  });
}

module.exports = authChecker;
