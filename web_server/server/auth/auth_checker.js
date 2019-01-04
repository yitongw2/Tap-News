const jwt = require('jsonwebtoken');
const firebase = require('../modules/firebase');

function authChecker(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  firebase.auth.verifyIdToken(token)
    .then(decodedToken => {
      return next();
    }).catch(error => {
      return res.status(401).end();
    });
}

module.exports = authChecker;
