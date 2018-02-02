var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var APP_CONSTANTS = require('./constants/AppConstants');
var AppConfig = require('./lib/AppConfig');
var debug = require('debug')('myapp:AppFile');

var Locals = require('./routes/local');
var routeApi = require('./routes/index');

var cors = require('cors');
app.use(cors())

// router.use(cors);

//DB connection
require('./lib/db/index');

//Custom plugins, Don't remove it.
require('./lib/utils/lodash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Handle request
app.use(session({
  secret: APP_CONSTANTS.SESSION.KEY,
  saveUninitialized: false, // don't create session until something stored,
  resave: false // don't save session if unmodified
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// App Configs
app.use(AppConfig.trimParams);

app.use('/', Locals);
app.use('/api', routeApi);

// debug('app file');
// require('./models/bookModels');

// app.all('/*', function (req, res) {
//   // Just send the index.html for other files to support HTML5Mode
//   res.render('index');
// });


module.exports = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}
// Error handling
app.use(AppConfig.handleError);
// Handle response
app.use(AppConfig.handleSuccess);
// Handle response
app.use(AppConfig.handle404);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.redirect('/fail');
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
