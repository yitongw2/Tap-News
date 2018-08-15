const jwt = require('jsonwebtoken');
const User = require('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;
const jwt_config = require('../config/jwt_config.json');

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password
  };

  // find a user by email address
  return User.findOne({ email: userData.email }, (err, user) => {
    if (err) {
      console.log('general error');
      return done(err);
    }
    console.log(user);
    if (!user) {
      console.log('incorrect email or password');
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(userData.password, (err, isMatch) => {
      if (err) {
        console.log('unknown error');
        return done(err);
      }

      if (!isMatch) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      const payload = {
        sub: user._id
      };

      // create a token string
      const token = jwt.sign(payload, jwt_config.jwtSecret, {
        expiresIn: jwt_config.expiresIn
      });

      const expiresAt = Date.now() + jwt_config.expiresIn * 1000;
      return done(null, token, expiresAt, null);
    });
  });
});
