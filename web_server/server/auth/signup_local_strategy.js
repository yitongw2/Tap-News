const User = require('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password
  };
  // when store user data into mongodb,
  // mongodb will make sure that the user is unique since we define the email in UserSchema (user.js) which is unique.
  // if same email is already in mongodb, it returns error
  const newUser = new User(userData);
  newUser.save((err) => {
    console.log('Save new user!');
    if (err) {
      return done(err);
    }
    return done(null);
  });
});
