
var Boom = require('boom');
var mongoose = require('mongoose');
var debug = require('debug')('myapp:BookStoreService');
var _ = require('lodash');
var async = require('async');
var bookModel = require('../models/bookModels');
var APP_CONSTANTS = require('../constants/AppConstants');

/* make API to get All data in table */
exports.getAllForTable = function (req, res, next) {
  debug('Inside getAllForTable service.');
  
  var responseData = {
    recordsTotal: 0,
    recordsFiltered: 0,
    data: []
  };

  try {
    var params = req.body;
    debug('table params', params);
    var queryFilter = {
      limit: APP_CONSTANTS.TABLESETTING.LIMIT,
      offset: APP_CONSTANTS.TABLESETTING.SKIP
    };
    var queryOrderBy = {
      bookName: 1,
    };
    var bookStore = [];
    var query = {};

    if (!_.isEmpty(params)) {
      debug('params.filter', params.filter);
      if(!_.isEmpty(params.filter)) {
        // debug('params.filter.bookReleasedYear', params.filter.bookReleasedYear);
        var minP = params.filter.minPrice;
        var maxP = params.filter.maxPrice;
       
        var search2 = {
          filter: {bookPrice: {$lte: maxP}}
        }
        var search3 = {
          filter :{bookPrice: {$gte: minP}}
        }
        var search4 = {
          filter :{bookPrice: {$gte: minP, $lte: maxP}}
        }
        if(!_.isUndefined(params.filter.minPrice) && !_.isUndefined(params.filter.maxPrice)) {
          if(search4.filter) {
            query = search4.filter;
          }
        } else if(search3.filter && _.isUndefined(params.filter.maxPrice)) {
          query = search3.filter;
        } else if(search2.filter && _.isUndefined(params.filter.minPrice)) {
          query = search2.filter;
        }

        if(!_.isUndefined(params.filter.bookReleasedYear)) {
          query = params.filter;
        }
        // debug('params.filter.bookCategory', params.filter.bookCategory);

        
        if(!_.isUndefined(params.filter.bookCategory)) {
          var multiCat = {
            filter : {bookCategory: {$in : params.filter.bookCategory}}
          }
          // debug('qmultiCat', multiCat.filter);
          if(multiCat) {
            query = multiCat.filter;
         
          }
        }

      }
      // display length query
      if (!isNaN(params.limit) && params.limit !== '') {
        queryFilter.limit = params.limit;
      }
      if (!isNaN(params.offset) && params.offset !== '') {
        queryFilter.offset = params.offset;
      }

      if (!_.isEmpty(params.order)) {
        // debug('order sort', params.order);
        queryOrderBy = {};
        switch (params.order.column) {
          case 0:
            queryOrderBy.bookId = params.order.dir === 'asc' ? 1 : -1;
            break;
          case 1:
            queryOrderBy.bookName = params.order.dir === 'asc' ? 1 : -1;
            break;
          case 2:
            queryOrderBy.bookAuthor = params.order.dir === 'asc' ? 1 : -1;
            break;
          case 3:
            queryOrderBy.bookDescription = params.order.dir === 'asc' ? 1 : -1;
            break;
          case 4:
            queryOrderBy.bookPageNo = params.order.dir === 'asc' ? 1 : -1;
            break;
          case 5:
            queryOrderBy.bookCategory = params.order.dir === 'asc' ? 1 : -1;
            break;
          case 6:
            queryOrderBy.bookPrice = params.order.dir === 'asc' ? 1 : -1;
            break;
          case 7:
            queryOrderBy.bookReleasedYear = params.order.dir === 'asc' ? 1 : -1;
            break;
          case 8:
            queryOrderBy.bookLanguage = params.order.dir === 'asc' ? 1 : -1;
            break;
          default:
            queryOrderBy.bookName = 1;
            break;
        }
      }

    }
    //Database query
    async.series({
      findBooks: function (innerCallback) {
        bookModel.findAllByFilter({
          filter: query,
          limit: queryFilter.limit,
          skip: queryFilter.offset,
          sort: queryOrderBy
        }, function (error, result) {
          debug('result table ', result);
          if (!_.isEmpty(error)) {
            return innerCallback(error);
          }
          bookStore = result;
          return innerCallback();
        });
      },
      ProcessDatatableFilterResponse: function (callback) {
        //Datatable Search filter
        var filteredData = {};
        if (!_.isEmpty(params.search)) {
          var regExp = new RegExp(params.search, 'i');
          filteredData = _.filter(bookStore, function (obj) {
            // debug('search data', obj);
            return String(obj.bookName).match(regExp) || String(obj.bookAuthor).match(regExp) || String(obj.bookDescription).match(regExp) || String(obj.bookPageNo).match(regExp) || String(obj.bookCategory).match(regExp) || String(obj.bookPrice).match(regExp) || String(obj.bookReleasedYear).match(regExp);
          });
        } else {
          filteredData = bookStore;
        }
        responseData.data = filteredData;
        return callback();
      },
      
      filterRecordCount: function (innerCallback) {
        bookModel.countByFilter({filter: query}, function (error, count) {
          if (!_.isEmpty(error)) {
            return innerCallback(error);
          }
          responseData.recordsFiltered = count;
          return innerCallback();
        });
      },
      totalRecordCount: function (innerCallback) {
        bookModel.countByFilter({filter: {}}, function (error, count) {
          if (!_.isEmpty(error)) {
            return innerCallback(error);
          }
          responseData.recordsTotal = count;
          return innerCallback();
        });
      }
    }, function (error) {
      if (!_.isEmpty(error)) {
        return next(error);
      }
      req.session.bookStore = responseData;
      return next();
    });
  } catch (error) {
    return next(error);
  }

};

