var express = require('express');
var path = require('path');
var cors = require('cors');

var app = express();

// routers
var indexRouter = require('./routes/index');
var newsRouter = require('./routes/news');

// body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());

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
app.use('/', indexRouter);

// catch 404
app.use(function(req, res, next) {
  res.status(404);
});

module.exports = app;
