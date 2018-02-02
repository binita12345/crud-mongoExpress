var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');
var debug = require('debug')('myapp:BookStoreModel');
var APP_CONSTANTS = require('../constants/AppConstants');
var Boom = require('boom');
var _ = require('lodash');

// var bookidV = [
//   validate({
//     validator: 'isLength',
//     arguments: [1, 40],
//     message: 'The Bookid should be between {ARGS[0]} and {ARGS[1]} numbers'
//   })
// ];

var valBookName = [
  validate({
    validator: 'isLength',
    arguments: [2, 20],
    message: 'Book Name should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

var valBookCategory = [
  validate({
    validator: 'isLength',
    arguments: [2, 40],
    message: 'Book Category should be between {ARGS[0]} and {ARGS[1]} characters'
  })
]

var bookStoreSchema = new Schema({
    bookId: {
      index: {
        unique: true
      },
      required: false,
      type: Number,
      // default: 1
      // validate: bookidV
    },
    bookName: {
      index: {
        unique: true
      },
      type: String,
      required: true,
      validate: valBookName
    },
    bookAuthor: {
      type: String,
      required: false
    },
    bookDescription: {
      type: String,
      required: false
    },
    bookPageNo: {
      type: Number,
      required: true,
      default: 0
    },
    bookCategory: {
      // index: {
      //   unique: true,
      //   // dropDups:true
      // },
      type: String,
      required: true,
      // validate: valBookCategory
    },
    bookPrice: {
      type: Number, 
      required: false
    },
    bookReleasedYear: {
      type: Number, 
      required: true
    },
    bookLanguage: {
      type: String,
      required: false
    }
});

bookStoreSchema.index(
  {
      _id: 1,
      bookId: 1,
      bookName: 1,
      bookAuthor: 1,
      bookDescription: 1,
      bookPageNo: 1,
      bookCategory: 1,
      bookPrice: 1,
      bookReleasedYear: 1,
      bookLanguage: 1
  }
);
// bookModel.ensureIndex( { bookCategory:1 }, { unique:true, dropDups:true });

var bookModel = mongoose.model(APP_CONSTANTS.TABLES.BOOKS, bookStoreSchema);

// make this available to our users in our Node applications

exports.findOneByFilter = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.badRequest('Invalid search details!'));
  } else if (_.isEmpty(data.filter)) {
    return callback(new Boom.badRequest('Invalid filter!'));
  }
  bookModel.findOne(data.filter).then(function (result) {
    return callback(null, result);
  }).catch(function (error) {
    return callback(error);
  });
};

exports.insert = function (data, callback) {
  if (_.isEmpty(data)) {
    debug('add book data', data);
    return callback(new Boom.notFound('Invalid book!'));
  }
  var newBook = data.newBook;
  if (_.isEmpty(newBook)) {
    return callback(new Boom.badRequest('Invalid book detail!'));
  }
  var book = new bookModel(newBook);
  book.save(function (error, result) {
    return callback(error, result);
  });
};

exports.deleteBy = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.badRequest('Invalid book!'));
  } else if (_.isEmpty(data)) {
    return callback(new Boom.badRequest('Invalid book id!'));
  } 
  bookModel.remove(data).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.badRequest('Book not found!'));
    }
    return callback(null, result);
  }).catch(function (error) {
    return callback(error);
  });
};

exports.deleteBybookkId = function (data, callback) {
  debug('delete book by id model');
  if (_.isEmpty(data)) {
    return callback(new Boom.badRequest('Invalid book!'));
  } else if (_.isNaN(data.filter)) {
    return callback(new Boom.badRequest('Invalid book id!'));
  } 
  bookModel.findOneAndRemove(data.filter).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.badRequest('Book not found!'));
    }
    return callback(null, result);
  }).catch(function (error) {
    return callback(error);
  });
};

exports.deleteByFilter = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.badRequest('Invalid book!'));
  } 

  bookModel.remove(data).then(function (result) {
    if (_.isEmpty(result)) {
      return callback(new Boom.badRequest('Book not found!'));
    }
    return callback(null, result);
  }).catch(function (error) {
    return callback(error);
  });
};

exports.findOneAndUpdateByFilter = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid book!'));
  }
  // if(!_.isNaN(data.filter.bookId)) {
    bookModel.findOneAndUpdate(data.filter, data.updatedData, data.options).then(function (result) {
      if (_.isEmpty(result)) {
        return callback(new Boom.badRequest('Book not found!'));
      }
      return callback(null, result);
    }).catch(function (error) {
      return callback(error);
    });
  // }
};

// exports.updateByFilter = function (data, callback) {
//   if (_.isEmpty(data)) {
//     return callback(new Boom.notFound('Invalid Books!'));
//   }
//   bookModel.update(data.filter, data.updatedData, data.options).then(function (result) {
//     if (_.isEmpty(result)) {
//       return callback(new Boom.badRequest('Books not found!'));
//     }
//     return callback(null, result);
//   }).catch(function (error) {
//     return callback(error);
//   });
// };

// filter by distinct
exports.distinctFilter = function (data, callback) {
  debug('distinctFilter', data);
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid book!'));
  }

  bookModel.distinct(data).then(function (result) {
    debug('result model', result);
    return callback(null, result);
  }).catch(function (error){
    return callback(error);
  });

};

exports.findAllByFilter = function (data, callback) {
  // debug('select dropdwn filter', data.filter);
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid book!'));
  }
  var bookModelQuery = bookModel.find(data.filter);
  // debug('bookModelQuery', bookModelQuery);
  if (!_.isEmpty(data.sort) && data.sort !== undefined) {
    bookModelQuery.sort(data.sort);
    // debug('bookModelQuery sort', bookModelQuery);
  }
  // if (!_.isEmpty(data.distinct) && data.distinct !== undefined) {
  //   bookModelQuery.distinct(data.distinct);
  //   debug('bookModelQuery distinct', bookModelQuery);
  // }
  if (data.skip !== null && data.skip !== undefined) {
    bookModelQuery.skip(data.skip);
  }
  if (data.limit !== null && data.limit !== undefined) {
    bookModelQuery.limit(data.limit);
  }
  // debug('data.select', data.select);
  if (!_.isEmpty(data.select) && data.select !== undefined) {
    bookModelQuery._fields = data.select;
    // debug('bookModelQuery...........', bookModelQuery);
  }
  bookModelQuery.then(function (result) {
    // debug('select dropdwn filter serch result', result);
    return callback(null, result);
  }).catch(function (error) {
    return callback(error);
  });
};

exports.countByFilter = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid book!'));
  }
  bookModel.find(data.filter).count().then(function (result) {
    return callback(null, result);
  }).catch(function (error) {
    return callback(error);
  });
};

exports.findByFilter = function (data, callback) {
  if (_.isEmpty(data)) {
    return callback(new Boom.notFound('Invalid book!'));
  }
  bookModel.find(data).then(function (result) {
    return callback(null, result);
  }).catch(function (error) {
    return callback(error);
  });
};