/* make API to validate all fields of BookStore */
exports.validateAddBook = function (req, res, next) {
    debug('Inside validateAddBook service called.');
    var params = req.body;
    if (_.isEmpty(params)) {
      return next(new Boom.badRequest('Invalid Book!'), null);
    } else if (_.isEmpty(params.bookName)) {
      return next(new Boom.badRequest('Invalid name!'), null);
    } else if (_.isEmpty(params.bookCategory)) {
      return next(new Boom.badRequest('Invalid category!'), null);
    }
    var filter = {
        bookName: params.bookName,
    };
    /*Add message weather given Book Name exits or not */
    bookModel.findOneByFilter({filter: filter}, function (error, result) {
      if (!_.isEmpty(error)) {
        return next(new Boom.notFound(error));
      } else if (!_.isEmpty(result)) {
        return next(new Boom.conflict('Book already exist!'));
      }
      return next();
    });
};

/*Add new Book. */
/* make API to add book in BookStore */
exports.addBookStores = function(req, res, next) {
    debug('Inside addBook service called.');
    var params = req.body;
    var bookID = 0;
    try {
      async.series({   
        /*Book Id (Auto-Increment) */ 
        lastBookId: function (innerCallback) {
          var select = {
            bookId: 1
          };
          var sort = {
            bookId: -1
          };
          var limit = 1;
          bookModel.findAllByFilter({
            filter: {},
            select: select,
            sort: sort,
            limit: limit
          }, function (error, result) {
            if (!_.isEmpty(error)) {
              return innerCallback(error);
            }
            if(_.isEmpty(result)) {
              var getResult = 0;
              bookID = getResult;
            } else {
              bookID =  parseInt(result[0].bookId);
            }
            return innerCallback();
          });
        },
        /*Add new book, having extra field of "Book Language" = Add Book With Language */
        additionBookStore: function (callback) {
          bookID = bookID + 1;
          var newBook = {
            bookId: bookID,
            bookName : params.bookName,
            bookAuthor : params.bookAuthor,
            bookDescription : params.bookDescription,
            bookCategory : params.bookCategory,
            bookPrice : params.bookPrice,
            bookReleasedYear : params.bookReleasedYear,
            bookPageNo : params.bookPageNo,
            bookLanguage: params.bookLanguage
          }
          bookModel.insert({newBook: newBook}, function (error, result) {
            if (!_.isEmpty(error)) {
                return next(new Boom.notFound(error));
            } else if (!_.isEmpty(result)) {
                req.session.bookStore = result;
            }
            return next();
          });
        }
      }, function (error) {
        if (!_.isEmpty(error)) {
          return callback(error);
        }
        return callback();
      });
    } catch (error) {
      return next(error);
    }
};

/*Show details of all books. */
/* make API to get All data by null filter */
exports.getAll = function (req, res, next) {
    debug('Inside getAll service.');
    // var select = {
    //   bookCategory: 1,
    //   bookPrice: 1,
    //   bookReleasedYear: 1
    // };
    bookModel.findAllByFilter({filter: {}}, function (error, result) {
      debug('all books.....', result);
      if (!_.isEmpty(error)) {
        return next(error);
      }
      req.session.bookStore = result;
      return next();
    });
};

