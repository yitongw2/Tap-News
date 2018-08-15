var express = require('express');
var path = require('path');
var cors = require('cors');

var app = express();

// routers
var indexRouter = require('./routes/index');
var newsRouter = require('./routes/news');
var usersRouter = require('./routes/users');

const mongoose = require('mongoose');
const db_config = require('./config/mongodb_config.json');
mongoose.connect(`mongodb://${db_config.DBUser}:${db_config.DBPassword}@${db_config.DBHost}:${db_config.DBPort}/${db_config.DBName}`,
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log('DB connection failed');
    } else {
      console.log('DB connection succeeded');
    }
  }
);

// body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// passport
var passport = require('passport');
app.use(passport.initialize());
passport.use('local-signup', require('./auth/signup_local_strategy'));
passport.use('local-login', require('./auth/login_local_strategy'));

// auth checker
var authChecker = require('./auth/auth_checker');

// view engine setup
app.set('views', path.join(__dirname, '../client/build'));
app.set('view engine', 'jade');
app.use('/static', express.static(path.join(__dirname, '../client/build/static')));

// enable Cross-origin resource sharing
app.use(cors());

// use routers
app.use('/news', authChecker, newsRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

// catch 404
app.use(function(req, res, next) {
  res.status(404);
});

module.exports = app;
