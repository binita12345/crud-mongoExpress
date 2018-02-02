var express = require('express');
var router = express.Router();

var booksService = require('../services/BookStoreServices');
var booksController = require('../controllers/BookStoreController');


//#1.add book store
router.post('/addbook', [
  booksService.validateAddBook,
  booksService.addBookStores,
  booksController.addBookStoreData
]);

//#2.GetAll
router.post('/getAll', [
  booksService.getAll,
  booksController.getAllBooksData
]);

//#2.GetAllCat
router.post('/getAllCat', [
  booksService.getAllCategory,
  booksController.getAllCategoryData
]);

//#2.Multi select
router.post('/multiSelect', [
  booksService.multiSelectCategory,
  booksController.multiSelectCategoryData
]);


//#3.getById
router.post('/getById', [
  booksService.findOneBook,
  booksController.findOneBooksData
]);

//#4.GetAllForTable
router.post('/getAllForTable', [
  booksService.getAllForTable,
  booksController.getAllForTableBook
]);

//#5.delete
router.post('/delete', [
  booksService.deleteBook,
  booksController.deleteBookData
]);

//#6.delete with or
router.post('/deleteByID', [
  booksService.deleteByBookID,
  booksController.deleteByBookIDData
]);

//#7.delete with or
router.post('/deleteWithOR', [
  booksService.deleteWithORBook,
  booksController.deleteWithORBookData
]);

//#8.update
router.post('/updateById', [
  booksService.updateBookById,
  booksController.updateBookIdData
]);

//#9.update
router.post('/updateBySearch', [
  booksService.updateBookBySearchId,
  booksController.updateBookSearchIdData
]);

//#10.update by name
router.post('/updateByName', [
  booksService.updateBookByName,
  booksController.updateBookNameData
]);

//#11.update by name
router.post('/updateByNameNAuth', [
  booksService.updateByNameNAuthor,
  booksController.updateNameNAuthorData
]);

//#12.find by name
router.post('/findBy', [
  booksService.findBook,
  booksController.findBookData
]);

//13.find by name
router.post('/findWithOR', [
  booksService.findORBook,
  booksController.findORBookData
]);

//#14.find by page no
router.post('/findByPageNo', [
  booksService.findBookByPageNo,
  booksController.findBookPageNoData
]);

//#15.find by between page no
router.post('/findBWPages', [
  booksService.findBookBWPages,
  booksController.findBookBWPagesData
]);

//#16.find by between page no but not equal
router.post('/findByNEPages', [
  booksService.findBookNEPages,
  booksController.findBookNEPagesData
]);

//#17.find by zero page
router.post('/findByZero', [
  booksService.findZeroPages,
  booksController.findZeroPagesData
]);

//#18.find by year
router.post('/findByYear', [
  booksService.findBookByYear,
  booksController.findBookYear
]);

//#19.sort Docs name
router.post('/sortName', [
  booksService.sortBookByName,
  booksController.sortBookNameData
]);

//#20.sort Docs price
router.post('/sortPrice', [
  booksService.sortBookByPrice,
  booksController.sortBookPriceData
]);


//#21.sort Docs Author
router.post('/sortAuthor', [
  booksService.sortBookByAuthor,
  booksController.sortBookAuthorData
]);

//#22.sort Docs No of Pages
router.post('/sortPagesNo', [
  booksService.sortBookByPagesNo,
  booksController.sortBookPagesNoData
]);

//#23.sort Docs Category
router.post('/sortCategory', [
  booksService.sortBookByCategory,
  booksController.sortBookCategoryData
]);

//#24.sort Docs Released Year
router.post('/sortRelease', [
  booksService.sortBookByRelease,
  booksController.sortBookReleaseData
]);

//#25.Show book name having highest price
router.post('/nameByPrice', [
  booksService.findNameByPrice,
  booksController.findNameByPriceData
]);

//#26.Show book name having highest price n lowest page
router.post('/nameByHL', [
  booksService.findNameWithHL,
  booksController.findNameWithHLData
]);


module.exports = router;