/*Show Book by Book Id. */
/* make API to get particular one book by book Id */
exports.findOneBook = function (req, res, next) {
    debug('Inside findOneBook service.');
    var params = req.body;
    if (_.isEmpty(params)) {
      return next(new Boom.badRequest('Invalid book!'), null);
    } else if (_.isNaN(params.bookId)) {
      return next(new Boom.badRequest('Invalid id!'), null);
    }
    var queryData = {
      filter: {bookId: params.bookId}
    };
    bookModel.findOneByFilter(queryData, function (error, result) {
      if (!_.isEmpty(error)) {
        return next(error);
      }
      req.session.bookStore = result;
      return next();
    });
};

/* make API to delete particular one or all book */
exports.deleteBook = function (req, res, next) {
    debug('Inside deleteBy service.');
    var params = req.body;
    var query = {};
    var delete1= {bookName:params.bookName};

    var delete2= {
      bookAuthor: params.bookAuthor, 
      bookDescription: params.bookDescription
    };
    // query["$and"] = []
    // var firstOr = []

    if (!_.isEmpty(params.bookName)) {
      debug('delete by book name');
      query.bookName = params.bookName;
      /*Delete Book by Book Name. */
      // debug('delete by book name');
      // firstOr.push({bookName: params.bookName});
      // // debug('delete by book name...1', firstOr);
      // query["$and"].push({"$or": firstOr})
      // debug('delete by book name...2', query);

    } else if (!_.isEmpty(params.bookAuthor) && !_.isEmpty(params.bookDescription)) {
      debug('delete by book author n desc');
      var query1 = [];
      query1.bookAuthor.push(params.bookAuthor);
      query1.bookDescription.push(params.bookDescription);
      query['$and'] = query1;
      /*Delete Book by Book Author and Book Desc. */
      // debug('delete by book author n desc');
      // firstOr.push({bookAuthor: params.bookAuthor, bookDescription: params.bookDescription});
      // query["$and"].push({"$or": firstOr})
      // debug('delete by book author n desc...1', query);

    } else if (!_.isEmpty(params.bookName) && !_.isEmpty(params.bookCategory)) {
      debug('delete by book name n cat');
      var query2 = [];
      query2.bookName.push(params.bookName);
      query2.bookCategory.push(params.bookCategory);
      query['$and'] = query2;
      /*Delete Book by Book Name and Book Category. */
      // debug('delete by book name n cat');
      // firstOr.push({bookName: params.bookName, bookCategory: params.bookCategory});
      // query["$and"].push({"$or": firstOr})
      // debug('delete by book name n cat...1', query);
  
    }  else {
      debug('delete by book exists');
      var query3 = [];
      query3.bookId.push(params.bookId);
      query3.bookLanguage.push({$exists: true});
      query['$and'] = query3;
      /*Delete book by Id, having extra field of "Book Language" */
      // debug('delete by book exists');
      // firstOr.push({bookId:params.bookId ,bookLanguage :{$exists: true}});
      // query["$and"].push({"$or": firstOr})
      // debug('delete by book exists...1', query);

    }
    bookModel.deleteBy(query, function (error, response) {
      debug('delete error' , error);
      debug('delete response', response);
      if (!_.isEmpty(error)) {
        return next(error);
      } 
      req.session.bookStore = response;
      return next();
    });
};

/* Delete Book by Book Id. */
/* make API to delete particular one or all book by book Id */
exports.deleteByBookID = function (req, res, next) {
  debug('Inside deleteByBookID service.');
  var params = req.body;
  // debug('params....', params);
  if (_.isNaN(params.bookId)) {
    return next(new Boom.badRequest('Invalid book id!'), null);
  } 

    var filterById = {
      filter: {bookId: params.bookId}
    };
    bookModel.deleteBybookkId(filterById, function (error, response) {
      // debug('delete by id', response);
      if (!_.isEmpty(error)) {
        return next(error);
      }
      req.session.bookStore = response;
      return next();
    });
};

