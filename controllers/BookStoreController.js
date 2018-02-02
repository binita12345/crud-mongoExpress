
var Boom = require('boom');
var _ = require('lodash');
var debug = require('debug')('myapp:BookStoreController');

exports.addBookStoreData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to add book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.getAllBooksData=function(req,res,next){
  var bookStore = req.session.bookStore;
  if ( _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Book not found!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.getAllCategoryData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Book not found!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.multiSelectCategoryData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Book not found!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.findOneBooksData = function(req, res, next){
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Book not found!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.deleteBookData = function (req, res, next) {
  // debug('delete controller', req.session.bookStore);
  var bookStore = req.session.bookStore;
  // debug('delete bookStore', bookStore);
  if (_.isEmpty(bookStore)) {
    // debug('in delete bookStore');
    return next(new Boom.notFound('Failed to delete book!'));
  }
  req.session.result = {success: true, text: 'Delete successful!'};
  return next();
};

exports.deleteByBookIDData = function (req, res, next) {

  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore)) {
    return next(new Boom.notFound('Failed to delete book!'));
  }
  req.session.result = {success: true, text: 'Delete successful!'};
  return next();
};

exports.deleteWithORBookData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore)) {
    return next(new Boom.notFound('Failed to delete book!'));
  }
  req.session.result = {success: true, text: 'Delete successful!'};
  return next();
};

exports.updateBookIdData = function(req, res, next){
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to update book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.updateBookSearchIdData = function(req, res, next){
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to update book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.updateBookNameData = function(req, res, next){
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to update book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.updateNameNAuthorData = function(req, res, next){
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to update book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.getAllForTableBook = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isUndefined(bookStore)) {
    req.session.result = [];
    return next();
  }
  req.session.result = bookStore;
  return next();
};

exports.findBookData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to find book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.findORBookData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to find book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.findBookPageNoData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to find book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.findBookBWPagesData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to find book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.findBookNEPagesData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to find book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.findZeroPagesData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to find book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.findBookYear = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to find book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.sortBookNameData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to sort book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.sortBookPriceData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to sort book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.sortBookAuthorData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to sort book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.sortBookPagesNoData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to sort book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.sortBookCategoryData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to sort book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.sortBookReleaseData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to sort book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.findNameByPriceData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to sort book!'));
  }
  req.session.result = bookStore;
  return next();
};

exports.findNameWithHLData = function (req, res, next) {
  var bookStore = req.session.bookStore;
  if (_.isEmpty(bookStore) || _.isUndefined(bookStore)) {
    return next(new Boom.notFound('Failed to sort book!'));
  }
  req.session.result = bookStore;
  return next();
};