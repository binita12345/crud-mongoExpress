'use strict';
var _ = require('lodash');

//var PROCESS_ENV = process.env;

if (typeof String.prototype.startsWith !== 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0;
  };
}

exports.url = function (req) {
  return req.protocol + '://' + req.get('host');
};

exports.capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.getRandomItem = function (items) {
  return items[Math.floor(Math.random() * items.length)];
};

exports.sortAsc = function (object, property) {
  var sortedArray = _.sortBy(object, function (obj) {
    if (!isNaN(obj[property])) {
      return obj[property];
    }
    return obj[property].charCodeAt() * 1;
  });
  return sortedArray;
};

exports.sortDesc = function (object, property) {
  var sortedArray = _.sortBy(object, function (obj) {
    if (!isNaN(obj[property])) {
      return obj[property];
    }
    return obj[property].charCodeAt() * -1;
  });
  return sortedArray;
};

var baseUrl = '';
exports.setBaseUrl = function (req) {
  /*console.log('setBaseUrl');*/
  baseUrl = exports.url(req);
};

exports.getBaseUrl = function () {
  return baseUrl;
};

exports.parseError = function (err) {
  var errorString = '';
  if (err.errors) {
    for (var key in err.errors) {
      if (err.errors[key].message) {
        if (err.errors[key].path) {
          errorString += err.errors[key].message.replace('`{PATH}`', err.errors[key].path) + ' ';
        } else {
          errorString += err.errors[key].message + ' ';
        }
      }
    }
    errorString = JSON.stringify(errorString);
  } else {
    errorString = JSON.stringify(err.message);
  }
  return errorString;
};