/* make API to delete all by book OR */
exports.deleteWithORBook = function (req, res, next) {
  debug('Inside deleteBy service.');
  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.badRequest('Invalid book!'), null);
  } 
  if (!_.isEmpty(params.bookAuthor) && !_.isEmpty(params.bookDescription)) {
    /* Delete Book by Book Author OR Book Desc. */
    bookModel.deleteByFilter({ $or: [ { bookAuthor: params.bookAuthor }, { bookDescription: params.bookDescription } ] }, function (error, response) {
      if (!_.isEmpty(error)) {
        return next(error);
      }
      req.session.bookStore = response;
      return next();
    });
  } else if (!_.isEmpty(params.bookName) && !_.isEmpty(params.bookCategory)) {
    /*Delete Book by Book Name OR Book Category. */
    bookModel.deleteByFilter({ $or: [ { bookName: params.bookName }, { bookCategory: params.bookCategory } ] }, function (error, response) {
      if (!_.isEmpty(error)) {
        return next(error);
      }
      req.session.bookStore = response;
      return next();
    });
  }
};

/*Update Book by Book Id. */
/* make API to update particular one book by book Id */
exports.updateBookById = function (req, res, next) {
    debug('Inside updateBook service called.');
    var params = req.body;
    if (_.isEmpty(params)) {
      return next(new Boom.badRequest('Invalid book!'), null);
    } else if (_.isNaN(params.bookId)) {
      return next(new Boom.badRequest('Invalid book id!'), null);
    }
    async.series({
      
        updateBookById: function (callback) {    
            var set = {
              bookId: params.bookId,
              bookName: params.bookName,
              bookAuthor: params.bookAuthor,
              bookDescription: params.bookDescription,
              bookPageNo: params.bookPageNo,
              bookCategory: params.bookCategory,
              bookPrice: params.bookPrice,
              bookReleasedYear: params.bookReleasedYear
            };
            set = _.compactObject(set);    
            _.each(params, function (value, key) {
                if (value === 'null') {
                    set[key] = '';
                }
            });
            var filter = {bookId: params.bookId};
            var updatedData = {$set: set};
            var options = {new: true, runValidators: true};
              bookModel.findOneAndUpdateByFilter({
                filter: filter,
                updatedData: updatedData,
                options: options
                }, function (error, result) {
                  if (!_.isEmpty(error)) {
                      return callback(error);
                  }
                  req.session.bookStore = result;
                  return callback();
              });
        }
    }, function (error) {
      if (!_.isEmpty(error)) {
        return next(error);
      }
      return next();
    });
};

/*Update book by Id, having extra field of "Book Language"  */
/* make API to update book by search exists */
exports.updateBookBySearchId = function (req, res, next) {
  debug('Inside updateBook service called.');
  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.badRequest('Invalid book!'), null);
  }
  async.series({
      updateBookById: function (callback) {
          var set = {
            bookId: params.bookId,
            bookName: params.bookName,
            bookAuthor: params.bookAuthor,
            bookDescription: params.bookDescription,
            bookPageNo: params.bookPageNo,
            bookCategory: params.bookCategory,
            bookPrice: params.bookPrice,
            bookReleasedYear: params.bookReleasedYear,
            bookLanguage: params.bookLanguage
          };
          set = _.compactObject(set);    
          _.each(params, function (value, key) {
              if (value === 'null') {
                  set[key] = '';
              }
          });
          var filter = {bookId: params.bookId, bookLanguage: {$exists: true}};
          var updatedData = {$set: set};
          var options = {new: true, runValidators: true};
            bookModel.findOneAndUpdateByFilter({
              filter: filter,
              updatedData: updatedData,
              options: options
              }, function (error, result) {
                if (!_.isEmpty(error)) {
                    return callback(error);
                }
                req.session.bookStore = result;
                return callback();
            });
      }
  }, function (error) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    return next();
  });
};

/*Update Book by Book Name */
/* make API to update particular one book by book Name */
exports.updateBookByName = function (req, res, next) {
  debug('Inside updateBook name service called.');
  var params = req.body; 
  if (_.isEmpty(params)) {
    return next(new Boom.badRequest('Invalid book!'), null);
  } else if (_.isEmpty(params.bookName)) {
    return next(new Boom.badRequest('Invalid book name!'), null);
  }
  async.series({
      updateBookByName: function (callback) {
          var set = {
            bookId: params.bookId,
            bookName: params.bookName,
            bookAuthor: params.bookAuthor,
            bookDescription: params.bookDescription,
            bookPageNo: params.bookPageNo,
            bookCategory: params.bookCategory,
            bookPrice: params.bookPrice,
            bookReleasedYear: params.bookReleasedYear
          };
          set = _.compactObject(set);
          _.each(params, function (value, key) {
              if (value === 'null') {
                  set[key] = '';
              }
          }); 
          var filter = {bookName: params.bookName};
          var updatedData = {$set: set};
          var options = {new: true,upsert: true, multi: true, runValidators: true};
            bookModel.findOneAndUpdateByFilter({
              filter: filter,
              updatedData: updatedData,
              options: options
              }, function (error, result) {
                if (!_.isEmpty(error)) {
                    return callback(error);
                }
                req.session.bookStore = result;
                return callback();
            });
      }
  }, function (error) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    return next();
  });
};

