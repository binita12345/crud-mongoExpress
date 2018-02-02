
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

var debug = require('debug')('myapp:LibDbIndex');

mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;

db.on('error', function (error) {
    debug('Error while connecting to mongodb database:', error);
  });
  
  db.once('open', function () {
    debug('Successfully connected to mongodb database');
  });
  
//   db.on('disconnected', function () {
//     //Reconnect on timeout
//     mongoose.connect('mongodb://localhost:27017/test');
//     db = mongoose.connection;
//   });