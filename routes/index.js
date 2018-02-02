var express = require('express');
var router = express.Router();

var bookStoreRoutes = require('./BookStoreRoutes');


// # BookStoreRoutes Route
router.use('/book',bookStoreRoutes);


module.exports = router;