/*Update Book by Book Author and Book Name. */
/* make API to update particular one book by book Name */
exports.updateByNameNAuthor = function (req, res, next) {
  debug('Inside updateBook name service called.');
  var params = req.body;
  if (_.isEmpty(params)) {
    return next(new Boom.badRequest('Invalid book!'), null);
  } else if (_.isEmpty(params.bookName)) {
    return next(new Boom.badRequest('Invalid book name!'), null);
  } else if (_.isEmpty(params.bookAuthor)) {
    return next(new Boom.badRequest('Invalid book author!'), null);
  }
  async.series({
      updateBookByNameAuthor: function (callback) {  
          var set = {
            bookId: params.bookId,
            bookName: params.bookName,
            bookAuthor: params.bookAuthor,
            bookDescription: params.bookDescription,
            bookPageNo: params.bookPageNo,
            bookCategory: params.bookCategory,
            bookPrice: params.bookPrice,
            bookReleasedYear: params.bookReleasedYear
          };
          set = _.compactObject(set);
          _.each(params, function (value, key) {
              if (value === 'null') {
                  set[key] = '';
              }
          }); 
          var filter = {bookName: params.bookName, bookAuthor: params.bookAuthor};
          var updatedData = {$set: set};
          var options = {new: true,upsert: true, multi: true, runValidators: true};
            bookModel.findOneAndUpdateByFilter({
              filter: filter,
              updatedData: updatedData,
              options: options
              }, function (error, result) {
                if (!_.isEmpty(error)) {
                    return callback(error);
                }
                req.session.bookStore = result;
                return callback();
            });
      }
  }, function (error) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    return next();
  });
};

/* make API to show book by particular filter */
exports.findBook = function (req, res, next) {
  debug('find books');
  var params = req.body;
  var queryName = {
    filter: {bookName: params.bookName}
  };

  if(_.isEmpty(params.bookName)) {
    /*Show books that have field of "Book Language" */
    bookModel.findByFilter({bookLanguage :{$exists: true}}, function (error, result) {
      if (!_.isEmpty(error)) {
        return next(error);
      }
      req.session.bookStore = result;
      return next();
    });
  }
  if(!_.isEmpty(params.bookName) && _.isEmpty(params.bookAuthor)) {
    /*Show Book by Book Name */
    bookModel.findAllByFilter(queryName, function (error, result) {
      if (!_.isEmpty(error)) {
        return next(error);
      }
      req.session.bookStore = result;
      return next();
    });
  }
  if(!_.isEmpty(params.bookName) && !_.isEmpty(params.bookAuthor)) {
    /*Show Book by Book Author and Book Name.*/
    bookModel.findByFilter({ $and: [ { bookName: params.bookName }, { bookAuthor: params.bookAuthor } ] }, function (error, result) {
      if (!_.isEmpty(error)) {
        return next(error);
      }
      req.session.bookStore = result;
      return next();
    });
  }
};

/* make API to show book by particular filter By OR operator */
exports.findORBook = function (req, res, next) {
  debug('findORBook Service');
  var params = req.body;
  if(!_.isEmpty(params.bookName) && !_.isEmpty(params.bookAuthor)) {
    /*Show Book by Book Author OR Book Name.*/
    bookModel.findByFilter({ $or: [ { bookName: params.bookName }, { bookAuthor: params.bookAuthor } ] }, function (error, result) {
      if (!_.isEmpty(error)) {
        return next(error);
      }
      req.session.bookStore = result;
      return next();
    });
  }
  if(_.isEmpty(params)) {
    /*Show Book which Released Year is 2015 & 2001. */
    bookModel.findByFilter({ $or: [ { bookReleasedYear: 2015 }, { bookReleasedYear: 2001 } ] }, function (error, result) {
      if (!_.isEmpty(error)) {
        return next(error);
      }
      req.session.bookStore = result;
      return next();
    });
  }
};

/*Show Book by Having pages More than 100. */
/* make API to get book by book page no */
exports.findBookByPageNo = function (req, res, next) {
  debug('find books by page no service');
  bookModel.findByFilter( {bookPageNo : {$gt : 100}}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = result;
    return next();
  });
};

/*Show Book by Having pages Less than 90 & More than 25. */
/* make API to get book by book between page no */
exports.findBookBWPages = function (req, res, next) {
  debug('findBookBWPages service');
  bookModel.findByFilter( {bookPageNo : { $gt :  25, $lt : 90}}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = result;
    return next();
  });
};

/*Show Book by Having pages Less than 90 & More than 25 & but not 80 Pages. */
/* make API to get book by book between page no but ot equal some pages */
exports.findBookNEPages = function (req, res, next) {
  debug('findBookNEPages service');
  bookModel.findByFilter( {bookPageNo : { $gt :  25, $lt : 90, $ne: 80}}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = result;
    return next();
  });
};

/*Show Book by having pages zero Pages. */
/* make API to get book by book page no is zero */
exports.findZeroPages = function (req, res, next) {
  debug('findZeroPages service');
  bookModel.findByFilter( {bookPageNo : { $eq : 0}}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = result;
    return next();
  });
};

/*Show Book which Released Year is 2015.*/
/* make API to get book by book year*/
exports.findBookByYear = function (req, res, next) {
  debug('findBookByYear service');
  bookModel.findByFilter({bookReleasedYear: 2015}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = result;
    return next();
  });
};

/*Sort Book by Book Name. */
/* make API to sort book by book Name*/
exports.sortBookByName = function (req, res, next) {
  debug('sortBookByName service');
  bookModel.findAllByFilter({sort: {bookName: 1}}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = result;
    return next();
  });
};

/*Sort Book by Book Price. */
/* make API to sort book by book Price*/
exports.sortBookByPrice = function (req, res, next) {
  debug('sortBookByPrice service');
    bookModel.findAllByFilter({sort: {bookPrice: 1}}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = result;
    return next();
  });
};

/* Sort Book by Book Author. */
/* make API to sort book by book Author*/
exports.sortBookByAuthor = function (req, res, next) {
  debug('sortBookByAuthor service');
    bookModel.findAllByFilter({sort: {bookAuthor: 1}}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = result;
    return next();
  });
};

/*Sort Book by Book No Of Pages. */
/* make API to sort book by book Page No*/
exports.sortBookByPagesNo = function (req, res, next) {
  debug('sortBookByPagesNo service');
    bookModel.findAllByFilter({sort: {bookPageNo: 1}}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = result;
    return next();
  });
};

/*Sort Book by Book Category. */
/* make API to sort book by book Category*/
exports.sortBookByCategory = function (req, res, next) {
  debug('sortBookByCategory service');
    bookModel.findAllByFilter({sort: {bookCategory: 1}}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = result;
    return next();
  });
};

/*Sort Book by Book Released Year. */
/* make API to sort book by book Release Year*/
exports.sortBookByRelease = function (req, res, next) {
  debug('sortBookByRelease service');
    bookModel.findAllByFilter({sort: {bookReleasedYear: 1}}, function (error, result) {
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = result;
    return next();
  });
};

/*Show book name having highest price*/
/* make API to sort book by book having highest price */
exports.findNameByPrice = function (req, res, next) {
  debug('findNameByPrice service');
    var getPriceData = '';
    bookModel.findAllByFilter({sort: {bookPrice: -1}, limit: 1}, function (error, result) {
      getPriceData = result[0];
      if (!_.isEmpty(error)) {
        return next(error);
      }
      // var array = [];
      // array.push(getPriceData.bookName);
      req.session.bookStore = getPriceData;
      return next();
    });
};

/*Show book name having highest price but lowest number of page*/
/* make API to sort book by book having highest price */
exports.findNameWithHL = function (req, res, next) {
  debug('findNameWithHL service');
    var getPriceData = '';
    bookModel.findAllByFilter({sort: {bookPrice: -1, bookPageNo: 1}, limit: 1}, function (error, result) {
    getPriceData = result[0];
    if (!_.isEmpty(error)) {
      return next(error);
    }
    req.session.bookStore = getPriceData;
    return next();
  });
};

exports.getAllCategory = function (req, res, next) {
  // debug('Inside getAll service.');
    bookModel.distinctFilter("bookCategory", function (error, result) {
      // debug('Inside getAll service....1', result);
      if (!_.isEmpty(error)) {
        // debug('error', error);
        return next(error);
      }
      req.session.bookStore = result;
      return next();
    });
};

exports.multiSelectCategory = function (req, res, next) {
  debug('Inside multiSelect service.');
};
